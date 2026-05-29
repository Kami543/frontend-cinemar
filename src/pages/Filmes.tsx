// frontend/src/pages/Filmes.tsx (versão com melhorias responsivas)

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
    // Container principal responsivo - padding adaptativo
    <div className={`${styles.filmesContainer} ${isDarkMode ? styles.dark : ''}`}>
      {/* HEADER COM PADDING RESPONSIVO */}
      <header className={styles.heroHeader}>
        <div className={`${styles.heroHeaderContent} container mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={`${styles.backLink} text-sm sm:text-base`}>
              ← Voltar para sessões
            </Link>
          </div>

          <div className={`${styles.heroMain} text-center sm:text-left`}>
            <h1 className={`${styles.heroTitle} text-2xl sm:text-3xl md:text-4xl lg:text-5xl`}>
              CATÁLOGO DE FILMES
            </h1>
            <p className={`${styles.heroSubtitle} text-sm sm:text-base max-w-2xl mx-auto sm:mx-0`}>
              Explore todos os filmes já exibidos e as próximas sessões do CineMar
            </p>

            {stats && (
              <div className={`${styles.heroStats} flex justify-center sm:justify-start gap-2 sm:gap-4`}>
                <span className="text-xs sm:text-sm">{stats.realizados} realizados</span>
                <span className={styles.heroStatsSep}>•</span>
                <span className="text-xs sm:text-sm">{stats.proximos} próximos</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* BOTÃO FLUTUANTE ADMIN RESPONSIVO */}
      {isAdmin && (
        <button
          className={`${styles.floatingAddBtn} fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50 p-3 sm:p-4 rounded-full shadow-lg`}
          onClick={() => {
            resetFilmeForm();
            setShowFilmeForm(true);
          }}
          title="Adicionar filme"
        >
          <FaPlus className="text-lg sm:text-xl" />
        </button>
      )}

      {/* FORMULÁRIO RESPONSIVO */}
      {showFilmeForm && isAdmin && (
        <div className={styles.formOverlay}>
          <div className={`${styles.formContainer} w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-h-[90vh] overflow-y-auto`}>
            <div className={styles.formHeader}>
              <h3 className="text-lg sm:text-xl">{editingFilme ? 'Editar Filme' : 'Novo Filme'}</h3>
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

            <div className={`${styles.formBody} p-4 sm:p-6`}>
              {/* Identificação - Grid responsivo */}
              <div className={styles.formSection}>
                <h4 className={`${styles.formSectionTitle} text-base sm:text-lg`}>Identificação</h4>
                {/* flex-col md:flex-row - side-by-side vira coluna */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Título *</label>
                    <input
                      type="text"
                      value={filmeForm.title}
                      onChange={(e) => setFilmeForm({ ...filmeForm, title: e.target.value })}
                      placeholder="Nome do filme"
                      className="w-full px-3 py-2 rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Diretor *</label>
                    <input
                      type="text"
                      value={filmeForm.director}
                      onChange={(e) => setFilmeForm({ ...filmeForm, director: e.target.value })}
                      placeholder="Nome do diretor"
                      className="w-full px-3 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Ano</label>
                    <input
                      type="number"
                      value={filmeForm.year}
                      onChange={(e) =>
                        setFilmeForm({ ...filmeForm, year: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Data da Sessão *</label>
                    <input
                      type="text"
                      value={filmeForm.date}
                      onChange={(e) => setFilmeForm({ ...filmeForm, date: e.target.value })}
                      placeholder="29 de Março, 2025"
                      className="w-full px-3 py-2 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Restante do formulário similar com grid responsivo */}
              {/* ... (manter o resto do formulário, mas adicionar classes responsivas) */}
            </div>

            <div className={`${styles.formFooter} p-4 sm:p-6 flex flex-col sm:flex-row gap-3 justify-end`}>
              <button
                className={`${styles.cancelBtn} px-4 py-2 rounded-md`}
                onClick={() => {
                  setShowFilmeForm(false);
                  resetFilmeForm();
                }}
              >
                Cancelar
              </button>
              <button
                className={`${styles.submitBtn} px-4 py-2 rounded-md`}
                onClick={editingFilme ? handleEditFilme : handleAddFilme}
                disabled={uploading}
              >
                {uploading ? <FaSpinner className={styles.spinnerInline} /> : <FaSave />}
                {editingFilme ? 'Salvar Alterações' : 'Adicionar Filme'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL - LAYOUT RESPONSIVO */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8">
        {/* SIDEBAR - Ocupa largura total no mobile, fixa no desktop */}
        <div className="w-full lg:w-1/3 xl:w-1/4">
          <div className={styles.sidebar}>
            <div className={`${styles.sidebarHeader} flex justify-between items-center mb-4 p-4`}>
              <h2 className={`${styles.sidebarTitle} text-lg sm:text-xl flex items-center gap-2`}>
                <FaFilter /> Programação
              </h2>
              <span className={`${styles.totalFilmes} text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full`}>
                {filmesFiltrados.length} filmes
              </span>
            </div>

            <div className={`${styles.filters} p-4`}>
              {/* Filter Buttons - Wrap em mobile */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  className={`${styles.filterBtn} flex-1 sm:flex-none px-3 py-2 text-sm rounded-md ${
                    activeFilter === 'all' ? styles.active : ''
                  }`}
                  onClick={() => setActiveFilter('all')}
                >
                  Todos
                </button>
                <button
                  className={`${styles.filterBtn} flex-1 sm:flex-none px-3 py-2 text-sm rounded-md ${
                    activeFilter === 'realized' ? styles.active : ''
                  }`}
                  onClick={() => setActiveFilter('realized')}
                >
                  Realizados
                </button>
                <button
                  className={`${styles.filterBtn} flex-1 sm:flex-none px-3 py-2 text-sm rounded-md ${
                    activeFilter === 'upcoming' ? styles.active : ''
                  }`}
                  onClick={() => setActiveFilter('upcoming')}
                >
                  Próximos
                </button>
              </div>

              {/* Search Box - Full width no mobile */}
              <div className="relative mb-4">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar filme, diretor ou gênero..."
                  className="w-full pl-10 pr-10 py-2 rounded-md border focus:outline-none focus:ring-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setSearchTerm('')}>
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* Film List - Altura máxima em mobile */}
            <div className={`${styles.filmeList} max-h-[500px] sm:max-h-[600px] lg:max-h-[calc(100vh-300px)] overflow-y-auto`}>
              {filmesFiltrados.length === 0 ? (
                <div className="text-center p-8">
                  <FaExclamationTriangle className="mx-auto text-3xl mb-2" />
                  <p className="text-sm">Nenhum filme encontrado para a busca "{searchTerm}"</p>
                  <button className="mt-4 px-4 py-2 text-sm rounded-md" onClick={clearAllFilters}>
                    Limpar filtros
                  </button>
                </div>
              ) : (
                filmesFiltrados.map((filme) => (
                  <div
                    key={filme.id}
                    className={`${styles.filmeListItem} p-3 sm:p-4 cursor-pointer transition-all ${
                      selectedFilme?.id === filme.id ? styles.active : ''
                    } ${filme.highlight ? styles.highlighted : ''}`}
                    onClick={() => setSelectedFilme(filme)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedFilme(filme)}
                  >
                    {/* Layout flex column no mobile, row no desktop */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative w-full sm:w-24 md:w-32 flex-shrink-0">
                        <img
                          src={getFilmeImageUrl(filme)}
                          alt={filme.title}
                          className="w-full h-32 sm:h-24 object-cover rounded-md"
                          onError={() => handleImageError(filme.id)}
                          loading="lazy"
                        />
                        {filme.status === 'Próximo' && (
                          <div className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                            <FaFire className="inline mr-1 text-xs" /> PRÓXIMO
                          </div>
                        )}
                        {filme.status === 'Realizado' && (
                          <div className="absolute top-1 right-1 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                            <FaCalendarCheck className="inline mr-1 text-xs" /> EXIBIDO
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-end gap-1 mb-2">
                          <button
                            className={`p-1.5 rounded-full transition-colors ${
                              favorites.includes(filme.id) ? 'text-red-500' : 'text-gray-400'
                            }`}
                            onClick={(e) => toggleFavorite(filme.id, e)}
                            title={favorites.includes(filme.id) ? 'Remover favorito' : 'Favoritar'}
                          >
                            {favorites.includes(filme.id) ? <FaHeart /> : <FaRegHeart />}
                          </button>
                          <button
                            className={`p-1.5 rounded-full transition-colors ${
                              watchlist.includes(filme.id) ? 'text-blue-500' : 'text-gray-400'
                            }`}
                            onClick={(e) => toggleWatchlist(filme.id, e)}
                            title={watchlist.includes(filme.id) ? 'Remover da lista' : 'Adicionar à lista'}
                          >
                            {watchlist.includes(filme.id) ? <FaBookmark /> : <FaRegBookmark />}
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditFilme(filme);
                                }}
                                title="Editar"
                              >
                                <FaEdit className="text-sm" />
                              </button>
                              <button
                                className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                  confirmDelete === filme.id ? 'text-red-500' : ''
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

                        <h3 className={`${styles.listItemTitle} text-base sm:text-lg font-semibold truncate`}>
                          {filme.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>{filme.year}</span>
                          <span>•</span>
                          <span className="truncate">{filme.director.split(' e ')[0]}</span>
                        </div>

                        <div className="flex justify-between items-center mt-2 text-xs sm:text-sm">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="text-xs" />
                            <span className="truncate">{filme.date.split(',')[0]}</span>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs ${
                              filme.status === 'Próximo' 
                                ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            }`}
                          >
                            {filme.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* DETALHES - Largura total no mobile, resto no desktop */}
        <div className="w-full lg:w-2/3 xl:w-3/4">
          {selectedFilme ? (
            <div className={`${styles.detailsContainer} p-4 sm:p-6 lg:p-8`}>
              {/* Cabeçalho responsivo */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className={`${styles.detailsTitle} text-xl sm:text-2xl md:text-3xl font-bold`}>
                      {selectedFilme.title}
                    </h2>
                    {selectedFilme.highlight && selectedFilme.status === 'Próximo' && (
                      <div className="bg-yellow-500 text-black px-2 py-1 rounded-md text-xs font-semibold">
                        <FaFire className="inline mr-1" /> DESTAQUE
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span>{selectedFilme.year}</span>
                    {selectedFilme.genre && (
                      <>
                        <span>•</span>
                        <span><FaTag className="inline mr-1 text-xs" /> {selectedFilme.genre}</span>
                      </>
                    )}
                    {selectedFilme.duration && (
                      <>
                        <span>•</span>
                        <span><FaClock className="inline mr-1 text-xs" /> {selectedFilme.duration}</span>
                      </>
                    )}
                    {selectedFilme.views && (
                      <>
                        <span>•</span>
                        <span><FaEye className="inline mr-1 text-xs" /> {selectedFilme.views.toLocaleString()} visualizações</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                    <FaStar className="inline mr-1" />
                    {selectedFilme.rating?.toFixed(1) || '0.0'}
                    <span className="text-xs ml-1">({selectedFilme.reviewCount || 0})</span>
                  </div>

                  <button
                    className={`p-2 rounded-full transition-colors ${
                      favorites.includes(selectedFilme.id) ? 'text-red-500 bg-red-50 dark:bg-red-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={(e) => toggleFavorite(selectedFilme.id, e)}
                    title={favorites.includes(selectedFilme.id) ? 'Remover favorito' : 'Favoritar'}
                  >
                    {favorites.includes(selectedFilme.id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                  <button
                    className={`p-2 rounded-full transition-colors ${
                      watchlist.includes(selectedFilme.id) ? 'text-blue-500 bg-blue-50 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={(e) => toggleWatchlist(selectedFilme.id, e)}
                    title={watchlist.includes(selectedFilme.id) ? 'Remover da lista' : 'Adicionar à lista'}
                  >
                    {watchlist.includes(selectedFilme.id) ? <FaBookmark /> : <FaRegBookmark />}
                  </button>
                  <div className="relative" ref={shareRef}>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" onClick={shareFilme} title="Compartilhar">
                      <FaShareAlt />
                    </button>
                    {showShareMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                        <button onClick={copyLink} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <FaCopy className="inline mr-2" /> Copiar link
                        </button>
                        <a
                          href={`https://twitter.com/intent/tweet?text=Confira "${selectedFilme.title}" no CineMar!&url=${window.location.href}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FaTwitter className="inline mr-2" /> Compartilhar no Twitter
                        </a>
                      </div>
                    )}
                  </div>
                  {isAdmin && (
                    <>
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => openEditFilme(selectedFilme)}
                        title="Editar filme"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={`p-2 rounded-full transition-colors ${
                          confirmDelete === selectedFilme.id ? 'text-red-500 bg-red-50 dark:bg-red-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
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

              {/* Conteúdo principal - flex coluna no mobile, row no desktop */}
              <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
                {/* Coluna esquerda - imagem responsiva */}
                <div className="w-full md:w-1/3 lg:w-1/4">
                  <div className="relative">
                    <img
                      src={getFilmeImageUrl(selectedFilme)}
                      alt={selectedFilme.title}
                      className="w-full h-auto rounded-lg shadow-lg object-cover"
                      onError={() => handleImageError(selectedFilme.id)}
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        selectedFilme.status === 'Próximo' 
                          ? 'bg-red-600 text-white'
                          : 'bg-green-600 text-white'
                      }`}>
                        {selectedFilme.status === 'Próximo' ? 'EM BREVE' : 'EXIBIDO'}
                      </span>
                    </div>
                  </div>

                  {/* Info cards responsivos */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <FaCalendarAlt className="text-gray-500 mt-1" />
                      <div>
                        <h4 className="text-xs font-semibold uppercase text-gray-500">Data</h4>
                        <p className="text-sm">{selectedFilme.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <FaUser className="text-gray-500 mt-1" />
                      <div>
                        <h4 className="text-xs font-semibold uppercase text-gray-500">Diretor</h4>
                        <p className="text-sm break-words">{selectedFilme.director}</p>
                      </div>
                    </div>
                    {selectedFilme.duration && (
                      <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FaClock className="text-gray-500 mt-1" />
                        <div>
                          <h4 className="text-xs font-semibold uppercase text-gray-500">Duração</h4>
                          <p className="text-sm">{selectedFilme.duration}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Coluna direita - conteúdo principal */}
                <div className="w-full md:w-2/3 lg:w-3/4">
                  {/* Sinopse com quebra de texto */}
                  <div className="mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3">Sinopse</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                      {selectedFilme.description}
                    </p>
                  </div>

                  {/* Ficha técnica com quebra de texto */}
                  <div className="mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3">Ficha Técnica</h3>
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <strong className="w-full sm:w-32">Roteiro:</strong>
                        <span className="flex-1 break-words">{selectedFilme.screenplay}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <strong className="w-full sm:w-32">Elenco Principal:</strong>
                        <span className="flex-1 break-words">{selectedFilme.cast}</span>
                      </div>
                      {selectedFilme.language && (
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                          <strong className="w-full sm:w-32">Idioma:</strong>
                          <span className="flex-1">{selectedFilme.language}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prêmios com wrap */}
                  {selectedFilme.awards && selectedFilme.awards.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg sm:text-xl font-semibold mb-3">Prêmios</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedFilme.awards.map((award: any, index: number) => (
                          <div key={index} className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900 px-3 py-1 rounded-full text-sm">
                            <FaAward className="text-yellow-600 dark:text-yellow-400" />
                            <span>{award.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags com wrap */}
                  {selectedFilme.tags && selectedFilme.tags.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg sm:text-xl font-semibold mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedFilme.tags.map((tag: any, index: number) => (
                          <span key={index} className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Galeria de fotos responsiva - grid responsivo */}
                  <div className="mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3">
                      <FaImages className="inline mr-2" /> Galeria de Fotos
                    </h3>
                    
                    {selectedFilme.filmesFotos && selectedFilme.filmesFotos.length > 0 ? (
                      // Grid responsivo: 2 colunas no mobile, 3 no tablet, 4 no desktop
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {selectedFilme.filmesFotos.slice(0, 8).map((foto: any) => (
                          <div 
                            key={foto.id} 
                            className="relative cursor-pointer group"
                            onClick={() => navigateToFotos(selectedFilme.id, selectedFilme.title, foto.id)}
                          >
                            <img
                              src={foto.path}
                              alt={foto.titulo}
                              className="w-full h-32 sm:h-40 object-cover rounded-lg transition-transform group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.src = PLACEHOLDER_IMAGE;
                              }}
                            />
                            {foto.principal && (
                              <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                Principal
                              </span>
                            )}
                          </div>
                        ))}
                        {selectedFilme.filmesFotos.length > 8 && (
                          <div 
                            className="relative bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer h-32 sm:h-40"
                            onClick={() => navigateToFotos(selectedFilme.id, selectedFilme.title)}
                          >
                            <div className="text-center">
                              <FaImages className="text-2xl mx-auto mb-1" />
                              <span className="text-sm font-semibold">
                                +{selectedFilme.filmesFotos.length - 8}
                              </span>
                              <p className="text-xs">Ver todas</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FaImages className="text-4xl mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400">Este filme ainda não possui fotos na galeria.</p>
                        {isAdmin && (
                          <button 
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            onClick={() => openEditFilme(selectedFilme)}
                          >
                            <FaPlus className="inline mr-2" /> Adicionar fotos
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botões de acesso - responsivos */}
                  {selectedFilme.status === 'Realizado' && (
                    <div className="mb-6">
                      <h3 className="text-lg sm:text-xl font-semibold mb-3">Acessos Disponíveis</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {selectedFilme.materialsLink && (
                          <button
                            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                            onClick={handleGoToMaterials}
                            disabled={loadingMaterials}
                          >
                            <FaImages className="text-blue-500 text-xl" />
                            <div className="flex-1">
                              <div className="font-semibold text-sm">Materiais do Debate</div>
                              <div className="text-xs text-gray-500">Fotos e documentos</div>
                            </div>
                            {loadingMaterials && <FaSpinner className="animate-spin" />}
                          </button>
                        )}

                        <button
                          className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                          onClick={handleGoToCineMarPlaylist}
                          disabled={loadingPlaylist}
                        >
                          <FaHeadphones className="text-green-500 text-xl" />
                          <div className="flex-1">
                            <div className="font-semibold text-sm">Playlist Oficial</div>
                            <div className="text-xs text-gray-500">CineMar no Spotify</div>
                          </div>
                          {loadingPlaylist && <FaSpinner className="animate-spin" />}
                        </button>

                        {selectedFilme.playlistLink && (
                          <button
                            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                            onClick={handleOpenExternalPlaylist}
                            disabled={loadingYouTube}
                          >
                            <FaMusic className="text-purple-500 text-xl" />
                            <div className="flex-1">
                              <div className="font-semibold text-sm">Trilha Sonora</div>
                              <div className="text-xs text-gray-500">YouTube Music</div>
                            </div>
                            {loadingYouTube && <FaSpinner className="animate-spin" />}
                            <FaExternalLinkAlt className="text-xs text-gray-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ações principais responsivas */}
                  <div className="mt-6">
                    {selectedFilme.status === 'Próximo' ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold" onClick={scheduleFilme}>
                          <FaCalendarCheck className="inline mr-2" /> Adicionar à Agenda
                        </button>
                        <button className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold" onClick={shareFilme}>
                          <FaShareAlt className="inline mr-2" /> Compartilhar
                        </button>
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FaCalendarTimes className="inline mr-2 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">Filme realizado em {selectedFilme.date}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 sm:p-12 lg:p-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <FaFilm className="text-5xl mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Nenhum filme selecionado</h3>
              <p className="text-gray-600 dark:text-gray-400">Selecione um filme na lista ao lado</p>
            </div>
          )}
        </div>
      </div>

      {/* TOAST RESPONSIVO */}
      {toast && (
        <div className={`${styles.toast} fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-auto sm:max-w-md z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
        } text-white`}>
          {toast.type === 'success' && <FaCalendarCheck />}
          {toast.type === 'error' && <FaExclamationTriangle />}
          {toast.type === 'warn' && <FaExclamationTriangle />}
          <span className="text-sm sm:text-base break-words flex-1">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}