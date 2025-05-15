const express = require('express');
const db = require('./db');
const bcrypt = require('bcryptjs');
const path = require('path');
const router = express.Router();
const multer = require('multer');
const fs= require('fs');
const mysql = require('mysql2/promise');

// Serve static HTML pages
router.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
router.get('/student-login', (req, res) => res.sendFile(path.join(__dirname, 'public/student_auth.html')));
router.get('/club-login', (req, res) => res.sendFile(path.join(__dirname, 'public/club_auth.html')));
router.get('/admin-login', (req, res) => res.sendFile(path.join(__dirname, 'public/admin_login.html')));
router.get('/student-register', (req, res) => res.sendFile(path.join(__dirname, 'public/student_auth.html')));
router.get('/club-register', (req, res) => res.sendFile(path.join(__dirname, 'public/club_auth.html')));

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
        res.redirect('/student-login');
    });
});

router.post('/club-register', (req, res) => {
    const { name, club_id, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.send('Error');
        db.query('INSERT INTO club_requests (name, club_id, password) VALUES (?, ?, ?)', [name, club_id, hashedPassword], () => {
            res.redirect('/club-login');
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
        
        db.query('SELECT * FROM resource_requests', (err3, resources) => {
          if (err3) return res.send('Error');
          res.json({ students, clubs, resources });
        });
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

// Fetch questions with dynamic count
router.get('/start-test', (req, res) => {
    const testType = req.query.testType;
    const count = parseInt(req.query.count) || 10;
    const user = req.session.user;
    
    if (!user || !user.branch) {
        console.error('User not logged in or branch missing');
        return res.status(401).send('Unauthorized');
    }

    const branch = user.branch;
    let table = testType === 'technical' ? 'technical_questions' : 'hr_questions';

    const query = `SELECT * FROM ${table} WHERE branch = ? ORDER BY RAND() LIMIT ?`;

    db.query(query, [branch, count], (err, results) => {
        if (err) {
            console.error('Error fetching questions:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

router.post('/submit-answers', (req, res) => {
    const { testType, answers, totalQuestions } = req.body;
    const usn = req.session.user.usn;
    const table = testType === 'technical' ? 'technical_questions' : 'hr_questions';

    // Validate input
    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Invalid answers format' });
    }

    const ids = answers.map(a => a.question_id);
    if (ids.length === 0) {
        return res.status(400).json({ error: 'No answers submitted' });
    }

    const query = `SELECT id, correct_answer FROM ${table} WHERE id IN (?)`;

    db.query(query, [ids], (err, results) => {
        if (err) {
            console.error('Error checking answers:', err);
            return res.status(500).json({ error: 'Error checking answers' });
        }

        let score = 0;
        let correctAnswers = 0;
        let attempted = 0;

        answers.forEach(answer => {
            const question = results.find(q => q.id === answer.question_id);
            if (!question) return;

            if (answer.selected) {
                attempted++;
                if (answer.selected === `option_${question.correct_answer}`) {
                    score++;
                    correctAnswers++;
                }
            }
        });

        // Store answers in session
        req.session.testResults = {
            answers,
            testType,
            questionIds: ids
        };

        // Insert only the test result summary
        const insert = `INSERT INTO mock_test_results 
                       (usn, test_type, score, attempted_questions, correct_answers, total_questions, timestamp) 
                       VALUES (?, ?, ?, ?, ?, ?, NOW())`;
        
        db.query(insert, 
            [usn, testType, score, attempted, correctAnswers, totalQuestions || answers.length], 
            (err2, result) => {
                if (err2) {
                    console.error('Error saving result:', err2);
                    return res.status(500).json({ error: 'Error saving result' });
                }
                res.json({ resultId: result.insertId });
            }
        );
    });
});

// Update your /api/result route
router.get('/api/result', (req, res) => {
    const { id } = req.query;
    
    // First get the test result
    db.query('SELECT * FROM mock_test_results WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'Result not found' });
        }

        const result = results[0];
        
        // Check if we have session data for this test
        if (!req.session.testResults || !req.session.testResults.questionIds) {
            return res.json(result); // Return basic result if no session data
        }

        // Get questions from database
        const table = result.test_type === 'technical' ? 'technical_questions' : 'hr_questions';
        
        db.query(`
            SELECT id, question_text, option_A, option_B, option_C, option_D, correct_answer
            FROM ${table}
            WHERE id IN (?)
        `, [req.session.testResults.questionIds], (err, questions) => {
            if (err) {
                console.error('Error fetching questions:', err);
                return res.json(result); // Return basic result if error
            }

            // Match questions with answers from session
            const questionsWithAnswers = questions.map(q => {
                const answer = req.session.testResults.answers.find(a => a.question_id === q.id);
                return {
                    question_id: q.id,
                    question_text: q.question_text,
                    options: {
                        A: q.option_A,
                        B: q.option_B,
                        C: q.option_C,
                        D: q.option_D
                    },
                    selected: answer ? answer.selected : null,
                    correct_answer: `option_${q.correct_answer}`,
                    is_correct: answer ? answer.selected === `option_${q.correct_answer}` : false
                };
            });

            res.json({
                ...result,
                questions: questionsWithAnswers
            });
        });
    });
});

// Serve result page
router.get('/result', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/result.html'));
});



router.get('/resources', (req, res) => {
    if (!req.session.user || req.session.user.type !== 'student') {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'public/learning-resources.html'));
});

// API to get subjects for the logged-in student's branch
router.get('/api/subjects', (req, res) => {
    if (!req.session.user) return res.status(401).send('Unauthorized');
    const branch = req.session.user.branch;

    db.query('SELECT * FROM subjects WHERE branch = ?', [branch], (err, results) => {
        if (err) return res.status(500).send('DB error');
        res.json(results);
    });
});

// API to get resources for a subject
router.get('/api/resources', (req, res) => {
    const { subjectId } = req.query;
    db.query('SELECT * FROM resources WHERE subject_id = ?', [subjectId], (err, results) => {
        if (err) return res.status(500).send('DB error');
        res.json(results);
    });
});

// API to handle resource contribution submissions
router.post('/api/contribute', (req, res) => {
    const { subjectId, title, type, link } = req.body;

    if (!subjectId || !title || !type || !link) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Insert the suggestion into the resource_requests table
    db.query('INSERT INTO resource_requests (subject_id, title, type, link) VALUES (?, ?, ?, ?)', [subjectId, title, type, link], (err) => {
        if (err) {
            console.error('Error saving suggestion:', err);
            return res.status(500).json({ error: 'Error submitting suggestion.' });
        }
        res.status(200).json({ message: 'Resource suggestion submitted for review.' });
    });
});

// Approve resource suggestion
router.post('/approve-resource', (req, res) => {
    const { id } = req.body;
    db.query('SELECT * FROM resource_requests WHERE id = ?', [id], (err, result) => {
      if (err || result.length === 0) return res.send('Resource not found');
      const resource = result[0];
      // You can insert the approved resource into another table if needed (e.g., resources table)
      db.query('INSERT INTO resources (subject_id, title, type, link) VALUES (?, ?, ?, ?)', [resource.subject_id, resource.title, resource.type, resource.link], () => {
        db.query('DELETE FROM resource_requests WHERE id = ?', [id], () => res.redirect('/admin-home'));
      });
    });
  });
  
  // Reject resource suggestion
  router.post('/reject-resource', (req, res) => {
    db.query('DELETE FROM resource_requests WHERE id = ?', [req.body.id], () => res.redirect('/admin-home'));
  });

// Show club announcements page
router.get('/manage-announcements', (req, res) => {
    if (!req.session.club) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'public/manage_announcements.html'));
});

// Create announcement
router.post('/create-announcement', (req, res) => {
    const { title, content } = req.body;
    const clubId = String(req.session.club.club_id);  // Ensure clubId is a string and use club_id

    db.query('INSERT INTO club_announcements (club_id, title, content, created_at) VALUES (?, ?, ?, NOW())',
        [clubId, title, content], (err) => {
        if (err) {
            console.error('Error inserting announcement:', err);  // Log the error for debugging
            return res.status(500).send('DB error');
        }
        res.redirect('/manage-announcements');
    });
});

// Edit announcement
router.post('/edit-announcement', (req, res) => {
    const { id, title, content } = req.body;
    const clubId = String(req.session.club.club_id);  // Ensure clubId is a string and use club_id

    db.query('UPDATE club_announcements SET title = ?, content = ? WHERE id = ? AND club_id = ?',
        [title, content, id, clubId], (err) => {
        if (err) return res.status(500).send('DB error');
        res.redirect('/manage-announcements');
    });
});

// Delete announcement
router.post('/delete-announcement', (req, res) => {
    const { id } = req.body;
    const clubId = String(req.session.club.club_id);  // Ensure clubId is a string and use club_id

    db.query('DELETE FROM club_announcements WHERE id = ? AND club_id = ?', [id, clubId], (err) => {
        if (err) return res.status(500).send('DB error');
        res.redirect('/manage-announcements');
    });
});

// Fetch announcements via AJAX (optional)
router.get('/api/club-announcements', (req, res) => {
    const clubId = String(req.session.club.club_id);  // Ensure clubId is a string and use club_id
    db.query('SELECT * FROM club_announcements WHERE club_id = ?', [clubId], (err, results) => {
        if (err) return res.status(500).json({ error: 'DB error' });
        res.json(results);
    });
});

// Show activities management page
router.get('/manage-activities', (req, res) => {
    if (!req.session.club) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'public/manage_activities.html'));
});

// Create activity
router.post('/create-activity', (req, res) => {
    const { title, link } = req.body;
    const clubId = String(req.session.club.club_id);  // Ensure clubId is a string and use club_id

    db.query('INSERT INTO club_activities (club_id, title, link, created_at) VALUES (?, ?, ?, NOW())',
        [clubId, title, link], (err) => {
        if (err) return res.status(500).send('DB error');
        res.redirect('/manage-activities');
    });
});

// Edit activity
router.post('/edit-activity', (req, res) => {
    const { id, title, link } = req.body;
    const clubId = String(req.session.club.club_id);  // Ensure clubId is a string and use club_id

    db.query('UPDATE club_activities SET title = ?, link = ? WHERE id = ? AND club_id = ?',
        [title, link, id, clubId], (err) => {
        if (err) return res.status(500).send('DB error');
        res.redirect('/manage-activities');
    });
});

// Delete activity
router.post('/delete-activity', (req, res) => {
    const { id } = req.body;
    const clubId = String(req.session.club.club_id);  // Ensure clubId is a string and use club_id

    db.query('DELETE FROM club_activities WHERE id = ? AND club_id = ?', [id, clubId], (err) => {
        if (err) return res.status(500).send('DB error');
        res.redirect('/manage-activities');
    });
});

// Get all activities
router.get('/api/club-activities', (req, res) => {
    const clubId = String(req.session.club.club_id);  // Ensure clubId is a string and use club_id
    db.query('SELECT * FROM club_activities WHERE club_id = ?', [clubId], (err, results) => {
        if (err) return res.status(500).json({ error: 'DB error' });
        res.json(results);
    });
});


// Define upload directory with absolute path
const uploadDir = path.join(__dirname, 'public', 'uploads');

// Verify directory exists or create it
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
} else {
    console.log('Upload directory exists');
}

// Verify write permissions
fs.access(uploadDir, fs.constants.W_OK, (err) => {
    if (err) {
        console.error('No write permissions to upload directory:', err);
    } else {
        console.log('Write permissions confirmed');
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            console.log('Rejected file type:', file.mimetype);
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Get club profile data
router.get('/api/club/profile', (req, res) => {
    if (!req.session.club) {
        return res.status(401).json({ 
            success: false,
            error: 'Unauthorized' 
        });
    }
    
    const clubId = req.session.club.club_id;

    db.query(
        `SELECT id, name, club_id, description, 
                contact_email, logo_url, president_usn, website
         FROM clubs WHERE club_id = ?`, 
        [clubId], 
        (err, clubResults) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Database error loading club info'
                });
            }
            
            if (clubResults.length === 0) {
                return res.status(404).json({ 
                    success: false,
                    error: 'Club not found'
                });
            }

            const clubData = clubResults[0];

            db.query(`
                SELECT cm.id, cm.role, cm.join_date, s.usn, s.name, s.branch
                FROM club_members cm
                JOIN students s ON cm.usn = s.usn
                WHERE cm.club_id = ?
                ORDER BY 
                    CASE cm.role 
                        WHEN 'President' THEN 1
                        WHEN 'Lead' THEN 2
                        WHEN 'Core' THEN 3
                        ELSE 4
                    END, s.name
            `, [clubId], (err, memberResults) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ 
                        success: false,
                        error: 'Database error loading members'
                    });
                }

                res.json({
                    success: true,
                    club: clubData,
                    members: memberResults || []
                });
            });
        }
    );
});

