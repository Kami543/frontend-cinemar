import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSpotify, FaHeart, FaRegHeart, FaShareAlt, FaClock,
  FaMusic, FaFilm, FaUsers, FaBook, FaRandom, FaChevronLeft,
  FaChevronRight, FaSearch, FaPlay, FaCalendarAlt,
  FaPlus, FaEdit, FaTrash, FaTimes, FaCalendarCheck,
  FaSpinner, FaExclamationTriangle
} from 'react-icons/fa';
import styles from '../styles/Playlists.module.css';
import { usePlaylists } from '../hooks/usePlaylists';
import PlaylistForm from '../components/PlaylistForm';
import { useTheme } from '../components/context/ThemeContext';

// Categorias para filtro
const playlistCategories = [
  { id: 'all', name: 'Todas as Mixtapes', icon: <FaMusic />, filter: null },
  { id: 'literatura', name: 'Literatura em Foco', icon: <FaBook />, filter: 'literatura' },
  { id: 'cinema', name: 'Puro Cinema', icon: <FaFilm />, filter: 'cinema' },
  { id: 'sociedade', name: 'Debate Social', icon: <FaUsers />, filter: 'sociedade' },
];

export default function Playlists() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Estados locais
  const [user, setUser] = useState<any>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [sessoes, setSessoes] = useState<any[]>([]);

  // Hook de playlists
  const {
    playlists,
    isLoading,
    error,
    toast,
    stats,
    likedPlaylists,
    createPlaylist,
    updatePlaylist,
    removePlaylist,
    toggleLike,
    isLiked,
    setSearch,
    resetFilters,
    refetch,
  } = usePlaylists({ limit: 100 });

  // Verificar usuário
  useEffect(() => {
    const storedUser = localStorage.getItem('cinemar_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Erro ao parsear usuário:', e);
      }
    }
  }, []);

  // Carregar sessões do localStorage ou API
  useEffect(() => {
    const storedSessoes = localStorage.getItem('cinemar_sessoes');
    if (storedSessoes) {
      try {
        setSessoes(JSON.parse(storedSessoes));
      } catch (e) {
        console.error('Erro ao parsear sessões:', e);
      }
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  // Filtrar playlists localmente
  const filteredPlaylists = useMemo(() => {
    let filtered = [...playlists];

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'literatura') {
        filtered = filtered.filter(p => 
          p.theme?.toLowerCase().includes('literatura') || 
          p.relatedFilm === 'A Hora da Estrela'
        );
      } else if (selectedCategory === 'cinema') {
        filtered = filtered.filter(p => 
          p.relatedFilm?.includes('Bacurau') || 
          p.relatedFilm?.includes('Ainda Estou Aqui')
        );
      } else if (selectedCategory === 'sociedade') {
        filtered = filtered.filter(p => p.relatedFilm === 'Medida Provisória');
      }
    }

    // Filtro por busca
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(searchLower) ||
        p.relatedFilm?.toLowerCase().includes(searchLower) ||
        p.theme?.toLowerCase().includes(searchLower) ||
        p.curator?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [playlists, selectedCategory, searchTerm]);

  // Playlist selecionada
  const selectedPlaylist = useMemo(() => {
    if (selectedPlaylistId && filteredPlaylists.length > 0) {
      return filteredPlaylists.find(p => p.id === selectedPlaylistId) || filteredPlaylists[0];
    }
    return filteredPlaylists[0] || null;
  }, [filteredPlaylists, selectedPlaylistId]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, setSearch]);

  // Selecionar playlist
  const selectPlaylist = (playlist: any) => {
    if (playlist && playlist.id) {
      setSelectedPlaylistId(playlist.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Navegação
  const currentIndex = filteredPlaylists.findIndex(p => p.id === selectedPlaylist?.id);
  const goToPrev = () => {
    if (filteredPlaylists.length === 0) return;
    if (currentIndex > 0) {
      selectPlaylist(filteredPlaylists[currentIndex - 1]);
    } else {
      selectPlaylist(filteredPlaylists[filteredPlaylists.length - 1]);
    }
  };
  const goToNext = () => {
    if (filteredPlaylists.length === 0) return;
    if (currentIndex < filteredPlaylists.length - 1) {
      selectPlaylist(filteredPlaylists[currentIndex + 1]);
    } else {
      selectPlaylist(filteredPlaylists[0]);
    }
  };
  const goToRandom = () => {
    if (filteredPlaylists.length === 0) return;
    const random = Math.floor(Math.random() * filteredPlaylists.length);
    selectPlaylist(filteredPlaylists[random]);
  };

  const sharePlaylist = () => {
    if (selectedPlaylist?.spotifyUrl) {
      navigator.clipboard.writeText(selectedPlaylist.spotifyUrl);
    }
  };

  // CRUD Handlers
  const handleSavePlaylist = async (formData: any) => {
    if (editingPlaylist) {
      await updatePlaylist(editingPlaylist.id, formData);
    } else {
      await createPlaylist(formData);
    }
    setShowPlaylistForm(false);
    setEditingPlaylist(null);
  };

  const handleDeletePlaylist = async (id: string) => {
    if (confirmDelete === id) {
      await removePlaylist(id);
      setConfirmDelete(null);
      if (selectedPlaylist?.id === id && filteredPlaylists.length > 1) {
        const next = filteredPlaylists.find(p => p.id !== id);
        if (next) selectPlaylist(next);
      }
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const openEditPlaylist = (playlist: any) => {
    setEditingPlaylist(playlist);
    setShowPlaylistForm(true);
  };

  // Buscar título da sessão
  const getSessaoTitulo = (sessaoId?: string) => {
    if (!sessaoId) return '';
    const sessao = sessoes.find(s => s.id === sessaoId);
    return sessao ? sessao.titulo : '';
  };

  // Loading state
  if (isLoading && playlists.length === 0) {
    return (
      <div className={`${styles.playlistsContainer} ${isDarkMode ? styles.dark : styles.light}`}>
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.loadingSpinner} />
          <p>Carregando playlists...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && playlists.length === 0) {
    return (
      <div className={`${styles.playlistsContainer} ${isDarkMode ? styles.dark : styles.light}`}>
        <div className={styles.errorContainer}>
          <FaExclamationTriangle />
          <h3>Erro ao carregar playlists</h3>
          <p>{error}</p>
          <button onClick={() => refetch()}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.playlistsContainer} ${isDarkMode ? styles.dark : styles.light}`}>
      {/* Header */}
      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={styles.backLink}>← Voltar para Início</Link>
          </div>
          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>ACERVO SONORO</h1>
            <p className={styles.heroSubtitle}>
              A música expande a tela. Explore nossas mixtapes exclusivas, curadas a dedo para prolongar as emoções e reflexões dos nossos debates cinematográficos.
            </p>
            {stats && (
              <div className={styles.heroStats}>
                <span>{stats.total || playlists.length} playlists</span>
                <span>•</span>
                <span>{stats.totalTracks || playlists.reduce((acc, p) => acc + (p.tracks || 0), 0)} faixas</span>
                <span>•</span>
                <span>{stats.totalLikes || playlists.reduce((acc, p) => acc + (p.likes || 0), 0)} curtidas</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Botão flutuante */}
      {isAdmin && (
        <button 
          className={styles.floatingAddBtn} 
          onClick={() => { setEditingPlaylist(null); setShowPlaylistForm(true); }} 
          title="Adicionar playlist"
        >
          <FaPlus />
        </button>
      )}

      {/* PlaylistForm Modal */}
      <PlaylistForm
        isOpen={showPlaylistForm}
        onClose={() => {
          setShowPlaylistForm(false);
          setEditingPlaylist(null);
        }}
        onSave={handleSavePlaylist}
        initialData={editingPlaylist}
        isEditing={!!editingPlaylist}
        sessoes={sessoes}
      />

      {/* Search e Categories */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar playlists, filmes ou temas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className={styles.clearSearch} onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>

        <div className={styles.categoryFilters}>
          {playlistCategories.map(cat => (
            <button
              key={cat.id}
              className={`${styles.categoryFilterBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className={styles.categoryIcon}>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {selectedPlaylist && (
          <>
            {/* Hero Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.currentPlaylistTitle}>{selectedPlaylist.title}</h2>
                  {selectedPlaylist.curator && <p>Curada por: {selectedPlaylist.curator}</p>}
                  {selectedPlaylist.curatorDescription && (
                    <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.8 }}>{selectedPlaylist.curatorDescription}</p>
                  )}
                  <span className={styles.debateFilm}>
                    <FaFilm /> Universo Cinematográfico: {selectedPlaylist.relatedFilm || 'Não definido'}
                    {selectedPlaylist.sessaoId && (
                      <span className={styles.sessaoBadge}>Sessão: {getSessaoTitulo(selectedPlaylist.sessaoId)}</span>
                    )}
                  </span>
                </div>
                {isAdmin && (
                  <div className={styles.cardAdminActions}>
                    <button onClick={() => openEditPlaylist(selectedPlaylist)} className={styles.cardEditBtn}>
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeletePlaylist(selectedPlaylist.id)} 
                      className={`${styles.cardDeleteBtn} ${confirmDelete === selectedPlaylist.id ? styles.confirmingDelete : ''}`}
                    >
                      {confirmDelete === selectedPlaylist.id ? <FaTimes /> : <FaTrash />}
                    </button>
                  </div>
                )}
              </div>

              <div style={{ padding: '0 32px 32px' }}>
                <p>{selectedPlaylist.description || 'Sem descrição disponível.'}</p>

                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <FaClock className={styles.statIcon} />
                    <h5>Duração</h5>
                    <p>{selectedPlaylist.duration || '-'}</p>
                  </div>
                  <div className={styles.statCard}>
                    <FaMusic className={styles.statIcon} />
                    <h5>Faixas</h5>
                    <p>{selectedPlaylist.tracks || 0}</p>
                  </div>
                  <div className={styles.statCard}>
                    <FaHeart className={styles.statIcon} />
                    <h5>Curtidas</h5>
                    <p>{(selectedPlaylist.likes || 0).toLocaleString('pt-BR')}</p>
                  </div>
                  <div className={styles.statCard}>
                    <FaCalendarAlt className={styles.statIcon} />
                    <h5>Criada em</h5>
                    <p>{selectedPlaylist.createdAt ? new Date(selectedPlaylist.createdAt).toLocaleDateString('pt-BR') : '-'}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                  {selectedPlaylist.spotifyUrl && (
                    <button className={styles.spotifyButton} onClick={() => window.open(selectedPlaylist.spotifyUrl, '_blank')}>
                      <FaSpotify /> Abrir no Spotify
                    </button>
                  )}
                  <button className={styles.spotifyButton} onClick={() => toggleLike(selectedPlaylist.id)}>
                    {isLiked(selectedPlaylist.id) ? <FaHeart /> : <FaRegHeart />}
                    {isLiked(selectedPlaylist.id) ? 'Curtido' : 'Curtir'}
                  </button>
                  <button className={styles.spotifyButton} onClick={sharePlaylist}>
                    <FaShareAlt /> Compartilhar
                  </button>
                </div>

                {filteredPlaylists.length > 1 && (
                  <div style={{ display: 'flex', gap: '16px', marginTop: '28px', justifyContent: 'center' }}>
                    <button className={styles.playlistNavButton} onClick={goToPrev}>
                      <FaChevronLeft />
                    </button>
                    <span>{currentIndex + 1} / {filteredPlaylists.length}</span>
                    <button className={styles.playlistNavButton} onClick={goToNext}>
                      <FaChevronRight />
                    </button>
                    <button className={styles.playlistNavButton} onClick={goToRandom}>
                      <FaRandom />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Highlight Tracks */}
            {selectedPlaylist.highlightTracks && selectedPlaylist.highlightTracks.length > 0 && (
              <div className={styles.card} style={{ marginTop: '32px' }}>
                <div className={styles.cardHeader}>
                  <h3><FaMusic /> Faixas Destacadas</h3>
                </div>
                <div style={{ padding: '0 32px 32px' }}>
                  <div className={styles.highlightTracksList}>
                    {selectedPlaylist.highlightTracks.map((track: string, idx: number) => (
                      <div key={idx} className={styles.highlightTrackItem}>
                        <span className={styles.trackNumber}>{idx + 1}</span>
                        <FaPlay className={styles.playIcon} />
                        <span className={styles.trackName}>{track}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Grid de Playlists */}
        {filteredPlaylists.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3><FaMusic /> Outras Playlists</h3>
            <div className={styles.allPlaylistsGrid}>
              {filteredPlaylists.map(playlist => (
                <div 
                  key={playlist.id} 
                  className={`${styles.playlistCard} ${selectedPlaylist?.id === playlist.id ? styles.active : ''}`}
                  onClick={() => selectPlaylist(playlist)}
                >
                  <div className={styles.playlistCardImage}>
                    <img 
                      src={playlist.coverImage || 'https://i.scdn.co/image/ab67706f0000000298c5a2e6'} 
                      alt={playlist.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://i.scdn.co/image/ab67706f0000000298c5a2e6';
                      }}
                    />
                  </div>
                  <div className={styles.playlistCardInfo}>
                    <h4>{playlist.title}</h4>
                    <p className={styles.playlistCardDescription}>{playlist.theme || 'Sem tema'}</p>
                    <div className={styles.playlistMeta}>
                      <span>{playlist.tracks || 0} faixas</span>
                      <span>{playlist.duration || '-'}</span>
                    </div>
                    {isAdmin && (
                      <div className={styles.gridAdminActions}>
                        <button onClick={(e) => { e.stopPropagation(); openEditPlaylist(playlist); }} className={styles.gridEditBtn}>
                          <FaEdit />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(playlist.id); }} className={styles.gridDeleteBtn}>
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sem resultados */}
        {filteredPlaylists.length === 0 && !isLoading && (
          <div className={styles.noResults}>
            <FaMusic />
            <p>Nenhuma playlist encontrada para "{searchTerm}"</p>
            <button 
              className={styles.clearFiltersBtn} 
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); resetFilters(); }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>
          {toast.type === 'success' && <FaCalendarCheck />}
          {toast.type === 'error' && <FaExclamationTriangle />}
          {toast.type === 'warn' && <FaExclamationTriangle />}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}