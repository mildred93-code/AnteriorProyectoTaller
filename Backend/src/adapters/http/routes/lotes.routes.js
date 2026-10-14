const express = require('express');
const router = express.Router();

// GET /api/lotes
router.get('/', (req, res) => {
  res.status(200).json([]);
});

module.exports = router;
