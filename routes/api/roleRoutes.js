const app = require('express').Router();
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.mysql,
    database: process.env.database,
});

app.post('/', (req, res) => {
    const { title, salary, departmentID } = req.body;

    connection.query(
        'INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)',
        [title, salary, departmentID],
        (err, results) => {
            if (err) throw err;
        }
    );
    res.send('Role has been added to database');
});

app.delete('/delete', (req, res) => {
    const { ID } = req.body;
    connection.query('DELETE FROM roles where id = (?)', ID, (err, result) => {
        if (err) throw err;
    });

    res.send('Role has been removed from database.');
});

module.exports = app;
