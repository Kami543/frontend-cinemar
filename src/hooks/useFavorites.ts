import { useState, useEffect, useCallback } from 'react';
import FavoritesService from '../services/favorites.service';
import { useAuth } from './useAuth';

export function useFavorites() {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Carrega favoritos do usuário autenticado
  useEffect(() => {
    if (!isAuthenticated) { setFavoriteIds(new Set()); return; }

    setIsLoading(true);
    FavoritesService.findMine(1, 200)
      .then((res) => {
        setFavoriteIds(new Set(res.data.map((f: any) => f.filmeId as string)));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  const toggle = useCallback(async (filmeId: string) => {
    if (!isAuthenticated) return;

    // Optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.has(filmeId) ? next.delete(filmeId) : next.add(filmeId);
      return next;
    });

    try {
      await FavoritesService.toggle(filmeId);
    } catch {
      // Reverte se falhou
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        next.has(filmeId) ? next.delete(filmeId) : next.add(filmeId);
        return next;
      });
    }
  }, [isAuthenticated]);

  const isFavorited = useCallback((filmeId: string) => favoriteIds.has(filmeId), [favoriteIds]);

  return { favoriteIds, isFavorited, toggle, isLoading };
}