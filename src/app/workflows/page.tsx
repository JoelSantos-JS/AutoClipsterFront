"use client";

import { useState } from "react";

export default function WorkflowsPage() {
  const [selectedTab, setSelectedTab] = useState("active");
  const [newWorkflowName, setNewWorkflowName] = useState("");

  const handleCreateWorkflow = () => {
    if (newWorkflowName.trim()) {
      console.log("Creating workflow:", newWorkflowName);
      setNewWorkflowName("");
    }
  };

  const handlePauseWorkflow = (workflowName: string) => {
    console.log("Pausing workflow:", workflowName);
  };

  const handleStopWorkflow = (workflowName: string) => {
    console.log("Stopping workflow:", workflowName);
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-white tracking-light text-[32px] font-bold leading-tight">Workflows</p>
            <p className="text-[#a2abb3] text-sm font-normal leading-normal">Automate your clip processing and management</p>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#7047eb] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              onClick={() => document.getElementById('create-workflow')?.scrollIntoView()}
            >
              Create Workflow
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 p-4">
          <button 
            className={`flex items-center justify-center h-10 px-4 rounded-xl text-sm font-medium ${
              selectedTab === "active" 
                ? "bg-[#7047eb] text-white" 
                : "bg-[#2c3135] text-[#a2abb3] hover:text-white"
            }`}
            onClick={() => setSelectedTab("active")}
          >
            Active Workflows
          </button>
          <button 
            className={`flex items-center justify-center h-10 px-4 rounded-xl text-sm font-medium ${
              selectedTab === "templates" 
                ? "bg-[#7047eb] text-white" 
                : "bg-[#2c3135] text-[#a2abb3] hover:text-white"
            }`}
            onClick={() => setSelectedTab("templates")}
          >
            Templates
          </button>
          <button 
            className={`flex items-center justify-center h-10 px-4 rounded-xl text-sm font-medium ${
              selectedTab === "history" 
                ? "bg-[#7047eb] text-white" 
                : "bg-[#2c3135] text-[#a2abb3] hover:text-white"
            }`}
            onClick={() => setSelectedTab("history")}
          >
            History
          </button>
        </div>

        {/* Active Workflows Tab */}
        {selectedTab === "active" && (
          <>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Active Workflows</h2>
            <div className="flex flex-col gap-4 p-4">
              {/* Workflow Card 1 */}
              <div className="flex flex-col gap-4 rounded-xl border border-[#40484f] bg-[#1e2124] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#22c55e] rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L120,140.69l42.34-42.35a8,8,0,0,1,11.32,11.32Z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-semibold">Gaming Highlights Processor</h3>
                      <p className="text-[#a2abb3] text-sm">Processes gaming clips from TechStreamer channel</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#22c55e] text-white text-xs px-2 py-1 rounded-full font-medium">Active</span>
                    <button 
                      className="p-2 rounded-lg bg-[#2c3135] text-white hover:bg-[#40484f]"
                      onClick={() => handlePauseWorkflow("Gaming Highlights Processor")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M200,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H160V48h40ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Zm0,176H56V48H96Z"/>
                      </svg>
                    </button>
                    <button 
                      className="p-2 rounded-lg bg-[#2c3135] text-white hover:bg-[#40484f]"
                      onClick={() => handleStopWorkflow("Gaming Highlights Processor")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M208,48H48A16,16,0,0,0,32,64V192a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V64A16,16,0,0,0,208,48Zm0,144H48V64H208V192Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-[#a2abb3] text-xs">Clips Processed</p>
                    <p className="text-white text-lg font-semibold">247</p>
                  </div>
                  <div>
                    <p className="text-[#a2abb3] text-xs">Success Rate</p>
                    <p className="text-white text-lg font-semibold">98.5%</p>
                  </div>
                  <div>
                    <p className="text-[#a2abb3] text-xs">Avg Processing Time</p>
                    <p className="text-white text-lg font-semibold">3.2s</p>
                  </div>
                  <div>
                    <p className="text-[#a2abb3] text-xs">Last Run</p>
                    <p className="text-white text-lg font-semibold">2 min ago</p>
                  </div>
                </div>
                <div className="w-full bg-[#2c3135] rounded-full h-2">
                  <div className="bg-[#22c55e] h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-[#a2abb3] text-sm">Currently processing: "Epic Comeback Moments #3"</p>
              </div>

              {/* Workflow Card 2 */}
              <div className="flex flex-col gap-4 rounded-xl border border-[#40484f] bg-[#1e2124] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#eab308] rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v52h24A8,8,0,0,1,168,148Z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-semibold">Music Video Uploader</h3>
                      <p className="text-[#a2abb3] text-sm">Uploads processed clips to YouTube</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#eab308] text-white text-xs px-2 py-1 rounded-full font-medium">Processing</span>
                    <button 
                      className="p-2 rounded-lg bg-[#2c3135] text-white hover:bg-[#40484f]"
                      onClick={() => handlePauseWorkflow("Music Video Uploader")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M200,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H160V48h40ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Zm0,176H56V48H96Z"/>
                      </svg>
                    </button>
                    <button 
                      className="p-2 rounded-lg bg-[#2c3135] text-white hover:bg-[#40484f]"
                      onClick={() => handleStopWorkflow("Music Video Uploader")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M208,48H48A16,16,0,0,0,32,64V192a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V64A16,16,0,0,0,208,48Zm0,144H48V64H208V192Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-[#a2abb3] text-xs">Videos Uploaded</p>
                    <p className="text-white text-lg font-semibold">89</p>
                  </div>
                  <div>
                    <p className="text-[#a2abb3] text-xs">Success Rate</p>
                    <p className="text-white text-lg font-semibold">95.2%</p>
                  </div>
                  <div>
                    <p className="text-[#a2abb3] text-xs">Avg Upload Time</p>
                    <p className="text-white text-lg font-semibold">12.5s</p>
                  </div>
                  <div>
                    <p className="text-[#a2abb3] text-xs">Queue Size</p>
                    <p className="text-white text-lg font-semibold">3 clips</p>
                  </div>
                </div>
                <div className="w-full bg-[#2c3135] rounded-full h-2">
                  <div className="bg-[#eab308] h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-[#a2abb3] text-sm">Currently uploading: "Beat Drop Compilation Vol. 2"</p>
              </div>

              {/* Workflow Card 3 */}
              <div className="flex flex-col gap-4 rounded-xl border border-[#40484f] bg-[#1e2124] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#3b82f6] rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM160,128a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h72A8,8,0,0,1,160,128Z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-semibold">Daily Stream Monitor</h3>
                      <p className="text-[#a2abb3] text-sm">Monitors live streams for clip opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#3b82f6] text-white text-xs px-2 py-1 rounded-full font-medium">Waiting</span>
                    <button 
                      className="p-2 rounded-lg bg-[#2c3135] text-white hover:bg-[#40484f]"
                      onClick={() => handlePauseWorkflow("Daily Stream Monitor")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M200,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H160V48h40ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Zm0,176H56V48H96Z"/>
                      </svg>
                    </button>
                    <button 
                      className="p-2 rounded-lg bg-[#2c3135] text-white hover:bg-[#40484f]"
                      onClick={() => handleStopWorkflow("Daily Stream Monitor")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M208,48H48A16,16,0,0,0,32,64V192a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V64A16,16,0,0,0,208,48Zm0,144H48V64H208V192Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-[#a2abb3] text-xs">Streams Monitored</p>
                    <p className="text-white text-lg font-semibold">15</p>
                  </div>
                  <div>
                    <p className="text-[#a2abb3] text-xs">Clips Found</p>
                    <p className="text-white text-lg font-semibold">342</p>
                  </div>
                  <div>
                    <p className="text-[#a2abb3] text-xs">Avg Quality Score</p>
                    <p className="text-white text-lg font-semibold">8.7/10</p>
                  </div>
                  <div>
                    <p className="text-[#a2abb3] text-xs">Next Check</p>
                    <p className="text-white text-lg font-semibold">5 min</p>
                  </div>
                </div>
                <div className="w-full bg-[#2c3135] rounded-full h-2">
                  <div className="bg-[#3b82f6] h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <p className="text-[#a2abb3] text-sm">Waiting for next scheduled check...</p>
              </div>
            </div>
          </>
        )}

        {/* Templates Tab */}
        {selectedTab === "templates" && (
          <>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Workflow Templates</h2>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="flex flex-col gap-3 rounded-xl border border-[#40484f] bg-[#1e2124] p-4">
                <h3 className="text-white text-lg font-semibold">Gaming Clip Processor</h3>
                <p className="text-[#a2abb3] text-sm">Automatically process gaming clips with highlights detection</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-[#2c3135] text-[#a2abb3] text-xs px-2 py-1 rounded">Twitch</span>
                  <span className="bg-[#2c3135] text-[#a2abb3] text-xs px-2 py-1 rounded">YouTube</span>
                  <span className="bg-[#2c3135] text-[#a2abb3] text-xs px-2 py-1 rounded">Auto-edit</span>
                </div>
                <button className="flex items-center justify-center h-10 px-4 bg-[#7047eb] text-white text-sm font-bold rounded-xl">
                  Use Template
                </button>
              </div>
              
              <div className="flex flex-col gap-3 rounded-xl border border-[#40484f] bg-[#1e2124] p-4">
                <h3 className="text-white text-lg font-semibold">Music Video Uploader</h3>
                <p className="text-[#a2abb3] text-sm">Upload processed clips to multiple platforms automatically</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-[#2c3135] text-[#a2abb3] text-xs px-2 py-1 rounded">YouTube</span>
                  <span className="bg-[#2c3135] text-[#a2abb3] text-xs px-2 py-1 rounded">TikTok</span>
                  <span className="bg-[#2c3135] text-[#a2abb3] text-xs px-2 py-1 rounded">Instagram</span>
                </div>
                <button className="flex items-center justify-center h-10 px-4 bg-[#7047eb] text-white text-sm font-bold rounded-xl">
                  Use Template
                </button>
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-[#40484f] bg-[#1e2124] p-4">
                <h3 className="text-white text-lg font-semibold">Stream Monitor</h3>
                <p className="text-[#a2abb3] text-sm">Monitor live streams and detect viral moments</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-[#2c3135] text-[#a2abb3] text-xs px-2 py-1 rounded">Live Detection</span>
                  <span className="bg-[#2c3135] text-[#a2abb3] text-xs px-2 py-1 rounded">AI Analysis</span>
                  <span className="bg-[#2c3135] text-[#a2abb3] text-xs px-2 py-1 rounded">Real-time</span>
                </div>
                <button className="flex items-center justify-center h-10 px-4 bg-[#7047eb] text-white text-sm font-bold rounded-xl">
                  Use Template
                </button>
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-[#40484f] bg-[#1e2124] p-4">
                <h3 className="text-white text-lg font-semibold">Social Media Publisher</h3>
                <p className="text-[#a2abb3] text-sm">Cross-platform publishing with optimal timing</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-[#2c3135] text-[#a2abb3] text-xs px-2 py-1 rounded">Multi-platform</span>
                  <span className="bg-[#2c3135] text-[#a2abb3] text-xs px-2 py-1 rounded">Scheduling</span>
                  <span className="bg-[#2c3135] text-[#a2abb3] text-xs px-2 py-1 rounded">Analytics</span>
                </div>
                <button className="flex items-center justify-center h-10 px-4 bg-[#7047eb] text-white text-sm font-bold rounded-xl">
                  Use Template
                </button>
              </div>
            </div>
          </>
        )}

        {/* History Tab */}
        {selectedTab === "history" && (
          <>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Workflow History</h2>
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-xl border border-[#40484f] bg-[#121416]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#1e2124]">
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Workflow Name</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Duration</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Items Processed</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="h-[72px] px-4 py-2 text-white text-sm">Gaming Highlights Processor</td>
                      <td className="h-[72px] px-4 py-2"><span className="bg-[#22c55e] text-white text-xs px-2 py-1 rounded-full">Completed</span></td>
                      <td className="h-[72px] px-4 py-2 text-[#a2abb3] text-sm">2h 15m</td>
                      <td className="h-[72px] px-4 py-2 text-[#a2abb3] text-sm">24 clips</td>
                      <td className="h-[72px] px-4 py-2 text-[#a2abb3] text-sm">2 hours ago</td>
                    </tr>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="h-[72px] px-4 py-2 text-white text-sm">Music Video Uploader</td>
                      <td className="h-[72px] px-4 py-2"><span className="bg-[#ef4444] text-white text-xs px-2 py-1 rounded-full">Failed</span></td>
                      <td className="h-[72px] px-4 py-2 text-[#a2abb3] text-sm">45m</td>
                      <td className="h-[72px] px-4 py-2 text-[#a2abb3] text-sm">3 videos</td>
                      <td className="h-[72px] px-4 py-2 text-[#a2abb3] text-sm">5 hours ago</td>
                    </tr>
                    <tr className="border-t border-t-[#40484f]">
                      <td className="h-[72px] px-4 py-2 text-white text-sm">Daily Stream Monitor</td>
                      <td className="h-[72px] px-4 py-2"><span className="bg-[#22c55e] text-white text-xs px-2 py-1 rounded-full">Completed</span></td>
                      <td className="h-[72px] px-4 py-2 text-[#a2abb3] text-sm">8h 30m</td>
                      <td className="h-[72px] px-4 py-2 text-[#a2abb3] text-sm">156 clips</td>
                      <td className="h-[72px] px-4 py-2 text-[#a2abb3] text-sm">1 day ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Create New Workflow Section */}
        <div id="create-workflow" className="mt-8 p-4">
          <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">Create New Workflow</h2>
          <div className="flex flex-col gap-4 rounded-xl border border-[#40484f] bg-[#1e2124] p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-white text-sm font-medium mb-2">Workflow Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-[#40484f] bg-[#2c3135] text-white placeholder-[#a2abb3] focus:outline-none focus:ring-2 focus:ring-[#7047eb]"
                  placeholder="Enter workflow name..."
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-white text-sm font-medium mb-2">Template</label>
                <select className="w-full px-4 py-2 rounded-xl border border-[#40484f] bg-[#2c3135] text-white focus:outline-none focus:ring-2 focus:ring-[#7047eb]">
                  <option>Custom Workflow</option>
                  <option>Gaming Clip Processor</option>
                  <option>Music Video Uploader</option>
                  <option>Stream Monitor</option>
                  <option>Social Media Publisher</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                className="flex items-center justify-center h-10 px-6 bg-[#7047eb] text-white text-sm font-bold rounded-xl"
                onClick={handleCreateWorkflow}
              >
                Create Workflow
              </button>
              <button className="flex items-center justify-center h-10 px-6 bg-[#2c3135] text-white text-sm font-bold rounded-xl">
                Save as Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 