const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const { JWT_SECRET } = process.env;

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email has been used ❌' });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        role: role || 'STAFF',
      },
    });

    res.status(201).json({
      message: 'User successfuly created ✅',
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to register user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({
        message: 'User not found ❌',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Wrong Password!',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login success ✅',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to login user' });
  }
};
