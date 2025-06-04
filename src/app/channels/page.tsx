"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useChannels } from '../../hooks';
import { ChannelRequest } from '../../types';

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
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          {/* Sidebar */}
          <div className="layout-content-container flex flex-col w-80">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-[#121416] p-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-3 p-3">
                  <div className="text-white flex size-6 shrink-0 items-center">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_6_543)">
                        <path
                          d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                          fill="currentColor"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z"
                          fill="currentColor"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_6_543">
                          <rect width="48" height="48" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">AutoClipster</h2>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href="/" className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#a2abb3]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48ZM104,136H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z" />
                      </svg>
                    </div>
                    <p className="text-[#a2abb3] text-sm font-medium leading-normal">Dashboard</p>
                  </Link>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#2c3135]">
                    <div className="text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M231.79,187.33A80,80,0,0,0,169.6,72.72L151.36,131.4A40,40,0,1,1,124.6,104.64l58.68-18.24A80,80,0,0,0,68.67,152.21L20.5,199.83a12,12,0,0,0,17,17l47.62-47.62A80,80,0,0,0,231.79,187.33ZM80,152a40,40,0,1,1,40,40A40,40,0,0,1,80,152Z" />
                      </svg>
                    </div>
                    <p className="text-white text-sm font-medium leading-normal">Channels</p>
                  </div>
                  <Link href="/workflows" className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#a2abb3]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25a8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3.12-3.12L186,40.44a8,8,0,0,0-3.93-6,107.29,107.29,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.49A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.56-3.12,3.12L40.44,70a8,8,0,0,0-6,3.93,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.49,7.06,107.6,107.6,0,0,0,10.87,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.56,1.56,3.12,3.12L70,215.56a8,8,0,0,0,3.93,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.49,107.29,107.29,0,0,0,26.25-10.87,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.56,3.12-3.12L215.56,186a8,8,0,0,0,6-3.93,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06ZM128,192a64,64,0,1,1,64-64A64.07,64.07,0,0,1,128,192Z" />
                      </svg>
                    </div>
                    <p className="text-[#a2abb3] text-sm font-medium leading-normal">Workflows</p>
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#a2abb3]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M237.94,107.21a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.91,25a8,8,0,0,0-6.46-.59A111.91,111.91,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.08L51.78,84.84,21.95,101.81a8,8,0,0,0-3.89,5.4,112.1,112.1,0,0,0,0,41.58,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.62a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.09,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.56-.42,111.91,111.91,0,0,0,36.72-20.67,8,8,0,0,0,2.83-6.08l.12-33.62,29.83-17a8,8,0,0,0,3.89-5.4A112.1,112.1,0,0,0,237.94,107.21ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" />
                      </svg>
                    </div>
                    <p className="text-[#a2abb3] text-sm font-medium leading-normal">Settings</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
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
              <div className="flex min-h-[180px] flex-col gap-8 rounded-xl bg-[#1c1f22] p-4 m-4">
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                  <p className="mt-2 text-[#a2abb3]">Carregando canais...</p>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[180px] flex-col gap-8 rounded-xl bg-[#1c1f22] p-4 m-4">
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
  );
} 