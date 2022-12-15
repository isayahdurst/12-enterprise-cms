const app = require('express').Router();
const mysql = require('mysql2');
const { Promise } = require('util');
require('dotenv').config;

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.mysql,
    database: process.env.database,
});

// Adds Department to database
app.post('/add', async (req, res) => {
    const { departmentName } = req.body;

    connection.query(
        'INSERT INTO departments (name) VALUES (?)',
        departmentName,
        (err) => {
            if (err) throw err;
            res.send('Department added to database!');
        }
    );
});

app.delete('/delete', (req, res) => {
    const { id } = req.body;
    const statement = 'DELETE FROM departments WHERE id = ?';

    connection.query(statement, id, (err, result) => {
        if (err) throw err;
        res.json('Department has been removed from the database.');
    });
});

app.get('/:departmentName', (req, res) => {
    console.log(req.params);
    connection.query(
        'select (id) from departments where name = (?)',
        req.params.departmentName,
        (err, result) => {
            if (err) throw err;
            res.json(result);
        }
    );
});

module.exports = app;
