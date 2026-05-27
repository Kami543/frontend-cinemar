import api from './api';

const FavoritesService = {
  async findMine(page = 1, limit = 20) {
    const { data } = await api.get('/favorites', { params: { page, limit } });
    return data;
  },

  async toggle(filmeId: string): Promise<{ favorited: boolean }> {
    const { data } = await api.post<{ favorited: boolean }>(`/favorites/${filmeId}`);
    return data;
  },
};

export default FavoritesService;