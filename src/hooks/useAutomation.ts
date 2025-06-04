import { useState, useEffect, useCallback, useRef } from 'react';
import { workflowsService } from '../services';
import { WorkflowRequest, WorkflowResult, AutomationStatus, RetryResult } from '../types';

export const useAutomation = () => {
  const [status, setStatus] = useState<AutomationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const automationStatus = await workflowsService.getAutomationStatus();
      setStatus(automationStatus);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch automation status');
    }
  }, []);

  const executeWorkflow = useCallback(async (request: WorkflowRequest): Promise<WorkflowResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await workflowsService.executeWorkflow(request);
      await fetchStatus(); // Refresh status after execution
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute workflow');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchStatus]);

  const retryFailed = useCallback(async (): Promise<RetryResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await workflowsService.retryFailedWorkflows();
      await fetchStatus(); // Refresh status after retry
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retry failed workflows');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchStatus]);

  const testAutomation = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await workflowsService.testAutomation();
      await fetchStatus(); // Refresh status after test
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test automation');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchStatus]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setIsPolling(true);
    intervalRef.current = setInterval(() => {
      fetchStatus();
    }, 5000); // Poll every 5 seconds
  }, [fetchStatus]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchStatus();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStatus]);

  return {
    status,
    loading,
    error,
    executeWorkflow,
    retryFailed,
    testAutomation,
    startPolling,
    stopPolling,
    isPolling
  };
}; 