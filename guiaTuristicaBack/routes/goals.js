const express = require('express');
const router = express.Router();
const { getFites, incrementarFita } = require('../controllers/goalsController');

router.get('/usuari/:userId', getFites);
router.post('/incrementar', incrementarFita);

module.exports = router;
