const express = require('express');
const router = express.Router();
const {
  createRoute,
  linkRouteToUser,
  addComment,
  addRating,
  addPlaceToRoute,
  getUserRoutes,
  getLlocsDeRuta
} = require('../controllers/routesController');

router.post('/', createRoute);
router.post('/usuaris', linkRouteToUser);
router.post('/comentaris', addComment);
router.post('/puntuacions', addRating);
router.post('/llocs', addPlaceToRoute);
router.get('/user/:idusuari', getUserRoutes);
router.get('/:idruta/llocs', getLlocsDeRuta);

module.exports = router;
