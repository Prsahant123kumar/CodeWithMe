const axios = require("axios");
const cheerio = require('cheerio');
const {EnterUserName,UpdateUserName}=require("../controllers/EnterUserName.controller")
// Axios instance with browser UA + timeout
const http = axios.create({
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
  timeout: 10000
});

const FetchCompleteLeetCodeDetails = async (req, res) => {
  const { username } = req.params;

  const profileQuery = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          aboutMe
          userAvatar
          ranking
          reputation
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  const ratingQuery = `
    query userContestRankingInfo($username: String!) {
      userContestRanking(username: $username) {
        rating
        attendedContestsCount
        globalRanking
      }
    }
  `;

  const contestHistoryQuery = `
    query getContestHistory($username: String!) {
      userContestRankingHistory(username: $username) {
        contest {
          title
          titleSlug
          startTime
        }
        ranking
        rating
        trendDirection
        problemsSolved
        totalProblems
        finishTimeInSeconds
      }
    }
  `;

  const headers = {
    "Content-Type": "application/json",
    Referer: `https://leetcode.com/${username}/`,
    Origin: "https://leetcode.com",
  };

  try {
    const UserId = req.id;
    if (UserId) {
      await EnterUserName(UserId, { leetcode: username }); // update username in db
      console.log(UserId,"inFetch")
    }
    console.log("gfgvb")
    const [profileRes, ratingRes, contestRes] = await Promise.all([
      axios.post("https://leetcode.com/graphql", {
        query: profileQuery,
        variables: { username },
      }, { headers }),
      axios.post("https://leetcode.com/graphql", {
        query: ratingQuery,
        variables: { username },
      }, { headers }),

      axios.post("https://leetcode.com/graphql", {
        query: contestHistoryQuery,
        variables: { username },
      }, { headers }),
    ]);

    const userData = profileRes.data.data.matchedUser;
    const contestRatingData = ratingRes.data.data.userContestRanking;
    const contestHistory = contestRes.data.data.userContestRankingHistory;

    if (!userData) {
      return res.status(404).json({ error: "User not found on LeetCode" });
    }

    const solved = userData.submitStats.acSubmissionNum.reduce(
      (acc, item) => acc + item.count,
      0
    );

    const registeredContests = (contestHistory || []).filter(
      (c) => c.ranking !== 0
    );
    console.log(userData)
    res.json({
      username: userData.username,
      realName: userData.profile.realName,
      aboutMe: userData.profile.aboutMe,
      avatar: userData.profile.userAvatar,
      reputation: userData.profile.reputation,
      ranking: userData.profile.ranking,
      contestRating: contestRatingData?.rating ?? "N/A",
      contestRanking: contestRatingData?.globalRanking ?? "N/A",
      attendedContests: contestRatingData?.attendedContestsCount ?? 0,
      totalSolved: solved,
      problemBreakdown: userData.submitStats.acSubmissionNum,
      contests: registeredContests.map((c) => ({
        contestTitle: c.contest.title,
        contestSlug: c.contest.titleSlug,
        startTime: new Date(c.contest.startTime * 1000).toLocaleString(),
        ranking: c.ranking,
        rating: c.rating,
        trend: c.trendDirection,
        problemsSolved: c.problemsSolved,
        totalProblems: c.totalProblems,
        finishTimeInSeconds: c.finishTimeInSeconds,
      })),
    });
  } catch (error) {
    console.error("LeetCode fetch error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to fetch LeetCode data" });
  }
};



