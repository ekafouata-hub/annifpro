const express = require('express');
const { dashboardStats, reminderTemplates } = require('../data/mockData');

const router = express.Router();

router.get('/summary', (req, res) => {
  res.json({
    success: true,
    data: {
      ...dashboardStats,
      templates: reminderTemplates
    }
  });
});

module.exports = router;
