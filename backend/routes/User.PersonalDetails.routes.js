const express = require("express");
const  { EnterPersonaldetails , updateProfile} = require("../controllers/PersonalDetails.controller");
const { isAuthenticated } = require("../middlewares/isAuthenticated");

const router = express.Router();

router.route("/Enter-Personal-Details").post(isAuthenticated, EnterPersonaldetails);
router.route("/Enter-Personal-Details").put(isAuthenticated,updateProfile);
module.exports = router;
