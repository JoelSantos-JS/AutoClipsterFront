import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services';
import { YouTubeStats, YouTubeVideo, YouTubeAuthStatus } from '../types';

export const useYouTube = () => {
  const [stats, setStats] = useState<YouTubeStats | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [authStatus, setAuthStatus] = useState<YouTubeAuthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const youtubeStats = await apiClient.get<YouTubeStats>('/api/youtube/stats');
      setStats(youtubeStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch YouTube stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const youtubeVideos = await apiClient.get<YouTubeVideo[]>('/api/youtube/videos');
      setVideos(youtubeVideos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch YouTube videos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAuthStatus = useCallback(async () => {
    try {
      const status = await apiClient.get<YouTubeAuthStatus>('/api/youtube/auth/status');
      setAuthStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch YouTube auth status');
    }
  }, []);

  const uploadVideo = useCallback(async (clipId: number, metadata: { title: string; description: string; tags: string[]; privacyStatus: string }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.post('/api/youtube/upload', {
        clipId,
        ...metadata
      });
      await fetchVideos(); // Refresh videos after upload
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload video to YouTube');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchVideos]);

  const deleteVideo = useCallback(async (videoId: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/api/youtube/videos/${videoId}`);
      setVideos(prev => prev.filter(video => video.id !== videoId));
      await fetchStats(); // Refresh stats after deletion
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete YouTube video');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const refreshData = useCallback(() => {
    fetchStats();
    fetchVideos();
    fetchAuthStatus();
  }, [fetchStats, fetchVideos, fetchAuthStatus]);

  useEffect(() => {
    fetchStats();
    fetchVideos();
    fetchAuthStatus();
  }, [fetchStats, fetchVideos, fetchAuthStatus]);

  return {
    stats,
    videos,
    authStatus,
    loading,
    error,
    uploadVideo,
    deleteVideo,
    refreshData
  };
}; 