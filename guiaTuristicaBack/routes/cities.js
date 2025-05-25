const express = require('express');
const router = express.Router();
const { getCiutats } = require('../controllers/citiesController');

router.get('/', getCiutats);

module.exports = router;