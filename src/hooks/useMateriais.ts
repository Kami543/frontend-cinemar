// /src/hooks/useMateriais.ts

import MateriaisService from '../services/materials.service';
import type {
  Sessao,
  Foto,
  SessoesQuery,
  CreateSessaoPayload,
  UpdateSessaoPayload,
  CreateFotoPayload,
  UpdateFotoPayload,
} from '../services/materials.service';


interface State {
  sessoes: Sessao[];
  fotos: Foto[];
  totalSessoes: number;
  totalFotos: number;
  isLoading: boolean;
  error: string | null;
}

export function useMateriais(initialQuery?: SessoesQuery) {
  const [query, setQuery] = useState<SessoesQuery>({
    page: 1,
    limit: 50,
    orderBy: 'dataSessao',
    order: 'desc',
    ...initialQuery,
  });

  const [state, setState] = useState<State>({
    sessoes: [],
    fotos: [],
    totalSessoes: 0,
    totalFotos: 0,
    isLoading: true,
    error: null,
  });

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warn' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'warn' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchSessoes = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const [sessoesRes, statsRes] = await Promise.all([
        MateriaisService.findAllSessoes(query),
        MateriaisService.getStats(),
      ]);
      
      setState({
        sessoes: sessoesRes.data,
        fotos: [],
        totalSessoes: sessoesRes.total,
        totalFotos: statsRes.totalFotos,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao carregar materiais.';
      setState((s) => ({ ...s, isLoading: false, error: errorMsg }));
      showToast(errorMsg, 'error');
    }
  }, [query, showToast]);

  useEffect(() => {
    fetchSessoes();
  }, [fetchSessoes]);

  // ── CRUD Sessões ────────────────────────────────────────────────

  const createSessao = useCallback(async (payload: CreateSessaoPayload) => {
    try {
      await MateriaisService.createSessao(payload);
      await fetchSessoes();
      showToast('Sessão adicionada com sucesso!');
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Erro ao criar sessão.', 'error');
      throw err;
    }
  }, [fetchSessoes, showToast]);

  const updateSessao = useCallback(async (id: string, payload: UpdateSessaoPayload) => {
    try {
      await MateriaisService.updateSessao(id, payload);
      await fetchSessoes();
      showToast('Sessão atualizada!');
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Erro ao atualizar sessão.', 'error');
      throw err;
    }
  }, [fetchSessoes, showToast]);

  const removeSessao = useCallback(async (id: string) => {
    try {
      await MateriaisService.removeSessao(id);
      await fetchSessoes();
      showToast('Sessão removida.', 'warn');
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Erro ao remover sessão.', 'error');
      throw err;
    }
  }, [fetchSessoes, showToast]);

  // ── Participantes ───────────────────────────────────────────────

  const addParticipante = useCallback(async (sessaoId: string) => {
    try {
      const result = await MateriaisService.addParticipante(sessaoId);
      await fetchSessoes();
      showToast(result.message);
      return result;
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Erro ao adicionar participante.', 'error');
      throw err;
    }
  }, [fetchSessoes, showToast]);

  const removeParticipante = useCallback(async (sessaoId: string) => {
    try {
      const result = await MateriaisService.removeParticipante(sessaoId);
      await fetchSessoes();
      showToast(result.message, 'warn');
      return result;
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Erro ao remover participante.', 'error');
      throw err;
    }
  }, [fetchSessoes, showToast]);

  // ── Fotos ───────────────────────────────────────────────────────

  const createFoto = useCallback(async (payload: CreateFotoPayload) => {
    try {
      const newFoto = await MateriaisService.createFoto(payload);
      await fetchSessoes();
      showToast('Foto adicionada com sucesso!');
      return newFoto;
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Erro ao adicionar foto.', 'error');
      throw err;
    }
  }, [fetchSessoes, showToast]);

  const updateFoto = useCallback(async (id: string, payload: UpdateFotoPayload) => {
    try {
      await MateriaisService.updateFoto(id, payload);
      await fetchSessoes();
      showToast('Foto atualizada!');
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Erro ao atualizar foto.', 'error');
      throw err;
    }
  }, [fetchSessoes, showToast]);

  const removeFoto = useCallback(async (id: string) => {
    try {
      await MateriaisService.removeFoto(id);
      await fetchSessoes();
      showToast('Foto removida.', 'warn');
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Erro ao remover foto.', 'error');
      throw err;
    }
  }, [fetchSessoes, showToast]);

  const uploadFotos = useCallback(async (
    sessaoId: string,
    files: File[],
    dados: Omit<CreateFotoPayload, 'sessaoId' | 'arquivo'>[]
  ) => {
    try {
      const fotos = await MateriaisService.uploadFotos(sessaoId, files, dados);
      await fetchSessoes();
      showToast(`${fotos.length} foto(s) enviada(s) com sucesso!`);
      return fotos;
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Erro ao enviar fotos.', 'error');
      throw err;
    }
  }, [fetchSessoes, showToast]);

  // ── Helpers ─────────────────────────────────────────────────────

  const getSessaoById = useCallback((id: string) => {
    return state.sessoes.find(s => s.id === id);
  }, [state.sessoes]);

  const getFotosBySessao = useCallback((sessaoId: string) => {
    const sessao = state.sessoes.find(s => s.id === sessaoId);
    return sessao?.fotos || [];
  }, [state.sessoes]);

  return {
    // Dados
    sessoes: state.sessoes,
    totalSessoes: state.totalSessoes,
    totalFotos: state.totalFotos,
    isLoading: state.isLoading,
    error: state.error,
    toast,
    
    // Query
    query,
    setQuery,
    
    // CRUD Sessões
    createSessao,
    updateSessao,
    removeSessao,
    
    // Participantes
    addParticipante,
    removeParticipante,
    
    // CRUD Fotos
    createFoto,
    updateFoto,
    removeFoto,
    uploadFotos,
    
    // Helpers
    getSessaoById,
    getFotosBySessao,
    
    // Refetch
    refetch: fetchSessoes,
  };
}