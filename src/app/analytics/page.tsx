"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30");

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#121416] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex h-full flex-1">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="layout-content-container flex flex-col flex-1">
            <div className="flex flex-col bg-[#121416] p-8 flex-1">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-white text-[32px] font-bold leading-tight tracking-[-0.015em]">
                    Analytics
                  </h1>
                  <p className="text-[#a2abb3] text-base font-normal leading-normal">
                    Track your channel performance and insights
                  </p>
                </div>
                
                <select 
                  className="flex h-10 items-center justify-between rounded-xl border border-[#40484f] bg-[#2c3135] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#2c90ea]"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>

              {/* Overview Stats */}
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#40484f] bg-[#1c1f22]">
                  <p className="text-white text-base font-medium leading-normal">Total Clips</p>
                  <p className="text-white tracking-light text-2xl font-bold leading-tight">1,247</p>
                  <p className="text-[#4ade80] text-sm font-normal leading-normal">+12% from last month</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#40484f] bg-[#1c1f22]">
                  <p className="text-white text-base font-medium leading-normal">Total Views</p>
                  <p className="text-white tracking-light text-2xl font-bold leading-tight">89.2K</p>
                  <p className="text-[#4ade80] text-sm font-normal leading-normal">+23% from last month</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#40484f] bg-[#1c1f22]">
                  <p className="text-white text-base font-medium leading-normal">Engagement Rate</p>
                  <p className="text-white tracking-light text-2xl font-bold leading-tight">7.3%</p>
                  <p className="text-[#ef4444] text-sm font-normal leading-normal">-2% from last month</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#40484f] bg-[#1c1f22]">
                  <p className="text-white text-base font-medium leading-normal">Revenue</p>
                  <p className="text-white tracking-light text-2xl font-bold leading-tight">$2,341</p>
                  <p className="text-[#4ade80] text-sm font-normal leading-normal">+18% from last month</p>
                </div>
              </div>

              {/* Performance Chart */}
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Performance Trends</h2>
              <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-white text-lg font-semibold">Views Over Time</p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#2c90ea] rounded-full"></div>
                      <span className="text-[#a2abb3] text-sm">Views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#4ade80] rounded-full"></div>
                      <span className="text-[#a2abb3] text-sm">Likes</span>
                    </div>
                  </div>
                </div>
                <div className="h-[250px] flex items-end justify-between gap-2">
                  {[12, 19, 25, 31, 28, 35, 42, 38, 45, 52, 48, 55, 62, 58, 65].map((height, index) => (
                    <div key={index} className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-[#2c3135] rounded-t flex flex-col" style={{ height: `${height * 3}px` }}>
                        <div className="bg-[#2c90ea] rounded-t flex-1"></div>
                        <div className="bg-[#4ade80] h-4 rounded-b"></div>
                      </div>
                      <span className="text-[#a2abb3] text-xs">
                        {index % 3 === 0 ? `${index + 1}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performing Clips */}
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Top Performing Clips</h2>
              <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl overflow-hidden mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#2c3135]">
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Clip Title</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Views</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Likes</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Shares</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="px-4 py-3 text-white text-sm font-normal leading-normal">
                        Epic Fail Compilation - Gaming Moments
                      </td>
                      <td className="px-4 py-3 text-[#a2abb3] text-sm font-normal leading-normal">25.3K</td>
                      <td className="px-4 py-3 text-[#a2abb3] text-sm font-normal leading-normal">1.2K</td>
                      <td className="px-4 py-3 text-[#a2abb3] text-sm font-normal leading-normal">324</td>
                      <td className="px-4 py-3 text-[#4ade80] text-sm font-normal leading-normal">$287</td>
                    </tr>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="px-4 py-3 text-white text-sm font-normal leading-normal">
                        Pro Gamer Highlights - Clutch Plays
                      </td>
                      <td className="px-4 py-3 text-[#a2abb3] text-sm font-normal leading-normal">18.7K</td>
                      <td className="px-4 py-3 text-[#a2abb3] text-sm font-normal leading-normal">956</td>
                      <td className="px-4 py-3 text-[#a2abb3] text-sm font-normal leading-normal">201</td>
                      <td className="px-4 py-3 text-[#4ade80] text-sm font-normal leading-normal">$213</td>
                    </tr>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="px-4 py-3 text-white text-sm font-normal leading-normal">
                        Funny Reactions to Game Glitches
                      </td>
                      <td className="px-4 py-3 text-[#a2abb3] text-sm font-normal leading-normal">14.2K</td>
                      <td className="px-4 py-3 text-[#a2abb3] text-sm font-normal leading-normal">743</td>
                      <td className="px-4 py-3 text-[#a2abb3] text-sm font-normal leading-normal">156</td>
                      <td className="px-4 py-3 text-[#4ade80] text-sm font-normal leading-normal">$162</td>
                    </tr>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="px-4 py-3 text-white text-sm font-normal leading-normal">
                        Best Streaming Moments This Week
                      </td>
                      <td className="px-4 py-3 text-[#a2abb3] text-sm font-normal leading-normal">11.8K</td>
                      <td className="px-4 py-3 text-[#a2abb3] text-sm font-normal leading-normal">621</td>
                      <td className="px-4 py-3 text-[#a2abb3] text-sm font-normal leading-normal">89</td>
                      <td className="px-4 py-3 text-[#4ade80] text-sm font-normal leading-normal">$134</td>
                    </tr>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="px-4 py-3 text-white text-sm font-normal leading-normal">
                        Behind the Scenes - Editing Process
                      </td>
                      <td className="px-4 py-3 text-[#a2abb3] text-sm font-normal leading-normal">8.9K</td>
                      <td className="px-4 py-3 text-[#a2abb3] text-sm font-normal leading-normal">412</td>
                      <td className="px-4 py-3 text-[#a2abb3] text-sm font-normal leading-normal">67</td>
                      <td className="px-4 py-3 text-[#4ade80] text-sm font-normal leading-normal">$101</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Channel Analytics */}
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Channel Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-3 rounded-xl p-4 border border-[#40484f] bg-[#1c1f22]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#9333ea] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">TW</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">TechStreamer</p>
                      <p className="text-[#a2abb3] text-xs">Twitch</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a2abb3] text-sm">Clips</span>
                    <span className="text-white text-sm font-medium">423</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a2abb3] text-sm">Avg Views</span>
                    <span className="text-white text-sm font-medium">2.3K</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 rounded-xl p-4 border border-[#40484f] bg-[#1c1f22]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ef4444] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">YT</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">MyGamingChannel</p>
                      <p className="text-[#a2abb3] text-xs">YouTube</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a2abb3] text-sm">Videos</span>
                    <span className="text-white text-sm font-medium">67</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a2abb3] text-sm">Avg Views</span>
                    <span className="text-white text-sm font-medium">4.7K</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 rounded-xl p-4 border border-[#40484f] bg-[#1c1f22]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#3b82f6] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">FB</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">GameHighlights</p>
                      <p className="text-[#a2abb3] text-xs">Facebook</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a2abb3] text-sm">Posts</span>
                    <span className="text-white text-sm font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a2abb3] text-sm">Avg Views</span>
                    <span className="text-white text-sm font-medium">1.8K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 