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

// Clip Types - Updated based on API guide
export interface ClipData {
  id: number;
  clipId: string; // Twitch Clip ID
  title: string;
  viewCount: number;
  creatorName: string;
  broadcasterName: string;
  downloadDate: string;
  filePath: string;
  gameName: string;
  duration: number;
  originalUrl: string;
  processed: boolean;
  processingStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  youtubeId?: string;
  youtubeVideoId?: string;
  uploadStatus?: 'PENDING' | 'UPLOADING' | 'COMPLETED' | 'FAILED';
  uploadedAt?: string;
  youtubeTags?: string;
  finalStatus: 'DOWNLOADED' | 'PROCESSING' | 'PROCESSING_FAILED' | 'READY' | 'UPLOADING' | 'UPLOADED' | 'UPLOAD_FAILED';
  thumbnailPath?: string;
}

// Clips API Response Types
export interface ClipsResponse {
  clips: ClipData[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ClipsStats {
  totalClips: number;
  processedClips: number;
  pendingClips: number;
  uploadedClips: number;
  processingRate: number;
  uploadRate: number;
}

export interface ClipsFilters {
  status?: 'processed' | 'pending';
  creator?: string;
  game?: string;
}

export interface BatchOperation {
  clipIds: number[];
  operation: 'delete' | 'reprocess' | 'upload';
}

export interface BatchOperationResult {
  success: boolean;
  successCount: number;
  errorCount: number;
  errors: string[];
  message: string;
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

// YouTube Upload Types - Complete API Implementation with Real Auth
export interface YouTubeConnectionStatus {
  connected: boolean;
  status: 'CONNECTED' | 'NOT_CONFIGURED' | 'NOT_AUTHENTICATED' | 'EXPIRED' | 'ERROR';
  message: string;
  channelName?: string;
  channelId?: string;
  subscriberCount?: string;
  needsSetup?: boolean;
  needsAuth?: boolean;
  authUrl?: string;
}

export interface YouTubeAuthStartResponse {
  success: boolean;
  authUrl?: string;
  message: string;
  instructions?: string;
}

export interface YouTubeAuthDisconnectResponse {
  success: boolean;
  message: string;
}

export interface YouTubePublishedVideo {
  id: number;
  youtubeId: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  status: 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  uploadedAt: string;
  watchUrl: string;
  thumbnailUrl: string;
  duration: number;
  privacyStatus: 'PUBLIC' | 'UNLISTED' | 'PRIVATE';
}

export interface YouTubeVideosResponse {
  videos: YouTubePublishedVideo[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface YouTubeAnalytics {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  videosPublished: number;
  averageViews: number;
  engagementRate: number;
  recentViews: number;
  recentVideos: number;
}

export interface AutoUploadToggle {
  enabled: boolean;
}

export interface AutoUploadToggleResponse {
  success: boolean;
  autoUploadEnabled: boolean;
  message: string;
}

export interface AutoUploadStatus {
  autoUploadEnabled: boolean;
  lastCheck: string;
  pendingUploads: number;
}

export interface ManualUploadRequest {
  clipIds: number[];
}

export interface ManualUploadResponse {
  success: boolean;
  successCount: number;
  errorCount: number;
  message: string;
}

export interface SyncStatsResponse {
  success: boolean;
  message: string;
  lastSync: string;
}

// Multiple YouTube Channels Types - Complete API Implementation
export interface YouTubeChannelInfo {
  userId: string;
  channelId: string;
  channelName: string;
  channelUrl: string;
  videoCount: number;
  subscriberCount: string;
  connectionStatus: 'CONNECTED' | 'NOT_CONFIGURED' | 'NOT_AUTHENTICATED' | 'EXPIRED' | 'ERROR';
  isActive: boolean;
  lastUsed?: string;
  addedAt?: string;
}

export interface YouTubeChannelsResponse {
  channels: YouTubeChannelInfo[];
  totalChannels: number;
  hasChannels: boolean;
  activeChannelId?: string;
}

export interface AddChannelRequest {
  channelId: string;
  channelName?: string;
}

export interface AddChannelResponse {
  success: boolean;
  authUrl?: string;
  channelId: string;
  message: string;
  instructions?: string;
}

export interface SelectChannelRequest {
  channelId: string;
}

export interface SelectChannelResponse {
  success: boolean;
  activeChannelId: string;
  message: string;
}

export interface RemoveChannelResponse {
  success: boolean;
  removedChannelId: string;
  message: string;
}

export interface ChannelStats {
  channelName: string;
  channelId: string;
  views: number;
  likes: number;
  comments: number;
  videos: number;
}

export interface AllChannelsStatsResponse {
  [key: string]: ChannelStats | {
    totalChannels: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalVideos: number;
    averageViewsPerChannel: number;
  };
  summary: {
    totalChannels: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalVideos: number;
    averageViewsPerChannel: number;
  };
} 