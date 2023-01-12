const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
require('dotenv').config();
const Department = require('./lib/Department');
const Employee = require('./lib/Employee');
const Role = require('./lib/Role');

/**
 * Main index file
 *
 * This file creates a connection pool to a MySQL database using the mysql library
 * and sets up an infinite loop that prompts the user for a choice of action.
 * The choice is matched to a corresponding function in the choiceTable object
 * and the function is executed with the MySQL connection pool passed as an argument.
 *
 * @author Isayah Durst
 */

(async function () {
    try {
        const pool = mysql.createPool({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        await pool.query('SELECT 1+1');

        const choiceTable = {
            'View All Departments': Department.viewAll,
            'Add Department': Department.addDepartment,
            'View Total Utilized Budgets': Department.viewTUB,
            'View All Roles': Role.viewAll,
            'Add Role': Role.addRole,
            'View All Employees': Employee.viewAll,
            'View Employees By Department': Employee.viewByDepartment,
            'View Employees By Manager': Employee.viewByManager,
            'Add Employee': Employee.addEmployee,
            'Update Employee Role': Employee.updateRole,
            'Terminate Employee': Employee.terminate,
            'Delete Role': Role.remove,
            'Delete Department': Department.remove,
            Exit: process.exit,
        };

        const choices = Object.keys(choiceTable);

        while (true) {
            const { choice } = await inquirer.prompt([
                {
                    type: 'list',
                    message: 'What would you like to do?',
                    choices: choices,
                    name: 'choice',
                },
            ]);

            await choiceTable[choice](pool);
        }
    } catch (error) {
        console.log(error);
    }
})();
