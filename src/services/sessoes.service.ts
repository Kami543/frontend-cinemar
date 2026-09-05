// frontend/src/services/sessoes.service.ts
import api from './api';

export type TipoMidia = 'foto' | 'video' | 'livro' | 'artigo' | 'reportagem';

export interface Foto {
  id: string;
  filename?: string;
  originalName?: string;
  mimetype?: string;
  size?: number;
  path?: string;
  url: string;
  titulo: string;
  descricao: string;
  data: string;
  categoria: string;
  tipo: TipoMidia;
  driveLink?: string | null;
  sessaoId: string;
  createdAt: string;
}

export interface Sessao {
  id: string;
  titulo: string;
  diretor: string;
  ano: number;
  dataSessao: string;
  participantes: number;
  descricao: string;
  fotos: Foto[];
  _count?: { fotos: number };
  createdAt: string;
  updatedAt: string;
}

interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Query DTOs (batem com QuerySessaoDto/QueryFotoDto do backend) ──

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
  tipo?: TipoMidia;
}

// ── Payloads de sessão (CRUD usado pelo useSessoes.ts) ──

export interface CreateSessaoPayload {
  titulo: string;
  diretor: string;
  ano: number;
  dataSessao: string;
  descricao: string;
  participantes?: number;
}

export type UpdateSessaoPayload = Partial<CreateSessaoPayload>;

// ── Payloads de mídia ──

export interface UploadMidiaPayload {
  titulo: string;
  descricao: string;
  data: string;
  categoria: string;
  tipo: TipoMidia;
  driveLink?: string;
  file?: File;
  url?: string;
}

export type UpdateMidiaPayload = Partial<Omit<UploadMidiaPayload, 'file'>>;

// AddFotoPayload é o formato aceito por /sessoes/:id/fotos/upload sem arquivo
// (link direto), usado pelo useSessoes.ts -> addFoto
export interface AddFotoPayload {
  titulo: string;
  descricao: string;
  data: string;
  categoria: string;
  tipo: TipoMidia;
  driveLink?: string;
  url?: string;
}

const SessoesService = {
  // Aceita a query inteira como objeto — é isso que useSessoes.ts manda
  async findAll(query: QuerySessaoDto = {}): Promise<PaginationResult<Sessao>> {
    const { data } = await api.get<PaginationResult<Sessao>>('/sessoes', {
      params: {
        page: query.page ?? 1,
        limit: query.limit ?? 20,
        orderBy: query.orderBy ?? 'dataSessao',
        order: query.order ?? 'desc',
        ...(query.search ? { search: query.search } : {}),
        ...(query.diretor ? { diretor: query.diretor } : {}),
        ...(query.ano ? { ano: query.ano } : {}),
      },
    });
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

  async remove(id: string): Promise<void> {
    await api.delete(`/sessoes/${id}`);
  },

  async findFotos(sessaoId: string, query: QueryFotoDto = {}): Promise<PaginationResult<Foto>> {
    const { data } = await api.get<PaginationResult<Foto>>(`/sessoes/${sessaoId}/fotos`, {
      params: query,
    });
    return data;
  },

  // link direto, sem upload de arquivo (rota .../fotos/upload aceita ambos
  // via usarUpload=false)
  async addFoto(sessaoId: string, payload: AddFotoPayload): Promise<Foto> {
    const form = new FormData();
    form.append('titulo', payload.titulo);
    form.append('descricao', payload.descricao || '');
    form.append('data', payload.data);
    form.append('categoria', payload.categoria || 'geral');
    form.append('tipo', payload.tipo);
    form.append('usarUpload', 'false');
    if (payload.url) form.append('url', payload.url);
    if (payload.driveLink) form.append('driveLink', payload.driveLink);

    const { data } = await api.post<Foto>(`/sessoes/${sessaoId}/fotos/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async addMidia(sessaoId: string, payload: UploadMidiaPayload): Promise<Foto> {
    const form = new FormData();
    form.append('titulo', payload.titulo);
    form.append('descricao', payload.descricao || '');
    form.append('data', payload.data);
    form.append('categoria', payload.categoria || 'geral');
    form.append('tipo', payload.tipo);

    if (payload.file) {
      form.append('foto', payload.file);
      form.append('usarUpload', 'true');
    } else if (payload.url) {
      form.append('url', payload.url);
      form.append('usarUpload', 'false');
    } else if (payload.driveLink) {
      form.append('driveLink', payload.driveLink);
      form.append('usarUpload', 'false');
    }

    const { data } = await api.post<Foto>(`/sessoes/${sessaoId}/fotos/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async updateMidia(fotoId: string, payload: UpdateMidiaPayload): Promise<Foto> {
    const { data } = await api.patch<Foto>(`/sessoes/fotos/${fotoId}`, payload);
    return data;
  },

  async removeMidia(sessaoId: string, fotoId: string): Promise<void> {
    await api.delete(`/sessoes/${sessaoId}/fotos/${fotoId}`);
  },

  // alias usado pelo useSessoes.ts
  async removeFoto(sessaoId: string, fotoId: string): Promise<void> {
    await api.delete(`/sessoes/${sessaoId}/fotos/${fotoId}`);
  },
};

export default SessoesService;