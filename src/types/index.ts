// Channel Types
export interface ChannelRequest {
  name: string;
  platform: 'twitch' | 'youtube' | 'facebook';
  url: string;
  description?: string;
}

export interface ChannelResponse {
  id: number;
  name: string;
  platform: 'twitch' | 'youtube' | 'facebook';
  url: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  lastClipAt: string | null;
  createdAt: string;
}

export interface ChannelTestResult {
  success: boolean;
  message: string;
  clips: number;
  responseTime: number;
}

// Clip Types
export interface ClipData {
  id: number;
  title: string;
  twitchClipId: string;
  streamerName: string;
  createdAt: string;
  duration: number;
  viewCount: number;
  language: string;
  gameId: string;
  thumbnailUrl: string;
  embedUrl: string;
  viralScore: number;
  downloadStatus: 'PENDING' | 'DOWNLOADING' | 'COMPLETED' | 'FAILED' | 'PROCESSING';
  localFilePath?: string;
}

// Workflow Types
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

// YouTube Types
export interface YouTubeUploadRequest {
  clipId: number;
  title: string;
  description: string;
  tags: string[];
  privacyStatus: 'private' | 'unlisted' | 'public';
  categoryId: string;
}

export interface YouTubeUploadResponse {
  success: boolean;
  youtubeId?: string;
  message: string;
  uploadProgress: number;
}

export interface YouTubeVideo {
  id: number;
  youtubeId: string;
  title: string;
  description: string;
  uploadStatus: 'PENDING' | 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  viewCount: number;
  likeCount: number;
  uploadProgress: number;
  createdAt: string;
  publishedAt?: string;
}

export interface YouTubeStats {
  totalVideos: number;
  totalViews: number;
  uploadsCompleted: number;
  uploadsFailed: number;
  totalSubscribers: number;
  totalLikes: number;
}

export interface YouTubeAuthStatus {
  authenticated: boolean;
  channelId?: string;
  channelTitle?: string;
}

// Settings Types
export interface SystemSettings {
  upload: {
    youtubeAutoUpload: boolean;
    defaultPrivacy: string;
  };
  ai: {
    enabled: boolean;
    rateLimit: number;
    model: string;
  };
  quality: {
    minViralScore: number;
    minViews: number;
    minDuration: number;
    maxDuration: number;
  };
  notifications: {
    emailEnabled: boolean;
    desktopEnabled: boolean;
    webhookEnabled: boolean;
  };
  apiKeys: {
    twitchClientIdMasked: string;
    twitchClientSecretMasked: string;
    youtubeApiKeyMasked: string;
    geminiApiKeyMasked: string;
  };
}

// Gemini AI Types
export interface ClipAnalysis {
  viralScore: number;
  optimizedTitle: string;
  optimizedDescription: string;
  suggestedTags: string[];
}

export interface OptimizedContent {
  title: string;
  description: string;
  tags: string[];
  thumbnail?: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Connection Test Types
export interface ConnectionTestResult {
  service: string;
  success: boolean;
  message: string;
  responseTime?: number;
}

// Backend Channel Format (for conversion)
export interface BackendChannelResponse {
  id: number;
  twitchUsername: string;
  twitchUserId: string;
  channelUrl: string;
  isActive: boolean;
  uploadToYouTube: boolean;
  lastChecked: string;
  createdAt: string;
  updatedAt: string;
  customPromptSettings?: string;
} 