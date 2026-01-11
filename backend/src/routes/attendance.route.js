const express = require('express')
const router = express.Router()
const attendanceController = require('../controllers/attendance.controller')

router.post('/clock-in', attendanceController.clockIn)

module.exports = router