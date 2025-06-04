import { useState, useEffect, useCallback } from 'react';
import { clipsService } from '../services';
import { ClipData } from '../types';

export const useClips = () => {
  const [clips, setClips] = useState<ClipData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const clipsData = await clipsService.getDownloadedClips();
      setClips(clipsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clips');
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadClipByUrl = useCallback(async (clipUrl: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await clipsService.downloadClipByUrl(clipUrl);
      await fetchClips(); // Refresh clips after download
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download clip');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchClips]);

  const downloadTopClips = useCallback(async (channelId: number, limit: number = 10, daysBack: number = 7): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await clipsService.downloadTopClips(channelId, limit, daysBack);
      await fetchClips(); // Refresh clips after download
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download top clips');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchClips]);

  const downloadClipsByChannelName = useCallback(async (channelName: string, limit: number = 10, daysBack: number = 7): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await clipsService.downloadClipsByChannelName(channelName, limit, daysBack);
      await fetchClips(); // Refresh clips after download
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download clips by channel name');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchClips]);

  const deleteClip = useCallback(async (clipId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await clipsService.deleteClip(clipId);
      setClips(prev => prev.filter(clip => clip.id !== clipId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete clip');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshClips = useCallback(() => {
    fetchClips();
  }, [fetchClips]);

  // Get clips by status
  const getClipsByStatus = useCallback((status: ClipData['downloadStatus']) => {
    return clips.filter(clip => clip.downloadStatus === status);
  }, [clips]);

  // Get clips statistics
  const getClipsStats = useCallback(() => {
    return {
      total: clips.length,
      downloaded: clips.filter(clip => clip.downloadStatus === 'COMPLETED').length,
      pending: clips.filter(clip => clip.downloadStatus === 'PENDING').length,
      processing: clips.filter(clip => clip.downloadStatus === 'PROCESSING').length,
      failed: clips.filter(clip => clip.downloadStatus === 'FAILED').length,
      downloading: clips.filter(clip => clip.downloadStatus === 'DOWNLOADING').length
    };
  }, [clips]);

  useEffect(() => {
    fetchClips();
  }, [fetchClips]);

  return {
    clips,
    loading,
    error,
    downloadClipByUrl,
    downloadTopClips,
    downloadClipsByChannelName,
    deleteClip,
    refreshClips,
    getClipsByStatus,
    getClipsStats
  };
}; 