// frontend/src/pages/Filmes.tsx (versão com CSS Modules puro)

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaClock,
  FaCalendarCheck,
  FaCalendarTimes,
  FaFilm,
  FaStar,
  FaUser,
  FaShareAlt,
  FaHeart,
  FaBookmark,
  FaRegHeart,
  FaRegBookmark,
  FaFilter,
  FaSearch,
  FaEye,
  FaFire,
  FaAward,
  FaTag,
  FaCopy,
  FaTwitter,
  FaImages,
  FaMusic,
  FaExternalLinkAlt,
  FaHeadphones,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaUpload,
  FaImage,
  FaArrowRight,
} from 'react-icons/fa';
import styles from '../styles/Filmes.module.css';
import { useTheme } from '../components/context/ThemeContext';
import { useFilmes, type CreateFilmePayload, type UpdateFilmePayload } from '../hooks/useFilmes';
import { getPlaceholderImage } from '../utils/imageUtils';

const PLACEHOLDER_IMAGE = getPlaceholderImage();

export default function Filmes() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const {
    filmes: filmesBackend,
    isLoading,
    error: backendError,
    toast,
    stats,
    createFilme,
    updateFilme,
    removeFilme,
    setSearch: setBackendSearch,
    resetFilters,
    refetch,
  } = useFilmes({ limit: 100 });

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<any>(null);
  const [showFilmeForm, setShowFilmeForm] = useState(false);
  const [editingFilme, setEditingFilme] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const [filmeForm, setFilmeForm] = useState<Partial<CreateFilmePayload>>({
    title: '',
    director: '',
    year: new Date().getFullYear(),
    date: '',
    description: '',
    imageUrl: '',
    screenplay: '',
    cast: '',
    genre: '',
    duration: '',
    language: '',
    materialsLink: '',
    playlistLink: '',
    playlistId: '',
    awardsNames: [],
    tagNames: [],
  });

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'realized' | 'upcoming'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const [loadingYouTube, setLoadingYouTube] = useState(false);

  // Usuário
  useEffect(() => {
    const storedUser = localStorage.getItem('cinemar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  // Favoritos / Watchlist
  useEffect(() => {
    const storedFavorites = localStorage.getItem('cinemar_favorites');
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));

    const storedWatchlist = localStorage.getItem('cinemar_watchlist');
    if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));
  }, []);

  useEffect(() => {
    localStorage.setItem('cinemar_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('cinemar_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setBackendSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, setBackendSearch]);

  // Filmes filtrados
  const filmesFiltrados = useMemo(() => {
    let filtered = filmesBackend;

    if (activeFilter === 'realized') {
      filtered = filtered.filter((f) => f.status === 'Realizado');
    } else if (activeFilter === 'upcoming') {
      filtered = filtered.filter((f) => f.status === 'Próximo');
    }

    return filtered;
  }, [filmesBackend, activeFilter]);

  const [selectedFilme, setSelectedFilme] = useState<any>(null);

  useEffect(() => {
    if (
      filmesFiltrados.length > 0 &&
      (!selectedFilme || !filmesFiltrados.find((f) => f.id === selectedFilme.id))
    ) {
      setSelectedFilme(filmesFiltrados[0]);
    }
  }, [filmesFiltrados, selectedFilme]);

  const navigateToFotos = (filmeId: string, filmeTitulo: string, fotoId?: string) => {
    let url = `/fotos?filmeId=${filmeId}&titulo=${encodeURIComponent(filmeTitulo)}&tipo=filme`;
    if (fotoId) {
      url += `&fotoId=${fotoId}`;
    }
    navigate(url);
  };

  // Handlers de interação
  const toggleFavorite = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  }, []);

  const toggleWatchlist = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((watchId) => watchId !== id) : [...prev, id]
    );
  }, []);

  const handleImageError = useCallback((id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  }, []);

  const shareFilme = () => {
    if (selectedFilme && navigator.share) {
      navigator.share({
        title: `CineMar: ${selectedFilme.title}`,
        text: `Confira "${selectedFilme.title}" no CineMar!`,
        url: window.location.href,
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareMenu(false);
  };

  const handleGoToMaterials = useCallback(() => {
    if (selectedFilme?.materialsLink) {
      setLoadingMaterials(true);
      window.location.href = selectedFilme.materialsLink;
      setTimeout(() => setLoadingMaterials(false), 500);
    }
  }, [selectedFilme]);

  const handleGoToCineMarPlaylist = useCallback(() => {
    setLoadingPlaylist(true);
    navigate(`/playlists?playlistId=${selectedFilme?.playlistId || selectedFilme?.id}`);
    setTimeout(() => setLoadingPlaylist(false), 500);
  }, [selectedFilme, navigate]);

  const handleOpenExternalPlaylist = useCallback(() => {
    if (selectedFilme?.playlistLink) {
      setLoadingYouTube(true);
      window.open(selectedFilme.playlistLink, '_blank');
      setTimeout(() => setLoadingYouTube(false), 500);
    }
  }, [selectedFilme]);

  const scheduleFilme = useCallback(() => {
    if (!selectedFilme) return;

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `CineMar: ${selectedFilme.title}`
    )}&details=${encodeURIComponent(
      `${selectedFilme.description}\n\nDiretor: ${selectedFilme.director}\nLocal: Auditório Principal - CineMar`
    )}&location=${encodeURIComponent('Auditório Principal - CineMar')}`;
    window.open(googleCalendarUrl, '_blank');
  }, [selectedFilme]);

  // CRUD
  const handleAddFilme = async () => {
    if (!filmeForm.title || !filmeForm.director || !filmeForm.date) return;

    setUploading(true);

    const fotosMetadata = selectedFiles.map((file, index) => ({
      titulo: file.name,
      descricao: '',
      tipo: 'gallery',
      principal: index === 0 && !filmeForm.imageUrl,
      ordem: index,
    }));

    const payload: CreateFilmePayload = {
      title: filmeForm.title!,
      director: filmeForm.director!,
      year: filmeForm.year || new Date().getFullYear(),
      date: filmeForm.date!,
      description: filmeForm.description || '',
      imageUrl: filmeForm.imageUrl,
      screenplay: filmeForm.screenplay || '',
      cast: filmeForm.cast || '',
      genre: filmeForm.genre || '',
      duration: filmeForm.duration,
      language: filmeForm.language,
      materialsLink: filmeForm.materialsLink,
      playlistLink: filmeForm.playlistLink,
      playlistId: filmeForm.playlistId,
      awardsNames: filmeForm.awardsNames || [],
      tagNames: filmeForm.tagNames || [],
      fotos: fotosMetadata,
    };

    await createFilme(payload, selectedFiles);
    resetFilmeForm();
    setSelectedFiles([]);
    setShowFilmeForm(false);
    setUploading(false);
  };

  const handleEditFilme = async () => {
    if (!editingFilme) return;

    setUploading(true);

    const fotosMetadata = selectedFiles.map((file, index) => ({
      titulo: file.name,
      descricao: '',
      tipo: 'gallery',
      principal: false,
      ordem: index,
    }));

    const payload: UpdateFilmePayload = {
      title: filmeForm.title,
      director: filmeForm.director,
      year: filmeForm.year,
      date: filmeForm.date,
      description: filmeForm.description,
      imageUrl: filmeForm.imageUrl,
      screenplay: filmeForm.screenplay,
      cast: filmeForm.cast,
      genre: filmeForm.genre,
      duration: filmeForm.duration,
      language: filmeForm.language,
      materialsLink: filmeForm.materialsLink,
      playlistLink: filmeForm.playlistLink,
      playlistId: filmeForm.playlistId,
      awardsNames: filmeForm.awardsNames,
      tagNames: filmeForm.tagNames,
      adicionarFotos: fotosMetadata,
    };

    await updateFilme(editingFilme.id, payload, selectedFiles);
    resetFilmeForm();
    setSelectedFiles([]);
    setShowFilmeForm(false);
    setEditingFilme(null);
    setUploading(false);
  };

  const handleDeleteFilme = async (id: string) => {
    if (confirmDelete === id) {
      await removeFilme(id);
      setConfirmDelete(null);
      if (selectedFilme?.id === id) setSelectedFilme(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const openEditFilme = (filme: any) => {
    setFilmeForm({
      title: filme.title,
      director: filme.director,
      year: filme.year,
      date: filme.date,
      description: filme.description,
      imageUrl: filme.imageUrl,
      screenplay: filme.screenplay,
      cast: filme.cast,
      genre: filme.genre,
      duration: filme.duration,
      language: filme.language,
      materialsLink: filme.materialsLink,
      playlistLink: filme.playlistLink,
      playlistId: filme.playlistId,
      awardsNames: filme.awards?.map((a: any) => a.name) || [],
      tagNames: filme.tags?.map((t: any) => t.name) || [],
    });
    setEditingFilme(filme);
    setShowFilmeForm(true);
    setSelectedFiles([]);
  };

  const resetFilmeForm = () => {
    setFilmeForm({
      title: '',
      director: '',
      year: new Date().getFullYear(),
      date: '',
      description: '',
      imageUrl: '',
      screenplay: '',
      cast: '',
      genre: '',
      duration: '',
      language: '',
      materialsLink: '',
      playlistLink: '',
      playlistId: '',
      awardsNames: [],
      tagNames: [],
    });
    setEditingFilme(null);
    setSelectedFiles([]);
  };

  const handleArrayFieldChange = (field: 'awardsNames' | 'tagNames', value: string) => {
    const array = value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item);
    setFilmeForm({ ...filmeForm, [field]: array });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveFilter('all');
    resetFilters();
  };

  const getFilmeImageUrl = (filme: any) => {
    if (imageErrors[filme.id]) return PLACEHOLDER_IMAGE;
    if (filme.imageUrl) return filme.imageUrl;
    if (filme.filmesFotos?.length > 0) {
      const principal =
        filme.filmesFotos.find((f: any) => f.principal) || filme.filmesFotos[0];
      return principal.path;
    }
    return PLACEHOLDER_IMAGE;
  };

  if (isLoading && filmesBackend.length === 0) {
    return (
      <div className={`${styles.filmesContainer} ${isDarkMode ? styles.dark : ''}`}>
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.loadingSpinner} />
          <p>Carregando catálogo de filmes...</p>
        </div>
      </div>
    );
  }

  if (backendError && filmesBackend.length === 0) {
    return (
      <div className={`${styles.filmesContainer} ${isDarkMode ? styles.dark : ''}`}>
        <div className={styles.errorContainer}>
          <FaExclamationTriangle />
          <h3>Erro ao carregar filmes</h3>
          <p>{backendError}</p>
          <button onClick={() => refetch()}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.filmesContainer} ${isDarkMode ? styles.dark : ''}`}>
      {/* HEADER */}
      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={styles.backLink}>
              ← Voltar para sessões
            </Link>
          </div>

          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>CATÁLOGO DE FILMES</h1>
            <p className={styles.heroSubtitle}>
              Explore todos os filmes já exibidos e as próximas sessões do CineMar
            </p>

            {stats && (
              <div className={styles.heroStats}>
                <span>{stats.realizados} realizados</span>
                <span>{stats.proximos} próximos</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* BOTÃO FLUTUANTE ADMIN */}
      {isAdmin && (
        <button
          className={styles.floatingAddBtn}
          onClick={() => {
            resetFilmeForm();
            setShowFilmeForm(true);
          }}
          title="Adicionar filme"
        >
          <FaPlus />
        </button>
      )}

      {/* FORMULÁRIO */}
      {showFilmeForm && isAdmin && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h3>{editingFilme ? 'Editar Filme' : 'Novo Filme'}</h3>
              <button
                onClick={() => {
                  setShowFilmeForm(false);
                  resetFilmeForm();
                }}
                className={styles.formClose}
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.formBody}>
              {/* Identificação */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Identificação</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Título *</label>
                    <input
                      type="text"
                      value={filmeForm.title}
                      onChange={(e) => setFilmeForm({ ...filmeForm, title: e.target.value })}
                      placeholder="Nome do filme"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Diretor *</label>
                    <input
                      type="text"
                      value={filmeForm.director}
                      onChange={(e) => setFilmeForm({ ...filmeForm, director: e.target.value })}
                      placeholder="Nome do diretor"
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Ano</label>
                    <input
                      type="number"
                      value={filmeForm.year}
                      onChange={(e) =>
                        setFilmeForm({ ...filmeForm, year: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Data da Sessão *</label>
                    <input
                      type="text"
                      value={filmeForm.date}
                      onChange={(e) => setFilmeForm({ ...filmeForm, date: e.target.value })}
                      placeholder="29 de Março, 2025"
                    />
                  </div>
                </div>
              </div>

              {/* Sinopse */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Sinopse</h4>
                <div className={styles.formGroup}>
                  <textarea
                    rows={4}
                    value={filmeForm.description}
                    onChange={(e) => setFilmeForm({ ...filmeForm, description: e.target.value })}
                    placeholder="Sinopse do filme..."
                  />
                </div>
              </div>

              {/* Ficha Técnica */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Ficha Técnica</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Roteiro</label>
                    <input
                      type="text"
                      value={filmeForm.screenplay}
                      onChange={(e) => setFilmeForm({ ...filmeForm, screenplay: e.target.value })}
                      placeholder="Nome do roteirista"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Elenco Principal</label>
                    <input
                      type="text"
                      value={filmeForm.cast}
                      onChange={(e) => setFilmeForm({ ...filmeForm, cast: e.target.value })}
                      placeholder="Atores principais"
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Gênero</label>
                    <input
                      type="text"
                      value={filmeForm.genre}
                      onChange={(e) => setFilmeForm({ ...filmeForm, genre: e.target.value })}
                      placeholder="Drama, Comédia, etc"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Duração</label>
                    <input
                      type="text"
                      value={filmeForm.duration}
                      onChange={(e) => setFilmeForm({ ...filmeForm, duration: e.target.value })}
                      placeholder="2h 15min"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Idioma</label>
                  <input
                    type="text"
                    value={filmeForm.language}
                    onChange={(e) => setFilmeForm({ ...filmeForm, language: e.target.value })}
                    placeholder="Português, Inglês, etc"
                  />
                </div>
              </div>

              {/* Links */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Links</h4>
                <div className={styles.formGroup}>
                  <label>URL da Imagem (Poster)</label>
                  <input
                    type="text"
                    value={filmeForm.imageUrl}
                    onChange={(e) => setFilmeForm({ ...filmeForm, imageUrl: e.target.value })}
                    placeholder="https://exemplo.com/poster.jpg"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Link dos Materiais</label>
                  <input
                    type="text"
                    value={filmeForm.materialsLink}
                    onChange={(e) => setFilmeForm({ ...filmeForm, materialsLink: e.target.value })}
                    placeholder="https://drive.google.com/..."
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Playlist ID (Spotify)</label>
                    <input
                      type="text"
                      value={filmeForm.playlistId}
                      onChange={(e) => setFilmeForm({ ...filmeForm, playlistId: e.target.value })}
                      placeholder="ID da playlist do Spotify"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Link da Playlist (YouTube)</label>
                    <input
                      type="text"
                      value={filmeForm.playlistLink}
                      onChange={(e) => setFilmeForm({ ...filmeForm, playlistLink: e.target.value })}
                      placeholder="https://youtube.com/playlist?list=..."
                    />
                  </div>
                </div>
              </div>

              {/* Prêmios e Tags */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Prêmios e Tags</h4>
                <div className={styles.formGroup}>
                  <label>Prêmios (separados por vírgula)</label>
                  <input
                    type="text"
                    value={filmeForm.awardsNames?.join(', ')}
                    onChange={(e) => handleArrayFieldChange('awardsNames', e.target.value)}
                    placeholder="Oscar de Melhor Filme, Cannes, etc"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={filmeForm.tagNames?.join(', ')}
                    onChange={(e) => handleArrayFieldChange('tagNames', e.target.value)}
                    placeholder="Drama, Nacional, Premiado, etc"
                  />
                </div>
              </div>

              {/* Upload de Fotos */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Galeria de Fotos</h4>
                <div className={styles.fileInputArea}>
                  <label className={styles.fileInputLabel}>
                    <FaUpload /> Selecionar Fotos
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <small>Selecione várias imagens para a galeria</small>
                </div>
                {selectedFiles.length > 0 && (
                  <div className={styles.selectedFiles}>
                    <h5>Fotos selecionadas ({selectedFiles.length})</h5>
                    <div className={styles.fileList}>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className={styles.fileItem}>
                          <FaImage />
                          <span className={styles.fileName}>{file.name}</span>
                          <span className={styles.fileSize}>
                            {(file.size / 1024).toFixed(0)} KB
                          </span>
                          <button onClick={() => removeSelectedFile(index)}>
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setShowFilmeForm(false);
                  resetFilmeForm();
                }}
              >
                Cancelar
              </button>
              <button
                className={styles.submitBtn}
                onClick={editingFilme ? handleEditFilme : handleAddFilme}
                disabled={uploading}
              >
                {uploading && <FaSpinner className={styles.spinnerInline} />}
                <FaSave />
                {editingFilme ? 'Salvar Alterações' : 'Adicionar Filme'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <div className={styles.mainLayout}>
        {/* SIDEBAR */}
        <div className={styles.sidebarWrapper}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>
                <FaFilter /> Programação
              </h2>
              <span className={styles.totalFilmes}>{filmesFiltrados.length} filmes</span>
            </div>

            <div className={styles.filters}>
              <div className={styles.filterButtons}>
                <button
                  className={`${styles.filterBtn} ${activeFilter === 'all' ? styles.active : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  Todos
                </button>
                <button
                  className={`${styles.filterBtn} ${activeFilter === 'realized' ? styles.active : ''}`}
                  onClick={() => setActiveFilter('realized')}
                >
                  Realizados
                </button>
                <button
                  className={`${styles.filterBtn} ${activeFilter === 'upcoming' ? styles.active : ''}`}
                  onClick={() => setActiveFilter('upcoming')}
                >
                  Próximos
                </button>
              </div>

              <div className={styles.searchBox}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Buscar filme, diretor ou gênero..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className={styles.clearSearch} onClick={() => setSearchTerm('')}>
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            <div className={styles.filmeList}>
              {filmesFiltrados.length === 0 ? (
                <div className={styles.emptyState}>
                  <FaExclamationTriangle className={styles.emptyStateIcon} />
                  <p>Nenhum filme encontrado para a busca "{searchTerm}"</p>
                  <button className={styles.clearFiltersBtn} onClick={clearAllFilters}>
                    Limpar filtros
                  </button>
                </div>
              ) : (
                filmesFiltrados.map((filme) => (
                  <div
                    key={filme.id}
                    className={`${styles.filmeListItem} ${
                      selectedFilme?.id === filme.id ? styles.active : ''
                    } ${filme.highlight ? styles.highlighted : ''}`}
                    onClick={() => setSelectedFilme(filme)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedFilme(filme)}
                  >
                    <div className={styles.listItemImage}>
                      <img
                        src={getFilmeImageUrl(filme)}
                        alt={filme.title}
                        className={styles.filmeThumbnail}
                        onError={() => handleImageError(filme.id)}
                        loading="lazy"
                      />
                      {filme.status === 'Próximo' && (
                        <div className={styles.upcomingBadge}>
                          <FaFire /> PRÓXIMO
                        </div>
                      )}
                      {filme.status === 'Realizado' && (
                        <div className={styles.realizedBadge}>
                          <FaCalendarCheck /> EXIBIDO
                        </div>
                      )}
                    </div>

                    <div className={styles.listItemContent}>
                      <div className={styles.listItemHeader}>
                        <div className={styles.filmeNumber}>#{filme.numero}</div>
                        <div className={styles.itemActions}>
                          <button
                            className={`${styles.actionBtn} ${
                              favorites.includes(filme.id) ? styles.active : ''
                            }`}
                            onClick={(e) => toggleFavorite(filme.id, e)}
                            title={favorites.includes(filme.id) ? 'Remover favorito' : 'Favoritar'}
                          >
                            {favorites.includes(filme.id) ? <FaHeart /> : <FaRegHeart />}
                          </button>
                          <button
                            className={`${styles.actionBtn} ${
                              watchlist.includes(filme.id) ? styles.active : ''
                            }`}
                            onClick={(e) => toggleWatchlist(filme.id, e)}
                            title={watchlist.includes(filme.id) ? 'Remover da lista' : 'Adicionar à lista'}
                          >
                            {watchlist.includes(filme.id) ? <FaBookmark /> : <FaRegBookmark />}
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                className={styles.actionBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditFilme(filme);
                                }}
                                title="Editar"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className={`${styles.actionBtn} ${
                                  confirmDelete === filme.id ? styles.confirmingDelete : ''
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFilme(filme.id);
                                }}
                                title={confirmDelete === filme.id ? 'Confirmar exclusão?' : 'Excluir'}
                              >
                                {confirmDelete === filme.id ? <FaTimes /> : <FaTrash />}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className={styles.listItemTitle}>{filme.title}</div>
                      <div className={styles.listItemMeta}>
                        <span className={styles.listItemYear}>{filme.year}</span>
                        <span className={styles.listItemDirector}>
                          <FaUser /> {filme.director.split(' e ')[0]}
                        </span>
                      </div>
                      <div className={styles.listItemFooter}>
                        <div className={styles.listItemDate}>
                          <FaCalendarAlt /> {filme.date.split(',')[0]}
                        </div>
                        <div className={`${styles.filmeStatus} ${styles[filme.status.toLowerCase()]}`}>
                          {filme.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* DETALHES */}
        <div className={styles.detailsWrapper}>
          {selectedFilme ? (
            <div className={styles.detailsInner}>
              {/* Header */}
              <div className={styles.detailsHeader}>
                <div className={styles.titleSection}>
                  <div className={styles.titleWrapper}>
                    <h2 className={styles.detailsTitle}>{selectedFilme.title}</h2>
                    {selectedFilme.highlight && selectedFilme.status === 'Próximo' && (
                      <div className={styles.highlightBadge}>
                        <FaFire /> DESTAQUE
                      </div>
                    )}
                  </div>
                  <div className={styles.metaInfo}>
                    <span>{selectedFilme.year}</span>
                    {selectedFilme.genre && (
                      <>
                        <span>•</span>
                        <span>
                          <FaTag className="inline" /> {selectedFilme.genre}
                        </span>
                      </>
                    )}
                    {selectedFilme.duration && (
                      <>
                        <span>•</span>
                        <span>
                          <FaClock className="inline" /> {selectedFilme.duration}
                        </span>
                      </>
                    )}
                    {selectedFilme.views && (
                      <>
                        <span>•</span>
                        <span>
                          <FaEye className="inline" /> {selectedFilme.views.toLocaleString()} visualizações
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.actionButtonsGroup}>
                  <div className={styles.ratingBadge}>
                    <FaStar />
                    {selectedFilme.rating?.toFixed(1) || '0.0'}
                    <span className={styles.ratingCount}>({selectedFilme.reviewCount || 0})</span>
                  </div>

                  <button
                    className={`${styles.iconButtonRound} ${
                      favorites.includes(selectedFilme.id) ? styles.iconButtonActive : ''
                    }`}
                    onClick={(e) => toggleFavorite(selectedFilme.id, e)}
                    title={favorites.includes(selectedFilme.id) ? 'Remover favorito' : 'Favoritar'}
                  >
                    {favorites.includes(selectedFilme.id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                  
                  <button
                    className={`${styles.iconButtonRound} ${
                      watchlist.includes(selectedFilme.id) ? styles.iconButtonWatchlistActive : ''
                    }`}
                    onClick={(e) => toggleWatchlist(selectedFilme.id, e)}
                    title={watchlist.includes(selectedFilme.id) ? 'Remover da lista' : 'Adicionar à lista'}
                  >
                    {watchlist.includes(selectedFilme.id) ? <FaBookmark /> : <FaRegBookmark />}
                  </button>
                  
                  <div className={styles.shareContainer} ref={shareRef}>
                    <button className={styles.iconButtonRound} onClick={shareFilme} title="Compartilhar">
                      <FaShareAlt />
                    </button>
                    {showShareMenu && (
                      <div className={styles.shareMenu}>
                        <button onClick={copyLink}>
                          <FaCopy /> Copiar link
                        </button>
                        <a
                          href={`https://twitter.com/intent/tweet?text=Confira "${selectedFilme.title}" no CineMar!&url=${window.location.href}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.twitterShare}
                        >
                          <FaTwitter /> Compartilhar no Twitter
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {isAdmin && (
                    <>
                      <button
                        className={styles.iconButtonRound}
                        onClick={() => openEditFilme(selectedFilme)}
                        title="Editar filme"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={`${styles.iconButtonRound} ${
                          confirmDelete === selectedFilme.id ? styles.iconButtonActive : ''
                        }`}
                        onClick={() => handleDeleteFilme(selectedFilme.id)}
                        title={confirmDelete === selectedFilme.id ? 'Confirmar exclusão?' : 'Excluir filme'}
                      >
                        {confirmDelete === selectedFilme.id ? <FaTimes /> : <FaTrash />}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Conteúdo principal */}
              <div className={styles.contentColumns}>
                {/* Coluna esquerda */}
                <div className={styles.leftColumnDetails}>
                  <div className={styles.posterWrapper}>
                    <img
                      src={getFilmeImageUrl(selectedFilme)}
                      alt={selectedFilme.title}
                      className={styles.posterImage}
                      onError={() => handleImageError(selectedFilme.id)}
                      loading="lazy"
                    />
                    <div className={styles.statusOverlay}>
                      <span className={`${styles.statusBadgeSmall} ${
                        selectedFilme.status === 'Próximo' ? styles.statusUpcoming : styles.statusRealized
                      }`}>
                        {selectedFilme.status === 'Próximo' ? 'EM BREVE' : 'EXIBIDO'}
                      </span>
                    </div>
                  </div>

                  <div className={styles.infoCards}>
                    <div className={styles.infoCard}>
                      <FaCalendarAlt className={styles.infoCardIcon} />
                      <div className={styles.infoCardContent}>
                        <h4 className={styles.infoCardLabel}>Data</h4>
                        <p className={styles.infoCardValue}>{selectedFilme.date}</p>
                      </div>
                    </div>
                    <div className={styles.infoCard}>
                      <FaUser className={styles.infoCardIcon} />
                      <div className={styles.infoCardContent}>
                        <h4 className={styles.infoCardLabel}>Diretor</h4>
                        <p className={styles.infoCardValue}>{selectedFilme.director}</p>
                      </div>
                    </div>
                    {selectedFilme.duration && (
                      <div className={styles.infoCard}>
                        <FaClock className={styles.infoCardIcon} />
                        <div className={styles.infoCardContent}>
                          <h4 className={styles.infoCardLabel}>Duração</h4>
                          <p className={styles.infoCardValue}>{selectedFilme.duration}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Coluna direita */}
                <div className={styles.rightColumnDetails}>
                  {/* Sinopse */}
                  <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Sinopse</h3>
                    <p className={styles.synopsis}>{selectedFilme.description}</p>
                  </div>

                  {/* Ficha Técnica */}
                  <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Ficha Técnica</h3>
                    <div className={styles.technicalSheet}>
                      <div className={styles.techRow}>
                        <strong className={styles.techLabel}>Roteiro:</strong>
                        <span className={styles.techValue}>{selectedFilme.screenplay}</span>
                      </div>
                      <div className={styles.techRow}>
                        <strong className={styles.techLabel}>Elenco Principal:</strong>
                        <span className={styles.techValue}>{selectedFilme.cast}</span>
                      </div>
                      {selectedFilme.language && (
                        <div className={styles.techRow}>
                          <strong className={styles.techLabel}>Idioma:</strong>
                          <span className={styles.techValue}>{selectedFilme.language}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prêmios */}
                  {selectedFilme.awards && selectedFilme.awards.length > 0 && (
                    <div className={styles.section}>
                      <h3 className={styles.sectionTitle}>Prêmios</h3>
                      <div className={styles.tagsContainer}>
                        {selectedFilme.awards.map((award: any, index: number) => (
                          <div key={index} className={styles.awardItem}>
                            <FaAward /> {award.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedFilme.tags && selectedFilme.tags.length > 0 && (
                    <div className={styles.section}>
                      <h3 className={styles.sectionTitle}>Tags</h3>
                      <div className={styles.tagsContainer}>
                        {selectedFilme.tags.map((tag: any, index: number) => (
                          <span key={index} className={styles.tag}>
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Galeria de Fotos */}
                  <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                      <FaImages className="inline" /> Galeria de Fotos
                    </h3>
                    
                    {selectedFilme.filmesFotos && selectedFilme.filmesFotos.length > 0 ? (
                      <div className={styles.photosGrid}>
                        {selectedFilme.filmesFotos.slice(0, 8).map((foto: any) => (
                          <div 
                            key={foto.id} 
                            className={styles.photoItem}
                            onClick={() => navigateToFotos(selectedFilme.id, selectedFilme.title, foto.id)}
                          >
                            <img
                              src={foto.path}
                              alt={foto.titulo}
                              className={styles.photoImage}
                              onError={(e) => {
                                e.currentTarget.src = PLACEHOLDER_IMAGE;
                              }}
                            />
                            {foto.principal && (
                              <span className={styles.photoBadge}>Principal</span>
                            )}
                          </div>
                        ))}
                        {selectedFilme.filmesFotos.length > 8 && (
                          <div 
                            className={styles.morePhotos}
                            onClick={() => navigateToFotos(selectedFilme.id, selectedFilme.title)}
                          >
                            <div className={styles.morePhotosContent}>
                              <FaImages className={styles.morePhotosIcon} />
                              <span>+{selectedFilme.filmesFotos.length - 8}</span>
                              <p>Ver todas</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={styles.emptyGallery}>
                        <FaImages className={styles.emptyGalleryIcon} />
                        <p>Este filme ainda não possui fotos na galeria.</p>
                        {isAdmin && (
                          <button 
                            className={styles.adicionarFotosBtn}
                            onClick={() => openEditFilme(selectedFilme)}
                          >
                            <FaPlus /> Adicionar fotos
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Acessos */}
                  {selectedFilme.status === 'Realizado' && (
                    <div className={styles.section}>
                      <h3 className={styles.sectionTitle}>Acessos Disponíveis</h3>
                      <div className={styles.accessGrid}>
                        {selectedFilme.materialsLink && (
                          <button
                            className={styles.accessButton}
                            onClick={handleGoToMaterials}
                            disabled={loadingMaterials}
                          >
                            <FaImages className={styles.accessButtonIcon} style={{ color: '#3b82f6' }} />
                            <div className={styles.accessButtonContent}>
                              <div className={styles.accessButtonTitle}>Materiais do Debate</div>
                              <div className={styles.accessButtonSubtitle}>Fotos e documentos</div>
                            </div>
                            {loadingMaterials && <FaSpinner className={styles.spinnerInline} />}
                          </button>
                        )}

                        <button
                          className={styles.accessButton}
                          onClick={handleGoToCineMarPlaylist}
                          disabled={loadingPlaylist}
                        >
                          <FaHeadphones className={styles.accessButtonIcon} style={{ color: '#10b981' }} />
                          <div className={styles.accessButtonContent}>
                            <div className={styles.accessButtonTitle}>Playlist Oficial</div>
                            <div className={styles.accessButtonSubtitle}>CineMar no Spotify</div>
                          </div>
                          {loadingPlaylist && <FaSpinner className={styles.spinnerInline} />}
                        </button>

                        {selectedFilme.playlistLink && (
                          <button
                            className={styles.accessButton}
                            onClick={handleOpenExternalPlaylist}
                            disabled={loadingYouTube}
                          >
                            <FaMusic className={styles.accessButtonIcon} style={{ color: '#8b5cf6' }} />
                            <div className={styles.accessButtonContent}>
                              <div className={styles.accessButtonTitle}>Trilha Sonora</div>
                              <div className={styles.accessButtonSubtitle}>YouTube Music</div>
                            </div>
                            {loadingYouTube && <FaSpinner className={styles.spinnerInline} />}
                            <FaExternalLinkAlt className={styles.externalIcon} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ações */}
                  <div className={styles.actionButtonsRow}>
                    {selectedFilme.status === 'Próximo' ? (
                      <>
                        <button className={styles.primaryActionButton} onClick={scheduleFilme}>
                          <FaCalendarCheck /> Adicionar à Agenda
                        </button>
                        <button className={styles.secondaryActionButton} onClick={shareFilme}>
                          <FaShareAlt /> Compartilhar
                        </button>
                      </>
                    ) : (
                      <div className={styles.pastFilmNotice}>
                        <FaCalendarTimes className="inline" /> Filme realizado em {selectedFilme.date}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FaFilm className={styles.emptyStateIcon} />
              <h3 className={styles.emptyStateTitle}>Nenhum filme selecionado</h3>
              <p className={styles.emptyStateText}>Selecione um filme na lista ao lado</p>
            </div>
          )}
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className={`${styles.toastResponsive} ${
          toast.type === 'success' ? styles.toastSuccess : 
          toast.type === 'error' ? styles.toastError : 
          styles.toastWarn
        }`}>
          {toast.type === 'success' && <FaCalendarCheck />}
          {toast.type === 'error' && <FaExclamationTriangle />}
          {toast.type === 'warn' && <FaExclamationTriangle />}
          <span className={styles.toastMessage}>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}