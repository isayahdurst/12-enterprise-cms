'use strict';

const Employee = require('../lib/Employee');
const Department = require('../lib/Department');
const Role = require('../lib/Role');
const inquirer = require('inquirer');
require('dotenv').config({ path: '../.env' });

const url = `${process.env.URL}${process.env.PORT}`;
console.log(url);

class CMS {
    static async start() {
        const { command } = await inquirer.prompt({
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View', 'Add', 'Update', 'Delete', 'Exit'],
            name: 'command',
        });

        const execute = {
            View: this.view.bind(CMS),
            Add: this.add.bind(CMS),
            Update: this.update.bind(CMS),
            /* Delete: this.delete.bind(CMS), */
            Exit: this.exit,
        };

        await execute[command]();
        await this.start();
    }

    static exit() {
        console.log('Goodbye!');
        process.exit(0);
    }

    static async view() {
        const { command } = await inquirer.prompt({
            type: 'list',
            message: 'What would you like to view?',
            choices: ['Departments', 'Roles', 'Employees'],
            default: 'Departments',
            name: 'command',
        });

        const execute = {
            Employees: this.viewEmployees.bind(CMS),
            Departments: this.viewDepartments.bind(CMS),
            Roles: this.viewRoles.bind(CMS),
        };

        await execute[command]();
    }

    static async viewDepartments() {
        const { command } = await inquirer.prompt({
            type: 'list',
            message: 'Please select an option:',
            choices: ['View All Departments', 'View Total Utilized Budget'],
            name: 'command',
        });

        // Displays all departments in console.table form.
        const viewAllDepartments = async function () {
            console.clear();
            const response = await fetch(`${url}/api/viewAll?type=departments`);
            const departments = await response.json();
            console.table(departments);
        };

        // Prompts user to select department and then returns the total budget of that department
        // TODO: Complete this function
        const viewTotalBudget = function () {
            console.clear();
            console.log('View total budget');
        };

        const execute = {
            'View All Departments': viewAllDepartments,
            'View Total Utilized Budget': viewTotalBudget,
        };

        await execute[command]();
    }

    static async viewEmployees() {
        // Returns all entries directly from database
        const viewAll = async function () {
            console.clear();
            console.table(await Employee.viewAll());
        };
        // TODO: complete this function
        const viewByManager = async function () {
            console.clear();
            console.log('Employees by manager');
        };
        // TODO: complete this function
        const viewByDepartment = async function () {
            console.clear();
            console.log('View employees by manager');
        };

        const execute = {
            'View All': viewAll,
            'View By Manager': viewByManager,
            'View By Department': viewByDepartment,
        };

        const { command } = await inquirer.prompt({
            type: 'list',
            message: 'Please select an option:',
            choices: ['View All', 'View By Manager', 'View By Department'],
            name: 'command',
        });

        await execute[command]();
    }

    static async viewRoles() {
        const viewAll = async function () {
            console.clear();
            console.table(await Role.viewAll());
        };

        // TODO: Insert view by cost function here
        const viewByCost = async function () {
            console.clear();
            console.log('Insert view by cost function here!');
        };

        const execute = {
            'View All': viewAll,
            'Sort By Labor Cost': viewByCost,
        };

        const { command } = await inquirer.prompt({
            type: 'list',
            message: 'Please select an option:',
            choices: ['View All', 'Sort By Labor Cost'],
            name: 'command',
        });

        await execute[command]();
    }

    static async add() {
        const execute = {
            Department: this.addDepartment.bind(CMS),
            Employee: this.addEmployee.bind(CMS),
            Role: this.addRole.bind(CMS),
        };

        const { command } = await inquirer.prompt({
            type: 'list',
            message: 'What would you like to add?',
            choices: ['Department', 'Role', 'Employee'],
            name: 'command',
        });

        await execute[command]();
    }

    static async addDepartment() {
        const { departmentName } = await inquirer.prompt({
            type: 'input',
            message: 'What is the name of this department?',
            name: 'departmentName',
        });

        await Department.add(departmentName);
    }

    static async addRole() {
        const departmentList = await CMS.objectify(
            await Department.viewAll(),
            'department'
        );

        console.log(departmentList);

        const { title, salary, department } = await inquirer.prompt([
            {
                type: 'input',
                message: 'What is the title for this role?',
                name: 'title',
            },
            {
                type: 'input',
                message:
                    'What is the salary for this role? (Enter a decimal number, only)',
                name: 'salary',
            },
            {
                type: 'list',
                message: 'Which department does this role belong to?',
                choices: departmentList,
                name: 'department',
            },
        ]);

        // Get department ID
        const deptID = await Department.findID(department);
        console.log(deptID.id);
    }

    static async addEmployee() {
        const roleList = await CMS.objectify(await Role.viewAll(), 'role');
        const { firstName, lastName, roleID, managerID } =
            await inquirer.prompt(
                {
                    type: 'input',
                    message: "Enter the employee's first name",
                    name: 'firstName',
                },
                {
                    type: 'input',
                    message: "Enter the employee's last name: ",
                    name: 'lastName',
                },
                {
                    type: 'list',
                    message: 'Please select a role for this employee:',
                    choices: roleList,
                    name: roleID,
                }
            );
    }

    static async objectify(list, type) {
        const execute = {
            employee: function (list) {
                return list.map(
                    (employee) =>
                        new Employee({
                            ID: employee.id,
                            firstName: employee.first_name,
                            lastName: employee.last_name,
                            roleID: employee.role_id,
                            managerID: employee.managerID,
                        })
                );
            },

            role: function (list) {
                return list.map(
                    (role) =>
                        new Role({
                            ID: role.id,
                            title: role.title,
                            salary: role.salary,
                            departmentID: role.department_id,
                        })
                );
            },

            department: function (list) {
                return list.map(
                    (department) =>
                        new Department({
                            ID: department.id,
                            name: department.name,
                        })
                );
            },
        };

        return execute[type](list);
    }

    static async update() {
        const choices = await CMS.objectify(
            await Employee.viewAll(),
            'employee'
        );

        const { employee } = await inquirer.prompt({
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: choices.map(
                (person) =>
                    `${person.ID} | ${person.firstName} ${person.lastName}`
            ),
            name: 'employee',
        });

        const { manager } = await inquirer.prompt({
            type: 'list',
            message: 'Select a manager for this employee:',
            choices: choices
                .map(
                    (person) =>
                        `${person.ID} | ${person.firstName} ${person.lastName}`
                )
                .filter((manager) => manager != employee),
            name: 'manager',
        });

        const managerID = parseInt(manager);

        const employeeID = parseInt(employee);
        console.log(employeeID, managerID);
        await Employee.update(employeeID, managerID);
    }
}

(async function () {
    await CMS.start();
})();
