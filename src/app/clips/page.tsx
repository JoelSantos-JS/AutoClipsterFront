"use client";

import { useState } from "react";
import Link from "next/link";

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
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          {/* Sidebar */}
          <div className="layout-content-container flex flex-col w-80">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-[#121416] p-4">
              <div className="flex flex-col gap-4">
                <h1 className="text-white text-base font-medium leading-normal">AutoClipster</h1>
                <div className="flex flex-col gap-2">
                  <Link href="/" className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#a2abb3]" data-icon="House" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.10Z"></path>
                      </svg>
                    </div>
                    <span className="text-[#a2abb3] text-sm font-medium leading-normal">Dashboard</span>
                  </Link>
                  <Link href="/channels" className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#a2abb3]" data-icon="ChatsCircle" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M231.79,187.33A80,80,0,0,0,169.6,72.72L151.36,131.4A40,40,0,1,1,124.6,104.64l58.68-18.24A80,80,0,0,0,68.67,152.21L20.5,199.83a12,12,0,0,0,17,17l47.62-47.62A80,80,0,0,0,231.79,187.33ZM80,152a40,40,0,1,1,40,40A40,40,0,0,1,80,152Z"></path>
                      </svg>
                    </div>
                    <span className="text-[#a2abb3] text-sm font-medium leading-normal">Channels</span>
                  </Link>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#2c3135]">
                    <div className="text-white" data-icon="FilmSlate" data-size="24px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M216,104H102.09L210,75.51a8,8,0,0,0,5.68-9.84l-8.16-30a15.93,15.93,0,0,0-19.42-11.13L35.81,64.74a15.75,15.75,0,0,0-9.7,7.4,15.51,15.51,0,0,0-1.55,12L32,111.56c0,.14,0,.29,0,.44v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V112A8,8,0,0,0,216,104ZM192.16,40l6,22.07-22.62,6L147.42,51.83Zm-66.69,17.6,28.12,16.24-36.94,9.75L88.53,67.37Zm-79.4,44.62-6-22.08,26.5-7L94.69,89.4ZM208,200H48V120H208v80Z"></path>
                      </svg>
                    </div>
                    <span className="text-white text-sm font-medium leading-normal">Clips</span>
                  </div>
                  <Link href="/uploads" className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#a2abb3]" data-icon="Upload" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M74.34,77.66a8,8,0,0,1,0-11.32l48-48a8,8,0,0,1,11.32,0l48,48a8,8,0,0,1-11.32,11.32L136,43.31V128a8,8,0,0,1-16,0V43.31L85.66,77.66A8,8,0,0,1,74.34,77.66ZM240,136v64a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V136a16,16,0,0,1,16-16h68a4,4,0,0,1,4,4v3.46c0,13.45,11,24.79,24.46,24.54A24,24,0,0,0,152,128v-4a4,4,0,0,1,4-4h68A16,16,0,0,1,240,136Zm-40,32a12,12,0,1,0-12,12A12,12,0,0,0,200,168Z"></path>
                      </svg>
                    </div>
                    <span className="text-[#a2abb3] text-sm font-medium leading-normal">Uploads</span>
                  </Link>
                  <Link href="/workflows" className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#a2abb3]" data-icon="Gear" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
                      </svg>
                    </div>
                    <span className="text-[#a2abb3] text-sm font-medium leading-normal">Workflows</span>
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#a2abb3]" data-icon="Gear" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
                      </svg>
                    </div>
                    <span className="text-[#a2abb3] text-sm font-medium leading-normal">Settings</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
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
                    {[1, 2, 3, 4, 5].map((clipId) => (
                      <tr key={clipId} className="border-b border-[#40484f]">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedClips.includes(String(clipId))}
                            onChange={() => handleClipSelect(String(clipId))}
                            className="w-4 h-4 text-[#7047eb] bg-[#2c3135] border-[#40484f] rounded focus:ring-[#7047eb] focus:ring-2"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-16 h-12 bg-[#2c3135] rounded border border-[#40484f] flex items-center justify-center">
                            <div className="text-[#a2abb3]" data-icon="Play" data-size="16px" data-weight="fill">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"></path>
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-white text-sm">
                          Amazing Gaming Moment #{clipId}
                        </td>
                        <td className="px-4 py-3 text-[#a2abb3] text-sm">
                          {clipId === 1 ? "TechStreamer" : 
                           clipId === 2 ? "GamingGuru" : 
                           clipId === 3 ? "LiveCoder" : 
                           clipId === 4 ? "StreamPro" : "GameMaster"}
                        </td>
                        <td className="px-4 py-3 text-[#a2abb3] text-sm">
                          {clipId}:3{clipId}
                        </td>
                        <td className="px-4 py-3 text-[#a2abb3] text-sm">
                          {clipId} hour{clipId === 1 ? '' : 's'} ago
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            clipId === 1 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                            clipId === 2 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
                            clipId === 3 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" :
                            clipId === 4 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                          }`}>
                            {clipId === 1 ? "Ready" :
                             clipId === 2 ? "Processing" :
                             clipId === 3 ? "Downloaded" :
                             clipId === 4 ? "Ready" :
                             "Uploaded"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button className="text-[#7047eb] hover:text-[#8b5cf6] text-sm font-medium">
                              Edit
                            </button>
                            <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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