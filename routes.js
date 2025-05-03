const express = require('express');
const db = require('./db');
const bcrypt = require('bcryptjs');
const path = require('path');
const router = express.Router();

// Serve static HTML pages
router.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
router.get('/student-login', (req, res) => res.sendFile(path.join(__dirname, 'public/student_login.html')));
router.get('/club-login', (req, res) => res.sendFile(path.join(__dirname, 'public/club_login.html')));
router.get('/admin-login', (req, res) => res.sendFile(path.join(__dirname, 'public/admin_login.html')));
router.get('/student-register', (req, res) => res.sendFile(path.join(__dirname, 'public/student_register.html')));
router.get('/club-register', (req, res) => res.sendFile(path.join(__dirname, 'public/club_register.html')));

// Login Routes
router.post('/student-login', (req, res) => {
    const { usn, dob } = req.body;
    db.query('SELECT * FROM students WHERE usn = ? AND dob = ?', [usn, dob], (err, results) => {
        if (err || results.length === 0) return res.send('Invalid credentials');
        req.session.user = { ...results[0], type: 'student' };
        res.redirect('/student-home');
    });
});

router.post('/club-login', (req, res) => {
    const { club_id, password } = req.body;
    db.query('SELECT * FROM clubs WHERE club_id = ?', [club_id], (err, result) => {
        if (err || result.length === 0) return res.send('Invalid login');
        bcrypt.compare(password, result[0].password, (err, match) => {
            if (!match) return res.send('Invalid password');
            req.session.club = result[0];
            res.redirect('/club-home');
        });
    });
});

router.post('/admin-login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM admin WHERE username = ?', [username], (err, result) => {
        if (err || result.length === 0) return res.send('Invalid login');
        bcrypt.compare(password, result[0].password, (err, match) => {
            if (!match) return res.send('Invalid password');
            req.session.admin = result[0];
            res.redirect('/admin-home');
        });
    });
});

// Protected pages after login
router.get('/student-home', (req, res) => {
    if (req.session.user?.type === 'student') {
        res.sendFile(path.join(__dirname, 'public/student_home.html'));
    } else {
        res.redirect('/');
    }
});

router.get('/club-home', (req, res) => {
    if (req.session.club) {
        res.sendFile(path.join(__dirname, 'public/club_home.html'));
    } else {
        res.redirect('/');
    }
});

router.get('/admin-home', (req, res) => {
    if (req.session.admin) {
        res.sendFile(path.join(__dirname, 'public/admin_home.html'));
    } else {
        res.redirect('/');
    }
});

// Registrations
router.post('/student-register', (req, res) => {
    const { name, usn, branch, dob } = req.body;
    db.query('INSERT INTO student_requests (name, usn, branch, dob) VALUES (?, ?, ?, ?)', [name, usn, branch, dob], () => {
        res.redirect('/');
    });
});

router.post('/club-register', (req, res) => {
    const { name, club_id, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.send('Error');
        db.query('INSERT INTO club_requests (name, club_id, password) VALUES (?, ?, ?)', [name, club_id, hashedPassword], () => {
            res.redirect('/');
        });
    });
});

// Admin approval system
router.get('/admin-home-data', (req, res) => {
    if (!req.session.admin) return res.redirect('/');
    db.query('SELECT * FROM student_requests', (err, students) => {
        if (err) return res.send('Error');
        db.query('SELECT * FROM club_requests', (err2, clubs) => {
            if (err2) return res.send('Error');
            res.json({ students, clubs });
        });
    });
});

router.post('/approve-student', (req, res) => {
    const { id } = req.body;
    db.query('SELECT * FROM student_requests WHERE id = ?', [id], (err, result) => {
        if (err || result.length === 0) return res.send('Not found');
        const student = result[0];
        db.query('INSERT INTO students (name, usn, branch, dob) VALUES (?, ?, ?, ?)', [student.name, student.usn, student.branch, student.dob], () => {
            db.query('DELETE FROM student_requests WHERE id = ?', [id], () => res.redirect('/admin-home'));
        });
    });
});

