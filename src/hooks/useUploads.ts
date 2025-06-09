import { useState, useEffect, useCallback } from 'react';
import { uploadsService } from '../services/uploads';
import { 
  YouTubeConnectionStatus, 
  YouTubePublishedVideo, 
  YouTubeAnalytics,
  AutoUploadStatus,
  ManualUploadResponse,
  SyncStatsResponse,
  YouTubeAuthStartResponse
} from '../types';

export const useUploads = () => {
  // Estados principais
  const [youtubeStatus, setYoutubeStatus] = useState<YouTubeConnectionStatus | null>(null);
  const [videos, setVideos] = useState<YouTubePublishedVideo[]>([]);
  const [analytics, setAnalytics] = useState<YouTubeAnalytics | null>(null);
  const [autoUploadStatus, setAutoUploadStatus] = useState<AutoUploadStatus | null>(null);
  
  // Estados de loading
  const [loading, setLoading] = useState(false);
  const [videosLoading, setVideosLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [autoUploadLoading, setAutoUploadLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [disconnectLoading, setDisconnectLoading] = useState(false);
  
  // Estados de erro
  const [error, setError] = useState<string | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  
  // Estados de ordenação
  const [sortBy, setSortBy] = useState('uploadCompletedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Estados de autenticação
  const [userId] = useState('default_user'); // Por enquanto fixo, pode ser dinâmico
  const [isPolling, setIsPolling] = useState(false);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  // Verificar status da conexão YouTube com userId
  const fetchYouTubeStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Verificando status da conexão YouTube para usuário:', userId);
      const status = await uploadsService.getYouTubeStatus(userId);
      setYoutubeStatus(status);
      
      if (!status.connected && status.status !== 'NOT_AUTHENTICATED') {
        setError(status.message);
      }
    } catch (err) {
      console.error('❌ Erro ao verificar status YouTube:', err);
      setError(err instanceof Error ? err.message : 'Erro ao verificar conexão YouTube');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Carregar vídeos publicados
  const fetchPublishedVideos = useCallback(async (
    page: number = currentPage,
    size: number = pageSize,
    sort: string = sortBy,
    direction: 'asc' | 'desc' = sortDir
  ) => {
    setVideosLoading(true);
    
    try {
      console.log('📹 Carregando vídeos publicados...', { page, size, sort, direction });
      
      const response = await uploadsService.getPublishedVideos(page, size, sort, direction);
      
      setVideos(response.videos);
      setCurrentPage(response.currentPage);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
      setHasNext(response.hasNext);
      setHasPrevious(response.hasPrevious);
      
      console.log('✅ Vídeos carregados:', response.videos.length);
    } catch (err) {
      console.error('❌ Erro ao carregar vídeos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar vídeos');
    } finally {
      setVideosLoading(false);
    }
  }, [currentPage, pageSize, sortBy, sortDir]);

  // Carregar analytics
  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    
    try {
      console.log('📊 Carregando analytics do YouTube...');
      const analyticsData = await uploadsService.getYouTubeAnalytics();
      setAnalytics(analyticsData);
      console.log('✅ Analytics carregadas:', analyticsData);
    } catch (err) {
      console.error('❌ Erro ao carregar analytics:', err);
      setAnalyticsError(err instanceof Error ? err.message : 'Erro ao carregar analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // Carregar status do upload automático
  const fetchAutoUploadStatus = useCallback(async () => {
    setAutoUploadLoading(true);
    
    try {
      console.log('🔍 Verificando status do upload automático...');
      const status = await uploadsService.getAutoUploadStatus();
      setAutoUploadStatus(status);
      console.log('✅ Status do upload automático carregado:', status);
    } catch (err) {
      console.error('❌ Erro ao carregar status do upload automático:', err);
    } finally {
      setAutoUploadLoading(false);
    }
  }, []);

  // Iniciar autenticação YouTube
  const startYouTubeAuth = useCallback(async (): Promise<YouTubeAuthStartResponse | null> => {
    setAuthLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Iniciando autenticação YouTube...');
      const response = await uploadsService.startYouTubeAuth(userId);
      
      if (response.success && response.authUrl) {
        // Abrir popup de autenticação
        const authWindow = window.open(
          response.authUrl, 
          'youtube_auth', 
          'width=600,height=600,scrollbars=yes,resizable=yes'
        );
        
        if (authWindow) {
          // Iniciar polling para verificar quando auth completar - usar função inline para evitar dependência circular
          if (!isPolling) {
            setIsPolling(true);
            console.log('🔄 Iniciando polling de autenticação...');
            
            const interval = setInterval(async () => {
              try {
                const status = await uploadsService.getYouTubeStatus(userId);
                setYoutubeStatus(status);
                
                if (status.connected) {
                  console.log('✅ Autenticação completada com sucesso!');
                  clearInterval(interval);
                  setPollInterval(null);
                  setIsPolling(false);
                  
                  // Carregar dados após conexão
                  fetchPublishedVideos();
                  fetchAnalytics();
                  fetchAutoUploadStatus();
                }
              } catch (err) {
                console.error('Erro no polling:', err);
              }
            }, 2000);
            
            setPollInterval(interval);
            
            // Parar polling após 2 minutos
            setTimeout(() => {
              if (interval) {
                clearInterval(interval);
                setPollInterval(null);
                setIsPolling(false);
                console.log('⏰ Polling de autenticação expirou');
              }
            }, 120000);
          }
        } else {
          setError('Popup bloqueado. Permita popups para este site.');
        }
      } else {
        setError(response.message || 'Erro ao iniciar autenticação');
      }
      
      return response;
    } catch (err) {
      console.error('❌ Erro ao iniciar autenticação:', err);
      setError(err instanceof Error ? err.message : 'Erro ao iniciar autenticação');
      return null;
    } finally {
      setAuthLoading(false);
    }
  }, [userId, isPolling, fetchPublishedVideos, fetchAnalytics, fetchAutoUploadStatus]);

  // Desconectar canal YouTube
  const disconnectYouTube = useCallback(async (): Promise<boolean> => {
    setDisconnectLoading(true);
    setError(null);
    
    try {
      console.log('🔓 Desconectando canal YouTube...');
      const response = await uploadsService.disconnectYouTube(userId);
      
      if (response.success) {
        // Atualizar status após desconectar
        await fetchYouTubeStatus();
        return true;
      } else {
        setError(response.message || 'Erro ao desconectar canal');
        return false;
      }
    } catch (err) {
      console.error('❌ Erro ao desconectar canal:', err);
      setError(err instanceof Error ? err.message : 'Erro ao desconectar canal');
      return false;
    } finally {
      setDisconnectLoading(false);
    }
  }, [userId, fetchYouTubeStatus]);

  // Toggle upload automático
  const toggleAutoUpload = useCallback(async (enabled: boolean): Promise<boolean> => {
    setAutoUploadLoading(true);
    
    try {
      const response = await uploadsService.toggleAutoUpload(enabled);
      
      if (response.success) {
        await fetchAutoUploadStatus(); // Atualizar status
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao configurar upload automático');
      return false;
    } finally {
      setAutoUploadLoading(false);
    }
  }, [fetchAutoUploadStatus]);

  // Upload manual de clips
  const manualUpload = useCallback(async (clipIds: number[]): Promise<ManualUploadResponse | null> => {
    setUploadLoading(true);
    
    try {
      const response = await uploadsService.manualUpload(clipIds);
      
      // Refresh dados após upload
      await fetchPublishedVideos();
      await fetchAnalytics();
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no upload manual');
      return null;
    } finally {
      setUploadLoading(false);
    }
  }, [fetchPublishedVideos, fetchAnalytics]);

  // Sincronizar estatísticas
  const syncYouTubeStats = useCallback(async (): Promise<SyncStatsResponse | null> => {
    setSyncLoading(true);
    
    try {
      const response = await uploadsService.syncYouTubeStats();
      
      if (response.success) {
        // Refresh analytics após sincronização
        await fetchAnalytics();
        await fetchPublishedVideos();
      }
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao sincronizar estatísticas');
      return null;
    } finally {
      setSyncLoading(false);
    }
  }, [fetchAnalytics, fetchPublishedVideos]);

  // Paginação
  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    fetchPublishedVideos(page);
  }, [fetchPublishedVideos]);

  const nextPage = useCallback(() => {
    if (hasNext) {
      goToPage(currentPage + 1);
    }
  }, [hasNext, currentPage, goToPage]);

  const previousPage = useCallback(() => {
    if (hasPrevious) {
      goToPage(currentPage - 1);
    }
  }, [hasPrevious, currentPage, goToPage]);

  const changePageSize = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
    fetchPublishedVideos(0, newSize);
  }, [fetchPublishedVideos]);

  // Ordenação
  const changeSorting = useCallback((newSortBy: string, newSortDir: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setCurrentPage(0);
    fetchPublishedVideos(0, pageSize, newSortBy, newSortDir);
  }, [pageSize, fetchPublishedVideos]);

  // Funções de conveniência
  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchYouTubeStatus(),
      fetchPublishedVideos(),
      fetchAnalytics(),
      fetchAutoUploadStatus()
    ]);
  }, [fetchYouTubeStatus, fetchPublishedVideos, fetchAnalytics, fetchAutoUploadStatus]);

  const isConnected = useCallback(() => {
    return youtubeStatus?.connected || false;
  }, [youtubeStatus]);

  const needsAuth = useCallback(() => {
    return youtubeStatus?.needsAuth || youtubeStatus?.status === 'NOT_AUTHENTICATED';
  }, [youtubeStatus]);

  const needsSetup = useCallback(() => {
    return youtubeStatus?.needsSetup || youtubeStatus?.status === 'NOT_CONFIGURED';
  }, [youtubeStatus]);

  const getConnectionStatus = useCallback(() => {
    if (!youtubeStatus) return 'loading';
    return youtubeStatus.status;
  }, [youtubeStatus]);

  // Limpar polling ao desmontar
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  // Carregar dados iniciais
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return {
    // Dados
    youtubeStatus,
    videos,
    analytics,
    autoUploadStatus,
    userId,
    
    // Estados de loading
    loading,
    videosLoading,
    analyticsLoading,
    autoUploadLoading,
    uploadLoading,
    syncLoading,
    authLoading,
    disconnectLoading,
    isPolling,
    
    // Erros
    error,
    analyticsError,
    
    // Paginação
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    hasNext,
    hasPrevious,
    
    // Ordenação
    sortBy,
    sortDir,
    
    // Operações principais
    fetchYouTubeStatus,
    fetchPublishedVideos,
    fetchAnalytics,
    fetchAutoUploadStatus,
    toggleAutoUpload,
    manualUpload,
    syncYouTubeStats,
    
    // Autenticação YouTube
    startYouTubeAuth,
    disconnectYouTube,
    
    // Navegação
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    changeSorting,
    
    // Utilitários
    refreshAll,
    isConnected,
    needsAuth,
    needsSetup,
    getConnectionStatus,
    
    // Funções auxiliares do service
    formatNumber: uploadsService.formatNumber,
    formatDuration: uploadsService.formatDuration,
    getStatusColor: uploadsService.getStatusColor,
    getStatusText: uploadsService.getStatusText,
    getPrivacyStatusText: uploadsService.getPrivacyStatusText,
    getPrivacyStatusColor: uploadsService.getPrivacyStatusColor
  };
}; 