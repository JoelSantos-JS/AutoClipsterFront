"use client";

import { useState } from "react";
import { useChannels } from '../../hooks/useChannels'; // Para canais Twitch
import { useMultipleChannels } from '../../hooks/useMultipleChannels'; // Para canais YouTube
import Sidebar from "../../components/Sidebar";

export default function ChannelsPage() {
  // Hooks para canais Twitch (monitoramento)
  const {
    channels: twitchChannels,
    loading: twitchLoading,
    error: twitchError,
    addChannel: addTwitchChannel,
    removeChannel: removeTwitchChannel,
    testChannel: testTwitchChannel,
    refreshChannels: refreshTwitchChannels
  } = useChannels();

  // Hooks para canais YouTube (uploads)
  const {
    channels: youtubeChannels,
    activeChannelId,
    allChannelsStats,
    loading: youtubeLoading,
    selectingChannel: youtubeSelecting,
    removingChannel: youtubeRemoving,
    error: youtubeError,
    successMessage,
    addChannel: addYouTubeChannel,
    selectChannel: selectYouTubeChannel,
    removeChannel: removeYouTubeChannel,
    getChannelById,
    hasChannels: hasYouTubeChannels,
    getConnectedChannelsCount,
    isChannelPolling,
    refreshAll: refreshYouTubeChannels,
    getChannelStats,
    formatNumber
  } = useMultipleChannels();

  // Estados locais
  const [activeTab, setActiveTab] = useState<'twitch' | 'youtube'>('twitch');
  const [showAddTwitchModal, setShowAddTwitchModal] = useState(false);
  const [showConnectYouTubeModal, setShowConnectYouTubeModal] = useState(false);
  const [showRemoveTwitchConfirm, setShowRemoveTwitchConfirm] = useState<number | null>(null);
  const [showRemoveYouTubeConfirm, setShowRemoveYouTubeConfirm] = useState<string | null>(null);

  // Estados para formulários
  const [newTwitchChannel, setNewTwitchChannel] = useState({
    name: '',
    url: '',
    description: '',
    platform: 'twitch' as const
  });

  // Estados para conexão YouTube
  const [connectingYouTube, setConnectingYouTube] = useState(false);

  // Funções para Twitch
  const handleAddTwitchChannel = async () => {
    if (!newTwitchChannel.name.trim()) return;

    const success = await addTwitchChannel({
      ...newTwitchChannel,
      name: newTwitchChannel.name.trim(),
      url: newTwitchChannel.url || `https://twitch.tv/${newTwitchChannel.name.trim()}`
    });

    if (success) {
      setNewTwitchChannel({ name: '', url: '', description: '', platform: 'twitch' });
      setShowAddTwitchModal(false);
    }
  };

  const handleRemoveTwitchChannel = async (channelId: number) => {
    const success = await removeTwitchChannel(channelId);
    if (success) {
      setShowRemoveTwitchConfirm(null);
    }
  };

  const handleTestTwitchChannel = async (channelId: number) => {
    await testTwitchChannel(channelId);
  };

  // Funções para YouTube - Conexão Automática
  const handleConnectYouTube = async () => {
    setConnectingYouTube(true);
    setShowConnectYouTubeModal(false);
    
    try {
      // Gerar um ID único para este canal baseado no timestamp
      const channelId = `youtube_${Date.now()}`;
      
      // Simular o processo de autenticação OAuth
      // Em uma implementação real, isso redirecionaria para OAuth do YouTube
      const success = await addYouTubeChannel(channelId, `Canal YouTube ${channelId}`);
      
      if (success) {
        // Canal será adicionado automaticamente pelos hooks
      }
    } catch (error) {
      console.error('Erro ao conectar canal YouTube:', error);
    } finally {
      setConnectingYouTube(false);
    }
  };

  const handleSelectYouTubeChannel = async (channelId: string) => {
    await selectYouTubeChannel(channelId);
  };

  const handleRemoveYouTubeChannel = async (channelId: string) => {
    const success = await removeYouTubeChannel(channelId);
    if (success) {
      setShowRemoveYouTubeConfirm(null);
    }
  };

  // Utilitários
  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'text-green-400',
      'inactive': 'text-red-400',
      'error': 'text-red-400',
      'CONNECTED': 'text-green-400',
      'NOT_AUTHENTICATED': 'text-yellow-400',
      'NOT_CONFIGURED': 'text-red-400',
      'EXPIRED': 'text-orange-400',
      'ERROR': 'text-red-400'
    };
    return colors[status as keyof typeof colors] || 'text-gray-400';
  };

  const getStatusText = (status: string) => {
    const texts = {
      'active': 'Ativo',
      'inactive': 'Inativo',
      'error': 'Erro',
      'CONNECTED': 'Conectado',
      'NOT_AUTHENTICATED': 'Não Autenticado',
      'NOT_CONFIGURED': 'Não Configurado',
      'EXPIRED': 'Expirado',
      'ERROR': 'Erro'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      'active': '✅',
      'inactive': '⚪',
      'error': '❌',
      'CONNECTED': '✅',
      'NOT_AUTHENTICATED': '🔗',
      'NOT_CONFIGURED': '⚙️',
      'EXPIRED': '⏰',
      'ERROR': '❌'
    };
    return icons[status as keyof typeof icons] || '❓';
  };

  const renderTwitchChannels = () => (
    <div className="space-y-6">
      {/* Header Twitch */}
      <div className="flex flex-wrap justify-between gap-6">
        <div className="flex min-w-72 flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-xl font-bold leading-tight">Canais Twitch Monitorados</h2>
            <p className="text-[#a2abb3] text-base font-normal leading-normal">
              Adicione canais da Twitch para baixar clips automaticamente
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <button
            onClick={refreshTwitchChannels}
            disabled={twitchLoading}
            className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2c3135] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
          >
            {twitchLoading ? 'Carregando...' : 'Atualizar'}
          </button>
          
          <button
            onClick={() => setShowAddTwitchModal(true)}
            className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-purple-600 text-white text-sm font-bold leading-normal tracking-[0.015em]"
          >
            ➕ Adicionar Canal Twitch
          </button>
        </div>
      </div>

      {/* Mensagens de erro Twitch */}
      {twitchError && (
        <div className="flex items-center gap-3 rounded-xl bg-red-900/20 border border-red-600/30 p-4">
          <div className="text-red-400">⚠️</div>
          <span className="text-red-300 text-sm">{twitchError}</span>
        </div>
      )}

      {/* Lista de Canais Twitch */}
      <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl overflow-hidden">
        <div className="bg-[#2c3135] px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-bold">Canais Twitch</h3>
            <span className="text-[#a2abb3] text-sm">
              {twitchChannels.length} canais monitorados
            </span>
          </div>
        </div>

        {twitchLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="mt-2 text-[#a2abb3]">Carregando canais...</p>
          </div>
        ) : twitchChannels.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-[#a2abb3] mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Nenhum canal Twitch monitorado</h3>
            <p className="text-[#a2abb3] mb-6">Adicione canais da Twitch para monitorar clips.</p>
            <button
              onClick={() => setShowAddTwitchModal(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              ➕ Adicionar Primeiro Canal
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#2c3135]">
            {twitchChannels.map((channel) => (
              <div key={channel.id} className="p-6 hover:bg-[#2c3135]/30 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Avatar/Icon */}
                  <div className="flex-shrink-0">
                    <div className="bg-purple-600 rounded-full h-16 w-16 flex items-center justify-center text-2xl">
                      🎮
                    </div>
                  </div>

                  {/* Informações do Canal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-bold text-lg">{channel.name}</h3>
                      <span className={`text-sm font-medium ${getStatusColor(channel.status)}`}>
                        {getStatusIcon(channel.status)} {getStatusText(channel.status)}
                      </span>
                    </div>
                    
                    <div className="text-[#a2abb3] text-sm mb-2">
                      <a href={channel.url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">
                        {channel.url}
                      </a>
                    </div>
                    
                    {channel.description && (
                      <div className="text-[#a2abb3] text-sm mb-2">
                        {channel.description}
                      </div>
                    )}
                    
                    <div className="text-sm text-[#a2abb3]">
                      <span className="font-medium">Último clip:</span> {
                        channel.lastClipAt 
                          ? new Date(channel.lastClipAt).toLocaleString() 
                          : 'Nunca'
                      }
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleTestTwitchChannel(channel.id)}
                      disabled={twitchLoading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      🔍 Testar
                    </button>
                    
                    <button
                      onClick={() => setShowRemoveTwitchConfirm(channel.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                    >
                      🗑️ Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderYouTubeChannels = () => (
    <div className="space-y-6">
      {/* Header YouTube */}
      <div className="flex flex-wrap justify-between gap-6">
        <div className="flex min-w-72 flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-xl font-bold leading-tight">Canais YouTube</h2>
            <p className="text-[#a2abb3] text-base font-normal leading-normal">
              Conecte e gerencie múltiplos canais YouTube para uploads
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <button
            onClick={refreshYouTubeChannels}
            disabled={youtubeLoading}
            className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2c3135] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
          >
            {youtubeLoading ? 'Carregando...' : 'Atualizar'}
          </button>
          
          <button
            onClick={() => setShowConnectYouTubeModal(true)}
            disabled={connectingYouTube}
            className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-red-600 text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
          >
            {connectingYouTube ? 'Conectando...' : '➕ Conectar Canal YouTube'}
          </button>
        </div>
      </div>

      {/* Mensagens YouTube */}
      {youtubeError && (
        <div className="flex items-center gap-3 rounded-xl bg-red-900/20 border border-red-600/30 p-4">
          <div className="text-red-400">⚠️</div>
          <span className="text-red-300 text-sm">{youtubeError}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl bg-green-900/20 border border-green-600/30 p-4">
          <div className="text-green-400">✅</div>
          <span className="text-green-300 text-sm">{successMessage}</span>
        </div>
      )}

      {/* Estatísticas Gerais YouTube */}
      {allChannelsStats && (
        <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-6">
          <h3 className="text-white text-lg font-bold mb-4">Resumo YouTube</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-[#2c3135] rounded-lg p-4">
              <div className="text-blue-400 text-2xl font-bold">{allChannelsStats.summary.totalChannels}</div>
              <div className="text-[#a2abb3] text-sm">Canais Totais</div>
              <div className="text-green-400 text-xs mt-1">
                {getConnectedChannelsCount()} conectados
              </div>
            </div>
            
            <div className="bg-[#2c3135] rounded-lg p-4">
              <div className="text-green-400 text-2xl font-bold">{formatNumber(allChannelsStats.summary.totalViews)}</div>
              <div className="text-[#a2abb3] text-sm">Views Totais</div>
            </div>
            
            <div className="bg-[#2c3135] rounded-lg p-4">
              <div className="text-red-400 text-2xl font-bold">{formatNumber(allChannelsStats.summary.totalLikes)}</div>
              <div className="text-[#a2abb3] text-sm">Likes Totais</div>
            </div>
            
            <div className="bg-[#2c3135] rounded-lg p-4">
              <div className="text-yellow-400 text-2xl font-bold">{formatNumber(allChannelsStats.summary.totalComments)}</div>
              <div className="text-[#a2abb3] text-sm">Comentários</div>
            </div>
            
            <div className="bg-[#2c3135] rounded-lg p-4">
              <div className="text-purple-400 text-2xl font-bold">{allChannelsStats.summary.totalVideos}</div>
              <div className="text-[#a2abb3] text-sm">Vídeos Totais</div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Canais YouTube */}
      <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl overflow-hidden">
        <div className="bg-[#2c3135] px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-bold">Canais YouTube Conectados</h3>
            <span className="text-[#a2abb3] text-sm">
              {youtubeChannels.length} canais • {getConnectedChannelsCount()} conectados
            </span>
          </div>
        </div>

        {youtubeLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="mt-2 text-[#a2abb3]">Carregando canais...</p>
          </div>
        ) : !hasYouTubeChannels() ? (
          <div className="text-center py-12">
            <div className="text-[#a2abb3] mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Nenhum canal YouTube conectado</h3>
            <p className="text-[#a2abb3] mb-6">Conecte seu primeiro canal YouTube para começar uploads.</p>
            <button
              onClick={() => setShowConnectYouTubeModal(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              ➕ Conectar Primeiro Canal
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#2c3135]">
            {youtubeChannels.map((channel) => {
              const stats = getChannelStats(channel.userId);
              const isActive = channel.userId === activeChannelId;
              const isPolling = isChannelPolling(channel.userId);
              const isRemoving = youtubeRemoving === channel.userId;

              return (
                <div key={channel.userId} className="p-6 hover:bg-[#2c3135]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      <div className="bg-red-600 rounded-full h-16 w-16 flex items-center justify-center text-2xl relative">
                        {getStatusIcon(channel.connectionStatus)}
                        {isPolling && (
                          <div className="absolute -bottom-1 -right-1">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Informações do Canal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-bold text-lg">{channel.channelName}</h3>
                        {isActive && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400">
                            ✅ ATIVO
                          </span>
                        )}
                        {isPolling && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400">
                            🔄 Conectando...
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-medium ${getStatusColor(channel.connectionStatus)}`}>
                          {getStatusText(channel.connectionStatus)}
                        </span>
                        <span className="text-[#a2abb3] text-sm">•</span>
                        <span className="text-[#a2abb3] text-sm">ID: {channel.userId}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[#a2abb3] mb-2">
                        <div>
                          <span className="font-medium">Vídeos:</span> {channel.videoCount}
                        </div>
                        <div>
                          <span className="font-medium">Inscritos:</span> {channel.subscriberCount}
                        </div>
                        {stats && (
                          <>
                            <div>
                              <span className="font-medium">Views:</span> {formatNumber(stats.views)}
                            </div>
                            <div>
                              <span className="font-medium">Likes:</span> {formatNumber(stats.likes)}
                            </div>
                          </>
                        )}
                      </div>
                      
                      {channel.lastUsed && (
                        <div className="text-sm text-[#a2abb3]">
                          <span className="font-medium">Último uso:</span> {new Date(channel.lastUsed).toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {channel.connectionStatus === 'CONNECTED' && !isActive && (
                        <button
                          onClick={() => handleSelectYouTubeChannel(channel.userId)}
                          disabled={youtubeSelecting}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          {youtubeSelecting ? 'Selecionando...' : '🎯 Selecionar'}
                        </button>
                      )}
                      
                      <button
                        onClick={() => setShowRemoveYouTubeConfirm(channel.userId)}
                        disabled={isRemoving || isPolling}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {isRemoving ? 'Removendo...' : '🗑️ Remover'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#121416] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex h-full flex-1">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="layout-content-container flex flex-col flex-1">
            <div className="flex flex-col bg-[#121416] p-8 flex-1 overflow-y-auto">
              {/* Header Geral */}
              <div className="flex flex-wrap justify-between gap-6 mb-6">
                <div className="flex min-w-72 flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-white text-2xl font-bold leading-tight">Gerenciar Canais</h1>
                    <p className="text-[#a2abb3] text-base font-normal leading-normal">
                      Conecte canais da Twitch para monitoramento e canais YouTube para upload
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs para Twitch e YouTube */}
              <div className="mb-6">
                <div className="border-b border-[#2c3135]">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('twitch')}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'twitch'
                          ? 'border-purple-500 text-purple-400'
                          : 'border-transparent text-[#a2abb3] hover:text-white hover:border-[#a2abb3]'
                      }`}
                    >
                      🎮 Canais Twitch ({twitchChannels.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('youtube')}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'youtube'
                          ? 'border-red-500 text-red-400'
                          : 'border-transparent text-[#a2abb3] hover:text-white hover:border-[#a2abb3]'
                      }`}
                    >
                      📺 Canais YouTube ({youtubeChannels.length})
                    </button>
                  </nav>
                </div>
              </div>

              {/* Conteúdo das Tabs */}
              {activeTab === 'twitch' ? renderTwitchChannels() : renderYouTubeChannels()}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Adicionar Canal Twitch */}
      {showAddTwitchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1c1f22] rounded-lg p-6 w-full max-w-md border border-[#2c3135]">
            <h3 className="text-lg font-semibold mb-4 text-white">Adicionar Canal Twitch</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#a2abb3] mb-2">
                  Nome do Canal *
                </label>
                <input
                  type="text"
                  value={newTwitchChannel.name}
                  onChange={(e) => setNewTwitchChannel({...newTwitchChannel, name: e.target.value})}
                  placeholder="Ex: gaules, loud_coringa"
                  className="w-full px-3 py-2 bg-[#2c3135] border border-[#2c3135] rounded-lg text-white placeholder-[#a2abb3] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#a2abb3] mb-2">
                  URL (opcional)
                </label>
                <input
                  type="text"
                  value={newTwitchChannel.url}
                  onChange={(e) => setNewTwitchChannel({...newTwitchChannel, url: e.target.value})}
                  placeholder="https://twitch.tv/gaules"
                  className="w-full px-3 py-2 bg-[#2c3135] border border-[#2c3135] rounded-lg text-white placeholder-[#a2abb3] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a2abb3] mb-2">
                  Descrição (opcional)
                </label>
                <input
                  type="text"
                  value={newTwitchChannel.description}
                  onChange={(e) => setNewTwitchChannel({...newTwitchChannel, description: e.target.value})}
                  placeholder="Canal de jogos CS2"
                  className="w-full px-3 py-2 bg-[#2c3135] border border-[#2c3135] rounded-lg text-white placeholder-[#a2abb3] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddTwitchModal(false);
                  setNewTwitchChannel({ name: '', url: '', description: '', platform: 'twitch' });
                }}
                className="flex-1 bg-[#2c3135] text-[#a2abb3] px-4 py-2 rounded-lg hover:bg-[#3c4147] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTwitchChannel}
                disabled={!newTwitchChannel.name.trim() || twitchLoading}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {twitchLoading ? 'Adicionando...' : '🎮 Adicionar Canal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Conectar Canal YouTube */}
      {showConnectYouTubeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1c1f22] rounded-lg p-6 w-full max-w-md border border-[#2c3135]">
            <h3 className="text-lg font-semibold mb-4 text-white">Conectar Canal YouTube</h3>
            
            <p className="text-[#a2abb3] mb-6">
              Tem certeza que deseja conectar um novo canal YouTube?
              <br />
              <span className="text-sm">Esta ação não pode ser desfeita.</span>
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConnectYouTubeModal(false)}
                className="flex-1 bg-[#2c3135] text-[#a2abb3] px-4 py-2 rounded-lg hover:bg-[#3c4147] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConnectYouTube}
                disabled={connectingYouTube}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {connectingYouTube ? 'Conectando...' : '🎯 Conectar Canal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Remoção Twitch */}
      {showRemoveTwitchConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1c1f22] rounded-lg p-6 w-full max-w-md border border-[#2c3135]">
            <h3 className="text-lg font-semibold mb-4 text-white">Confirmar Remoção</h3>
            
            <p className="text-[#a2abb3] mb-6">
              Tem certeza que deseja remover o canal Twitch <strong className="text-white">
                {twitchChannels.find(c => c.id === showRemoveTwitchConfirm)?.name}
              </strong>?
              <br />
              <span className="text-sm">Esta ação não pode ser desfeita.</span>
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowRemoveTwitchConfirm(null)}
                className="flex-1 bg-[#2c3135] text-[#a2abb3] px-4 py-2 rounded-lg hover:bg-[#3c4147] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleRemoveTwitchChannel(showRemoveTwitchConfirm)}
                disabled={twitchLoading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {twitchLoading ? 'Removendo...' : '🗑️ Remover'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Remoção YouTube */}
      {showRemoveYouTubeConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1c1f22] rounded-lg p-6 w-full max-w-md border border-[#2c3135]">
            <h3 className="text-lg font-semibold mb-4 text-white">Confirmar Remoção</h3>
            
            <p className="text-[#a2abb3] mb-6">
              Tem certeza que deseja remover o canal YouTube <strong className="text-white">{getChannelById(showRemoveYouTubeConfirm)?.channelName}</strong>?
              <br />
              <span className="text-sm">Esta ação não pode ser desfeita.</span>
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowRemoveYouTubeConfirm(null)}
                className="flex-1 bg-[#2c3135] text-[#a2abb3] px-4 py-2 rounded-lg hover:bg-[#3c4147] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleRemoveYouTubeChannel(showRemoveYouTubeConfirm)}
                disabled={youtubeRemoving === showRemoveYouTubeConfirm}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {youtubeRemoving === showRemoveYouTubeConfirm ? 'Removendo...' : '🗑️ Remover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 