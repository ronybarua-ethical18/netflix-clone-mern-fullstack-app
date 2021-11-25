const List = require("../models/List");

// add movie
const addList = async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);
    try {
      const list = await newList.save();
      res.status(200).json(list);
    } catch (error) {
      res.status(500).json("unknown error occured");
    }
  } else {
    res.status(403).json("You are not allowed to add data");
  }
};

// delete movie
const deleteList = async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      res.status(200).json("The list has been deleted successfully");
    } catch (error) {
      res.status(500).json("unknown error occured");
    }
  } else {
    res.status(403).json("You are not allowed to add data");
  }
};

// get movie
const getList = async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery } },
        ]);
      }else{
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } },
        ]);
      }
    } else {
      list = await List.aggregate([
        { $sample: { size: 10 } }
      ]);
    }
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json("unknown error occured");
  }
};

module.exports = {
  addList,
  getList,
  deleteList,
};
