import { useState, useEffect, useCallback } from 'react';
import MembersService from '../services/members.service';
import type { 
  Member, 
  MembersQuery, 
  CreateMemberPayload,
  UpdateMemberPayload
} from '../services/members.service';

interface UseMembersState {
  members: Member[];
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  isRefreshing: boolean;
  stats: {
    total: number;
    destaques: number;
    porTipo: Record<string, number>;
  } | null;
}

export function useMembers(initialQuery?: MembersQuery) {
  const [query, setQuery] = useState<MembersQuery>({
    page: 1,
    limit: 100,
    orderBy: 'nome',
    order: 'asc',
    ...initialQuery
  });

  const [state, setState] = useState<UseMembersState>({
    members: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
    isLoading: true,
    error: null,
    isRefreshing: false,
    stats: null,
  });

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warn' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'warn' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const calculateStats = useCallback((members: Member[]) => {
    const destaques = members.filter(m => m.destaque).length;
    const porTipo: Record<string, number> = {};
    
    members.forEach(member => {
      porTipo[member.tipo] = (porTipo[member.tipo] || 0) + 1;
    });
    
    return {
      total: members.length,
      destaques,
      porTipo,
    };
  }, []);

  const fetchMembers = useCallback(async (refresh = false) => {
    if (refresh) {
      setState((s) => ({ ...s, isRefreshing: true }));
    } else {
      setState((s) => ({ ...s, isLoading: true }));
    }

    setState((s) => ({ ...s, error: null }));

    try {
      const membersRes = await MembersService.findAll(query);
      
      const membersData = membersRes.data || [];
      const stats = calculateStats(membersData);
      
      setState({
        members: membersData,
        total: membersRes.total || 0,
        totalPages: membersRes.totalPages || 1,
        currentPage: membersRes.page || query.page || 1,
        isLoading: false,
        error: null,
        isRefreshing: false,
        stats: stats,
      });
    } catch (err: any) {
      console.error('Erro ao buscar membros:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao carregar membros.';
      setState((s) => ({
        ...s,
        isLoading: false,
        isRefreshing: false,
        error: errorMsg,
        members: [],
        total: 0,
        totalPages: 0,
        stats: null,
      }));
      showToast(errorMsg, 'error');
    }
  }, [query, calculateStats, showToast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const createMember = useCallback(async (payload: CreateMemberPayload, files?: File[]) => {
    try {
      const newMember = await MembersService.create(payload, files);
      await fetchMembers(true);
      showToast(`"${payload.nome}" adicionado com sucesso!`);
      return newMember;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao criar membro.';
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchMembers, showToast]);

  const updateMember = useCallback(async (id: string, payload: UpdateMemberPayload, files?: File[]) => {
    try {
      const updatedMember = await MembersService.update(id, payload, files);
      await fetchMembers(true);
      showToast(`Membro "${updatedMember.nome}" atualizado com sucesso!`);
      return updatedMember;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao atualizar membro.';
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchMembers, showToast]);

  const uploadFoto = useCallback(async (id: string, file: File) => {
    try {
      const updatedMember = await MembersService.uploadFoto(id, file);
      await fetchMembers(true);
      showToast(`Foto atualizada com sucesso!`);
      return updatedMember;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao fazer upload da foto.';
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchMembers, showToast]);

  const removeMember = useCallback(async (id: string) => {
    try {
      await MembersService.remove(id);
      await fetchMembers(true);
      showToast('Membro removido com sucesso.', 'warn');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao remover membro.';
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchMembers, showToast]);

  const setSearch = useCallback((search: string) => {
    setQuery(prev => ({ ...prev, search: search || undefined, page: 1 }));
  }, []);

  const setTipo = useCallback((tipo: string) => {
    setQuery(prev => ({ ...prev, tipo: tipo || undefined, page: 1 }));
  }, []);

  const setDestaque = useCallback((destaque: boolean | undefined) => {
    setQuery(prev => ({ ...prev, destaque, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setQuery(prev => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setQuery(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setQuery({
      page: 1,
      limit: 100,
      orderBy: 'nome',
      order: 'asc',
    });
  }, []);

  const refetch = useCallback(() => {
    return fetchMembers(true);
  }, [fetchMembers]);

  return {
    members: state.members,
    total: state.total,
    totalPages: state.totalPages,
    currentPage: state.currentPage,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    stats: state.stats,
    toast,

    query,
    setQuery,
    setSearch,
    setTipo,
    setDestaque,
    setPage,
    setLimit,
    resetFilters,

    createMember,
    updateMember,
    uploadFoto,
    removeMember,

    refetch,
    showToast,
  };
}