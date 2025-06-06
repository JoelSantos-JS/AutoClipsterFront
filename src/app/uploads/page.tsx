"use client";

import { useState, useEffect } from "react";
import { useYouTube } from "../../hooks/useYouTube";
import { useClips } from "../../hooks/useClips";
import { apiClient } from "../../services/api";
import { ClipData } from "../../types";
import Sidebar from "../../components/Sidebar";

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
        <div className="flex h-full flex-1">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="layout-content-container flex flex-col flex-1">
            {/* Main Content Area */}
            <div className="flex flex-col bg-[#121416] p-8 flex-1 overflow-y-auto">
              {/* Header */}
              <div className="flex flex-wrap justify-between gap-3 mb-6">
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
                <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* YouTube Connection Status */}
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">YouTube Channel</h2>
              <div className="flex items-center gap-4 bg-[#121416] min-h-[72px] py-2 mb-6">
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
                  <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Upload em Andamento</h2>
                  <div className="flex flex-col gap-3 mb-6">
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
                  <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Clips Disponíveis para Upload</h2>
                  <div className="py-3 mb-6">
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
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Vídeos Publicados</h2>
              <div className="py-3 mb-6">
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
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Upload Automático</h2>
              <div className="flex items-center gap-4 bg-[#121416] min-h-[72px] py-2 justify-between mb-6">
                <div className="flex flex-col justify-center">
                  <p className="text-white text-base font-medium leading-normal line-clamp-1">Fazer Upload de Novos Clips Automaticamente</p>
                  <p className="text-[#a2abb3] text-sm font-normal leading-normal line-clamp-2">
                    {autoUploadEnabled ? "✅ Habilitado" : "❌ Desabilitado"}
                  </p>
                </div>
                <div className="shrink-0">
                  <label
                    className={`relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none p-0.5 ${
                      autoUploadEnabled ? "justify-end bg-[#2c90ea]" : "justify-start bg-[#2c3135]"
                    }`}
                  >
                    <div 
                      className={`h-full w-[27px] rounded-full transition-all duration-200 ${
                        autoUploadEnabled ? "bg-white" : "bg-[#a2abb3]"
                      }`}
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
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Analytics</h2>
              <div className="flex flex-wrap gap-4">
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