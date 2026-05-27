import EventosService from '../services/eventos.service';
import type {
  Evento,
  EventosQuery,
  CreateEventoPayload,
  UpdateEventoPayload,
} from '../services/eventos.service';
import { useState, useEffect, useCallback } from 'react';

interface State {
  eventos: Evento[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

export function useEventos(initialQuery?: EventosQuery) {
  const [query, setQuery] = useState<EventosQuery>({ page: 1, limit: 50, ...initialQuery });
  const [state, setState] = useState<State>({
    eventos: [], total: 0, isLoading: true, error: null,
  });

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warn' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'warn' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchEventos = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const res = await EventosService.findAll(query);
      setState({ eventos: res.data, total: res.total, isLoading: false, error: null });
    } catch {
      setState((s) => ({ ...s, isLoading: false, error: 'Erro ao carregar eventos.' }));
    }
  }, [query]);

  useEffect(() => { fetchEventos(); }, [fetchEventos]);

  // ── CRUD ────────────────────────────────────────────────────

  const createEvento = useCallback(async (payload: CreateEventoPayload) => {
    try {
      await EventosService.create(payload);
      await fetchEventos();
      showToast('Evento adicionado com sucesso!');
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Erro ao criar evento.', 'error');
      throw err;
    }
  }, [fetchEventos, showToast]);

  const updateEvento = useCallback(async (id: string, payload: UpdateEventoPayload) => {
    try {
      await EventosService.update(id, payload);
      await fetchEventos();
      showToast('Evento atualizado!');
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Erro ao atualizar evento.', 'error');
      throw err;
    }
  }, [fetchEventos, showToast]);

  const removeEvento = useCallback(async (id: string) => {
    try {
      await EventosService.remove(id);
      await fetchEventos();
      showToast('Evento removido.', 'warn');
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Erro ao remover evento.', 'error');
      throw err;
    }
  }, [fetchEventos, showToast]);

  const subscribeEvento = useCallback(async (id: string) => {
    try {
      await EventosService.subscribe(id);
      showToast('Inscrição realizada com sucesso!');
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Erro ao se inscrever.', 'error');
      throw err;
    }
  }, [showToast]);

  return {
    eventos: state.eventos,
    total: state.total,
    isLoading: state.isLoading,
    error: state.error,
    toast,
    query,
    setQuery,
    createEvento,
    updateEvento,
    removeEvento,
    subscribeEvento,
    refetch: fetchEventos,
  };
}