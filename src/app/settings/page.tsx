"use client";

import { useState, useEffect } from "react";
import { useSettings, Settings } from "../../hooks/useSettings";
import Sidebar from "../../components/Sidebar";

export default function SettingsPage() {
  const { settings, saveSettings, testConnection } = useSettings();
  const [formData, setFormData] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!formData) return;
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      await saveSettings(formData);
      setSuccess('Settings saved successfully!');
    } catch {
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async (service: string) => {
    setTesting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await testConnection(service);
      setSuccess(result.message);
    } catch {
      setError(`Failed to test ${service} connection`);
    } finally {
      setTesting(false);
    }
  };

  const updateFormData = (section: keyof Settings, field: string, value: string | boolean) => {
    if (!formData) return;
    
    setFormData(prev => prev ? {
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    } : null);
  };

  if (!formData) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-[#121416] group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex h-full flex-1">
            <Sidebar />
            <div className="layout-content-container flex flex-col flex-1">
              <div className="flex flex-col bg-[#121416] p-8 flex-1 items-center justify-center">
                <div className="text-white text-lg">Loading settings...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    Settings
                  </h1>
                  <p className="text-[#a2abb3] text-base font-normal leading-normal">
                    Configure your application preferences
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 font-semibold">Error</p>
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                  <p className="text-green-400 font-semibold">Success!</p>
                  <p className="text-green-300">{success}</p>
                </div>
              )}

              {/* Save Button */}
              <div className="mb-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#2c90ea] text-white px-6 py-2 rounded-xl hover:bg-[#2c90ea]/80 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>

              {/* Tabs */}
              <div className="flex mb-6 border-b border-[#40484f]">
                {['upload', 'ai', 'quality', 'notifications', 'apiKeys'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium capitalize ${
                      activeTab === tab
                        ? 'text-[#2c90ea] border-b-2 border-[#2c90ea]'
                        : 'text-[#a2abb3] hover:text-white'
                    }`}
                  >
                    {tab === 'apiKeys' ? 'API Keys' : tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {/* Upload Settings */}
                {activeTab === 'upload' && (
                  <div className="bg-[#1c1f22] border border-[#40484f] rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Upload Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Auto Upload</label>
                        <input
                          type="checkbox"
                          checked={formData.upload.autoUpload}
                          onChange={(e) => updateFormData('upload', 'autoUpload', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm block mb-2">Quality</label>
                        <select
                          value={formData.upload.quality}
                          onChange={(e) => updateFormData('upload', 'quality', e.target.value)}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                        >
                          <option value="720p">720p</option>
                          <option value="1080p">1080p</option>
                          <option value="4K">4K</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-white text-sm block mb-2">Format</label>
                        <select
                          value={formData.upload.format}
                          onChange={(e) => updateFormData('upload', 'format', e.target.value)}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                        >
                          <option value="mp4">MP4</option>
                          <option value="mov">MOV</option>
                          <option value="avi">AVI</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-white text-sm block mb-2">Privacy</label>
                        <select
                          value={formData.upload.privacy}
                          onChange={(e) => updateFormData('upload', 'privacy', e.target.value)}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="unlisted">Unlisted</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Settings */}
                {activeTab === 'ai' && (
                  <div className="bg-[#1c1f22] border border-[#40484f] rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">AI Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Auto Clipping</label>
                        <input
                          type="checkbox"
                          checked={formData.ai.autoClipping}
                          onChange={(e) => updateFormData('ai', 'autoClipping', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Smart Thumbnails</label>
                        <input
                          type="checkbox"
                          checked={formData.ai.smartThumbnails}
                          onChange={(e) => updateFormData('ai', 'smartThumbnails', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Auto Titles</label>
                        <input
                          type="checkbox"
                          checked={formData.ai.autoTitles}
                          onChange={(e) => updateFormData('ai', 'autoTitles', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Content Analysis</label>
                        <input
                          type="checkbox"
                          checked={formData.ai.contentAnalysis}
                          onChange={(e) => updateFormData('ai', 'contentAnalysis', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Quality Settings */}
                {activeTab === 'quality' && (
                  <div className="bg-[#1c1f22] border border-[#40484f] rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Quality Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-white text-sm block mb-2">Resolution</label>
                        <input
                          type="text"
                          value={formData.quality.resolution}
                          onChange={(e) => updateFormData('quality', 'resolution', e.target.value)}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                          placeholder="1920x1080"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm block mb-2">Bitrate</label>
                        <input
                          type="text"
                          value={formData.quality.bitrate}
                          onChange={(e) => updateFormData('quality', 'bitrate', e.target.value)}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                          placeholder="8000"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm block mb-2">FPS</label>
                        <input
                          type="text"
                          value={formData.quality.fps}
                          onChange={(e) => updateFormData('quality', 'fps', e.target.value)}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                          placeholder="60"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm block mb-2">Codec</label>
                        <select
                          value={formData.quality.codec}
                          onChange={(e) => updateFormData('quality', 'codec', e.target.value)}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                        >
                          <option value="h264">H.264</option>
                          <option value="h265">H.265</option>
                          <option value="vp9">VP9</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="bg-[#1c1f22] border border-[#40484f] rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Notification Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Email Notifications</label>
                        <input
                          type="checkbox"
                          checked={formData.notifications.email}
                          onChange={(e) => updateFormData('notifications', 'email', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Push Notifications</label>
                        <input
                          type="checkbox"
                          checked={formData.notifications.push}
                          onChange={(e) => updateFormData('notifications', 'push', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Discord Notifications</label>
                        <input
                          type="checkbox"
                          checked={formData.notifications.discord}
                          onChange={(e) => updateFormData('notifications', 'discord', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Slack Notifications</label>
                        <input
                          type="checkbox"
                          checked={formData.notifications.slack}
                          onChange={(e) => updateFormData('notifications', 'slack', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* API Keys */}
                {activeTab === 'apiKeys' && (
                  <div className="bg-[#1c1f22] border border-[#40484f] rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">API Keys</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="text-white text-sm block mb-2">OpenAI API Key</label>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            value={formData.apiKeys.openai}
                            onChange={(e) => updateFormData('apiKeys', 'openai', e.target.value)}
                            className="flex-1 p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                            placeholder="sk-..."
                          />
                          <button
                            onClick={() => handleTest('openai')}
                            disabled={testing}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            {testing ? 'Testing...' : 'Test'}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-white text-sm block mb-2">Twitch API Key</label>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            value={formData.apiKeys.twitch}
                            onChange={(e) => updateFormData('apiKeys', 'twitch', e.target.value)}
                            className="flex-1 p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                            placeholder="Client ID"
                          />
                          <button
                            onClick={() => handleTest('twitch')}
                            disabled={testing}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            {testing ? 'Testing...' : 'Test'}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-white text-sm block mb-2">YouTube API Key</label>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            value={formData.apiKeys.youtube}
                            onChange={(e) => updateFormData('apiKeys', 'youtube', e.target.value)}
                            className="flex-1 p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                            placeholder="API Key"
                          />
                          <button
                            onClick={() => handleTest('youtube')}
                            disabled={testing}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            {testing ? 'Testing...' : 'Test'}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-white text-sm block mb-2">Discord Webhook</label>
                        <input
                          type="text"
                          value={formData.apiKeys.discord}
                          onChange={(e) => updateFormData('apiKeys', 'discord', e.target.value)}
                          className="w-full p-2 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                          placeholder="https://discord.com/api/webhooks/..."
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