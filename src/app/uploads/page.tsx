"use client";

import { useState } from "react";

export default function UploadsPage() {
  const [autoUploadEnabled, setAutoUploadEnabled] = useState(true);

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
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-white" data-icon="House" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
                      </svg>
                    </div>
                    <p className="text-white text-sm font-medium leading-normal">Dashboard</p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-white" data-icon="FilmSlate" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M216,104H102.09L210,75.51a8,8,0,0,0,5.68-9.84l-8.16-30a15.93,15.93,0,0,0-19.42-11.13L35.81,64.74a15.75,15.75,0,0,0-9.7,7.4,15.51,15.51,0,0,0-1.55,12L32,111.56c0,.14,0,.29,0,.44v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V112A8,8,0,0,0,216,104ZM192.16,40l6,22.07-22.62,6L147.42,51.83Zm-66.69,17.6,28.12,16.24-36.94,9.75L88.53,67.37Zm-79.4,44.62-6-22.08,26.5-7L94.69,89.4ZM208,200H48V120H208v80Z"></path>
                      </svg>
                    </div>
                    <p className="text-white text-sm font-medium leading-normal">Clips</p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#2c3135]">
                    <div className="text-white" data-icon="Upload" data-size="24px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M74.34,77.66a8,8,0,0,1,0-11.32l48-48a8,8,0,0,1,11.32,0l48,48a8,8,0,0,1-11.32,11.32L136,43.31V128a8,8,0,0,1-16,0V43.31L85.66,77.66A8,8,0,0,1,74.34,77.66ZM240,136v64a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V136a16,16,0,0,1,16-16h68a4,4,0,0,1,4,4v3.46c0,13.45,11,24.79,24.46,24.54A24,24,0,0,0,152,128v-4a4,4,0,0,1,4-4h68A16,16,0,0,1,240,136Zm-40,32a12,12,0,1,0-12,12A12,12,0,0,0,200,168Z"></path>
                      </svg>
                    </div>
                    <p className="text-white text-sm font-medium leading-normal">Uploads</p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-white" data-icon="Gear" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
                      </svg>
                    </div>
                    <p className="text-white text-sm font-medium leading-normal">Settings</p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-white" data-icon="Question" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                      </svg>
                    </div>
                    <p className="text-white text-sm font-medium leading-normal">Help</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">Uploads</p>
                <p className="text-[#a2abb3] text-sm font-normal leading-normal">Manage your YouTube uploads and channels</p>
              </div>
            </div>

            {/* Upload Status */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Upload Status</h2>
            <div className="flex flex-col gap-3 p-4">
              <div className="flex gap-6 justify-between">
                <p className="text-white text-base font-medium leading-normal">Uploading: Viral Clip Compilation #3</p>
              </div>
              <div className="rounded bg-[#40484f]">
                <div className="h-2 rounded bg-white" style={{ width: "75%" }}></div>
              </div>
              <p className="text-[#a2abb3] text-sm font-normal leading-normal">Estimated time remaining: 15 minutes</p>
            </div>

            {/* Published Videos */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Published Videos</h2>
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-xl border border-[#40484f] bg-[#121416]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#1e2124]">
                      <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Video Title</th>
                      <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Views</th>
                      <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Likes</th>
                      <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Comments</th>
                      <th className="px-4 py-3 text-left text-white w-60 text-sm font-medium leading-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
                        Top 5 Epic Fails in Gaming - June 2024
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">12,500</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">350</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">75</td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#2c3135] text-white text-sm font-medium leading-normal w-full">
                          <span className="truncate">Published</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
                        Best Moments in Streaming - Week of June 10th
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">8,200</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">210</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">45</td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#2c3135] text-white text-sm font-medium leading-normal w-full">
                          <span className="truncate">Published</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
                        Funny Reactions to Unexpected Game Glitches
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">5,900</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">150</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">30</td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#2c3135] text-white text-sm font-medium leading-normal w-full">
                          <span className="truncate">Published</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
                        Pro Gamer Highlights - Clutch Plays
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">3,100</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">80</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">15</td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#2c3135] text-white text-sm font-medium leading-normal w-full">
                          <span className="truncate">Published</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
                        Behind the Scenes: Editing My Latest Video
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">1,800</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">40</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#a2abb3] text-sm font-normal leading-normal">5</td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#2c3135] text-white text-sm font-medium leading-normal w-full">
                          <span className="truncate">Published</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* YouTube Channel */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">YouTube Channel</h2>
            <div className="flex items-center gap-4 bg-[#121416] px-4 min-h-[72px] py-2">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCOnt_qP4ylQjWhOb7G2dBHFOIyXFcF6zVD8jwQJGq794nvZ2aby1S7PbuNv3rFWobaOg5kc4cpcLvETudTG1BSS53otAkcfafvEbXT_Z6D2eqV5VSxVlXfphH3pBrjk6MUoii5uPqLd7Tpjhp11zj_JhqgDCq4maDnEwQHHXOnMRDs-F5bwIdsq5UyVMiTYMmRTdhGgmuOMzt8F_V504rLSwpU2J8I5Xv9XsqMPdQ2JXG89ZmuIqR3jsF67zAJNcoox5uBbmggs01P")'
                }}
              ></div>
              <div className="flex flex-col justify-center">
                <p className="text-white text-base font-medium leading-normal line-clamp-1">MyGamingChannel</p>
                <p className="text-[#a2abb3] text-sm font-normal leading-normal line-clamp-2">Connected</p>
              </div>
            </div>

            {/* Automatic Uploads */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Automatic Uploads</h2>
            <div className="flex items-center gap-4 bg-[#121416] px-4 min-h-[72px] py-2 justify-between">
              <div className="flex flex-col justify-center">
                <p className="text-white text-base font-medium leading-normal line-clamp-1">Upload New Clips Automatically</p>
                <p className="text-[#a2abb3] text-sm font-normal leading-normal line-clamp-2">
                  {autoUploadEnabled ? "Enabled" : "Disabled"}
                </p>
              </div>
              <div className="shrink-0">
                <label
                  className={`relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none p-0.5 ${
                    autoUploadEnabled ? "justify-end bg-[#dce8f3]" : "justify-start bg-[#2c3135]"
                  }`}
                >
                  <div 
                    className="h-full w-[27px] rounded-full bg-white transition-all duration-200" 
                    style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px" }}
                  ></div>
                  <input 
                    type="checkbox" 
                    className="invisible absolute" 
                    checked={autoUploadEnabled}
                    onChange={() => setAutoUploadEnabled(!autoUploadEnabled)}
                  />
                </label>
              </div>
            </div>

            {/* Analytics */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Analytics</h2>
            <div className="flex flex-wrap gap-4 p-4">
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#40484f]">
                <p className="text-white text-base font-medium leading-normal">Total Views</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">25,000</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#40484f]">
                <p className="text-white text-base font-medium leading-normal">Total Likes</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">750</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#40484f]">
                <p className="text-white text-base font-medium leading-normal">Total Comments</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">150</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 