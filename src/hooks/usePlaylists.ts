import { useState, useEffect, useCallback } from 'react';
import PlaylistsService, { 
  type Playlist, 
  type  PlaylistsQuery, 
  type CreatePlaylistPayload,
  type UpdatePlaylistPayload,
  type PlaylistStats
} from '../services/playlists.service';

interface UsePlaylistsState {
  playlists: Playlist[];
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  isRefreshing: boolean;
  stats: PlaylistStats | null;
}

export function usePlaylists(initialQuery?: PlaylistsQuery) {
  const [query, setQuery] = useState<PlaylistsQuery>({
    page: 1,
    limit: 12,
    orderBy: 'createdAt',
    order: 'desc',
    ...initialQuery
  });

  const [state, setState] = useState<UsePlaylistsState>({
    playlists: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
    isLoading: true,
    error: null,
    isRefreshing: false,
    stats: null,
  });

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warn' } | null>(null);
  const [likedPlaylists, setLikedPlaylists] = useState<Set<string>>(new Set());

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'warn' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    const storedLikes = localStorage.getItem('cinemar_playlist_likes');
    if (storedLikes) {
      try {
        setLikedPlaylists(new Set(JSON.parse(storedLikes)));
      } catch (e) {
        console.error('Erro ao carregar likes:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cinemar_playlist_likes', JSON.stringify(Array.from(likedPlaylists)));
  }, [likedPlaylists]);

  const fetchPlaylists = useCallback(async (refresh = false) => {
    if (refresh) {
      setState((s) => ({ ...s, isRefreshing: true }));
    } else {
      setState((s) => ({ ...s, isLoading: true }));
    }

    setState((s) => ({ ...s, error: null }));

    try {
      // Removemos a chamada ao stats que está causando erro
      const playlistsRes = await PlaylistsService.findAll(query);
      
      // Calcular stats localmente
      const totalTracks = playlistsRes.data.reduce((acc, p) => acc + (p.tracks || 0), 0);
      const totalLikes = playlistsRes.data.reduce((acc, p) => acc + (p.likes || 0), 0);
      const mediaTracks = playlistsRes.data.length > 0 ? Math.round(totalTracks / playlistsRes.data.length) : 0;

      setState({
        playlists: playlistsRes.data || [],
        total: playlistsRes.total || 0,
        totalPages: playlistsRes.totalPages || 1,
        currentPage: playlistsRes.page || query.page || 1,
        isLoading: false,
        error: null,
        isRefreshing: false,
        stats: {
          total: playlistsRes.total || 0,
          totalTracks,
          totalLikes,
          mediaTracks,
        },
      });
    } catch (err: any) {
      console.error('Erro ao buscar playlists:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao carregar playlists.';
      setState((s) => ({
        ...s,
        isLoading: false,
        isRefreshing: false,
        error: errorMsg,
        playlists: [],
        total: 0,
        totalPages: 0,
      }));
      showToast(errorMsg, 'error');
    }
  }, [query, showToast]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const createPlaylist = useCallback(async (payload: CreatePlaylistPayload) => {
    try {
      const newPlaylist = await PlaylistsService.create(payload);
      await fetchPlaylists(true);
      showToast(`"${payload.title}" adicionada com sucesso!`);
      return newPlaylist;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao criar playlist.';
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchPlaylists, showToast]);

  const updatePlaylist = useCallback(async (id: string, payload: UpdatePlaylistPayload) => {
    try {
      const updatedPlaylist = await PlaylistsService.update(id, payload);
      await fetchPlaylists(true);
      showToast(`Playlist "${updatedPlaylist.title}" atualizada com sucesso!`);
      return updatedPlaylist;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao atualizar playlist.';
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchPlaylists, showToast]);

  const toggleLike = useCallback(async (id: string) => {
    if (likedPlaylists.has(id)) return;
    
    try {
      setLikedPlaylists(prev => new Set([...prev, id]));
      const updatedPlaylist = await PlaylistsService.like(id);
      
      setState((s) => ({
        ...s,
        playlists: s.playlists.map(p => 
          p.id === id ? { ...p, likes: updatedPlaylist.likes } : p
        ),
        stats: s.stats ? {
          ...s.stats,
          totalLikes: (s.stats.totalLikes || 0) + 1,
        } : s.stats,
      }));
      
      showToast('Playlist curtida com sucesso!', 'success');
    } catch (err: any) {
      setLikedPlaylists(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      const errorMsg = err.response?.data?.message ?? 'Erro ao curtir playlist.';
      showToast(errorMsg, 'error');
    }
  }, [likedPlaylists, showToast]);

  const isLiked = useCallback((id: string) => {
    return likedPlaylists.has(id);
  }, [likedPlaylists]);

  const removePlaylist = useCallback(async (id: string) => {
    try {
      await PlaylistsService.remove(id);
      await fetchPlaylists(true);
      showToast('Playlist removida com sucesso.', 'warn');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Erro ao remover playlist.';
      showToast(errorMsg, 'error');
      throw err;
    }
  }, [fetchPlaylists, showToast]);

  const setSearch = useCallback((search: string) => {
    setQuery(prev => ({ ...prev, search: search || undefined, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setQuery({
      page: 1,
      limit: 12,
      orderBy: 'createdAt',
      order: 'desc',
    });
  }, []);

  const refetch = useCallback(() => {
    return fetchPlaylists(true);
  }, [fetchPlaylists]);

  return {
    playlists: state.playlists,
    total: state.total,
    totalPages: state.totalPages,
    currentPage: state.currentPage,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    stats: state.stats,
    toast,
    likedPlaylists,
    toggleLike,
    isLiked,
    createPlaylist,
    updatePlaylist,
    removePlaylist,
    setSearch,
    resetFilters,
    refetch,
    showToast,
  };
}