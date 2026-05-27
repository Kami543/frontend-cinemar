// frontend/src/utils/imageUtils.ts

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const PLACEHOLDER_IMAGE = '/images/fallback-poster.jpg';

export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return PLACEHOLDER_IMAGE;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/uploads/filmes/${path}`;
};

export const getPlaceholderImage = (): string => {
  return PLACEHOLDER_IMAGE;
};

// Exportação padrão também
const imageUtils = {
  getImageUrl,
  getPlaceholderImage,
};

export default imageUtils;