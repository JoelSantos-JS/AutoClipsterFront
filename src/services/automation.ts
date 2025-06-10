import { apiClient } from './api';

// Tipos para automação avançada
export interface AutomationStatus {
  isRunning: boolean;
  currentTask?: string;
  progress: number;
  totalClipsProcessed: number;
  totalClipsUploaded: number;
  totalClipsFailed: number;
  averageProcessingTime: number;
  lastExecutionTime: string;
  nextExecutionTime?: string;
  queuedClips: number;
  activeChannels: number;
}

export interface ProcessPendingRequest {
  maxClips?: number;
  channelNames?: string[];
  forceReprocess?: boolean;
}

export interface ProcessPendingResponse {
  success: boolean;
  message: string;
  processedClips: number;
  skippedClips: number;
  failedClips: number;
  executionTime: number;
  details: {
    clipId: number;
    title: string;
    status: 'PROCESSED' | 'SKIPPED' | 'FAILED';
    reason?: string;
  }[];
}

export interface RetryFailedRequest {
  maxRetries?: number;
  channelNames?: string[];
  olderThanHours?: number;
}

export interface RetryFailedResponse {
  success: boolean;
  message: string;
  retriedClips: number;
  successfulRetries: number;
  stillFailedClips: number;
  executionTime: number;
  details: {
    clipId: number;
    title: string;
    retryAttempt: number;
    newStatus: string;
    error?: string;
  }[];
}

export interface CleanupRequest {
  olderThanDays?: number;
  keepSuccessful?: boolean;
  dryRun?: boolean;
}

export interface CleanupResponse {
  success: boolean;
  message: string;
  deletedClips: number;
  freedSpaceMB: number;
  dryRun: boolean;
  deletedFiles: string[];
}

export interface ExecuteWorkflowRequest {
  channelName: string;
  clipLimit?: number;
  daysBack?: number;
  forceDownload?: boolean;
  autoUpload?: boolean;
  customFilters?: {
    minViews?: number;
    minDuration?: number;
    maxDuration?: number;
    minViralScore?: number;
  };
}

export interface ExecuteWorkflowResponse {
  success: boolean;
  workflowId: string;
  message: string;
  channelName: string;
  clipsFound: number;
  clipsProcessed: number;
  clipsUploaded: number;
  executionTime: number;
  status: 'COMPLETED' | 'RUNNING' | 'FAILED' | 'CANCELLED';
}

export interface ExecuteMultipleRequest {
  channels: {
    channelName: string;
    clipLimit?: number;
    daysBack?: number;
  }[];
  globalSettings?: {
    forceDownload?: boolean;
    autoUpload?: boolean;
    customFilters?: {
      minViews?: number;
      minDuration?: number;
      maxDuration?: number;
      minViralScore?: number;
    };
  };
}

export interface ExecuteMultipleResponse {
  success: boolean;
  message: string;
  totalChannels: number;
  successfulChannels: number;
  failedChannels: number;
  totalClipsFound: number;
  totalClipsProcessed: number;
  totalClipsUploaded: number;
  executionTime: number;
  results: ExecuteWorkflowResponse[];
}

export interface ScheduleWorkflowRequest {
  channelNames: string[];
  schedule: {
    enabled: boolean;
    intervalMinutes: number;
    nextExecution?: string;
  };
  workflowSettings: {
    clipLimit: number;
    daysBack: number;
    autoUpload: boolean;
    customFilters?: {
      minViews?: number;
      minDuration?: number;
      maxDuration?: number;
      minViralScore?: number;
    };
  };
}

export interface ScheduleWorkflowResponse {
  success: boolean;
  message: string;
  scheduleId: string;
  nextExecution: string;
  affectedChannels: string[];
}

