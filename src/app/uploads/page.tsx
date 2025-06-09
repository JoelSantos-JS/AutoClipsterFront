"use client";

import { useState, useEffect } from "react";
import { useUploads } from '../../hooks/useUploads';
import { useClips } from '../../hooks/useClips';
import Sidebar from "../../components/Sidebar";

export default function UploadsPage() {
  const {
    // Dados
    youtubeStatus,
    videos,
    analytics,
    autoUploadStatus,
    
    // Estados de loading
    loading,
    videosLoading,
    autoUploadLoading,
    uploadLoading,
    syncLoading,
    authLoading,
    disconnectLoading,
    isPolling,
    
    // Erros
    error,
    analyticsError,
    
    // Paginação
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    hasNext,
    hasPrevious,
    
    // Ordenação
    
    // Operações principais
    toggleAutoUpload,
    manualUpload,
    syncYouTubeStats,
    
    // Autenticação YouTube
    startYouTubeAuth,
    disconnectYouTube,
    
    // Navegação
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    
    // Utilitários
    refreshAll,
    isConnected,
    getConnectionStatus,
    formatNumber,
    formatDuration,
    getStatusColor,
    getStatusText,
    getPrivacyStatusText,
    getPrivacyStatusColor
  } = useUploads();

  const {
    clips,
    selectedClips,
    toggleClipSelection,
    selectAllClips,
    clearSelection,
    isClipSelected,
    getSelectedClipsCount
  } = useClips();

  // Estados locais
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [showClipsModal, setShowClipsModal] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  // Limpar mensagens após timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Funções de ação para autenticação
  const handleConnectYouTube = async () => {
    try {
      const result = await startYouTubeAuth();
      if (result?.success) {
        setSuccessMessage('Complete a autorização na nova janela para conectar seu canal YouTube');
      } else {
        setErrorMessage(result?.message || 'Erro ao iniciar conexão');
      }
    } catch {
      setErrorMessage('Erro inesperado ao conectar canal');
    }
  };

  const handleDisconnectYouTube = async () => {
    try {
      const success = await disconnectYouTube();
      if (success) {
        setSuccessMessage('Canal YouTube desconectado com sucesso');
        setShowDisconnectConfirm(false);
      } else {
        setErrorMessage('Erro ao desconectar canal');
      }
    } catch {
      setErrorMessage('Erro inesperado ao desconectar canal');
    }
  };

  // Funções de ação existentes
  const handleToggleAutoUpload = async () => {
    if (!autoUploadStatus) return;

    try {
      const success = await toggleAutoUpload(!autoUploadStatus.autoUploadEnabled);
      if (success) {
        setSuccessMessage(
          `Upload automático ${!autoUploadStatus.autoUploadEnabled ? 'habilitado' : 'desabilitado'} com sucesso`
        );
      } else {
        setErrorMessage('Erro ao configurar upload automático');
      }
    } catch {
      setErrorMessage('Erro inesperado ao configurar upload automático');
    }
  };

  const handleManualUpload = async () => {
    const selectedCount = getSelectedClipsCount();
    if (selectedCount === 0) {
      setErrorMessage('Selecione pelo menos um clip para upload');
      return;
    }

    setShowUploadConfirm(true);
  };

  const confirmManualUpload = async () => {
    try {
      const result = await manualUpload(selectedClips);
      if (result) {
        setSuccessMessage(`Upload iniciado: ${result.successCount} clips enviados`);
        setShowClipsModal(false);
        clearSelection();
      } else {
        setErrorMessage('Erro no upload manual');
      }
    } catch {
      setErrorMessage('Erro inesperado no upload');
    }

    setShowUploadConfirm(false);
  };

  const handleSyncStats = async () => {
    try {
      const result = await syncYouTubeStats();
      if (result?.success) {
        setSuccessMessage('Estatísticas sincronizadas com sucesso');
      } else {
        setErrorMessage('Erro ao sincronizar estatísticas');
      }
    } catch {
      setErrorMessage('Erro inesperado na sincronização');
    }
  };

  // Renderizar status de conexão baseado no estado real
  const renderConnectionStatus = () => {
    const status = getConnectionStatus();
    
    if (status === 'loading') {
      return (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
          <p className="text-[#a2abb3]">Verificando status...</p>
        </div>
      );
    }

    const statusConfig = {
      'CONNECTED': {
        icon: '✅',
        text: 'Conectado',
        color: 'text-green-400',
        description: `Canal: ${youtubeStatus?.channelName}${youtubeStatus?.subscriberCount ? ` • ${youtubeStatus.subscriberCount} inscritos` : ''}`
      },
      'NOT_AUTHENTICATED': {
        icon: '🔗',
        text: 'Não Conectado',
        color: 'text-yellow-400',
        description: 'Clique em "Conectar Canal" para autorizar o AutoClipster'
      },
      'NOT_CONFIGURED': {
        icon: '⚙️',
        text: 'Não Configurado',
        color: 'text-red-400',
        description: 'Configure as credenciais do YouTube no arquivo .env'
      },
      'EXPIRED': {
        icon: '⏰',
        text: 'Credenciais Expiradas',
        color: 'text-orange-400',
        description: 'Reconecte o canal para renovar as credenciais'
      },
      'ERROR': {
        icon: '❌',
        text: 'Erro na Conexão',
        color: 'text-red-400',
        description: youtubeStatus?.message || 'Erro desconhecido'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-[#2c3135] rounded-full h-12 w-12 flex items-center justify-center text-2xl">
            {config.icon}
          </div>
          <div>
            <h3 className="text-white font-medium flex items-center gap-2">
              YouTube
              {isPolling && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
              )}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${config.color}`}>
                {config.text}
              </span>
              {isPolling && (
                <span className="text-yellow-400 text-sm">• Aguardando autorização...</span>
              )}
            </div>
            <p className="text-[#a2abb3] text-sm mt-1">{config.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isPolling && (
            <button
              onClick={() => setSuccessMessage('Processo de autenticação cancelado')}
              className="bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-yellow-700 transition-colors"
            >
              Cancelar
            </button>
          )}
          
          {status === 'CONNECTED' ? (
            <button
              onClick={() => setShowDisconnectConfirm(true)}
              disabled={disconnectLoading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {disconnectLoading ? 'Desconectando...' : '🔓 Desconectar'}
            </button>
          ) : status === 'NOT_CONFIGURED' ? (
            <div className="bg-[#2c3135] text-[#a2abb3] px-4 py-2 rounded-lg text-sm">
              Configure credenciais
            </div>
          ) : (
            <button
              onClick={handleConnectYouTube}
              disabled={authLoading || isPolling}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {authLoading ? 'Iniciando...' : isPolling ? 'Conectando...' : '🔗 Conectar Canal'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#121416] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex h-full flex-1">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="layout-content-container flex flex-col flex-1">
            <div className="flex flex-col bg-[#121416] p-8 flex-1 overflow-y-auto">
              {/* Header */}
              <div className="flex flex-wrap justify-between gap-6 mb-6">
                <div className="flex min-w-72 flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-white text-2xl font-bold leading-tight">Uploads YouTube</h1>
                    <p className="text-[#a2abb3] text-base font-normal leading-normal">
                      Gerencie uploads e canal do YouTube com autenticação real
                    </p>
                  </div>
                </div>

                {/* Ações do Header */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={refreshAll}
                    disabled={loading}
                    className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2c3135] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
                  >
                    {loading ? 'Carregando...' : 'Atualizar'}
                  </button>
                  
                  <button
                    onClick={handleSyncStats}
                    disabled={syncLoading || !isConnected()}
                    className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2884e6] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
                  >
                    {syncLoading ? 'Sincronizando...' : '🔄 Sincronizar'}
                  </button>
                  
                  <button
                    onClick={() => setShowClipsModal(true)}
                    disabled={uploadLoading || !isConnected()}
                    className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-green-600 text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
                  >
                    🚀 Upload Manual
                  </button>
                </div>
              </div>

              {/* Mensagens */}
              {error && (
                <div className="flex items-center gap-3 rounded-xl bg-red-900/20 border border-red-600/30 p-4 mb-4">
                  <div className="text-red-400">⚠️</div>
                  <span className="text-red-300 text-sm">{error}</span>
                  <button onClick={() => setErrorMessage(null)} className="ml-auto text-red-400 hover:text-red-300">×</button>
                </div>
              )}

              {errorMessage && (
                <div className="flex items-center gap-3 rounded-xl bg-red-900/20 border border-red-600/30 p-4 mb-4">
                  <div className="text-red-400">⚠️</div>
                  <span className="text-red-300 text-sm">{errorMessage}</span>
                  <button onClick={() => setErrorMessage(null)} className="ml-auto text-red-400 hover:text-red-300">×</button>
                </div>
              )}

              {successMessage && (
                <div className="flex items-center gap-3 rounded-xl bg-green-900/20 border border-green-600/30 p-4 mb-4">
                  <div className="text-green-400">✅</div>
                  <span className="text-green-300 text-sm">{successMessage}</span>
                </div>
              )}

              {/* Status da Conexão YouTube - Novo design com auth real */}
              <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6 mb-6">
                <h2 className="text-white text-xl font-bold mb-4">Status da Conexão YouTube</h2>
                {renderConnectionStatus()}
              </div>

              {/* Analytics Dashboard */}
              {analytics && !analyticsError && (
                <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6 mb-6">
                  <h2 className="text-white text-xl font-bold mb-4">Analytics do Canal</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#2c3135] rounded-lg p-4">
                      <div className="text-blue-400 text-2xl font-bold">{formatNumber(analytics.totalViews)}</div>
                      <div className="text-[#a2abb3] text-sm">Total de Views</div>
                      <div className="text-green-400 text-xs mt-1">
                        +{formatNumber(analytics.recentViews)} recentes
                      </div>
                    </div>
                    
                    <div className="bg-[#2c3135] rounded-lg p-4">
                      <div className="text-red-400 text-2xl font-bold">{formatNumber(analytics.totalLikes)}</div>
                      <div className="text-[#a2abb3] text-sm">Total de Likes</div>
                      <div className="text-[#a2abb3] text-xs mt-1">
                        Média: {Math.round((analytics.totalLikes || 0) / (analytics.videosPublished || 1))} por vídeo
                      </div>
                    </div>
                    
                    <div className="bg-[#2c3135] rounded-lg p-4">
                      <div className="text-yellow-400 text-2xl font-bold">{formatNumber(analytics.totalComments)}</div>
                      <div className="text-[#a2abb3] text-sm">Total de Comentários</div>
                      <div className="text-[#a2abb3] text-xs mt-1">
                        Engajamento: {(analytics.engagementRate || 0).toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="bg-[#2c3135] rounded-lg p-4">
                      <div className="text-green-400 text-2xl font-bold">{analytics.videosPublished}</div>
                      <div className="text-[#a2abb3] text-sm">Vídeos Publicados</div>
                      <div className="text-green-400 text-xs mt-1">
                        +{analytics.recentVideos} recentes
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Automático */}
              <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg font-bold">Upload Automático</h3>
                    <p className="text-[#a2abb3] text-sm">
                      {autoUploadStatus?.autoUploadEnabled 
                        ? 'Clips prontos são automaticamente enviados para o YouTube'
                        : 'Upload automático está desabilitado'
                      }
                    </p>
                    {autoUploadStatus?.pendingUploads && autoUploadStatus.pendingUploads > 0 && (
                      <p className="text-yellow-400 text-sm mt-1">
                        {autoUploadStatus.pendingUploads} uploads pendentes
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={handleToggleAutoUpload}
                    disabled={autoUploadLoading || !isConnected()}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      autoUploadStatus?.autoUploadEnabled ? 'bg-green-600' : 'bg-gray-600'
                    } disabled:opacity-50`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                        autoUploadStatus?.autoUploadEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Lista de Vídeos Publicados */}
              <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl overflow-hidden">
                <div className="bg-[#2c3135] px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-white text-xl font-bold">Vídeos Publicados</h2>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-[#a2abb3] text-sm">
                        {totalElements} vídeos • Página {currentPage + 1} de {totalPages}
                      </span>
                      
                      <select
                        value={pageSize}
                        onChange={(e) => changePageSize(Number(e.target.value))}
                        className="border border-[#2c3135] rounded-lg px-2 py-1 text-sm bg-[#1c1f22] text-white"
                      >
                        <option value={10}>10 por página</option>
                        <option value={20}>20 por página</option>
                        <option value={50}>50 por página</option>
                      </select>
                    </div>
                  </div>
                </div>

                {videosLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    <p className="mt-2 text-[#a2abb3]">Carregando vídeos...</p>
                  </div>
                ) : videos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-[#a2abb3] mb-4">
                      <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Nenhum vídeo encontrado</h3>
                    <p className="text-[#a2abb3]">Ainda não há vídeos publicados no YouTube.</p>
                  </div>
                ) : (
                  <>
                    {/* Vídeos */}
                    <div className="divide-y divide-[#2c3135]">
                      {videos.map((video) => (
                        <div key={video.id} className="p-6 hover:bg-[#2c3135]/30 transition-colors">
                          <div className="flex items-center gap-4">
                            {/* Thumbnail */}
                            <div className="flex-shrink-0">
                              <img
                                src={video.thumbnailUrl}
                                alt={video.title}
                                className="w-32 h-20 object-cover rounded-lg bg-[#2c3135]"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iODAiIGZpbGw9IiMyYzMxMzUiLz48cGF0aCBkPSJNNTAgMzBsMjAgMTAtMjAgMTBWMzB6IiBmaWxsPSIjYTJhYmIzIi8+PC9zdmc+';
                                }}
                              />
                            </div>

                            {/* Informações do Vídeo */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-white font-medium truncate">{video.title}</h3>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  getStatusColor(video.status) === 'green' ? 'bg-green-900/30 text-green-400' :
                                  getStatusColor(video.status) === 'yellow' ? 'bg-yellow-900/30 text-yellow-400' :
                                  getStatusColor(video.status) === 'red' ? 'bg-red-900/30 text-red-400' :
                                  getStatusColor(video.status) === 'orange' ? 'bg-orange-900/30 text-orange-400' :
                                  'bg-gray-900/30 text-gray-400'
                                }`}>
                                  {getStatusText(video.status)}
                                </span>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  getPrivacyStatusColor(video.privacyStatus) === 'green' ? 'bg-green-900/30 text-green-400' :
                                  getPrivacyStatusColor(video.privacyStatus) === 'yellow' ? 'bg-yellow-900/30 text-yellow-400' :
                                  'bg-red-900/30 text-red-400'
                                }`}>
                                  {getPrivacyStatusText(video.privacyStatus)}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[#a2abb3]">
                                <div>
                                  <span className="font-medium">Views:</span> {formatNumber(video.views)}
                                </div>
                                <div>
                                  <span className="font-medium">Likes:</span> {formatNumber(video.likes)}
                                </div>
                                <div>
                                  <span className="font-medium">Comentários:</span> {formatNumber(video.comments)}
                                </div>
                                <div>
                                  <span className="font-medium">Duração:</span> {formatDuration(video.duration)}
                                </div>
                              </div>
                              
                              <div className="mt-2 text-sm text-[#a2abb3]">
                                <span className="font-medium">Publicado:</span> {new Date(video.uploadedAt).toLocaleString()}
                              </div>
                            </div>

                            {/* Ações */}
                            <div className="flex items-center gap-2">
                              <a
                                href={video.watchUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#2884e6] text-white px-3 py-1 rounded text-sm hover:bg-[#2672cc] transition-colors flex items-center gap-1"
                              >
                                🎬 Ver
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Paginação */}
                    {totalPages > 1 && (
                      <div className="bg-[#2c3135] px-6 py-4 flex items-center justify-between">
                        <button
                          onClick={previousPage}
                          disabled={!hasPrevious}
                          className="bg-[#1c1f22] text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2c3135]"
                        >
                          ← Anterior
                        </button>
                        
                        <div className="flex items-center gap-2">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum)}
                                className={`px-3 py-1 rounded text-sm ${
                                  pageNum === currentPage
                                    ? 'bg-[#2884e6] text-white'
                                    : 'bg-[#1c1f22] text-[#a2abb3] hover:bg-[#2c3135]'
                                }`}
                              >
                                {pageNum + 1}
                              </button>
                            );
                          })}
                        </div>
                        
                        <button
                          onClick={nextPage}
                          disabled={!hasNext}
                          className="bg-[#1c1f22] text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2c3135]"
                        >
                          Próxima →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Seleção de Clips para Upload */}
      {showClipsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1c1f22] rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto border border-[#2c3135]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Selecionar Clips para Upload</h3>
              <button
                onClick={() => setShowClipsModal(false)}
                className="text-[#a2abb3] hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={selectAllClips}
                  className="bg-[#2884e6] text-white px-3 py-1 rounded text-sm hover:bg-[#2672cc]"
                >
                  Selecionar Todos
                </button>
                <button
                  onClick={clearSelection}
                  className="bg-[#2c3135] text-[#a2abb3] px-3 py-1 rounded text-sm hover:bg-[#3c4147]"
                >
                  Limpar Seleção
                </button>
                <span className="text-[#a2abb3] text-sm">
                  {getSelectedClipsCount()} clips selecionados
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {clips.filter(clip => clip.finalStatus === 'READY').map((clip) => (
                <div
                  key={clip.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    isClipSelected(clip.id) ? 'bg-[#2884e6]/20 border border-[#2884e6]/50' : 'bg-[#2c3135] hover:bg-[#3c4147]'
                  }`}
                  onClick={() => toggleClipSelection(clip.id)}
                >
                  <input
                    type="checkbox"
                    checked={isClipSelected(clip.id)}
                    onChange={() => toggleClipSelection(clip.id)}
                    className="rounded bg-[#1c1f22] border-[#2c3135]"
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium">{clip.title}</div>
                    <div className="text-[#a2abb3] text-sm">
                      {clip.creatorName} • {formatDuration(clip.duration)} • {formatNumber(clip.viewCount)} views
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowClipsModal(false)}
                className="flex-1 bg-[#2c3135] text-[#a2abb3] px-4 py-2 rounded-lg hover:bg-[#3c4147] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleManualUpload}
                disabled={getSelectedClipsCount() === 0}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Upload {getSelectedClipsCount()} Clips
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Upload */}
      {showUploadConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1c1f22] rounded-lg p-6 w-full max-w-md border border-[#2c3135]">
            <h3 className="text-lg font-semibold mb-4 text-white">Confirmar Upload</h3>
            
            <p className="text-[#a2abb3] mb-6">
              Tem certeza que deseja iniciar o upload de {getSelectedClipsCount()} clips selecionados para o YouTube?
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowUploadConfirm(false)}
                className="flex-1 bg-[#2c3135] text-[#a2abb3] px-4 py-2 rounded-lg hover:bg-[#3c4147] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmManualUpload}
                disabled={uploadLoading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {uploadLoading ? 'Enviando...' : 'Confirmar Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Desconexão */}
      {showDisconnectConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1c1f22] rounded-lg p-6 w-full max-w-md border border-[#2c3135]">
            <h3 className="text-lg font-semibold mb-4 text-white">Confirmar Desconexão</h3>
            
            <p className="text-[#a2abb3] mb-6">
              Tem certeza que deseja desconectar o canal do YouTube?
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDisconnectConfirm(false)}
                className="flex-1 bg-[#2c3135] text-[#a2abb3] px-4 py-2 rounded-lg hover:bg-[#3c4147] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDisconnectYouTube}
                disabled={disconnectLoading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {disconnectLoading ? 'Desconectando...' : '🔓 Desconectar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 