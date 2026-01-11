const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.clockIn = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = 1;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Location are required' });
    }

    const newAttendance = await prisma.attendance.create({
      data: {
        user_id: userId,
        clockIn: new Date(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        type: 'IN',
        status: 'PRESENT',
        photo_path: '-',
      },
    });

    res.status(201).json({
      message: 'Clock In Success!',
      data: newAttendance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to Clock In' });
  }
};
