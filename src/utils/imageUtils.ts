// frontend/src/utils/imageUtils.ts

// URL do Supabase (configure no .env)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://seu-projeto.supabase.co';
const SUPABASE_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET ?? 'filmes';
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Placeholder local (imagem fallback)
const PLACEHOLDER_IMAGE = '/images/fallback-poster.jpg';

/**
 * Obtém URL completa da imagem do Supabase Storage
 * @param path - Caminho da imagem no bucket (ex: 'filmes/abc123/poster.jpg')
 * @returns URL completa da imagem
 */
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return PLACEHOLDER_IMAGE;
  
  // Se já for URL completa (http/https), retorna direto
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Se for path do Supabase
  if (path.includes('/storage/v1/object/')) {
    return path;
  }
  
  // Se for caminho do backend antigo (uploads)
  if (path.startsWith('/uploads') || path.startsWith('uploads/')) {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${normalized}`;
  }
  
  // Construir URL do Supabase Storage
  // Formatos suportados:
  // - 'filmes/123/poster.jpg'
  // - '123/poster.jpg'
  // - 'public/filmes/123/poster.jpg'
  const cleanPath = path.replace(/^\/+/, ''); // Remove barras no início
  
  // Se já tiver o bucket no path
  if (cleanPath.startsWith(`${SUPABASE_BUCKET}/`)) {
    return `${SUPABASE_URL}/storage/v1/object/public/${cleanPath}`;
  }
  
  // URL padrão do Supabase Storage
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${cleanPath}`;
};

/**
 * Obtém URL para thumbnail (versão menor da imagem)
 * @param path - Caminho da imagem
 * @param size - Tamanho desejado (small, medium, large)
 */
export const getThumbnailUrl = (
  path: string | null | undefined, 
  size: 'small' | 'medium' | 'large' = 'medium'
): string => {
  const baseUrl = getImageUrl(path);
  
  // Supabase suporta transformação de imagens via query params
  const sizes = {
    small: 'width=200&height=200&resize=cover',
    medium: 'width=400&height=400&resize=cover',
    large: 'width=800&height=800&resize=cover',
  };
  
  // Adicionar parâmetros de transformação se for URL do Supabase
  if (baseUrl.includes('supabase.co')) {
    return `${baseUrl}?${sizes[size]}`;
  }
  
  return baseUrl;
};

/**
 * Obtém URL da imagem com fallback
 * @param path - Caminho da imagem
 * @param fallback - URL de fallback (opcional)
 */
export const getImageWithFallback = (
  path: string | null | undefined, 
  fallback?: string
): string => {
  if (!path) return fallback ?? PLACEHOLDER_IMAGE;
  if (path.startsWith('http') && !path.includes('supabase')) return path;
  if (path.includes('/storage/v1/object/')) return path;
  
  const url = getImageUrl(path);
  
  // Verificar se a URL é válida (não tem undefined/null)
  if (url === PLACEHOLDER_IMAGE) {
    return fallback ?? PLACEHOLDER_IMAGE;
  }
  
  return url;
};

export const getPlaceholderImage = (): string => {
  return PLACEHOLDER_IMAGE;
};

// Exportação padrão
const imageUtils = {
  getImageUrl,
  getThumbnailUrl,
  getImageWithFallback,
  getPlaceholderImage,
};

export default imageUtils;