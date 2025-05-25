const express = require('express');
const router = express.Router();
const { getRecomanacions } = require('../controllers/recomanacionsController');

router.get('/:userID', getRecomanacions);

module.exports = router;