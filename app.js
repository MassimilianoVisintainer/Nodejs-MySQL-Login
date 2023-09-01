const express = require('express')
const mysql = require("mysql")

const app = express()

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs-login'
});

db.connect((error) => {
    if(error) {
        console.log(error);
    } else {
        console.log("MYSQL connected...");
    }
})


app.get('/', (req,res) => {
    res.send('ciao')
})

app.listen(3000, ()=>{
    console.log('Server started on 300')
})