const inquirer = require('inquirer');
const Role = require('./Role');
const c = require('chalk');

class Employee {
    /**
    *

    @param {Object} pool - A connection pool object.
    This function prompts the user to input first and last name, select role and select manager
    of the employee and then it makes a query to insert this data into employees table.
    If roleTitle is 'Add New Role', it calls Role.addRole to create new role
    If managerName is 'None' it sets manager_id as null.
    if there's any error occured during the process, it logs it with error message and throws the error.
    */

    static async addEmployee(pool) {
        try {
            const [roles, managers] = await Promise.all([
                Role.findAll(pool),
                Employee.findAll(pool),
            ]);

            const { firstName, lastName, roleTitle, managerName } =
                await inquirer.prompt([
                    {
                        type: 'input',
                        message: 'First Name: ',
                        name: 'firstName',
                    },
                    {
                        type: 'input',
                        message: 'Last Name: ',
                        name: 'lastName',
                    },
                    {
                        type: 'list',
                        message: 'Choose Role: ',
                        choices: [
                            ...roles.map((role) => role.title),
                            'Add New Role',
                        ],
                        name: 'roleTitle',
                    },
                    {
                        type: 'list',
                        message: 'Select Manager: ',
                        choices: [
                            'None',
                            ...managers.map(
                                (manager) =>
                                    `${manager.id} | ${manager.first_name} ${manager.last_name}`
                            ),
                        ],
                        default: 'None',
                        name: 'managerName',
                    },
                ]);

            let role_id, manager_id;

            [role_id, manager_id] = await Promise.all([
                roleTitle === 'Add New Role'
                    ? Role.addRole(pool)
                    : roles.find((role) => role.title === roleTitle)?.id,
                managerName === 'None'
                    ? (manager_id = null)
                    : parseInt(managerName),
            ]);

            const result = await pool.query(
                'insert into employees (first_name, last_name, role_id, manager_id) values (?,?,?,?)',
                [firstName, lastName, role_id, manager_id]
            );

            console.clear();
            console.log(c.green('Employee Added Successfully'));
            return result[0].insertId;
        } catch (error) {
            console.log(c.red(error.message));
            throw error;
        }
    }

    /**
    *

    @param {Object} pool - A connection pool object.
    This function finds all the employees from employees table by running a select query
    and returns the result of that query.
    */
    static async findAll(pool) {
        const [managers] = await pool.query('select * from employees');
        return managers;
    }

    static async viewAll(pool) {
        const [employees] = await pool.query(
            `SELECT e.id as 'Emp. ID', e.first_name as 'First Name', e.last_name as 'Last Name',
            r.title as 'Title', r.id as 'Role ID', m.first_name as 'Manager First Name', m.last_name as 'Manager Last Name', e.manager_id as 'Manager ID' FROM Employees e
            JOIN Roles r on e.role_id = r.id
            LEFT JOIN Employees m on e.manager_id = m.id
            `
        );
        console.table(employees);
    }

    static async updateRole(pool) {
        const [employees, roles] = await Promise.all([
            Employee.findAll(pool),
            Role.findAll(pool),
        ]);

        const { employeeName, roleTitle } = await inquirer.prompt([
            {
                type: 'list',
                message: 'Select an employee to update: ',
                choices: employees.map(
                    (employee) =>
                        `${employee.id} | ${employee.first_name} ${employee.last_name}`
                ),
                name: 'employeeName',
            },
            {
                type: 'list',
                message: 'Select a new role for this employee: ',
                choices: [...roles.map((role) => role.title), 'New Role'],
                name: 'roleTitle',
            },
        ]);

        const role_id = roles.find((role) => role.title === roleTitle)?.id;
        const employee_id = parseInt(employeeName);

        const response = await pool.query(
            'update employees set role_id = ? where id = ?',
            [role_id, employee_id]
        );
        console.clear();
        console.log(c.green('Employee Updated Successfully'));
    }

    static async updateManager(pool) {
        const employees = await Employee.findAll(pool);

        const { employeeName, managerName } = await inquirer.prompt([
            {
                type: 'list',
                message: 'Select an employee to update: ',
                choices: employees.map(
                    (employee) =>
                        `${employee.id} | ${employee.first_name} ${employee.last_name}`
                ),
                name: 'employeeName',
            },
            {
                type: 'list',
                message: 'Select a new manager for this employee: ',
                choices: employees.map(
                    (employee) =>
                        `${employee.id} | ${employee.first_name} ${employee.last_name}`
                ),
                name: 'managerName',
            },
        ]);

        const employee_id = parseInt(employeeName);
        const manager_id = parseInt(managerName);

        const response = await pool.query(
            'update employees set manager_id = ? where id = ?',
            [manager_id, employee_id]
        );
        console.clear();
        console.log(c.green('Employee Manager Updated Successfully'));
    }

    static async viewByDepartment(pool) {
        try {
            const [employees] = await pool.query(
                `SELECT e.id as 'ID', e.first_name as 'First Name', e.last_name as 'Last Name', d.name as 'Department Name'
                FROM Employees e
                JOIN Roles r on e.role_id = r.id
                JOIN Departments d on r.department_id = d.id;`
            );

            console.table(employees);
        } catch (error) {
            throw error;
        }
    }

    static async viewByManager(pool) {
        try {
            const [employees] = await pool.query(`
            SELECT e2.id as 'Emp. ID', e2.first_name as 'First Name', e2.last_name as 'Last Name', e1.first_name as 'Manager First Name',e1.last_name as 'Manager Last Name'
            FROM Employees e1
            JOIN Employees e2 on e1.id = e2.manager_id
            ORDER BY e1.last_name;`);

            console.clear();
            console.table(employees);
        } catch (error) {}
    }

    static async terminate(pool) {
        const [employees] = await pool.query('SELECT * FROM Employees');

        const { employeeName } = await inquirer.prompt([
            {
                type: 'list',
                message: 'Select an employee to terminate: ',
                choices: employees.map(
                    (employee) =>
                        `${employee.id} | ${employee.first_name} ${employee.last_name}`
                ),
                name: 'employeeName',
            },
        ]);

        const employee_id = parseInt(employeeName);

        try {
            const response = await pool.query(
                `
            DELETE FROM Employees WHERE id = ?`,
                employee_id
            );
            console.clear();
            console.log(c.green('Employee has been removed from system.'));
        } catch (error) {
            console.log(error);
            console.log(error.message);
        }
    }
}

module.exports = Employee;
