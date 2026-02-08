import { useState, useEffect } from 'react';
import { 
  FaSpotify, 
  FaHeart, 
  FaRegHeart, 
  FaShareAlt, 
  FaClock, 
  FaMusic, 
  FaFilm, 
  FaHeadphones, 
  FaExternalLinkAlt,
  FaSun,
  FaMoon,
  FaUsers,
  FaBook,
  FaCheckCircle,
  FaComments,
  FaHistory,
  FaList,
  FaListOl,
  FaRandom,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaEllipsisH,
  FaStar,
  FaCalendarAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';
import styles from '../styles/Playlists.module.css';

// Interface para as playlists
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
}

// Dados das 3 playlists
const spotifyPlaylists: Playlist[] = [
  {
    id: 1,
    title: "A Hora da Estrela: Solidão Urbana",
    description: "Músicas que refletem a melancolia e solidão de Macabéa, personagem principal do filme de Clarice Lispector. Uma mixtape que captura a essência da condição feminina e da migração no Brasil urbano.",
    spotifyId: "5NfX7eyzp0I01I86UzCkQF",
    spotifyUrl: "https://open.spotify.com/playlist/5NfX7eyzp0I01I86UzCkQF?si=gZaVJtwfSLa6_k-LXQwvcA",
    embedUrl: "https://open.spotify.com/embed/playlist/5NfX7eyzp0I01I86UzCkQF",
    coverImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: "1h 38min",
    tracks: 16,
    likes: 1245,
    curator: "CineMar Literatura",
    relatedFilm: "A Hora da Estrela",
    filmYear: "1985",
    director: "Suzana Amaral",
    genres: ["MPB", "Música Popular Brasileira", "Folk", "Clássicos"],
    languages: ["Português", "Instrumental"],
    createdAt: "20/03/2026",
    theme: "Solidão Feminina e Migração Urbana",
    highlightTracks: [
      "Construção - Chico Buarque",
      "Carinhoso - Elis Regina", 
      "Chega de Saudade - João Gilberto",
      "Wave - Tom Jobim"
    ]
  },
  {
    id: 2,
    title: "Bacurau & Ainda Estou Aqui: Resistência Sonora",
    description: "Mixtape que homenageia a resistência e a identidade cultural brasileira presentes nos filmes 'Bacurau' e 'Ainda Estou Aqui'. Uma celebração musical da luta e da memória.",
    spotifyId: "3Ou7S8yzkrPngdRI4bSwym",
    spotifyUrl: "https://open.spotify.com/playlist/3Ou7S8yzkrPngdRI4bSwym?si=jRmsdVsVQqCUzo2S4Bp2kQ",
    embedUrl: "https://open.spotify.com/embed/playlist/3Ou7S8yzkrPngdRI4bSwym",
    coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: "2h 05min",
    tracks: 24,
    likes: 892,
    curator: "CineMar Cinema Brasileiro",
    relatedFilm: "Bacurau & Ainda Estou Aqui",
    filmYear: "2019 & 2015",
    director: "Kleber Mendonça Filho & Marcelo Lordello",
    genres: ["Forró", "Repente", "Rock Nacional", "MPB"],
    languages: ["Português"],
    createdAt: "15/02/2026",
    theme: "Resistência e Identidade Cultural",
    highlightTracks: [
      "A Banda - Chico Buarque",
      "Carcará - João do Vale",
      "Panis et Circenses - Os Mutantes",
      "Soy Loco Por Ti América - Caetano Veloso"
    ]
  },
  {
    id: 3,
    title: "Medida Provisória: Vozes da Luta",
    description: "Mixtape em alusão ao longa 'Medida Provisória', explorando temas de resistência, direitos humanos e justiça social através da música brasileira contemporânea.",
    spotifyId: "1g2aYaaa5lv9TeBAZIfwGc",
    spotifyUrl: "https://open.spotify.com/playlist/1g2aYaaa5lv9TeBAZIfwGc?si=L7FrA0w0TPSuf1EfXTJRfQ",
    embedUrl: "https://open.spotify.com/embed/playlist/1g2aYaaa5lv9TeBAZIfwGc",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: "1h 52min",
    tracks: 18,
    likes: 756,
    curator: "CineMar Política e Sociedade",
    relatedFilm: "Medida Provisória",
    filmYear: "2022",
    director: "Lázaro Ramos",
    genres: ["Rap Brasileiro", "MPB Contemporânea", "Samba", "Hip Hop"],
    languages: ["Português"],
    createdAt: "10/01/2026",
    theme: "Direitos Humanos e Justiça Social",
    highlightTracks: [
      "Casa - Ogi",
      "Demarcação Já - MC Tha",
      "Não Existe Amor em SP - Criolo",
      "A Carne - Elza Soares"
    ]
  }
];

