const express = require('express')
const path = require('path')
const mysql = require("mysql")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser");

dotenv.config({
    path: './.env'
});

const app = express()

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MYSQL connected...");
    }
})

app.use(cookieParser())
const publicDirectoty = path.join(__dirname, './public') // Define where it is my css
app.use(express.static(publicDirectoty)) // Use the files included in the public directory 

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }))
// Parse JSON bodies (as sent by API Clients)
app.use(express.json());

app.set('view engine', 'hbs');

// Define routes
app.use('/', require('./routes/pages.js'))
app.use('/auth', require('./routes/auth'))

app.listen(3000, () => {
    console.log('Server started on 300')
})