const express = require('express');
const routes = require('./routes');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(routes);

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.mysql,
    database: process.env.database,
});

// Views all items from departments, roles, and employees
app.get('/api/viewAll', async (req, res) => {
    console.log('View All Called...');
    const { type } = req.query;
    // TODO: Sanitize type to prevent unauthorized queries.

    connection.query(`select * from ${type}`, function (err, result) {
        // View all [departments, roles, employees]
        if (err) throw err;
        res.json(result);
    });
});

// Adds role to database
app.post('/api/addRole', (req, res) => {
    const { title, salary, departmentID } = req.body;
    console.log(title, salary, departmentID);

    connection.query(
        'INSERT INTO roles (title, salary, department_id) values (?,?,?)',
        [title, salary, departmentID],
        (err, result) => {
            if (err) throw err;
            res.json('Role added to database');
        }
    );
});

// Adds department to database
app.post('/api/addDepartment', (req, res) => {
    const { name } = req.body;
    connection.query(
        'INSERT INTO departments (name) VALUES (?)',
        name,
        (err, result) => {
            if (err) throw err;
            res.json('Department has been added to database');
        }
    );
});

app.listen(process.env.PORT, () => {
    console.log('App listening on port: ' + process.env.PORT);
});
