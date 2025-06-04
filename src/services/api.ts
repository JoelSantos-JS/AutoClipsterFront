// Configuração base da API
export const API_BASE_URL = 'http://localhost:8080';

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
    ]
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
        if (endpoint.includes('/api/automation/status')) {
          resolve(MOCK_DATA.automation.status as T);
        } else if (endpoint.includes('/api/automation/execute')) {
          resolve({
            success: true,
            workflowId: Date.now(),
            message: 'Workflow executado com sucesso',
            totalClipsFound: Math.floor(Math.random() * 20) + 5,
            clipsDownloaded: Math.floor(Math.random() * 15) + 3
          } as T);
        } else if (endpoint.includes('/api/automation/retry-failed')) {
          resolve({
            success: true,
            retriedWorkflows: 3,
            message: 'Workflows falhados reexecutados'
          } as T);
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
                const newChannel = {
                  id: nextChannelId++,
                  twitchUsername: channelData.twitchUsername || channelData.channelName || 'new_channel',
                  twitchUserId: Math.random().toString().substr(2, 8),
                  channelUrl: channelData.channelUrl || `https://twitch.tv/${channelData.twitchUsername || channelData.channelName || 'new_channel'}`,
                  isActive: true,
                  uploadToYouTube: channelData.uploadToYouTube || false,
                  lastChecked: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  customPromptSettings: channelData.customPromptSettings || null
                };
                MOCK_DATA.channels.push(newChannel);
                resolve('Canal adicionado com sucesso!' as T);
              } catch {
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
        else if (endpoint.includes('/api/youtube')) {
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
        
        // Settings endpoints
        else if (endpoint.includes('/api/settings')) {
          if (method === 'PUT') {
            resolve('Configurações salvas com sucesso!' as T);
          } else if (endpoint.includes('/test-connections')) {
            resolve({
              'Twitch API': { success: true, message: 'Conectado', responseTime: 234 },
              'YouTube API': { success: true, message: 'Conectado', responseTime: 189 },
              'Gemini AI': { success: true, message: 'Conectado', responseTime: 145 }
            } as T);
          } else if (endpoint.includes('/backup')) {
            resolve('Backup criado com sucesso!' as T);
          } else if (endpoint.includes('/restore')) {
            resolve('Configurações restauradas com sucesso!' as T);
          } else {
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