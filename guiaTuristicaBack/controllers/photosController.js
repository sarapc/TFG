// controllers/photosController.js
const pool = require('../db');

const uploadPhoto = async (req, res) => {
  const { userID, placeID } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'No s\'ha rebut cap imatge' });
  }

  try {

    const photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    await pool.query(
      `INSERT INTO fotos (idusuari, idlloc, photourl)
       VALUES ($1,       $2,     $3)`,
      [userID, placeID, photoUrl]
    );

    res.status(200).json({ message: 'Foto desada correctament', url: photoUrl });
  } catch (error) {
    console.error('Error desant la foto:', error);
    res.status(500).json({ error: 'No s\'ha pogut desar la foto' });
  }
};

const getUserPhotos = async (req, res) => {
  const { idusuari } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT 
         f.id, 
         f.photourl, 
         f.takenat, 
         f.idlloc,
         l.nom AS place_name
       FROM fotos f
       JOIN lloc l ON f.idlloc = l.id
       WHERE f.idusuari = $1
       ORDER BY f.takenat DESC`,
      [idusuari]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error obtenint fotos de l’usuari:', error);
    res.status(500).json({ error: 'No s\'han pogut obtenir les fotos' });
  }
};

module.exports = { uploadPhoto, getUserPhotos };
