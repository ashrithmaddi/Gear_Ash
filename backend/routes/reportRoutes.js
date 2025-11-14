const express = require('express');
const { getAdminRevenue, getEnrollmentStats, getActiveUsers } = require('../controllers/reportController');

const router = express.Router();

router.get('/revenue', getAdminRevenue);
router.get('/enrollment-stats', getEnrollmentStats);
router.get('/active-users', getActiveUsers);

module.exports = router;