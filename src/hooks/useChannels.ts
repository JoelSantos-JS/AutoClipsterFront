import { useState, useEffect, useCallback } from 'react';
import { channelsService } from '../services';
import { ChannelResponse, ChannelRequest, ChannelTestResult } from '../types';

export const useChannels = () => {
  const [channels, setChannels] = useState<ChannelResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const channelsData = await channelsService.getAllChannels();
      setChannels(channelsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch channels');
    } finally {
      setLoading(false);
    }
  }, []);

  const addChannel = useCallback(async (channelData: ChannelRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const newChannel = await channelsService.addChannel(channelData);
      if (newChannel) {
        setChannels(prev => [...prev, newChannel]);
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add channel');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeChannel = useCallback(async (channelId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await channelsService.removeChannel(channelId);
      setChannels(prev => prev.filter(channel => channel.id !== channelId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove channel');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const testChannel = useCallback(async (channelId: number): Promise<ChannelTestResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await channelsService.testChannel(channelId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test channel');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshChannels = useCallback(() => {
    fetchChannels();
  }, [fetchChannels]);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  return {
    channels,
    loading,
    error,
    addChannel,
    removeChannel,
    testChannel,
    refreshChannels
  };
}; 