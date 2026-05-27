// hooks/useSessoes.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import SessoesService, {
  type Sessao,
  type Foto,
  type QuerySessaoDto,
  type QueryFotoDto,
  type CreateSessaoPayload,
  type UpdateSessaoPayload,
  type AddFotoPayload,
} from '../services/sessoes.service';

interface State {
  sessoes: Sessao[];
  fotos: Foto[];
  totalSessoes: number;
  totalFotos: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  stats: {
    totalSessoes: number;
    totalFotos: number;
    totalParticipantes: number;
    mediaPorSessao: number;
  } | null;
}

interface UseSessoesOptions {
  initialPage?: number;
  initialLimit?: number;
  autoLoad?: boolean;
}

export function useSessoes(options: UseSessoesOptions = {}) {
  const { initialPage = 1, initialLimit = 12, autoLoad = true } = options;

  // Query state - apenas parâmetros que a API aceita
  const [query, setQuery] = useState<QuerySessaoDto>({
    page: initialPage,
    limit: initialLimit,
    orderBy: 'dataSessao',
    order: 'desc',
  });

  const [state, setState] = useState<State>({
    sessoes: [],
    fotos: [],
    totalSessoes: 0,
    totalFotos: 0,
    currentPage: 1,
    totalPages: 0,
    isLoading: true,
    error: null,
    stats: null,
  });

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warn' } | null>(null);
  
  // Usar ref para evitar chamadas duplicadas
  const isMounted = useRef(true);
  const fetchingRef = useRef(false);

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'warn' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchSessoes = useCallback(async () => {
    // Evita chamadas simultâneas
    if (fetchingRef.current) return;
    
    fetchingRef.current = true;
    setState((s) => ({ ...s, isLoading: true, error: null }));
    
    try {
      // Remove parâmetros undefined da query e NUNCA inclui initialLimit
      const cleanQuery: QuerySessaoDto = {};
      if (query.page !== undefined && query.page !== null) cleanQuery.page = query.page;
      if (query.limit !== undefined && query.limit !== null) cleanQuery.limit = query.limit;
      if (query.search) cleanQuery.search = query.search;
      if (query.diretor) cleanQuery.diretor = query.diretor;
      if (query.ano) cleanQuery.ano = query.ano;
      if (query.orderBy) cleanQuery.orderBy = query.orderBy;
      if (query.order) cleanQuery.order = query.order;
      
      // NUNCA enviar initialLimit ou outras propriedades extras
      // Apenas os campos definidos em QuerySessaoDto
      
      const sessoesRes = await SessoesService.findAll(cleanQuery);
      
      // Verifica se o componente ainda está montado
      if (!isMounted.current) return;
      
      // Calcular estatísticas localmente
      const totalFotos = sessoesRes.data.reduce((acc, sessao) => 
        acc + (sessao.fotos?.length || 0), 0
      );
      
      const totalParticipantes = sessoesRes.data.reduce((acc, sessao) => 
        acc + (sessao.participantes || 0), 0
      );
      
      const mediaPorSessao = sessoesRes.total > 0 ? totalFotos / sessoesRes.total : 0;

      setState({
        sessoes: sessoesRes.data,
        fotos: [],
        totalSessoes: sessoesRes.total,
        totalFotos: totalFotos,
        currentPage: sessoesRes.page,
        totalPages: sessoesRes.totalPages,
        isLoading: false,
        error: null,
        stats: {
          totalSessoes: sessoesRes.total,
          totalFotos: totalFotos,
          totalParticipantes: totalParticipantes,
          mediaPorSessao: Number(mediaPorSessao.toFixed(2)),
        },
      });
    } catch (err: any) {
      if (isMounted.current) {
        const errorMsg = err.response?.data?.message ?? 'Erro ao carregar sessões.';
        setState((s) => ({ ...s, isLoading: false, error: errorMsg }));
        showToast(errorMsg, 'error');
      }
    } finally {
      fetchingRef.current = false;
    }
  }, [query, showToast]);

  // Usar useEffect com dependência estável
  useEffect(() => {
    isMounted.current = true;
    if (autoLoad) {
      fetchSessoes();
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchSessoes, autoLoad]);

  // ── CRUD Sessões ────────────────────────────────────────────────

  const createSessao = useCallback(async (payload: CreateSessaoPayload) => {
    try {
      const newSessao = await SessoesService.create(payload);
      await fetchSessoes();
      showToast(`"${payload.titulo}" adicionada com sucesso!`);
      return newSessao;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao criar sessão.';
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchSessoes, showToast]);

  const updateSessao = useCallback(async (id: string, payload: UpdateSessaoPayload) => {
    try {
      const updatedSessao = await SessoesService.update(id, payload);
      await fetchSessoes();
      showToast(`"${updatedSessao.titulo}" atualizada com sucesso!`);
      return updatedSessao;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao atualizar sessão.';
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchSessoes, showToast]);

  const removeSessao = useCallback(async (id: string) => {
    try {
      await SessoesService.remove(id);
      await fetchSessoes();
      showToast('Sessão removida com sucesso.', 'warn');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao remover sessão.';
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchSessoes, showToast]);

  const confirmarPresenca = useCallback(async (id: string) => {
    try {
      const sessao = state.sessoes.find(s => s.id === id);
      if (sessao) {
        await SessoesService.update(id, {
          participantes: (sessao.participantes || 0) + 1
        });
        await fetchSessoes();
        showToast('Presença confirmada com sucesso!');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao confirmar presença.';
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchSessoes, showToast, state.sessoes]);

  // ── Fotos ───────────────────────────────────────────────────────

  const fetchFotos = useCallback(async (sessaoId: string, fotoQuery?: QueryFotoDto) => {
    try {
      const { data } = await SessoesService.findFotos(sessaoId, fotoQuery);
      setState((s) => ({ ...s, fotos: data }));
      return data;
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Erro ao carregar fotos.', 'error');
      return [];
    }
  }, [showToast]);

  const addFoto = useCallback(async (sessaoId: string, payload: AddFotoPayload) => {
    try {
      const newFoto = await SessoesService.addFoto(sessaoId, payload);
      await fetchSessoes();
      showToast(`"${payload.titulo}" adicionada com sucesso!`);
      return newFoto;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao adicionar foto.';
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchSessoes, showToast]);

  const removeFoto = useCallback(async (sessaoId: string, fotoId: string) => {
    try {
      await SessoesService.removeFoto(sessaoId, fotoId);
      await fetchSessoes();
      showToast('Foto removida com sucesso.', 'warn');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao remover foto.';
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchSessoes, showToast]);

  // ── Filtros e Paginação ─────────────────────────────────────

  const setSearch = useCallback((search: string) => {
    setQuery(prev => ({ ...prev, search: search || undefined, page: 1 }));
  }, []);

  const setDiretor = useCallback((diretor: string) => {
    setQuery(prev => ({ ...prev, diretor: diretor || undefined, page: 1 }));
  }, []);

  const setAno = useCallback((ano: number | undefined) => {
    setQuery(prev => ({ ...prev, ano, page: 1 }));
  }, []);

  const setOrder = useCallback((orderBy: string, order: 'asc' | 'desc') => {
    // Valida se orderBy é um campo válido
    const validOrderBy = ['dataSessao', 'titulo', 'createdAt'];
    const finalOrderBy = validOrderBy.includes(orderBy) ? orderBy : 'dataSessao';
    setQuery(prev => ({ ...prev, orderBy: finalOrderBy as any, order, page: 1 }));
  }, []);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      setQuery(prev => ({ ...prev, page }));
    }
  }, [state.totalPages]);

  const resetFilters = useCallback(() => {
    setQuery({
      page: initialPage,
      limit: initialLimit,
      orderBy: 'dataSessao',
      order: 'desc',
    });
  }, [initialPage, initialLimit]);

  // ── Helpers ─────────────────────────────────────────────────

  const getSessaoById = useCallback((id: string) => {
    return state.sessoes.find(s => s.id === id);
  }, [state.sessoes]);

  const getFotosBySessao = useCallback((sessaoId: string) => {
    const sessao = state.sessoes.find(s => s.id === sessaoId);
    return sessao?.fotos || [];
  }, [state.sessoes]);

  const formatarData = useCallback((dataStr: string) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }, []);

  const getStatus = useCallback((dataStr: string): 'AGENDADA' | 'EM_ANDAMENTO' | 'REALIZADA' => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSessao = new Date(dataStr);
    dataSessao.setHours(0, 0, 0, 0);

    if (dataSessao > hoje) return 'AGENDADA';
    if (dataSessao.toDateString() === hoje.toDateString()) return 'EM_ANDAMENTO';
    return 'REALIZADA';
  }, []);

  // Limitar o limite máximo para evitar sobrecarga
  const setLimit = useCallback((limit: number) => {
    const safeLimit = Math.min(limit, 100);
    setQuery(prev => ({ ...prev, limit: safeLimit, page: 1 }));
  }, []);

  return {
    sessoes: state.sessoes,
    fotos: state.fotos,
    totalSessoes: state.totalSessoes,
    totalFotos: state.totalFotos,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    isLoading: state.isLoading,
    error: state.error,
    stats: state.stats,
    toast,
    query,
    setQuery,
    createSessao,
    updateSessao,
    removeSessao,
    confirmarPresenca,
    fetchFotos,
    addFoto,
    removeFoto,
    setSearch,
    setDiretor,
    setAno,
    setOrder,
    setLimit,
    resetFilters,
    goToPage,
    getSessaoById,
    getFotosBySessao,
    formatarData,
    getStatus,
    refetch: fetchSessoes,
  };
}