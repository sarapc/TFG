const express = require('express');
const router = express.Router();
const { getLlocsByCityId } = require('../controllers/placesController');

router.get('/city/:cityId', getLlocsByCityId );

module.exports = router;