import { useState, useEffect, useCallback } from 'react';
import { settingsService, AdvancedSettings, AutoUploadStatusResponse } from '../services/settings';

export interface UseSettingsReturn {
  // Estado das configurações
  settings: AdvancedSettings | null;
  autoUploadStatus: AutoUploadStatusResponse | null;
  isLoading: boolean;
  error: string | null;
  
  // Funções principais
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<AdvancedSettings>) => Promise<void>;
  saveSettings: (settings: Partial<AdvancedSettings>) => Promise<void>;
  
  // Auto-upload
  toggleAutoUpload: (enabled: boolean) => Promise<void>;
  loadAutoUploadStatus: () => Promise<void>;
  
  // Backup e restore
  createBackup: () => Promise<string | null>;
  restoreFromBackup: (backupId: string) => Promise<void>;
  
  // Estados de carregamento específicos
  savingSettings: boolean;
  togglingAutoUpload: boolean;
  creatingBackup: boolean;
  restoringBackup: boolean;
  
  // Utilidades
  formatSettingsForDisplay: (settings?: AdvancedSettings) => Record<string, string | number | boolean>;
  validateSettings: (settings: Partial<AdvancedSettings>) => string[];
  getDefaultSettings: () => AdvancedSettings;
}

export const useSettings = (): UseSettingsReturn => {
  const [settings, setSettings] = useState<AdvancedSettings | null>(null);
  const [autoUploadStatus, setAutoUploadStatus] = useState<AutoUploadStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de carregamento específicos
  const [savingSettings, setSavingSettings] = useState(false);
  const [togglingAutoUpload, setTogglingAutoUpload] = useState(false);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoringBackup, setRestoringBackup] = useState(false);

  // Carregar configurações
  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 Carregando configurações...');
      
      const settingsResponse = await settingsService.getSettings();
      setSettings(settingsResponse);
      
      console.log('✅ Configurações carregadas:', settingsResponse);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar configurações';
      console.error('❌ Erro ao carregar configurações:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Atualizar configurações
  const updateSettings = useCallback(async (updatedSettings: Partial<AdvancedSettings>) => {
    try {
      setSavingSettings(true);
      setError(null);
      console.log('🔄 Atualizando configurações...', updatedSettings);
      
      const response = await settingsService.updateSettings(updatedSettings);
      
      if (response.success) {
        setSettings(response.updatedSettings);
        console.log('✅ Configurações atualizadas:', response.updatedSettings);
        
        if (response.restartRequired) {
          console.log('⚠️ Reinicialização necessária para aplicar mudanças');
        }
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar configurações';
      console.error('❌ Erro ao atualizar configurações:', errorMessage);
      setError(errorMessage);
    } finally {
      setSavingSettings(false);
    }
  }, []);

  // Salvar configurações (alias para updateSettings)
  const saveSettings = useCallback(async (updatedSettings: Partial<AdvancedSettings>) => {
    await updateSettings(updatedSettings);
  }, [updateSettings]);

  // Toggle auto-upload
  const toggleAutoUpload = useCallback(async (enabled: boolean) => {
    try {
      setTogglingAutoUpload(true);
      setError(null);
      console.log(`🔄 ${enabled ? 'Habilitando' : 'Desabilitando'} upload automático...`);
      
      const response = await settingsService.toggleAutoUpload(enabled);
      
      if (response.success) {
        console.log(`✅ Upload automático ${enabled ? 'habilitado' : 'desabilitado'}:`, {
          enabled: response.autoUploadEnabled,
          affectedClips: response.affectedClips
        });
        
        // Atualizar configurações locais
        if (settings) {
          setSettings({
            ...settings,
            autoUploadEnabled: response.autoUploadEnabled
          });
        }
        
        // Recarregar status
        await loadAutoUploadStatus();
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar upload automático';
      console.error('❌ Erro ao alterar upload automático:', errorMessage);
      setError(errorMessage);
    } finally {
      setTogglingAutoUpload(false);
    }
  }, [settings]);

  // Carregar status do auto-upload
  const loadAutoUploadStatus = useCallback(async () => {
    try {
      console.log('🔄 Carregando status do upload automático...');
      
      const status = await settingsService.getAutoUploadStatus();
      setAutoUploadStatus(status);
      
      console.log('✅ Status do upload automático:', {
        enabled: status.autoUploadEnabled,
        pending: status.pendingUploads,
        queued: status.queuedClips,
        failed: status.failedUploads
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar status do upload';
      console.error('❌ Erro ao carregar status do upload:', errorMessage);
      setError(errorMessage);
    }
  }, []);

  // Criar backup
  const createBackup = useCallback(async (): Promise<string | null> => {
    try {
      setCreatingBackup(true);
      setError(null);
      console.log('🔄 Criando backup das configurações...');
      
      const response = await settingsService.createBackup();
      
      if (response.success) {
        console.log('✅ Backup criado:', {
          backupId: response.backupId,
          timestamp: response.timestamp
        });
        return response.backupId;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar backup';
      console.error('❌ Erro ao criar backup:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setCreatingBackup(false);
    }
  }, []);

  // Restaurar backup
  const restoreFromBackup = useCallback(async (backupId: string) => {
    try {
      setRestoringBackup(true);
      setError(null);
      console.log('🔄 Restaurando configurações do backup:', backupId);
      
      const response = await settingsService.restoreFromBackup(backupId);
      
      if (response.success) {
        setSettings(response.restoredSettings);
        console.log('✅ Configurações restauradas:', response.restoredSettings);
        
        // Recarregar status após restaurar
        await loadAutoUploadStatus();
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao restaurar backup';
      console.error('❌ Erro ao restaurar backup:', errorMessage);
      setError(errorMessage);
    } finally {
      setRestoringBackup(false);
    }
  }, [loadAutoUploadStatus]);

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        loadSettings(),
        loadAutoUploadStatus()
      ]);
    };
    
    loadInitialData();
  }, [loadSettings, loadAutoUploadStatus]);

  return {
    settings,
    autoUploadStatus,
    isLoading,
    error,
    loadSettings,
    updateSettings,
    saveSettings,
    toggleAutoUpload,
    loadAutoUploadStatus,
    createBackup,
    restoreFromBackup,
    savingSettings,
    togglingAutoUpload,
    creatingBackup,
    restoringBackup,
    formatSettingsForDisplay: (settings?: AdvancedSettings) => {
      if (!settings) return {};
      return settingsService.formatSettingsForDisplay(settings);
    },
    validateSettings: settingsService.validateSettings,
    getDefaultSettings: settingsService.getDefaultSettings
  };
}; 