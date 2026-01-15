const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const upload = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/clock-in', authenticateToken, upload.single('photo'), attendanceController.clockIn);
router.post('/clock-out', authenticateToken, attendanceController.clockOut);
router.get('/history', authenticateToken, attendanceController.getHistory);

module.exports = router;
