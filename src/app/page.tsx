"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#121416] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Sidebar */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="text-white text-base font-bold leading-tight">Dashboard</h2>
                  <p className="text-[#a2abb3] text-sm font-normal leading-normal">Manage your clips and workflows</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#2c3135] text-white cursor-pointer">
                    <div data-icon="Grid3x3" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M80,48V80H48V48ZM48,208V176H80v32Zm128-32V208H144V176ZM80,128v32H48V128Zm96,0v32H144V128ZM80,96V128H48V96ZM208,48V80H176V48ZM176,128h32v32H176Zm32-32H176V96h32ZM176,208h32V176H176ZM112,80V48h32V80Zm0,48V96h32v32Zm0,48V144h32v32Zm0,48V176h32v32Z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium leading-normal">Dashboard</span>
                  </Link>
                  <Link href="/channels" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#a2abb3] cursor-pointer hover:bg-[#2c3135] hover:text-white">
                    <div data-icon="Monitor" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40ZM48,56H208a8,8,0,0,1,8,8v80H40V64A8,8,0,0,1,48,56ZM208,184H48a8,8,0,0,1-8-8V160H216v16A8,8,0,0,1,208,184ZM165.66,196.66a8,8,0,0,1-11.32,0L128,170.34l-26.34,26.32a8,8,0,0,1-11.32-11.32L116.69,159H80a8,8,0,0,1,0-16h96a8,8,0,0,1,0,16H139.31l26.35,26.34A8,8,0,0,1,165.66,196.66Z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium leading-normal">Channels</span>
                  </Link>
                  <Link href="/workflows" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#a2abb3] cursor-pointer hover:bg-[#2c3135] hover:text-white">
                    <div data-icon="Wrench" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M227.31,73.37,182.63,118.05a8,8,0,0,1-5.66,2.34L144.68,120a8,8,0,0,0-7.85,2.55l-47.93,55.1a8,8,0,0,0,6,13.35h7.88a8,8,0,0,1,5.65,2.34l9.9,9.9a8,8,0,0,1,0,11.32L105,227.9a16,16,0,0,1-22.62,0L49.05,194.58a16,16,0,0,1,0-22.63L61.4,159.6a8,8,0,0,1,11.32,0l9.9,9.9a8,8,0,0,1,2.34,5.65v7.88a8,8,0,0,0,13.35,6l55.1-47.93a8,8,0,0,0,2.55-7.85L155.95,101a8,8,0,0,1,2.34-5.66L202.63,50.69a39.32,39.32,0,0,1,55.68,0A39.32,39.32,0,0,1,227.31,73.37ZM216,62.06A23.31,23.31,0,0,0,183,62.06a8,8,0,0,1,0,11.31L185.94,76.3a8,8,0,0,1,11.32,0A23.31,23.31,0,0,0,216,73.37V62.06Z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium leading-normal">Workflows</span>
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#a2abb3] cursor-pointer hover:bg-[#2c3135] hover:text-white">
                    <div data-icon="Gear" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3.18-3.18L186.05,40.54a8,8,0,0,0-3.93-6,107.29,107.29,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3.18,3.18L40.54,69.94a8,8,0,0,0-6,3.93,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.6,107.6,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3.18,3.18L69.94,215.46a8,8,0,0,0,3.93,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3.18-3.18L215.46,186.05a8,8,0,0,0,6-3.93,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06ZM128,192a64,64,0,1,1,64-64A64.07,64.07,0,0,1,128,192Z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium leading-normal">Settings</span>
                  </Link>
                  <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#a2abb3] cursor-pointer hover:bg-[#2c3135] hover:text-white">
                    <div data-icon="Question" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium leading-normal">Help</span>
                  </button>
                </div>
              </div>
              {/* Main content */}
              <div className="flex min-w-72 flex-col gap-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1 rounded-xl bg-[#1c1f22] p-4">
                    <div className="text-[#a2abb3] text-base font-medium leading-normal">Downloaded Clips</div>
                    <div className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">1,247</div>
                  </div>
                  <div className="flex flex-col gap-1 rounded-xl bg-[#1c1f22] p-4">
                    <div className="text-[#a2abb3] text-base font-medium leading-normal">Processed Clips</div>
                    <div className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">892</div>
                  </div>
                  <div className="flex flex-col gap-1 rounded-xl bg-[#1c1f22] p-4">
                    <div className="text-[#a2abb3] text-base font-medium leading-normal">Uploaded Clips</div>
                    <div className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">743</div>
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="flex flex-col gap-3 rounded-xl bg-[#1c1f22] p-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Performance (Last 30 Days)</h3>
                    <p className="text-[#a2abb3] text-sm font-normal leading-normal">Clip processing metrics</p>
                  </div>
                  <div className="h-40 bg-[#2c3135] rounded-lg flex items-center justify-center">
                    <span className="text-[#a2abb3]">Chart placeholder</span>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="flex flex-col gap-3 rounded-xl bg-[#1c1f22] p-4">
                  <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Recent Activity</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3 py-2">
                      <div className="size-8 rounded-full bg-[#2c3135] flex items-center justify-center">
                        <div className="text-white size-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M224,128a96,96,0,1,1-96-96A96.11,96.11,0,0,1,224,128Z" opacity="0.2" />
                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v52h24A8,8,0,0,1,168,148Z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-white text-sm font-medium leading-normal">Clip processing completed</p>
                        <p className="text-[#a2abb3] text-xs font-normal leading-normal">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3 py-2">
                      <div className="size-8 rounded-full bg-[#2c3135] flex items-center justify-center">
                        <div className="text-white size-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M224,128a96,96,0,1,1-96-96A96.11,96.11,0,0,1,224,128Z" opacity="0.2" />
                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v52h24A8,8,0,0,1,168,148Z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-white text-sm font-medium leading-normal">New workflow started</p>
                        <p className="text-[#a2abb3] text-xs font-normal leading-normal">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3 py-2">
                      <div className="size-8 rounded-full bg-[#2c3135] flex items-center justify-center">
                        <div className="text-white size-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M224,128a96,96,0,1,1-96-96A96.11,96.11,0,0,1,224,128Z" opacity="0.2" />
                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v52h24A8,8,0,0,1,168,148Z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-white text-sm font-medium leading-normal">Channel updated</p>
                        <p className="text-[#a2abb3] text-xs font-normal leading-normal">10 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Workflows */}
                <div className="flex flex-col gap-3 rounded-xl bg-[#1c1f22] p-4">
                  <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Active Workflows</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex flex-col gap-1">
                        <p className="text-white text-sm font-medium leading-normal">Gaming Highlights</p>
                        <p className="text-[#a2abb3] text-xs font-normal leading-normal">Processing 12 clips</p>
                      </div>
                      <div className="text-green-400 text-xs font-medium">Active</div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex flex-col gap-1">
                        <p className="text-white text-sm font-medium leading-normal">Music Videos</p>
                        <p className="text-[#a2abb3] text-xs font-normal leading-normal">Uploading 8 clips</p>
                      </div>
                      <div className="text-yellow-400 text-xs font-medium">Uploading</div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex flex-col gap-1">
                        <p className="text-white text-sm font-medium leading-normal">Daily Streams</p>
                        <p className="text-[#a2abb3] text-xs font-normal leading-normal">Queued for processing</p>
                      </div>
                      <div className="text-blue-400 text-xs font-medium">Queued</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#7047eb] text-white text-sm font-bold leading-normal tracking-[0.015em] flex-1">
                    Start Automation
                  </button>
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2c3135] text-white text-sm font-bold leading-normal tracking-[0.015em] flex-1">
                    Add Channel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
