// controllers/citiesController.js
const pool = require('../db');

const getCiutats = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ciutat ORDER BY nom ASC');
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obtenint ciutats:', error);
    res.status(500).json({ error: 'No s\'han pogut obtenir les ciutats' });
  }
};

module.exports = { getCiutats };