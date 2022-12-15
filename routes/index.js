'use strict';

/* const Department = require('../lib/Department');
const Employee = require('../lib/Employee');
const Role = require('../lib/Role');

(async function () {
    const emp = new Employee({
        firstName: 'Isayah',
        lastName: 'Durst',
        roleID: 3,
        managerID: null,
    });

    const employee = await Employee.add({
        firstName: 'John',
        lastName: 'Doe',
        roleID: '3',
        managerID: null,
    });

    employee.update(25);
})();
*/

const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

module.exports = router;