// Informações sobre os filmes relacionados
const filmInfo = [
  {
    id: 1,
    title: "A Hora da Estrela",
    year: "1985",
    director: "Suzana Amaral",
    synopsis: "Adaptação do romance de Clarice Lispector que conta a história de Macabéa, uma jovem nordestina que migra para São Paulo em busca de uma vida melhor, enfrentando solidão e marginalização.",
    themes: ["Solidão Feminina", "Migração", "Condição Social", "Identidade"],
    debateDate: "19/03/2026",
    participants: 47
  },
  {
    id: 2,
    title: "Bacurau & Ainda Estou Aqui",
    year: "2019 & 2015",
    director: "Kleber Mendonça Filho & Marcelo Lordello",
    synopsis: "'Bacurau' explora a resistência de uma comunidade no sertão brasileiro, enquanto 'Ainda Estou Aqui' aborda temas de memória e identidade através da história de uma professora.",
    themes: ["Resistência", "Identidade Cultural", "Memória", "Comunidade"],
    debateDate: "12/02/2026",
    participants: 38
  },
  {
    id: 3,
    title: "Medida Provisória",
    year: "2022",
    director: "Lázaro Ramos",
    synopsis: "Filme distópico que imagina um Brasil futuro onde uma medida provisória ordena que todos os cidadãos negros sejam enviados para a África, explorando temas de racismo e direitos humanos.",
    themes: ["Racismo", "Direitos Humanos", "Justiça Social", "Distopia"],
    debateDate: "05/02/2026",
    participants: 42
  }
];

// Categorias para filtro
const playlistCategories = [
  {
    id: 'all',
    name: 'Todas as Playlists',
    icon: <FaMusic />,
    color: '#1DB954'
  },
  {
    id: 'literatura',
    name: 'Literatura',
    icon: <FaBook />,
    color: '#8B5CF6'
  },
  {
    id: 'cinema',
    name: 'Cinema Brasileiro',
    icon: <FaFilm />,
    color: '#EF4444'
  },
  {
    id: 'sociedade',
    name: 'Sociedade',
    icon: <FaUsers />,
    color: '#10B981'
  }
];

