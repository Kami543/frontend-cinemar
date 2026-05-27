// hooks/useFilmes.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import FilmesService from '../services/filmes.service';
import type {
  Filme,
  CreateFilmePayload,
  UpdateFilmePayload,
  FilmesQuery
} from '../services/filmes.service';
import { getImageUrl } from '../utils/imageUtils';

// Converte data "29 de Março, 2025" ou "2025-03-29" → Date
const MONTHS: Record<string, number> = {
  janeiro: 0, fevereiro: 1, março: 2, abril: 3, maio: 4, junho: 5,
  julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11,
};

export function parseFilmeDate(dateStr: string): Date {
  if (!dateStr) return new Date(0);
  
  // Formato ISO: 2025-03-29
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
    return new Date(dateStr);
  }
  
  // Formato brasileiro: 29 de Março, 2025
  try {
    const year = parseInt(dateStr.match(/\d{4}/)?.[0] ?? '');
    const lower = dateStr.toLowerCase();
    const month = Object.entries(MONTHS).find(([name]) => lower.includes(name))?.[1] ?? 0;
    const day = parseInt(dateStr.replace(/\d{4}/, '').match(/\d+/)?.[0] ?? '1');
    return new Date(year, month, day);
  } catch {
    return new Date(0);
  }
}

export interface FilmeComStatus extends Filme {
  status: 'Realizado' | 'Próximo';
  highlight: boolean;
  views?: number;
}

// Função para processar URLs das imagens
const processFilmeImages = (filme: Filme): FilmeComStatus => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const filmeDate = parseFilmeDate(filme.date);
  filmeDate.setHours(0, 0, 0, 0);
  
  const status: 'Realizado' | 'Próximo' = filmeDate < today ? 'Realizado' : 'Próximo';
  
  const thirtyDays = new Date(today);
  thirtyDays.setDate(today.getDate() + 30);
  const highlight = filmeDate >= today && filmeDate <= thirtyDays;
  
  const views = status === 'Realizado'
    ? Math.floor(Math.random() * (5000 - 800 + 1)) + 800
    : Math.floor(Math.random() * 201);
  
  return {
    ...filme,
    imageUrl: getImageUrl(filme.imageUrl),
    filmesFotos: filme.filmesFotos?.map(foto => ({
      ...foto,
      path: getImageUrl(foto.path),
    })) || [],
    status,
    highlight,
    views
  };
};

interface UseFilmesState {
  filmes: FilmeComStatus[];
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  isRefreshing: boolean;
}

