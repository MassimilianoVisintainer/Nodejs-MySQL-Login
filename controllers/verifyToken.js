const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');

dotenv.config({
  path: './.env'
});

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Get the token from the cookie

  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, process.env.SECURITY_KEY, (err, decoded) => {
    if (err) {
      console.error(err);
      // Optionally, clear the token cookie here as well if it's invalid
      res.cookie('token', '', { expires: new Date(0) });
      return res.redirect('/login'); // Redirect to the login page if the token is invalid
    }

    req.userId = decoded.userId; // Attach the decoded user ID to the request object
    next(); // Continue to the protected route
  });
};

module.exports = verifyToken;
