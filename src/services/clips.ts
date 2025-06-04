import { apiClient } from './api';

export interface ClipData {
  id: number;
  title: string;
  twitchClipId: string;
  streamerName: string;
  createdAt: string;
  duration: number;
  viewCount: number;
  language: string;
  gameId: string;
  thumbnailUrl: string;
  embedUrl: string;
  viralScore: number;
  downloadStatus: 'PENDING' | 'DOWNLOADING' | 'COMPLETED' | 'FAILED' | 'PROCESSING';
  localFilePath?: string;
}

export const clipsService = {
  // GET /api/clips/downloaded
  async getDownloadedClips(): Promise<ClipData[]> {
    try {
      return await apiClient.get<ClipData[]>('/api/clips/downloaded');
    } catch (error) {
      console.error('Error fetching downloaded clips:', error);
      throw error;
    }
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
  },

  // DELETE /api/clips/{clipId}
  async deleteClip(clipId: number): Promise<string> {
    try {
      return await apiClient.delete<string>(`/api/clips/${clipId}`);
    } catch (error) {
      console.error('Error deleting clip:', error);
      throw error;
    }
  }
}; 