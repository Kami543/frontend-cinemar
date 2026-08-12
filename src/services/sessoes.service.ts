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

const SessoesService = {
  async findAll(page = 1, limit = 20): Promise<PaginationResult<Sessao>> {
    const { data } = await api.get<PaginationResult<Sessao>>('/sessoes', {
      params: { page, limit },
    });
    return data;
  },

  async findById(id: string): Promise<Sessao> {
    const { data } = await api.get<Sessao>(`/sessoes/${id}`);
    return data;
  },

  async addMidia(sessaoId: string, payload: UploadMidiaPayload): Promise<Foto> {
    const form = new FormData();
    
    // Campos obrigatórios
    form.append('titulo', payload.titulo);
    form.append('descricao', payload.descricao || '');
    form.append('data', payload.data);
    form.append('categoria', payload.categoria || 'geral');
    form.append('tipo', payload.tipo);

    // 🔑 CRUCIAL: usarUpload deve ser 'true' quando tem arquivo
    if (payload.file) {
      form.append('file', payload.file); // Nome do campo: 'file' (padrão do multer)
      form.append('usarUpload', 'true'); // String 'true' - o backend vai converter para boolean
    } else if (payload.url) {
      form.append('url', payload.url);
      form.append('usarUpload', 'false');
    } else if (payload.driveLink) {
      form.append('driveLink', payload.driveLink);
      form.append('usarUpload', 'false');
    }

    // Log detalhado para debug
    console.log('📤 Enviando para /sessoes/${sessaoId}/fotos/upload');
    console.log('📋 FormData:');
    for (let [key, value] of form.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: [File] ${value.name} (${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`  ${key}: "${value}"`);
      }
    }

    try {
      const { data } = await api.post<Foto>(
        `/sessoes/${sessaoId}/fotos/upload`,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('✅ Upload realizado com sucesso:', data);
      return data;
    } catch (error: any) {
      console.error('❌ Erro no upload:');
      console.error('  Status:', error.response?.status);
      console.error('  Data:', error.response?.data);
      console.error('  Message:', error.message);
      throw error;
    }
  },

  async updateMidia(fotoId: string, payload: UpdateMidiaPayload): Promise<Foto> {
    const { data } = await api.patch<Foto>(`/sessoes/fotos/${fotoId}`, payload);
    return data;
  },

  async removeMidia(sessaoId: string, fotoId: string): Promise<void> {
    await api.delete(`/sessoes/${sessaoId}/fotos/${fotoId}`);
  },
};

export default SessoesService;