export function useFilmes(initialQuery?: FilmesQuery) {
  const [query, setQuery] = useState<FilmesQuery>({
    page: 1,
    limit: 12,
    ...initialQuery
  });

  const [state, setState] = useState<UseFilmesState>({
    filmes: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
    isLoading: true,
    error: null,
    isRefreshing: false,
  });

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warn' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'warn' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchFilmes = useCallback(async (refresh = false) => {
    if (refresh) {
      setState((s) => ({ ...s, isRefreshing: true }));
    } else {
      setState((s) => ({ ...s, isLoading: true }));
    }

    setState((s) => ({ ...s, error: null }));

    try {
      const cleanQuery: FilmesQuery = {};
      if (query.page) cleanQuery.page = query.page;
      if (query.limit) cleanQuery.limit = query.limit;
      if (query.search && query.search.trim()) cleanQuery.search = query.search.trim();
      if (query.genre && query.genre.trim()) cleanQuery.genre = query.genre.trim();
      if (query.director && query.director.trim()) cleanQuery.director = query.director.trim();
      if (query.year) cleanQuery.year = query.year;
      if (query.language && query.language.trim()) cleanQuery.language = query.language.trim();

      const res = await FilmesService.findAll(cleanQuery);

      const filmesData = Array.isArray(res.data) ? res.data : [];
      const filmesProcessados = filmesData.map(processFilmeImages);

      setState({
        filmes: filmesProcessados,
        total: res.total || filmesData.length,
        totalPages: res.totalPages || 1,
        currentPage: res.page || query.page || 1,
        isLoading: false,
        error: null,
        isRefreshing: false,
      });
    } catch (err: any) {
      console.error('Erro ao buscar filmes:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao carregar filmes.';
      setState((s) => ({
        ...s,
        isLoading: false,
        isRefreshing: false,
        error: errorMsg
      }));
      showToast(errorMsg, 'error');
    }
  }, [query, showToast]);

  useEffect(() => {
    fetchFilmes();
  }, [fetchFilmes]);

  const filmesOrdenados = useMemo(() => {
    return [...state.filmes].sort((a, b) => {
      if (a.status === 'Próximo' && b.status === 'Realizado') return -1;
      if (a.status === 'Realizado' && b.status === 'Próximo') return 1;

      const dA = parseFilmeDate(a.date).getTime();
      const dB = parseFilmeDate(b.date).getTime();

      if (a.status === 'Realizado') {
        return dB - dA;
      } else {
        return dA - dB;
      }
    });
  }, [state.filmes]);

  const stats = useMemo(() => {
    const realizados = filmesOrdenados.filter(f => f.status === 'Realizado').length;
    const proximos = filmesOrdenados.filter(f => f.status === 'Próximo').length;
    const destaques = filmesOrdenados.filter(f => f.highlight).length;
    return { realizados, proximos, destaques, total: filmesOrdenados.length };
  }, [filmesOrdenados]);

  const createFilme = useCallback(async (payload: CreateFilmePayload, files?: File[]) => {
    try {
      const newFilme = await FilmesService.create(payload, files);
      await fetchFilmes(true);
      showToast(`"${payload.title}" adicionado com sucesso!`);
      return newFilme;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao criar filme.';
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchFilmes, showToast]);

  const updateFilme = useCallback(async (id: string, payload: UpdateFilmePayload, files?: File[]) => {
    try {
      const updatedFilme = await FilmesService.update(id, payload, files);
      await fetchFilmes(true);
      showToast(`Filme "${updatedFilme.title}" atualizado com sucesso!`);
      return updatedFilme;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao atualizar filme.';
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchFilmes, showToast]);

  const removeFilme = useCallback(async (id: string) => {
    try {
      await FilmesService.remove(id);
      await fetchFilmes(true);
      showToast('Filme removido com sucesso.', 'warn');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao remover filme.';
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchFilmes, showToast]);

  const setSearch = useCallback((search: string) => {
    setQuery(prev => ({ ...prev, search: search || undefined, page: 1 }));
  }, []);

  const setGenre = useCallback((genre: string) => {
    setQuery(prev => ({ ...prev, genre: genre || undefined, page: 1 }));
  }, []);

  const setDirector = useCallback((director: string) => {
    setQuery(prev => ({ ...prev, director: director || undefined, page: 1 }));
  }, []);

  const setYear = useCallback((year: number | undefined) => {
    setQuery(prev => ({ ...prev, year, page: 1 }));
  }, []);

  const setLanguage = useCallback((language: string) => {
    setQuery(prev => ({ ...prev, language: language || undefined, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setQuery(prev => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setQuery(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setQuery({ page: 1, limit: 12 });
  }, []);

  const refetch = useCallback(() => {
    return fetchFilmes(true);
  }, [fetchFilmes]);

  return {
    filmes: filmesOrdenados,
    filmesRaw: state.filmes,
    total: state.total,
    totalPages: state.totalPages,
    currentPage: state.currentPage,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    toast,
    stats,
    query,
    setQuery,
    setSearch,
    setGenre,
    setDirector,
    setYear,
    setLanguage,
    setPage,
    setLimit,
    resetFilters,
    createFilme,
    updateFilme,
    removeFilme,
    refetch,
    showToast,
  };
}

export type { CreateFilmePayload, UpdateFilmePayload, FilmesQuery } from '../services/filmes.service';