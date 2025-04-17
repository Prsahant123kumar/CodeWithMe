const axios = require("axios");
const cheerio = require('cheerio');

// Axios instance with browser UA + timeout
const http = axios.create({
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
  timeout: 10000
});


const FetchUserDetailLeetCode = async (req, res) => {
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

  const headers = {
    "Content-Type": "application/json",
    Referer: `https://leetcode.com/${username}/`,
    Origin: "https://leetcode.com",
  };

  try {
    const [profileRes, ratingRes] = await Promise.all([
      axios.post(
        "https://leetcode.com/graphql",
        {
          query: profileQuery,
          variables: { username },
        },
        { headers }
      ),

      axios.post(
        "https://leetcode.com/graphql",
        {
          query: ratingQuery,
          variables: { username },
        },
        { headers }
      ),
    ]);

    const userData = profileRes.data.data.matchedUser;
    const contestData = ratingRes.data.data.userContestRanking;

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      username: userData.username,
      realName: userData.profile.realName,
      aboutMe: userData.profile.aboutMe,
      avatar: userData.profile.userAvatar,
      reputation: userData.profile.reputation,
      ranking: userData.profile.ranking,
      contestRating: contestData?.rating ?? "N/A",
      contestRanking: contestData?.globalRanking ?? "N/A",
      attendedContests: contestData?.attendedContestsCount ?? 0,
      totalSolved: userData.submitStats.acSubmissionNum.reduce(
        (acc, item) => acc + item.count,
        0
      ),
      breakdown: userData.submitStats.acSubmissionNum,
    });
  } catch (error) {
    console.error(
      "Error fetching user profile:",
      error.response?.data ?? error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
};

const FetchContestsDetailsLeetCode = async (req, res) => {
  const { username } = req.params;

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
    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: contestHistoryQuery,
        variables: { username },
      },
      { headers }
    );

    const contestHistory = response.data.data.userContestRankingHistory;

    if (!contestHistory || contestHistory.length === 0) {
      return res
        .status(404)
        .json({ error: "No contest data found for this user." });
    }

    // Filter contests where ranking is NOT 0 (indicating participation)
    const registeredContests = contestHistory.filter(
      (contest) => contest.ranking !== 0
    );

    if (registeredContests.length === 0) {
      return res
        .status(404)
        .json({ error: "User has not participated in any contests." });
    }

    res.json({
      contests: registeredContests.map((contest) => ({
        contestTitle: contest.contest.title,
        contestSlug: contest.contest.titleSlug,
        startTime: new Date(contest.contest.startTime * 1000).toLocaleString(), // Convert to readable time
        ranking: contest.ranking,
        rating: contest.rating,
        trend: contest.trendDirection,
        problemsSolved: contest.problemsSolved,
        totalProblems: contest.totalProblems,
        finishTimeInSeconds: contest.finishTimeInSeconds,
      })),
    });
  } catch (error) {
    console.error(
      "Error fetching contest data:",
      error.response?.data ?? error.message
    );
    res
      .status(500)
      .json({ error: "Something went wrong while fetching contest info" });
  }
};

const FetchUserDetailCF = async (req, res) => {
  const { handle } = req.params;

  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.info?handles=${handle}`
    );
    const user = response.data.result[0];

    res.json({
      handle: user.handle,
      rank: user.rank,
      maxRank: user.maxRank,
      rating: user.rating,
      maxRating: user.maxRating,
      contribution: user.contribution,
      friendOfCount: user.friendOfCount,
      organization: user.organization ?? "N/A",
      avatar: user.avatar,
      lastOnlineTimeSeconds: user.lastOnlineTimeSeconds,
    });
  } catch (error) {
    console.error(
      "Error fetching Codeforces profile:",
      error.response?.data ?? error.message
    );
    res.status(500).json({ error: "Something went wrong fetching CF profile" });
  }
};

const FetchContestsDetailsCF = async (req, res) => {
  const { handle } = req.params;

  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.rating?handle=${handle}`
    );
    const contests = response.data.result;

    res.json(contests); // this includes only contests the user has participated in
  } catch (error) {
    console.error(
      "Error fetching Codeforces contests:",
      error.response?.data ?? error.message
    );
    res
      .status(500)
      .json({ error: "Something went wrong fetching CF contests" });
  }
};

const FetchUserDetailsGFG = async (req, res) => {
  const { username } = req.params;
  try {
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
    FetchUserDetailLeetCode,
    FetchContestsDetailsLeetCode,
    FetchUserDetailCF,
    FetchContestsDetailsCF,
    FetchUserDetailsGFG,
    FetchAllDetailsAtCoder,
    FetchAllDetailsCodeChef,
  };
  