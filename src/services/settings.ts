import { apiClient } from './api';

// Tipos de configuração avançada
export interface AdvancedSettings {
  autoUploadEnabled: boolean;
  autoUploadMinScore: number;
  minViralScore: number;
  minViews: number;
  minDuration: number;
  maxDuration: number;
  monitoringInterval: number;
  retryFailedUploads: boolean;
  enableWebhooks: boolean;
  webhookUrl?: string;
  youtubeShorts: {
    enabled: boolean;
    maxDuration: number;
    aspectRatio: string;
    hashtagsEnabled: boolean;
  };
  geminiAI: {
    enabled: boolean;
    apiKey?: string;
    enhanceTitles: boolean;
    enhanceDescriptions: boolean;
    generateTags: boolean;
    viralScoreThreshold: number;
  };
  rateLimiting: {
    twitchApiCalls: number;
    youtubeApiCalls: number;
    aiApiCalls: number;
  };
}

export interface AutoUploadToggleRequest {
  enabled: boolean;
}

export interface AutoUploadToggleResponse {
  success: boolean;
  autoUploadEnabled: boolean;
  message: string;
  affectedClips?: number;
}

export interface AutoUploadStatusResponse {
  autoUploadEnabled: boolean;
  lastCheck: string;
  pendingUploads: number;
  queuedClips: number;
  failedUploads: number;
  totalUploaded: number;
  averageUploadTime: number;
}

export interface SettingsResponse {
  success: boolean;
  settings: AdvancedSettings;
  message?: string;
}

export interface SettingsUpdateRequest {
  settings: Partial<AdvancedSettings>;
}

export interface SettingsUpdateResponse {
  success: boolean;
  message: string;
  updatedSettings: AdvancedSettings;
  restartRequired?: boolean;
}

export interface SettingsBackupResponse {
  success: boolean;
  backupId: string;
  timestamp: string;
  message: string;
}

export interface SettingsRestoreRequest {
  backupId: string;
}

export interface SettingsRestoreResponse {
  success: boolean;
  restoredSettings: AdvancedSettings;
  message: string;
}

