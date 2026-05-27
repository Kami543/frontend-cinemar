// services/eventos.service.ts
import api from './api';

export interface EventoParceiro {
  id: string;
  nome: string;
  eventoId: string;
}

export interface Evento {
  id: string;
  titulo: string;
  data: string;
  dataCompleta: string;
  local: string;
  descricao: string;
  tipo: string;
  status: string;
  importancia: string;
  link?: string;
  imagem?: string;
  contato?: string;
  horario?: string;
  createdAt: string;
  updatedAt: string;
  parceiros?: EventoParceiro[];
  _count?: { participantes: number };
}

export interface PaginatedEventos {
  data: Evento[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventosQuery {
  page?: number;
  limit?: number;
  search?: string;
  tipo?: string;
  status?: string;
  importancia?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export interface CreateEventoPayload {
  titulo: string;
  data: string;
  dataCompleta: string;
  local: string;
  descricao: string;
  tipo: string;
  status: string;
  importancia: string;
  link?: string;
  imagem?: string;
  contato?: string;
  horario?: string;
  parceirosNomes?: string[];
}

export type UpdateEventoPayload = Partial<CreateEventoPayload>;

const EventosService = {
  async findAll(query?: EventosQuery): Promise<PaginatedEventos> {
    const { data } = await api.get<PaginatedEventos>('/eventos', { params: query });
    return data;
  },

  async findById(id: string): Promise<Evento> {
    const { data } = await api.get<Evento>(`/eventos/${id}`);
    return data;
  },

  async create(payload: CreateEventoPayload): Promise<Evento> {
    const { data } = await api.post<Evento>('/eventos', payload);
    return data;
  },

  async update(id: string, payload: UpdateEventoPayload): Promise<Evento> {
    const { data } = await api.patch<Evento>(`/eventos/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/eventos/${id}`);
    return data;
  },

  // Inscrição (requer autenticação)
  async subscribe(id: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>(`/eventos/${id}/subscribe`);
    return data;
  },

  async unsubscribe(id: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/eventos/${id}/subscribe`);
    return data;
  },
};

export default EventosService;