export const automationService = {
  // ========== STATUS E MONITORAMENTO ==========

  // GET /api/automation/status - Status da automação
  async getAutomationStatus(): Promise<AutomationStatus> {
    try {
      console.log('🔍 Verificando status da automação...');
      
      const response = await apiClient.get<AutomationStatus>('/api/automation/status');
      
      console.log('✅ Status da automação:', {
        isRunning: response.isRunning,
        progress: response.progress,
        queuedClips: response.queuedClips,
        activeChannels: response.activeChannels
      });
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao verificar status da automação:', error);
      throw error;
    }
  },

  // ========== PROCESSAMENTO ==========

  // POST /api/automation/process-pending - Processar clips pendentes
  async processPendingClips(request: ProcessPendingRequest = {}): Promise<ProcessPendingResponse> {
    try {
      console.log('⚙️ Processando clips pendentes...', request);
      
      const response = await apiClient.post<ProcessPendingResponse>('/api/automation/process-pending', request);
      
      if (response.success) {
        console.log('✅ Processamento concluído:', {
          processed: response.processedClips,
          skipped: response.skippedClips,
          failed: response.failedClips,
          time: `${response.executionTime}s`
        });
      } else {
        console.log('❌ Erro no processamento:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao processar clips pendentes:', error);
      throw error;
    }
  },

  // POST /api/automation/retry-failed - Reprocessar clips que falharam
  async retryFailedClips(request: RetryFailedRequest = {}): Promise<RetryFailedResponse> {
    try {
      console.log('🔄 Reprocessando clips que falharam...', request);
      
      const response = await apiClient.post<RetryFailedResponse>('/api/automation/retry-failed', request);
      
      if (response.success) {
        console.log('✅ Reprocessamento concluído:', {
          retried: response.retriedClips,
          successful: response.successfulRetries,
          stillFailed: response.stillFailedClips,
          time: `${response.executionTime}s`
        });
      } else {
        console.log('❌ Erro no reprocessamento:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao reprocessar clips:', error);
      throw error;
    }
  },

  // DELETE /api/automation/cleanup - Limpar clips antigos
  async cleanupOldClips(request: CleanupRequest = {}): Promise<CleanupResponse> {
    try {
      console.log('🧹 Limpando clips antigos...', request);
      
      // Convert request to query parameters
      const params = new URLSearchParams();
      if (request.olderThanDays !== undefined) params.append('olderThanDays', request.olderThanDays.toString());
      if (request.keepSuccessful !== undefined) params.append('keepSuccessful', request.keepSuccessful.toString());
      if (request.dryRun !== undefined) params.append('dryRun', request.dryRun.toString());
      
      const url = `/api/automation/cleanup${params.toString() ? '?' + params.toString() : ''}`;
      const response = await apiClient.delete<CleanupResponse>(url);
      
      if (response.success) {
        if (response.dryRun) {
          console.log('📋 Simulação de limpeza:', {
            wouldDelete: response.deletedClips,
            wouldFree: `${response.freedSpaceMB}MB`
          });
        } else {
          console.log('✅ Limpeza concluída:', {
            deleted: response.deletedClips,
            freedSpace: `${response.freedSpaceMB}MB`
          });
        }
      } else {
        console.log('❌ Erro na limpeza:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao limpar clips:', error);
      throw error;
    }
  },

  // ========== WORKFLOWS ==========

  // POST /api/automation/execute - Executar workflow para um canal
  async executeWorkflow(request: ExecuteWorkflowRequest): Promise<ExecuteWorkflowResponse> {
    try {
      console.log('🚀 Executando workflow para canal:', request.channelName);
      
      const response = await apiClient.post<ExecuteWorkflowResponse>('/api/automation/execute', request);
      
      if (response.success) {
        console.log('✅ Workflow executado:', {
          workflowId: response.workflowId,
          channel: response.channelName,
          found: response.clipsFound,
          processed: response.clipsProcessed,
          uploaded: response.clipsUploaded,
          status: response.status
        });
      } else {
        console.log('❌ Erro no workflow:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao executar workflow:', error);
      throw error;
    }
  },

  // POST /api/automation/execute-multiple - Executar para múltiplos canais
  async executeMultipleWorkflows(request: ExecuteMultipleRequest): Promise<ExecuteMultipleResponse> {
    try {
      console.log('🚀 Executando workflows para múltiplos canais:', request.channels.length);
      
      const response = await apiClient.post<ExecuteMultipleResponse>('/api/automation/execute-multiple', request);
      
      if (response.success) {
        console.log('✅ Workflows executados:', {
          totalChannels: response.totalChannels,
          successful: response.successfulChannels,
          failed: response.failedChannels,
          totalFound: response.totalClipsFound,
          totalProcessed: response.totalClipsProcessed,
          totalUploaded: response.totalClipsUploaded,
          time: `${response.executionTime}s`
        });
      } else {
        console.log('❌ Erro nos workflows:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao executar workflows múltiplos:', error);
      throw error;
    }
  },

  // POST /api/automation/schedule - Agendar workflow automático
  async scheduleWorkflow(request: ScheduleWorkflowRequest): Promise<ScheduleWorkflowResponse> {
    try {
      console.log('📅 Agendando workflow automático...', request);
      
      const response = await apiClient.post<ScheduleWorkflowResponse>('/api/automation/schedule', request);
      
      if (response.success) {
        console.log('✅ Workflow agendado:', {
          scheduleId: response.scheduleId,
          nextExecution: response.nextExecution,
          channels: response.affectedChannels
        });
      } else {
        console.log('❌ Erro ao agendar workflow:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao agendar workflow:', error);
      throw error;
    }
  },

  // ========== CONTROLES ==========

  // POST /api/automation/start - Iniciar automação
  async startAutomation(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('▶️ Iniciando automação...');
      
      const response = await apiClient.post<{ success: boolean; message: string }>('/api/automation/start');
      
      if (response.success) {
        console.log('✅ Automação iniciada:', response.message);
      } else {
        console.log('❌ Erro ao iniciar automação:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao iniciar automação:', error);
      throw error;
    }
  },

  // POST /api/automation/stop - Parar automação
  async stopAutomation(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('⏹️ Parando automação...');
      
      const response = await apiClient.post<{ success: boolean; message: string }>('/api/automation/stop');
      
      if (response.success) {
        console.log('✅ Automação parada:', response.message);
      } else {
        console.log('❌ Erro ao parar automação:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao parar automação:', error);
      throw error;
    }
  },

  // POST /api/automation/pause - Pausar automação
  async pauseAutomation(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('⏸️ Pausando automação...');
      
      const response = await apiClient.post<{ success: boolean; message: string }>('/api/automation/pause');
      
      if (response.success) {
        console.log('✅ Automação pausada:', response.message);
      } else {
        console.log('❌ Erro ao pausar automação:', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao pausar automação:', error);
      throw error;
    }
  },

  // ========== FUNÇÕES AUXILIARES ==========

  // Formatar tempo de execução
  formatExecutionTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  },

  // Calcular taxa de sucesso
  calculateSuccessRate(successful: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((successful / total) * 100);
  },

  // Formatar próxima execução
  formatNextExecution(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = date.getTime() - now.getTime();
      
      if (diffMs <= 0) return 'Agora';
      
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes < 60) return `Em ${diffMinutes} min`;
      
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `Em ${diffHours}h`;
      
      const diffDays = Math.floor(diffHours / 24);
      return `Em ${diffDays}d`;
    } catch {
      return 'Inválido';
    }
  },

  // Obter cor do status
  getStatusColor(status: string): string {
    const colors = {
      'COMPLETED': 'green',
      'RUNNING': 'blue',
      'FAILED': 'red',
      'CANCELLED': 'orange',
      'PENDING': 'yellow'
    };
    return colors[status as keyof typeof colors] || 'gray';
  },

  // Obter ícone do status
  getStatusIcon(status: string): string {
    const icons = {
      'COMPLETED': '✅',
      'RUNNING': '🔄',
      'FAILED': '❌',
      'CANCELLED': '⚠️',
      'PENDING': '⏳'
    };
    return icons[status as keyof typeof icons] || '❓';
  }
}; 