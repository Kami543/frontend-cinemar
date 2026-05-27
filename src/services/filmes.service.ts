// frontend/src/services/filmes.service.ts
import api, { getImageUrl } from './api';

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

const FilmesService = {
  // Listar todos os filmes
  async findAll(query?: FilmesQuery): Promise<PaginatedFilmes> {
    const { data } = await api.get<PaginatedFilmes>('/filmes', { params: query });
    return processPaginatedFilmes(data);
  },

  // Buscar filme por ID
  async findById(id: string): Promise<Filme> {
    const { data } = await api.get<Filme>(`/filmes/${id}`);
    return processFilmeImage(data);
  },

  // Criar novo filme (com upload de fotos)
  async create(payload: CreateFilmePayload, files?: File[]): Promise<Filme> {
    if (files && files.length > 0) {
      const formData = new FormData();
      
      // Adicionar campos diretamente, não como JSON string
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // Para arrays, enviar como JSON string
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      // Adicionar arquivos
      files.forEach((file) => {
        formData.append('fotos', file);
      });
      
      const { data } = await api.post<Filme>('/filmes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return processFilmeImage(data);
    } else {
      // Sem upload de arquivos
      const { data } = await api.post<Filme>('/filmes', payload);
      return processFilmeImage(data);
    }
  },

  // Atualizar filme (com upload de fotos)
  async update(id: string, payload: UpdateFilmePayload, files?: File[]): Promise<Filme> {
    if (files && files.length > 0) {
      const formData = new FormData();
      
      // Adicionar campos diretamente
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
      
      // Adicionar arquivos
      files.forEach((file) => {
        formData.append('adicionarFotos', file);
      });
      
      const { data } = await api.patch<Filme>(`/filmes/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return processFilmeImage(data);
    } else {
      // Sem upload de arquivos
      const { data } = await api.patch<Filme>(`/filmes/${id}`, payload);
      return processFilmeImage(data);
    }
  },

  // Adicionar fotos a um filme existente
  async addFotos(id: string, files: File[], fotosMetadata: FilmeFotoMetadata[]): Promise<Filme> {
    const formData = new FormData();
    
    // Adicionar metadados como campos individuais
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
};

export default FilmesService;