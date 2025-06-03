"use client";

import { useState } from "react";

export default function ClipsPage() {
  const [selectedClips, setSelectedClips] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const handleSelectAll = () => {
    // Toggle select all functionality
    if (selectedClips.length > 0) {
      setSelectedClips([]);
    } else {
      setSelectedClips(["1", "2", "3", "4", "5"]);
    }
  };

  const handleClipSelect = (clipId: string) => {
    setSelectedClips(prev => 
      prev.includes(clipId) 
        ? prev.filter(id => id !== clipId)
        : [...prev, clipId]
    );
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#121416] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">Clips</p>
                <p className="text-[#a2abb3] text-sm font-normal leading-normal">Manage and review your clips</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#7047eb] text-white text-sm font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">Upload Selected</span>
                </button>
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2c3135] text-white text-sm font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">Delete Selected</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 p-4">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex h-10 min-w-40 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-[#40484f] bg-[#1e2124] px-4 text-white text-sm font-medium leading-normal"
              >
                <option value="All">All Status</option>
                <option value="Downloaded">Downloaded</option>
                <option value="Processing">Processing</option>
                <option value="Ready">Ready</option>
                <option value="Uploaded">Uploaded</option>
              </select>
              <select className="flex h-10 min-w-40 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-[#40484f] bg-[#1e2124] px-4 text-white text-sm font-medium leading-normal">
                <option>All Channels</option>
                <option>TechStreamer</option>
                <option>GamingGuru</option>
                <option>LiveCoder</option>
              </select>
              <select className="flex h-10 min-w-40 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-[#40484f] bg-[#1e2124] px-4 text-white text-sm font-medium leading-normal">
                <option>Last 7 Days</option>
                <option>Last 24 Hours</option>
                <option>Last 30 Days</option>
                <option>All Time</option>
              </select>
            </div>

            {/* Table */}
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-xl border border-[#40484f] bg-[#121416]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#1e2124]">
                      <th className="px-4 py-3 text-left text-white w-12">
                        <input
                          type="checkbox"
                          checked={selectedClips.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-[#7047eb] bg-[#2c3135] border-[#40484f] rounded focus:ring-[#7047eb] focus:ring-2"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Preview</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Title</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Channel</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Duration</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Downloaded</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Status</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedClips.includes("1")}
                          onChange={() => handleClipSelect("1")}
                          className="w-4 h-4 text-[#7047eb] bg-[#2c3135] border-[#40484f] rounded focus:ring-[#7047eb] focus:ring-2"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="w-16 h-9 bg-[#2c3135] rounded flex items-center justify-center">
                          <div className="text-white text-xs">▶</div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-white text-sm font-normal leading-normal">Epic Gaming Moment #1</td>
                      <td className="px-4 py-2 text-[#a2abb3] text-sm font-normal leading-normal">TechStreamer</td>
                      <td className="px-4 py-2 text-[#a2abb3] text-sm font-normal leading-normal">0:45</td>
                      <td className="px-4 py-2 text-[#a2abb3] text-sm font-normal leading-normal">2 hours ago</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                          Ready
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button className="flex items-center justify-center w-8 h-8 rounded bg-[#2c3135] text-white hover:bg-[#40484f]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M164.44,105.34l-48-32A8,8,0,0,0,104,80v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32Z" />
                            </svg>
                          </button>
                          <button className="flex items-center justify-center w-8 h-8 rounded bg-[#2c3135] text-white hover:bg-[#40484f]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M224,177.32V78.68a8,8,0,0,0-4.07-6.94L128,4.51a8,8,0,0,0-7.94,0L28.07,71.74A8,8,0,0,0,24,78.68v98.64a8,8,0,0,0,4.07,6.94l91.93,67.23a8,8,0,0,0,7.94,0l91.93-67.23A8,8,0,0,0,224,177.32Z" />
                            </svg>
                          </button>
                          <button className="flex items-center justify-center w-8 h-8 rounded bg-[#2c3135] text-white hover:bg-[#40484f]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedClips.includes("2")}
                          onChange={() => handleClipSelect("2")}
                          className="w-4 h-4 text-[#7047eb] bg-[#2c3135] border-[#40484f] rounded focus:ring-[#7047eb] focus:ring-2"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="w-16 h-9 bg-[#2c3135] rounded flex items-center justify-center">
                          <div className="text-white text-xs">▶</div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-white text-sm font-normal leading-normal">Funny Reaction Compilation</td>
                      <td className="px-4 py-2 text-[#a2abb3] text-sm font-normal leading-normal">GamingGuru</td>
                      <td className="px-4 py-2 text-[#a2abb3] text-sm font-normal leading-normal">1:23</td>
                      <td className="px-4 py-2 text-[#a2abb3] text-sm font-normal leading-normal">4 hours ago</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                          Processing
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button className="flex items-center justify-center w-8 h-8 rounded bg-[#2c3135] text-white hover:bg-[#40484f]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M164.44,105.34l-48-32A8,8,0,0,0,104,80v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32Z" />
                            </svg>
                          </button>
                          <button className="flex items-center justify-center w-8 h-8 rounded bg-[#2c3135] text-white hover:bg-[#40484f]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M224,177.32V78.68a8,8,0,0,0-4.07-6.94L128,4.51a8,8,0,0,0-7.94,0L28.07,71.74A8,8,0,0,0,24,78.68v98.64a8,8,0,0,0,4.07,6.94l91.93,67.23a8,8,0,0,0,7.94,0l91.93-67.23A8,8,0,0,0,224,177.32Z" />
                            </svg>
                          </button>
                          <button className="flex items-center justify-center w-8 h-8 rounded bg-[#2c3135] text-white hover:bg-[#40484f]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedClips.includes("3")}
                          onChange={() => handleClipSelect("3")}
                          className="w-4 h-4 text-[#7047eb] bg-[#2c3135] border-[#40484f] rounded focus:ring-[#7047eb] focus:ring-2"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="w-16 h-9 bg-[#2c3135] rounded flex items-center justify-center">
                          <div className="text-white text-xs">▶</div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-white text-sm font-normal leading-normal">Live Coding Session Highlight</td>
                      <td className="px-4 py-2 text-[#a2abb3] text-sm font-normal leading-normal">LiveCoder</td>
                      <td className="px-4 py-2 text-[#a2abb3] text-sm font-normal leading-normal">2:15</td>
                      <td className="px-4 py-2 text-[#a2abb3] text-sm font-normal leading-normal">1 day ago</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
                          Uploaded
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button className="flex items-center justify-center w-8 h-8 rounded bg-[#2c3135] text-white hover:bg-[#40484f]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M164.44,105.34l-48-32A8,8,0,0,0,104,80v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32Z" />
                            </svg>
                          </button>
                          <button className="flex items-center justify-center w-8 h-8 rounded bg-[#2c3135] text-white hover:bg-[#40484f]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M224,177.32V78.68a8,8,0,0,0-4.07-6.94L128,4.51a8,8,0,0,0-7.94,0L28.07,71.74A8,8,0,0,0,24,78.68v98.64a8,8,0,0,0,4.07,6.94l91.93,67.23a8,8,0,0,0,7.94,0l91.93-67.23A8,8,0,0,0,224,177.32Z" />
                            </svg>
                          </button>
                          <button className="flex items-center justify-center w-8 h-8 rounded bg-[#2c3135] text-white hover:bg-[#40484f]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-[#a2abb3] text-sm">
                Showing 1-3 of 15 clips
              </div>
              <div className="flex gap-2">
                <button className="flex items-center justify-center w-8 h-8 rounded bg-[#2c3135] text-white hover:bg-[#40484f]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z" />
                  </svg>
                </button>
                <button className="flex items-center justify-center w-8 h-8 rounded bg-[#7047eb] text-white">1</button>
                <button className="flex items-center justify-center w-8 h-8 rounded bg-[#2c3135] text-white hover:bg-[#40484f]">2</button>
                <button className="flex items-center justify-center w-8 h-8 rounded bg-[#2c3135] text-white hover:bg-[#40484f]">3</button>
                <button className="flex items-center justify-center w-8 h-8 rounded bg-[#2c3135] text-white hover:bg-[#40484f]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M96.49,199.51a12,12,0,0,1,0-17L159,120,96.49,56.49a12,12,0,1,1,17-17l80,80a12,12,0,0,1,0,17l-80,80A12,12,0,0,1,96.49,199.51Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 