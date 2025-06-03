"use client";

import { useState } from "react";

export default function ChannelsPage() {
  const [newChannelName, setNewChannelName] = useState("");

  const handleAddChannel = () => {
    if (newChannelName.trim()) {
      // Handle adding new channel logic here
      console.log("Adding channel:", newChannelName);
      setNewChannelName("");
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#121416] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">Channels</p>
                <p className="text-[#a2abb3] text-sm font-normal leading-normal">Manage your connected channels</p>
              </div>
            </div>

            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Connected Channels</h3>
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-xl border border-[#40484f] bg-[#121416]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#1e2124]">
                      <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Channel</th>
                      <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Platform</th>
                      <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Check Frequency</th>
                      <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Daily Clip Limit</th>
                      <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Selection Criteria</th>
                      <th className="px-4 py-3 text-left text-white w-60 text-sm font-medium leading-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">TechStreamer</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">TikTok, YouTube, Instagram</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">Every 2 hours</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">5</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">Top 10% of clips</td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#2c3135] text-white text-sm font-medium leading-normal w-full">
                          <span className="truncate">Active</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">GamingGuru</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">TikTok, YouTube</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">Every 4 hours</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">3</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">Top 5% of clips</td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#2c3135] text-white text-sm font-medium leading-normal w-full">
                          <span className="truncate">Active</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">LiveCoder</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">YouTube</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">Every 6 hours</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">2</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">Top 20% of clips</td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#2c3135] text-white text-sm font-medium leading-normal w-full">
                          <span className="truncate">Inactive</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Add New Channel</h3>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <input
                  placeholder="Enter Twitch Channel Name"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#40484f] bg-[#1e2124] focus:border-[#40484f] h-14 placeholder:text-[#a2abb3] p-[15px] text-base font-normal leading-normal"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                />
              </label>
            </div>
            <div className="flex px-4 py-3 justify-start">
              <button
                onClick={handleAddChannel}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#dce8f3] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Add Channel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 