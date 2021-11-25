const { updateMovie, addMovie, deleteMovie, getMovies, getRandomMovies, getAllMovies } = require("../controllers/movieController");
const verifyToken = require("../middlewares/verifyToken");
const router = require("express").Router();

//ADD MOVIE
router.post('/', verifyToken, addMovie)

//GET MOVIES
router.get('/find/:id', verifyToken, getMovies)

//GET ALL MOVIES
router.get('/', verifyToken, getAllMovies)

//GET RANDOM MOVIES
router.get('/random', verifyToken, getRandomMovies)

//UPDATE MOVIE
router.put("/:id", verifyToken, updateMovie);

//DELETE MOVIE
router.delete("/:id", verifyToken, deleteMovie);

module.exports = router;