router.post('/reject-student', (req, res) => {
    db.query('DELETE FROM student_requests WHERE id = ?', [req.body.id], () => res.redirect('/admin-home'));
});

router.post('/approve-club', (req, res) => {
    const { id } = req.body;
    db.query('SELECT * FROM club_requests WHERE id = ?', [id], (err, result) => {
        if (err || result.length === 0) return res.send('Not found');
        const club = result[0];
        db.query('INSERT INTO clubs (name, club_id, password) VALUES (?, ?, ?)', [club.name, club.club_id, club.password], () => {
            db.query('DELETE FROM club_requests WHERE id = ?', [id], () => res.redirect('/admin-home'));
        });
    });
});

router.post('/reject-club', (req, res) => {
    db.query('DELETE FROM club_requests WHERE id = ?', [req.body.id], () => res.redirect('/admin-home'));
});

// ---------- MOCK TEST SYSTEM ----------

// Show mock test home page (select HR or Technical)
router.get('/mock-tests', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'public/mock_test.html'));
});

// Load individual test page
router.get('/technical-test', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'public/technical_test.html'));
});

router.get('/hr-test', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'public/hr_test.html'));
});

// Fetch 10 random questions for given test type and branch
router.get('/start-test', (req, res) => {
    const testType = req.query.testType;
    const user = req.session.user;
    

    if (!user || !user.branch) {
        console.error('User not logged in or branch missing');
        return res.status(401).send('Unauthorized');
    }

    const branch = user.branch;
    console.log('Branch from session:', branch);
    console.log(`Fetching ${testType} questions for branch: ${branch}`);

    let table = testType === 'technical' ? 'technical_questions' : 'hr_questions';

    const query = `SELECT * FROM ${table} WHERE branch = ? ORDER BY RAND() LIMIT 10`;

    db.query(query, [branch], (err, results) => {
        if (err) {
            console.error('Error fetching questions:', err);
            return res.status(500).send('Internal server error');
        }

        console.log(`Fetched ${results.length} questions`);
        res.json(results);
    });
});


// Store test result
router.post('/submit-answers', (req, res) => {
    const { testType, answers } = req.body;
    const usn = req.session.user.usn;
    const table = testType === 'technical' ? 'technical_questions' : 'hr_questions';

    const ids = answers.map(a => a.question_id);
    if (ids.length === 0) return res.status(400).send('No answers submitted');

    const query = `SELECT id, correct_answer FROM ${table} WHERE id IN (${ids.map(() => '?').join(',')})`;

    db.query(query, ids, (err, results) => {
        if (err) return res.status(500).send('Error checking answers');

        let score = 0;
        let correctAnswers = 0;
        let attempted = 0;

        results.forEach(q => {
            const userAnswer = answers.find(a => a.question_id === q.id)?.selected;
            if (userAnswer) {
                attempted++;
                if (userAnswer === `option_${q.correct_answer}`) {  // Compare the correct option format
                    score++;
                    correctAnswers++;
                }
            }
        });

        const insert = `INSERT INTO mock_test_results (usn, test_type, score, attempted_questions, correct_answers, timestamp) VALUES (?, ?, ?, ?, ?, NOW())`;
        db.query(insert, [usn, testType, score, attempted, correctAnswers], (err2, result) => {
            if (err2) return res.status(500).send('Error saving result');
            res.json({ resultId: result.insertId });
        });
    });
});



// Show result after test
router.get('/result', (req, res) => {
    const { id } = req.query;
    db.query('SELECT * FROM mock_test_results WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) return res.status(404).send('Result not found');
        const result = results[0];
        res.send(`
            <h2>Test Result</h2>
            <p>Test Type: ${result.test_type}</p>
            <p>Score: ${result.score} / ${result.attempted_questions}</p>
            <p>Correct Answers: ${result.correct_answers}</p>
            <p>Test Taken On: ${new Date(result.timestamp).toLocaleString()}</p>
            <a href="/student-home">Back to Home</a>
        `);
    });
});

module.exports = router;
