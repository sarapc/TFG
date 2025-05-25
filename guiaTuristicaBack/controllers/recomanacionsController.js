const pool = require('../db');

const getRecomanacions = async (req, res) => {
  const { userID } = req.params;

  const query = `
    WITH user_rutes_llocs AS (
      SELECT ru.idruta, rl.idlloc
      FROM ruta_usuari ru
      JOIN rutalloc rl ON ru.idruta = rl.idruta
      WHERE ru.idusuari = $1
    ),
    user_cities AS (
      SELECT DISTINCT l.idciutat
      FROM user_rutes_llocs url
      JOIN lloc l ON url.idlloc = l.id
    ),
    matching_routes AS (
      SELECT
        ru_other.idusuari,
        ru_other.idruta AS other_ruta,
        ur.idruta AS user_ruta,
        COUNT(*) AS llocs_en_comu
      FROM rutalloc rl_other
      JOIN ruta_usuari ru_other ON rl_other.idruta = ru_other.idruta
      JOIN user_rutes_llocs ur ON rl_other.idlloc = ur.idlloc
      WHERE ru_other.idusuari <> $1
      GROUP BY ru_other.idusuari, ru_other.idruta, ur.idruta
      HAVING COUNT(*) >= 3
    ),
    user_coincidences AS (
      SELECT idusuari, COUNT(DISTINCT other_ruta) AS rutes_coincidents
      FROM matching_routes
      GROUP BY idusuari
      HAVING COUNT(DISTINCT user_ruta) >= 3
    ),
    recomanades AS (
      SELECT DISTINCT r.id, r.nom, c.nom AS ciutat, ru.idusuari
      FROM ruta r
      JOIN rutalloc rl ON r.id = rl.idruta
      JOIN lloc l ON rl.idlloc = l.id
      JOIN ciutat c ON l.idciutat = c.id
      JOIN ruta_usuari ru ON r.id = ru.idruta
      JOIN user_coincidences uc ON ru.idusuari = uc.idusuari
      WHERE ru.idusuari <> $1
        AND l.idciutat NOT IN (SELECT idciutat FROM user_cities)
    ),
    puntuacions_comentaris AS (
      SELECT
        p.idruta,
        AVG(p.valor) AS puntuacio_mitjana,
        (SELECT text FROM comentari WHERE idruta = p.idruta LIMIT 1) AS comentari_text
      FROM puntuacio p
      GROUP BY p.idruta
    )
    SELECT
      rec.id,
      rec.nom,
      rec.ciutat,
      CAST(COALESCE(pc.puntuacio_mitjana, 0) AS FLOAT) AS puntuacio,
      pc.comentari_text
    FROM recomanades rec
    LEFT JOIN puntuacions_comentaris pc ON rec.id = pc.idruta
  `;

  try {
    const { rows } = await pool.query(query, [userID]);
    res.json(rows);
  } catch (error) {
    console.error('Error al buscar recomanacions:', error);
    res.status(500).json({ error: 'Error intern del servidor' });
  }
};

module.exports = { getRecomanacions };
