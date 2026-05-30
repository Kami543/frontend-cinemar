// frontend/src/services/filmes.service.ts
import api, { getImageUrl, wakeUpBackend } from './api';

export interface FilmeFoto {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  titulo: string;
  descricao?: string;
  tipo: string;
  principal: boolean;
  ordem: number;
  createdAt: string;
}

export interface Filme {
  id: string;
  numero?: number;
  title: string;
  director: string;
  year: number;
  date: string;
  description: string;
  imageUrl: string | null;
  screenplay: string;
  cast: string;
  rating: number;
  reviewCount: number;
  genre: string;
  duration?: string;
  language?: string;
  materialsLink?: string;
  playlistLink?: string;
  playlistId?: string;
  createdAt: string;
  updatedAt: string;
  awards: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  filmesFotos?: FilmeFoto[];
}

export interface PaginatedFilmes {
  data: Filme[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilmesQuery {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  director?: string;
  year?: number;
  language?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export interface FilmeFotoMetadata {
  titulo?: string;
  descricao?: string;
  tipo?: string;
  principal?: boolean;
  ordem?: number;
}

export interface CreateFilmePayload {
  title: string;
  director: string;
  year: number;
  date: string;
  description: string;
  imageUrl?: string;
  screenplay: string;
  cast: string;
  genre: string;
  duration?: string;
  language?: string;
  materialsLink?: string;
  playlistLink?: string;
  playlistId?: string;
  awardsNames?: string[];
  tagNames?: string[];
  fotos?: FilmeFotoMetadata[];
}

export interface UpdateFilmePayload {
  title?: string;
  director?: string;
  year?: number;
  date?: string;
  description?: string;
  imageUrl?: string;
  screenplay?: string;
  cast?: string;
  genre?: string;
  duration?: string;
  language?: string;
  materialsLink?: string;
  playlistLink?: string;
  playlistId?: string;
  awardsNames?: string[];
  tagNames?: string[];
  adicionarFotos?: FilmeFotoMetadata[];
  atualizarFotos?: Array<{ id: string } & Partial<FilmeFotoMetadata>>;
  deletarFotosIds?: string[];
}

export interface UpdateFotoPayload {
  titulo?: string;
  descricao?: string;
  tipo?: string;
  principal?: boolean;
  ordem?: number;
}

// Função auxiliar para processar URLs das imagens
const processFilmeImage = (filme: Filme): Filme => {
  if (filme.imageUrl) {
    filme.imageUrl = getImageUrl(filme.imageUrl);
  }
  if (filme.filmesFotos) {
    filme.filmesFotos = filme.filmesFotos.map(foto => ({
      ...foto,
      path: getImageUrl(foto.path),
    }));
  }
  return filme;
};

const processPaginatedFilmes = (data: PaginatedFilmes): PaginatedFilmes => {
  return {
    ...data,
    data: data.data.map(processFilmeImage),
  };
};

// Flag para controlar se o wake-up já foi feito
let wakeUpDone = false;

const ensureBackendIsAwake = async (): Promise<void> => {
  if (!wakeUpDone) {
    wakeUpDone = true;
    await wakeUpBackend();
  }
};

const FilmesService = {
  // Listar todos os filmes
  async findAll(query?: FilmesQuery, retryCount = 0): Promise<PaginatedFilmes> {
    try {
      if (retryCount === 0) {
        await ensureBackendIsAwake();
      }
      
      const { data } = await api.get<PaginatedFilmes>('/filmes', { params: query });
      return processPaginatedFilmes(data);
    } catch (error: any) {
      if (error.code === 'ECONNABORTED' && retryCount < 2) {
        console.log(`⏱️ Timeout na requisição, tentando novamente... (${retryCount + 1}/2)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.findAll(query, retryCount + 1);
      }
      throw error;
    }
  },

  // Buscar filme por ID
  async findById(id: string, retryCount = 0): Promise<Filme> {
    try {
      if (retryCount === 0) {
        await ensureBackendIsAwake();
      }
      const { data } = await api.get<Filme>(`/filmes/${id}`);
      return processFilmeImage(data);
    } catch (error: any) {
      if (error.code === 'ECONNABORTED' && retryCount < 2) {
        console.log(`⏱️ Timeout na requisição, tentando novamente... (${retryCount + 1}/2)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.findById(id, retryCount + 1);
      }
      throw error;
    }
  },

  // Criar novo filme (com upload de fotos)
  async create(payload: CreateFilmePayload, files?: File[]): Promise<Filme> {
    if (files && files.length > 0) {
      const formData = new FormData();
      
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      files.forEach((file) => {
        formData.append('fotos', file);
      });
      
      const { data } = await api.post<Filme>('/filmes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000,
      });
      return processFilmeImage(data);
    } else {
      const { data } = await api.post<Filme>('/filmes', payload);
      return processFilmeImage(data);
    }
  },

  // Atualizar filme (com upload de fotos)
  async update(id: string, payload: UpdateFilmePayload, files?: File[]): Promise<Filme> {
    if (files && files.length > 0) {
      const formData = new FormData();
      
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      files.forEach((file) => {
        formData.append('adicionarFotos', file);
      });
      
      const { data } = await api.patch<Filme>(`/filmes/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000,
      });
      return processFilmeImage(data);
    } else {
      const { data } = await api.patch<Filme>(`/filmes/${id}`, payload);
      return processFilmeImage(data);
    }
  },

  // Adicionar fotos a um filme existente
  async addFotos(id: string, files: File[], fotosMetadata: FilmeFotoMetadata[]): Promise<Filme> {
    const formData = new FormData();
    
    fotosMetadata.forEach((metadata, index) => {
      if (metadata.titulo) formData.append(`fotosMetadata[${index}][titulo]`, metadata.titulo);
      if (metadata.descricao) formData.append(`fotosMetadata[${index}][descricao]`, metadata.descricao);
      if (metadata.tipo) formData.append(`fotosMetadata[${index}][tipo]`, metadata.tipo);
      if (metadata.principal !== undefined) formData.append(`fotosMetadata[${index}][principal]`, String(metadata.principal));
      if (metadata.ordem !== undefined) formData.append(`fotosMetadata[${index}][ordem]`, String(metadata.ordem));
    });
    
    files.forEach((file) => {
      formData.append('fotos', file);
    });
    
    const { data } = await api.post<Filme>(`/filmes/${id}/fotos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000,
    });
    return processFilmeImage(data);
  },

  // Atualizar metadados de uma foto
  async updateFoto(filmeId: string, fotoId: string, payload: UpdateFotoPayload): Promise<Filme> {
    const { data } = await api.patch<Filme>(`/filmes/${filmeId}/fotos/${fotoId}`, payload);
    return processFilmeImage(data);
  },

  // Deletar foto
  async deleteFoto(filmeId: string, fotoId: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/filmes/${filmeId}/fotos/${fotoId}`);
    return data;
  },

  // Definir foto principal
  async setFotoPrincipal(filmeId: string, fotoId: string): Promise<Filme> {
    const { data } = await api.patch<Filme>(`/filmes/${filmeId}/fotos/${fotoId}/principal`);
    return processFilmeImage(data);
  },

  // Deletar filme
  async remove(id: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/filmes/${id}`);
    return data;
  },

  // 🆕 Atualizar capa do filme (CORRIGIDO)
  async updateCover(id: string, coverFile: File): Promise<Filme> {
    try {
      // Adiciona a foto como principal
      await this.addFotos(id, [coverFile], [{ 
        principal: true,
        tipo: 'cover',
        titulo: 'Capa do Filme'
      }]);
      
      // Busca o filme atualizado novamente para garantir dados frescos
      const freshMovie = await this.findById(id);
      
      return freshMovie;
    } catch (error) {
      console.error('Erro ao atualizar capa:', error);
      throw error;
    }
  },
};

export default FilmesService;