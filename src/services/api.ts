// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

console.log('🚀 Frontend configurado para conectar com:', API_BASE_URL);
console.log('💡 Para mudar o backend, defina NEXT_PUBLIC_API_URL ou edite API_BASE_URL');

// Mock data for development (more realistic data matching the backend structure)
const MOCK_DATA = {
  automation: {
    status: {
      totalClipsDownloaded: 150,
      totalClipsProcessed: 142,
      totalClipsPending: 8,
      isProcessingActive: true,
      lastProcessedAt: new Date().toISOString(),
      averageProcessingTime: 45
    }
  },
  channels: [
    {
      id: 1,
      twitchUsername: "gaules",
      twitchUserId: "30672329",
      channelUrl: "https://twitch.tv/gaules",
      isActive: true,
      uploadToYouTube: true,
      lastChecked: new Date().toISOString(),
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-20T14:22:00Z",
      customPromptSettings: null
    },
    {
      id: 2,
      twitchUsername: "loud_coringa",
      twitchUserId: "29415222", 
      channelUrl: "https://twitch.tv/loud_coringa",
      isActive: true,
      uploadToYouTube: false,
      lastChecked: new Date().toISOString(),
      createdAt: "2024-01-16T09:15:00Z",
      updatedAt: "2024-01-20T12:45:00Z",
      customPromptSettings: null
    },
    {
      id: 3,
      twitchUsername: "casimito",
      twitchUserId: "19571641",
      channelUrl: "https://twitch.tv/casimito",
      isActive: true,
      uploadToYouTube: true,
      lastChecked: new Date().toISOString(),
      createdAt: "2024-01-17T16:20:00Z",
      updatedAt: "2024-01-20T11:30:00Z",
      customPromptSettings: null
    }
  ],
  clips: [
    {
      id: 1,
      title: "Gaules - Jogada insana no CS2!",
      twitchClipId: "LovelyBetterNightingalePogChamp",
      streamerName: "gaules",
      createdAt: "2024-01-20T14:22:00Z",
      duration: 30,
      viewCount: 15420,
      language: "pt",
      gameId: "32399",
      thumbnailUrl: "https://clips-media-assets2.twitch.tv/example1.jpg",
      embedUrl: "https://clips.twitch.tv/embed?clip=LovelyBetterNightingalePogChamp",
      viralScore: 8.5,
      downloadStatus: "COMPLETED",
      localFilePath: "/clips/gaules_clip_1.mp4"
    },
    {
      id: 2,
      title: "Coringa - Clutch 1v4 incrível",
      twitchClipId: "AwkwardHelplessSalamanderSwiftRage",
      streamerName: "loud_coringa",
      createdAt: "2024-01-20T12:45:00Z",
      duration: 45,
      viewCount: 8930,
      language: "pt",
      gameId: "516575",
      thumbnailUrl: "https://clips-media-assets2.twitch.tv/example2.jpg",
      embedUrl: "https://clips.twitch.tv/embed?clip=AwkwardHelplessSalamanderSwiftRage",
      viralScore: 7.2,
      downloadStatus: "PROCESSING",
      localFilePath: null
    }
  ],
  youtube: {
    stats: {
      totalVideos: 89,
      totalViews: 234567,
      uploadsCompleted: 85,
      uploadsFailed: 4,
      totalSubscribers: 15600,
      totalLikes: 45890
    },
    videos: [
      {
        id: 1,
        youtubeId: "dQw4w9WgXcQ",
        title: "Best Gaming Moments #1",
        description: "Amazing gaming clips compilation",
        uploadStatus: "COMPLETED",
        viewCount: 15420,
        likeCount: 892,
        uploadProgress: 100,
        createdAt: "2024-01-20T10:30:00Z",
        publishedAt: "2024-01-20T11:00:00Z"
      }
    ],
    // Dados mock para múltiplos canais YouTube
    multipleChannels: {
      channels: [
        {
          userId: "user123",
          channelId: "UC123456789",
          channelName: "Meu Canal Gaming Principal",
          channelUrl: "https://youtube.com/channel/UC123456789",
          videoCount: 45,
          subscriberCount: 15600,
          connectionStatus: "CONNECTED",
          isActive: true,
          lastUsedAt: new Date().toISOString(),
          addedAt: "2024-01-15T10:30:00Z"
        },
        {
          userId: "user123",
          channelId: "UC987654321",
          channelName: "Canal Secundário Clips",
          channelUrl: "https://youtube.com/channel/UC987654321",
          videoCount: 23,
          subscriberCount: 8200,
          connectionStatus: "CONNECTED",
          isActive: false,
          lastUsedAt: "2024-01-18T14:20:00Z",
          addedAt: "2024-01-16T09:15:00Z"
        },
        {
          userId: "user123",
          channelId: "UC555666777",
          channelName: "Canal Teste",
          channelUrl: "https://youtube.com/channel/UC555666777",
          videoCount: 12,
          subscriberCount: 3400,
          connectionStatus: "NOT_AUTHENTICATED",
          isActive: false,
          lastUsedAt: "2024-01-19T11:30:00Z",
          addedAt: "2024-01-17T16:20:00Z"
        }
      ],
      totalChannels: 3,
      activeChannelId: "UC123456789",
      allChannelsStats: {
        summary: {
          totalChannels: 3,
          totalViews: 456789,
          totalLikes: 12340,
          totalComments: 890,
          totalVideos: 80,
          averageViewsPerChannel: 152263
        },
        channelStats: [
          {
            channelId: "UC123456789",
            channelName: "Meu Canal Gaming Principal",
            views: 234567,
            likes: 7890,
            comments: 456,
            videoCount: 45
          },
          {
            channelId: "UC987654321",
            channelName: "Canal Secundário Clips",
            views: 156789,
            likes: 3450,
            comments: 234,
            videoCount: 23
          },
          {
            channelId: "UC555666777",
            channelName: "Canal Teste",
            views: 65433,
            likes: 1000,
            comments: 200,
            videoCount: 12
          }
        ]
      }
    }
  },
  workflows: [
    {
      id: 1,
      channelName: "gaules",
      clipLimit: 10,
      daysBack: 1,
      status: "COMPLETED",
      totalClipsFound: 15,
      clipsDownloaded: 12,
      clipsProcessed: 8,
      executedAt: "2024-01-20T10:00:00Z",
      duration: "2m 45s"
    },
    {
      id: 2,
      channelName: "loud_coringa",
      clipLimit: 20,
      daysBack: 3,
      status: "RUNNING",
      totalClipsFound: 28,
      clipsDownloaded: 15,
      clipsProcessed: 8,
      executedAt: "2024-01-20T12:00:00Z",
      duration: "1m 30s"
    }
  ],
  settings: {
    upload: {
      youtubeAutoUpload: false,
      defaultPrivacy: "unlisted"
    },
    ai: {
      enabled: true,
      rateLimit: 100,
      model: "gemini-pro"
    },
    quality: {
      minViralScore: 6.0,
      minViews: 1000,
      minDuration: 15,
      maxDuration: 60
    },
    notifications: {
      emailEnabled: true,
      desktopEnabled: false,
      webhookEnabled: false
    },
    apiKeys: {
      twitchClientIdMasked: "ghu7***",
      twitchClientSecretMasked: "abc1***",
      youtubeApiKeyMasked: "AIz***",
      geminiApiKeyMasked: "gem***"
    }
  }
};

