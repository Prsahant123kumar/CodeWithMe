const express = require('express');
const router = express.Router();
const { getAllContests } = require('../controllers/contestsController');

// GET /contests/  => returns combined list of contests
router.get('/', getAllContests);

module.exports = router;