// Get president's name
router.get('/api/club/president-name', (req, res) => {
    if (!req.session.club) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const clubId = req.session.club.club_id;
    
    db.query(`
        SELECT s.name 
        FROM club_members cm
        JOIN students s ON cm.usn = s.usn
        WHERE cm.club_id = ? AND cm.role = 'President'
        LIMIT 1
    `, [clubId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.json({ name: 'No President' });
        }
        
        res.json({ name: results[0].name });
    });
});

// Update club profile
router.post('/api/club/update-profile', upload.single('logo'), (req, res) => {

    console.log('Session data:', req.session); // Add this line
    console.log('Club session:', req.session.club); // Add this line
    
    if (!req.session.club) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const clubId = req.session.club.club_id;
    console.log('Updating profile for club:', clubId); // Add this line
    console.log('Upload completed. File info:', req.file); // Should show path, size, etc.
    
    if (req.file) {
        console.log('Verifying file exists at:', path.join(uploadDir, req.file.filename));
        fs.access(path.join(uploadDir, req.file.filename), fs.constants.F_OK, (err) => {
            if (err) {
                console.error('Uploaded file not found!', err);
            } else {
                console.log('File verified in upload directory');
            }
        });
    }
    if (!req.session.club) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { 
        club_name, 
        contact_email, 
        website, 
        description, 
        president_usn,
        existing_logo
    } = req.body;

    let logo_url = existing_logo;
    
    if (req.file) {
        logo_url = `/uploads/${req.file.filename}`;
        
        // Delete old logo if exists
        if (existing_logo && existing_logo !== logo_url) {
            const oldLogoPath = path.join(__dirname, '..', 'public', existing_logo);
            console.log('Attempting to delete old logo at:', oldLogoPath); // Debug
            
            if (fs.existsSync(oldLogoPath)) {
                fs.unlink(oldLogoPath, (err) => {
                    if (err) {
                        console.error('Error deleting old logo:', err);
                    } else {
                        console.log('Successfully deleted old logo');
                    }
                });
            }
        }
    }

    db.query(
        `UPDATE clubs SET 
            name = ?, 
            contact_email = ?, 
            website = ?, 
            description = ?,
            president_usn = ?,
            logo_url = ?
        WHERE club_id = ?`,
        [
            club_name, 
            contact_email, 
            website, 
            description,
            president_usn,
            logo_url,
            clubId
        ],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                
                if (req.file) {
                    const filePath = path.join(uploadDir, req.file.filename);
                    fs.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) console.error('Error cleaning up uploaded file:', unlinkErr);
                    });
                }
                
                return res.status(500).json({ 
                    success: false,
                    error: 'Database error updating profile',
                    details: err.message 
                });
            }
            
            console.log('Database update successful. Rows affected:', result.affectedRows);
            
            res.json({ 
                success: true, 
                message: 'Profile updated successfully',
                logo_url: logo_url,
                debug: {
                    fileSaved: req.file ? true : false,
                    oldLogoDeleted: existing_logo && existing_logo !== logo_url
                }
            });
        }
    );
});

