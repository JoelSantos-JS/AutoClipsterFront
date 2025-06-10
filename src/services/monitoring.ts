import { apiClient } from './api';

// Tipos para o sistema de monitoramento
export interface MonitoringStatus {
  enabled: boolean;
  isRunning: boolean;
  activeChannels: number;
  totalChannels: number;
  activeTasks: number;
  lastFullRun: string;
  totalClipsDiscovered: number;
  clipsDiscoveredLast24h: number;
}

export interface PerformanceStats {
  avgClipsPerChannel: number;
  discoveryRate: number;
  systemEfficiency: number;
}

export interface MonitoringStats {
  monitoring: MonitoringStatus;
  performance: PerformanceStats;
  timestamp: string;
}

export interface HealthCheck {
  status: 'UP' | 'DOWN';
  healthy: boolean;
  monitoring: {
    enabled: boolean;
    running: boolean;
    activeChannels: number;
    activeTasks: number;
  };
  lastCheck: string;
}

export interface ForceMonitoringResponse {
  success: boolean;
  message: string;
  startedAt?: string;
  channelName?: string;
  monitored?: boolean;
}

export interface MonitoringConfig {
  description: string;
  schedulerInterval: string;
  defaultClipsPerChannel: number;
  defaultDaysBack: number;
  minViews: number;
  durationRange: string;
  minViralThreshold: number;
  currentStatus: MonitoringStatus;
}

export const monitoringService = {
  // GET /api/monitoring/status - Status do Sistema
  async getStatus(): Promise<MonitoringStatus> {
    try {
      console.log('🔍 Verificando status do monitoramento...');
      
      const status = await apiClient.get<MonitoringStatus>('/api/monitoring/status');
      
      console.log('✅ Status do monitoramento:', {
        enabled: status.enabled,
        isRunning: status.isRunning,
        activeChannels: status.activeChannels,
        totalChannels: status.totalChannels
      });
      
      return status;
    } catch (error) {
      console.error('❌ Erro ao carregar status do monitoramento:', error);
      throw error;
    }
  },

  // GET /api/monitoring/stats - Estatísticas Detalhadas
  async getStats(): Promise<MonitoringStats> {
    try {
      console.log('📊 Carregando estatísticas do monitoramento...');
      
      const stats = await apiClient.get<MonitoringStats>('/api/monitoring/stats');
      
      console.log('✅ Estatísticas carregadas:', {
        avgClipsPerChannel: stats.performance.avgClipsPerChannel,
        discoveryRate: stats.performance.discoveryRate,
        systemEfficiency: stats.performance.systemEfficiency
      });
      
      return stats;
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
      throw error;
    }
  },

  // GET /api/monitoring/health - Health Check
  async getHealth(): Promise<HealthCheck> {
    try {
      console.log('🏥 Verificando saúde do sistema...');
      
      const health = await apiClient.get<HealthCheck>('/api/monitoring/health');
      
      console.log(`✅ Sistema ${health.healthy ? 'saudável' : 'com problemas'}:`, health.status);
      
      return health;
    } catch (error) {
      console.error('❌ Erro ao verificar saúde do sistema:', error);
      throw error;
    }
  },

  // POST /api/monitoring/force - Forçar Monitoramento Geral
  async forceMonitoring(): Promise<ForceMonitoringResponse> {
    try {
      console.log('🚀 Forçando monitoramento geral...');
      
      const response = await apiClient.post<ForceMonitoringResponse>('/api/monitoring/force');
      
      if (response.success) {
        console.log('✅ Monitoramento forçado iniciado:', response.message);
      } else {
        console.log('❌ Erro ao forçar monitoramento:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao forçar monitoramento:', error);
      throw error;
    }
  },

  // POST /api/monitoring/force/{channelName} - Monitorar Canal Específico
  async forceChannelMonitoring(channelName: string): Promise<ForceMonitoringResponse> {
    try {
      console.log('🎯 Forçando monitoramento do canal:', channelName);
      
      const response = await apiClient.post<ForceMonitoringResponse>(`/api/monitoring/force/${channelName}`);
      
      if (response.success) {
        console.log('✅ Monitoramento do canal iniciado:', response.message);
      } else {
        console.log('❌ Erro ao monitorar canal:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao monitorar canal:', error);
      throw error;
    }
  },

  // POST /api/monitoring/stop - Parar Monitoramento
  async stopMonitoring(): Promise<ForceMonitoringResponse> {
    try {
      console.log('⛔ Parando monitoramento...');
      
      const response = await apiClient.post<ForceMonitoringResponse>('/api/monitoring/stop');
      
      if (response.success) {
        console.log('✅ Monitoramento parado:', response.message);
      } else {
        console.log('❌ Erro ao parar monitoramento:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao parar monitoramento:', error);
      throw error;
    }
  },

  // POST /api/monitoring/resume - Retomar Monitoramento
  async resumeMonitoring(): Promise<ForceMonitoringResponse> {
    try {
      console.log('▶️ Retomando monitoramento...');
      
      const response = await apiClient.post<ForceMonitoringResponse>('/api/monitoring/resume');
      
      if (response.success) {
        console.log('✅ Monitoramento retomado:', response.message);
      } else {
        console.log('❌ Erro ao retomar monitoramento:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao retomar monitoramento:', error);
      throw error;
    }
  },

  // GET /api/monitoring/config - Ver Configurações Atuais
  async getConfig(): Promise<MonitoringConfig> {
    try {
      console.log('⚙️ Carregando configurações do monitoramento...');
      
      const config = await apiClient.get<MonitoringConfig>('/api/monitoring/config');
      
      console.log('✅ Configurações carregadas:', {
        schedulerInterval: config.schedulerInterval,
        defaultClipsPerChannel: config.defaultClipsPerChannel,
        minViralThreshold: config.minViralThreshold
      });
      
      return config;
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error);
      throw error;
    }
  },

  // Métodos auxiliares para formatação
  formatSystemStatus(status: string): string {
    const statuses = {
      'UP': 'Online',
      'DOWN': 'Offline'
    };
    return statuses[status as keyof typeof statuses] || status;
  },

  getStatusColor(healthy: boolean, isRunning: boolean): string {
    if (!healthy) return 'red';
    if (isRunning) return 'blue';
    return 'green';
  },

  getStatusIcon(healthy: boolean, isRunning: boolean): string {
    if (!healthy) return '🔴';
    if (isRunning) return '⚡';
    return '🟢';
  },

  formatLastRun(lastRun: string): string {
    const date = new Date(lastRun);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  },

  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
}; 