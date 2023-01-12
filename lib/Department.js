const inquirer = require('inquirer');
const c = require('chalk');

class Department {
    /**
     * This function is used to add a new department to the database.
     * It prompts the user to input the department name, and then inserts it into the 'Departments' table.
     * @param {Object} pool - The connection pool used to connect to the database.
     * @returns {Promise<number>} - The id of the added department.
     * @throws {Error} - If there is an error executing the query.
     */

    static async addDepartment(pool) {
        try {
            const { name } = await inquirer.prompt([
                {
                    type: 'input',
                    message: 'What would you like to name this department?',
                    name: 'name',
                },
            ]);

            const result = await pool.query(
                'INSERT INTO Departments (name) VALUES (?)',
                name
            );
            console.log(c.green('Department added successfully'));
            return result[0].insertId;
        } catch (error) {
            console.log(c.red(error.message));
            throw error;
        }
    }

    /**
     * This function is used to retrieve all departments from the 'Departments' table in the database.
     * @param {Object} pool - The connection pool used to connect to the database.
     * @returns {Promise<Array>} - The array of departments
     * @throws {Error} - If there is an error executing the query.
     */

    static async findAll(pool) {
        try {
            const [departments] = await pool.query('select * from Departments');
            return departments;
        } catch (error) {
            console.log(c.red('An error occured while fetching departments'));
        }
    }

    /**
     * This function is used to view all departments from the 'Departments' table in the database.
     * It calls the findAll() function to retrieve the departments and then logs them to the console using console.table().
     * @param {Object} pool - The connection pool used to connect to the database.
     * @throws {Error} - If there is an error executing the query.
     */

    static async viewAll(pool) {
        try {
            const departments = await Department.findAll(pool);
            console.table(departments);
        } catch (error) {
            throw error;
        }
    }

    /**
     * This function is used to delete a department from the 'Departments' table in the database.
     * It prompts the user to select a department from a list of all departments, and then deletes the selected department from the table.
     * @param {Object} pool - The connection pool used to connect to the database.
     * @throws {Error} - If there is an error executing the query.
     */

    static async remove(pool) {
        const departments = await Department.findAll(pool);

        const { departmentName } = await inquirer.prompt([
            {
                type: 'list',
                message: 'Select a department to delete: ',
                choices: departments.map(
                    (department) => `${department.id} | ${department.name}`
                ),
                name: 'departmentName',
            },
        ]);

        const department_id = parseInt(departmentName);

        try {
            const response = await pool.query(
                'DELETE FROM Departments WHERE id = ?',
                department_id
            );
            console.clear();
            console.log(c.green('Department deleted successfully.'));
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * This function is used to view the total utilized budget (TUB) of each department.
     * It retrieves this information by joining the 'Departments', 'Roles', and 'Employees' tables,
     * grouping by department name, and summing the salary of all roles in each department.
     * The results are logged to the console using console.table().
     * @param {Object} pool - The connection pool used to connect to the database.
     * @throws {Error} - If there is an error executing the query.
     */

    static async viewTUB(pool) {
        try {
            const [departments] = await pool.query(
                `SELECT Departments.name AS 'Department Name', SUM(Roles.salary) AS 'Total Utilized Budget'
                FROM Departments
                JOIN Roles ON Departments.id = Roles.department_id
                JOIN Employees ON Roles.id = Employees.role_id
                GROUP BY Departments.name;`
            );

            console.table(departments);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = Department;