// Check if student exists
router.get('/api/student/check', (req, res) => {
    const { usn } = req.query;

    if (!usn) return res.status(400).json({ error: 'Missing USN' });

    db.query(
        'SELECT name, branch FROM students WHERE LOWER(usn) = LOWER(?)',
        [usn],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });

            if (results.length === 0) {
                return res.json({ exists: false });
            }

            res.json({
                exists: true,
                name: results[0].name,
                branch: results[0].branch
            });
        }
    );
});


// Add member to club
router.post('/api/club/add-member', (req, res) => {
    if (!req.session.club) return res.status(401).json({ error: 'Unauthorized' });
    
    const { usn, role } = req.body;
    const clubId = req.session.club.club_id;

    // First, check if the student exists
    db.query('SELECT * FROM students WHERE LOWER(usn) = LOWER(?)', [usn], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Now, check if the student is already a member
        db.query(
            `INSERT INTO club_members (club_id, usn, role) 
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE role = VALUES(role)`,
            [clubId, usn, role],
            (err) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }

                res.json({
                    success: true,
                    message: 'Member added successfully',
                    member: { usn, role }
                });
            }
        );
    });
});


// Remove member from club
router.post('/api/club/remove-member', (req, res) => {
    if (!req.session.club) return res.status(401).json({ error: 'Unauthorized' });

    const { usn } = req.body;
    const clubId = req.session.club.club_id;

    db.query(
        `DELETE FROM club_members 
         WHERE club_id = ? AND usn = ?`,
        [clubId, usn],
        (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true });
        }
    );
});