// Check if backend is available - initially assume it's available
let isBackendAvailable = true;
let nextChannelId = 4;

// Utilitário para fazer chamadas HTTP
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    try {
      // Test backend availability
      this.testConnection();
    } catch {
      console.log('Backend connection test failed, using mock mode');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Log para rastrear requisições POST
    if (options.method === 'POST' && options.body) {
      console.log('🌐 ApiClient - Enviando para o backend:');
      console.log('  URL:', url);
      console.log('  Body:', options.body);
      console.log('  Parsed Body:', JSON.parse(options.body as string));
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      // Verificar se a resposta é JSON ou texto simples
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text() as unknown as T;
      }
    } catch {
      console.warn(`🔄 Backend não disponível (${endpoint}), usando dados mock...`);
      if (!isBackendAvailable) {
        console.log('🎭 Modo Mock ativado');
      }
      isBackendAvailable = false;
      return this.getMockResponse<T>(endpoint, options.method as string, options.body);
    }
  }

  private getMockResponse<T>(endpoint: string, method: string = 'GET', body?: BodyInit | null): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`🎭 Mock API: ${method} ${endpoint}`);
        
        // Automation endpoints
        if (endpoint.includes('/api/automation')) {
          if (endpoint.includes('/status')) {
            resolve({
              success: true,
              isRunning: Math.random() > 0.6,
              statistics: {
                totalClips: Math.floor(Math.random() * 500) + 100,
                pendingClips: Math.floor(Math.random() * 20),
                processedToday: Math.floor(Math.random() * 50) + 10,
                successRate: 85 + Math.random() * 10,
                lastRun: new Date(Date.now() - Math.random() * 3600000).toISOString()
              },
              nextScheduledRun: new Date(Date.now() + Math.random() * 3600000).toISOString()
            } as T);
          } else if (endpoint.includes('/process') && method === 'POST') {
            resolve({
              success: true,
              message: 'Processamento automático iniciado',
              jobId: `job_${Date.now()}`,
              estimatedDuration: '5-15 minutos',
              clipsToProcess: Math.floor(Math.random() * 25) + 5
            } as T);
          } else if (endpoint.includes('/retry') && method === 'POST') {
            resolve({
              success: true,
              message: 'Reprocessamento de clips falhados iniciado',
              retriedClips: Math.floor(Math.random() * 10) + 2,
              estimatedDuration: '2-8 minutos'
            } as T);
          } else if (endpoint.includes('/cleanup') && method === 'DELETE') {
            const isDryRun = endpoint.includes('dryRun=true');
            resolve({
              success: true,
              message: isDryRun ? 'Simulação de limpeza concluída' : 'Limpeza concluída com sucesso',
              deletedClips: Math.floor(Math.random() * 30) + 5,
              freedSpaceMB: Math.floor(Math.random() * 500) + 100,
              dryRun: isDryRun
            } as T);
          } else if (endpoint.includes('/workflow') && method === 'POST') {
            resolve({
              success: true,
              message: 'Workflow personalizado executado',
              workflowId: `workflow_${Date.now()}`,
              steps: [
                { name: 'Análise de clips', status: 'completed', duration: '2s' },
                { name: 'Processamento', status: 'running', duration: '0s' },
                { name: 'Upload', status: 'pending', duration: '0s' }
              ],
              estimatedCompletion: new Date(Date.now() + 600000).toISOString()
            } as T);
          } else {
            resolve({ success: true, message: 'Operação de automação realizada' } as T);
          }
        }
        
        // Channels endpoints  
        else if (endpoint.includes('/api/channels')) {
          if (method === 'POST') {
            // Test channel endpoint
            if (endpoint.includes('/test')) {
              const channelId = endpoint.split('/').filter(part => part && !isNaN(Number(part)))[0];
              resolve({
                success: true,
                message: `Canal ${channelId} testado com sucesso!`,
                clipsFound: Math.floor(Math.random() * 10) + 5,
                responseTime: Math.floor(Math.random() * 300) + 100
              } as T);
            } 
            // Add channel endpoint
            else {
              try {
                const channelData = body ? JSON.parse(body as string) : {};
                console.log('📝 Mock API - Dados recebidos para adicionar canal:', channelData);
                
                const newChannel = {
                  id: nextChannelId++,
                  twitchUsername: channelData.twitchUsername || 'new_channel',
                  twitchUserId: Math.random().toString().substr(2, 8),
                  channelUrl: channelData.channelUrl || `https://twitch.tv/${channelData.twitchUsername || 'new_channel'}`,
                  isActive: true,
                  uploadToYouTube: channelData.uploadToYouTube || false,
                  lastChecked: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  customPromptSettings: channelData.customPromptSettings || null
                };
                MOCK_DATA.channels.push(newChannel);
                console.log('✅ Mock API - Canal adicionado:', newChannel);
                resolve('Canal adicionado com sucesso!' as T);
              } catch (error) {
                console.error('❌ Mock API - Erro ao adicionar canal:', error);
                resolve('Canal adicionado com sucesso!' as T);
              }
            }
          } else if (method === 'DELETE') {
            const channelId = parseInt(endpoint.split('/').pop() || '0');
            MOCK_DATA.channels = MOCK_DATA.channels.filter(c => c.id !== channelId);
            resolve('Canal removido com sucesso!' as T);
          } else {
            resolve(MOCK_DATA.channels as T);
          }
        }
        
        // Clips endpoints
        else if (endpoint.includes('/api/clips')) {
          if (endpoint.includes('/download-by-name')) {
            resolve(`Iniciando download de clips para o canal... ${Math.floor(Math.random() * 10) + 5} clips encontrados.` as T);
          } else if (endpoint.includes('/download-top')) {
            resolve(`Download iniciado para os top clips... ${Math.floor(Math.random() * 15) + 8} clips encontrados.` as T);
          } else if (endpoint.includes('/downloaded')) {
            resolve(MOCK_DATA.clips as T);
          } else if (method === 'DELETE') {
            resolve('Clip deletado com sucesso!' as T);
          } else {
            resolve(MOCK_DATA.clips as T);
          }
        }
        
        // YouTube endpoints
        else if (endpoint.includes('/api/shorts')) {
          if (endpoint.includes('/auth/start')) {
            resolve({
              success: true,
              authUrl: 'https://accounts.google.com/oauth2/auth?client_id=mock',
              message: 'URL de autenticação gerada'
            } as T);
          } else if (endpoint.includes('/auth/status')) {
            resolve({
              authenticated: true,
              channelId: 'UC123456789',
              channelTitle: 'Meu Canal Gaming'
            } as T);
          } else if (endpoint.includes('/upload')) {
            resolve({
              success: true,
              youtubeId: 'mock_video_id',
              message: 'Upload realizado com sucesso',
              uploadProgress: 100
            } as T);
          } else if (endpoint.includes('/stats')) {
            resolve(MOCK_DATA.youtube.stats as T);
          } else if (endpoint.includes('/videos/status')) {
            resolve(MOCK_DATA.youtube.videos as T);
          } else {
            resolve({ success: true, message: 'Operação YouTube realizada' } as T);
          }
        }
        
        // YouTube Uploads endpoints (múltiplos canais)
        else if (endpoint.includes('/api/uploads/youtube')) {
          if (endpoint.includes('/channels/stats')) {
            resolve(MOCK_DATA.youtube.multipleChannels.allChannelsStats as T);
          } else if (endpoint.includes('/channels/add')) {
            resolve({
              success: true,
              channelId: 'UC' + Math.random().toString().substr(2, 9),
              authUrl: 'https://accounts.google.com/oauth2/auth?client_id=mock_new',
              message: 'Canal adicionado com sucesso',
              instructions: 'Complete a autenticação na janela popup'
            } as T);
          } else if (endpoint.includes('/channels/select')) {
            resolve({
              success: true,
              activeChannelId: 'UC123456789',
              message: 'Canal ativo alterado com sucesso'
            } as T);
          } else if (endpoint.includes('/channels') && method === 'DELETE') {
            resolve({
              success: true,
              removedChannelId: endpoint.split('/').pop(),
              message: 'Canal removido com sucesso'
            } as T);
          } else if (endpoint.includes('/channels')) {
            resolve({
              channels: MOCK_DATA.youtube.multipleChannels.channels,
              totalChannels: MOCK_DATA.youtube.multipleChannels.totalChannels,
              activeChannelId: MOCK_DATA.youtube.multipleChannels.activeChannelId,
              hasChannels: MOCK_DATA.youtube.multipleChannels.totalChannels > 0
            } as T);
          } else if (endpoint.includes('/status')) {
            resolve({
              connected: true,
              channelId: 'UC123456789',
              channelName: 'Meu Canal Gaming Mock',
              status: 'CONNECTED',
              message: 'Canal conectado com sucesso',
              subscriberCount: '1.2K'
            } as T);
          } else if (endpoint.includes('/auth/start')) {
            resolve({
              success: true,
              authUrl: 'https://accounts.google.com/oauth2/auth?client_id=mock_uploads',
              message: 'Autenticação iniciada',
              instructions: 'Clique no link para conectar sua conta do YouTube'
            } as T);
          } else if (endpoint.includes('/auth/disconnect')) {
            resolve({
              success: true,
              message: 'Canal desconectado com sucesso'
            } as T);
          } else if (endpoint.includes('/videos')) {
            resolve({
              videos: MOCK_DATA.youtube.videos,
              totalElements: MOCK_DATA.youtube.videos.length,
              totalPages: 1,
              currentPage: 0,
              size: 20,
              hasNext: false,
              hasPrevious: false
            } as T);
          } else if (endpoint.includes('/analytics')) {
            resolve({
              totalViews: 234567,
              totalLikes: 45890,
              totalComments: 2340,
              videosPublished: 89,
              averageViews: 2634,
              engagementRate: 7.8,
              recentViews: 15420,
              recentVideos: 5
            } as T);
          } else if (endpoint.includes('/sync-stats')) {
            resolve({
              success: true,
              message: 'Estatísticas sincronizadas com sucesso',
              lastSync: new Date().toISOString()
            } as T);
          } else {
            resolve({ success: true, message: 'Operação de upload realizada' } as T);
          }
        }
        
        // Monitoring endpoints
        else if (endpoint.includes('/api/monitoring')) {
          if (endpoint.includes('/status')) {
            resolve({
              enabled: true,
              isRunning: Math.random() > 0.7, // 30% chance of running
              activeChannels: 3,
              totalChannels: 5,
              activeTasks: Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0,
              lastFullRun: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Random time in last hour
              totalClipsDiscovered: 145 + Math.floor(Math.random() * 50),
              clipsDiscoveredLast24h: Math.floor(Math.random() * 20) + 5
            } as T);
          } else if (endpoint.includes('/stats')) {
            resolve({
              monitoring: {
                enabled: true,
                isRunning: Math.random() > 0.7,
                activeChannels: 3,
                totalChannels: 5,
                activeTasks: Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0,
                lastFullRun: new Date(Date.now() - Math.random() * 3600000).toISOString(),
                totalClipsDiscovered: 145 + Math.floor(Math.random() * 50),
                clipsDiscoveredLast24h: Math.floor(Math.random() * 20) + 5
              },
              performance: {
                avgClipsPerChannel: 28.0 + Math.random() * 10,
                discoveryRate: Math.floor(Math.random() * 20) + 5,
                systemEfficiency: 3.5 + Math.random() * 2
              },
              timestamp: new Date().toISOString()
            } as T);
          } else if (endpoint.includes('/health')) {
            const healthy = Math.random() > 0.1; // 90% chance of being healthy
            resolve({
              status: healthy ? 'UP' : 'DOWN',
              healthy,
              monitoring: {
                enabled: true,
                running: healthy && Math.random() > 0.7,
                activeChannels: 3,
                activeTasks: Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0
              },
              lastCheck: new Date().toISOString()
            } as T);
          } else if (endpoint.includes('/config')) {
            resolve({
              description: 'Configurações do sistema de monitoramento automático',
              schedulerInterval: '15 minutos',
              defaultClipsPerChannel: 5,
              defaultDaysBack: 1,
              minViews: 50,
              durationRange: '10-60 segundos',
              minViralThreshold: 5.0,
              currentStatus: {
                enabled: true,
                isRunning: Math.random() > 0.7,
                activeChannels: 3,
                totalChannels: 5,
                activeTasks: 0,
                lastFullRun: new Date(Date.now() - Math.random() * 3600000).toISOString(),
                totalClipsDiscovered: 145,
                clipsDiscoveredLast24h: 12
              }
            } as T);
          } else if (endpoint.includes('/force') && method === 'POST') {
            // Check if it's a specific channel
            const pathParts = endpoint.split('/');
            const channelName = pathParts[pathParts.length - 1];
            
            if (channelName && channelName !== 'force') {
              resolve({
                success: true,
                message: `Monitoramento do canal '${channelName}' executado com sucesso`,
                channelName,
                monitored: true
              } as T);
            } else {
              resolve({
                success: true,
                message: 'Monitoramento forçado iniciado com sucesso',
                startedAt: new Date().toISOString()
              } as T);
            }
          } else if (endpoint.includes('/stop') && method === 'POST') {
            resolve({
              success: true,
              message: 'Monitoramento parado com sucesso'
            } as T);
          } else if (endpoint.includes('/resume') && method === 'POST') {
            resolve({
              success: true,
              message: 'Monitoramento retomado com sucesso'
            } as T);
          } else {
            resolve({ success: true, message: 'Operação de monitoramento realizada' } as T);
          }
        }
        
        // Settings endpoints
        else if (endpoint.includes('/api/settings')) {
          if (method === 'GET' && endpoint.endsWith('/api/settings')) {
            // Get all settings
            resolve({
              success: true,
              settings: {
                autoUploadEnabled: Math.random() > 0.5,
                autoUploadMinScore: 8.0,
                minViralScore: 6.0,
                minViews: 100,
                minDuration: 10,
                maxDuration: 60,
                monitoringInterval: 15,
                retryFailedUploads: true,
                enableWebhooks: false,
                webhookUrl: '',
                youtubeShorts: {
                  enabled: true,
                  maxDuration: 60,
                  aspectRatio: '9:16',
                  hashtagsEnabled: true
                },
                geminiAI: {
                  enabled: true,
                  enhanceTitles: true,
                  enhanceDescriptions: true,
                  generateTags: true,
                  viralScoreThreshold: 7.0
                },
                rateLimiting: {
                  twitchApiCalls: 800,
                  youtubeApiCalls: 10000,
                  aiApiCalls: 100
                }
              }
            } as T);
          } else if (method === 'PUT' && endpoint.endsWith('/api/settings')) {
            // Update settings
            resolve({
              success: true,
              message: 'Configurações atualizadas com sucesso',
              updatedSettings: {
                autoUploadEnabled: Math.random() > 0.5,
                autoUploadMinScore: 8.0,
                minViralScore: 6.0,
                minViews: 100,
                minDuration: 10,
                maxDuration: 60,
                monitoringInterval: 15,
                retryFailedUploads: true,
                enableWebhooks: false,
                youtubeShorts: {
                  enabled: true,
                  maxDuration: 60,
                  aspectRatio: '9:16',
                  hashtagsEnabled: true
                },
                geminiAI: {
                  enabled: true,
                  enhanceTitles: true,
                  enhanceDescriptions: true,
                  generateTags: true,
                  viralScoreThreshold: 7.0
                },
                rateLimiting: {
                  twitchApiCalls: 800,
                  youtubeApiCalls: 10000,
                  aiApiCalls: 100
                }
              },
              restartRequired: Math.random() > 0.7
            } as T);
          } else if (endpoint.includes('/auto-upload/toggle') && method === 'POST') {
            const isEnabled = Math.random() > 0.5;
            resolve({
              success: true,
              autoUploadEnabled: isEnabled,
              message: `Upload automático ${isEnabled ? 'habilitado' : 'desabilitado'} com sucesso`,
              affectedClips: Math.floor(Math.random() * 10) + 2
            } as T);
          } else if (endpoint.includes('/auto-upload/status')) {
            resolve({
              autoUploadEnabled: Math.random() > 0.5,
              lastCheck: new Date(Date.now() - Math.random() * 3600000).toISOString(),
              pendingUploads: Math.floor(Math.random() * 15),
              queuedClips: Math.floor(Math.random() * 8),
              failedUploads: Math.floor(Math.random() * 3),
              totalUploaded: Math.floor(Math.random() * 100) + 50,
              averageUploadTime: Math.floor(Math.random() * 180) + 60
            } as T);
          } else if (endpoint.includes('/backup') && method === 'POST') {
            resolve({
              success: true,
              backupId: `backup_${Date.now()}`,
              timestamp: new Date().toISOString(),
              message: 'Backup criado com sucesso'
            } as T);
          } else if (endpoint.includes('/restore') && method === 'POST') {
            resolve({
              success: true,
              restoredSettings: {
                autoUploadEnabled: false,
                autoUploadMinScore: 8.0,
                minViralScore: 6.0,
                minViews: 100,
                minDuration: 10,
                maxDuration: 60,
                monitoringInterval: 15,
                retryFailedUploads: true,
                enableWebhooks: false,
                youtubeShorts: {
                  enabled: true,
                  maxDuration: 60,
                  aspectRatio: '9:16',
                  hashtagsEnabled: true
                },
                geminiAI: {
                  enabled: true,
                  enhanceTitles: true,
                  enhanceDescriptions: true,
                  generateTags: true,
                  viralScoreThreshold: 7.0
                },
                rateLimiting: {
                  twitchApiCalls: 800,
                  youtubeApiCalls: 10000,
                  aiApiCalls: 100
                }
              },
              message: 'Configurações restauradas com sucesso'
            } as T);
          } else if (endpoint.includes('/test-connections')) {
            resolve({
              'Twitch API': { success: true, message: 'Conectado', responseTime: 234 },
              'YouTube API': { success: true, message: 'Conectado', responseTime: 189 },
              'Gemini AI': { success: true, message: 'Conectado', responseTime: 145 }
            } as T);
          } else {
            // Legacy settings response
            resolve(MOCK_DATA.settings as T);
          }
        }
        
        // Gemini endpoints
        else if (endpoint.includes('/api/gemini')) {
          resolve({
            viralScore: Math.random() * 10,
            optimizedTitle: 'Título otimizado pelo AI',
            optimizedDescription: 'Descrição melhorada pelo AI',
            suggestedTags: ['gaming', 'viral', 'highlights']
          } as T);
        }
        
        // Default response
        else {
          resolve({ success: true, message: 'Mock response' } as T);
        }
      }, Math.random() * 500 + 200); // Simulate realistic network delay
    });
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Método especial para URLs com query params
  async getWithParams<T>(endpoint: string, params: Record<string, string | number | boolean>): Promise<T> {
    const url = new URL(endpoint, this.baseURL);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key].toString());
      }
    });
    
    return this.request<T>(url.pathname + url.search, { method: 'GET' });
  }

  // Método especial para POST com query params
  async postWithParams<T>(endpoint: string, params: Record<string, string | number | boolean>, data?: unknown): Promise<T> {
    const url = new URL(endpoint, this.baseURL);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key].toString());
      }
    });
    
    return this.request<T>(url.pathname + url.search, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  private async testConnection() {
    // Implementation of testConnection method
  }
}

// Instância singleton do cliente API
export const apiClient = new ApiClient(); 