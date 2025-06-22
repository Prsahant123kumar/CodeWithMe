const express = require("express");
const { sendMessage, getMessages } = require("../controllers/message.controller");
const { isAuthenticated } = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post("/send",isAuthenticated, sendMessage);
router.get("/messages/:id",isAuthenticated, getMessages);

module.exports = router;
