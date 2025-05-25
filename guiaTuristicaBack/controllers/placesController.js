const pool = require('../db');

const getLlocsByCityId = async (req, res) => {
  try {
    const cityId = req.params.cityId;
    const result = await pool.query(
      'SELECT * FROM lloc WHERE idciutat = $1',
      [cityId]
    );
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obtenint llocs per ciutat' });
  }
};

module.exports = { getLlocsByCityId };