const express = require('express');
const router = express.Router();
const { getUser, createUser, getId, updateUser } = require('../controllers/usersController');

router.get('/:correu', getId);
router.post('/crea', createUser);
router.get('/id/:id', getUser);
router.put('/act/:id', updateUser)

module.exports = router;
