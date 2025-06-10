import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  monitoringService, 
  MonitoringStatus, 
  MonitoringStats, 
  HealthCheck, 
  MonitoringConfig 
} from '@/services/monitoring';

export const useMonitoring = () => {
  // Estados principais
  const [status, setStatus] = useState<MonitoringStatus | null>(null);
  const [stats, setStats] = useState<MonitoringStats | null>(null);
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [config, setConfig] = useState<MonitoringConfig | null>(null);

  // Estados de loading
  const [loading, setLoading] = useState(false);
  const [forceLoading, setForceLoading] = useState(false);
  const [channelLoading, setChannelLoading] = useState<string | null>(null);
  const [stopLoading, setStopLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);

  // Estados de erro e sucesso
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Referências para polling
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const healthIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar status do monitoramento
  const loadStatus = useCallback(async () => {
    try {
      const statusData = await monitoringService.getStatus();
      setStatus(statusData);
      setError(null);
    } catch (err) {
      console.error('❌ Erro ao carregar status:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar status');
    }
  }, []);

  // Carregar estatísticas
  const loadStats = useCallback(async () => {
    try {
      const statsData = await monitoringService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('❌ Erro ao carregar estatísticas:', err);
    }
  }, []);

  // Carregar health check
  const loadHealth = useCallback(async () => {
    try {
      const healthData = await monitoringService.getHealth();
      setHealth(healthData);
    } catch (err) {
      console.error('❌ Erro ao carregar health check:', err);
    }
  }, []);

  // Carregar configurações
  const loadConfig = useCallback(async () => {
    try {
      const configData = await monitoringService.getConfig();
      setConfig(configData);
    } catch (err) {
      console.error('❌ Erro ao carregar configurações:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar configurações');
    }
  }, []);

  // Carregar todos os dados
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStatus(),
        loadStats(),
        loadHealth(),
        loadConfig()
      ]);
    } finally {
      setLoading(false);
    }
  }, [loadStatus, loadStats, loadHealth, loadConfig]);

  // Forçar monitoramento geral
  const forceMonitoring = useCallback(async (): Promise<boolean> => {
    setForceLoading(true);
    setError(null);

    try {
      const response = await monitoringService.forceMonitoring();
      
      if (response.success) {
        setSuccessMessage('Monitoramento forçado iniciado com sucesso');
        // Recarregar status após iniciar
        setTimeout(() => loadStatus(), 1000);
        return true;
      } else {
        setError(response.message || 'Erro ao forçar monitoramento');
        return false;
      }
    } catch (err) {
      console.error('❌ Erro ao forçar monitoramento:', err);
      setError(err instanceof Error ? err.message : 'Erro ao forçar monitoramento');
      return false;
    } finally {
      setForceLoading(false);
    }
  }, [loadStatus]);

  // Forçar monitoramento de canal específico
  const forceChannelMonitoring = useCallback(async (channelName: string): Promise<boolean> => {
    setChannelLoading(channelName);
    setError(null);

    try {
      const response = await monitoringService.forceChannelMonitoring(channelName);
      
      if (response.success) {
        setSuccessMessage(`Monitoramento do canal '${channelName}' iniciado`);
        // Recarregar status após iniciar
        setTimeout(() => loadStatus(), 1000);
        return true;
      } else {
        setError(response.message || `Erro ao monitorar canal '${channelName}'`);
        return false;
      }
    } catch (err) {
      console.error('❌ Erro ao monitorar canal:', err);
      setError(err instanceof Error ? err.message : `Erro ao monitorar canal '${channelName}'`);
      return false;
    } finally {
      setChannelLoading(null);
    }
  }, [loadStatus]);

  // Parar monitoramento
  const stopMonitoring = useCallback(async (): Promise<boolean> => {
    setStopLoading(true);
    setError(null);

    try {
      const response = await monitoringService.stopMonitoring();
      
      if (response.success) {
        setSuccessMessage('Monitoramento parado com sucesso');
        await loadStatus();
        return true;
      } else {
        setError(response.message || 'Erro ao parar monitoramento');
        return false;
      }
    } catch (err) {
      console.error('❌ Erro ao parar monitoramento:', err);
      setError(err instanceof Error ? err.message : 'Erro ao parar monitoramento');
      return false;
    } finally {
      setStopLoading(false);
    }
  }, [loadStatus]);

  // Retomar monitoramento
  const resumeMonitoring = useCallback(async (): Promise<boolean> => {
    setResumeLoading(true);
    setError(null);

    try {
      const response = await monitoringService.resumeMonitoring();
      
      if (response.success) {
        setSuccessMessage('Monitoramento retomado com sucesso');
        await loadStatus();
        return true;
      } else {
        setError(response.message || 'Erro ao retomar monitoramento');
        return false;
      }
    } catch (err) {
      console.error('❌ Erro ao retomar monitoramento:', err);
      setError(err instanceof Error ? err.message : 'Erro ao retomar monitoramento');
      return false;
    } finally {
      setResumeLoading(false);
    }
  }, [loadStatus]);

  // Iniciar polling automático
  const startPolling = useCallback(() => {
    // Status: A cada 30 segundos
    if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
    statusIntervalRef.current = setInterval(loadStatus, 30000);

    // Estatísticas: A cada 2 minutos
    if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    statsIntervalRef.current = setInterval(loadStats, 120000);

    // Health check: A cada 1 minuto
    if (healthIntervalRef.current) clearInterval(healthIntervalRef.current);
    healthIntervalRef.current = setInterval(loadHealth, 60000);
  }, [loadStatus, loadStats, loadHealth]);

  // Parar polling
  const stopPolling = useCallback(() => {
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
      statusIntervalRef.current = null;
    }
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }
    if (healthIntervalRef.current) {
      clearInterval(healthIntervalRef.current);
      healthIntervalRef.current = null;
    }
  }, []);

  // Funções auxiliares
  const isSystemHealthy = useCallback((): boolean => {
    return health?.healthy ?? false;
  }, [health]);

  const isMonitoringRunning = useCallback((): boolean => {
    return status?.isRunning ?? false;
  }, [status]);

  const getSystemStatusColor = useCallback((): string => {
    if (!health?.healthy) return 'red';
    if (status?.isRunning) return 'blue';
    return 'green';
  }, [health, status]);

  const getSystemStatusIcon = useCallback((): string => {
    if (!health?.healthy) return '🔴';
    if (status?.isRunning) return '⚡';
    return '🟢';
  }, [health, status]);

  // Carregar dados iniciais
  useEffect(() => {
    loadAll();
    startPolling();

    return () => {
      stopPolling();
    };
  }, []);

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
    status,
    stats,
    health,
    config,

    // Estados de loading
    loading,
    forceLoading,
    channelLoading,
    stopLoading,
    resumeLoading,

    // Mensagens
    error,
    successMessage,

    // Operações principais
    loadAll,
    loadStatus,
    forceMonitoring,
    forceChannelMonitoring,
    stopMonitoring,
    resumeMonitoring,

    // Controle de polling
    startPolling,
    stopPolling,

    // Funções auxiliares
    isSystemHealthy,
    isMonitoringRunning,
    getSystemStatusColor,
    getSystemStatusIcon,

    // Formatação
    formatNumber: monitoringService.formatNumber,
    formatLastRun: monitoringService.formatLastRun,
    formatSystemStatus: monitoringService.formatSystemStatus
  };
}; 