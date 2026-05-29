// frontend/src/hooks/useMembers.ts
import { useState, useEffect, useCallback } from 'react';
import MembersService from '../services/members.service';
import type { 
  Member, 
  MembersQuery, 
  CreateMemberPayload,
  UpdateMemberPayload
} from '../services/members.service';
import { getImageUrl, getPlaceholderImage } from '../utils/imageUtils';

// Função para processar URL da foto do membro
const processMemberPhoto = (member: Member): Member => {
  try {
    return {
      ...member,
      foto: member.foto ? getImageUrl(member.foto) : getPlaceholderImage(),
    };
  } catch (err) {
    console.error(`Erro ao processar foto do membro ${member.id}:`, err);
    return {
      ...member,
      foto: getPlaceholderImage(),
    };
  }
};

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
    setTimeout(() => setToast(null), 5000);
  }, []);

  const calculateStats = useCallback((members: Member[]) => {
    const destaques = members.filter(m => m.destaque).length;
    const porTipo: Record<string, number> = {};
    
    members.forEach(member => {
      const tipo = member.tipo || 'outro';
      porTipo[tipo] = (porTipo[tipo] || 0) + 1;
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
      
      // Processar fotos de cada membro com tratamento de erro
      const processedMembers = membersData.map(member => {
        try {
          return processMemberPhoto(member);
        } catch (err) {
          console.error(`Erro ao processar membro ${member.id}:`, err);
          return {
            ...member,
            foto: getPlaceholderImage(),
          };
        }
      });
      
      const stats = calculateStats(processedMembers);
      
      setState({
        members: processedMembers,
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
      
      let errorMsg = 'Erro ao carregar membros.';
      
      if (err.response?.status === 400) {
        errorMsg = 'Erro na requisição. Por favor, recarregue a página.';
      } else if (err.response?.status === 404) {
        errorMsg = 'Nenhum membro encontrado.';
      } else if (err.response?.status === 500) {
        errorMsg = 'Erro no servidor. Tente novamente mais tarde.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
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
      showToast(`"${payload.nome}" adicionado com sucesso!`, 'success');
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
      showToast(`Membro "${updatedMember.nome}" atualizado com sucesso!`, 'success');
      return updatedMember;
    } catch (err: any) {
      let errorMsg = 'Erro ao atualizar membro.';
      
      if (err.response?.status === 404) {
        errorMsg = 'Membro não encontrado.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchMembers, showToast]);

  const uploadFoto = useCallback(async (id: string, file: File) => {
    try {
      console.log('📸 Iniciando upload da foto para membro:', id);
      console.log('📁 Arquivo:', file.name, file.size, file.type);
      
      const updatedMember = await MembersService.uploadFoto(id, file);
      
      console.log('✅ Upload concluído! Membro retornado:', updatedMember);
      
      // Processar a URL da foto
      const processedMember = processMemberPhoto(updatedMember);
      console.log('🖼️ URL da foto processada:', processedMember.foto);
      
      // ATUALIZA O ESTADO LOCAL IMEDIATAMENTE
      setState(prevState => {
        const updatedMembers = prevState.members.map(member => 
          member.id === id ? processedMember : member
        );
        
        const newStats = calculateStats(updatedMembers);
        
        return {
          ...prevState,
          members: updatedMembers,
          stats: newStats,
        };
      });
      
      showToast(`Foto atualizada com sucesso!`, 'success');
      return processedMember;
    } catch (err: any) {
      console.error('❌ Erro no upload da foto:', err);
      
      let errorMsg = 'Erro ao fazer upload da foto.';
      
      if (err.response?.status === 400) {
        errorMsg = 'Formato de arquivo inválido ou arquivo muito grande.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [calculateStats, showToast]);

  const removeMember = useCallback(async (id: string) => {
    try {
      await MembersService.remove(id);
      await fetchMembers(true);
      showToast('Membro removido com sucesso.', 'warn');
    } catch (err: any) {
      let errorMsg = 'Erro ao remover membro.';
      
      if (err.response?.status === 404) {
        errorMsg = 'Membro não encontrado.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
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
    console.log('🔄 Forçando refresh da lista de membros...');
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