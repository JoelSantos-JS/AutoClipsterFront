import { useState, useEffect, useCallback } from 'react';
import { uploadsService } from '../services/uploads';
import {
  YouTubeChannelInfo,
  YouTubeChannelsResponse,
  AddChannelResponse,
  SelectChannelResponse,
  RemoveChannelResponse,
  AllChannelsStatsResponse,
  ChannelStats
} from '@/types';

export const useMultipleChannels = () => {
  // Estados principais
  const [channels, setChannels] = useState<YouTubeChannelInfo[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [allChannelsStats, setAllChannelsStats] = useState<AllChannelsStatsResponse | null>(null);
  
  // Estados de loading
  const [loading, setLoading] = useState(false);
  const [addingChannel, setAddingChannel] = useState(false);
  const [selectingChannel, setSelectingChannel] = useState(false);
  const [removingChannel, setRemovingChannel] = useState<string | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  
  // Estados de erro e sucesso
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Estados de polling para autenticação
  const [pollingChannels, setPollingChannels] = useState<Set<string>>(new Set());
  const [pollIntervals, setPollIntervals] = useState<Map<string, NodeJS.Timeout>>(new Map());

  // Carregar todos os canais
  const loadChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📋 Carregando lista de canais...');
      const response: YouTubeChannelsResponse = await uploadsService.getYouTubeChannels();
      
      setChannels(response.channels);
      setActiveChannelId(response.activeChannelId || null);
      
      console.log(`✅ ${response.totalChannels} canais carregados`);
    } catch (err) {
      console.error('❌ Erro ao carregar canais:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar canais');
    } finally {
      setLoading(false);
    }
  }, []);

  // Adicionar novo canal
  const addChannel = useCallback(async (channelId: string, channelName?: string): Promise<boolean> => {
    setAddingChannel(true);
    setError(null);
    
    try {
      console.log('➕ Adicionando novo canal:', channelId);
      
      const response: AddChannelResponse = await uploadsService.addYouTubeChannel(channelId, channelName || '');
      
      if (response.success && response.authUrl) {
        // Abrir popup de autenticação
        const popup = window.open(
          response.authUrl,
          'youtube_auth',
          'width=600,height=600,scrollbars=yes,resizable=yes'
        );
        
        if (popup) {
          setSuccessMessage(`Conectando canal: ${channelName || channelId}`);
          startAuthPolling();
          return true;
        } else {
          setError('Popup bloqueado. Permita popups para este site.');
          return false;
        }
      } else {
        setError(response.message || 'Erro ao adicionar canal');
        return false;
      }
    } catch (err) {
      console.error('❌ Erro ao adicionar canal:', err);
      setError(err instanceof Error ? err.message : 'Erro ao adicionar canal');
      return false;
    } finally {
      setAddingChannel(false);
    }
  }, []);

  // Selecionar canal ativo
  const selectChannel = useCallback(async (channelId: string): Promise<boolean> => {
    setSelectingChannel(true);
    setError(null);
    
    try {
      console.log('🎯 Selecionando canal ativo:', channelId);
      
      const response: SelectChannelResponse = await uploadsService.selectYouTubeChannel(channelId);
      
      if (response.success) {
        setActiveChannelId(response.activeChannelId);
        setSuccessMessage(`Canal selecionado: ${channelId}`);
        await loadChannels(); // Recarregar para atualizar status
        return true;
      } else {
        setError(response.message || 'Erro ao selecionar canal');
        return false;
      }
    } catch (err) {
      console.error('❌ Erro ao selecionar canal:', err);
      setError(err instanceof Error ? err.message : 'Erro ao selecionar canal');
      return false;
    } finally {
      setSelectingChannel(false);
    }
  }, [loadChannels]);

  // Remover canal
  const removeChannel = useCallback(async (channelId: string): Promise<boolean> => {
    setRemovingChannel(channelId);
    setError(null);
    
    try {
      console.log('🗑️ Removendo canal:', channelId);
      
      const response: RemoveChannelResponse = await uploadsService.removeYouTubeChannel(channelId);
      
      if (response.success) {
        setSuccessMessage(`Canal removido: ${response.removedChannelId}`);
        await loadChannels(); // Recarregar lista após remoção
        return true;
      } else {
        setError(response.message || 'Erro ao remover canal');
        return false;
      }
    } catch (err) {
      console.error('❌ Erro ao remover canal:', err);
      setError(err instanceof Error ? err.message : 'Erro ao remover canal');
      return false;
    } finally {
      setRemovingChannel(null);
    }
  }, [loadChannels]);

  // Carregar estatísticas de todos os canais
  const loadAllStats = useCallback(async () => {
    setLoadingStats(true);
    
    try {
      console.log('📊 Carregando estatísticas de todos os canais...');
      const stats = await uploadsService.getAllChannelsStats();
      setAllChannelsStats(stats);
      console.log('✅ Estatísticas carregadas');
    } catch (err) {
      console.error('❌ Erro ao carregar estatísticas:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Função para iniciar polling de autenticação
  const startAuthPolling = useCallback(() => {
    console.log('🔄 Iniciando polling de autenticação...');
    
    // Limpar qualquer polling existente primeiro
    if (pollIntervals.size > 0) {
      pollIntervals.forEach((interval) => clearInterval(interval));
      setPollIntervals(new Map());
    }
    
    const pollChannelAuth = async () => {
      try {
        await loadChannels();
      } catch (error) {
        console.error('❌ Erro durante polling:', error);
      }
    };
    
    // Polling inicial
    pollChannelAuth();
    
    // Configurar polling a cada 3 segundos
    const interval = setInterval(pollChannelAuth, 3000);
    
    // Timeout de 5 minutos
    const timeout = setTimeout(() => {
      clearInterval(interval);
      console.log('⏰ Timeout do polling de autenticação (5 min)');
    }, 5 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loadChannels, pollIntervals]);

  // Parar polling de um canal específico
  const stopAuthPolling = useCallback((channelId: string) => {
    const interval = pollIntervals.get(channelId);
    if (interval) {
      clearInterval(interval);
      setPollIntervals(prev => {
        const newMap = new Map(prev);
        newMap.delete(channelId);
        return newMap;
      });
    }
    
    setPollingChannels(prev => {
      const newSet = new Set(prev);
      newSet.delete(channelId);
      return newSet;
    });
  }, [pollIntervals]);

  // Utilitários
  const getActiveChannel = useCallback((): YouTubeChannelInfo | null => {
    return channels.find(c => c.userId === activeChannelId) || null;
  }, [channels, activeChannelId]);

  const getChannelById = useCallback((channelId: string): YouTubeChannelInfo | null => {
    return channels.find(c => c.userId === channelId) || null;
  }, [channels]);

  const hasChannels = useCallback((): boolean => {
    return channels.length > 0;
  }, [channels]);

  const getConnectedChannelsCount = useCallback((): number => {
    return channels.filter(c => c.connectionStatus === 'CONNECTED').length;
  }, [channels]);

  const isChannelPolling = useCallback((channelId: string): boolean => {
    return pollingChannels.has(channelId);
  }, [pollingChannels]);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      loadChannels(),
      loadAllStats()
    ]);
  }, [loadChannels, loadAllStats]);

  // Obter estatísticas de canal específico
  const getChannelStats = useCallback((channelId: string): ChannelStats | null => {
    if (!allChannelsStats) return null;
    const key = `channel_${channelId}`;
    const stats = allChannelsStats[key];
    return stats && typeof stats === 'object' && 'channelName' in stats ? stats as ChannelStats : null;
  }, [allChannelsStats]);

  // Limpar polling ao desmontar
  useEffect(() => {
    return () => {
      pollIntervals.forEach((interval) => {
        clearInterval(interval);
      });
    };
  }, [pollIntervals]);

  // Carregar dados iniciais
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Limpar mensagens após timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    // Dados
    channels,
    activeChannelId,
    allChannelsStats,
    
    // Estados de loading
    loading,
    addingChannel,
    selectingChannel,
    removingChannel,
    loadingStats,
    
    // Estados de polling
    pollingChannels,
    
    // Mensagens
    error,
    successMessage,
    
    // Operações principais
    loadChannels,
    addChannel,
    selectChannel,
    removeChannel,
    loadAllStats,
    
    // Controle de polling
    startAuthPolling,
    stopAuthPolling,
    
    // Utilitários
    getActiveChannel,
    getChannelById,
    hasChannels,
    getConnectedChannelsCount,
    isChannelPolling,
    refreshAll,
    getChannelStats,
    
    // Funções auxiliares
    formatNumber: uploadsService.formatNumber,
    formatDuration: uploadsService.formatDuration
  };
}; 