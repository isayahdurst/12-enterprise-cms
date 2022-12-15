const router = require('express').Router();
const employeeRoutes = require('./employeeRoutes');
const departmentRoutes = require('./departmentRoutes');
const roleRoutes = require('./roleRoutes');

router.use('/employees', employeeRoutes);
router.use('/departments', departmentRoutes);
router.use('/roles', roleRoutes);

module.exports = router;
