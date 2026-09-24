const express = require('express');
const router = express.Router();
const { getEmployees } = require('../controllers/employeesController.js');
router.get('/',getEmployees);

module.exports = router;