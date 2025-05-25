const pool = require('../db');

const createRoute = async (req, res) => {
  const { nom, data } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO ruta (nom, data) VALUES ($1, $2) RETURNING *',
      [nom, data]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creant ruta:', error);
    res.status(500).json({ error: 'No s\'ha pogut crear la ruta' });
  }
};

const linkRouteToUser = async (req, res) => {
  const { idruta, idusuari } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO ruta_usuari (idruta, idusuari) VALUES ($1, $2) RETURNING *',
      [idruta, idusuari]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error vinculant ruta i usuari:', error);
    res.status(500).json({ error: 'No s\'ha pogut vincular la ruta amb l\'usuari' });
  }
};

const addComment = async (req, res) => {
  const { text, idruta } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO comentari (text, idruta) VALUES ($1, $2) RETURNING *',
      [text, idruta]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error afegint comentari:', error);
    res.status(500).json({ error: 'No s\'ha pogut afegir el comentari' });
  }
};

const addRating = async (req, res) => {
  const { valor, idruta } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO puntuacio (valor, idruta) VALUES ($1, $2) RETURNING *',
      [valor, idruta]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error afegint puntuació:', error);
    res.status(500).json({ error: 'No s\'ha pogut afegir la puntuació' });
  }
};

const addPlaceToRoute = async (req, res) => {
  const { idruta, idlloc, ordre } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO rutalloc (idruta, idlloc, ordre) VALUES ($1, $2, $3) RETURNING *',
      [idruta, idlloc, ordre]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error afegint lloc a ruta:', error);
    res.status(500).json({ error: 'No s\'ha pogut afegir el lloc a la ruta' });
  }
};

const getUserRoutes = async (req, res) => {
  const { idusuari } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT r.id, r.nom, p.valor AS puntuacio
      FROM ruta r
      INNER JOIN ruta_usuari ru ON ru.idruta = r.id
      LEFT JOIN puntuacio p ON p.idruta = r.id
      WHERE ru.idusuari = $1
      `,
      [idusuari]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error obtenint rutes usuari:', error);
    res.status(500).json({ error: "No s'han pogut obtenir les rutes" });
  }
};

const getLlocsDeRuta = async (req, res) => {
  const { idruta } = req.params;

  try {
    const query = `
      SELECT lloc.*
      FROM rutalloc
      JOIN lloc ON rutalloc.idlloc = lloc.id
      WHERE rutalloc.idruta = $1
      ORDER BY rutalloc.ordre ASC
    `;

    const { rows } = await pool.query(query, [idruta]);

    res.json(rows);
  } catch (error) {
    console.error('Error recuperant llocs de la ruta:', error);
    res.status(500).json({ error: 'Error intern del servidor.' });
  }
};

module.exports = {
  createRoute,
  linkRouteToUser,
  addComment,
  addRating,
  addPlaceToRoute,
  getUserRoutes,
  getLlocsDeRuta
};
