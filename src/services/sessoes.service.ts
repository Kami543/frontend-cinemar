// services/sessoes.service.ts
import api from './api';

// ── Types baseados no controller ──────────────────────────────────────

export interface Sessao {
  id: string;
  titulo: string;
  diretor: string;
  ano: number;
  dataSessao: string;  // ← nota: é dataSessao, não data
  participantes: number;
  descricao: string;
  createdAt: string;
  updatedAt: string;
  fotos?: Foto[];
  _count?: {
    fotos: number;
  };
}

export interface Foto {
  id: string;
  url: string;
  titulo: string;
  descricao: string;
  data: string;
  categoria: string;
  tipo: string;
  driveLink?: string;
  sessaoId: string;
  createdAt: string;
}

export interface PaginatedSessoes {
  data: Sessao[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedFotos {
  data: Foto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── DTOs para queries ─────────────────────────────────────────────────

export interface QuerySessaoDto {
  page?: number;
  limit?: number;
  search?: string;
  diretor?: string;
  ano?: number;
  orderBy?: 'dataSessao' | 'titulo' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface QueryFotoDto {
  page?: number;
  limit?: number;
  categoria?: string;
  tipo?: string;
}

// ── Payloads para criação/atualização ────────────────────────────────

export interface CreateSessaoPayload {
  titulo: string;
  diretor: string;
  ano: number;
  dataSessao: string;
  descricao: string;
  participantes?: number;
}

export type UpdateSessaoPayload = Partial<CreateSessaoPayload>;

export interface AddFotoPayload {
  url: string;
  titulo: string;
  descricao: string;
  data: string;
  categoria: string;
  tipo: string;
  driveLink?: string;
}

export interface UpdateFotoPayload {
  titulo?: string;
  descricao?: string;
  categoria?: string;
  tipo?: string;
  driveLink?: string;
}

// ── Service ────────────────────────────────────────────────────

const SessoesService = {
  // ── Sessões CRUD ──────────────────────────────────────────────

  async findAll(query?: QuerySessaoDto): Promise<PaginatedSessoes> {
    const { data } = await api.get<PaginatedSessoes>('/sessoes', { params: query });
    return data;
  },

  async findById(id: string): Promise<Sessao> {
    const { data } = await api.get<Sessao>(`/sessoes/${id}`);
    return data;
  },

  async create(payload: CreateSessaoPayload): Promise<Sessao> {
    const { data } = await api.post<Sessao>('/sessoes', payload);
    return data;
  },

  async update(id: string, payload: UpdateSessaoPayload): Promise<Sessao> {
    const { data } = await api.patch<Sessao>(`/sessoes/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/sessoes/${id}`);
    return data;
  },

  // ── Fotos ─────────────────────────────────────────────────────

  async findFotos(sessaoId: string, query?: QueryFotoDto): Promise<PaginatedFotos> {
    const { data } = await api.get<PaginatedFotos>(`/sessoes/${sessaoId}/fotos`, { params: query });
    return data;
  },

  async addFoto(sessaoId: string, payload: AddFotoPayload): Promise<Foto> {
    const { data } = await api.post<Foto>(`/sessoes/${sessaoId}/fotos`, payload);
    return data;
  },

  async removeFoto(sessaoId: string, fotoId: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/sessoes/${sessaoId}/fotos/${fotoId}`);
    return data;
  },

  // ── Upload de arquivo (endpoint adicional - pode ser necessário) ──

  async uploadFoto(sessaoId: string, file: File, dados: Omit<AddFotoPayload, 'url'>): Promise<Foto> {
    const formData = new FormData();
    formData.append('foto', file);
    formData.append('titulo', dados.titulo);
    formData.append('descricao', dados.descricao);
    formData.append('data', dados.data);
    formData.append('categoria', dados.categoria);
    formData.append('tipo', dados.tipo);
    if (dados.driveLink) formData.append('driveLink', dados.driveLink);

    const { data } = await api.post<Foto>(`/sessoes/${sessaoId}/fotos/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // ── Estatísticas ───────────────────────────────────────────────

  async getStats(): Promise<{
    totalSessoes: number;
    totalFotos: number;
    totalParticipantes: number;
    mediaPorSessao: number;
  }> {
    const { data } = await api.get('/sessoes/stats');
    return data;
  },
};

export default SessoesService;