const { response } = require('express');

require('dotenv').config({ path: '../.env' });

const PATH = `${process.env.URL}${process.env.PORT}`;

class Employee {
    constructor({ ID, firstName, lastName, roleID, managerID }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.roleID = roleID;
        this.managerID = managerID;
        this.ID = ID;
    }

    static async terminate(employeeID) {
        await fetch(`${PATH}/api/employees/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: employeeID,
            }),
        });
    }

    static async update(employeeID, managerID) {
        {
            const response = await fetch(`${PATH}/api/employees/${managerID}`);
            const employee = await response.json();
            if (employee.length < 1) {
                console.log("Error: Employee doesn't exist.");
                return;
            }
        }

        {
            const response = await fetch(`${PATH}/api/employees/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ID: employeeID,
                    managerID: managerID,
                }),
            });

            console.log(await response.json());
        }
    }

    static async viewAll() {
        const reponse = await fetch(`${PATH}/api/viewAll?type=employees`);
        const employees = await reponse.json();
        return employees;
    }

    static async add({ firstName, lastName, roleID, managerID }) {
        const response = await fetch(`${PATH}/api/employees/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                roleID: roleID,
                managerID: managerID,
            }),
        });

        const message = await response.json();
        const ID = message[0]['LAST_INSERT_ID()'];
        console.log(`Employee (ID: ${ID}) saved to database.`);
        return new Employee({ ID, firstName, lastName, roleID, managerID });
    }
}

module.exports = Employee;
