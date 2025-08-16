import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function LeetCodeProfile({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
      {/* Left Column - Profile Info */}
      <div className="space-y-4 lg:col-span-1">
        {/* Profile Card */}
        <Card className="bg-gray-900 text-white border border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl">LeetCode Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={data.avatar}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
              />
              <div>
                <h3 className="font-bold text-lg text-black">{data.realName || data.username}</h3>
                <p className="text-black text-sm">@{data.username}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-black">Reputation</span>
                <span className="font-medium text-black">{data.reputation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Global Rank</span>
                <span className="font-medium text-black">#{data.ranking}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Contest Rating</span>
                <span className="font-medium text-black">{Math.round(data.contestRating)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Problems Solved Card */}
        <Card className="bg-gray-900 text-white border border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-blue-500">Problems Solved</CardTitle>
          </CardHeader>
          <CardContent>
            {data.problemBreakdown?.map((category, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <div className="flex justify-between text-sm mb-1 text-gray-700">
                  <span className={`
                    ${category.difficulty === 'Easy' ? 'text-green-500' :
                    category.difficulty === 'Medium' ? 'text-yellow-500' :
                    'text-red-500'}
                  `}>
                    {category.difficulty}
                  </span>
                  <span>{category.count}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`
                      h-2 rounded-full 
                      ${category.difficulty === 'Easy' ? 'bg-green-500' :
                      category.difficulty === 'Medium' ? 'bg-yellow-500' :
                      'bg-red-500'}
                    `}
                    style={{ width: `${(category.count / data.totalSolved) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Contest History */}
      <div className="space-y-4 lg:col-span-2">
        {/* Contest Rating Card */}
        <Card className="bg-gray-900 text-white border border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl">Contest Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.contests}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="contestTitle" 
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    tickFormatter={(value) => value.match(/Contest (\d+)/)?.[1] || value}
                  />
                  <YAxis 
                    tick={{ fill: "#94a3b8" }} 
                    domain={['dataMin - 100', 'dataMax + 100']}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: "#1e293b", 
                      borderColor: "#334155",
                      borderRadius: "0.375rem"
                    }}
                    formatter={(value) => [Math.round(value), "Rating"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#1e40af" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Contests Card */}
        <Card className="bg-gray-900 text-white border border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl">Recent Contests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="sticky top-0 bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Contest</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Rating</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Solved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {data.contests?.map((contest, index) => (
                    <tr key={index} className="hover:bg-blue-300">
                      <td className="px-4 py-3 whitespace-nowrap text-black">
                        <div className="text-sm font-medium text-blue-950">
                          {contest.contestTitle.length > 30 
                            ? `${contest.contestTitle.substring(0, 30)}...` 
                            : contest.contestTitle}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(contest.startTime).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                        #{contest.ranking}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${
                            contest.trend === 'UP' ? 'text-green-500' :
                            contest.trend === 'DOWN' ? 'text-red-500' : 'text-gray-400'
                          }`}>
                            {Math.round(contest.rating)}
                          </span>
                          {contest.trend === 'UP' && (
                            <svg className="w-4 h-4 ml-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          )}
                          {contest.trend === 'DOWN' && (
                            <svg className="w-4 h-4 ml-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                        {contest.problemsSolved}/{contest.totalProblems}
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

