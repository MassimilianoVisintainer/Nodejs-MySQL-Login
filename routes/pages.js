const express = require('express')
const verifyToken = require('../controllers/verifyToken');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index')
});

router.get('/register', (req, res) => {
    res.render('register')
});

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/homepage', verifyToken, (req, res) => {
    res.render('homepage');
})

router.get('/logout', (req, res) => {
    // Clear the token cookie by setting it to an empty string and an immediate expiration
    res.cookie('token', '', { expires: new Date(0) });
    res.redirect('/login');
});

module.exports = router;