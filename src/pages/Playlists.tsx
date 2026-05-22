import { useState, useEffect } from 'react';
import {
  FaSpotify,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaClock,
  FaMusic,
  FaFilm,
  FaUsers,
  FaBook,
  FaRandom,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaPlay,
  FaCalendarAlt,
  FaInfoCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaCalendarCheck,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from '../styles/Playlists.module.css';
import PlaylistForm from '../components/PlaylistForm';
import { useTheme } from '../components/context/ThemeContext'; // ✅ Adicionado

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

interface FilmInfo {
  id: number;
  title: string;
  year: string;
  director: string;
  synopsis: string;
  extendedSynopsis?: string;
  themes: string[];
  debateDate: string;
  participants: number;
  culturalContext?: string;
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

const spotifyPlaylistsInicial: Playlist[] = [
  {
    id: 1,
    title: "A Hora da Estrela: Solidão Urbana",
    description: "Mergulhe nas melodias que refletem a melancolia e profunda solidão de Macabéa, a inesquecível personagem de Clarice Lispector. Uma mixtape que captura a essência da condição feminina, os desafios da migração e a crueza do Brasil urbano dos anos 80.",
    spotifyId: "5NfX7eyzp0I01I86UzCkQF",
    spotifyUrl: "https://open.spotify.com/playlist/5NfX7eyzp0I01I86UzCkQF?si=gZaVJtwfSLa6_k-LXQwvcA",
    embedUrl: "https://open.spotify.com/embed/playlist/5NfX7eyzp0I01I86UzCkQF",
    coverImage: "https://mosaic.scdn.co/300/ab67706f0000000298c5a2e6ab67706f0000000298c5a2e6ab67706f0000000298c5a2e6ab67706f0000000298c5a2e6",
    duration: "1h 38min",
    tracks: 16,
    likes: 1245,
    curator: "CineMar Literatura",
    curatorDescription: "Uma seleção cuidadosa que homenageia a obra de Clarice Lispector através da música brasileira clássica e contemporânea.",
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
      "Wave - Tom Jobim",
    ],
  },
  {
    id: 2,
    title: "Bacurau & Ainda Estou Aqui: Resistência Sonora",
    description: "Uma jornada sonora vibrante que homenageia a resistência visceral e a rica identidade cultural brasileira. Inspirada na força da comunidade de 'Bacurau' e na memória afetiva de 'Ainda Estou Aqui', esta seleção é uma verdadeira celebração musical da luta, do sangue e da memória do nosso povo.",
    spotifyId: "3Ou7S8yzkrPngdRI4bSwym",
    spotifyUrl: "https://open.spotify.com/playlist/3Ou7S8yzkrPngdRI4bSwym?si=jRmsdVsVQqCUzo2S4Bp2kQ",
    embedUrl: "https://open.spotify.com/embed/playlist/3Ou7S8yzkrPngdRI4bSwym",
    coverImage: "https://mosaic.scdn.co/300/ab67706f00000002a8e5b5f5ab67706f00000002a8e5b5f5ab67706f00000002a8e5b5f5ab67706f00000002a8e5b5f5",
    duration: "2h 05min",
    tracks: 24,
    likes: 892,
    curator: "CineMar Cinema Brasileiro",
    curatorDescription: "Uma mixtape que celebra a resistência do povo brasileiro através de ritmos autênticos e vozes potentes.",
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
      "Soy Loco Por Ti América - Caetano Veloso",
    ],
  },
  {
    id: 3,
    title: "Medida Provisória: Vozes da Luta",
    description: "Batidas fortes e rimas afiadas compõem esta mixtape em alusão ao impactante longa 'Medida Provisória'. Explorando temas urgentes de resistência negra, direitos humanos e justiça social, esta playlist reúne as vozes mais potentes da música brasileira contemporânea que não se calam diante da opressão.",
    spotifyId: "1g2aYaaa5lv9TeBAZIfwGc",
    spotifyUrl: "https://open.spotify.com/playlist/1g2aYaaa5lv9TeBAZIfwGc?si=L7FrA0w0TPSuf1EfXTJRfQ",
    embedUrl: "https://open.spotify.com/embed/playlist/1g2aYaaa5lv9TeBAZIfwGc",
    coverImage: "https://mosaic.scdn.co/300/ab67706f00000003b8e5c6f6ab67706f00000003b8e5c6f6ab67706f00000003b8e5c6f6ab67706f00000003b8e5c6f6",
    duration: "1h 52min",
    tracks: 18,
    likes: 756,
    curator: "CineMar Política e Sociedade",
    curatorDescription: "Uma mixtape que amplifica vozes marginalizadas e questiona as estruturas de poder através da música.",
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
      "A Carne - Elza Soares",
    ],
  },
];

