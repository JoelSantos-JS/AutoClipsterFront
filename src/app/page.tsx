"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useChannels } from '../hooks/useChannels';
import { useClips } from '../hooks/useClips';
import { useMonitoring } from '../hooks/useMonitoring';
import Sidebar from "../components/Sidebar";

export default function Home() {
  const [showMonitoringDetails, setShowMonitoringDetails] = useState(false);
  const [automationLoading, setAutomationLoading] = useState(false);
  const [automationError, setAutomationError] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string>("");

  // Hooks
  const { 
    channels, 
    loading: channelsLoading, 
    error: channelsError,
    refreshChannels
  } = useChannels();
  
  const { 
    clips, 
    loading: clipsLoading, 
    error: clipsError,
    refreshClips
  } = useClips();

  const {
    // Dados
    status: monitoringStatus,
    stats: monitoringStats,

    // Estados de loading
    forceLoading,
    stopLoading,
    resumeLoading,

    // Mensagens
    error: monitoringError,
    successMessage: monitoringSuccess,

    // Operações principais
    loadAll: reloadMonitoring,
    forceMonitoring,
    stopMonitoring,
    resumeMonitoring,

    // Funções auxiliares
    isSystemHealthy,
    isMonitoringRunning,
    getSystemStatusIcon,
    formatNumber,
    formatLastRun,
  } = useMonitoring();

  // Calculate clip statistics
  const clipStats = useMemo(() => {
    if (!clips?.length) {
      return { total: 0, downloaded: 0, processing: 0, ready: 0 };
    }

    const downloaded = clips.filter(clip => clip.finalStatus === 'DOWNLOADED').length;
    const processing = clips.filter(clip => 
      clip.finalStatus === 'PROCESSING' || clip.finalStatus === 'UPLOADING'
    ).length;
    const ready = clips.filter(clip => 
      clip.finalStatus === 'READY' || clip.finalStatus === 'UPLOADED'
    ).length;

    return {
      total: clips.length,
      downloaded,
      processing,
      ready
    };
  }, [clips]);

  const handleStart = async () => {
    setAutomationLoading(true);
    try {
      // Simulate starting automation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh data
      await Promise.all([
        refreshChannels(),
        refreshClips(),
        reloadMonitoring()
      ]);
    } catch (error) {
      console.error('Error starting automation:', error);
      setAutomationError("Error starting automation. Please try again later.");
    } finally {
      setAutomationLoading(false);
    }
  };

  const handleDownloadClips = async () => {
    setIsDownloading(true);
    try {
      const readyClips = clips?.filter(clip => clip.finalStatus === 'READY') || [];
      if (readyClips.length === 0) {
        setDownloadSuccess("No clips ready for download found");
        return;
      }

      // Simulate downloading clips
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDownloadSuccess(`${readyClips.length} clips downloaded successfully!`);
      
      // Refresh clips data
      await refreshClips();
    } catch (error) {
      console.error('Error downloading clips:', error);
      setDownloadSuccess('Internal error downloading clips');
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
                    disabled={automationLoading}
                    className={`flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-row-reverse ${
                      automationLoading ? 'bg-green-600 text-white' : 'bg-[#2c90ea] text-white hover:bg-[#247bc7]'
                    } text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200`}
                  >
                    {automationLoading ? (
                      <span className="animate-spin">⏳</span>
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
              {(channelsError || clipsError || monitoringError) && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 font-semibold">Error:</p>
                  <p className="text-red-300">{channelsError || clipsError || monitoringError}</p>
                </div>
              )}

              {/* Success Message */}
              {(downloadSuccess || monitoringSuccess) && (
                <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 font-semibold">Success!</p>
                  <p className="text-green-300">{downloadSuccess || monitoringSuccess}</p>
                </div>
              )}

              {/* Automation Status */}
              {!channelsLoading && !clipsLoading && (
                <div className={`p-4 rounded-lg mb-4 ${
                  automationLoading ? 'bg-green-900/20 border border-green-500/30' : 'bg-[#1c1f22] border border-[#2c3135]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        automationLoading ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
                      }`}></div>
                      <span className={`font-medium ${
                        automationLoading ? 'text-green-300' : 'text-[#a2abb3]'
                      }`}>
                        Automation Status
                      </span>
                    </div>
                    <span className={`text-sm ${
                      automationLoading ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      {automationLoading ? 'Starting...' : 'Stopped'}
                    </span>
                  </div>
                </div>
              )}

              {/* Automation Error */}
              {automationError && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 font-semibold">Error:</p>
                  <p className="text-red-300">{automationError}</p>
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

              {/* Monitoring System Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white text-2xl font-bold">Monitoramento Automático</h2>
                  <button
                    onClick={() => setShowMonitoringDetails(!showMonitoringDetails)}
                    className="text-[#a2abb3] hover:text-white transition-colors"
                  >
                    {showMonitoringDetails ? '🔽' : '▶️'} Detalhes
                  </button>
                </div>

                {/* Monitoring Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {/* System Status */}
                  <div className={`bg-[#1c1f22] border rounded-xl p-6 shadow-sm ${
                    isSystemHealthy() ? 'border-green-500/30' : 'border-red-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#a2abb3] text-sm font-medium">Status do Sistema</p>
                        <div className="flex items-center mt-2">
                          <span className="text-2xl mr-2">{getSystemStatusIcon()}</span>
                          <p className={`text-lg font-bold ${
                            isSystemHealthy() ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {isSystemHealthy() ? 'Saudável' : 'Problemas'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monitoring Status */}
                  <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#a2abb3] text-sm font-medium">Monitoramento</p>
                        <div className="flex items-center mt-2">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            isMonitoringRunning() ? 'bg-blue-400 animate-pulse' : 'bg-gray-500'
                          }`}></div>
                          <p className={`text-lg font-bold ${
                            isMonitoringRunning() ? 'text-blue-400' : 'text-gray-400'
                          }`}>
                            {isMonitoringRunning() ? 'Executando' : 'Parado'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Channels */}
                  <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#a2abb3] text-sm font-medium">Canais Ativos</p>
                        <p className="text-white text-2xl font-bold">
                          {monitoringStatus?.activeChannels || 0}/{monitoringStatus?.totalChannels || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-cyan-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-cyan-400 text-xl">📺</span>
                      </div>
                    </div>
                  </div>

                  {/* Clips Discovered */}
                  <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#a2abb3] text-sm font-medium">Clips Descobertos (24h)</p>
                        <p className="text-white text-2xl font-bold">
                          {formatNumber(monitoringStatus?.clipsDiscoveredLast24h || 0)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-orange-400 text-xl">🔍</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monitoring Controls */}
                <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white text-lg font-semibold">Controles de Monitoramento</h3>
                      <p className="text-[#a2abb3] text-sm">
                        Última execução: {monitoringStatus?.lastFullRun ? formatLastRun(monitoringStatus.lastFullRun) : 'Nunca'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {isMonitoringRunning() ? (
                        <button
                          onClick={stopMonitoring}
                          disabled={stopLoading}
                          className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {stopLoading ? (
                            <span className="animate-spin mr-2">⏳</span>
                          ) : (
                            <span className="mr-2">⛔</span>
                          )}
                          Parar
                        </button>
                      ) : (
                        <button
                          onClick={resumeMonitoring}
                          disabled={resumeLoading}
                          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {resumeLoading ? (
                            <span className="animate-spin mr-2">⏳</span>
                          ) : (
                            <span className="mr-2">▶️</span>
                          )}
                          Retomar
                        </button>
                      )}
                      
                      <button
                        onClick={forceMonitoring}
                        disabled={forceLoading || !isSystemHealthy()}
                        className="flex items-center justify-center px-4 py-2 bg-[#2c90ea] text-white rounded-lg hover:bg-[#247bc7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {forceLoading ? (
                          <span className="animate-spin mr-2">⏳</span>
                        ) : (
                          <span className="mr-2">🚀</span>
                        )}
                        Forçar Monitoramento
                      </button>
                    </div>
                  </div>

                  {/* Detailed Stats (Expandable) */}
                  {showMonitoringDetails && monitoringStats && (
                    <div className="border-t border-[#2c3135] pt-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#0f1114] rounded-lg p-4">
                          <p className="text-[#a2abb3] text-sm">Clips por Canal</p>
                          <p className="text-white text-xl font-bold">
                            {monitoringStats.performance.avgClipsPerChannel.toFixed(1)}
                          </p>
                        </div>
                        <div className="bg-[#0f1114] rounded-lg p-4">
                          <p className="text-[#a2abb3] text-sm">Taxa de Descoberta</p>
                          <p className="text-white text-xl font-bold">
                            {monitoringStats.performance.discoveryRate}/hora
                          </p>
                        </div>
                        <div className="bg-[#0f1114] rounded-lg p-4">
                          <p className="text-[#a2abb3] text-sm">Eficiência do Sistema</p>
                          <p className="text-white text-xl font-bold">
                            {monitoringStats.performance.systemEfficiency.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
