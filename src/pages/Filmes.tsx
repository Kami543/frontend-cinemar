// frontend/src/pages/Filmes.tsx

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
  FaCamera,
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
  
  // Estados para o modal de capa
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

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

  // FUNÇÃO PARA ATUALIZAR A CAPA DO FILME
  const handleUpdateCover = async () => {
    if (!selectedFilme || !newCoverImage) return;
    
    setUploadingCover(true);
    const formData = new FormData();
    formData.append('coverImage', newCoverImage);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/filmes/${selectedFilme.id}/cover`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (response.ok) {
        const updatedFilme = await response.json();
        setSelectedFilme(updatedFilme);
        // Atualizar a lista de filmes
        refetch();
        setShowCoverModal(false);
        setNewCoverImage(null);
        setCoverPreview(null);
        // Mostrar toast de sucesso (opcional)
      } else {
        console.error('Erro ao atualizar capa');
      }
    } catch (error) {
      console.error('Erro ao atualizar capa:', error);
    } finally {
      setUploadingCover(false);
    }
  };

  // Função para selecionar nova capa
  const handleCoverFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewCoverImage(file);
      // Criar preview
      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);
    }
  };

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

      {/* CONTEÚDO PRINCIPAL */}
      <div className={styles.filmesContent}>
        {/* SIDEBAR */}
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
              <div className={styles.noResults}>
                <FaExclamationTriangle />
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
                  }`}
                  onClick={() => setSelectedFilme(filme)}
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

        {/* DETALHES */}
        <div className={styles.filmeDetails}>
          {selectedFilme ? (
            <div className={styles.detailsContainer}>
              {/* Header */}
              <div className={styles.detailsHeader}>
                <div className={styles.titleSection}>
                  <div className={styles.titleRow}>
                    <h2 className={styles.detailsTitle}>{selectedFilme.title}</h2>
                    {selectedFilme.highlight && selectedFilme.status === 'Próximo' && (
                      <div className={styles.highlightBadge}>
                        <FaFire /> DESTAQUE
                      </div>
                    )}
                  </div>
                  <div className={styles.titleMeta}>
                    <span className={styles.detailsYear}>{selectedFilme.year}</span>
                    {selectedFilme.genre && (
                      <span className={styles.detailsGenre}>
                        <FaTag /> {selectedFilme.genre}
                      </span>
                    )}
                    {selectedFilme.duration && (
                      <span className={styles.detailsDuration}>
                        <FaClock /> {selectedFilme.duration}
                      </span>
                    )}
                    {selectedFilme.views && (
                      <span className={styles.detailsViews}>
                        <FaEye /> {selectedFilme.views.toLocaleString()} visualizações
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.actionButtonsTop}>
                  <div className={styles.ratingBadge}>
                    <FaStar className={styles.ratingIcon} />
                    <span className={styles.ratingValue}>{selectedFilme.rating?.toFixed(1) || '0.0'}</span>
                    <span className={styles.ratingCount}>({selectedFilme.reviewCount || 0})</span>
                  </div>
                  
                  <div className={styles.actionsRight}>
                    <button
                      className={`${styles.iconButton} ${
                        favorites.includes(selectedFilme.id) ? styles.active : ''
                      }`}
                      onClick={(e) => toggleFavorite(selectedFilme.id, e)}
                      title={favorites.includes(selectedFilme.id) ? 'Remover favorito' : 'Favoritar'}
                    >
                      {favorites.includes(selectedFilme.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    
                    <button
                      className={`${styles.iconButton} ${
                        watchlist.includes(selectedFilme.id) ? styles.active : ''
                      }`}
                      onClick={(e) => toggleWatchlist(selectedFilme.id, e)}
                      title={watchlist.includes(selectedFilme.id) ? 'Remover da lista' : 'Adicionar à lista'}
                    >
                      {watchlist.includes(selectedFilme.id) ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                    
                    <div className={styles.shareContainer} ref={shareRef}>
                      <button className={styles.iconButton} onClick={shareFilme} title="Compartilhar">
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
                      <div className={styles.adminDetailsActions}>
                        <button
                          className={styles.iconButton}
                          onClick={() => openEditFilme(selectedFilme)}
                          title="Editar filme"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className={`${styles.iconButton} ${
                            confirmDelete === selectedFilme.id ? styles.confirmingDelete : ''
                          }`}
                          onClick={() => handleDeleteFilme(selectedFilme.id)}
                          title={confirmDelete === selectedFilme.id ? 'Confirmar exclusão?' : 'Excluir filme'}
                        >
                          {confirmDelete === selectedFilme.id ? <FaTimes /> : <FaTrash />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Conteúdo principal */}
              <div className={styles.detailsMainContent}>
                {/* Coluna esquerda */}
                <div className={styles.leftColumn}>
                  <div className={styles.posterContainer}>
                    <img
                      src={getFilmeImageUrl(selectedFilme)}
                      alt={selectedFilme.title}
                      className={styles.posterImage}
                      onError={() => handleImageError(selectedFilme.id)}
                    />
                    <div className={styles.filmeStatusBadge}>
                      <span className={`${styles.statusBadge} ${styles[selectedFilme.status.toLowerCase()]}`}>
                        {selectedFilme.status === 'Próximo' ? 'EM BREVE' : 'EXIBIDO'}
                      </span>
                    </div>
                    {/* BOTÃO PARA EDITAR CAPA */}
                    {isAdmin && (
                      <button
                        className={styles.editCoverBtn}
                        onClick={() => setShowCoverModal(true)}
                        title="Alterar foto de capa"
                      >
                        <FaCamera /> Alterar Capa
                      </button>
                    )}
                  </div>

                  <div className={styles.quickInfo}>
                    <div className={styles.infoCard}>
                      <FaCalendarAlt className={styles.infoIcon} />
                      <div>
                        <h4>Data</h4>
                        <p>{selectedFilme.date}</p>
                      </div>
                    </div>
                    <div className={styles.infoCard}>
                      <FaUser className={styles.infoIcon} />
                      <div>
                        <h4>Diretor</h4>
                        <p>{selectedFilme.director}</p>
                      </div>
                    </div>
                    {selectedFilme.duration && (
                      <div className={styles.infoCard}>
                        <FaClock className={styles.infoIcon} />
                        <div>
                          <h4>Duração</h4>
                          <p>{selectedFilme.duration}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Coluna direita */}
                <div className={styles.rightColumn}>
                  {/* Sinopse */}
                  <div className={styles.synopsisSection}>
                    <h3 className={styles.sectionTitle}>Sinopse</h3>
                    <p className={styles.synopsisText}>{selectedFilme.description}</p>
                  </div>

                  {/* Ficha Técnica */}
                  <div className={styles.technicalSection}>
                    <h3 className={styles.sectionTitle}>Ficha Técnica</h3>
                    <div className={styles.technicalInfo}>
                      <div className={styles.techRow}>
                        <strong>Roteiro:</strong>
                        <span>{selectedFilme.screenplay}</span>
                      </div>
                      <div className={styles.techRow}>
                        <strong>Elenco Principal:</strong>
                        <span>{selectedFilme.cast}</span>
                      </div>
                      {selectedFilme.language && (
                        <div className={styles.techRow}>
                          <strong>Idioma:</strong>
                          <span>{selectedFilme.language}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prêmios */}
                  {selectedFilme.awards && selectedFilme.awards.length > 0 && (
                    <div className={styles.awardsSection}>
                      <h3 className={styles.sectionTitle}>Prêmios</h3>
                      <div className={styles.awardsList}>
                        {selectedFilme.awards.map((award: any, index: number) => (
                          <div key={index} className={styles.awardItem}>
                            <FaAward className={styles.awardIcon} />
                            <span>{award.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedFilme.tags && selectedFilme.tags.length > 0 && (
                    <div className={styles.tagsSection}>
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
                  {selectedFilme.filmesFotos && selectedFilme.filmesFotos.length > 0 && (
                    <div className={styles.fotosSection}>
                      <div className={styles.fotosSectionHeader}>
                        <h3 className={styles.sectionTitle}>
                          <FaImages /> Galeria de Fotos
                        </h3>
                        <button 
                          className={styles.verTodasFotosBtn}
                          onClick={() => navigateToFotos(selectedFilme.id, selectedFilme.title)}
                        >
                          Ver todas <FaArrowRight />
                        </button>
                      </div>
                      <div className={styles.fotosGrid}>
                        {selectedFilme.filmesFotos.slice(0, 4).map((foto: any) => (
                          <div 
                            key={foto.id} 
                            className={styles.fotoItem}
                            onClick={() => navigateToFotos(selectedFilme.id, selectedFilme.title, foto.id)}
                          >
                            <img
                              src={foto.path}
                              alt={foto.titulo}
                              loading="lazy"
                            />
                            {foto.principal && (
                              <span className={styles.principalBadge}>Principal</span>
                            )}
                          </div>
                        ))}
                        {selectedFilme.filmesFotos.length > 4 && (
                          <div 
                            className={`${styles.fotoItem} ${styles.verMaisItem}`}
                            onClick={() => navigateToFotos(selectedFilme.id, selectedFilme.title)}
                          >
                            <div className={styles.verMaisContent}>
                              <FaImages />
                              <span>+{selectedFilme.filmesFotos.length - 4}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Acessos */}
                  {selectedFilme.status === 'Realizado' && (
                    <div className={styles.accessSection}>
                      <h3 className={styles.sectionTitle}>Acessos Disponíveis</h3>
                      <div className={styles.accessButtons}>
                        {selectedFilme.materialsLink && (
                          <button
                            className={styles.accessButton}
                            onClick={handleGoToMaterials}
                            disabled={loadingMaterials}
                          >
                            <FaImages className={styles.buttonIcon} />
                            <div className={styles.buttonInfo}>
                              <span className={styles.buttonTitle}>Materiais do Debate</span>
                              <span className={styles.buttonSubtitle}>Fotos e documentos</span>
                            </div>
                            {loadingMaterials && <FaSpinner className={styles.loadingSpinner} />}
                          </button>
                        )}

                        <button
                          className={`${styles.accessButton} ${styles.playlistButton}`}
                          onClick={handleGoToCineMarPlaylist}
                          disabled={loadingPlaylist}
                        >
                          <FaHeadphones className={styles.buttonIcon} />
                          <div className={styles.buttonInfo}>
                            <span className={styles.buttonTitle}>Playlist Oficial</span>
                            <span className={styles.buttonSubtitle}>CineMar no Spotify</span>
                          </div>
                          {loadingPlaylist && <FaSpinner className={styles.loadingSpinner} />}
                        </button>

                        {selectedFilme.playlistLink && (
                          <button
                            className={styles.accessButton}
                            onClick={handleOpenExternalPlaylist}
                            disabled={loadingYouTube}
                          >
                            <FaMusic className={styles.buttonIcon} />
                            <div className={styles.buttonInfo}>
                              <span className={styles.buttonTitle}>Trilha Sonora</span>
                              <span className={styles.buttonSubtitle}>YouTube Music</span>
                            </div>
                            {loadingYouTube && <FaSpinner className={styles.loadingSpinner} />}
                            <FaExternalLinkAlt className={styles.externalIcon} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ações principais */}
                  <div className={styles.mainActions}>
                    {selectedFilme.status === 'Próximo' ? (
                      <div className={styles.upcomingActions}>
                        <button className={styles.primaryButton} onClick={scheduleFilme}>
                          <FaCalendarCheck /> Adicionar à Agenda
                        </button>
                        <button className={styles.secondaryButton} onClick={shareFilme}>
                          <FaShareAlt /> Compartilhar
                        </button>
                      </div>
                    ) : (
                      <div className={styles.pastFilmeNote}>
                        <FaCalendarTimes className={styles.pastIcon} />
                        Filme realizado em {selectedFilme.date}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.noFilmeSelected}>
              <FaFilm />
              <h3>Nenhum filme selecionado</h3>
              <p>Selecione um filme na lista ao lado</p>
            </div>
          )}
        </div>
      </div>

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

      {/* MODAL PARA EDITAR CAPA */}
      {showCoverModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Alterar Foto de Capa</h3>
              <button 
                onClick={() => {
                  setShowCoverModal(false);
                  setNewCoverImage(null);
                  setCoverPreview(null);
                }} 
                className={styles.formClose}
              >
                <FaTimes />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Selecione uma nova imagem para a capa</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileSelect}
                />
                {coverPreview && (
                  <div className={styles.imagePreviewContainer}>
                    <img 
                      src={coverPreview} 
                      alt="Preview da nova capa" 
                      className={styles.imagePreviewModal}
                    />
                    <small>Prévia da nova imagem</small>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                onClick={() => {
                  setShowCoverModal(false);
                  setNewCoverImage(null);
                  setCoverPreview(null);
                }} 
                className={styles.cancelBtn}
              >
                Cancelar
              </button>
              <button 
                onClick={handleUpdateCover} 
                className={styles.submitBtn}
                disabled={!newCoverImage || uploadingCover}
              >
                {uploadingCover && <FaSpinner className={styles.spinnerInline} />}
                <FaSave /> Salvar Capa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORMULÁRIO DE FILME */}
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

      {/* TOAST */}
      {toast && (
        <div className={`${styles.toast} ${
          toast.type === 'success' ? styles.toast_success : 
          toast.type === 'error' ? styles.toast_error : 
          styles.toast_warn
        }`}>
          {toast.type === 'success' && <FaCalendarCheck />}
          {toast.type === 'error' && <FaExclamationTriangle />}
          {toast.type === 'warn' && <FaExclamationTriangle />}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}