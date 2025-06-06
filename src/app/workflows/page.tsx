"use client";

import { useState, useEffect } from 'react';
import { useAutomation } from '../../hooks/useAutomation';
import Sidebar from "../../components/Sidebar";

export default function WorkflowsPage() {
  const { 
    status, 
    executeWorkflow, 
    retryFailed, 
    testAutomation,
    startPolling, 
    stopPolling
  } = useAutomation();
  
  const [formData, setFormData] = useState({
    channelName: '',
    clipLimit: 10,
    daysBack: 7
  });
  const [executing, setExecuting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [activeTab, setActiveTab] = useState('execute');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(false); // Desativado por padrão
  const [scheduledWorkflows] = useState([
    {
      id: 1,
      name: 'Daily Highlights',
      channel: 'gaules',
      schedule: 'Daily at 18:00',
      status: 'active',
      nextRun: '2024-01-15 18:00'
    },
    {
      id: 2,
      name: 'Weekend Compilation',
      channel: 'loud_coringa',
      schedule: 'Weekly on Sundays',
      status: 'paused',
      nextRun: '2024-01-21 10:00'
    }
  ]);

  // Não iniciar polling automaticamente
  useEffect(() => {
    if (isAutomationEnabled) {
      startPolling();
    } else {
      stopPolling();
    }
    
    return () => stopPolling();
  }, [isAutomationEnabled, startPolling, stopPolling]);

  const handleExecuteWorkflow = async () => {
    if (!formData.channelName.trim()) {
      setError('Channel name is required');
      return;
    }

    try {
      setExecuting(true);
      setError(null);
      setSuccess(null);
      
      const result = await executeWorkflow(formData);
      
      if (result) {
        setSuccess(`Workflow started successfully for channel: ${formData.channelName}`);
        // Reset form
        setFormData({
          channelName: '',
          clipLimit: 10,
          daysBack: 7
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute workflow');
    } finally {
      setExecuting(false);
    }
  };

  const handleRetryFailed = async () => {
    try {
      setExecuting(true);
      setError(null);
      
      await retryFailed();
      setSuccess('Retry initiated for failed workflows');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retry workflows');
    } finally {
      setExecuting(false);
    }
  };

  const handleTestAutomation = async () => {
    try {
      setTesting(true);
      setError(null);
      
      await testAutomation();
      setSuccess('Automation test completed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Automation test failed');
    } finally {
      setTesting(false);
    }
  };

  const toggleAutomation = () => {
    setIsAutomationEnabled(!isAutomationEnabled);
    if (!isAutomationEnabled) {
      setSuccess('Automation enabled successfully');
    } else {
      setSuccess('Automation disabled successfully');
    }
    setTimeout(() => setSuccess(null), 3000);
  };

  const workflowTemplates = [
    {
      name: 'Gaming Highlights',
      description: 'Best gaming moments from popular streamers',
      config: { channelName: 'gaules', clipLimit: 10, daysBack: 7 },
      category: 'Gaming'
    },
    {
      name: 'Daily Compilation',
      description: 'Quick daily highlights for consistent content',
      config: { channelName: '', clipLimit: 5, daysBack: 1 },
      category: 'Daily'
    },
    {
      name: 'Weekly Best',
      description: 'Top clips from the entire week',
      config: { channelName: '', clipLimit: 20, daysBack: 7 },
      category: 'Weekly'
    },
    {
      name: 'Viral Moments',
      description: 'High-engagement clips with viral potential',
      config: { channelName: '', clipLimit: 15, daysBack: 3 },
      category: 'Viral'
    }
  ];

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
                    Workflows
                  </h1>
                  <p className="text-[#a2abb3] text-base font-normal leading-normal">
                    Automate clip processing and content creation
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleAutomation}
                    className={`flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 ${
                      isAutomationEnabled 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    } text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200`}
                  >
                    {isAutomationEnabled ? (
                      <>
                        <span className="mr-2">⏸️</span>
                        <span>Disable</span>
                      </>
                    ) : (
                      <>
                        <span className="mr-2">▶️</span>
                        <span>Enable</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 font-semibold">Error:</p>
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                  <p className="text-green-400 font-semibold">Success!</p>
                  <p className="text-green-300">{success}</p>
                </div>
              )}

              {/* Automation Status */}
              <div className={`p-4 rounded-xl mb-6 ${
                isAutomationEnabled 
                  ? 'bg-green-900/20 border border-green-500/30' 
                  : 'bg-gray-900/20 border border-gray-500/30'
              }`}>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-2">
                  Automation Status
                </h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      isAutomationEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    }`}></div>
                    <span className={isAutomationEnabled ? 'text-green-400' : 'text-gray-400'}>
                      Automation is currently {isAutomationEnabled ? 'enabled' : 'disabled'}
                    </span>
                  </div>
                  <p className="text-[#a2abb3] text-sm">
                    {isAutomationEnabled 
                      ? 'Monitoring and processing clips automatically' 
                      : 'Enable automation to start processing workflows'
                    }
                  </p>
                </div>
                
                {/* Status Details */}
                {status && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{status.totalClipsDownloaded}</div>
                      <div className="text-[#a2abb3] text-xs">Downloaded</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{status.totalClipsProcessed}</div>
                      <div className="text-[#a2abb3] text-xs">Processed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{status.totalClipsPending}</div>
                      <div className="text-[#a2abb3] text-xs">Pending</div>
                    </div>
                  </div>
                )}
                
                {status?.isProcessingActive && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-green-400 text-sm">Processing active...</span>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mb-6">
                {['execute', 'templates', 'scheduled', 'status'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-[#2c90ea] text-white'
                        : 'bg-[#2c3135] text-[#a2abb3] hover:text-white hover:bg-[#3c4147]'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'execute' && (
                <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6">
                  <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                    Execute New Workflow
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Channel Name
                      </label>
                      <input
                        type="text"
                        value={formData.channelName}
                        onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
                        className="w-full bg-[#2c3135] border border-[#40484f] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2c90ea]"
                        placeholder="Enter Twitch channel name (e.g., gaules)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Clip Limit
                      </label>
                      <input
                        type="number"
                        value={formData.clipLimit}
                        onChange={(e) => setFormData({ ...formData, clipLimit: parseInt(e.target.value) || 10 })}
                        className="w-full bg-[#2c3135] border border-[#40484f] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2c90ea]"
                        min="1"
                        max="50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Days Back
                      </label>
                      <input
                        type="number"
                        value={formData.daysBack}
                        onChange={(e) => setFormData({ ...formData, daysBack: parseInt(e.target.value) || 7 })}
                        className="w-full bg-[#2c3135] border border-[#40484f] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2c90ea]"
                        min="1"
                        max="30"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleExecuteWorkflow}
                    disabled={executing || !isAutomationEnabled}
                    className={`w-full py-3 rounded-xl text-white font-bold transition-colors ${
                      executing || !isAutomationEnabled
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-[#2c90ea] hover:bg-[#247bc7]'
                    }`}
                  >
                    {executing ? 'Executing Workflow...' : 'Execute Workflow'}
                  </button>
                  
                  {!isAutomationEnabled && (
                    <p className="text-[#a2abb3] text-sm mt-2 text-center">
                      Enable automation above to execute workflows
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'templates' && (
                <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6">
                  <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                    Templates
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workflowTemplates.map((template, index) => (
                      <div key={index} className="bg-[#2c3135] border border-[#40484f] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-semibold">{template.name}</h3>
                          <span className="bg-blue-900/20 text-blue-400 px-2 py-1 rounded text-xs">
                            {template.category}
                          </span>
                        </div>
                        <p className="text-[#a2abb3] text-sm mb-4">{template.description}</p>
                        <div className="text-[#a2abb3] text-xs mb-4">
                          <p>Clip Limit: {template.config.clipLimit}</p>
                          <p>Days Back: {template.config.daysBack}</p>
                        </div>
                        <button
                          onClick={() => setFormData(template.config)}
                          className="w-full bg-[#2c90ea] text-white py-2 rounded-lg hover:bg-[#247bc7] transition-colors"
                        >
                          Use Template
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'scheduled' && (
                <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6">
                  <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                    Scheduled Workflows
                  </h2>
                  
                  <div className="space-y-4">
                    {scheduledWorkflows.map((workflow) => (
                      <div key={workflow.id} className="bg-[#2c3135] border border-[#40484f] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold">{workflow.name}</h3>
                            <p className="text-[#a2abb3] text-sm">Channel: {workflow.channel}</p>
                            <p className="text-[#a2abb3] text-sm">Schedule: {workflow.schedule}</p>
                            <p className="text-[#a2abb3] text-sm">Next Run: {workflow.nextRun}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              workflow.status === 'active' 
                                ? 'bg-green-900/20 text-green-400'
                                : 'bg-yellow-900/20 text-yellow-400'
                            }`}>
                              {workflow.status}
                            </span>
                            <button className="bg-[#2c90ea] text-white px-3 py-1 rounded text-sm hover:bg-[#247bc7] transition-colors">
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'status' && (
                <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6">
                  <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                    Status
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[#2c3135] border border-[#40484f] rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-white">{status?.totalClipsPending || 0}</div>
                        <div className="text-[#a2abb3] text-sm">Pending Clips</div>
                      </div>
                      <div className="bg-[#2c3135] border border-[#40484f] rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-white">{status?.totalClipsProcessed || 0}</div>
                        <div className="text-[#a2abb3] text-sm">Processed Clips</div>
                      </div>
                      <div className="bg-[#2c3135] border border-[#40484f] rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-white">{status?.totalClipsDownloaded || 0}</div>
                        <div className="text-[#a2abb3] text-sm">Downloaded Clips</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleRetryFailed}
                        disabled={executing}
                        className={`px-4 py-2 rounded-xl text-white font-medium transition-colors ${
                          executing
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        Retry Failed
                      </button>
                      
                      <button
                        onClick={handleTestAutomation}
                        disabled={testing}
                        className={`px-4 py-2 rounded-xl text-white font-medium transition-colors ${
                          testing
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        Test Automation
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-6 bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6">
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                  Quick Actions
                </h2>
                
                <div className="flex gap-3">
                  <button 
                    onClick={handleRetryFailed}
                    disabled={executing}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      executing
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    Retry Failed
                  </button>
                  
                  <button 
                    onClick={handleTestAutomation}
                    disabled={testing}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      testing
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Test Automation
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