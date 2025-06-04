import { apiClient } from './api';

export interface WorkflowRequest {
  channelName: string;
  clipLimit: number;
  daysBack: number;
}

export interface MultipleChannelsRequest {
  channelNames: string[];
  clipLimitPerChannel: number;
  daysBack: number;
}

export interface WorkflowResult {
  success: boolean;
  workflowId?: number;
  message: string;
  totalClipsFound?: number;
  clipsDownloaded?: number;
  clipsProcessed?: number;
  duration?: string;
  status?: 'COMPLETED' | 'RUNNING' | 'FAILED' | 'PENDING';
}

export interface AutomationStatus {
  totalClipsDownloaded: number;
  totalClipsProcessed: number;
  totalClipsPending: number;
  isProcessingActive: boolean;
  lastProcessedAt: string;
  averageProcessingTime: number;
}

export interface RetryResult {
  success: boolean;
  retriedWorkflows: number;
  message: string;
}

export const workflowsService = {
  // POST /api/automation/execute
  async executeWorkflow(request: WorkflowRequest): Promise<WorkflowResult> {
    try {
      return await apiClient.post<WorkflowResult>('/api/automation/execute', request);
    } catch (error) {
      console.error('Error executing workflow:', error);
      throw error;
    }
  },

  // POST /api/automation/execute-multiple
  async executeMultipleWorkflows(request: MultipleChannelsRequest): Promise<WorkflowResult[]> {
    try {
      return await apiClient.post<WorkflowResult[]>('/api/automation/execute-multiple', request);
    } catch (error) {
      console.error('Error executing multiple workflows:', error);
      throw error;
    }
  },

  // GET /api/automation/status
  async getAutomationStatus(): Promise<AutomationStatus> {
    try {
      return await apiClient.get<AutomationStatus>('/api/automation/status');
    } catch (error) {
      console.error('Error getting automation status:', error);
      throw error;
    }
  },

  // POST /api/automation/retry-failed
  async retryFailedWorkflows(): Promise<RetryResult> {
    try {
      return await apiClient.post<RetryResult>('/api/automation/retry-failed');
    } catch (error) {
      console.error('Error retrying failed workflows:', error);
      throw error;
    }
  },

  // DELETE /api/automation/cleanup?daysToKeep=30
  async cleanupOldData(daysToKeep: number = 30): Promise<string> {
    try {
      return await apiClient.delete<string>(`/api/automation/cleanup?daysToKeep=${daysToKeep}`);
    } catch (error) {
      console.error('Error cleaning up old data:', error);
      throw error;
    }
  },

  // POST /api/automation/test
  async testAutomation(): Promise<string> {
    try {
      return await apiClient.post<string>('/api/automation/test');
    } catch (error) {
      console.error('Error testing automation:', error);
      throw error;
    }
  }
}; 