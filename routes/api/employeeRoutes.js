const app = require('express').Router();
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.mysql,
    database: process.env.database,
});

app.get('/:ID', async (req, res) => {
    const { ID } = req.params;
    console.log(ID);
    connection.query(
        'SELECT * FROM employees WHERE id = (?)',
        ID,
        (err, result) => {
            if (err) throw err;
            res.json(result);
        }
    );
});

// Saves employee to database
app.post('/add', (req, res) => {
    const { firstName, lastName, roleID, managerID } = req.body;
    connection.query(
        'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',
        [firstName, lastName, roleID, managerID],
        (err, result) => {
            if (err) throw err;
        }
    );
    connection.query('SELECT LAST_INSERT_ID()', (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// terminate employee
app.delete('/delete', (req, res) => {
    const { id } = req.body;
    const statement = 'DELETE FROM employees WHERE id = ?';
    connection.query(statement, id, (err, results) => {
        if (err) {
            throw err;
        }
        res.json('Employee has been removed from database');
    });
});

// Updates employee manager
app.put('/update', (req, res) => {
    const { ID, managerID } = req.body;

    connection.query(
        'update employees set manager_id = (?) where id = (?)',
        [managerID, ID],
        (err, result) => {
            if (err) throw err;
            res.json('Manager has been updated.');
        }
    );
});

module.exports = app;
