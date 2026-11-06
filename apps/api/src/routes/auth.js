const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const users = [
  {
    id: 1,
    fullName: 'Super Administrateur',
    email: 'ekafouata@gmail.com',
    password: 'admin123',
    role: 'super_admin'
  },
  {
    id: 2,
    fullName: 'Responsable Bureau',
    email: 'bureau@isaac-rebecca.org',
    password: 'admin123',
    role: 'responsable'
  }
];

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  const user = users.find(
    item => item.email === email && item.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Identifiants invalides.'
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '8h' }
  );

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }
  });
});

module.exports = router;
