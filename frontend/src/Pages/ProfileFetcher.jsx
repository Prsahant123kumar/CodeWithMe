import { useState, useEffect } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { usePlatformProfile } from "../store/UsePlatformProfile";
import LeetCodeProfile from "../components/LeetCodeProfile";
import CodeforcesProfile from "../components/CodeforcesProfile";
import GFGProfile from "../components/GFGProfile";
import AtCoderProfile from "../components/AtCoderProfile";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export default function ProfileFetcher() {
  const {
    UserLeetcode,
    UserCodeforces,
    UserGFG,
    UserAtcoder,
    UserCodingNinja,
    setLeetcodeData,
    setCodeforcesData,
    setGFGData,
    setAtcoderData,
    setCodingNinjaData
  } = usePlatformProfile();

  const [platform, setPlatform] = useState("leetcode");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hardcoded personal info
  const realName = "Prashant";
  const email = "prashant@example.com";
  const college = "IIT Bombay";
  const location = "India";
  const profilePhoto = "https://i.pravatar.cc/150?img=12";

  // Get current platform data
  const getCurrentData = () => {
    switch (platform) {
      case "leetcode": return UserLeetcode;
      case "codeforces": return UserCodeforces;
      case "gfg": return UserGFG;
      case "atcoder": return UserAtcoder;
      case "codingninja": return UserCodingNinja;
      default: return null;
    }
  };

  const data = getCurrentData();

  const setPlatformData = (data) => {
    switch (platform) {
      case "leetcode": setLeetcodeData(data); break;
      case "codeforces": setCodeforcesData(data); break;
      case "gfg": setGFGData(data); break;
      case "atcoder": setAtcoderData(data); break;
      case "codingninja": setCodingNinjaData(data); break;
      default: break;
    }
  };

  const fetchData = async () => {
    if (!username) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_URL}/api/v1/${platform}/${username}`,{
        withCredentials: true
      });
      const result = res.data;
      console.log(result);

      // Axios gives status directly in `res.status`
      if (res.status === 200) {
        setPlatformData(result);
      } else {
        setError(result.error || "Failed to fetch data");
      }
    } catch (err) {
      // You can optionally log the actual error: console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }

  };

  // Set username when platform changes
  useEffect(() => {
    if (data?.username || data?.profile?.handle) {
      setUsername(data.username || data.profile.handle);
    } else {
      setUsername("");
    }
  }, [platform, data]);

  // Render platform-specific profile
  const renderPlatformProfile = () => {
    if (!data) return null;

    switch (platform) {
      case "leetcode":
        return <LeetCodeProfile data={data} />;
      case "codeforces":
        return <CodeforcesProfile data={data} />;
      case "gfg":
        return <GFGProfile data={data} />;
      case "atcoder":
        return <AtCoderProfile data={data} />;
      case "codingninja":
        return <CodingNinja data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <div className="max-w-6xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-center">Coding Profile Viewer</h1>

        {/* Personal info shown always */}
        <Card className="bg-gray-900 text-white border border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
              />
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">{realName}</h2>
                <p className="text-gray-300">{email}</p>
                <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-start">
                  <span className="flex items-center text-sm text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {college}
                  </span>
                  <span className="flex items-center text-sm text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {location}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform selection and username input */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <select
            className="bg-gray-800 text-white rounded-md p-2 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="leetcode">LeetCode</option>
            <option value="codeforces">Codeforces</option>
            <option value="gfg">GeeksForGeeks</option>
            <option value="atcoder">AtCoder</option>
          </select>

          <Input
            className="bg-gray-900 border border-gray-700 text-white flex-grow focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter ${platform} username`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Button
            onClick={fetchData}
            disabled={loading || !username}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {loading ? "Loading..." : data ? "Refresh" : "Fetch"}
          </Button>
        </div>

        {error && <p className="text-red-500 text-center py-4">{error}</p>}

        {/* Render platform-specific profile */}
        {renderPlatformProfile()}
      </div>
    </div>
  );
}