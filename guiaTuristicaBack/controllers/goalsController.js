const pool = require('../db');

const getFites = async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await pool.query(
      `SELECT nComentaris, nRutes, nValoracions 
       FROM fites 
       WHERE idUsuari = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fites no trobades per aquest usuari' });
    }
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.json(result.rows[0]);


  } catch (error) {
    console.error('Error obtenint fites:', error);
    res.status(500).json({ error: 'No s\'han pogut obtenir les fites' });
  }
};

const incrementarFita = async (req, res) => {
  const { idusuari, tipus } = req.body;

  if (!idusuari || !tipus) {
    return res.status(400).json({ error: 'Falten camps obligatoris.' });
  }

  const camp = {
    'comentari': 'ncomentaris',
    'ruta': 'nrutes',
    'puntuacio': 'nvaloracions'
  }[tipus];

  if (!camp) {
    return res.status(400).json({ error: 'Tipus no vàlid.' });
  }

  try {
    await pool.query(
      `UPDATE fites SET ${camp} = ${camp} + 1 WHERE idusuari = $1`,
      [idusuari]
    );
    res.status(200).json({ missatge: `Fita actualitzada: ${camp}` });
  } catch (error) {
    console.error('Error actualitzant fita:', error);
    res.status(500).json({ error: 'Error intern del servidor.' });
  }
};

module.exports = { getFites, incrementarFita };