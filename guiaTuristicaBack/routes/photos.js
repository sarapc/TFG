const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadPhoto, getUserPhotos } = require('../controllers/photosController');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${file.originalname}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

router.post('/upload', upload.single('photo'), uploadPhoto);
router.get('/user/:idusuari', getUserPhotos);

module.exports = router;
