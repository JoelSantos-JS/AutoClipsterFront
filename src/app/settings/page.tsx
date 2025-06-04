"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '../../services';
import { SystemSettings } from '../../types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  // Form states
  const [formData, setFormData] = useState({
    upload: {
      youtubeAutoUpload: false,
      defaultPrivacy: 'unlisted'
    },
    ai: {
      enabled: true,
      rateLimit: 100,
      model: 'gemini-pro'
    },
    quality: {
      minViralScore: 6.0,
      minViews: 1000,
      minDuration: 15,
      maxDuration: 60
    },
    notifications: {
      emailEnabled: true,
      desktopEnabled: false,
      webhookEnabled: false
    },
    apiKeys: {
      twitchClientId: '',
      twitchClientSecret: '',
      youtubeApiKey: '',
      geminiApiKey: ''
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const settingsData = await apiClient.get<SystemSettings>('/api/settings');
      setSettings(settingsData);
      setFormData({
        upload: settingsData.upload,
        ai: settingsData.ai,
        quality: settingsData.quality,
        notifications: settingsData.notifications,
        apiKeys: {
          twitchClientId: '',
          twitchClientSecret: '',
          youtubeApiKey: '',
          geminiApiKey: ''
        }
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      
      await apiClient.put('/api/settings', formData);
      setSuccessMessage('Configurações salvas com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Refresh settings
      await fetchSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const testConnections = async () => {
    try {
      setLoading(true);
      const results = await apiClient.get('/api/settings/test-connections');
      console.log('Connection test results:', results);
      setSuccessMessage('Testes de conexão executados! Verifique o console para detalhes.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test connections');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section: string, field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  if (loading && !settings) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

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
                  <Link href="/channels" className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#a2abb3]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M231.79,187.33A80,80,0,0,0,169.6,72.72L151.36,131.4A40,40,0,1,1,124.6,104.64l58.68-18.24A80,80,0,0,0,68.67,152.21L20.5,199.83a12,12,0,0,0,17,17l47.62-47.62A80,80,0,0,0,231.79,187.33ZM80,152a40,40,0,1,1,40,40A40,40,0,0,1,80,152Z" />
                      </svg>
                    </div>
                    <p className="text-[#a2abb3] text-sm font-medium leading-normal">Channels</p>
                  </Link>
                  <Link href="/workflows" className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#a2abb3]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3.12-3.12L186,40.44a8,8,0,0,0-3.93-6,107.29,107.29,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.49A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.56-3.12,3.12L40.44,70a8,8,0,0,0-6,3.93,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.49,7.06,107.6,107.6,0,0,0,10.87,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.56,1.56,3.12,3.12L70,215.56a8,8,0,0,0,3.93,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.49,107.29,107.29,0,0,0,26.25-10.87,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.56,3.12-3.12L215.56,186a8,8,0,0,0,6-3.93,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06ZM128,192a64,64,0,1,1,64-64A64.07,64.07,0,0,1,128,192Z" />
                      </svg>
                    </div>
                    <p className="text-[#a2abb3] text-sm font-medium leading-normal">Workflows</p>
                  </Link>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#2c3135]">
                    <div className="text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M237.94,107.21a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.91,25a8,8,0,0,0-6.46-.59A111.91,111.91,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.08L51.78,84.84,21.95,101.81a8,8,0,0,0-3.89,5.4,112.1,112.1,0,0,0,0,41.58,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.62a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.09,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.56-.42,111.91,111.91,0,0,0,36.72-20.67,8,8,0,0,0,2.83-6.08l.12-33.62,29.83-17a8,8,0,0,0,3.89-5.4A112.1,112.1,0,0,0,237.94,107.21ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" />
                      </svg>
                    </div>
                    <p className="text-white text-sm font-medium leading-normal">Settings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h1 className="text-white text-2xl font-bold leading-tight">Configurações</h1>
                  <p className="text-[#a2abb3] text-base font-normal leading-normal">Gerencie as configurações do sistema e APIs</p>
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

                <div className="flex min-h-[400px] flex-col gap-8 rounded-xl bg-[#1c1f22] p-6">
                  {/* Tabs */}
                  <div className="border-b border-[#2c3135]">
                    <nav className="flex">
                      {[
                        { key: 'general', label: 'Geral' },
                        { key: 'upload', label: 'Upload' },
                        { key: 'ai', label: 'IA' },
                        { key: 'quality', label: 'Qualidade' },
                        { key: 'notifications', label: 'Notificações' },
                        { key: 'api', label: 'API Keys' }
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`px-6 py-4 text-sm font-medium border-b-2 ${
                            activeTab === tab.key
                              ? 'border-[#2884e6] text-[#2884e6]'
                              : 'border-transparent text-[#a2abb3] hover:text-white hover:border-[#4a5568]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="space-y-6">
                    {/* General Tab */}
                    {activeTab === 'general' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-white text-lg font-medium mb-4">Configurações Gerais</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-[#a2abb3] mb-2">
                                  Status do Sistema
                                </label>
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                  <span className="text-sm text-[#a2abb3]">Sistema Operacional</span>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-[#a2abb3] mb-2">
                                  Versão
                                </label>
                                <p className="text-sm text-[#a2abb3]">v1.0.0</p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <button
                                onClick={testConnections}
                                disabled={loading}
                                className="w-full bg-[#2884e6] text-white px-4 py-2 rounded-lg hover:bg-[#2672cc] disabled:opacity-50"
                              >
                                {loading ? 'Testando...' : 'Testar Conexões'}
                              </button>

                              <button className="w-full bg-[#2c3135] text-white px-4 py-2 rounded-lg hover:bg-[#3c4147]">
                                Exportar Configurações
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Upload Tab */}
                    {activeTab === 'upload' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-white text-lg font-medium mb-4">Configurações de Upload</h3>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <label className="text-sm font-medium text-white">
                                  Upload Automático para YouTube
                                </label>
                                <p className="text-xs text-[#a2abb3]">Enviar automaticamente clips processados para o YouTube</p>
                              </div>
                              <button
                                onClick={() => handleInputChange('upload', 'youtubeAutoUpload', !formData.upload.youtubeAutoUpload)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  formData.upload.youtubeAutoUpload ? 'bg-[#2884e6]' : 'bg-[#2c3135]'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    formData.upload.youtubeAutoUpload ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Privacidade Padrão
                              </label>
                              <select
                                value={formData.upload.defaultPrivacy}
                                onChange={(e) => handleInputChange('upload', 'defaultPrivacy', e.target.value)}
                                className="w-full bg-[#2c3135] border border-[#4a5568] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2884e6]"
                              >
                                <option value="private">Privado</option>
                                <option value="unlisted">Não listado</option>
                                <option value="public">Público</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AI Tab */}
                    {activeTab === 'ai' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-white text-lg font-medium mb-4">Configurações de IA</h3>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <label className="text-sm font-medium text-white">
                                  IA Habilitada
                                </label>
                                <p className="text-xs text-[#a2abb3]">Usar IA para otimização de títulos e descrições</p>
                              </div>
                              <button
                                onClick={() => handleInputChange('ai', 'enabled', !formData.ai.enabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  formData.ai.enabled ? 'bg-[#2884e6]' : 'bg-[#2c3135]'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    formData.ai.enabled ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Modelo de IA
                              </label>
                              <select
                                value={formData.ai.model}
                                onChange={(e) => handleInputChange('ai', 'model', e.target.value)}
                                className="w-full bg-[#2c3135] border border-[#4a5568] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2884e6]"
                                disabled={!formData.ai.enabled}
                              >
                                <option value="gemini-pro">Gemini Pro</option>
                                <option value="gemini-pro-vision">Gemini Pro Vision</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Limite de Requisições (por hora)
                              </label>
                              <input
                                type="number"
                                value={formData.ai.rateLimit}
                                onChange={(e) => handleInputChange('ai', 'rateLimit', parseInt(e.target.value))}
                                className="w-full bg-[#2c3135] border border-[#4a5568] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2884e6]"
                                disabled={!formData.ai.enabled}
                                min="1"
                                max="1000"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quality Tab */}
                    {activeTab === 'quality' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-white text-lg font-medium mb-4">Critérios de Qualidade</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Score Viral Mínimo
                              </label>
                              <input
                                type="number"
                                value={formData.quality.minViralScore}
                                onChange={(e) => handleInputChange('quality', 'minViralScore', parseFloat(e.target.value))}
                                className="w-full bg-[#2c3135] border border-[#4a5568] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2884e6]"
                                min="0"
                                max="10"
                                step="0.1"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Visualizações Mínimas
                              </label>
                              <input
                                type="number"
                                value={formData.quality.minViews}
                                onChange={(e) => handleInputChange('quality', 'minViews', parseInt(e.target.value))}
                                className="w-full bg-[#2c3135] border border-[#4a5568] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2884e6]"
                                min="0"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Duração Mínima (segundos)
                              </label>
                              <input
                                type="number"
                                value={formData.quality.minDuration}
                                onChange={(e) => handleInputChange('quality', 'minDuration', parseInt(e.target.value))}
                                className="w-full bg-[#2c3135] border border-[#4a5568] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2884e6]"
                                min="1"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Duração Máxima (segundos)
                              </label>
                              <input
                                type="number"
                                value={formData.quality.maxDuration}
                                onChange={(e) => handleInputChange('quality', 'maxDuration', parseInt(e.target.value))}
                                className="w-full bg-[#2c3135] border border-[#4a5568] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2884e6]"
                                min="1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-white text-lg font-medium mb-4">Configurações de Notificação</h3>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <label className="text-sm font-medium text-white">
                                  Notificações por Email
                                </label>
                                <p className="text-xs text-[#a2abb3]">Receber notificações sobre uploads e processamento</p>
                              </div>
                              <button
                                onClick={() => handleInputChange('notifications', 'emailEnabled', !formData.notifications.emailEnabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  formData.notifications.emailEnabled ? 'bg-[#2884e6]' : 'bg-[#2c3135]'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    formData.notifications.emailEnabled ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <label className="text-sm font-medium text-white">
                                  Notificações Desktop
                                </label>
                                <p className="text-xs text-[#a2abb3]">Mostrar notificações na área de trabalho</p>
                              </div>
                              <button
                                onClick={() => handleInputChange('notifications', 'desktopEnabled', !formData.notifications.desktopEnabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  formData.notifications.desktopEnabled ? 'bg-[#2884e6]' : 'bg-[#2c3135]'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    formData.notifications.desktopEnabled ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <label className="text-sm font-medium text-white">
                                  Webhook
                                </label>
                                <p className="text-xs text-[#a2abb3]">Enviar notificações via webhook</p>
                              </div>
                              <button
                                onClick={() => handleInputChange('notifications', 'webhookEnabled', !formData.notifications.webhookEnabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  formData.notifications.webhookEnabled ? 'bg-[#2884e6]' : 'bg-[#2c3135]'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    formData.notifications.webhookEnabled ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* API Keys Tab */}
                    {activeTab === 'api' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-white text-lg font-medium mb-4">Chaves de API</h3>
                          <p className="text-sm text-[#a2abb3] mb-6">
                            Configure as chaves de API necessárias para o funcionamento do sistema.
                          </p>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Twitch Client ID
                              </label>
                              <input
                                type="password"
                                value={formData.apiKeys.twitchClientId}
                                onChange={(e) => handleInputChange('apiKeys', 'twitchClientId', e.target.value)}
                                className="w-full bg-[#2c3135] border border-[#4a5568] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2884e6]"
                                placeholder={settings?.apiKeys.twitchClientIdMasked || 'Digite o Client ID do Twitch'}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Twitch Client Secret
                              </label>
                              <input
                                type="password"
                                value={formData.apiKeys.twitchClientSecret}
                                onChange={(e) => handleInputChange('apiKeys', 'twitchClientSecret', e.target.value)}
                                className="w-full bg-[#2c3135] border border-[#4a5568] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2884e6]"
                                placeholder={settings?.apiKeys.twitchClientSecretMasked || 'Digite o Client Secret do Twitch'}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                YouTube API Key
                              </label>
                              <input
                                type="password"
                                value={formData.apiKeys.youtubeApiKey}
                                onChange={(e) => handleInputChange('apiKeys', 'youtubeApiKey', e.target.value)}
                                className="w-full bg-[#2c3135] border border-[#4a5568] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2884e6]"
                                placeholder={settings?.apiKeys.youtubeApiKeyMasked || 'Digite a API Key do YouTube'}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Gemini API Key
                              </label>
                              <input
                                type="password"
                                value={formData.apiKeys.geminiApiKey}
                                onChange={(e) => handleInputChange('apiKeys', 'geminiApiKey', e.target.value)}
                                className="w-full bg-[#2c3135] border border-[#4a5568] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2884e6]"
                                placeholder={settings?.apiKeys.geminiApiKeyMasked || 'Digite a API Key do Gemini'}
                              />
                            </div>
                          </div>

                          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-300">
                                  Importante
                                </h3>
                                <div className="mt-2 text-sm text-yellow-200">
                                  <p>
                                    Mantenha suas chaves de API seguras. Elas são necessárias para o funcionamento completo do sistema.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Save Button */}
                    <div className="mt-8 pt-6 border-t border-[#2c3135]">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 border border-[#4a5568] rounded-lg text-[#a2abb3] hover:bg-[#2c3135]"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={saveSettings}
                          disabled={saving}
                          className="px-4 py-2 bg-[#2884e6] text-white rounded-lg hover:bg-[#2672cc] disabled:opacity-50"
                        >
                          {saving ? 'Salvando...' : 'Salvar Configurações'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 