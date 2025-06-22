const express = require("express");
const router = express.Router();

const {
  FetchCompleteLeetCodeDetails,
  FetchCompleteCFDetails,
  FetchUserDetailsGFG,
  FetchAllDetailsAtCoder,
  FetchAllDetailsCodeChef,
} = require("../controllers/FetchDetails");
const { isAuthenticated } = require("../middlewares/isAuthenticated");

// LeetCode
router.route("/leetcode/:username").get(isAuthenticated, FetchCompleteLeetCodeDetails);

// Codeforces
router.route("/codeforces/:handle").get(isAuthenticated, FetchCompleteCFDetails);

// GFG
router.route("/gfg/:username").get(isAuthenticated, FetchUserDetailsGFG);

// AtCoder
router.route("/atcoder/:username").get(isAuthenticated, FetchAllDetailsAtCoder);

// CodeChef
router.route("/codechef/:username").get(isAuthenticated, FetchAllDetailsCodeChef);

module.exports = router;
