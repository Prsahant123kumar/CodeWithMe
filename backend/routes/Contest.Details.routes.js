const express = require("express");
const router = express.Router();

const {
  FetchUserDetailLeetCode,
  FetchContestsDetailsLeetCode,
  FetchUserDetailCF,
  FetchContestsDetailsCF,
  FetchUserDetailsGFG,
  FetchAllDetailsAtCoder,
  FetchAllDetailsCodeChef,
} = require("../controllers/FetchDetails");

// LeetCode
router.get("/leetcode/:username", FetchUserDetailLeetCode);
router.get("/leetcode/contests/:username", FetchContestsDetailsLeetCode);

// Codeforces
router.get("/codeforces/:handle", FetchUserDetailCF);
router.get("/codeforces/contests/:handle", FetchContestsDetailsCF);

// GFG
router.get("/gfg/:username", FetchUserDetailsGFG);

// AtCoder
router.get("/atcoder/:username", FetchAllDetailsAtCoder);

// CodeChef
router.get("/codechef/:username", FetchAllDetailsCodeChef);

module.exports = router;
