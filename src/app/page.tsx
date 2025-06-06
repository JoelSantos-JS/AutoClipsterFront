"use client";

import { useState } from "react";
import Link from "next/link";
import { useChannels } from '../hooks/useChannels';
import { useClips } from '../hooks/useClips';
import Sidebar from "../components/Sidebar";

export default function Home() {
  const [isStarting, setIsStarting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAutomating, setIsAutomating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState("");

  const { channels, loading: channelsLoading, error: channelsError } = useChannels();
  const { clips, loading: clipsLoading, error: clipsError } = useClips();

  // Calculate clip statistics
  const clipStats = {
    total: clips.length,
    downloaded: clips.filter(clip => clip.downloadStatus === 'COMPLETED').length,
    processing: clips.filter(clip => clip.downloadStatus === 'PROCESSING').length,
    ready: clips.filter(clip => clip.downloadStatus === 'COMPLETED').length
  };

  const handleStart = async () => {
    setIsStarting(true);
    try {
      // Simulate starting automation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsAutomating(true);
    } catch (error) {
      console.error('Error starting automation:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const handleDownloadClips = async () => {
    setIsDownloading(true);
    try {
      // Simulate downloading clips
      await new Promise(resolve => setTimeout(resolve, 3000));
      setDownloadSuccess("Clips downloaded successfully!");
      setTimeout(() => setDownloadSuccess(""), 5000);
    } catch (error) {
      console.error('Error downloading clips:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#121416] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex h-full flex-1">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="layout-content-container flex flex-col flex-1">
            {/* Main Content Area */}
            <div className="flex flex-col bg-[#121416] p-8 flex-1 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-white text-[32px] font-bold leading-tight tracking-[-0.015em]">
                    Dashboard
                  </h1>
                  <p className="text-[#a2abb3] text-base font-normal leading-normal">
                    Manage your automated clip generation
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleStart}
                    disabled={isStarting || isAutomating}
                    className={`flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-row-reverse ${
                      isAutomating ? 'bg-green-600 text-white' : 'bg-[#2c90ea] text-white hover:bg-[#247bc7]'
                    } text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200`}
                  >
                    {isStarting ? (
                      <span className="animate-spin">⏳</span>
                    ) : isAutomating ? (
                      <>
                        <span className="ml-2">🔄</span>
                        <span>Automation Running</span>
                      </>
                    ) : (
                      <>
                        <span className="ml-2">▶️</span>
                        <span>Start Automation</span>
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={handleDownloadClips}
                    disabled={isDownloading || clips.length === 0}
                    className={`flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 ${
                      clips.length === 0 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-[#34c759] text-white hover:bg-[#2ea043]'
                    } text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200`}
                  >
                    {isDownloading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <span className="mr-2">⬇️</span>
                        <span>Download Clips</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {(channelsError || clipsError) && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 font-semibold">Error:</p>
                  <p className="text-red-300">{channelsError || clipsError}</p>
                </div>
              )}

              {/* Success Message */}
              {downloadSuccess && (
                <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 font-semibold">Success!</p>
                  <p className="text-green-300">{downloadSuccess}</p>
                </div>
              )}

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#a2abb3] text-sm font-medium">Total Clips</p>
                      <p className="text-white text-2xl font-bold">{clipStats.total}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 text-xl">📹</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#a2abb3] text-sm font-medium">Downloaded</p>
                      <p className="text-white text-2xl font-bold">{clipStats.downloaded}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-green-400 text-xl">⬇️</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#a2abb3] text-sm font-medium">Processing</p>
                      <p className="text-white text-2xl font-bold">{clipStats.processing}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-400 text-xl">⏳</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#a2abb3] text-sm font-medium">Ready</p>
                      <p className="text-white text-2xl font-bold">{clipStats.ready}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-purple-400 text-xl">✅</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6 shadow-sm">
                <h2 className="text-white text-xl font-bold mb-4">Recent Activity</h2>
                
                {/* Loading state */}
                {(channelsLoading || clipsLoading) && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                    <span className="ml-3 text-[#a2abb3]">Loading...</span>
                  </div>
                )}

                {/* Automation Status */}
                {!channelsLoading && !clipsLoading && (
                  <div className={`p-4 rounded-lg mb-4 ${
                    isAutomating ? 'bg-green-900/20 border border-green-500/30' : 'bg-[#1c1f22] border border-[#2c3135]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          isAutomating ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
                        }`}></div>
                        <span className={`font-medium ${
                          isAutomating ? 'text-green-300' : 'text-[#a2abb3]'
                        }`}>
                          Automation Status
                        </span>
                      </div>
                      <span className={`text-sm ${
                        isAutomating ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {isAutomating ? 'Running' : 'Stopped'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Channels Summary */}
                {channels.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold">Active Channels ({channels.length})</h3>
                    {channels.slice(0, 3).map((channel) => (
                      <div key={channel.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">
                              {channel.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{channel.name}</p>
                            <p className="text-[#a2abb3] text-sm">@{channel.url}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[#a2abb3] text-sm">Last checked</p>
                          <p className="text-white text-sm font-medium">
                            {new Date(channel.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {channels.length > 3 && (
                      <Link href="/channels" className="block text-blue-400 hover:text-blue-300 text-sm font-medium">
                        View all {channels.length} channels →
                      </Link>
                    )}
                  </div>
                )}

                {/* No data state */}
                {!channelsLoading && !clipsLoading && channels.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-[#a2abb3] mb-4">No channels configured yet</p>
                    <Link 
                      href="/channels" 
                      className="inline-flex items-center justify-center px-4 py-2 bg-[#2c90ea] text-white rounded-lg hover:bg-[#247bc7] transition-colors"
                    >
                      Add Your First Channel
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
