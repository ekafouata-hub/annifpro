const express = require('express');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'Anniv-Reminder API',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
