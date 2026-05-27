// services/materiais.service.ts
import api from './api';

// ── Types baseados no schema ──────────────────────────────────────

export interface Sessao {
  id: string;
  titulo: string;
  diretor: string;
  ano: number;
  dataSessao: string;
  participantes: number;
  descricao: string;
  createdAt: string;
  updatedAt: string;
  fotos?: Foto[];
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
  sessao?: Sessao;
  createdAt: string;
}

export interface PaginatedSessoes {
  data: Sessao[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SessoesQuery {
  page?: number;
  limit?: number;
  search?: string;
  diretor?: string;
  ano?: number;
  orderBy?: 'dataSessao' | 'titulo' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface CreateSessaoPayload {
  titulo: string;
  diretor: string;
  ano: number;
  dataSessao: string;
  descricao: string;
  participantes?: number;
}

export type UpdateSessaoPayload = Partial<CreateSessaoPayload>;

export interface CreateFotoPayload {
  sessaoId: string;
  url: string;
  titulo: string;
  descricao: string;
  data: string;
  categoria: string;
  tipo: string;
  driveLink?: string;
  arquivo?: File; // Para upload de arquivo local
}

export interface UpdateFotoPayload {
  titulo?: string;
  descricao?: string;
  categoria?: string;
  tipo?: string;
  driveLink?: string;
}

// ── Service ────────────────────────────────────────────────────

const MateriaisService = {
  // ── Sessões (Debates) ──────────────────────────────────────────

  async findAllSessoes(query?: SessoesQuery): Promise<PaginatedSessoes> {
    const { data } = await api.get<PaginatedSessoes>('/sessoes', { params: query });
    return data;
  },

  async findSessaoById(id: string): Promise<Sessao> {
    const { data } = await api.get<Sessao>(`/sessoes/${id}`);
    return data;
  },

  async createSessao(payload: CreateSessaoPayload): Promise<Sessao> {
    const { data } = await api.post<Sessao>('/sessoes', payload);
    return data;
  },

  async updateSessao(id: string, payload: UpdateSessaoPayload): Promise<Sessao> {
    const { data } = await api.patch<Sessao>(`/sessoes/${id}`, payload);
    return data;
  },

  async removeSessao(id: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/sessoes/${id}`);
    return data;
  },

  async addParticipante(sessaoId: string): Promise<{ message: string; participantes: number }> {
    const { data } = await api.post(`/sessoes/${sessaoId}/participantes`);
    return data;
  },

  async removeParticipante(sessaoId: string): Promise<{ message: string; participantes: number }> {
    const { data } = await api.delete(`/sessoes/${sessaoId}/participantes`);
    return data;
  },

  // ── Fotos ──────────────────────────────────────────────────────

  async findAllFotos(sessaoId?: string, query?: { page?: number; limit?: number }): Promise<{ data: Foto[]; total: number; page: number; limit: number; totalPages: number }> {
    const params = { ...query, sessaoId };
    const { data } = await api.get('/fotos', { params });
    return data;
  },

  async findFotoById(id: string): Promise<Foto> {
    const { data } = await api.get<Foto>(`/fotos/${id}`);
    return data;
  },

  async createFoto(payload: CreateFotoPayload): Promise<Foto> {
    // Se tiver arquivo, usa FormData
    if (payload.arquivo) {
      const formData = new FormData();
      formData.append('arquivo', payload.arquivo);
      formData.append('sessaoId', payload.sessaoId);
      formData.append('titulo', payload.titulo);
      formData.append('descricao', payload.descricao);
      formData.append('data', payload.data);
      formData.append('categoria', payload.categoria);
      formData.append('tipo', payload.tipo);
      if (payload.driveLink) formData.append('driveLink', payload.driveLink);
      
      const { data } = await api.post<Foto>('/fotos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }
    
    // Sem arquivo, só URL
    const { data } = await api.post<Foto>('/fotos', payload);
    return data;
  },

  async updateFoto(id: string, payload: UpdateFotoPayload): Promise<Foto> {
    const { data } = await api.patch<Foto>(`/fotos/${id}`, payload);
    return data;
  },

  async removeFoto(id: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/fotos/${id}`);
    return data;
  },

  async uploadFotos(sessaoId: string, files: File[], dados: Omit<CreateFotoPayload, 'sessaoId' | 'arquivo'>[]): Promise<Foto[]> {
    const formData = new FormData();
    formData.append('sessaoId', sessaoId);
    
    files.forEach((file, index) => {
      formData.append(`fotos`, file);
      if (dados[index]) {
        formData.append(`dados[${index}][titulo]`, dados[index].titulo);
        formData.append(`dados[${index}][descricao]`, dados[index].descricao);
        formData.append(`dados[${index}][data]`, dados[index].data);
        formData.append(`dados[${index}][categoria]`, dados[index].categoria);
        formData.append(`dados[${index}][tipo]`, dados[index].tipo);
        if (dados[index].driveLink) formData.append(`dados[${index}][driveLink]`, dados[index].driveLink);
      }
    });
    
    const { data } = await api.post<Foto[]>(`/sessoes/${sessaoId}/fotos/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // ── Estatísticas ────────────────────────────────────────────────

  async getStats(): Promise<{
    totalSessoes: number;
    totalFotos: number;
    totalParticipantes: number;
    mediaPorSessao: number;
  }> {
    const { data } = await api.get('/materiais/stats');
    return data;
  },
};

export default MateriaisService;