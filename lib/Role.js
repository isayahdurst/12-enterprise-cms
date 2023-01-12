const inquirer = require('inquirer');
const mysql = require('mysql2');
const Department = require('./Department');
const c = require('chalk');

class Role {
    /**
     * This function is used to add a new role to the 'Roles' table in the database.
     * It prompts the user to input the role's title, salary, and department, and then inserts it into the table.
     * @param {Object} pool - The connection pool used to connect to the database.
     * @returns {Promise<number>} - The id of the added role.
     * @throws {Error} - If there is an error executing the query.
     */

    static async addRole(pool) {
        try {
            const departments = await Department.findAll(pool);

            const { title, salary, departmentName } = await inquirer.prompt([
                {
                    type: 'input',
                    message: 'Title: ',
                    name: 'title',
                },
                {
                    type: 'input',
                    message: 'Salary: ',
                    name: 'salary',
                },
                {
                    type: 'list',
                    message: 'Department: ',
                    choices: departments.map(
                        (department) => `${department.name}`
                    ),
                    name: 'departmentName',
                },
            ]);

            const selectedDepartment = departments.find(
                (department) => department.name === departmentName
            );
            const department_id = selectedDepartment.id;

            const response = await pool.query(
                'insert into Roles (title, salary, department_id) values (?,?,?)',
                [title, salary, department_id]
            );

            console.clear();
            console.log(c.green('Role created successfully!'));
            return response[0].insertId;
        } catch (error) {
            console.log(c.red(error.message));
            throw error;
        }
    }

    /**
     * This function is used to retrieve all roles from the 'Roles' table in the database.
     * @param {Object} pool - The connection pool used to connect to the database.
     * @returns {Promise<Array>} - The array of roles
     * @throws {Error} - If there is an error executing the query.
     */

    static async findAll(pool) {
        const [roles] = await pool.query('select * from roles');
        return roles;
    }

    /**
     * This function is used to view all roles from the 'Roles' table in the database.
     * It calls the findAll() function to retrieve the roles and then logs them to the console using console.table().
     * @param {Object} pool - The connection pool used to connect to the database.
     * @throws {Error} - If there is an error executing the query.
     */

    static async viewAll(pool) {
        const roles = await Role.findAll(pool);
        console.table(roles[0]);
    }

    /**
     * This function is used to delete a role from the 'Roles' table in the database.
     * It prompts the user to select a role from a list of all roles, and then deletes the selected role from the table.
     * @param {Object} pool - The connection pool used to connect to the database.
     * @throws {Error} - If there is an error executing the query.
     */

    static async remove(pool) {
        const roles = await Role.findAll(pool);

        const { role } = await inquirer.prompt([
            {
                type: 'list',
                message: 'Select a role to remove: ',
                choices: [
                    ...roles.map((role) => `${role.id} | ${role.title}`),
                    'None',
                ],
                name: 'role',
            },
        ]);

        const role_id = parseInt(role);
        if (!role_id === 'None') {
            try {
                const response = await pool.query(
                    'DELETE FROM Roles WHERE id = ?',
                    role_id
                );
                console.clear();
                console.log(c.green('Role Successfully Deleted'));
            } catch (error) {
                console.log(error.message);
                throw error;
            }
        }
    }
}

module.exports = Role;
