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
      await apiClient.post('/api/channels', {
        twitchUsername: channelData.name,
        channelUrl: channelData.url,
        customPromptSettings: channelData.description || '',
        uploadToYouTube: true
      });

      // Return a mock response since the API doesn't return the created channel
      return {
        id: Date.now(), // Temporary ID
        name: channelData.name,
        platform: channelData.platform,
        url: channelData.url,
        description: channelData.description || '',
        status: 'active',
        lastClipAt: null,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error adding channel:', error);
      throw error;
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