const FetchCompleteCFDetails = async (req, res) => {
  const { handle } = req.params;

  try {
    const UserId = req.id;
    if (UserId) {
      await EnterUserName(UserId, { codeforces: handle }); // Save handle to DB
    }

    // Parallel fetch: user profile and contest rating history
    const [profileRes, contestsRes] = await Promise.all([
      axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
      axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`)
    ]);

    const user = profileRes.data.result[0];
    const contests = contestsRes.data.result;

    res.json({
      profile: {
        handle: user.handle,
        rank: user.rank,
        maxRank: user.maxRank,
        rating: user.rating,
        maxRating: user.maxRating,
        contribution: user.contribution,
        friendOfCount: user.friendOfCount,
        organization: user.organization ?? "N/A",
        avatar: user.avatar,
        lastOnlineTimeSeconds: user.lastOnlineTimeSeconds
      },
      contests: contests.map((contest) => ({
        contestId: contest.contestId,
        contestName: contest.contestName,
        rank: contest.rank,
        oldRating: contest.oldRating,
        newRating: contest.newRating,
        ratingChange: contest.newRating - contest.oldRating,
        contestTime: new Date(contest.ratingUpdateTimeSeconds * 1000).toLocaleString()
      }))
    });
  } catch (error) {
    console.error(
      "Error fetching Codeforces data:",
      error.response?.data ?? error.message
    );
    res.status(500).json({ error: "Something went wrong fetching Codeforces data" });
  }
};


const FetchUserDetailsGFG = async (req, res) => {
  const { username } = req.params;
  try {
    const result=await EnterUserName(handle)
    const response = await axios.get(
      `https://geeks-for-geeks-api.vercel.app/${username}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching GFG data:", error.message);
    res.status(500).json({ error: "Failed to fetch GFG user data." });
  }
};

const clean = txt => txt.replace(/\s+/g, ' ').trim();
const FetchAllDetailsAtCoder = async(req,res) => {
      const { username } = req.params;
      const profileUrl = `https://atcoder.jp/users/${username}`;
      const submissionsUrl = `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${username}&from_second=0`;
    
      try {
        // 1) Scrape profile page
        const profileRes = await http.get(profileUrl);
        const $ = cheerio.load(profileRes.data);
    
        let rating = 'N/A',
            highestRating = 'N/A',
            rank = 'N/A',
            contests = 'N/A';
    
        $('table.dl-table tr').each((_, row) => {
          const key = clean($(row).find('th').text());
          const val = clean($(row).find('td').text());
          if (key === 'Rating')          rating = val.split(' ')[0];
          else if (key === 'Highest Rating') highestRating = val;
          else if (key === 'Rank')       rank = val;
          else if (key === 'Rated Matches') contests = val;
        });
    
        // 2) Fetch submissions for solved & active days
        let problemsSolved = 0, activeDays = 0;
        try {
          const subsRes = await http.get(submissionsUrl);
          const subs = Array.isArray(subsRes.data) ? subsRes.data : [];
          const solvedSet = new Set(), daysSet = new Set();
          subs.forEach(s => {
            if (s.result === 'AC') {
              solvedSet.add(s.problem_id);
              daysSet.add(new Date(s.epoch_second * 1000).toDateString());
            }
          });
          problemsSolved = solvedSet.size;
          activeDays = daysSet.size;
        } catch (apiErr) {
          console.warn(`Warning: submissions API failed for ${username}:`, apiErr.message);
        }
    
        return res.json({
          username,
          profileUrl,
          rating,
          highestRating,
          rank,
          contestsParticipated: contests,
          problemsSolved,
          activeDays
        });
      } catch (err) {
        if (err.response?.status === 404) {
          return res.status(404).json({ error: 'AtCoder user not found.' });
        }
        console.error('AtCoder fetch error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch AtCoder profile data.' });
      }
}

const FetchAllDetailsCodeChef = async(req,res) => {
    const { username } = req.params;
    
    const profileUrl = `https://www.codechef.com/users/${username}`;
  
    try {
      const result=await EnterUserName(username);
      const profRes = await http.get(profileUrl);
      const html = profRes.data;
      const $ = cheerio.load(html);
  
      const rating = $('div.rating-number').first().text().trim() || 'N/A';
  
      let contestsParticipated = 0;
      $('h3').each((_, el) => {
        const m = $(el).text().trim().match(/Contests\s*\((\d+)\)/i);
        if (m) contestsParticipated = parseInt(m[1], 10);
      });
  
      let problemsSolved = 0;
      $('h3').each((_, el) => {
        const m = $(el).text().trim().match(/Total Problems Solved[:\s]+(\d+)/i);
        if (m) problemsSolved = parseInt(m[1], 10);
      });
  
      res.json({
        username,
        profileUrl,
        rating,
        problemsSolved,
        contestsParticipated
      });
  
    } catch (err) {
      if (err.response?.status === 404) {
        return res.status(404).json({ error: 'CodeChef user not found.' });
      }
      console.error('❌ CodeChef scrape error:', err.message);
      res.status(500).json({ error: 'Failed to fetch CodeChef profile data.' });
    }
}


module.exports = {
    FetchCompleteLeetCodeDetails,
    FetchCompleteCFDetails,
    FetchUserDetailsGFG,
    FetchAllDetailsAtCoder,
    FetchAllDetailsCodeChef,
  };
  