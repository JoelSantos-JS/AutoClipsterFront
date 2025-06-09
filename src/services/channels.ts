import { apiClient } from './api';
import { ChannelRequest, ChannelResponse, ChannelTestResult, BackendChannelResponse } from '../types';

// Convert backend channel format to frontend format
const convertChannelData = (backendChannel: BackendChannelResponse): ChannelResponse => ({
  id: backendChannel.id,
  name: backendChannel.twitchUsername,
  platform: 'twitch' as const,
  url: backendChannel.channelUrl,
  description: backendChannel.customPromptSettings || '',
  status: backendChannel.isActive ? 'active' : 'inactive',
  lastClipAt: backendChannel.lastChecked,
  createdAt: backendChannel.createdAt
});

export const channelsService = {
  // GET /api/channels
  async getAllChannels(): Promise<ChannelResponse[]> {
    try {
      const backendChannels = await apiClient.get<BackendChannelResponse[]>('/api/channels');
      return backendChannels.map(convertChannelData);
    } catch (error) {
      console.error('Error fetching channels:', error);
      throw error;
    }
  },

  // POST /api/channels
  async addChannel(channelData: ChannelRequest): Promise<ChannelResponse> {
    try {
      console.log('🔍 Frontend - Dados recebidos pelo service:', channelData);
      
      // Validação local antes de enviar
      if (!channelData.name || !channelData.name.trim()) {
        throw new Error('Nome do canal é obrigatório');
      }
      
      if (!channelData.platform) {
        throw new Error('Plataforma é obrigatória');
      }
      
      // Formato correto que o backend espera
      const requestData = {
        channelName: channelData.name.trim(), // ✅ channelName (não name)
        platform: channelData.platform.toUpperCase(), // ✅ TWITCH ou YOUTUBE
        isActive: true, // ✅ Opcional (padrão: true)
        priority: 1 // ✅ Opcional
      };
      
      console.log('📤 Frontend - Dados sendo enviados para API (formato correto):', requestData);
      
      const response = await apiClient.post('/api/channels', requestData);
      
      // Verificar se a resposta é um objeto de sucesso ou string simples
      interface ApiResponse {
        success?: boolean;
        message?: string;
        channel?: {
          id?: number;
          channelUrl?: string;
          createdAt?: string;
        };
      }
      
      let result: ApiResponse;
      if (typeof response === 'string') {
        result = { success: true, message: response };
      } else {
        result = response as ApiResponse;
      }
      
      console.log('✅ Resposta do backend:', result);
      
      // Verificar se houve erro na resposta
      if (result.success === false) {
        throw new Error(result.message || 'Erro ao adicionar canal');
      }

      // Return a response matching our frontend format
      return {
        id: result.channel?.id || Date.now(), // Use ID do backend ou temporary ID
        name: channelData.name,
        platform: channelData.platform,
        url: result.channel?.channelUrl || channelData.url || `https://twitch.tv/${channelData.name}`,
        description: channelData.description || '',
        status: 'active',
        lastClipAt: null,
        createdAt: result.channel?.createdAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erro ao adicionar canal:', error);
      
      // Tratar diferentes tipos de erro
      if (error instanceof Error) {
        throw error; // Re-throw para manter a mensagem original
      } else {
        throw new Error('Erro desconhecido ao adicionar canal');
      }
    }
  },

  // DELETE /api/channels/{channelId}
  async removeChannel(channelId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/channels/${channelId}`);
    } catch (error) {
      console.error('Error removing channel:', error);
      throw error;
    }
  },

  // POST /api/channels/{channelId}/test
  async testChannel(channelId: number): Promise<ChannelTestResult> {
    try {
      const result = await apiClient.post<{ clipsFound?: number; responseTime?: number }>(`/api/channels/${channelId}/test`);
      return {
        success: true,
        message: 'Channel test successful',
        clips: result?.clipsFound || 0,
        responseTime: result?.responseTime || 0
      };
    } catch (error) {
      console.error('Error testing channel:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Channel test failed',
        clips: 0,
        responseTime: 0
      };
    }
  }
}; 