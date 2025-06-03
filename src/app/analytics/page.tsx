"use client";

import { useState } from "react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30");

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-white tracking-light text-[32px] font-bold leading-tight">Analytics</p>
            <p className="text-[#a2abb3] text-sm font-normal leading-normal">Track your channel performance and insights</p>
          </div>
          <div className="flex flex-col gap-3">
            <select 
              className="flex h-10 w-full items-center justify-between rounded-xl border border-[#40484f] bg-[#2c3135] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#dce8f3]"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Overview</h2>
        <div className="flex flex-wrap gap-4 p-4">
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#40484f]">
            <p className="text-white text-base font-medium leading-normal">Total Clips</p>
            <p className="text-white tracking-light text-2xl font-bold leading-tight">1,247</p>
            <p className="text-[#4ade80] text-sm font-normal leading-normal">+12% from last month</p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#40484f]">
            <p className="text-white text-base font-medium leading-normal">Total Views</p>
            <p className="text-white tracking-light text-2xl font-bold leading-tight">89.2K</p>
            <p className="text-[#4ade80] text-sm font-normal leading-normal">+23% from last month</p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#40484f]">
            <p className="text-white text-base font-medium leading-normal">Engagement Rate</p>
            <p className="text-white tracking-light text-2xl font-bold leading-tight">7.3%</p>
            <p className="text-[#ef4444] text-sm font-normal leading-normal">-2% from last month</p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#40484f]">
            <p className="text-white text-base font-medium leading-normal">Revenue</p>
            <p className="text-white tracking-light text-2xl font-bold leading-tight">$2,341</p>
            <p className="text-[#4ade80] text-sm font-normal leading-normal">+18% from last month</p>
          </div>
        </div>

        {/* Performance Chart */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Performance Trends</h2>
        <div className="flex flex-col gap-3 p-4">
          <div className="flex h-[300px] w-full flex-col rounded-xl border border-[#40484f] bg-[#1e2124] p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-white text-lg font-semibold">Views Over Time</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#dce8f3] rounded-full"></div>
                  <span className="text-[#a2abb3] text-sm">Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#4ade80] rounded-full"></div>
                  <span className="text-[#a2abb3] text-sm">Likes</span>
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-end justify-between gap-2">
              {[12, 19, 25, 31, 28, 35, 42, 38, 45, 52, 48, 55, 62, 58, 65].map((height, index) => (
                <div key={index} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full bg-[#2c3135] rounded-t flex flex-col" style={{ height: `${height * 3}px` }}>
                    <div className="bg-[#dce8f3] rounded-t flex-1"></div>
                    <div className="bg-[#4ade80] h-4 rounded-b"></div>
                  </div>
                  <span className="text-[#a2abb3] text-xs">
                    {index % 3 === 0 ? `${index + 1}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Clips */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Top Performing Clips</h2>
        <div className="px-4 py-3">
          <div className="flex overflow-hidden rounded-xl border border-[#40484f] bg-[#121416]">
            <table className="flex-1">
              <thead>
                <tr className="bg-[#1e2124]">
                  <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Clip Title</th>
                  <th className="px-4 py-3 text-left text-white w-[120px] text-sm font-medium leading-normal">Views</th>
                  <th className="px-4 py-3 text-left text-white w-[120px] text-sm font-medium leading-normal">Likes</th>
                  <th className="px-4 py-3 text-left text-white w-[120px] text-sm font-medium leading-normal">Shares</th>
                  <th className="px-4 py-3 text-left text-white w-[120px] text-sm font-medium leading-normal">Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-t-[#40484f]">
                  <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
                    Epic Fail Compilation - Gaming Moments
                  </td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#a2abb3] text-sm font-normal leading-normal">25.3K</td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#a2abb3] text-sm font-normal leading-normal">1.2K</td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#a2abb3] text-sm font-normal leading-normal">324</td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#4ade80] text-sm font-normal leading-normal">$287</td>
                </tr>
                <tr className="border-t border-t-[#40484f]">
                  <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
                    Pro Gamer Highlights - Clutch Plays
                  </td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#a2abb3] text-sm font-normal leading-normal">18.7K</td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#a2abb3] text-sm font-normal leading-normal">956</td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#a2abb3] text-sm font-normal leading-normal">201</td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#4ade80] text-sm font-normal leading-normal">$213</td>
                </tr>
                <tr className="border-t border-t-[#40484f]">
                  <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
                    Funny Reactions to Game Glitches
                  </td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#a2abb3] text-sm font-normal leading-normal">14.2K</td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#a2abb3] text-sm font-normal leading-normal">743</td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#a2abb3] text-sm font-normal leading-normal">156</td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#4ade80] text-sm font-normal leading-normal">$162</td>
                </tr>
                <tr className="border-t border-t-[#40484f]">
                  <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
                    Best Streaming Moments This Week
                  </td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#a2abb3] text-sm font-normal leading-normal">11.8K</td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#a2abb3] text-sm font-normal leading-normal">621</td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#a2abb3] text-sm font-normal leading-normal">89</td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#4ade80] text-sm font-normal leading-normal">$134</td>
                </tr>
                <tr className="border-t border-t-[#40484f]">
                  <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
                    Behind the Scenes - Editing Process
                  </td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#a2abb3] text-sm font-normal leading-normal">8.9K</td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#a2abb3] text-sm font-normal leading-normal">412</td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#a2abb3] text-sm font-normal leading-normal">67</td>
                  <td className="h-[72px] px-4 py-2 w-[120px] text-[#4ade80] text-sm font-normal leading-normal">$101</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Channel Analytics */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Channel Performance</h2>
        <div className="flex flex-wrap gap-4 p-4">
          <div className="flex min-w-[200px] flex-1 flex-col gap-3 rounded-xl p-4 border border-[#40484f]">
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
          <div className="flex min-w-[200px] flex-1 flex-col gap-3 rounded-xl p-4 border border-[#40484f]">
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
          <div className="flex min-w-[200px] flex-1 flex-col gap-3 rounded-xl p-4 border border-[#40484f]">
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
              <span className="text-[#a2abb3] text-sm">Avg Reach</span>
              <span className="text-white text-sm font-medium">1.8K</span>
            </div>
          </div>
        </div>

        {/* Export Data */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Export Data</h2>
        <div className="flex gap-3 px-4 py-3">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2c3135] text-white text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Export CSV</span>
          </button>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2c3135] text-white text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Export PDF Report</span>
          </button>
        </div>
      </div>
    </div>
  );
} 