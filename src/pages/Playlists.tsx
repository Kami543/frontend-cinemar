import { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaUpload, FaPlus, FaTrash } from 'react-icons/fa';
import styles from '../styles/PlaylistForm.module.css';
import { useTheme } from '../components/context/ThemeContext';

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
  genres?: { id: string; name: string }[] | string[];
  languages?: { id: string; name: string }[] | string[];
  highlightTracks?: { id: string; name: string }[] | string[];
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
    genres: [],
    languages: [],
    highlightTracks: [],
  });

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      // Função segura para converter para array
      const toSafeArray = (data: any): string[] => {
        if (!data) return [];
        if (Array.isArray(data)) {
          return data.map(item => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object' && 'name' in item) return item.name;
            return '';
          }).filter(item => item);
        }
        return [];
      };

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
        genres: toSafeArray(initialData.genres),
        languages: toSafeArray(initialData.languages),
        highlightTracks: toSafeArray(initialData.highlightTracks),
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
        genres: [],
        languages: [],
        highlightTracks: [],
      });
      setPreviewUrl('');
    }
    setErrors({});
  }, [initialData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, coverImage: 'A imagem deve ter no máximo 5MB' });
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, coverImage: 'Formato inválido. Use JPG, PNG, GIF ou WEBP' });
      return;
    }

    setFormData((prev: any) => ({ 
      ...prev, 
      coverFile: file,
      usarUploadCapa: true,
      coverImage: ''
    }));
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    if (errors.coverImage) {
      const newErrors = { ...errors };
      delete newErrors.coverImage;
      setErrors(newErrors);
    }
  };

  const extractSpotifyId = (url: string): string | null => {
    const patterns = [
      /playlist\/([a-zA-Z0-9]{22})/,
      /spotify\.com\/playlist\/([a-zA-Z0-9]{22})/,
      /open\.spotify\.com\/playlist\/([a-zA-Z0-9]{22})/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.spotifyUrl.trim()) {
      newErrors.spotifyUrl = 'URL do Spotify é obrigatória';
    } else {
      const spotifyId = extractSpotifyId(formData.spotifyUrl);
      if (!spotifyId) {
        newErrors.spotifyUrl = 'URL do Spotify inválida. Use o formato: https://open.spotify.com/playlist/...';
      }
    }

    if (formData.tracks < 0) {
      newErrors.tracks = 'Número de faixas deve ser maior ou igual a 0';
    }

    if (formData.filmYear && (parseInt(formData.filmYear) < 1888 || parseInt(formData.filmYear) > new Date().getFullYear())) {
      newErrors.filmYear = 'Ano inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    let spotifyId = formData.spotifyId;
    if (!spotifyId && formData.spotifyUrl) {
      const extracted = extractSpotifyId(formData.spotifyUrl);
      if (extracted) {
        spotifyId = extracted;
      }
    }

    let embedUrl = formData.embedUrl;
    if (!embedUrl && spotifyId) {
      embedUrl = `https://open.spotify.com/embed/playlist/${spotifyId}`;
    }

    const submitData: any = {
      title: formData.title.trim(),
      description: formData.description.trim() || '',
      spotifyId: spotifyId || '',
      spotifyUrl: formData.spotifyUrl.trim(),
      embedUrl: embedUrl,
      coverImage: formData.coverImage || '',
      duration: formData.duration.trim() || '',
      tracks: Number(formData.tracks) || 0,
      curator: formData.curator.trim() || '',
      relatedFilm: formData.relatedFilm.trim() || '',
      filmYear: formData.filmYear.trim() || '',
      director: formData.director.trim() || '',
      theme: formData.theme.trim() || '',
      curatorDescription: formData.curatorDescription.trim() || '',
      sessaoId: formData.sessaoId || undefined,
      genresNomes: Array.isArray(formData.genres) ? formData.genres.filter((g: string) => g.trim()) : [],
      languagesNomes: Array.isArray(formData.languages) ? formData.languages.filter((l: string) => l.trim()) : [],
      highlightTracksNomes: Array.isArray(formData.highlightTracks) ? formData.highlightTracks.filter((t: string) => t.trim()) : [],
      coverFile: formData.usarUploadCapa ? formData.coverFile : null,
    };
    
    onSave(submitData);
  };

  // Handlers seguros para arrays
  const addGenre = () => {
    setFormData((prev: any) => ({ 
      ...prev, 
      genres: Array.isArray(prev.genres) ? [...prev.genres, ''] : ['']
    }));
  };

  const updateGenre = (index: number, value: string) => {
    setFormData((prev: any) => {
      const newGenres = Array.isArray(prev.genres) ? [...prev.genres] : [];
      newGenres[index] = value;
      return { ...prev, genres: newGenres };
    });
  };

  const removeGenre = (index: number) => {
    setFormData((prev: any) => {
      const newGenres = Array.isArray(prev.genres) ? [...prev.genres] : [];
      newGenres.splice(index, 1);
      return { ...prev, genres: newGenres };
    });
  };

  const addLanguage = () => {
    setFormData((prev: any) => ({ 
      ...prev, 
      languages: Array.isArray(prev.languages) ? [...prev.languages, ''] : ['']
    }));
  };

  const updateLanguage = (index: number, value: string) => {
    setFormData((prev: any) => {
      const newLanguages = Array.isArray(prev.languages) ? [...prev.languages] : [];
      newLanguages[index] = value;
      return { ...prev, languages: newLanguages };
    });
  };

  const removeLanguage = (index: number) => {
    setFormData((prev: any) => {
      const newLanguages = Array.isArray(prev.languages) ? [...prev.languages] : [];
      newLanguages.splice(index, 1);
      return { ...prev, languages: newLanguages };
    });
  };

  const addHighlightTrack = () => {
    setFormData((prev: any) => ({ 
      ...prev, 
      highlightTracks: Array.isArray(prev.highlightTracks) ? [...prev.highlightTracks, ''] : ['']
    }));
  };

  const updateHighlightTrack = (index: number, value: string) => {
    setFormData((prev: any) => {
      const newTracks = Array.isArray(prev.highlightTracks) ? [...prev.highlightTracks] : [];
      newTracks[index] = value;
      return { ...prev, highlightTracks: newTracks };
    });
  };

  const removeHighlightTrack = (index: number) => {
    setFormData((prev: any) => {
      const newTracks = Array.isArray(prev.highlightTracks) ? [...prev.highlightTracks] : [];
      newTracks.splice(index, 1);
      return { ...prev, highlightTracks: newTracks };
    });
  };

  if (!isOpen) return null;

  // Obter arrays seguros para renderização
  const safeGenres = Array.isArray(formData.genres) ? formData.genres : [];
  const safeLanguages = Array.isArray(formData.languages) ? formData.languages : [];
  const safeHighlightTracks = Array.isArray(formData.highlightTracks) ? formData.highlightTracks : [];

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
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
                  placeholder="Nome da playlist"
                  className={errors.title ? styles.error : ''}
                  disabled={isLoading}
                />
                {errors.title && <small className={styles.errorText}>{errors.title}</small>}
              </div>
              <div className={styles.formGroup}>
                <label>URL do Spotify *</label>
                <input
                  type="text"
                  value={formData.spotifyUrl}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, spotifyUrl: e.target.value }))}
                  placeholder="https://open.spotify.com/playlist/..."
                  className={errors.spotifyUrl ? styles.error : ''}
                  disabled={isLoading}
                />
                {errors.spotifyUrl && <small className={styles.errorText}>{errors.spotifyUrl}</small>}
                <small>Ex: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M</small>
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
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, sessaoId: e.target.value || undefined }))}
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
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, relatedFilm: e.target.value }))}
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
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, director: e.target.value }))}
                  placeholder="Diretor do filme"
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Ano do Filme</label>
                <input
                  type="number"
                  value={formData.filmYear}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, filmYear: e.target.value }))}
                  placeholder="2024"
                  min="1888"
                  max={new Date().getFullYear()}
                  className={errors.filmYear ? styles.error : ''}
                  disabled={isLoading}
                />
                {errors.filmYear && <small className={styles.errorText}>{errors.filmYear}</small>}
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
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, curator: e.target.value }))}
                  placeholder="Nome do curador"
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tema</label>
                <input
                  type="text"
                  value={formData.theme}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, theme: e.target.value }))}
                  placeholder="Ex: cinema, literatura, sociedade"
                  disabled={isLoading}
                />
                <small>Tema usado para filtrar playlists por categoria</small>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Descrição do Curador</label>
              <textarea
                value={formData.curatorDescription}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, curatorDescription: e.target.value }))}
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
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, duration: e.target.value }))}
                  placeholder="Ex: 1h 30min"
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Nº de Faixas</label>
                <input
                  type="number"
                  value={formData.tracks}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, tracks: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  min="0"
                  className={errors.tracks ? styles.error : ''}
                  disabled={isLoading}
                />
                {errors.tracks && <small className={styles.errorText}>{errors.tracks}</small>}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição da playlist..."
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Seção 5: Gêneros */}
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>
              Gêneros Musicais
              <button type="button" onClick={addGenre} className={styles.addButton} disabled={isLoading}>
                <FaPlus /> Adicionar
              </button>
            </h4>
            {safeGenres.length > 0 ? (
              safeGenres.map((genre: string, index: number) => (
                <div key={index} className={styles.dynamicField}>
                  <input
                    type="text"
                    value={genre || ''}
                    onChange={(e) => updateGenre(index, e.target.value)}
                    placeholder="Ex: Rock, MPB, Jazz"
                    disabled={isLoading}
                  />
                  <button type="button" onClick={() => removeGenre(index)} className={styles.removeButton} disabled={isLoading}>
                    <FaTrash />
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.emptyMessage}>Nenhum gênero adicionado. Clique em "Adicionar" para incluir.</div>
            )}
          </div>

          {/* Seção 6: Idiomas */}
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>
              Idiomas das Faixas
              <button type="button" onClick={addLanguage} className={styles.addButton} disabled={isLoading}>
                <FaPlus /> Adicionar
              </button>
            </h4>
            {safeLanguages.length > 0 ? (
              safeLanguages.map((language: string, index: number) => (
                <div key={index} className={styles.dynamicField}>
                  <input
                    type="text"
                    value={language || ''}
                    onChange={(e) => updateLanguage(index, e.target.value)}
                    placeholder="Ex: Português, Inglês, Francês"
                    disabled={isLoading}
                  />
                  <button type="button" onClick={() => removeLanguage(index)} className={styles.removeButton} disabled={isLoading}>
                    <FaTrash />
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.emptyMessage}>Nenhum idioma adicionado. Clique em "Adicionar" para incluir.</div>
            )}
          </div>

          {/* Seção 7: Faixas Destacadas */}
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>
              Faixas Destacadas
              <button type="button" onClick={addHighlightTrack} className={styles.addButton} disabled={isLoading}>
                <FaPlus /> Adicionar
              </button>
            </h4>
            {safeHighlightTracks.length > 0 ? (
              safeHighlightTracks.map((track: string, index: number) => (
                <div key={index} className={styles.dynamicField}>
                  <input
                    type="text"
                    value={track || ''}
                    onChange={(e) => updateHighlightTrack(index, e.target.value)}
                    placeholder="Nome da música"
                    disabled={isLoading}
                  />
                  <button type="button" onClick={() => removeHighlightTrack(index)} className={styles.removeButton} disabled={isLoading}>
                    <FaTrash />
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.emptyMessage}>Nenhuma faixa destacada adicionada. Clique em "Adicionar" para incluir.</div>
            )}
            <small>Adicione as faixas mais importantes da playlist</small>
          </div>

          {/* Seção 8: Imagem de Capa */}
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Imagem de Capa</h4>
            
            <div className={styles.formGroup}>
              <label>Opção de Imagem</label>
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    checked={!formData.usarUploadCapa}
                    onChange={() => setFormData((prev: any) => ({ ...prev, usarUploadCapa: false, coverFile: null }))}
                    disabled={isLoading}
                  />
                  URL Externa
                </label>
                <label>
                  <input
                    type="radio"
                    checked={formData.usarUploadCapa}
                    onChange={() => setFormData((prev: any) => ({ ...prev, usarUploadCapa: true, coverImage: '' }))}
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
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, coverImage: e.target.value }))}
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
                {errors.coverImage && <small className={styles.errorText}>{errors.coverImage}</small>}
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