const filmInfoInicial: FilmInfo[] = [
  {
    id: 1,
    title: "A Hora da Estrela",
    year: "1985",
    director: "Suzana Amaral",
    synopsis: "Uma adaptação magistral do romance de Clarice Lispector que conta a história de Macabéa, uma jovem nordestina ingênua que migra para a selva de pedra de São Paulo.",
    extendedSynopsis: "O filme é um retrato cru e poético sobre a invisibilidade social, a busca por afeto e a dura realidade dos migrantes no Brasil. Através dos olhos de Macabéa, vemos a solidão que permeia a grande cidade, as relações humanas frágeis e a luta pela sobrevivência em um mundo que não a reconhece.",
    themes: ["Solidão Feminina", "Migração", "Condição Social", "Identidade"],
    culturalContext: "Baseado na novela de Clarice Lispector, o filme é uma reflexão profunda sobre a marginalização das mulheres pobres e migrantes no Brasil urbano.",
    debateDate: "19/03/2026",
    participants: 47,
  },
  {
    id: 2,
    title: "Bacurau & Ainda Estou Aqui",
    year: "2019 & 2015",
    director: "Kleber Mendonça Filho & Marcelo Lordello",
    synopsis: "Uma sessão dupla inesquecível que explora a resistência e a memória como formas de preservação cultural.",
    extendedSynopsis: "'Bacurau' nos leva a um futuro próximo onde uma pequena cidade do sertão precisa pegar em armas para defender sua existência contra invasores estrangeiros. Já 'Ainda Estou Aqui' tece uma narrativa delicada sobre luto, memória e a reconstrução da identidade através dos olhos de uma professora. Juntos, formam um retrato poderoso da resiliência brasileira.",
    themes: ["Resistência", "Identidade Cultural", "Memória", "Comunidade"],
    culturalContext: "Dois filmes que dialogam sobre a importância de preservar a identidade e a história do povo brasileiro frente às pressões externas.",
    debateDate: "12/02/2026",
    participants: 38,
  },
  {
    id: 3,
    title: "Medida Provisória",
    year: "2022",
    director: "Lázaro Ramos",
    synopsis: "Um thriller distópico assustadoramente atual que imagina um Brasil de um futuro próximo onde o governo aprova uma medida provisória que obriga todos os cidadãos negros a migrarem para a África.",
    extendedSynopsis: "O filme acompanha a resistência de personagens que se recusam a abandonar seu país, gerando um debate profundo sobre racismo estrutural, direitos humanos e a luta pela igualdade. Uma alegoria poderosa que questiona as estruturas de poder e a discriminação racial no Brasil contemporâneo.",
    themes: ["Racismo", "Direitos Humanos", "Justiça Social", "Distopia"],
    culturalContext: "Uma obra que utiliza a ficção científica para criticar o racismo institucional e a marginalização da população negra brasileira.",
    debateDate: "05/02/2026",
    participants: 42,
  },
];

const playlistCategories = [
  { id: 'all', name: 'Todas as Mixtapes', icon: <FaMusic /> },
  { id: 'literatura', name: 'Literatura em Foco', icon: <FaBook /> },
  { id: 'cinema', name: 'Puro Cinema', icon: <FaFilm /> },
  { id: 'sociedade', name: 'Debate Social', icon: <FaUsers /> },
];

