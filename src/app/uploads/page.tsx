"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useYouTube } from "../../hooks/useYouTube";
import { useClips } from "../../hooks/useClips";
import { apiClient } from "../../services/api";
import { ClipData } from "../../types";

interface UploadMetadata {
  title: string;
  description: string;
  tags: string;
  privacyStatus: string;
}

export default function UploadsPage() {
  const { stats, videos, authStatus, loading, error, uploadVideo, deleteVideo, refreshData } = useYouTube();
  const { clips } = useClips();
  const [autoUploadEnabled, setAutoUploadEnabled] = useState(false);
  const [uploadingClip, setUploadingClip] = useState<ClipData | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedClip, setSelectedClip] = useState<ClipData | null>(null);
  const [uploadMetadata, setUploadMetadata] = useState<UploadMetadata>({
    title: "",
    description: "",
    tags: "",
    privacyStatus: "private"
  });

  // Simulate upload progress when uploading
  useEffect(() => {
    if (uploadingClip) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadingClip(null);
            setUploadProgress(0);
            refreshData();
            return 100;
          }
          return prev + Math.random() * 10;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [uploadingClip, refreshData]);

  const handleUploadClip = async (clip: ClipData) => {
    setSelectedClip(clip);
    setUploadMetadata({
      title: `${clip.title || 'Clip'} - ${new Date().toLocaleDateString()}`,
      description: `Clip baixado de ${clip.streamerName || 'Twitch'}\n\nClip original: ${clip.embedUrl || ''}`,
      tags: "gaming,twitch,highlights,clips",
      privacyStatus: "private"
    });
    setShowUploadModal(true);
  };

  const confirmUpload = async () => {
    if (!selectedClip) return;
    
    setUploadingClip(selectedClip);
    setShowUploadModal(false);
    setUploadProgress(5);

    try {
      const result = await uploadVideo(selectedClip.id, {
        title: uploadMetadata.title,
        description: uploadMetadata.description,
        tags: uploadMetadata.tags.split(',').map(tag => tag.trim()),
        privacyStatus: uploadMetadata.privacyStatus
      });
      
      if (result) {
        console.log('Upload concluído:', result);
      }
    } catch (err) {
      console.error('Erro no upload:', err);
      setUploadingClip(null);
      setUploadProgress(0);
    }
  };

  const handleAutoUploadToggle = async () => {
    try {
      await apiClient.put('/api/settings', {
        autoUploadEnabled: !autoUploadEnabled
      });
      setAutoUploadEnabled(!autoUploadEnabled);
    } catch (err) {
      console.error('Erro ao alterar configuração:', err);
    }
  };

  const startYouTubeAuth = async () => {
    try {
      const result = await apiClient.post<{ authUrl?: string }>('/api/youtube/auth/start');
      if (result.authUrl) {
        window.open(result.authUrl, '_blank');
      }
    } catch (err) {
      console.error('Erro ao iniciar autenticação:', err);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#121416] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          {/* Sidebar */}
          <div className="layout-content-container flex flex-col w-80">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-[#121416] p-4">
              <div className="flex flex-col gap-4">
                <h1 className="text-white text-base font-medium leading-normal">AutoClipster</h1>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-white" data-icon="House" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.10Z"></path>
                      </svg>
                    </div>
                    <Link href="/" className="text-white text-sm font-medium leading-normal">Dashboard</Link>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-white" data-icon="FilmSlate" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M216,104H102.09L210,75.51a8,8,0,0,0,5.68-9.84l-8.16-30a15.93,15.93,0,0,0-19.42-11.13L35.81,64.74a15.75,15.75,0,0,0-9.7,7.4,15.51,15.51,0,0,0-1.55,12L32,111.56c0,.14,0,.29,0,.44v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V112A8,8,0,0,0,216,104ZM192.16,40l6,22.07-22.62,6L147.42,51.83Zm-66.69,17.6,28.12,16.24-36.94,9.75L88.53,67.37Zm-79.4,44.62-6-22.08,26.5-7L94.69,89.4ZM208,200H48V120H208v80Z"></path>
                      </svg>
                    </div>
                    <Link href="/clips" className="text-white text-sm font-medium leading-normal">Clips</Link>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#2c3135]">
                    <div className="text-white" data-icon="Upload" data-size="24px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M74.34,77.66a8,8,0,0,1,0-11.32l48-48a8,8,0,0,1,11.32,0l48,48a8,8,0,0,1-11.32,11.32L136,43.31V128a8,8,0,0,1-16,0V43.31L85.66,77.66A8,8,0,0,1,74.34,77.66ZM240,136v64a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V136a16,16,0,0,1,16-16h68a4,4,0,0,1,4,4v3.46c0,13.45,11,24.79,24.46,24.54A24,24,0,0,0,152,128v-4a4,4,0,0,1,4-4h68A16,16,0,0,1,240,136Zm-40,32a12,12,0,1,0-12,12A12,12,0,0,0,200,168Z"></path>
                      </svg>
                    </div>
                    <span className="text-white text-sm font-medium leading-normal">Uploads</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-white" data-icon="Gear" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
                      </svg>
                    </div>
                    <Link href="/settings" className="text-white text-sm font-medium leading-normal">Settings</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">Uploads</p>
                <p className="text-[#a2abb3] text-sm font-normal leading-normal">Manage your YouTube uploads and channels</p>
              </div>
              <button 
                onClick={refreshData}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2c3135] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
                disabled={loading}
              >
                <span className="truncate">{loading ? 'Atualizando...' : 'Atualizar'}</span>
              </button>
            </div>

            {error && (
              <div className="mx-4 mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* YouTube Connection Status */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">YouTube Channel</h2>
            <div className="flex items-center gap-4 bg-[#121416] px-4 min-h-[72px] py-2">
              {authStatus?.authenticated ? (
                <>
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit bg-gray-600 flex items-center justify-center">
                    <div className="text-white text-xl">📺</div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-white text-base font-medium leading-normal line-clamp-1">
                      {authStatus.channelTitle || 'Meu Canal'}
                    </p>
                    <p className="text-green-400 text-sm font-normal leading-normal line-clamp-2">✅ Conectado</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit bg-gray-600 flex items-center justify-center">
                    <div className="text-white text-xl">📺</div>
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <p className="text-white text-base font-medium leading-normal line-clamp-1">Canal do YouTube</p>
                    <p className="text-red-400 text-sm font-normal leading-normal line-clamp-2">❌ Não conectado</p>
                  </div>
                  <button 
                    onClick={startYouTubeAuth}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-blue-600 text-white text-sm font-medium leading-normal"
                  >
                    <span className="truncate">Conectar</span>
                  </button>
                </>
              )}
            </div>

            {/* Upload Status */}
            {uploadingClip && (
              <>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Upload em Andamento</h2>
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex gap-6 justify-between">
                    <p className="text-white text-base font-medium leading-normal">
                      Enviando: {uploadingClip.title || `Clip ${uploadingClip.id}`}
                    </p>
                  </div>
                  <div className="rounded bg-[#40484f]">
                    <div className="h-2 rounded bg-green-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <p className="text-[#a2abb3] text-sm font-normal leading-normal">
                    Progresso: {Math.round(uploadProgress)}% - Processando vídeo...
                  </p>
                </div>
              </>
            )}

            {/* Available Clips for Upload */}
            {clips && clips.length > 0 && (
              <>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Clips Disponíveis para Upload</h2>
                <div className="px-4 py-3">
                  <div className="flex overflow-hidden rounded-xl border border-[#40484f] bg-[#121416]">
                    <table className="flex-1">
                      <thead>
                        <tr className="bg-[#1e2124]">
                          <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Clip</th>
                          <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Canal</th>
                          <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Duração</th>
                          <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clips.slice(0, 5).map((clip) => (
                          <tr key={clip.id} className="border-t border-t-[#40484f]">
                            <td className="h-[72px] px-4 py-2 text-white text-sm font-normal leading-normal">
                              {clip.title || `Clip ${clip.id}`}
                            </td>
                            <td className="h-[72px] px-4 py-2 text-[#a2abb3] text-sm font-normal leading-normal">
                              {clip.streamerName || 'Desconhecido'}
                            </td>
                            <td className="h-[72px] px-4 py-2 text-[#a2abb3] text-sm font-normal leading-normal">
                              {clip.duration ? `${clip.duration}s` : 'N/A'}
                            </td>
                            <td className="h-[72px] px-4 py-2">
                              <button 
                                onClick={() => handleUploadClip(clip)}
                                disabled={uploadingClip !== null}
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-blue-600 text-white text-sm font-medium leading-normal disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <span className="truncate">Upload</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Published Videos */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Vídeos Publicados</h2>
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-xl border border-[#40484f] bg-[#121416]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#1e2124]">
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Título</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Views</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Likes</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Status</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos && videos.length > 0 ? (
                      videos.map((video) => (
                        <tr key={video.id} className="border-t border-t-[#40484f]">
                          <td className="h-[72px] px-4 py-2 text-white text-sm font-normal leading-normal">
                            {video.title}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-[#a2abb3] text-sm font-normal leading-normal">
                            {formatNumber(video.viewCount || 0)}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-[#a2abb3] text-sm font-normal leading-normal">
                            {formatNumber(video.likeCount || 0)}
                          </td>
                          <td className="h-[72px] px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              video.uploadStatus === 'COMPLETED' ? 'bg-green-900/20 text-green-400' :
                              video.uploadStatus === 'PROCESSING' ? 'bg-yellow-900/20 text-yellow-400' :
                              'bg-gray-900/20 text-gray-400'
                            }`}>
                              {video.uploadStatus === 'COMPLETED' ? 'Publicado' :
                               video.uploadStatus === 'PROCESSING' ? 'Processando' : 
                               video.uploadStatus || 'Desconhecido'}
                            </span>
                          </td>
                          <td className="h-[72px] px-4 py-2">
                            <button 
                              onClick={() => deleteVideo(video.id)}
                              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-red-600 text-white text-sm font-medium leading-normal"
                            >
                              <span className="truncate">Deletar</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-t border-t-[#40484f]">
                        <td colSpan={5} className="h-[72px] px-4 py-2 text-center text-[#a2abb3] text-sm">
                          Nenhum vídeo publicado ainda
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Automatic Uploads */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Upload Automático</h2>
            <div className="flex items-center gap-4 bg-[#121416] px-4 min-h-[72px] py-2 justify-between">
              <div className="flex flex-col justify-center">
                <p className="text-white text-base font-medium leading-normal line-clamp-1">Fazer Upload de Novos Clips Automaticamente</p>
                <p className="text-[#a2abb3] text-sm font-normal leading-normal line-clamp-2">
                  {autoUploadEnabled ? "✅ Habilitado" : "❌ Desabilitado"}
                </p>
              </div>
              <div className="shrink-0">
                <label
                  className={`relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none p-0.5 ${
                    autoUploadEnabled ? "justify-end bg-[#dce8f3]" : "justify-start bg-[#2c3135]"
                  }`}
                >
                  <div 
                    className="h-full w-[27px] rounded-full bg-white transition-all duration-200" 
                    style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px" }}
                  ></div>
                  <input 
                    type="checkbox" 
                    className="invisible absolute" 
                    checked={autoUploadEnabled}
                    onChange={handleAutoUploadToggle}
                  />
                </label>
              </div>
            </div>

            {/* Analytics */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Analytics</h2>
            <div className="flex flex-wrap gap-4 p-4">
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#40484f]">
                <p className="text-white text-base font-medium leading-normal">Total de Views</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  {stats ? formatNumber(stats.totalViews || 0) : '0'}
                </p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#40484f]">
                <p className="text-white text-base font-medium leading-normal">Total de Likes</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  {stats ? formatNumber(stats.totalLikes || 0) : '0'}
                </p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#40484f]">
                <p className="text-white text-base font-medium leading-normal">Total de Comentários</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  {stats ? formatNumber(stats.totalSubscribers || 0) : '0'}
                </p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#40484f]">
                <p className="text-white text-base font-medium leading-normal">Vídeos Publicados</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  {videos ? videos.length : '0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && selectedClip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#121416] border border-[#40484f] rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-white text-lg font-bold mb-4">Upload para YouTube</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={uploadMetadata.title}
                  onChange={(e) => setUploadMetadata({...uploadMetadata, title: e.target.value})}
                  className="w-full p-3 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={uploadMetadata.description}
                  onChange={(e) => setUploadMetadata({...uploadMetadata, description: e.target.value})}
                  className="w-full p-3 bg-[#2c3135] border border-[#40484f] rounded-lg text-white h-24 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={uploadMetadata.tags}
                  onChange={(e) => setUploadMetadata({...uploadMetadata, tags: e.target.value})}
                  className="w-full p-3 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Privacidade</label>
                <select
                  value={uploadMetadata.privacyStatus}
                  onChange={(e) => setUploadMetadata({...uploadMetadata, privacyStatus: e.target.value})}
                  className="w-full p-3 bg-[#2c3135] border border-[#40484f] rounded-lg text-white"
                >
                  <option value="private">Privado</option>
                  <option value="unlisted">Não listado</option>
                  <option value="public">Público</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 py-2 px-4 bg-[#2c3135] text-white rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={confirmUpload}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 