const express = require("express");
const { allMessages } = require("../controllers/messageController");

const router = express.Router();

router.route("/").get(allMessages);

module.exports = router;