export default function Playlists() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>(spotifyPlaylists[0]);
  const [selectedFilm, setSelectedFilm] = useState(filmInfo[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [likedPlaylists, setLikedPlaylists] = useState<number[]>([1]);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState<'playlist' | 'film'>('playlist');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>(spotifyPlaylists);
  const [isPlaying, setIsPlaying] = useState(false);

  // Atualizar tema
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', theme === 'dark');
    document.documentElement.classList.toggle('light-mode', theme === 'light');
  }, [theme]);

  // Filtrar playlists
  useEffect(() => {
    let filtered = spotifyPlaylists;
    
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'literatura') {
        filtered = spotifyPlaylists.filter(p => p.id === 1);
      } else if (selectedCategory === 'cinema') {
        filtered = spotifyPlaylists.filter(p => p.id === 2);
      } else if (selectedCategory === 'sociedade') {
        filtered = spotifyPlaylists.filter(p => p.id === 3);
      }
    }
    
    if (searchTerm) {
      filtered = filtered.filter(playlist =>
        playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        playlist.relatedFilm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        playlist.theme.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredPlaylists(filtered);
    
    // Se a playlist filtrada não incluir a selecionada, selecione a primeira
    if (!filtered.some(p => p.id === selectedPlaylist.id) && filtered.length > 0) {
      setSelectedPlaylist(filtered[0]);
      setSelectedFilm(filmInfo[filtered[0].id - 1]);
    }
  }, [selectedCategory, searchTerm]);

  // Atualizar informações do filme quando a playlist muda
  useEffect(() => {
    const film = filmInfo.find(f => f.id === selectedPlaylist.id);
    if (film) {
      setSelectedFilm(film);
    }
  }, [selectedPlaylist]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleLike = (playlistId: number) => {
    setLikedPlaylists(prev =>
      prev.includes(playlistId)
        ? prev.filter(id => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const openSpotify = () => {
    window.open(selectedPlaylist.spotifyUrl, '_blank');
  };

  const sharePlaylist = () => {
    if (navigator.share) {
      navigator.share({
        title: `${selectedPlaylist.title} - Mixtape CineMar`,
        text: `Ouça a mixtape inspirada no filme "${selectedPlaylist.relatedFilm}" no Spotify!`,
        url: selectedPlaylist.spotifyUrl
      });
    } else {
      navigator.clipboard.writeText(selectedPlaylist.spotifyUrl);
      alert('Link da playlist copiada para a área de transferência!');
    }
  };

  const selectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    const film = filmInfo.find(f => f.id === playlist.id);
    if (film) {
      setSelectedFilm(film);
    }
    setActiveTab('playlist');
    setIsPlaying(false);
  };

  const goToPreviousPlaylist = () => {
    const currentIndex = filteredPlaylists.findIndex(p => p.id === selectedPlaylist.id);
    const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredPlaylists.length - 1;
    setSelectedPlaylist(filteredPlaylists[newIndex]);
    setIsPlaying(false);
  };

  const goToNextPlaylist = () => {
    const currentIndex = filteredPlaylists.findIndex(p => p.id === selectedPlaylist.id);
    const newIndex = currentIndex < filteredPlaylists.length - 1 ? currentIndex + 1 : 0;
    setSelectedPlaylist(filteredPlaylists[newIndex]);
    setIsPlaying(false);
  };

  const goToRandomPlaylist = () => {
    const randomIndex = Math.floor(Math.random() * filteredPlaylists.length);
    setSelectedPlaylist(filteredPlaylists[randomIndex]);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`${styles.playlistsContainer} ${theme === 'dark' ? styles.dark : styles.light}`}>
      {/* Header Principal */}
      <header className={`${styles.header} ${theme === 'dark' ? styles.dark : styles.light}`}>
        <div className={styles.headerContent}>
          <div className={styles.headerMain}>
            <div className={styles.headerTitleSection}>
              <h1 className={styles.title}>
                <FaMusic className={styles.titleIcon} />
                MIXTAPES CINEMAR
              </h1>
              <p className={styles.subtitle}>
                3 playlists exclusivas inspiradas nos debates cinematográficos
              </p>
            </div>
            
            <div className={styles.headerControls}>
              <div className={styles.spotifyBrand}>
                <FaSpotify className={styles.spotifyBrandIcon} />
                <span>Exclusivo no Spotify</span>
              </div>
              
              <button 
                className={styles.themeToggle}
                onClick={toggleTheme}
                title={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
              >
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </button>
            </div>
          </div>

          <div className={styles.playlistIndicator}>
            <div className={styles.playlistInfo}>
              <span className={styles.playlistCounter}>
                Mixtape {filteredPlaylists.findIndex(p => p.id === selectedPlaylist.id) + 1} de {filteredPlaylists.length}
              </span>
              <h2 className={styles.currentPlaylistTitle}>
                {selectedPlaylist.title}
              </h2>
              <span className={styles.debateFilm}>
                Inspirada em: {selectedPlaylist.relatedFilm}
              </span>
            </div>
            
            <div className={styles.playlistNavigation}>
              <button 
                className={styles.playlistNavButton}
                onClick={goToPreviousPlaylist}
                disabled={filteredPlaylists.length <= 1}
              >
                <FaChevronLeft />
              </button>
              <button 
                className={styles.playlistNavButton}
                onClick={goToRandomPlaylist}
                disabled={filteredPlaylists.length <= 1}
              >
                <FaRandom />
              </button>
              <button 
                className={styles.playlistNavButton}
                onClick={goToNextPlaylist}
                disabled={filteredPlaylists.length <= 1}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navegação por Categorias */}
      <div className={styles.categoriesNavigation}>
        <div className={styles.categoryFilters}>
          {playlistCategories.map(category => (
            <button
              key={category.id}
              className={`${styles.categoryFilterBtn} ${selectedCategory === category.id ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category.id)}
              style={{ borderLeftColor: category.color }}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar mixtapes ou filmes..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className={styles.clearSearch}
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Navegação por Tabs */}
        <div className={styles.tabsNavigation}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'playlist' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('playlist')}
          >
            <FaHeadphones /> Mixtape
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'film' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('film')}
          >
            <FaFilm /> Sobre o Filme
          </button>
        </div>

        {/* Conteúdo Principal */}
        {activeTab === 'playlist' && (
          <div className={styles.playlistContent}>
            {/* Player da Playlist */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <h2>
                    <FaMusic className={styles.cardIcon} />
                    {selectedPlaylist.title}
                  </h2>
                  <div className={styles.playlistStatus}>
                    <span className={styles.playlistSession}>
                      <FaFilm /> {selectedPlaylist.relatedFilm}
                    </span>
                    <span className={styles.createdDate}>
                      Criada em {selectedPlaylist.createdAt}
                    </span>
                  </div>
                </div>
                
                <div className={styles.cardActions}>
                  <button 
                    className={`${styles.likeButton} ${likedPlaylists.includes(selectedPlaylist.id) ? styles.liked : ''}`}
                    onClick={() => toggleLike(selectedPlaylist.id)}
                  >
                    {likedPlaylists.includes(selectedPlaylist.id) ? <FaHeart /> : <FaRegHeart />}
                    {likedPlaylists.includes(selectedPlaylist.id) ? 'Salva' : 'Salvar'}
                  </button>
                  
                  <button className={styles.shareButton} onClick={sharePlaylist}>
                    <FaShareAlt /> Compartilhar
                  </button>
                  
                  <button className={styles.spotifyButton} onClick={openSpotify}>
                    <FaSpotify /> Ouvir no Spotify
                  </button>
                </div>
              </div>

              <div className={styles.playerWrapper}>
                <iframe
                  src={selectedPlaylist.embedUrl}
                  width="100%"
                  height="380"
                  frameBorder="0"
                  allow="encrypted-media"
                  title={`Spotify Playlist: ${selectedPlaylist.title}`}
                  className={styles.spotifyEmbed}
                ></iframe>
              </div>

              {/* Estatísticas da Playlist */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <FaMusic className={styles.statIcon} />
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>{selectedPlaylist.tracks}</span>
                    <span className={styles.statLabel}>Faixas</span>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <FaClock className={styles.statIcon} />
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>{selectedPlaylist.duration}</span>
                    <span className={styles.statLabel}>Duração</span>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <FaHeart className={styles.statIcon} />
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>{selectedPlaylist.likes.toLocaleString()}</span>
                    <span className={styles.statLabel}>Curtidas</span>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <FaUsers className={styles.statIcon} />
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>{selectedFilm.participants}</span>
                    <span className={styles.statLabel}>No Debate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Descrição da Playlist */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>
                  <FaHeadphones className={styles.cardIcon} />
                  Sobre esta Mixtape
                </h3>
                <span className={styles.curatorBadge}>
                  <FaStar /> {selectedPlaylist.curator}
                </span>
              </div>
              
              <div className={styles.descriptionContent}>
                <div className={styles.curatorNote}>
                  <FaMusic className={styles.noteIcon} />
                  <p><strong>Mixtape exclusiva:</strong> Criada especialmente para o CineMar, inspirada nas discussões do debate sobre "{selectedPlaylist.relatedFilm}".</p>
                </div>
                
                <p className={styles.playlistDescription}>
                  {selectedPlaylist.description}
                </p>
                
                <div className={styles.playlistDetails}>
                  <div className={styles.detailItem}>
                    <strong>Tema Principal:</strong>
                    <span>{selectedPlaylist.theme}</span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <strong>Diretor do Filme:</strong>
                    <span>{selectedPlaylist.director}</span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <strong>Ano do Filme:</strong>
                    <span>{selectedPlaylist.filmYear}</span>
                  </div>
                </div>
                
                {/* Faixas em Destaque */}
                {selectedPlaylist.highlightTracks && (
                  <div className={styles.highlightTracks}>
                    <h4>Faixas em Destaque</h4>
                    <div className={styles.tracksGrid}>
                      {selectedPlaylist.highlightTracks.map((track, index) => (
                        <div key={index} className={styles.trackItem}>
                          <div className={styles.trackNumber}>
                            {index + 1}
                          </div>
                          <span className={styles.trackName}>{track}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className={styles.tagsSection}>
                  <div className={styles.genresSection}>
                    <h4>Gêneros Musicais</h4>
                    <div className={styles.genreTags}>
                      {selectedPlaylist.genres.map((genre, index) => (
                        <span key={index} className={styles.genreTag}>{genre}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className={styles.languagesSection}>
                    <h4>Idiomas</h4>
                    <div className={styles.languageTags}>
                      {selectedPlaylist.languages.map((language, index) => (
                        <span key={index} className={styles.languageTag}>{language}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'film' && (
          <div className={styles.filmContent}>
            {/* Informações do Filme */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>
                  <FaFilm className={styles.cardIcon} />
                  {selectedFilm.title}
                </h2>
                <div className={styles.filmMeta}>
                  <span className={styles.filmYear}>
                    {selectedFilm.year}
                  </span>
                  <span className={styles.filmDirector}>
                    {selectedFilm.director}
                  </span>
                </div>
              </div>
              
              <div className={styles.filmInfoContent}>
                <div className={styles.synopsisSection}>
                  <h3>Sinopse</h3>
                  <p>{selectedFilm.synopsis}</p>
                </div>
                
                <div className={styles.themesSection}>
                  <h3>Temas Principais</h3>
                  <div className={styles.themeTags}>
                    {selectedFilm.themes.map((theme, index) => (
                      <span key={index} className={styles.themeTag}>{theme}</span>
                    ))}
                  </div>
                </div>
                
                <div className={styles.debateInfo}>
                  <h3>Debate Realizado</h3>
                  <div className={styles.debateDetails}>
                    <div className={styles.debateDetail}>
                      <FaCalendarAlt className={styles.detailIcon} />
                      <div className={styles.detailContent}>
                        <span className={styles.detailLabel}>Data</span>
                        <span className={styles.detailValue}>{selectedFilm.debateDate}</span>
                      </div>
                    </div>
                    
                    <div className={styles.debateDetail}>
                      <FaUsers className={styles.detailIcon} />
                      <div className={styles.detailContent}>
                        <span className={styles.detailLabel}>Participantes</span>
                        <span className={styles.detailValue}>{selectedFilm.participants} pessoas</span>
                      </div>
                    </div>
                    
                    <div className={styles.debateDetail}>
                      <FaMusic className={styles.detailIcon} />
                      <div className={styles.detailContent}>
                        <span className={styles.detailLabel}>Mixtape Relacionada</span>
                        <span className={styles.detailValue}>{selectedPlaylist.title}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Link para a Mixtape */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>
                  <FaHeadphones className={styles.cardIcon} />
                  Mixtape Inspirada
                </h3>
              </div>
              
              <div className={styles.playlistLink}>
                <div className={styles.playlistLinkImage}>
                  <img src={selectedPlaylist.coverImage} alt={selectedPlaylist.title} />
                </div>
                
                <div className={styles.playlistLinkInfo}>
                  <h4>{selectedPlaylist.title}</h4>
                  <p>{selectedPlaylist.description}</p>
                  
                  <div className={styles.playlistLinkActions}>
                    <button 
                      className={styles.spotifyButton}
                      onClick={() => setActiveTab('playlist')}
                    >
                      <FaHeadphones /> Ver Mixtape Completa
                    </button>
                    
                    <button 
                      className={styles.spotifyButtonOutline}
                      onClick={openSpotify}
                    >
                      <FaSpotify /> Abrir no Spotify
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Todas as Playlists */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>
              <FaListOl className={styles.cardIcon} />
              Todas as Mixtapes
            </h3>
            <span className={styles.playlistsCount}>
              {filteredPlaylists.length} disponíveis
            </span>
          </div>
          
          <div className={styles.allPlaylistsGrid}>
            {filteredPlaylists.map(playlist => (
              <div 
                key={playlist.id}
                className={`${styles.playlistCard} ${
                  selectedPlaylist.id === playlist.id ? styles.selectedPlaylist : ''
                }`}
                onClick={() => selectPlaylist(playlist)}
              >
                <div className={styles.playlistCardImage}>
                  <img src={playlist.coverImage} alt={playlist.title} />
                  <div className={styles.playlistCardOverlay}>
                    <FaPlay />
                  </div>
                </div>
                
                <div className={styles.playlistCardInfo}>
                  <h4>{playlist.title}</h4>
                  <p className={styles.playlistCardDescription}>{playlist.description.substring(0, 100)}...</p>
                  
                  <div className={styles.playlistCardMeta}>
                    <span>
                      <FaFilm /> {playlist.relatedFilm}
                    </span>
                    <span>
                      <FaMusic /> {playlist.tracks} faixas
                    </span>
                  </div>
                  
                  <div className={styles.playlistCardActions}>
                    <button 
                      className={`${styles.playlistCardLikeButton} ${likedPlaylists.includes(playlist.id) ? styles.liked : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(playlist.id);
                      }}
                    >
                      {likedPlaylists.includes(playlist.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    
                    <button 
                      className={styles.playlistCardSelectButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectPlaylist(playlist);
                      }}
                    >
                      Selecionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredPlaylists.length === 0 && (
            <div className={styles.noPlaylists}>
              <FaMusic className={styles.noPlaylistsIcon} />
              <h4>Nenhuma mixtape encontrada</h4>
              <p>Tente buscar por outro termo ou selecione uma categoria diferente.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <FaSpotify className={styles.footerLogo} />
            <div className={styles.footerText}>
              <h3>Mixtapes CineMar</h3>
              <p>Playlists exclusivas criadas para os debates cinematográficos</p>
            </div>
          </div>
          
          <div className={styles.footerStats}>
            <div className={styles.footerStat}>
              <span className={styles.footerStatValue}>3</span>
              <span className={styles.footerStatLabel}>Mixtapes</span>
            </div>
            
            <div className={styles.footerStat}>
              <span className={styles.footerStatValue}>
                {spotifyPlaylists.reduce((sum, p) => sum + p.likes, 0).toLocaleString()}
              </span>
              <span className={styles.footerStatLabel}>Curtidas</span>
            </div>
            
            <div className={styles.footerStat}>
              <span className={styles.footerStatValue}>
                {spotifyPlaylists.reduce((sum, p) => sum + p.tracks, 0)}
              </span>
              <span className={styles.footerStatLabel}>Faixas</span>
            </div>
          </div>
          
          <button className={styles.spotifyButton} onClick={openSpotify}>
            <FaSpotify /> Ouvir no Spotify
          </button>
        </div>
      </div>
    </div>
  );
}