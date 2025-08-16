const axios = require('axios');
const cheerio = require('cheerio');

// Helper: within ±1 week
function inWindow(ms) {
  const now = Date.now();
  const wk = 7 * 24 * 60 * 60 * 1000;
  return ms >= now - wk && ms <= now + wk;
}

// Format timestamp in IST
function fmt(ms) {
  return new Date(ms).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

// 1) Codeforces
async function fetchCF() {
  try {
    const { data } = await axios.get('https://codeforces.com/api/contest.list');
    return data.result
      .filter(c => inWindow(c.startTimeSeconds * 1000))
      .map(c => ({
        site: 'Codeforces',
        name: c.name,
        url: `https://codeforces.com/contest/${c.id}`,
        startTime: fmt(c.startTimeSeconds * 1000),
        endTime: fmt((c.startTimeSeconds + c.durationSeconds) * 1000),
      }));
  } catch (e) {
    console.warn('CF fetch failed:', e.message);
    return [];
  }
}

// 2) AtCoder
async function fetchAC() {
  try {
    const { data } = await axios.get('https://kenkoooo.com/atcoder/resources/contests.json');
    return data
      .filter(c => inWindow(c.start_epoch_second * 1000))
      .map(c => ({
        site: 'AtCoder',
        name: c.title,
        url: `https://atcoder.jp/contests/${c.id}`,
        startTime: fmt(c.start_epoch_second * 1000),
        endTime: fmt((c.start_epoch_second + c.duration_second) * 1000),
      }));
  } catch (e) {
    console.warn('⚠️ AtCoder fetch failed:', e.message);
    return [];
  }
}

// 3) GeeksforGeeks
async function getGFGContests() {
  try {
    const html = await axios.get('https://practice.geeksforgeeks.org/contests').then(r => r.data);
    const $ = cheerio.load(html);
    const contests = [];

    $('#future-contests tbody tr').each((_, row) => {
      const cols = $(row).find('td');
      const code = cols.eq(0).text().trim();
      const name = cols.eq(1).text().trim();
      const start = cols.eq(2).text().trim();
      const end = cols.eq(3).text().trim();

      contests.push({
        site: 'GFG',
        name,
        url: `https://practice.geeksforgeeks.org/contest/${code}`,
        startTime: start,
        endTime: end,
      });
    });

    return contests;
  } catch (e) {
    console.warn('⚠️ GFG fetch failed:', e.message);
    return [];
  }
}

// 4) LeetCode
const convertLeetCodeTimestamp = ts => ts * 1000;

async function getLeetCodeContests() {
  try {
    const query = {
      query: `
      query {
        contestCalendar {
          activeContests { title titleSlug startTime duration }
          upcomingContests { title titleSlug startTime duration }
        }
      }`,
    };

    const { data } = await axios.post(
      'https://leetcode.com/graphql',
      query,
      { headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com/contest/' } }
    );

    const list = [
      ...data.data.contestCalendar.activeContests,
      ...data.data.contestCalendar.upcomingContests
    ];

    return list.map(c => {
      const startTs = convertLeetCodeTimestamp(c.startTime);
      return {
        site: 'LeetCode',
        name: c.title,
        url: `https://leetcode.com/contest/${c.titleSlug}/`,
        startTime: fmt(startTs),
        endTime: fmt(startTs + c.duration * 1000)
      };
    });
  } catch (e) {
    console.warn('⚠️ LeetCode fetch failed:', e.message);
    return [];
  }
}

// Controller: handle GET /contests
exports.getAllContests = async (req, res) => {
  try {
    const [cf, ac, gfg, lc] = await Promise.all([
      fetchCF(),
      fetchAC(),
      getGFGContests(),
      getLeetCodeContests()
    ]);
    res.json([...cf, ...ac, ...gfg, ...lc]);
  } catch (err) {
    console.error('❌ Error fetching contests:', err);
    res.status(500).json({ error: 'Failed to fetch contests.' });
  }
};