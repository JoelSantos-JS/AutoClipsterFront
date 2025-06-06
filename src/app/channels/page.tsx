"use client";

import { useState } from "react";
import { useChannels } from '../../hooks/useChannels';
import { ChannelRequest } from '../../types';
import Sidebar from "../../components/Sidebar";

export default function ChannelsPage() {
  const {
    channels,
    loading,
    error,
    addChannel,
    removeChannel,
    testChannel,
    refreshChannels
  } = useChannels();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<number, { message: string; clips: number; responseTime: number } | undefined>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<ChannelRequest>({
    name: '',
    platform: 'twitch',
    url: '',
    description: ''
  });
  const [actionLoading, setActionLoading] = useState({
    add: false,
    remove: {} as Record<number, boolean>,
    test: {} as Record<number, boolean>,
    refresh: false
  });

  const handleAddChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(prev => ({ ...prev, add: true }));
    
    try {
      const success = await addChannel(formData);
      if (success) {
        setSuccessMessage('Canal adicionado com sucesso!');
        setShowAddForm(false);
        setFormData({ name: '', platform: 'twitch', url: '', description: '' });
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error adding channel:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, add: false }));
    }
  };

  const handleRemoveChannel = async (channelId: number) => {
    setActionLoading(prev => ({ 
      ...prev, 
      remove: { ...prev.remove, [channelId]: true }
    }));
    
    try {
      const success = await removeChannel(channelId);
      if (success) {
        setSuccessMessage('Canal removido com sucesso!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error removing channel:', err);
    } finally {
      setActionLoading(prev => ({ 
        ...prev, 
        remove: { ...prev.remove, [channelId]: false }
      }));
    }
  };

  const handleTestChannel = async (channelId: number) => {
    setActionLoading(prev => ({ 
      ...prev, 
      test: { ...prev.test, [channelId]: true }
    }));
    
    try {
      const result = await testChannel(channelId);
      if (result) {
        setTestResults(prev => ({ ...prev, [channelId]: result }));
        setSuccessMessage(`Teste realizado: ${result.message}`);
        setTimeout(() => {
          setSuccessMessage(null);
          setTestResults(prev => ({ ...prev, [channelId]: undefined }));
        }, 5000);
      }
    } catch (err) {
      console.error('Error testing channel:', err);
    } finally {
      setActionLoading(prev => ({ 
        ...prev, 
        test: { ...prev.test, [channelId]: false }
      }));
    }
  };

  const handleRefresh = async () => {
    setActionLoading(prev => ({ ...prev, refresh: true }));
    try {
      refreshChannels();
    } finally {
      setActionLoading(prev => ({ ...prev, refresh: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-900/30 text-green-400';
      case 'inactive': return 'bg-gray-900/30 text-gray-400';
      case 'error': return 'bg-red-900/30 text-red-400';
      default: return 'bg-gray-900/30 text-gray-400';
    }
  };

  const getPlatformIcon = (platform: string) => {
    if (platform === 'twitch') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
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
            {/* Main Content Area */}
            <div className="flex flex-col bg-[#121416] p-8 flex-1 overflow-y-auto">
              {/* Header */}
              <div className="flex flex-wrap justify-between gap-3 mb-6">
                <div className="flex min-w-72 flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-white text-2xl font-bold leading-tight">Canais</h1>
                    <p className="text-[#a2abb3] text-base font-normal leading-normal">Gerencie os canais dos quais você extrai clipes</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleRefresh}
                      disabled={actionLoading.refresh}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2c3135] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
                    >
                      <span className="truncate">
                        {actionLoading.refresh ? 'Atualizando...' : 'Atualizar'}
                      </span>
                    </button>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2884e6] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                      <span className="truncate">Adicionar Canal</span>
                    </button>
                  </div>

                  {/* Messages */}
                  {error && (
                    <div className="flex items-center gap-3 rounded-xl bg-red-900/20 border border-red-600/30 p-4">
                      <div className="text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM116,96v64a12,12,0,0,0,24,0V96a12,12,0,0,0-24,0Z"/>
                        </svg>
                      </div>
                      <span className="text-red-300 text-sm">{error}</span>
                    </div>
                  )}

                  {successMessage && (
                    <div className="flex items-center gap-3 rounded-xl bg-green-900/20 border border-green-600/30 p-4">
                      <div className="text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/>
                        </svg>
                      </div>
                      <span className="text-green-300 text-sm">{successMessage}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Channel Modal */}
              {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-[#1c1f22] rounded-lg p-6 w-full max-w-md border border-[#2c3135]">
                    <h3 className="text-lg font-semibold mb-4 text-white">Adicionar Novo Canal</h3>
                    
                    <form onSubmit={handleAddChannel} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Nome do Canal
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[#2c3135] border border-[#4a5568] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2884e6]"
                          placeholder="Ex: shroud, xQc, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Plataforma
                        </label>
                        <select
                          value={formData.platform}
                          onChange={(e) => setFormData({ ...formData, platform: e.target.value as 'twitch' | 'youtube' })}
                          className="w-full bg-[#2c3135] border border-[#4a5568] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2884e6]"
                        >
                          <option value="twitch">Twitch</option>
                          <option value="youtube">YouTube</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          URL do Canal
                        </label>
                        <input
                          type="url"
                          required
                          value={formData.url}
                          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                          className="w-full bg-[#2c3135] border border-[#4a5568] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2884e6]"
                          placeholder="https://twitch.tv/nome-do-canal"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="flex-1 bg-[#2c3135] text-[#a2abb3] px-4 py-2 rounded-lg hover:bg-[#3c4147] transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={actionLoading.add}
                          className="flex-1 bg-[#2884e6] text-white px-4 py-2 rounded-lg hover:bg-[#2672cc] transition-colors disabled:opacity-50"
                        >
                          {actionLoading.add ? 'Adicionando...' : 'Adicionar'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Channels List */}
              {loading ? (
                <div className="flex min-h-[180px] flex-col gap-8 rounded-xl bg-[#1c1f22] p-4">
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    <p className="mt-2 text-[#a2abb3]">Carregando canais...</p>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[180px] flex-col gap-8 rounded-xl bg-[#1c1f22] p-4">
                  {channels.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-[#a2abb3] mb-4">
                        <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9zm7 4H8v10h8V7z"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">Nenhum canal encontrado</h3>
                      <p className="text-[#a2abb3] mb-6">Comece adicionando seu primeiro canal para extrair clipes.</p>
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-[#2884e6] text-white px-6 py-2 rounded-lg hover:bg-[#2672cc] transition-colors"
                      >
                        Adicionar Primeiro Canal
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="px-6 py-4 border-b border-[#2c3135]">
                        <h3 className="text-lg font-medium text-white">
                          {channels.length} {channels.length === 1 ? 'canal' : 'canais'} cadastrado{channels.length !== 1 ? 's' : ''}
                        </h3>
                      </div>
                      
                      <div className="divide-y divide-[#2c3135]">
                        {channels.map((channel) => (
                          <div key={channel.id} className="p-6 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                                <div className={`p-2 rounded-lg ${
                                  channel.platform === 'twitch' ? 'bg-purple-900/20 text-purple-400' : 'bg-red-900/20 text-red-400'
                                }`}>
                                  {getPlatformIcon(channel.platform)}
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h4 className="text-lg font-medium text-white truncate">
                                    {channel.name}
                                  </h4>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(channel.status)}`}>
                                    {channel.status}
                                  </span>
                                </div>
                                
                                <div className="mt-1 flex items-center space-x-4 text-sm text-[#a2abb3]">
                                  <span className="capitalize">{channel.platform}</span>
                                  {channel.lastClipAt && (
                                    <span>Último clip: {new Date(channel.lastClipAt).toLocaleDateString()}</span>
                                  )}
                                </div>
                                
                                <div className="mt-1">
                                  <a
                                    href={channel.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#2884e6] hover:text-[#4a9eff] text-sm truncate max-w-xs inline-block"
                                  >
                                    {channel.url}
                                  </a>
                                </div>

                                {testResults[channel.id] && (
                                  <div className="mt-2 p-2 bg-green-900/20 border border-green-600/30 rounded text-sm">
                                    <p className="text-green-300">
                                      ✓ {testResults[channel.id]?.message}
                                    </p>
                                    <p className="text-green-400">
                                      {testResults[channel.id]?.clips} clips encontrados • {testResults[channel.id]?.responseTime}ms
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleTestChannel(channel.id)}
                                disabled={actionLoading.test[channel.id]}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                {actionLoading.test[channel.id] ? 'Testando...' : 'Testar'}
                              </button>
                              
                              <button
                                onClick={() => handleRemoveChannel(channel.id)}
                                disabled={actionLoading.remove[channel.id]}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                {actionLoading.remove[channel.id] ? 'Removendo...' : 'Remover'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 