import { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import styles from '../styles/PlaylistForm.module.css';

interface Playlist {
  id: number;
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
  genres: string[];
  languages: string[];
  createdAt: string;
  theme: string;
  highlightTracks?: string[];
  curatorDescription?: string;
  sessaoId?: number;
}

interface Sessao {
  id: number;
  titulo: string;
  diretor: string;
  ano: number;
  dataSessao: string;
  participantes: number;
  descricao: string;
}

interface PlaylistFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Playlist>) => void;
  initialData?: Partial<Playlist>;
  isEditing?: boolean;
  sessoes: Sessao[];
}

export default function PlaylistForm({ isOpen, onClose, onSave, initialData, isEditing, sessoes }: PlaylistFormProps) {
  const [formData, setFormData] = useState<Partial<Playlist>>({
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
    genres: [],
    languages: [],
    theme: '',
    highlightTracks: [],
    curatorDescription: '',
    sessaoId: undefined
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
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
        genres: [],
        languages: [],
        theme: '',
        highlightTracks: [],
        curatorDescription: '',
        sessaoId: undefined
      });
    }
  }, [initialData]);

  const handleArrayFieldChange = (field: 'genres' | 'languages' | 'highlightTracks', value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, [field]: array });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h3>{isEditing ? 'Editar Playlist' : 'Nova Playlist'}</h3>
          <button onClick={onClose} className={styles.formClose}>
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
                />
              </div>
              <div className={styles.formGroup}>
                <label>URL do Spotify *</label>
                <input
                  type="text"
                  value={formData.spotifyUrl}
                  onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                  placeholder="https://open.spotify.com/playlist/..."
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
                  onChange={(e) => setFormData({ ...formData, sessaoId: e.target.value ? parseInt(e.target.value) : undefined })}
                >
                  <option value="">Nenhuma sessão</option>
                  {sessoes.map(sessao => (
                    <option key={sessao.id} value={sessao.id}>
                      {sessao.titulo} - {sessao.dataSessao}
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
                />
              </div>
              <div className={styles.formGroup}>
                <label>Ano do Filme</label>
                <input
                  type="text"
                  value={formData.filmYear}
                  onChange={(e) => setFormData({ ...formData, filmYear: e.target.value })}
                  placeholder="2024"
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
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tema</label>
                <input
                  type="text"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  placeholder="Tema principal da playlist"
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
                />
              </div>
              <div className={styles.formGroup}>
                <label>Nº de Faixas</label>
                <input
                  type="number"
                  value={formData.tracks}
                  onChange={(e) => setFormData({ ...formData, tracks: parseInt(e.target.value) })}
                  placeholder="0"
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
              />
            </div>
          </div>

          {/* Seção 5: Gêneros e Idiomas */}
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Gêneros e Idiomas</h4>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Gêneros (separar por vírgula)</label>
                <input
                  type="text"
                  value={formData.genres?.join(', ')}
                  onChange={(e) => handleArrayFieldChange('genres', e.target.value)}
                  placeholder="MPB, Rock, Samba..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Idiomas (separar por vírgula)</label>
                <input
                  type="text"
                  value={formData.languages?.join(', ')}
                  onChange={(e) => handleArrayFieldChange('languages', e.target.value)}
                  placeholder="Português, Inglês..."
                />
              </div>
            </div>
          </div>

          {/* Seção 6: Faixas e Imagem */}
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Faixas e Imagem</h4>
            <div className={styles.formGroup}>
              <label>Faixas em Destaque (separar por vírgula)</label>
              <input
                type="text"
                value={formData.highlightTracks?.join(', ')}
                onChange={(e) => handleArrayFieldChange('highlightTracks', e.target.value)}
                placeholder="Música 1 - Artista, Música 2 - Artista..."
              />
            </div>
            <div className={styles.formGroup}>
              <label>URL da Capa (imagem)</label>
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              <small>Deixe em branco para usar imagem padrão</small>
            </div>
            {formData.coverImage && (
              <div className={styles.imagePreview}>
                <img 
                  src={formData.coverImage} 
                  alt="Preview" 
                  onError={(e) => (e.currentTarget.src = 'https://i.scdn.co/image/ab67706f0000000298c5a2e6')} 
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.formFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            <FaSave /> {isEditing ? 'Salvar Alterações' : 'Adicionar Playlist'}
          </button>
        </div>
      </div>
    </div>
  );
}