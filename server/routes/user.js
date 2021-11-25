const verifyToken = require("../middlewares/verifyToken");
const { deleteUser, updateUser, getUser, getAllUser, getStats } = require("../controllers/userController");
const router = require("express").Router();

//UPDATE
router.put("/:id", verifyToken, updateUser);

//delete
router.delete("/:id", verifyToken, deleteUser);

//get user
router.get("/find/:id", verifyToken, getUser);

//get all user
router.get("/", verifyToken, getAllUser);

//get stats
router.get('/stats', verifyToken, getStats)

module.exports = router;