// Serve edit club profile page
router.get('/edit-club-profile', (req, res) => {
    if (!req.session.club) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'public/edit_club_profile.html'));
});

// Updated /api/club-data route with logging
router.get('/api/club-data', (req, res) => {
    
    const activitiesQuery = 'SELECT * FROM club_activities ORDER BY created_at DESC';
    const announcementsQuery = 'SELECT * FROM club_announcements ORDER BY created_at DESC';

    db.query(activitiesQuery, (err, activities) => {
        if (err) {
            console.error('Error fetching activities:', err);
            return res.status(500).json({ error: 'Failed to fetch activities' });
        }

        db.query(announcementsQuery, (err, announcements) => {
            if (err) {
                console.error('Error fetching announcements:', err);
                return res.status(500).json({ error: 'Failed to fetch announcements' });
            }

            db.query('SELECT club_id, name, description, logo_url, website, contact_email FROM clubs', (err, clubs) => {
                if (err) {
                    console.error('Error fetching clubs:', err);
                    return res.status(500).json({ error: 'Failed to fetch clubs' });
                }

                const clubMap = {};
                clubs.forEach(club => {
                    clubMap[club.club_id] = club;
                });

                // Add club info to each activity and announcement
                const enrichedActivities = activities.map(a => ({
                    ...a,
                    club_name: clubMap[a.club_id]?.name || 'Unknown Club',
                    club_logo: clubMap[a.club_id]?.logo_url,
                    club_website: clubMap[a.club_id]?.website
                }));

                const enrichedAnnouncements = announcements.map(a => ({
                    ...a,
                    club_name: clubMap[a.club_id]?.name || 'Unknown Club',
                    club_logo: clubMap[a.club_id]?.logo_url
                }));

                res.json({ 
                    activities: enrichedActivities, 
                    announcements: enrichedAnnouncements,
                    clubs: clubs // Include all clubs in the response
                });
            });
        });
    });
});