export const settingsService = {
  // ========== CONFIGURAÇÕES GERAIS ==========

  // GET /api/settings - Obter todas as configurações
  async getSettings(): Promise<AdvancedSettings> {
    try {
      console.log('⚙️ Carregando configurações do sistema...');
      
      const response = await apiClient.get<SettingsResponse>('/api/settings');
      
      if (response.success) {
        console.log('✅ Configurações carregadas:', response.settings);
        return response.settings;
      } else {
        throw new Error(response.message || 'Erro ao carregar configurações');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error);
      throw error;
    }
  },

  // POST /api/settings - Atualizar configurações
  async updateSettings(settings: Partial<AdvancedSettings>): Promise<SettingsUpdateResponse> {
    try {
      console.log('💾 Atualizando configurações...', settings);
      
      const request: SettingsUpdateRequest = { settings };
      const response = await apiClient.post<SettingsUpdateResponse>('/api/settings', request);
      
      if (response.success) {
        console.log('✅ Configurações atualizadas:', response.message);
        if (response.restartRequired) {
          console.log('⚠️ Reinicialização necessária para aplicar mudanças');
        }
      } else {
        console.log('❌ Erro ao atualizar configurações:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao atualizar configurações:', error);
      throw error;
    }
  },

  // ========== UPLOAD AUTOMÁTICO ==========

  // POST /api/settings/auto-upload/toggle - Ligar/desligar upload automático
  async toggleAutoUpload(enabled: boolean): Promise<AutoUploadToggleResponse> {
    try {
      console.log('🔄 Configurando upload automático:', enabled ? 'habilitado' : 'desabilitado');
      
      const request: AutoUploadToggleRequest = { enabled };
      const response = await apiClient.post<AutoUploadToggleResponse>('/api/settings/auto-upload/toggle', request);
      
      if (response.success) {
        console.log('✅ Upload automático configurado:', response.message);
        if (response.affectedClips) {
          console.log(`📄 ${response.affectedClips} clips foram afetados pela mudança`);
        }
      } else {
        console.log('❌ Erro ao configurar upload automático:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao configurar upload automático:', error);
      throw error;
    }
  },

  // GET /api/settings/auto-upload/status - Status do upload automático
  async getAutoUploadStatus(): Promise<AutoUploadStatusResponse> {
    try {
      console.log('🔍 Verificando status do upload automático...');
      
      const response = await apiClient.get<AutoUploadStatusResponse>('/api/settings/auto-upload/status');
      
      console.log('✅ Status do upload automático:', {
        enabled: response.autoUploadEnabled,
        pending: response.pendingUploads,
        queued: response.queuedClips,
        failed: response.failedUploads
      });
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao verificar status do upload automático:', error);
      throw error;
    }
  },

  // ========== BACKUP E RESTORE ==========

  // POST /api/settings/backup - Criar backup das configurações
  async createBackup(): Promise<SettingsBackupResponse> {
    try {
      console.log('💾 Criando backup das configurações...');
      
      const response = await apiClient.post<SettingsBackupResponse>('/api/settings/backup');
      
      if (response.success) {
        console.log('✅ Backup criado:', {
          id: response.backupId,
          timestamp: response.timestamp
        });
      } else {
        console.log('❌ Erro ao criar backup:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao criar backup:', error);
      throw error;
    }
  },

  // POST /api/settings/restore - Restaurar configurações de backup
  async restoreFromBackup(backupId: string): Promise<SettingsRestoreResponse> {
    try {
      console.log('🔄 Restaurando configurações do backup:', backupId);
      
      const request: SettingsRestoreRequest = { backupId };
      const response = await apiClient.post<SettingsRestoreResponse>('/api/settings/restore', request);
      
      if (response.success) {
        console.log('✅ Configurações restauradas:', response.message);
      } else {
        console.log('❌ Erro ao restaurar configurações:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao restaurar configurações:', error);
      throw error;
    }
  },

  // ========== FUNÇÕES AUXILIARES ==========

  // Validar configurações antes do envio
  validateSettings(settings: Partial<AdvancedSettings>): string[] {
    const errors: string[] = [];

    if (settings.autoUploadMinScore !== undefined) {
      if (settings.autoUploadMinScore < 1 || settings.autoUploadMinScore > 10) {
        errors.push('Auto upload min score deve estar entre 1 e 10');
      }
    }

    if (settings.minViralScore !== undefined) {
      if (settings.minViralScore < 1 || settings.minViralScore > 10) {
        errors.push('Min viral score deve estar entre 1 e 10');
      }
    }

    if (settings.minViews !== undefined) {
      if (settings.minViews < 0) {
        errors.push('Min views deve ser maior que 0');
      }
    }

    if (settings.minDuration !== undefined) {
      if (settings.minDuration < 5 || settings.minDuration > 300) {
        errors.push('Min duration deve estar entre 5 e 300 segundos');
      }
    }

    if (settings.maxDuration !== undefined) {
      if (settings.maxDuration < 10 || settings.maxDuration > 600) {
        errors.push('Max duration deve estar entre 10 e 600 segundos');
      }
    }

    if (settings.monitoringInterval !== undefined) {
      if (settings.monitoringInterval < 1 || settings.monitoringInterval > 60) {
        errors.push('Monitoring interval deve estar entre 1 e 60 minutos');
      }
    }

    return errors;
  },

  // Formatar configurações para exibição
  formatSettingsForDisplay(settings: AdvancedSettings): Record<string, string | number | boolean> {
    return {
      'Upload Automático': settings.autoUploadEnabled ? 'Habilitado' : 'Desabilitado',
      'Score Mínimo para Upload': settings.autoUploadMinScore,
      'Score Viral Mínimo': settings.minViralScore,
      'Views Mínimas': settings.minViews.toLocaleString(),
      'Duração Mínima': `${settings.minDuration}s`,
      'Duração Máxima': `${settings.maxDuration}s`,
      'Intervalo de Monitoramento': `${settings.monitoringInterval} min`,
      'YouTube Shorts': settings.youtubeShorts.enabled ? 'Habilitado' : 'Desabilitado',
      'Gemini AI': settings.geminiAI.enabled ? 'Habilitado' : 'Desabilitado',
      'Webhooks': settings.enableWebhooks ? 'Habilitado' : 'Desabilitado'
    };
  },

  // Obter configurações padrão
  getDefaultSettings(): AdvancedSettings {
    return {
      autoUploadEnabled: false,
      autoUploadMinScore: 8.0,
      minViralScore: 6.0,
      minViews: 100,
      minDuration: 10,
      maxDuration: 60,
      monitoringInterval: 15,
      retryFailedUploads: true,
      enableWebhooks: false,
      youtubeShorts: {
        enabled: true,
        maxDuration: 60,
        aspectRatio: '9:16',
        hashtagsEnabled: true
      },
      geminiAI: {
        enabled: true,
        enhanceTitles: true,
        enhanceDescriptions: true,
        generateTags: true,
        viralScoreThreshold: 7.0
      },
      rateLimiting: {
        twitchApiCalls: 800,
        youtubeApiCalls: 10000,
        aiApiCalls: 100
      }
    };
  }
}; 