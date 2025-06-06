import { useState, useEffect } from 'react';

export interface Settings {
  upload: {
    autoUpload: boolean;
    quality: string;
    format: string;
    privacy: string;
  };
  ai: {
    autoClipping: boolean;
    smartThumbnails: boolean;
    autoTitles: boolean;
    contentAnalysis: boolean;
  };
  quality: {
    resolution: string;
    bitrate: string;
    fps: string;
    codec: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    discord: boolean;
    slack: boolean;
  };
  apiKeys: {
    youtube: string;
    twitch: string;
    discord: string;
    openai: string;
  };
}

const defaultSettings: Settings = {
  upload: {
    autoUpload: false,
    quality: '1080p',
    format: 'mp4',
    privacy: 'public',
  },
  ai: {
    autoClipping: true,
    smartThumbnails: true,
    autoTitles: false,
    contentAnalysis: true,
  },
  quality: {
    resolution: '1920x1080',
    bitrate: '8000',
    fps: '60',
    codec: 'h264',
  },
  notifications: {
    email: true,
    push: false,
    discord: false,
    slack: false,
  },
  apiKeys: {
    youtube: '',
    twitch: '',
    discord: '',
    openai: '',
  },
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching settings from API
  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  // Simulate saving settings to API
  const saveSettings = async (newSettings: Settings) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call
      localStorage.setItem('app-settings', JSON.stringify(newSettings));
      setSettings(newSettings);
      
      return { success: true };
    } catch {
      setError('Failed to save settings');
      throw new Error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  // Test API connections
  const testConnection = async (service: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API test delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.3;
      
      if (!isSuccess) {
        throw new Error(`Failed to connect to ${service}`);
      }
      
      return { success: true, message: `Successfully connected to ${service}` };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to test ${service} connection`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    saveSettings,
    testConnection,
  };
} 