// Add this new route for fetching club profile data
router.get('/api/club/:club_id', (req, res) => {
    const clubId = req.params.club_id;

    db.query(
        `SELECT id, name, club_id, description, 
                contact_email, logo_url, president_usn, website
         FROM clubs WHERE club_id = ?`, 
        [clubId], 
        (err, clubResults) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Database error loading club info'
                });
            }
            
            if (clubResults.length === 0) {
                return res.status(404).json({ 
                    success: false,
                    error: 'Club not found'
                });
            }

            const clubData = clubResults[0];

            db.query(`
                SELECT cm.id, cm.role, cm.join_date, s.usn, s.name, s.branch
                FROM club_members cm
                JOIN students s ON cm.usn = s.usn
                WHERE cm.club_id = ?
                ORDER BY 
                    CASE cm.role 
                        WHEN 'President' THEN 1
                        WHEN 'Lead' THEN 2
                        WHEN 'Core' THEN 3
                        ELSE 4
                    END, s.name
            `, [clubId], (err, memberResults) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ 
                        success: false,
                        error: 'Database error loading members'
                    });
                }

                res.json({
                    success: true,
                    club: clubData,
                    members: memberResults || []
                });
            });
        }
    );
});

// Serve the frontend HTML
router.get('/club-activities', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'club-activities.html'));
});



// ==================== PERFORMANCE ANALYTICS ROUTES ====================

