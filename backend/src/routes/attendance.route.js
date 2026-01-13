const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const upload = require('../middleware/upload');

router.post('/clock-in', upload.single('photo'), attendanceController.clockIn);
router.post('/clock-out', attendanceController.clockOut);
router.get('/history', attendanceController.getHistory);

module.exports = router;
