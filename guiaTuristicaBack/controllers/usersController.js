const pool = require('../db');

const getId = async (req, res) => {
  const correu = req.params.correu;

  try {
    const result = await pool.query(
      'SELECT id FROM usuari WHERE correu = $1',
      [correu]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuari no trobat' });
    }
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obtenint usuari:', error);
    res.status(500).json({ error: 'No s\'ha pogut obtenir l\'usuari' });
  }
};

const createUser = async (req, res) => {
  const { nom, cognoms, correu } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO usuari (nom, cognoms, correu) VALUES ($1, $2, $3) RETURNING *',
      [nom, cognoms, correu]
    );
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.status(201).json(result.rows[0]);
    const nouUsuari = result.rows[0];
    await pool.query(
      `INSERT INTO fites (nComentaris, nRutes, nValoracions, idUsuari) VALUES (0, 0, 0, $1)`,
      [nouUsuari.id]
    );
  } catch (error) {
    console.error('Error afegint usuari:', error);
    res.status(500).json({ error: 'No s\'ha pogut crear l\'usuari' });
  }
};

const getUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query(
      'SELECT id, nom, cognoms, correu FROM usuari WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuari no trobat' });
    }
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obtenint usuari per ID:', error);
    res.status(500).json({ error: 'No s\'ha pogut obtenir l\'usuari' });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { nom, cognoms, correu } = req.body;

  try {
    const result = await pool.query(
      'UPDATE usuari SET nom = $1, cognoms = $2, correu = $3 WHERE id = $4 RETURNING *',
      [nom, cognoms, correu, userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualitzant usuari:', error);
    res.status(500).json({ error: 'No s\'ha pogut actualitzar l\'usuari' });
  }
};

module.exports = { getUser, createUser, getId, updateUser };
