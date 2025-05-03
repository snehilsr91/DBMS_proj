const bcrypt = require('bcrypt');
const password = 'admin123';

bcrypt.hash(password, 10, function(err, hashedPassword) {
  console.log(hashedPassword);  // Use this hashed password to insert into your DB
});
