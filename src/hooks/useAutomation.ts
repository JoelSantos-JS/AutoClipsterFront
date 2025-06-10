import { useState, useEffect, useCallback } from 'react';
import { automationService, AutomationStatus, ExecuteWorkflowRequest } from '../services/automation';

export interface UseAutomationReturn {
  // Estado
  status: AutomationStatus | null;
  isLoading: boolean;
  error: string | null;
  
  // Funções
  loadStatus: () => Promise<void>;
  processClips: () => Promise<void>;
  retryFailedClips: () => Promise<void>;
  cleanupOldClips: (options?: { olderThanDays?: number; keepSuccessful?: boolean; dryRun?: boolean }) => Promise<void>;
  executeWorkflow: (config?: Partial<ExecuteWorkflowRequest>) => Promise<void>;
  
  // Estados de carregamento específicos
  processingLoading: boolean;
  retryLoading: boolean;
  cleanupLoading: boolean;
  workflowLoading: boolean;
}

export const useAutomation = (): UseAutomationReturn => {
  const [status, setStatus] = useState<AutomationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de carregamento específicos
  const [processingLoading, setProcessingLoading] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [workflowLoading, setWorkflowLoading] = useState(false);

  // Carregar status da automação
  const loadStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 Carregando status da automação...');
      
      const automationStatus = await automationService.getAutomationStatus();
      setStatus(automationStatus);
      
      console.log('✅ Status da automação carregado:', automationStatus);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ Erro ao carregar status da automação:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Processar clips pendentes
  const processClips = useCallback(async () => {
    try {
      setProcessingLoading(true);
      setError(null);
      console.log('🔄 Iniciando processamento de clips...');
      
      const result = await automationService.processPendingClips();
      console.log('✅ Processamento iniciado:', result);
      
      // Recarregar status após processar
      await loadStatus();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar clips';
      console.error('❌ Erro ao processar clips:', errorMessage);
      setError(errorMessage);
    } finally {
      setProcessingLoading(false);
    }
  }, [loadStatus]);

  // Reprocessar clips falhados
  const retryFailedClips = useCallback(async () => {
    try {
      setRetryLoading(true);
      setError(null);
      console.log('🔄 Reprocessando clips falhados...');
      
      const result = await automationService.retryFailedClips();
      console.log('✅ Reprocessamento iniciado:', result);
      
      // Recarregar status após retry
      await loadStatus();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reprocessar clips';
      console.error('❌ Erro ao reprocessar clips:', errorMessage);
      setError(errorMessage);
    } finally {
      setRetryLoading(false);
    }
  }, [loadStatus]);

  // Limpar clips antigos
  const cleanupOldClips = useCallback(async (options: { olderThanDays?: number; keepSuccessful?: boolean; dryRun?: boolean } = {}) => {
    try {
      setCleanupLoading(true);
      setError(null);
      console.log('🧹 Iniciando limpeza de clips...', options);
      
      const result = await automationService.cleanupOldClips({
        olderThanDays: options.olderThanDays || 30,
        keepSuccessful: options.keepSuccessful !== false,
        dryRun: options.dryRun || false
      });
      
      console.log('✅ Limpeza concluída:', result);
      
      // Recarregar status após limpeza
      await loadStatus();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao limpar clips';
      console.error('❌ Erro ao limpar clips:', errorMessage);
      setError(errorMessage);
    } finally {
      setCleanupLoading(false);
    }
  }, [loadStatus]);

  // Executar workflow personalizado
  const executeWorkflow = useCallback(async (config: Partial<ExecuteWorkflowRequest> = {}) => {
    try {
      setWorkflowLoading(true);
      setError(null);
      console.log('🔄 Executando workflow personalizado...', config);
      
      const workflowRequest: ExecuteWorkflowRequest = {
        channelName: config.channelName || 'default',
        clipLimit: config.clipLimit || 10,
        daysBack: config.daysBack || 1,
        forceDownload: config.forceDownload || false,
        autoUpload: config.autoUpload || false,
        customFilters: config.customFilters || {}
      };
      
      const result = await automationService.executeWorkflow(workflowRequest);
      console.log('✅ Workflow executado:', result);
      
      // Recarregar status após executar workflow
      await loadStatus();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao executar workflow';
      console.error('❌ Erro ao executar workflow:', errorMessage);
      setError(errorMessage);
    } finally {
      setWorkflowLoading(false);
    }
  }, [loadStatus]);

  // Carregar status inicial
  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  return {
    status,
    isLoading,
    error,
    loadStatus,
    processClips,
    retryFailedClips,
    cleanupOldClips,
    executeWorkflow,
    processingLoading,
    retryLoading,
    cleanupLoading,
    workflowLoading
  };
}; 