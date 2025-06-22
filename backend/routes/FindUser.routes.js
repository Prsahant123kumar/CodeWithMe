const {findUser}=require("../controllers/FindUser.controller")
const express=require("express");
const { isAuthenticated } = require("../middlewares/isAuthenticated");

const router=express.Router();
router.route("/findUser").post(isAuthenticated, findUser)
module.exports = router;