"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function ClipsPage() {
  const [selectedClips, setSelectedClips] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleSelectAll = () => {
    if (selectedClips.length === 5) {
      setSelectedClips([]);
    } else {
      setSelectedClips(["1", "2", "3", "4", "5"]);
    }
  };

  const handleSelectClip = (clipId: string) => {
    setSelectedClips(prev => {
      if (prev.includes(clipId)) {
        return prev.filter(id => id !== clipId);
      } else {
        return [...prev, clipId];
      }
    });
  };

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
                    Clips
                  </h1>
                  <p className="text-[#a2abb3] text-base font-normal leading-normal">
                    Manage your downloaded and processed clips
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => console.log('Upload selected clips')}
                    disabled={selectedClips.length === 0}
                    className={`flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 ${
                      selectedClips.length === 0 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-[#2c90ea] text-white hover:bg-[#247bc7]'
                    } text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200`}
                  >
                    <span className="mr-2">⬆️</span>
                    <span>Upload Selected ({selectedClips.length})</span>
                  </button>
                  
                  <button 
                    onClick={() => console.log('Delete selected clips')}
                    disabled={selectedClips.length === 0}
                    className={`flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 ${
                      selectedClips.length === 0 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    } text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200`}
                  >
                    <span className="mr-2">🗑️</span>
                    <span>Delete Selected</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <label className="text-[#a2abb3] text-sm font-medium">Status:</label>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-[#2c3135] rounded-lg px-3 py-2 text-sm bg-[#1c1f22] text-white"
                  >
                    <option value="all">All</option>
                    <option value="ready">Ready</option>
                    <option value="processing">Processing</option>
                    <option value="downloaded">Downloaded</option>
                    <option value="uploaded">Uploaded</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-[#a2abb3] text-sm font-medium">Channel:</label>
                  <select className="border border-[#2c3135] rounded-lg px-3 py-2 text-sm bg-[#1c1f22] text-white">
                    <option value="all">All Channels</option>
                    <option value="ninja">Ninja</option>
                    <option value="pokimane">Pokimane</option>
                    <option value="shroud">Shroud</option>
                  </select>
                </div>
              </div>

              {/* Clips Table */}
              <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead className="bg-[#2c3135]">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input 
                          type="checkbox" 
                          checked={selectedClips.length === 5}
                          onChange={handleSelectAll}
                          className="rounded bg-[#1c1f22] border-[#2c3135]"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-[#a2abb3] text-sm font-medium">Preview</th>
                      <th className="px-6 py-4 text-left text-[#a2abb3] text-sm font-medium">Description</th>
                      <th className="px-6 py-4 text-left text-[#a2abb3] text-sm font-medium">Creator</th>
                      <th className="px-6 py-4 text-left text-[#a2abb3] text-sm font-medium">Duration</th>
                      <th className="px-6 py-4 text-left text-[#a2abb3] text-sm font-medium">Uploaded</th>
                      <th className="px-6 py-4 text-left text-[#a2abb3] text-sm font-medium">Status</th>
                      <th className="px-6 py-4 text-left text-[#a2abb3] text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2c3135]">
                    {[1, 2, 3, 4, 5].map((clipId) => (
                      <tr key={clipId} className="hover:bg-[#2c3135]/50">
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            checked={selectedClips.includes(clipId.toString())}
                            onChange={() => handleSelectClip(clipId.toString())}
                            className="rounded bg-[#1c1f22] border-[#2c3135]"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <button className="flex items-center justify-center w-12 h-8 bg-blue-900/30 rounded-lg hover:bg-blue-900/50 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-blue-400" viewBox="0 0 256 256">
                              <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"></path>
                            </svg>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium">Amazing Gaming Moment #{clipId}</p>
                            <p className="text-[#a2abb3] text-sm">Epic gameplay highlight</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#a2abb3]">
                          {clipId === 1 ? "Ninja" : clipId === 2 ? "Pokimane" : clipId === 3 ? "Shroud" : clipId === 4 ? "xQc" : "TimTheTatman"}
                        </td>
                        <td className="px-6 py-4 text-[#a2abb3]">{clipId}:3{clipId}</td>
                        <td className="px-6 py-4 text-[#a2abb3]">{clipId} hour{clipId > 1 ? 's' : ''} ago</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            clipId === 1 ? 'bg-green-900/30 text-green-400' :
                            clipId === 2 ? 'bg-yellow-900/30 text-yellow-400' :
                            clipId === 3 ? 'bg-blue-900/30 text-blue-400' :
                            clipId === 4 ? 'bg-purple-900/30 text-purple-400' :
                            'bg-green-900/30 text-green-400'
                          }`}>
                            {clipId === 1 ? "Ready" : clipId === 2 ? "Processing" : clipId === 3 ? "Downloaded" : clipId === 4 ? "Uploaded" : "Ready"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
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
          </div>
        </div>
      </div>
    </div>
  );
} 