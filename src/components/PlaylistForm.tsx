import { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaUpload } from 'react-icons/fa';
import styles from '../styles/PlaylistForm.module.css';
import { useTheme } from './context/ThemeContext';

// Interface baseada no schema do Prisma
interface Playlist {
  id: string;
  title: string;
  description: string;
  spotifyId: string;
  spotifyUrl: string;
  embedUrl: string;
  coverImage: string;
  duration: string;
  tracks: number;
  likes: number;
  curator: string;
  relatedFilm: string;
  filmYear: string;
  director: string;
  theme: string;
  curatorDescription?: string;
  sessaoId?: string;
  genres?: { id: string; name: string }[];
  languages?: { id: string; name: string }[];
  highlightTracks?: { id: string; name: string }[];
  createdAt?: string;
  updatedAt?: string;
}

interface Sessao {
  id: string;
  titulo: string;
  diretor: string;
  ano: number;
  dataSessao: string;
  descricao: string;
}

interface PlaylistFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: Partial<Playlist>;
  isEditing?: boolean;
  sessoes: Sessao[];
  isLoading?: boolean;
}

export default function PlaylistForm({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  isEditing, 
  sessoes,
  isLoading = false
}: PlaylistFormProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    spotifyId: '',
    spotifyUrl: '',
    embedUrl: '',
    coverImage: '',
    duration: '',
    tracks: 0,
    curator: '',
    relatedFilm: '',
    filmYear: '',
    director: '',
    theme: '',
    curatorDescription: '',
    sessaoId: undefined,
    usarUploadCapa: false,
    coverFile: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        spotifyId: initialData.spotifyId || '',
        spotifyUrl: initialData.spotifyUrl || '',
        embedUrl: initialData.embedUrl || '',
        coverImage: initialData.coverImage || '',
        duration: initialData.duration || '',
        tracks: initialData.tracks || 0,
        curator: initialData.curator || '',
        relatedFilm: initialData.relatedFilm || '',
        filmYear: initialData.filmYear || '',
        director: initialData.director || '',
        theme: initialData.theme || '',
        curatorDescription: initialData.curatorDescription || '',
        sessaoId: initialData.sessaoId || undefined,
        usarUploadCapa: false,
        coverFile: null,
      });
      setPreviewUrl(initialData.coverImage || '');
    } else {
      setFormData({
        title: '',
        description: '',
        spotifyId: '',
        spotifyUrl: '',
        embedUrl: '',
        coverImage: '',
        duration: '',
        tracks: 0,
        curator: '',
        relatedFilm: '',
        filmYear: '',
        director: '',
        theme: '',
        curatorDescription: '',
        sessaoId: undefined,
        usarUploadCapa: false,
        coverFile: null,
      });
      setPreviewUrl('');
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ 
        ...formData, 
        coverFile: file,
        usarUploadCapa: true,
        coverImage: '' // Limpa URL quando usa upload
      });
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // Validar campos obrigatórios
    if (!formData.title) {
      alert('O título é obrigatório');
      return;
    }
    
    if (!formData.spotifyUrl) {
      alert('A URL do Spotify é obrigatória');
      return;
    }

    // Extrair spotifyId da URL se não foi fornecido
    let spotifyId = formData.spotifyId;
    if (!spotifyId && formData.spotifyUrl) {
      const match = formData.spotifyUrl.match(/playlist\/([a-zA-Z0-9]+)/);
      if (match) {
        spotifyId = match[1];
      }
    }

    // Preparar dados para enviar à API
    const submitData: any = {
      title: formData.title,
      description: formData.description || '',
      spotifyId: spotifyId || '',
      spotifyUrl: formData.spotifyUrl,
      embedUrl: formData.embedUrl || '',
      coverImage: formData.coverImage || '',
      duration: formData.duration || '',
      tracks: formData.tracks || 0,
      curator: formData.curator || '',
      relatedFilm: formData.relatedFilm || '',
      filmYear: formData.filmYear || '',
      director: formData.director || '',
      theme: formData.theme || '',
      curatorDescription: formData.curatorDescription || '',
      sessaoId: formData.sessaoId || undefined,
      genresNomes: [], // Será preenchido se houver campos de gênero
      languagesNomes: [], // Será preenchido se houver campos de idioma
      highlightTracksNomes: [], // Será preenchido se houver campos de faixas destacadas
    };
    
    onSave(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.formOverlay}>
      <div className={`${styles.formContainer} ${!isDarkMode ? styles.light : ''}`}>
        <div className={styles.formHeader}>
          <h3>{isEditing ? 'Editar Playlist' : 'Nova Playlist'}</h3>
          <button onClick={onClose} className={styles.formClose} disabled={isLoading}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.formBody}>
          {/* Seção 1: Identificação */}
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Identificação</h4>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nome da playlist"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label>URL do Spotify *</label>
                <input
                  type="text"
                  value={formData.spotifyUrl}
                  onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                  placeholder="https://open.spotify.com/playlist/..."
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Spotify ID</label>
                <input
                  type="text"
                  value={formData.spotifyId}
                  onChange={(e) => setFormData({ ...formData, spotifyId: e.target.value })}
                  placeholder="ID da playlist (opcional - extraído automaticamente)"
                  disabled={isLoading}
                />
                <small>Deixe em branco para extrair automaticamente da URL</small>
              </div>
              <div className={styles.formGroup}>
                <label>URL do Embed</label>
                <input
                  type="text"
                  value={formData.embedUrl}
                  onChange={(e) => setFormData({ ...formData, embedUrl: e.target.value })}
                  placeholder="https://embed.spotify.com/..."
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Sessão e Filme */}
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Sessão e Filme</h4>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Sessão Relacionada</label>
                <select
                  value={formData.sessaoId || ''}
                  onChange={(e) => setFormData({ ...formData, sessaoId: e.target.value || undefined })}
                  disabled={isLoading}
                >
                  <option value="">Nenhuma sessão</option>
                  {sessoes.map(sessao => (
                    <option key={sessao.id} value={sessao.id}>
                      {sessao.titulo} - {new Date(sessao.dataSessao).toLocaleDateString('pt-BR')}
                    </option>
                  ))}
                </select>
                <small>Selecione uma sessão já criada na galeria de fotos</small>
              </div>
              <div className={styles.formGroup}>
                <label>Filme Relacionado</label>
                <input
                  type="text"
                  value={formData.relatedFilm}
                  onChange={(e) => setFormData({ ...formData, relatedFilm: e.target.value })}
                  placeholder="Nome do filme"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Diretor</label>
                <input
                  type="text"
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                  placeholder="Diretor do filme"
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Ano do Filme</label>
                <input
                  type="text"
                  value={formData.filmYear}
                  onChange={(e) => setFormData({ ...formData, filmYear: e.target.value })}
                  placeholder="2024"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Seção 3: Curadoria */}
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Curadoria</h4>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Curador</label>
                <input
                  type="text"
                  value={formData.curator}
                  onChange={(e) => setFormData({ ...formData, curator: e.target.value })}
                  placeholder="Nome do curador"
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tema</label>
                <input
                  type="text"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  placeholder="Tema principal da playlist"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Descrição do Curador</label>
              <textarea
                value={formData.curatorDescription}
                onChange={(e) => setFormData({ ...formData, curatorDescription: e.target.value })}
                placeholder="Sobre o curador..."
                rows={2}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Seção 4: Detalhes da Playlist */}
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Detalhes</h4>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Duração</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="Ex: 1h 30min"
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Nº de Faixas</label>
                <input
                  type="number"
                  value={formData.tracks}
                  onChange={(e) => setFormData({ ...formData, tracks: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição da playlist..."
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Seção 5: Imagem de Capa */}
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Imagem de Capa</h4>
            
            <div className={styles.formGroup}>
              <label>Opção de Imagem</label>
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    checked={!formData.usarUploadCapa}
                    onChange={() => setFormData({ ...formData, usarUploadCapa: false, coverFile: null })}
                    disabled={isLoading}
                  />
                  URL Externa
                </label>
                <label>
                  <input
                    type="radio"
                    checked={formData.usarUploadCapa}
                    onChange={() => setFormData({ ...formData, usarUploadCapa: true, coverImage: '' })}
                    disabled={isLoading}
                  />
                  Upload de Arquivo
                </label>
              </div>
            </div>

            {!formData.usarUploadCapa ? (
              <div className={styles.formGroup}>
                <label>URL da Capa</label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://i.scdn.co/image/ab67706f0000000298c5a2e6"
                  disabled={isLoading}
                />
                <small>Deixe em branco para usar a imagem padrão do Spotify</small>
              </div>
            ) : (
              <div className={styles.formGroup}>
                <label>Arquivo de Imagem</label>
                <div className={styles.fileUpload}>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    style={{ display: 'none' }}
                    id="coverFile"
                  />
                  <label htmlFor="coverFile" className={styles.uploadButton}>
                    <FaUpload /> Selecionar Imagem
                  </label>
                  {formData.coverFile && (
                    <span className={styles.fileName}>{formData.coverFile.name}</span>
                  )}
                </div>
                <small>Formatos: JPG, PNG, GIF, WEBP. Máx: 5MB</small>
              </div>
            )}

            {(previewUrl || formData.coverImage) && (
              <div className={styles.imagePreview}>
                <img 
                  src={previewUrl || formData.coverImage} 
                  alt="Preview da capa" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/300x300?text=Sem+Imagem';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.formFooter}>
          <button 
            type="button" 
            className={styles.cancelBtn} 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button 
            type="button" 
            className={styles.submitBtn} 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <FaSave /> {isLoading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Adicionar Playlist')}
          </button>
        </div>
      </div>
    </div>
  );
}