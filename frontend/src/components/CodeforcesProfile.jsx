import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function CodeforcesProfile({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
      {/* Left Column - Profile Info */}
      <div className="space-y-4 lg:col-span-1">
        {/* Profile Card */}
        <Card className="bg-gray-900 text-white border border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl">Codeforces Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={data.profile.avatar}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
              />
              <div>
                {/* Using same black-on-gray styling as LeetCode profile */}
                <h3 className="font-bold text-lg text-black">@{data.profile.handle}</h3>
                <p className="text-black text-sm">{data.profile.organization}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-black">Rank</span>
                <span className="font-medium capitalize text-black">{data.profile.rank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Rating</span>
                <span className="font-medium text-black">{data.profile.rating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Max Rating</span>
                <span className="font-medium text-black">{data.profile.maxRating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Contribution</span>
                <span className="font-medium text-black">{data.profile.contribution}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Contest History */}
      <div className="space-y-4 lg:col-span-2">
        {/* Rating History Card */}
        <Card className="bg-gray-900 text-white border border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl">Rating History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.contests}>
                  {/* Use same subtle grid & tick colors as LeetCodeProfile */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="contestName"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    tickFormatter={(value) => value.match(/Round (\d+)/)?.[1] || value}
                  />
                  <YAxis tick={{ fill: "#94a3b8" }} domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#334155",
                      borderRadius: "0.375rem"
                    }}
                    formatter={(value) => [value, "Rating"]}
                  />
                  {/* Chart stroke and dot colors matched to LeetCode style */}
                  <Line
                    type="monotone"
                    dataKey="newRating"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#1e40af" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Contest History Card */}
        <Card className="bg-gray-900 text-white border border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl">Contest History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="sticky top-0 bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Contest</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Rating</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {data.contests.map((contest, index) => (
                    <tr key={index} className="hover:bg-blue-400">
                      <td className="px-4 py-3 whitespace-nowrap text-black">
                        <div className="text-sm font-medium text-blue-950">
                          {contest.contestName.length > 30
                            ? `${contest.contestName.substring(0, 30)}...`
                            : contest.contestName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(contest.contestTime).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                        #{contest.rank}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${
                            contest.ratingChange > 0 ? 'text-green-500' :
                            contest.ratingChange < 0 ? 'text-red-500' : 'text-gray-400'
                          }`}>
                            {contest.ratingChange > 0 ? '+' : ''}{contest.newRating}
                          </span>
                          {contest.ratingChange > 0 && (
                            <svg className="w-4 h-4 ml-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          )}
                          {contest.ratingChange < 0 && (
                            <svg className="w-4 h-4 ml-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${
                            contest.ratingChange > 0 ? 'text-green-500' :
                            contest.ratingChange < 0 ? 'text-red-500' : 'text-gray-400'
                          }`}>
                            {contest.ratingChange > 0 ? '+' : ''}{contest.ratingChange}
                          </span>
                          {contest.ratingChange > 0 && (
                            <svg className="w-4 h-4 ml-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          )}
                          {contest.ratingChange < 0 && (
                            <svg className="w-4 h-4 ml-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
