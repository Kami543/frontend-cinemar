import api from './api';

export interface PlaylistGenre {
  id: string;
  name: string;
}

export interface PlaylistLanguage {
  id: string;
  name: string;
}

export interface HighlightTrack {
  id: string;
  name: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  spotifyId: string;
  spotifyUrl: string;
  embedUrl: string;
  coverImage: string;
  duration: string;
  tracks: number;
  likes: number;
  curator: string;
  relatedFilm: string;
  filmYear: string;
  director: string;
  createdAt: string;
  updatedAt: string;
  theme: string;
  curatorDescription?: string;
  sessaoId?: string;
  genres?: PlaylistGenre[];
  languages?: PlaylistLanguage[];
  highlightTracks?: HighlightTrack[];
}

export interface PaginatedPlaylists {
  data: Playlist[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PlaylistsQuery {
  page?: number;
  limit?: number;
  search?: string;
  theme?: string;
  director?: string;
  sessaoId?: string;
  orderBy?: 'likes' | 'tracks' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface CreatePlaylistPayload {
  title: string;
  description: string;
  spotifyId: string;
  spotifyUrl: string;
  embedUrl: string;
  coverImage?: string;
  duration: string;
  tracks: number;
  curator: string;
  relatedFilm: string;
  filmYear: string;
  director: string;
  theme: string;
  curatorDescription?: string;
  sessaoId?: string;
  genres?: string[];
  languages?: string[];
  highlightTracks?: string[];
}

export interface UpdatePlaylistPayload {
  title?: string;
  description?: string;
  coverImage?: string;
  curator?: string;
  curatorDescription?: string;
  theme?: string;
  likes?: number;
  genres?: string[];
  languages?: string[];
  highlightTracks?: string[];
}

export interface PlaylistStats {
  total: number;
  totalTracks: number;
  totalLikes: number;
  mediaTracks: number;
}

const PlaylistsService = {
  async findAll(query?: PlaylistsQuery): Promise<PaginatedPlaylists> {
    try {
      const cleanParams: Record<string, any> = {};
      if (query) {
        if (query.page) cleanParams.page = query.page;
        if (query.limit) cleanParams.limit = query.limit;
        if (query.search) cleanParams.search = query.search;
        if (query.theme) cleanParams.theme = query.theme;
        if (query.director) cleanParams.director = query.director;
        if (query.sessaoId) cleanParams.sessaoId = query.sessaoId;
        if (query.orderBy) cleanParams.orderBy = query.orderBy;
        if (query.order) cleanParams.order = query.order;
      }
      
      const { data } = await api.get<PaginatedPlaylists>('/playlists', { params: cleanParams });
      
      return {
        data: data.data || [],
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 10,
        totalPages: data.totalPages || 0
      };
    } catch (error) {
      console.error('Erro ao buscar playlists:', error);
      throw error;
    }
  },

  async findById(id: string): Promise<Playlist> {
    const { data } = await api.get<Playlist>(`/playlists/${id}`);
    return data;
  },

  async create(payload: CreatePlaylistPayload): Promise<Playlist> {
    const { data } = await api.post<Playlist>('/playlists', payload);
    return data;
  },

  async update(id: string, payload: UpdatePlaylistPayload): Promise<Playlist> {
    const { data } = await api.patch<Playlist>(`/playlists/${id}`, payload);
    return data;
  },

  async like(id: string): Promise<Playlist> {
    const { data } = await api.post<Playlist>(`/playlists/${id}/like`);
    return data;
  },

  async remove(id: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/playlists/${id}`);
    return data;
  },
};

export default PlaylistsService;