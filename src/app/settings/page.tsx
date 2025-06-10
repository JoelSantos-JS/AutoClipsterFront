"use client";

import { useState, useEffect } from "react";
import { useSettings, UseSettingsReturn } from "../../hooks/useSettings";
import { AdvancedSettings } from "../../services/settings";
import Sidebar from "../../components/Sidebar";

export default function SettingsPage() {
  const {
    settings,
    autoUploadStatus,
    isLoading,
    error,
    updateSettings,
    toggleAutoUpload,
    createBackup,
    savingSettings,
    togglingAutoUpload,
    creatingBackup
  }: UseSettingsReturn = useSettings();

  const [formData, setFormData] = useState<AdvancedSettings | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!formData) return;
    
    setLocalError(null);
    setSuccess(null);
    
    try {
      await updateSettings(formData);
      setSuccess('Configurações salvas com sucesso!');
    } catch {
      setLocalError('Erro ao salvar configurações. Tente novamente.');
    }
  };

  const handleToggleAutoUpload = async (enabled: boolean) => {
    setLocalError(null);
    setSuccess(null);
    
    try {
      await toggleAutoUpload(enabled);
      setSuccess(`Upload automático ${enabled ? 'habilitado' : 'desabilitado'} com sucesso!`);
    } catch {
      setLocalError('Erro ao alterar upload automático.');
    }
  };

  const handleBackup = async () => {
    setLocalError(null);
    setSuccess(null);
    
    try {
      const backupId = await createBackup();
      if (backupId) {
        setSuccess(`Backup criado com sucesso! ID: ${backupId}`);
      }
    } catch {
      setLocalError('Erro ao criar backup.');
    }
  };

  const updateFormData = (field: keyof AdvancedSettings, value: unknown) => {
    if (!formData) return;
    
    setFormData(prev => prev ? {
      ...prev,
      [field]: value,
    } : null);
  };

  const updateNestedFormData = (section: keyof AdvancedSettings, field: string, value: unknown) => {
    if (!formData) return;
    
    setFormData(prev => {
      if (!prev) return null;
      const currentSection = prev[section];
      
      if (typeof currentSection === 'object' && currentSection !== null) {
        return {
          ...prev,
          [section]: {
            ...currentSection,
            [field]: value,
          },
        };
      }
      
      return prev;
    });
  };

  if (isLoading || !formData) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-[#121416] group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex h-full flex-1">
            <Sidebar />
            <div className="layout-content-container flex flex-col flex-1">
              <div className="flex flex-col bg-[#121416] p-8 flex-1 items-center justify-center">
                <div className="text-white text-lg">Carregando configurações...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayError = error || localError;

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
                    Configurações Avançadas
                  </h1>
                  <p className="text-[#a2abb3] text-base font-normal leading-normal">
                    Configure as preferências do sistema de upload automático
                  </p>
                </div>
              </div>

              {/* Auto Upload Status */}
              {autoUploadStatus && (
                <div className="mb-6 p-4 bg-[#1c1f22] border border-[#40484f] rounded-xl">
                  <h3 className="text-white text-lg font-semibold mb-3">Status do Upload Automático</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[#a2abb3]">Status</p>
                      <p className={`font-semibold ${autoUploadStatus.autoUploadEnabled ? 'text-green-400' : 'text-red-400'}`}>
                        {autoUploadStatus.autoUploadEnabled ? 'Habilitado' : 'Desabilitado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#a2abb3]">Pendentes</p>
                      <p className="text-white font-semibold">{autoUploadStatus.pendingUploads}</p>
                    </div>
                    <div>
                      <p className="text-[#a2abb3]">Na Fila</p>
                      <p className="text-white font-semibold">{autoUploadStatus.queuedClips}</p>
                    </div>
                    <div>
                      <p className="text-[#a2abb3]">Total Enviados</p>
                      <p className="text-white font-semibold">{autoUploadStatus.totalUploaded}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {displayError && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 font-semibold">Erro</p>
                  <p className="text-red-300">{displayError}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                  <p className="text-green-400 font-semibold">Sucesso!</p>
                  <p className="text-green-300">{success}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mb-6 flex gap-4 flex-wrap">
                <button
                  onClick={handleSave}
                  disabled={savingSettings}
                  className="bg-[#2c90ea] text-white px-6 py-2 rounded-xl hover:bg-[#2c90ea]/80 transition-colors disabled:opacity-50"
                >
                  {savingSettings ? 'Salvando...' : 'Salvar Configurações'}
                </button>
                
                <button
                  onClick={() => handleToggleAutoUpload(!formData?.autoUploadEnabled)}
                  disabled={togglingAutoUpload}
                  className={`px-6 py-2 rounded-xl transition-colors disabled:opacity-50 ${
                    formData?.autoUploadEnabled 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {togglingAutoUpload 
                    ? 'Alterando...' 
                    : formData?.autoUploadEnabled 
                      ? 'Desabilitar Auto-Upload' 
                      : 'Habilitar Auto-Upload'
                  }
                </button>
                
                <button
                  onClick={handleBackup}
                  disabled={creatingBackup}
                  className="bg-[#6c757d] text-white px-6 py-2 rounded-xl hover:bg-[#5a6268] transition-colors disabled:opacity-50"
                >
                  {creatingBackup ? 'Criando Backup...' : 'Criar Backup'}
                </button>
              </div>

              {/* Tabs */}
              <div className="flex mb-6 border-b border-[#40484f] overflow-x-auto">
                {['general', 'upload', 'youtube', 'gemini', 'limits'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium capitalize whitespace-nowrap ${
                      activeTab === tab
                        ? 'text-[#2c90ea] border-b-2 border-[#2c90ea]'
                        : 'text-[#a2abb3] hover:text-white'
                    }`}
                  >
                    {tab === 'general' ? 'Geral' : 
                     tab === 'upload' ? 'Upload' :
                     tab === 'youtube' ? 'YouTube Shorts' :
                     tab === 'gemini' ? 'Gemini AI' :
                     'Limites'}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="bg-[#1c1f22] border border-[#40484f] rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Configurações Gerais</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Upload Automático</label>
                        <input
                          type="checkbox"
                          checked={formData.autoUploadEnabled}
                          onChange={(e) => updateFormData('autoUploadEnabled', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      
                      <div>
                        <label className="text-white text-sm block mb-2">Score Mínimo para Upload</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={formData.autoUploadMinScore}
                          onChange={(e) => updateFormData('autoUploadMinScore', parseFloat(e.target.value))}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="text-white text-sm block mb-2">Score Viral Mínimo</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={formData.minViralScore}
                          onChange={(e) => updateFormData('minViralScore', parseFloat(e.target.value))}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="text-white text-sm block mb-2">Views Mínimas</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.minViews}
                          onChange={(e) => updateFormData('minViews', parseInt(e.target.value))}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-white text-sm block mb-2">Duração Mínima (s)</label>
                          <input
                            type="number"
                            min="1"
                            value={formData.minDuration}
                            onChange={(e) => updateFormData('minDuration', parseInt(e.target.value))}
                            className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="text-white text-sm block mb-2">Duração Máxima (s)</label>
                          <input
                            type="number"
                            min="1"
                            value={formData.maxDuration}
                            onChange={(e) => updateFormData('maxDuration', parseInt(e.target.value))}
                            className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-white text-sm block mb-2">Intervalo de Monitoramento (min)</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.monitoringInterval}
                          onChange={(e) => updateFormData('monitoringInterval', parseInt(e.target.value))}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Retentar Uploads Falhados</label>
                        <input
                          type="checkbox"
                          checked={formData.retryFailedUploads}
                          onChange={(e) => updateFormData('retryFailedUploads', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Ativar Webhooks</label>
                        <input
                          type="checkbox"
                          checked={formData.enableWebhooks}
                          onChange={(e) => updateFormData('enableWebhooks', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      
                      {formData.enableWebhooks && (
                        <div>
                          <label className="text-white text-sm block mb-2">URL do Webhook</label>
                          <input
                            type="url"
                            value={formData.webhookUrl || ''}
                            onChange={(e) => updateFormData('webhookUrl', e.target.value)}
                            placeholder="https://your-webhook-url.com"
                            className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* YouTube Shorts Settings */}
                {activeTab === 'youtube' && (
                  <div className="bg-[#1c1f22] border border-[#40484f] rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Configurações do YouTube Shorts</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Ativar YouTube Shorts</label>
                        <input
                          type="checkbox"
                          checked={formData.youtubeShorts.enabled}
                          onChange={(e) => updateNestedFormData('youtubeShorts', 'enabled', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      
                      <div>
                        <label className="text-white text-sm block mb-2">Duração Máxima (s)</label>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={formData.youtubeShorts.maxDuration}
                          onChange={(e) => updateNestedFormData('youtubeShorts', 'maxDuration', parseInt(e.target.value))}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="text-white text-sm block mb-2">Proporção de Aspecto</label>
                        <select
                          value={formData.youtubeShorts.aspectRatio}
                          onChange={(e) => updateNestedFormData('youtubeShorts', 'aspectRatio', e.target.value)}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                        >
                          <option value="9:16">9:16 (Vertical)</option>
                          <option value="16:9">16:9 (Horizontal)</option>
                          <option value="1:1">1:1 (Quadrado)</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Usar Hashtags</label>
                        <input
                          type="checkbox"
                          checked={formData.youtubeShorts.hashtagsEnabled}
                          onChange={(e) => updateNestedFormData('youtubeShorts', 'hashtagsEnabled', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Gemini AI Settings */}
                {activeTab === 'gemini' && (
                  <div className="bg-[#1c1f22] border border-[#40484f] rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Configurações do Gemini AI</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Ativar Gemini AI</label>
                        <input
                          type="checkbox"
                          checked={formData.geminiAI.enabled}
                          onChange={(e) => updateNestedFormData('geminiAI', 'enabled', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      
                      {formData.geminiAI.enabled && (
                        <>
                          <div>
                            <label className="text-white text-sm block mb-2">Chave da API do Gemini</label>
                            <input
                              type="password"
                              value={formData.geminiAI.apiKey || ''}
                              onChange={(e) => updateNestedFormData('geminiAI', 'apiKey', e.target.value)}
                              placeholder="Sua chave da API do Gemini"
                              className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <label className="text-white text-sm">Aprimorar Títulos</label>
                            <input
                              type="checkbox"
                              checked={formData.geminiAI.enhanceTitles}
                              onChange={(e) => updateNestedFormData('geminiAI', 'enhanceTitles', e.target.checked)}
                              className="w-4 h-4"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <label className="text-white text-sm">Aprimorar Descrições</label>
                            <input
                              type="checkbox"
                              checked={formData.geminiAI.enhanceDescriptions}
                              onChange={(e) => updateNestedFormData('geminiAI', 'enhanceDescriptions', e.target.checked)}
                              className="w-4 h-4"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <label className="text-white text-sm">Gerar Tags</label>
                            <input
                              type="checkbox"
                              checked={formData.geminiAI.generateTags}
                              onChange={(e) => updateNestedFormData('geminiAI', 'generateTags', e.target.checked)}
                              className="w-4 h-4"
                            />
                          </div>
                          
                          <div>
                            <label className="text-white text-sm block mb-2">Limite de Score Viral</label>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="10"
                              value={formData.geminiAI.viralScoreThreshold}
                              onChange={(e) => updateNestedFormData('geminiAI', 'viralScoreThreshold', parseFloat(e.target.value))}
                              className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Rate Limiting Settings */}
                {activeTab === 'limits' && (
                  <div className="bg-[#1c1f22] border border-[#40484f] rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Limites de Taxa da API</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-white text-sm block mb-2">Chamadas da API Twitch (por hora)</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.rateLimiting.twitchApiCalls}
                          onChange={(e) => updateNestedFormData('rateLimiting', 'twitchApiCalls', parseInt(e.target.value))}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="text-white text-sm block mb-2">Chamadas da API YouTube (por dia)</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.rateLimiting.youtubeApiCalls}
                          onChange={(e) => updateNestedFormData('rateLimiting', 'youtubeApiCalls', parseInt(e.target.value))}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="text-white text-sm block mb-2">Chamadas da API AI (por hora)</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.rateLimiting.aiApiCalls}
                          onChange={(e) => updateNestedFormData('rateLimiting', 'aiApiCalls', parseInt(e.target.value))}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                        />
                      </div>
                    </div>
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