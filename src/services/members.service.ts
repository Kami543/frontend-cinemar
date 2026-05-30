// frontend/src/services/members.service.ts
import api from './api';

export interface MemberFoto {
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

export interface Member {
  id: string;
  nome: string;
  cargo: string;
  bio: string;
  formacao: string;
  email: string;
  telefone: string;
  foto?: string | null;
  destaque: boolean;
  tipo: string;
  createdAt: string;
  updatedAt: string;
  responsabilidades: { id: string; texto: string }[];
  experiencia: { id: string; texto: string }[];
  redesSociais: { id: string; plataforma: string; username: string }[];
  memberFotos?: MemberFoto[];
}

export interface PaginatedMembers {
  data: Member[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MembersQuery {
  page?: number;
  limit?: number;
  search?: string;
  tipo?: string;
  destaque?: boolean;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export interface CreateMemberPayload {
  nome: string;
  cargo: string;
  bio: string;
  formacao: string;
  email: string;
  telefone: string;
  tipo: string;
  foto?: string;
  destaque?: boolean;
  responsabilidades?: string[];
  experiencia?: string[];
  redesSociais?: { plataforma: string; username: string }[];
}

export interface UpdateMemberPayload {
  nome?: string;
  cargo?: string;
  bio?: string;
  formacao?: string;
  email?: string;
  telefone?: string;
  tipo?: string;
  foto?: string;
  destaque?: boolean;
  responsabilidades?: string[];
  experiencia?: string[];
  redesSociais?: { plataforma: string; username: string }[];
}

const MembersService = {
  async findAll(query?: MembersQuery): Promise<PaginatedMembers> {
    try {
      const cleanParams: Record<string, any> = {};
      if (query) {
        if (query.page) cleanParams.page = query.page;
        if (query.limit) cleanParams.limit = query.limit;
        if (query.search) cleanParams.search = query.search;
        if (query.tipo) cleanParams.tipo = query.tipo;
        if (query.destaque !== undefined) cleanParams.destaque = query.destaque;
        if (query.orderBy) cleanParams.orderBy = query.orderBy;
        if (query.order) cleanParams.order = query.order;
      }
      
      const response = await api.get('/members', { 
        params: cleanParams,
        timeout: 30000
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      throw error;
    }
  },

  async findById(id: string): Promise<Member> {
    const response = await api.get(`/members/${id}`, {
      timeout: 30000
    });
    return response.data;
  },

  async create(payload: CreateMemberPayload, files?: File[]): Promise<Member> {
    if (files && files.length > 0) {
      const formData = new FormData();
      // Envia os dados como JSON string
      formData.append('data', JSON.stringify(payload));
      files.forEach(file => {
        formData.append('fotos', file);
      });
      
      const response = await api.post('/members', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000
      });
      return response.data;
    } else {
      const response = await api.post('/members', payload, {
        timeout: 60000
      });
      return response.data;
    }
  },

  async update(id: string, payload: UpdateMemberPayload, files?: File[]): Promise<Member> {
    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append('data', JSON.stringify(payload));
      files.forEach(file => {
        formData.append('fotos', file);
      });
      
      const response = await api.patch(`/members/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000
      });
      return response.data;
    } else {
      const response = await api.patch(`/members/${id}`, payload, {
        timeout: 60000
      });
      return response.data;
    }
  },

  // ✅ CORRIGIDO: Upload de foto
  async uploadFoto(id: string, file: File): Promise<Member> {
    const formData = new FormData();
    formData.append('foto', file);
    
    const response = await api.patch(`/members/${id}/foto`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000
    });
    return response.data;
  },

  async remove(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/members/${id}`, {
      timeout: 30000
    });
    return response.data;
  },
};

export default MembersService;