"use client";

import { useState, useEffect } from "react";
import { useClips } from '../../hooks/useClips';
import { ClipsFilters } from '../../types';
import Sidebar from "../../components/Sidebar";

export default function ClipsPage() {
  const {
    // Dados
    clips,
    stats,
    loading,
    error,
    
    // Paginação
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    hasNext,
    hasPrevious,
    
    // Filtros e ordenação
    filters,
    
    // Seleção
    selectedClips,
    actionLoading,
    
    // Operações
    reprocessClip,
    deleteClip,
    batchDelete,
    batchReprocess,
    
    // Navegação
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    
    // Filtros
    applyFilters,
    clearFilters,
    
    // Seleção
    toggleClipSelection,
    selectAllClips,
    clearSelection,
    isClipSelected,
    getSelectedClipsCount,
    
    // Utilitários
    refreshClips,
    formatDuration,
    getStatusColor,
    getStatusText
  } = useClips();

  // Estados locais
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showBatchConfirm, setShowBatchConfirm] = useState<'delete' | 'reprocess' | null>(null);
  const [localFilters, setLocalFilters] = useState<ClipsFilters>({});

  // Aplicar filtros locais
  const handleApplyFilters = () => {
    applyFilters(localFilters);
  };

  // Limpar mensagens após timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Funções de ação
  const handleReprocessClip = async (clipId: number) => {
    try {
      const result = await reprocessClip(clipId);
      if (result) {
        setSuccessMessage('Clip marcado para reprocessamento');
      } else {
        setErrorMessage('Erro ao reprocessar clip');
      }
    } catch (error) {
      console.error('Erro ao reprocessar:', error);
      setErrorMessage('Erro inesperado ao reprocessar clip');
    }
  };

  const handleDeleteClip = async (clipId: number) => {
    if (!confirm('Tem certeza que deseja deletar este clip?')) return;
    
    try {
      const success = await deleteClip(clipId);
      if (success) {
        setSuccessMessage('Clip deletado com sucesso');
      } else {
        setErrorMessage('Erro ao deletar clip');
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      setErrorMessage('Erro inesperado ao deletar clip');
    }
  };

  const handleBatchOperation = async (operation: 'delete' | 'reprocess') => {
    const selectedCount = getSelectedClipsCount();
    if (selectedCount === 0) {
      setErrorMessage('Selecione pelo menos um clip');
      return;
    }

    setShowBatchConfirm(operation);
  };

  const confirmBatchOperation = async () => {
    if (!showBatchConfirm) return;

    try {
      let result;
      if (showBatchConfirm === 'delete') {
        result = await batchDelete(selectedClips);
      } else {
        result = await batchReprocess(selectedClips);
      }

      if (result) {
        setSuccessMessage(`Operação concluída: ${result.successCount} sucessos, ${result.errorCount} erros`);
        if (result.errors.length > 0) {
          console.log('Erros:', result.errors);
        }
      }
    } catch (error) {
      console.error('Erro na operação em lote:', error);
      setErrorMessage('Erro na operação em lote');
    }

    setShowBatchConfirm(null);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#121416] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex h-full flex-1">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="layout-content-container flex flex-col flex-1">
            <div className="flex flex-col bg-[#121416] p-8 flex-1 overflow-y-auto">
              {/* Header com Estatísticas */}
              <div className="flex flex-wrap justify-between gap-6 mb-6">
                <div className="flex min-w-72 flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-white text-2xl font-bold leading-tight">Clips Baixados</h1>
                    <p className="text-[#a2abb3] text-base font-normal leading-normal">
                      Gerencie seus clips baixados e processados
                    </p>
                  </div>

                  {/* Estatísticas */}
                  {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-[#1c1f22] border border-[#2c3135] rounded-lg p-3">
                        <div className="text-white text-lg font-bold">{stats.totalClips}</div>
                        <div className="text-[#a2abb3] text-sm">Total</div>
                      </div>
                      <div className="bg-[#1c1f22] border border-[#2c3135] rounded-lg p-3">
                        <div className="text-green-400 text-lg font-bold">{stats.processedClips}</div>
                        <div className="text-[#a2abb3] text-sm">Processados</div>
                      </div>
                      <div className="bg-[#1c1f22] border border-[#2c3135] rounded-lg p-3">
                        <div className="text-yellow-400 text-lg font-bold">{stats.pendingClips}</div>
                        <div className="text-[#a2abb3] text-sm">Pendentes</div>
                      </div>
                      <div className="bg-[#1c1f22] border border-[#2c3135] rounded-lg p-3">
                        <div className="text-blue-400 text-lg font-bold">{stats.uploadedClips}</div>
                        <div className="text-[#a2abb3] text-sm">Enviados</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ações em Lote */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={refreshClips}
                    disabled={loading}
                    className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2c3135] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
                  >
                    {loading ? 'Carregando...' : 'Atualizar'}
                  </button>
                  
                  <button
                    onClick={() => handleBatchOperation('reprocess')}
                    disabled={getSelectedClipsCount() === 0 || actionLoading.batch_reprocess}
                    className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2884e6] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
                  >
                    ⚡ Reprocessar ({getSelectedClipsCount()})
                  </button>
                  
                  <button
                    onClick={() => handleBatchOperation('delete')}
                    disabled={getSelectedClipsCount() === 0 || actionLoading.batch_delete}
                    className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-red-600 text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
                  >
                    🗑️ Deletar ({getSelectedClipsCount()})
                  </button>
                </div>
              </div>

              {/* Mensagens */}
              {error && (
                <div className="flex items-center gap-3 rounded-xl bg-red-900/20 border border-red-600/30 p-4 mb-4">
                  <div className="text-red-400">⚠️</div>
                  <span className="text-red-300 text-sm">{error}</span>
                  <button onClick={() => setErrorMessage(null)} className="ml-auto text-red-400 hover:text-red-300">×</button>
                </div>
              )}

              {errorMessage && (
                <div className="flex items-center gap-3 rounded-xl bg-red-900/20 border border-red-600/30 p-4 mb-4">
                  <div className="text-red-400">⚠️</div>
                  <span className="text-red-300 text-sm">{errorMessage}</span>
                  <button onClick={() => setErrorMessage(null)} className="ml-auto text-red-400 hover:text-red-300">×</button>
                </div>
              )}

              {successMessage && (
                <div className="flex items-center gap-3 rounded-xl bg-green-900/20 border border-green-600/30 p-4 mb-4">
                  <div className="text-green-400">✅</div>
                  <span className="text-green-300 text-sm">{successMessage}</span>
                </div>
              )}

              {/* Filtros */}
              <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-[#a2abb3] text-sm font-medium">Status:</label>
                    <select
                      value={localFilters.status || ''}
                      onChange={(e) => setLocalFilters(prev => ({ ...prev, status: (e.target.value as 'processed' | 'pending' | '') || undefined }))}
                      className="border border-[#2c3135] rounded-lg px-3 py-2 text-sm bg-[#2c3135] text-white"
                    >
                      <option value="">Todos</option>
                      <option value="processed">Processados</option>
                      <option value="pending">Pendentes</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-[#a2abb3] text-sm font-medium">Criador:</label>
                    <input
                      type="text"
                      value={localFilters.creator || ''}
                      onChange={(e) => setLocalFilters(prev => ({ ...prev, creator: e.target.value || undefined }))}
                      placeholder="Nome do criador"
                      className="border border-[#2c3135] rounded-lg px-3 py-2 text-sm bg-[#2c3135] text-white"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-[#a2abb3] text-sm font-medium">Jogo:</label>
                    <input
                      type="text"
                      value={localFilters.game || ''}
                      onChange={(e) => setLocalFilters(prev => ({ ...prev, game: e.target.value || undefined }))}
                      placeholder="Nome do jogo"
                      className="border border-[#2c3135] rounded-lg px-3 py-2 text-sm bg-[#2c3135] text-white"
                    />
                  </div>

                  <button
                    onClick={handleApplyFilters}
                    className="bg-[#2884e6] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2672cc]"
                  >
                    Aplicar Filtros
                  </button>
                  
                  <button
                    onClick={() => {
                      setLocalFilters({});
                      clearFilters();
                    }}
                    className="bg-[#2c3135] text-[#a2abb3] px-4 py-2 rounded-lg text-sm hover:bg-[#3c4147]"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              {/* Lista de Clips */}
              {loading ? (
                <div className="flex min-h-[400px] flex-col gap-8 rounded-xl bg-[#1c1f22] p-4">
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    <p className="mt-2 text-[#a2abb3]">Carregando clips...</p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1c1f22] border border-[#2c3135] rounded-xl overflow-hidden">
                  {clips.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-[#a2abb3] mb-4">
                        <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">Nenhum clip encontrado</h3>
                      <p className="text-[#a2abb3]">
                        {Object.keys(filters).length > 0 ? 'Tente ajustar os filtros.' : 'Ainda não há clips baixados.'}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Cabeçalho da Tabela */}
                      <div className="bg-[#2c3135] px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              checked={getSelectedClipsCount() === clips.length && clips.length > 0}
                              onChange={() => getSelectedClipsCount() === clips.length ? clearSelection() : selectAllClips()}
                              className="rounded bg-[#1c1f22] border-[#2c3135]"
                            />
                            <span className="text-[#a2abb3] text-sm font-medium">
                              Selecionar todos ({getSelectedClipsCount()}/{clips.length})
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className="text-[#a2abb3] text-sm">
                              {totalElements} clips • Página {currentPage + 1} de {totalPages}
                            </span>
                            
                            <select
                              value={pageSize}
                              onChange={(e) => changePageSize(Number(e.target.value))}
                              className="border border-[#2c3135] rounded-lg px-2 py-1 text-sm bg-[#1c1f22] text-white"
                            >
                              <option value={10}>10 por página</option>
                              <option value={20}>20 por página</option>
                              <option value={50}>50 por página</option>
                              <option value={100}>100 por página</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Clips */}
                      <div className="divide-y divide-[#2c3135]">
                        {clips.map((clip) => (
                          <div key={clip.id} className="p-6 hover:bg-[#2c3135]/30 transition-colors">
                            <div className="flex items-center gap-4">
                              {/* Checkbox */}
                              <input
                                type="checkbox"
                                checked={isClipSelected(clip.id)}
                                onChange={() => toggleClipSelection(clip.id)}
                                className="rounded bg-[#1c1f22] border-[#2c3135]"
                              />

                              {/* Thumbnail/Preview */}
                              <div className="flex-shrink-0">
                                <div className="w-24 h-16 bg-[#2c3135] rounded-lg flex items-center justify-center">
                                  {clip.thumbnailPath ? (
                                    <img src={clip.thumbnailPath} alt={clip.title} className="w-full h-full object-cover rounded-lg" />
                                  ) : (
                                    <svg className="w-8 h-8 text-[#a2abb3]" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M8 5v14l11-7z"/>
                                    </svg>
                                  )}
                                </div>
                              </div>

                              {/* Informações do Clip */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-white font-medium truncate">{clip.title}</h3>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    getStatusColor(clip.finalStatus) === 'success' ? 'bg-green-900/30 text-green-400' :
                                    getStatusColor(clip.finalStatus) === 'yellow' ? 'bg-yellow-900/30 text-yellow-400' :
                                    getStatusColor(clip.finalStatus) === 'red' ? 'bg-red-900/30 text-red-400' :
                                    getStatusColor(clip.finalStatus) === 'blue' ? 'bg-blue-900/30 text-blue-400' :
                                    getStatusColor(clip.finalStatus) === 'green' ? 'bg-green-900/30 text-green-400' :
                                    getStatusColor(clip.finalStatus) === 'orange' ? 'bg-orange-900/30 text-orange-400' :
                                    'bg-gray-900/30 text-gray-400'
                                  }`}>
                                    {getStatusText(clip.finalStatus)}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[#a2abb3]">
                                  <div>
                                    <span className="font-medium">Criador:</span> {clip.creatorName}
                                  </div>
                                  <div>
                                    <span className="font-medium">Jogo:</span> {clip.gameName}
                                  </div>
                                  <div>
                                    <span className="font-medium">Duração:</span> {formatDuration(clip.duration)}
                                  </div>
                                  <div>
                                    <span className="font-medium">Visualizações:</span> {clip.viewCount?.toLocaleString()}
                                  </div>
                                </div>
                                
                                <div className="mt-2 text-sm text-[#a2abb3]">
                                  <span className="font-medium">Baixado:</span> {new Date(clip.downloadDate).toLocaleString()}
                                </div>

                                {clip.youtubeId && (
                                  <div className="mt-1 text-sm">
                                    <a
                                      href={`https://youtube.com/watch?v=${clip.youtubeId}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[#2884e6] hover:text-[#4a9eff] flex items-center gap-1"
                                    >
                                      🎬 Ver no YouTube
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                                      </svg>
                                    </a>
                                  </div>
                                )}
                              </div>

                              {/* Ações */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleReprocessClip(clip.id)}
                                  disabled={actionLoading[`reprocess_${clip.id}`]}
                                  className="bg-[#2884e6] text-white px-3 py-1 rounded text-sm hover:bg-[#2672cc] transition-colors disabled:opacity-50"
                                >
                                  {actionLoading[`reprocess_${clip.id}`] ? 'Processando...' : '⚡ Reprocessar'}
                                </button>
                                
                                <button
                                  onClick={() => handleDeleteClip(clip.id)}
                                  disabled={actionLoading[`delete_${clip.id}`]}
                                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                  {actionLoading[`delete_${clip.id}`] ? 'Deletando...' : '🗑️ Deletar'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Paginação */}
                      {totalPages > 1 && (
                        <div className="bg-[#2c3135] px-6 py-4 flex items-center justify-between">
                          <button
                            onClick={previousPage}
                            disabled={!hasPrevious}
                            className="bg-[#1c1f22] text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2c3135]"
                          >
                            ← Anterior
                          </button>
                          
                          <div className="flex items-center gap-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => goToPage(pageNum)}
                                  className={`px-3 py-1 rounded text-sm ${
                                    pageNum === currentPage
                                      ? 'bg-[#2884e6] text-white'
                                      : 'bg-[#1c1f22] text-[#a2abb3] hover:bg-[#2c3135]'
                                  }`}
                                >
                                  {pageNum + 1}
                                </button>
                              );
                            })}
                          </div>
                          
                          <button
                            onClick={nextPage}
                            disabled={!hasNext}
                            className="bg-[#1c1f22] text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2c3135]"
                          >
                            Próxima →
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação para Operações em Lote */}
      {showBatchConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1c1f22] rounded-lg p-6 w-full max-w-md border border-[#2c3135]">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Confirmar {showBatchConfirm === 'delete' ? 'Exclusão' : 'Reprocessamento'}
            </h3>
            
            <p className="text-[#a2abb3] mb-6">
              Tem certeza que deseja {showBatchConfirm === 'delete' ? 'deletar' : 'reprocessar'} {getSelectedClipsCount()} clips selecionados?
              {showBatchConfirm === 'delete' && (
                <span className="block mt-2 text-red-400 text-sm">
                  ⚠️ Esta ação não pode ser desfeita!
                </span>
              )}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowBatchConfirm(null)}
                className="flex-1 bg-[#2c3135] text-[#a2abb3] px-4 py-2 rounded-lg hover:bg-[#3c4147] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmBatchOperation}
                disabled={actionLoading[`batch_${showBatchConfirm}`]}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                  showBatchConfirm === 'delete'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-[#2884e6] text-white hover:bg-[#2672cc]'
                }`}
              >
                {actionLoading[`batch_${showBatchConfirm}`] ? 'Processando...' : (
                  showBatchConfirm === 'delete' ? 'Deletar' : 'Reprocessar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 