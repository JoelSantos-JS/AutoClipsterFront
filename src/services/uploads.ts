import { apiClient } from './api';
import { 
  YouTubeConnectionStatus, 
  YouTubeVideosResponse, 
  YouTubeAnalytics,
  AutoUploadToggle,
  AutoUploadToggleResponse,
  AutoUploadStatus,
  ManualUploadRequest,
  ManualUploadResponse,
  SyncStatsResponse,
  YouTubeAuthStartResponse,
  YouTubeAuthDisconnectResponse,
  YouTubeChannelsResponse,
  AddChannelRequest,
  AddChannelResponse,
  SelectChannelRequest,
  SelectChannelResponse,
  RemoveChannelResponse,
  AllChannelsStatsResponse
} from '../types';

export const uploadsService = {
  // ========== MÚLTIPLOS CANAIS YOUTUBE ==========
  
  // GET /api/uploads/youtube/channels - Listar todos os canais conectados
  async getYouTubeChannels(): Promise<YouTubeChannelsResponse> {
    try {
      console.log('📋 Carregando lista de canais YouTube...');
      
      const response = await apiClient.get<YouTubeChannelsResponse>('/api/uploads/youtube/channels');
      
      console.log(`✅ ${response.totalChannels} canais carregados:`, response.channels.map(c => c.channelName));
      return response;
    } catch (error) {
      console.error('❌ Erro ao carregar canais:', error);
      throw error;
    }
  },

  // POST /api/uploads/youtube/channels/add - Adicionar novo canal
  async addYouTubeChannel(channelId: string, channelName: string): Promise<AddChannelResponse> {
    try {
      console.log('➕ Adicionando novo canal:', channelId);
      
      const request: AddChannelRequest = { channelId, channelName };
      const response = await apiClient.post<AddChannelResponse>('/api/uploads/youtube/channels/add', request);
      
      if (response.success) {
        console.log('✅ Canal adicionado, URL de auth:', response.authUrl);
      } else {
        console.log('❌ Erro ao adicionar canal:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao adicionar canal:', error);
      throw error;
    }
  },

  // POST /api/uploads/youtube/channels/select - Selecionar canal ativo
  async selectYouTubeChannel(channelId: string): Promise<SelectChannelResponse> {
    try {
      console.log('🎯 Selecionando canal ativo:', channelId);
      
      const request: SelectChannelRequest = { channelId };
      const response = await apiClient.post<SelectChannelResponse>('/api/uploads/youtube/channels/select', request);
      
      if (response.success) {
        console.log('✅ Canal selecionado:', response.activeChannelId);
      } else {
        console.log('❌ Erro ao selecionar canal:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao selecionar canal:', error);
      throw error;
    }
  },

  // DELETE /api/uploads/youtube/channels/{id} - Remover canal específico
  async removeYouTubeChannel(channelId: string): Promise<RemoveChannelResponse> {
    try {
      console.log('🗑️ Removendo canal:', channelId);
      
      const response = await apiClient.delete<RemoveChannelResponse>(`/api/uploads/youtube/channels/${channelId}`);
      
      if (response.success) {
        console.log('✅ Canal removido:', response.removedChannelId);
      } else {
        console.log('❌ Erro ao remover canal:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao remover canal:', error);
      throw error;
    }
  },

  // GET /api/uploads/youtube/channels/stats - Estatísticas de todos os canais
  async getAllChannelsStats(): Promise<AllChannelsStatsResponse> {
    try {
      console.log('📊 Carregando estatísticas de todos os canais...');
      
      const response = await apiClient.get<AllChannelsStatsResponse>('/api/uploads/youtube/channels/stats');
      
      console.log('✅ Estatísticas carregadas:', {
        totalChannels: response.summary.totalChannels,
        totalViews: response.summary.totalViews,
        totalVideos: response.summary.totalVideos
      });
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas dos canais:', error);
      throw error;
    }
  },

  // ========== FUNCIONALIDADES EXISTENTES ==========

  // GET /api/uploads/youtube/status - Status da conexão YouTube com auth real
  async getYouTubeStatus(userId: string = 'default_user'): Promise<YouTubeConnectionStatus> {
    try {
      console.log('🔍 Verificando status da conexão YouTube para usuário:', userId);
      
      const params = new URLSearchParams({ userId });
      const status = await apiClient.get<YouTubeConnectionStatus>(`/api/uploads/youtube/status?${params}`);
      
      if (status.connected) {
        console.log('✅ YouTube conectado:', status.channelName);
      } else {
        console.log(`❌ YouTube não conectado - Status: ${status.status}:`, status.message);
      }
      
      return status;
    } catch (error) {
      console.error('❌ Erro ao verificar status YouTube:', error);
      throw error;
    }
  },

  // POST /api/uploads/youtube/auth/start - Iniciar autenticação YouTube
  async startYouTubeAuth(userId: string = 'default_user'): Promise<YouTubeAuthStartResponse> {
    try {
      console.log('🚀 Iniciando autenticação YouTube para usuário:', userId);
      
      const params = new URLSearchParams({ userId });
      const response = await apiClient.post<YouTubeAuthStartResponse>(`/api/uploads/youtube/auth/start?${params}`);
      
      if (response.success) {
        console.log('✅ URL de autenticação gerada:', response.authUrl);
      } else {
        console.log('❌ Erro ao gerar URL de autenticação:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao iniciar autenticação YouTube:', error);
      throw error;
    }
  },

  // POST /api/uploads/youtube/auth/disconnect - Desconectar canal YouTube
  async disconnectYouTube(userId: string = 'default_user'): Promise<YouTubeAuthDisconnectResponse> {
    try {
      console.log('🔓 Desconectando canal YouTube para usuário:', userId);
      
      const params = new URLSearchParams({ userId });
      const response = await apiClient.post<YouTubeAuthDisconnectResponse>(`/api/uploads/youtube/auth/disconnect?${params}`);
      
      if (response.success) {
        console.log('✅ Canal YouTube desconectado:', response.message);
      } else {
        console.log('❌ Erro ao desconectar canal:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao desconectar YouTube:', error);
      throw error;
    }
  },

  // GET /api/uploads/youtube/videos - Lista de vídeos publicados
  async getPublishedVideos(
    page: number = 0,
    size: number = 20,
    sortBy: string = 'uploadCompletedAt',
    sortDir: 'asc' | 'desc' = 'desc'
  ): Promise<YouTubeVideosResponse> {
    try {
      console.log('📹 Carregando vídeos publicados da página:', page);
      
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDir
      });

      const response = await apiClient.get<YouTubeVideosResponse>(`/api/uploads/youtube/videos?${params}`);
      
      console.log('✅ Vídeos carregados:', response.videos.length);
      return response;
    } catch (error) {
      console.error('❌ Erro ao carregar vídeos:', error);
      throw error;
    }
  },

  // GET /api/uploads/youtube/analytics - Analytics do YouTube
  async getYouTubeAnalytics(): Promise<YouTubeAnalytics> {
    try {
      console.log('📊 Carregando analytics do YouTube...');
      
      const analytics = await apiClient.get<YouTubeAnalytics>('/api/uploads/youtube/analytics');
      
      console.log('✅ Analytics carregadas:', {
        totalViews: analytics.totalViews,
        videosPublished: analytics.videosPublished
      });
      
      return analytics;
    } catch (error) {
      console.error('❌ Erro ao carregar analytics:', error);
      throw error;
    }
  },

  // POST /api/uploads/auto-upload/toggle - Configurar upload automático
  async toggleAutoUpload(enabled: boolean): Promise<AutoUploadToggleResponse> {
    try {
      console.log('⚙️ Configurando upload automático:', enabled ? 'habilitado' : 'desabilitado');
      
      const body: AutoUploadToggle = { enabled };
      const response = await apiClient.post<AutoUploadToggleResponse>('/api/uploads/auto-upload/toggle', body);
      
      if (response.success) {
        console.log('✅ Upload automático configurado:', response.message);
      } else {
        console.log('❌ Erro ao configurar upload automático:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao configurar upload automático:', error);
      throw error;
    }
  },

  // GET /api/uploads/auto-upload/status - Status do upload automático
  async getAutoUploadStatus(): Promise<AutoUploadStatus> {
    try {
      console.log('🔍 Verificando status do upload automático...');
      
      const status = await apiClient.get<AutoUploadStatus>('/api/uploads/auto-upload/status');
      
      console.log('✅ Status do upload automático:', {
        enabled: status.autoUploadEnabled,
        pendingUploads: status.pendingUploads
      });
      
      return status;
    } catch (error) {
      console.error('❌ Erro ao verificar status do upload automático:', error);
      throw error;
    }
  },

  // POST /api/uploads/manual-upload - Upload manual de clips
  async manualUpload(clipIds: number[]): Promise<ManualUploadResponse> {
    try {
      console.log('🚀 Iniciando upload manual de', clipIds.length, 'clips');
      
      const body: ManualUploadRequest = { clipIds };
      const response = await apiClient.post<ManualUploadResponse>('/api/uploads/manual-upload', body);
      
      console.log(`✅ Upload manual concluído: ${response.successCount} sucessos, ${response.errorCount} erros`);
      
      return response;
    } catch (error) {
      console.error('❌ Erro no upload manual:', error);
      throw error;
    }
  },

  // POST /api/uploads/youtube/sync-stats - Sincronizar estatísticas
  async syncYouTubeStats(): Promise<SyncStatsResponse> {
    try {
      console.log('🔄 Sincronizando estatísticas do YouTube...');
      
      const response = await apiClient.post<SyncStatsResponse>('/api/uploads/youtube/sync-stats');
      
      if (response.success) {
        console.log('✅ Estatísticas sincronizadas:', response.message);
      } else {
        console.log('❌ Erro ao sincronizar:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao sincronizar estatísticas:', error);
      throw error;
    }
  },

  // Métodos auxiliares para formatação
  formatNumber(num: number | undefined | null): string {
    if (num === null || num === undefined || isNaN(num)) return '0';
    const safeNum = Number(num);
    if (safeNum >= 1000000) return (safeNum / 1000000).toFixed(1) + 'M';
    if (safeNum >= 1000) return (safeNum / 1000).toFixed(1) + 'K';
    return safeNum.toString();
  },

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },

  getStatusColor(status: string): string {
    const colors = {
      'UPLOADING': 'orange',
      'PROCESSING': 'yellow', 
      'COMPLETED': 'green',
      'FAILED': 'red'
    };
    return colors[status as keyof typeof colors] || 'gray';
  },

  getStatusText(status: string): string {
    const texts = {
      'UPLOADING': 'Enviando',
      'PROCESSING': 'Processando',
      'COMPLETED': 'Concluído',
      'FAILED': 'Falhou'
    };
    return texts[status as keyof typeof texts] || status;
  },

  getPrivacyStatusText(status: string): string {
    const texts = {
      'PUBLIC': 'Público',
      'UNLISTED': 'Não Listado',
      'PRIVATE': 'Privado'
    };
    return texts[status as keyof typeof texts] || status;
  },

  getPrivacyStatusColor(status: string): string {
    const colors = {
      'PUBLIC': 'green',
      'UNLISTED': 'yellow',
      'PRIVATE': 'red'
    };
    return colors[status as keyof typeof colors] || 'gray';
  }
}; 