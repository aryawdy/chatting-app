const {
  addMessage,
  getAllMessage,
} = require("../controllers/messageController");

const router = require("express").Router();

router.post("/add-msg", addMessage);
router.post("/get-msg", getAllMessage);

module.exports = router;
