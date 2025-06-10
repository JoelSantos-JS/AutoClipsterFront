"use client";

import { useState, useEffect } from 'react';
import { useAutomation } from '../../hooks/useAutomation';
import Sidebar from "../../components/Sidebar";

export default function WorkflowsPage() {
  const {
    status,
    isLoading,
    loadStatus,
    processClips,
    retryFailedClips,
    executeWorkflow
  } = useAutomation();
  
  const [channelName, setChannelName] = useState("");
  const [clipLimit, setClipLimit] = useState(10);
  const [daysBack, setDaysBack] = useState(1);
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-refresh status every 30 seconds when automation is enabled
  useEffect(() => {
    if (isAutomationEnabled) {
      const interval = setInterval(() => {
        loadStatus();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isAutomationEnabled, loadStatus]);

  // Load initial status
  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handleExecuteWorkflow = async () => {
    if (!channelName.trim()) {
      setError("Nome do canal é obrigatório");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await executeWorkflow({
        channelName: channelName.trim(),
        clipLimit,
        daysBack,
        forceDownload: false,
        autoUpload: false
      });
      setSuccess("Workflow executado com sucesso!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao executar workflow");
    }
  };

  const handleRetryFailed = async () => {
    setError(null);
    setSuccess(null);

    try {
      await retryFailedClips();
      setSuccess("Reprocessamento de clips iniciado!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao reprocessar clips");
    }
  };

  const handleTestAutomation = async () => {
    setError(null);
    setSuccess(null);

    try {
      await processClips();
      setSuccess("Teste de automação concluído com sucesso");
    } catch {
      setError('Erro ao testar automação')
    }
  };

  const toggleAutomation = () => {
    setIsAutomationEnabled(!isAutomationEnabled);
    if (!isAutomationEnabled) {
      setSuccess("Automação habilitada");
    } else {
      setSuccess("Automação desabilitada");
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
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-[#a2abb3]">Carregando status...</div>
                  </div>
                ) : status ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[#a2abb3]">Status:</span>
                      <span className={`font-medium ${status.isRunning ? 'text-green-400' : 'text-yellow-400'}`}>
                        {status.isRunning ? 'Executando' : 'Parado'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[#a2abb3]">Progresso:</span>
                      <span className="text-white font-medium">{status.progress}%</span>
                    </div>
                    
                    {status.currentTask && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#a2abb3]">Tarefa Atual:</span>
                        <span className="text-white font-medium">{status.currentTask}</span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#40484f]">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{status.totalClipsProcessed}</div>
                        <div className="text-[#a2abb3] text-xs">Processados</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{status.totalClipsUploaded}</div>
                        <div className="text-[#a2abb3] text-xs">Enviados</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{status.queuedClips}</div>
                        <div className="text-[#a2abb3] text-xs">Na Fila</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[#a2abb3] text-center py-8">
                    Nenhum status disponível
                  </div>
                )}
              </div>

              {/* Tab Navigation */}
              <div className="mb-6 bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6">
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
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
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
                      value={clipLimit}
                      onChange={(e) => setClipLimit(parseInt(e.target.value) || 10)}
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
                      value={daysBack}
                      onChange={(e) => setDaysBack(parseInt(e.target.value) || 1)}
                      className="w-full bg-[#2c3135] border border-[#40484f] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2c90ea]"
                      min="1"
                      max="30"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={handleExecuteWorkflow}
                    disabled={isLoading}
                    className="bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Executando..." : "Executar Workflow"}
                  </button>
                  
                  <button
                    onClick={handleRetryFailed}
                    disabled={isLoading}
                    className="bg-orange-600 text-white py-3 px-6 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Reprocessando..." : "Reprocessar Falhados"}
                  </button>
                  
                  <button
                    onClick={handleTestAutomation}
                    disabled={isLoading}
                    className="bg-purple-600 text-white py-3 px-6 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Testando..." : "Testar Automação"}
                  </button>
                </div>
              </div>

              {/* Templates */}
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
                        onClick={() => {
                          setChannelName(template.config.channelName);
                          setClipLimit(template.config.clipLimit);
                          setDaysBack(template.config.daysBack);
                        }}
                        className="w-full bg-[#2c90ea] text-white py-2 rounded-lg hover:bg-[#247bc7] transition-colors"
                      >
                        Use Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scheduled Workflows */}
              <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6">
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                  Scheduled Workflows
                </h2>
                
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      name: 'Daily Highlights',
                      channel: 'gaules',
                      schedule: 'Daily at 18:00',
                      status: 'active',
                      nextRun: '2024-01-15 18:00'
                    }
                  ].map((workflow) => (
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

              {/* Status */}
              <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6">
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                  Status
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">Processados</h3>
                        <span className="text-blue-400 text-xl">📊</span>
                      </div>
                      <p className="text-3xl font-bold text-blue-400">{status?.totalClipsProcessed || 0}</p>
                      <p className="text-gray-400 text-sm mt-1">Clips processados</p>
                    </div>

                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">Na Fila</h3>
                        <span className="text-yellow-400 text-xl">⏳</span>
                      </div>
                      <p className="text-3xl font-bold text-yellow-400">{status?.queuedClips || 0}</p>
                      <p className="text-gray-400 text-sm mt-1">Aguardando processamento</p>
                    </div>

                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">Status</h3>
                        <div className={`w-3 h-3 rounded-full ${status?.isRunning ? 'bg-green-400' : 'bg-red-400'}`} />
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {status?.isRunning ? 'Ativo' : 'Inativo'}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">Sistema de automação</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleRetryFailed}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-xl text-white font-medium transition-colors bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                    >
                      Retry Failed
                    </button>
                    
                    <button
                      onClick={handleTestAutomation}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-xl text-white font-medium transition-colors bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                    >
                      Test Automation
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6">
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                  Quick Actions
                </h2>
                
                <div className="flex gap-3">
                  <button 
                    onClick={handleRetryFailed}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      isLoading
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    Retry Failed
                  </button>
                  
                  <button 
                    onClick={handleTestAutomation}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      isLoading
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
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