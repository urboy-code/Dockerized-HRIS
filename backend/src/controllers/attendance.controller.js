const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.clockIn = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const photo = req.file;
    const user_id = req.user.id;

    if (!photo) {
      return res.status(400).json({ message: 'Photo are required' });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Location are required' });
    }

    const newAttendance = await prisma.attendance.create({
      data: {
        user_id: user_id,
        clockIn: new Date(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        type: 'IN',
        status: 'PRESENT',
        photo_path: photo.filename,
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

exports.clockOut = async (req, res) => {
  try {
    const user_id = req.user.id;

    const activeSession = await prisma.attendance.findFirst({
      where: { user_id: user_id, clockOut: null },
    });

    if (!activeSession) {
      return res.status(400).json({ message: 'You are not Clock In Today!' });
    }

    const updateSession = await prisma.attendance.update({
      where: { id: activeSession.id },
      data: { clockOut: new Date() },
    });

    res.status(200).json({
      message: 'Clock Out Success!',
      data: updateSession,
    });
  } catch (err) {
    console.error('Error: ', err);
    res.status(500).json({ message: 'Failed to Clock Out' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await prisma.attendance.findMany({
      where: { user_id: req.user.id },
      orderBy: { clockIn: 'desc' },
      take: 10,
    });

    res.status(200).json({
      message: 'History Success!',
      data: history,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get history' });
  }
};
