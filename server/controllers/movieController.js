const Movie = require("../models/Movie");

// add movie
const addMovie = async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = await Movie(req.body);
    try {
      const movies = await newMovie.save();
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  } else {
    res.status(403).json("You are not allowed to add data");
  }
};

//get movies
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.findById(req.params.id);
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

//get all movies
const getAllMovies = async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const movies = await Movie.find();
      res.status(200).json(movies.reverse());
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  }else{
    res.status(500).json("You are not allowed");
  }
};

//get random movies
const getRandomMovies = async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json("Unknown error occured");
  }
};

//update movie
const updateMovie = async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedMovie);
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  } else {
    res.status(403).json("You are not allowed to update data");
  }
};

//delete movie
const deleteMovie = async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("Movie has been deleted successfully");
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  } else {
    res.status(403).json("You can delete only if you are admin");
  }
};

module.exports = {
  addMovie,
  updateMovie,
  deleteMovie,
  getMovies,
  getAllMovies,
  getRandomMovies,
};