// Helper functions for performance analytics
function calculateAnalytics(testRows) {
    // Calculate percentage for each test
    const testsWithPercentage = testRows.map(test => ({
      ...test,
      score: (test.correct_answers / test.total_questions) * 100
    }));
  
    return {
      totalTests: testsWithPercentage.length,
      averageScore: testsWithPercentage.reduce((acc, curr) => acc + curr.score, 0) / (testsWithPercentage.length || 1),
      bestScore: testsWithPercentage.length > 0 ? Math.max(...testsWithPercentage.map(t => t.score)) : 0,
      testHistory: testsWithPercentage,
      technicalAverage: testsWithPercentage.filter(t => t.test_type === 'technical')
                         .reduce((acc, curr, i, arr) => arr.length ? acc + curr.score/arr.length : 0, 0),
      hrAverage: testsWithPercentage.filter(t => t.test_type === 'hr')
                   .reduce((acc, curr, i, arr) => arr.length ? acc + curr.score/arr.length : 0, 0)
    };
  }
  
  function getDefaultProfile(usn) {
    return {
      student: {
        name: "New Student",
        usn: usn,
        branch: "CSE",
        dob: "2000-01-01"
      },
      clubs: [],
      analytics: {
        totalTests: 0,
        averageScore: 0,
        bestScore: 0,
        testHistory: [],
        technicalAverage: 0,
        hrAverage: 0
      },
      subjects: [
        { id: 1, name: "Data Structures", proficiency: null },
        { id: 2, name: "Algorithms", proficiency: null }
      ]
    };
  }
  
  // Get student profile data
  router.get('/api/student-profile', async (req, res) => {
    // Get USN from session instead of URL params
    const usn = req.session.user?.usn;
    console.log(`[Student Profile] Starting fetch for session USN: ${usn}`);
  
    if (!usn) {
      console.log('[Student Profile] No user session or USN found');
      return res.status(401).json({ 
        error: 'Unauthorized - Please login first'
      });
    }
  
    try {
      console.log('[Student Profile] Querying student data...');
      const [studentRows] = await db.promise().query(
        'SELECT name, usn, branch, dob FROM students WHERE usn = ?', 
        [usn]
      );
      
      if (!studentRows.length) {
        console.log('[Student Profile] Student not found - creating default response');
        return res.json(getDefaultProfile(usn));
      }
  
      const student = studentRows[0];
      console.log('[Student Profile] Found student:', student.name);
  
      const [clubRows] = await db.promise().query(
        `SELECT c.name, c.club_id, IFNULL(cm.role, 'Volunteer') as role, c.logo_url 
         FROM club_members cm
         JOIN clubs c ON cm.club_id = c.club_id
         WHERE cm.usn = ?`,
        [usn]
      );

      const [testRows] = await db.promise().query(
        'SELECT * FROM mock_test_results WHERE usn = ? ORDER BY timestamp DESC',
        [usn]
      );
  
      const analytics = calculateAnalytics(testRows);
  
      const [subjectRows] = await db.promise().query(
        `SELECT s.id, s.name, sp.proficiency 
         FROM subjects s
         LEFT JOIN student_subject_proficiency sp ON s.id = sp.subject_id AND sp.usn = ?
         WHERE s.branch = ?
         GROUP BY s.id`,  // Add GROUP BY to prevent duplicates
        [usn, student.branch]
      );
  
      res.json({
        student,
        clubs: clubRows,
        analytics,
        subjects: subjectRows
      });
  
    } catch (err) {
      console.error('[Student Profile] Error:', err);
      res.status(500).json({ 
        error: 'Server Error',
        details: err.message 
      });
    }
  });
  
  // Update proficiency
  router.post('/api/update-proficiency', async (req, res) => {
    const usn = req.session.user?.usn;
    const { subject_id, proficiency } = req.body;
    
    if (!usn) {
      return res.status(401).json({ error: 'Unauthorized - Please login first' });
    }
  
    try {
      if (proficiency === null) {
        // Delete the proficiency record
        const [result] = await db.promise().query(
          'DELETE FROM student_subject_proficiency WHERE usn = ? AND subject_id = ?',
          [usn, subject_id]
        );
      } else {
        // Update or insert the proficiency
        const [result] = await db.promise().query(
          `INSERT INTO student_subject_proficiency (usn, subject_id, proficiency)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE proficiency = VALUES(proficiency)`,
          [usn, subject_id, proficiency]
        );
      }
  
      res.json({ success: true });
    } catch (err) {
      console.error('Error updating proficiency:', err);
      res.status(500).json({ 
        error: 'Update failed',
        details: err.message 
      });
    }
  });
  
  // Serve performance analytics page
  router.get('/performance-analytics', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/student-login');
    }
    res.sendFile(path.join(__dirname, 'public', 'performance-analytics.html'));
  });

module.exports = router;
