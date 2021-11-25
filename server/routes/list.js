const { addList, deleteList, getList } = require("../controllers/listController");
const verifyToken = require("../middlewares/verifyToken");
const router = require("express").Router();

//ADD LIST
router.post('/', verifyToken, addList)

//DELETE LIST
router.delete('/:id', verifyToken, deleteList)

//GET LIST
router.get('/', verifyToken, getList)

module.exports = router