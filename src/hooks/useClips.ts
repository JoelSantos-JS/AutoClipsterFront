import { useState, useEffect, useCallback } from 'react';
import { clipsService } from '../services';
import { ClipData, ClipsResponse, ClipsStats, ClipsFilters, BatchOperationResult } from '../types';

export const useClips = () => {
  // Estados principais
  const [clips, setClips] = useState<ClipData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ClipsStats | null>(null);
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  
  // Estados de filtros e ordenação
  const [sortBy, setSortBy] = useState('downloadDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<ClipsFilters>({});
  
  // Estados para seleção em lote
  const [selectedClips, setSelectedClips] = useState<number[]>([]);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // Função principal para carregar clips
  const fetchClips = useCallback(async (
    page: number = currentPage,
    size: number = pageSize,
    sort: string = sortBy,
    direction: 'asc' | 'desc' = sortDir,
    activeFilters: ClipsFilters = filters
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Carregando clips...', { page, size, sort, direction, activeFilters });
      
      const response: ClipsResponse = await clipsService.getDownloadedClips(
        page, size, sort, direction, activeFilters
      );
      
      setClips(response.clips);
      setCurrentPage(response.currentPage);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
      setHasNext(response.hasNext);
      setHasPrevious(response.hasPrevious);
      
      console.log('✅ Clips carregados:', response.clips.length);
    } catch (err) {
      console.error('❌ Erro ao carregar clips:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar clips');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortBy, sortDir, filters]);

  // Carregar estatísticas
  const fetchStats = useCallback(async () => {
    try {
      console.log('📊 Carregando estatísticas...');
      const statsData = await clipsService.getClipsStats();
      setStats(statsData);
      console.log('✅ Estatísticas carregadas:', statsData);
    } catch (err) {
      console.error('❌ Erro ao carregar estatísticas:', err);
    }
  }, []);

  // Operações individuais
  const reprocessClip = useCallback(async (clipId: number): Promise<boolean> => {
    setActionLoading(prev => ({ ...prev, [`reprocess_${clipId}`]: true }));
    
    try {
      const result = await clipsService.reprocessClip(clipId);
      
      if (result.success) {
        await fetchClips(); // Recarregar lista
        await fetchStats(); // Atualizar estatísticas
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reprocessar clip');
      return false;
    } finally {
      setActionLoading(prev => ({ ...prev, [`reprocess_${clipId}`]: false }));
    }
  }, [fetchClips, fetchStats]);

  const deleteClip = useCallback(async (clipId: number): Promise<boolean> => {
    setActionLoading(prev => ({ ...prev, [`delete_${clipId}`]: true }));
    
    try {
      const result = await clipsService.deleteClip(clipId);
      
      if (result.success) {
        await fetchClips(); // Recarregar lista
        await fetchStats(); // Atualizar estatísticas
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar clip');
      return false;
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${clipId}`]: false }));
    }
  }, [fetchClips, fetchStats]);

  // Operações em lote
  const batchDelete = useCallback(async (clipIds: number[]): Promise<BatchOperationResult | null> => {
    setActionLoading(prev => ({ ...prev, 'batch_delete': true }));
    
    try {
      const result = await clipsService.batchDelete(clipIds);
      
      await fetchClips(); // Recarregar lista
      await fetchStats(); // Atualizar estatísticas
      setSelectedClips([]); // Limpar seleção
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na operação em lote');
      return null;
    } finally {
      setActionLoading(prev => ({ ...prev, 'batch_delete': false }));
    }
  }, [fetchClips, fetchStats]);

  const batchReprocess = useCallback(async (clipIds: number[]): Promise<BatchOperationResult | null> => {
    setActionLoading(prev => ({ ...prev, 'batch_reprocess': true }));
    
    try {
      const result = await clipsService.batchReprocess(clipIds);
      
      await fetchClips(); // Recarregar lista
      await fetchStats(); // Atualizar estatísticas
      setSelectedClips([]); // Limpar seleção
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na operação em lote');
      return null;
    } finally {
      setActionLoading(prev => ({ ...prev, 'batch_reprocess': false }));
    }
  }, [fetchClips, fetchStats]);

  // Paginação
  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    fetchClips(page);
  }, [fetchClips]);

  const nextPage = useCallback(() => {
    if (hasNext) {
      goToPage(currentPage + 1);
    }
  }, [hasNext, currentPage, goToPage]);

  const previousPage = useCallback(() => {
    if (hasPrevious) {
      goToPage(currentPage - 1);
    }
  }, [hasPrevious, currentPage, goToPage]);

  const changePageSize = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0); // Reset para primeira página
    fetchClips(0, newSize);
  }, [fetchClips]);

  // Filtros e ordenação
  const applyFilters = useCallback((newFilters: ClipsFilters) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset para primeira página
    fetchClips(0, pageSize, sortBy, sortDir, newFilters);
  }, [pageSize, sortBy, sortDir, fetchClips]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(0);
    fetchClips(0, pageSize, sortBy, sortDir, {});
  }, [pageSize, sortBy, sortDir, fetchClips]);

  const changeSorting = useCallback((newSortBy: string, newSortDir: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setCurrentPage(0);
    fetchClips(0, pageSize, newSortBy, newSortDir);
  }, [pageSize, fetchClips]);

  // Seleção em lote
  const toggleClipSelection = useCallback((clipId: number) => {
    setSelectedClips(prev => 
      prev.includes(clipId) 
        ? prev.filter(id => id !== clipId)
        : [...prev, clipId]
    );
  }, []);

  const selectAllClips = useCallback(() => {
    setSelectedClips(clips.map(clip => clip.id));
  }, [clips]);

  const clearSelection = useCallback(() => {
    setSelectedClips([]);
  }, []);

  // Funções de conveniência
  const refreshClips = useCallback(() => {
    fetchClips();
    fetchStats();
  }, [fetchClips, fetchStats]);

  const isClipSelected = useCallback((clipId: number) => {
    return selectedClips.includes(clipId);
  }, [selectedClips]);

  const getSelectedClipsCount = useCallback(() => {
    return selectedClips.length;
  }, [selectedClips]);

  // Carregar dados iniciais
  useEffect(() => {
    fetchClips();
    fetchStats();
  }, [fetchClips, fetchStats]);

  return {
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
    sortBy,
    sortDir,
    filters,
    
    // Seleção
    selectedClips,
    actionLoading,
    
    // Operações individuais
    reprocessClip,
    deleteClip,
    
    // Operações em lote
    batchDelete,
    batchReprocess,
    
    // Paginação
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    
    // Filtros
    applyFilters,
    clearFilters,
    changeSorting,
    
    // Seleção
    toggleClipSelection,
    selectAllClips,
    clearSelection,
    isClipSelected,
    getSelectedClipsCount,
    
    // Utilitários
    refreshClips,
    
    // Funções auxiliares do service
    formatDuration: clipsService.formatDuration,
    formatFileSize: clipsService.formatFileSize,
    getStatusColor: clipsService.getStatusColor,
    getStatusText: clipsService.getStatusText
  };
}; 