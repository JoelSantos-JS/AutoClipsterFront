import { apiClient } from './api';
import { ClipData, ClipsResponse, ClipsStats, ClipsFilters, BatchOperation, BatchOperationResult } from '../types';

export const clipsService = {
  // GET /api/clips/downloaded - Lista clips com paginação e filtros
  async getDownloadedClips(
    page: number = 0,
    size: number = 50,
    sortBy: string = 'downloadDate',
    sortDir: 'asc' | 'desc' = 'desc',
    filters: ClipsFilters = {}
  ): Promise<ClipsResponse> {
    try {
      console.log('🔍 Carregando clips da página:', page);
      
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDir
      });

      // Adicionar filtros se existirem
      if (filters.status) params.append('status', filters.status);
      if (filters.creator) params.append('creator', filters.creator);
      if (filters.game) params.append('game', filters.game);

      const response = await apiClient.get<ClipsResponse>(`/api/clips/downloaded?${params}`);
      
      console.log('✅ Clips carregados:', response.clips.length);
      return response;
    } catch (error) {
      console.error('❌ Erro ao carregar clips:', error);
      throw error;
    }
  },

  // GET /api/clips/stats - Estatísticas dos clips
  async getClipsStats(): Promise<ClipsStats> {
    try {
      console.log('📊 Carregando estatísticas de clips...');
      
      const stats = await apiClient.get<ClipsStats>('/api/clips/stats');
      
      console.log('✅ Estatísticas carregadas:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
      throw error;
    }
  },

  // GET /api/clips/{clipId} - Buscar clip específico
  async getClipById(clipId: number): Promise<ClipData> {
    try {
      console.log('🔍 Buscando clip:', clipId);
      
      const clip = await apiClient.get<ClipData>(`/api/clips/${clipId}`);
      
      console.log('✅ Clip encontrado:', clip.title);
      return clip;
    } catch (error) {
      console.error('❌ Erro ao buscar clip:', error);
      throw error;
    }
  },

  // POST /api/clips/{clipId}/reprocess - Reprocessar clip
  async reprocessClip(clipId: number): Promise<{ success: boolean; message: string; clipId: number }> {
    try {
      console.log('⚡ Reprocessando clip:', clipId);
      
      const result = await apiClient.post<{ success: boolean; message: string; clipId: number }>(`/api/clips/${clipId}/reprocess`);
      
      if (result.success) {
        console.log('✅ Clip marcado para reprocessamento:', clipId);
      } else {
        console.log('❌ Erro ao reprocessar:', result.message);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Erro ao reprocessar clip:', error);
      throw error;
    }
  },

  // DELETE /api/clips/{clipId} - Deletar clip
  async deleteClip(clipId: number): Promise<{ success: boolean; message: string; clipTitle?: string }> {
    try {
      console.log('🗑️ Deletando clip:', clipId);
      
      const result = await apiClient.delete<{ success: boolean; message: string; clipTitle?: string }>(`/api/clips/${clipId}`);
      
      if (result.success) {
        console.log('✅ Clip deletado:', result.clipTitle);
      } else {
        console.log('❌ Erro ao deletar:', result.message);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Erro ao deletar clip:', error);
      throw error;
    }
  },

  // POST /api/clips/batch - Operações em lote
  async batchOperation(operation: BatchOperation): Promise<BatchOperationResult> {
    try {
      console.log(`🔄 Executando operação em lote: ${operation.operation} em ${operation.clipIds.length} clips`);
      
      const result = await apiClient.post<BatchOperationResult>('/api/clips/batch', operation);
      
      console.log(`✅ Operação concluída: ${result.successCount} sucessos, ${result.errorCount} erros`);
      
      if (result.errors && result.errors.length > 0) {
        console.log('❌ Erros encontrados:', result.errors);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Erro na operação em lote:', error);
      throw error;
    }
  },

  // Métodos auxiliares para operações específicas
  async batchDelete(clipIds: number[]): Promise<BatchOperationResult> {
    return this.batchOperation({ clipIds, operation: 'delete' });
  },

  async batchReprocess(clipIds: number[]): Promise<BatchOperationResult> {
    return this.batchOperation({ clipIds, operation: 'reprocess' });
  },

  // Métodos de conveniência para filtros
  async getProcessedClips(page: number = 0, size: number = 50): Promise<ClipsResponse> {
    return this.getDownloadedClips(page, size, 'downloadDate', 'desc', { status: 'processed' });
  },

  async getPendingClips(page: number = 0, size: number = 50): Promise<ClipsResponse> {
    return this.getDownloadedClips(page, size, 'downloadDate', 'desc', { status: 'pending' });
  },

  async getClipsByCreator(creator: string, page: number = 0, size: number = 50): Promise<ClipsResponse> {
    return this.getDownloadedClips(page, size, 'downloadDate', 'desc', { creator });
  },

  async getClipsByGame(game: string, page: number = 0, size: number = 50): Promise<ClipsResponse> {
    return this.getDownloadedClips(page, size, 'downloadDate', 'desc', { game });
  },

  // Métodos para formatação
  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },

  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  getStatusColor(status: string): string {
    const colors = {
      'DOWNLOADED': 'blue',
      'PROCESSING': 'yellow',
      'PROCESSING_FAILED': 'red',
      'READY': 'green',
      'UPLOADING': 'orange',
      'UPLOADED': 'success',
      'UPLOAD_FAILED': 'red'
    };
    return colors[status as keyof typeof colors] || 'gray';
  },

  getStatusText(status: string): string {
    const texts = {
      'DOWNLOADED': 'Baixado',
      'PROCESSING': 'Processando',
      'PROCESSING_FAILED': 'Falha no Processamento',
      'READY': 'Pronto',
      'UPLOADING': 'Enviando',
      'UPLOADED': 'Enviado',
      'UPLOAD_FAILED': 'Falha no Envio'
    };
    return texts[status as keyof typeof texts] || status;
  },

  // POST /api/clips/download-url?clipUrl=URL_DO_CLIP
  async downloadClipByUrl(clipUrl: string): Promise<string> {
    try {
      return await apiClient.post<string>(`/api/clips/download-url?clipUrl=${encodeURIComponent(clipUrl)}`);
    } catch (error) {
      console.error('Error downloading clip by URL:', error);
      throw error;
    }
  },

  // GET /api/clips/download-top/{channelId}?limit=10&days=7
  async downloadTopClips(channelId: number, limit: number = 10, days: number = 7): Promise<string> {
    try {
      return await apiClient.getWithParams<string>(`/api/clips/download-top/${channelId}`, {
        limit,
        days
      });
    } catch (error) {
      console.error('Error downloading top clips:', error);
      throw error;
    }
  },

  // GET /api/clips/download-by-name/{channelName}?limit=10&days=7
  async downloadClipsByChannelName(channelName: string, limit: number = 10, days: number = 7): Promise<string> {
    try {
      return await apiClient.getWithParams<string>(`/api/clips/download-by-name/${channelName}`, {
        limit,
        days
      });
    } catch (error) {
      console.error('Error downloading clips by channel name:', error);
      throw error;
    }
  }
}; 