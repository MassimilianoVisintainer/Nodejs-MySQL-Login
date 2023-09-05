const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")

dotenv.config({
  path: './.env'
});

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

exports.register = (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  db.query('SELECT email from users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
    }

    if (results.length > 0) {
      return res.render('register', {
        message: 'That email is already in use'
      });
    } else if (password !== passwordConfirm) {
      return res.render('register', {
        message: 'Password do not match'
      });
    }

    let hashedPassword = await bcrypt.hash(password, 8);
    db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {

      if (error) {
        console.log(error);
      } else {
        return res.render('register', {
          message: 'User registered'
        });
      }
    })
  })
}

exports.login = async (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', email, async (error, results) => {
    if (error) {
      console.log(error);
    }

    if (results.length == 0) {
      return res.render('login', {
        message: 'Invalid email or password'
      });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.render('login', {
        message: 'Password is wrong'
      });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.SECURITY_KEY, { expiresIn: '1h' });

    // Send the token as a response
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Store the token in a cookie

    // Redirect or send a success response
    res.redirect('/homepage'); // Change this to your desired redirect URL

  })
}