export default function Playlists() {
  const { theme } = useTheme(); // ✅ Usando tema do contexto
  const isDarkMode = theme === 'dark';
  
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>(spotifyPlaylistsInicial[0]);
  const [selectedFilm, setSelectedFilm] = useState<FilmInfo>(filmInfoInicial[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [likedPlaylists, setLikedPlaylists] = useState<number[]>([1]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>(spotifyPlaylistsInicial);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>(spotifyPlaylistsInicial);
  const [films] = useState<FilmInfo[]>(filmInfoInicial);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  
  // Estado para Toast
  const [toast, setToast] = useState<{msg: string; type: 'success' | 'error' | 'warn'} | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'warn' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Carregar sessões do localStorage
  useEffect(() => {
    const storedSessoes = localStorage.getItem('cinemar_sessoes');
    if (storedSessoes) {
      setSessoes(JSON.parse(storedSessoes));
    }
  }, []);

  // Verificar usuário logado
  useEffect(() => {
    const storedUser = localStorage.getItem('cinemar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Carregar dados do localStorage
  useEffect(() => {
    const storedPlaylists = localStorage.getItem('cinemar_playlists');
    if (storedPlaylists) {
      setPlaylists(JSON.parse(storedPlaylists));
    } else {
      setPlaylists(spotifyPlaylistsInicial);
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem('cinemar_playlists', JSON.stringify(playlists));
    }
  }, [playlists]);

  // ✅ Removido useEffect do tema (agora gerenciado pelo contexto)

  useEffect(() => {
    let filtered = playlists;
    if (selectedCategory === 'literatura') filtered = playlists.filter(p => p.id === 1);
    else if (selectedCategory === 'cinema') filtered = playlists.filter(p => p.id === 2);
    else if (selectedCategory === 'sociedade') filtered = playlists.filter(p => p.id === 3);

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.relatedFilm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.theme.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPlaylists(filtered);
    if (!filtered.some(p => p.id === selectedPlaylist.id) && filtered.length > 0) {
      setSelectedPlaylist(filtered[0]);
      const film = films.find(f => f.id === filtered[0].id);
      if (film) setSelectedFilm(film);
    }
  }, [selectedCategory, searchTerm, playlists, films, selectedPlaylist.id]);

  useEffect(() => {
    const film = films.find(f => f.id === selectedPlaylist.id);
    if (film) setSelectedFilm(film);
    setHeroLoaded(false);
    const t = setTimeout(() => setHeroLoaded(true), 50);
    return () => clearTimeout(t);
  }, [selectedPlaylist, films]);

  const isAdmin = user?.role === 'admin';

  const toggleLike = (id: number) =>
    setLikedPlaylists(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const openSpotify = () => window.open(selectedPlaylist.spotifyUrl, '_blank');
  const sharePlaylist = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedPlaylist.title,
        text: `Ouça a mixtape inspirada em ${selectedPlaylist.relatedFilm}`,
        url: selectedPlaylist.spotifyUrl,
      });
    } else {
      navigator.clipboard.writeText(selectedPlaylist.spotifyUrl);
      showToast('Link copiado!', 'success');
    }
  };

  const selectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    const film = films.find(f => f.id === playlist.id);
    if (film) setSelectedFilm(film);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrev = () => {
    const i = filteredPlaylists.findIndex(p => p.id === selectedPlaylist.id);
    const n = i > 0 ? i - 1 : filteredPlaylists.length - 1;
    selectPlaylist(filteredPlaylists[n]);
  };

  const goToNext = () => {
    const i = filteredPlaylists.findIndex(p => p.id === selectedPlaylist.id);
    const n = i < filteredPlaylists.length - 1 ? i + 1 : 0;
    selectPlaylist(filteredPlaylists[n]);
  };

  const goToRandom = () => {
    const r = Math.floor(Math.random() * filteredPlaylists.length);
    selectPlaylist(filteredPlaylists[r]);
  };

  const currentIndex = filteredPlaylists.findIndex(p => p.id === selectedPlaylist.id);

  // ===== CRUD PLAYLISTS =====
  const handleAddPlaylist = (playlistData: Partial<Playlist>) => {
    if (!playlistData.title || !playlistData.spotifyUrl) {
      showToast('Preencha título e URL do Spotify!', 'error');
      return;
    }

    const newPlaylist: Playlist = {
      id: Date.now(),
      title: playlistData.title!,
      description: playlistData.description || '',
      spotifyId: playlistData.spotifyId || '',
      spotifyUrl: playlistData.spotifyUrl!,
      embedUrl: playlistData.embedUrl || '',
      coverImage: playlistData.coverImage || 'https://i.scdn.co/image/ab67706f0000000298c5a2e6',
      duration: playlistData.duration || '1h',
      tracks: playlistData.tracks || 0,
      likes: 0,
      curator: playlistData.curator || 'CineMar',
      relatedFilm: playlistData.relatedFilm || '',
      filmYear: playlistData.filmYear || '',
      director: playlistData.director || '',
      genres: playlistData.genres || [],
      languages: playlistData.languages || [],
      createdAt: new Date().toLocaleDateString('pt-BR'),
      theme: playlistData.theme || '',
      highlightTracks: playlistData.highlightTracks || [],
      curatorDescription: playlistData.curatorDescription || '',
      sessaoId: playlistData.sessaoId
    };

    setPlaylists([newPlaylist, ...playlists]);
    showToast(`"${newPlaylist.title}" adicionada com sucesso!`);
  };

  const handleEditPlaylist = (playlistData: Partial<Playlist>) => {
    if (!editingPlaylist) return;

    const updatedPlaylists = playlists.map(p =>
      p.id === editingPlaylist.id
        ? { ...p, ...playlistData }
        : p
    );

    setPlaylists(updatedPlaylists);
    if (selectedPlaylist.id === editingPlaylist.id) {
      setSelectedPlaylist({ ...editingPlaylist, ...playlistData });
    }
    setEditingPlaylist(null);
    showToast(`"${playlistData.title}" atualizada!`);
  };

  const handleDeletePlaylist = (id: number) => {
    if (confirmDelete === id) {
      setPlaylists(playlists.filter(p => p.id !== id));
      if (selectedPlaylist.id === id && filteredPlaylists.length > 1) {
        const next = filteredPlaylists.find(p => p.id !== id);
        if (next) selectPlaylist(next);
      }
      showToast('Playlist removida.', 'warn');
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const openEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setShowPlaylistForm(true);
  };

  const closeForm = () => {
    setShowPlaylistForm(false);
    setEditingPlaylist(null);
  };

  // Buscar título da sessão pelo ID
  const getSessaoTitulo = (sessaoId?: number) => {
    if (!sessaoId) return '';
    const sessao = sessoes.find(s => s.id === sessaoId);
    return sessao ? sessao.titulo : '';
  };

  return (
    // ✅ Usando isDarkMode para a classe CSS
    <div className={`${styles.playlistsContainer} ${isDarkMode ? styles.dark : styles.light}`}>
      {/* HEADER - estilo igual ao Filmes */}
      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={styles.backLink}>
              ← Voltar para Início
            </Link>
          </div>
          
          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>
              ACERVO SONORO
            </h1>
            <p className={styles.heroSubtitle}>
              A música expande a tela. Explore nossas mixtapes exclusivas, curadas a dedo para prolongar as emoções e reflexões dos nossos debates cinematográficos.
            </p>
          </div>
        </div>
      </header>

      {/* Botão flutuante de adicionar (apenas admin) */}
      {isAdmin && (
        <button
          className={styles.floatingAddBtn}
          onClick={() => setShowPlaylistForm(true)}
          title="Adicionar playlist"
        >
          <FaPlus />
        </button>
      )}

      {/* Formulário de Playlist */}
      <PlaylistForm
        isOpen={showPlaylistForm}
        onClose={closeForm}
        onSave={editingPlaylist ? handleEditPlaylist : handleAddPlaylist}
        initialData={editingPlaylist || undefined}
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

      {/* MAIN CONTENT */}
      <main className={styles.mainContent}>
        {/* HERO CARD */}
        <div className={`${styles.card} ${heroLoaded ? styles.loaded : ''}`}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.currentPlaylistTitle}>{selectedPlaylist.title}</h2>
              <p className={styles.subtitle} style={{ marginTop: '8px' }}>
                Curada por: {selectedPlaylist.curator}
              </p>
              {selectedPlaylist.curatorDescription && (
                <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.8, lineHeight: '1.6' }}>
                  {selectedPlaylist.curatorDescription}
                </p>
              )}
              <span className={styles.debateFilm}>
                <FaFilm style={{ marginRight: '6px' }} />
                Universo Cinematográfico: {selectedPlaylist.relatedFilm}
                {selectedPlaylist.sessaoId && (
                  <span className={styles.sessaoBadge}>
                    Sessão: {getSessaoTitulo(selectedPlaylist.sessaoId)}
                  </span>
                )}
              </span>
            </div>
            {isAdmin && (
              <div className={styles.cardAdminActions}>
                <button onClick={() => openEditPlaylist(selectedPlaylist)} className={styles.cardEditBtn} title="Editar playlist">
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleDeletePlaylist(selectedPlaylist.id)} 
                  className={`${styles.cardDeleteBtn} ${confirmDelete === selectedPlaylist.id ? styles.confirmingDelete : ''}`}
                  title={confirmDelete === selectedPlaylist.id ? 'Confirmar exclusão?' : 'Excluir playlist'}
                >
                  {confirmDelete === selectedPlaylist.id ? <FaTimes /> : <FaTrash />}
                </button>
              </div>
            )}
          </div>

          <div style={{ padding: '0 32px 32px' }}>
            <p style={{ fontSize: '16px', lineHeight: '1.7', marginBottom: '24px', opacity: 0.85 }}>
              {selectedPlaylist.description}
            </p>

            {/* STATS */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h5>Duração</h5>
                <p>{selectedPlaylist.duration}</p>
              </div>
              <div className={styles.statCard}>
                <h5>Faixas</h5>
                <p>{selectedPlaylist.tracks}</p>
              </div>
              <div className={styles.statCard}>
                <h5>Curtidas</h5>
                <p>{selectedPlaylist.likes.toLocaleString('pt-BR')}</p>
              </div>
              <div className={styles.statCard}>
                <h5>Criada em</h5>
                <p>{selectedPlaylist.createdAt}</p>
              </div>
            </div>

            {/* ACTIONS */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
              <button className={styles.spotifyButton} onClick={openSpotify}>
                <FaSpotify /> Abrir no Spotify
              </button>
              <button
                className={styles.spotifyButton}
                style={{
                  background: 'transparent',
                  border: '1.5px solid var(--spotify-green)',
                  color: 'var(--spotify-green)',
                  cursor: 'pointer',
                }}
                onClick={() => toggleLike(selectedPlaylist.id)}
              >
                {likedPlaylists.includes(selectedPlaylist.id) ? <FaHeart /> : <FaRegHeart />}
                {likedPlaylists.includes(selectedPlaylist.id) ? 'Curtido' : 'Curtir'}
              </button>
              <button
                className={styles.spotifyButton}
                style={{
                  background: 'transparent',
                  border: '1.5px solid var(--spotify-green)',
                  color: 'var(--spotify-green)',
                  cursor: 'pointer',
                }}
                onClick={sharePlaylist}
              >
                <FaShareAlt /> Compartilhar
              </button>
            </div>

            {/* NAVIGATION */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '28px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className={styles.playlistNavButton} onClick={goToPrev} disabled={filteredPlaylists.length <= 1}>
                <FaChevronLeft />
              </button>
              <span style={{ fontSize: '14px', opacity: 0.6, minWidth: '80px', textAlign: 'center' }}>
                {currentIndex + 1} / {filteredPlaylists.length}
              </span>
              <button className={styles.playlistNavButton} onClick={goToNext} disabled={filteredPlaylists.length <= 1}>
                <FaChevronRight />
              </button>
              <button className={styles.playlistNavButton} onClick={goToRandom}>
                <FaRandom />
              </button>
            </div>
          </div>
        </div>

        {/* FILM INFO CARD */}
        <div className={styles.card} style={{ marginTop: '32px' }}>
          <div className={styles.cardHeader}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
              <FaFilm style={{ marginRight: '10px', color: 'var(--spotify-green)' }} />
              Sobre o Filme
            </h3>
          </div>

          <div style={{ padding: '0 32px 32px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0' }}>
              {selectedFilm.title}
            </h4>
            <p style={{ fontSize: '14px', opacity: 0.7, margin: '0 0 16px 0' }}>
              {selectedFilm.year} • Direção: {selectedFilm.director}
            </p>

            <p style={{ fontSize: '16px', lineHeight: '1.7', marginBottom: '16px', opacity: 0.85 }}>
              {selectedFilm.synopsis}
            </p>

            {selectedFilm.extendedSynopsis && (
              <p style={{ fontSize: '15px', lineHeight: '1.7', marginBottom: '20px', opacity: 0.8, fontStyle: 'italic' }}>
                {selectedFilm.extendedSynopsis}
              </p>
            )}

            {selectedFilm.culturalContext && (
              <div style={{
                padding: '16px',
                background: 'rgba(29, 185, 84, 0.08)',
                borderLeft: '3px solid var(--spotify-green)',
                borderRadius: '6px',
                marginBottom: '20px',
              }}>
                <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                  <FaInfoCircle style={{ marginRight: '8px', color: 'var(--spotify-green)' }} />
                  <strong>Contexto Cultural:</strong> {selectedFilm.culturalContext}
                </p>
              </div>
            )}

            {/* THEMES */}
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0', opacity: 0.7 }}>
                Temas Centrais
              </h5>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedFilm.themes.map((t, idx) => (
                  <span key={idx} className={styles.themeTag}>{t}</span>
                ))}
              </div>
            </div>

            {/* DEBATE INFO */}
            <div className={styles.debateInfo}>
              <div>
                <p className={styles.debateLabel}>Próximo Debate</p>
                <p className={styles.debateValue}>
                  <FaCalendarAlt style={{ marginRight: '6px' }} />
                  {selectedFilm.debateDate}
                </p>
              </div>
              <div>
                <p className={styles.debateLabel}>Participantes</p>
                <p className={styles.debateValue}>
                  <FaUsers style={{ marginRight: '6px' }} />
                  {selectedFilm.participants} pessoas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* HIGHLIGHT TRACKS */}
        {selectedPlaylist.highlightTracks && selectedPlaylist.highlightTracks.length > 0 && (
          <div className={styles.card} style={{ marginTop: '32px' }}>
            <div className={styles.cardHeader}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
                <FaMusic style={{ marginRight: '10px', color: 'var(--spotify-green)' }} />
                Faixas Destacadas
              </h3>
            </div>

            <div style={{ padding: '0 32px 32px' }}>
              <div className={styles.highlightTracksList}>
                {selectedPlaylist.highlightTracks.map((track, idx) => (
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

        {/* PLAYLISTS GRID */}
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 24px 0' }}>
            <FaMusic style={{ marginRight: '10px', color: 'var(--spotify-green)' }} />
            Outras Playlists
          </h3>
          <div className={styles.allPlaylistsGrid}>
            {filteredPlaylists.map((playlist) => (
              <div key={playlist.id} className={styles.playlistCard} onClick={() => selectPlaylist(playlist)}>
                <div className={styles.playlistCardImage}>
                  <img src={playlist.coverImage} alt={playlist.title} />
                </div>
                <div className={styles.playlistCardInfo}>
                  <h4>{playlist.title}</h4>
                  <p className={styles.playlistCardDescription}>{playlist.theme}</p>
                  <div className={styles.playlistMeta}>
                    <span>{playlist.tracks} faixas</span>
                    <span>{playlist.duration}</span>
                  </div>
                  <div className={styles.playlistGenres}>
                    {playlist.genres.slice(0, 2).map((genre, idx) => (
                      <span key={idx} className={styles.genreTag}>{genre}</span>
                    ))}
                  </div>
                  {isAdmin && (
                    <div className={styles.gridAdminActions}>
                      <button onClick={(e) => { e.stopPropagation(); openEditPlaylist(playlist); }} className={styles.gridEditBtn}>
                        <FaEdit />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(playlist.id); }} 
                        className={`${styles.gridDeleteBtn} ${confirmDelete === playlist.id ? styles.confirmingDelete : ''}`}
                      >
                        {confirmDelete === playlist.id ? <FaTimes /> : <FaTrash />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>
          {toast.type === 'success' && <FaCalendarCheck />}
          {toast.type === 'error' && <FaInfoCircle />}
          {toast.type === 'warn' && <FaInfoCircle />}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}