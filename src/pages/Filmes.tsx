import { useState, useEffect, useRef } from 'react';
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
  FaLanguage,
  FaTrophy,
  FaRegHeart,
  FaRegBookmark,
  FaFilter,
  FaSearch,
  FaMoon,
  FaSun,
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
  FaTimes
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Filmes.module.css';

// Importação de imagens
import Corra from '../images/filmes/Corra.jpg';
import AindaEstouAqui from '../images/filmes/Ainda-estou-aqui.jpeg';
import Bacurau from '../images/filmes/Bacurau.jpeg';
import HoraDaEstrela from '../images/filmes/A-hora-da-estrela.jpeg';
import BichoDeSeteCabecas from '../images/filmes/Bicho-de-sete-cabeças.jpg';
import TerraEstrangeira from '../images/filmes/Terra-estrangeira.webp';
import JangadaDeWelles from '../images/filmes/A-jangada-de-welles.jpg';
import FracosNaoTemVez from '../images/filmes/Onde-os-fracos-não-tem-vez.webp';
import MedidaProvisoria from '../images/filmes/Medida-provisória.jpg';
import NosQueAquiEstamos from '../images/filmes/Nós-que-aqui-estamos.webp';
import UltimoPulp from '../images/filmes/O-último-pub.webp';
import AgenteSecreto from '../images/filmes/O-agente-secreto.jpg';

interface Filme {
  id: number;
  title: string;
  director: string;
  year: number;
  status: 'Realizado' | 'Próximo';
  date: string;
  description: string;
  imageUrl: string;
  highlight: boolean;
  screenplay: string;
  cast: string;
  rating: number;
  reviewCount: number;
  genre: string;
  duration?: string;
  language?: string;
  awards?: string[];
  tags?: string[];
  views?: number;
  materialsLink?: string;
  playlistLink?: string;
  playlistId?: number;
}

export default function Filmes() {
  const navigate = useNavigate();

  const [filmes, setFilmes] = useState<Filme[]>([
    {
      id: 1,
      title: "Ainda Estou Aqui",
      director: "Walter Carvalho",
      year: 2015,
      status: "Realizado",
      date: "5 de Outubro, 2024",
      description: "Documentário que retrata a vida e obra do fotógrafo e cineasta brasileiro Walter Carvalho, explorando sua trajetória no cinema nacional e suas reflexões sobre a arte da imagem.",
      imageUrl: AindaEstouAqui,
      highlight: false,
      screenplay: "Walter Carvalho, Maria Ramos",
      cast: "Documentário com entrevistas",
      rating: 4.2,
      reviewCount: 89,
      genre: "Documentário",
      duration: "92 min",
      language: "Português",
      awards: ["Melhor Documentário - Festival do Rio"],
      tags: ["Documentário", "Arte", "Cinema Brasileiro"],
      views: 1250,
      materialsLink: "/materiais?debate=ainda-estou-aqui",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 1
    },
    {
      id: 2,
      title: "Bacurau",
      director: "Kleber Mendonça Filho e Juliano Dornelles",
      year: 2019,
      status: "Realizado",
      date: "12 de Outubro, 2024",
      description: "Os moradores de Bacurau, um pequeno povoado do sertão brasileiro, descobrem que a comunidade não consta mais em qualquer mapa. A situação se agrava quando estrangeiros começam a atacar a cidade.",
      imageUrl: Bacurau,
      highlight: false,
      screenplay: "Kleber Mendonça Filho, Juliano Dornelles",
      cast: "Sônia Braga, Udo Kier, Bárbara Colen, Thomas Aquino",
      rating: 4.5,
      reviewCount: 234,
      genre: "Ficção Científica/Drama",
      duration: "131 min",
      language: "Português",
      awards: ["Prêmio do Júri - Cannes", "Melhor Filme - Festival de Brasília"],
      tags: ["Ficção", "Sertão", "Ação", "Drama"],
      views: 2890,
      materialsLink: "/materiais?debate=bacurau",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 2
    },
    {
      id: 3,
      title: "A Hora da Estrela",
      director: "Suzana Amaral",
      year: 1985,
      status: "Realizado",
      date: "19 de Outubro, 2024",
      description: "Baseado na obra de Clarice Lispector, conta a história de Macabéa, uma datilógrafa alagoana que se muda para São Paulo em busca de uma vida melhor.",
      imageUrl: HoraDaEstrela,
      highlight: false,
      screenplay: "Suzana Amaral (baseado em Clarice Lispector)",
      cast: "Marcélia Cartaxo, José Dumont, Tamara Taxman",
      rating: 4.7,
      reviewCount: 156,
      genre: "Drama",
      duration: "96 min",
      language: "Português",
      awards: ["Urso de Prata - Berlim", "Melhor Atriz - Festival de Brasília"],
      tags: ["Clássico", "Drama", "Literatura"],
      views: 1980,
      materialsLink: "/materiais?debate=hora-estrela",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 3
    },
    {
      id: 4,
      title: "Bicho de Sete Cabeças",
      director: "Laís Bodanzky",
      year: 2000,
      status: "Realizado",
      date: "26 de Outubro, 2024",
      description: "Baseado na história real de Austregésilo Carrano Bueno, o filme mostra Neto, um jovem que é internado contra a vontade em um hospital psiquiátrico por seu pai.",
      imageUrl: BichoDeSeteCabecas,
      highlight: false,
      screenplay: "Laís Bodanzky, Luiz Bolognesi",
      cast: "Rodrigo Santoro, Cássia Kiss, Othon Bastos",
      rating: 4.3,
      reviewCount: 112,
      genre: "Drama",
      duration: "73 min",
      language: "Português",
      awards: ["Melhor Filme - Festival de Gramado"],
      tags: ["Drama", "Saúde Mental", "Baseado em Fatos"],
      views: 1560,
      materialsLink: "/materiais?debate=bicho-sete-cabecas",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 4
    },
    {
      id: 5,
      title: "Terra Estrangeira",
      director: "Walter Salles e Daniela Thomas",
      year: 1995,
      status: "Realizado",
      date: "2 de Novembro, 2024",
      description: "Durante o Plano Collor em 1990, Pedro parte para Lisboa após a morte de sua mãe, levando consigo um pacote misterioso.",
      imageUrl: TerraEstrangeira,
      highlight: false,
      screenplay: "Walter Salles, Daniela Thomas, Marcos Bernstein",
      cast: "Fernanda Torres, Fernando Alves Pinto, Alexandre Borges",
      rating: 4.0,
      reviewCount: 98,
      genre: "Drama",
      duration: "100 min",
      language: "Português",
      awards: ["Melhor Filme - Festival de Havana"],
      tags: ["Drama", "Viagem", "Identidade"],
      views: 1320,
      materialsLink: "/materiais?debate=terra-estrangeira",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 5
    },
    {
      id: 6,
      title: "A Jangada de Welles",
      director: "Rogério Sganzerla",
      year: 2004,
      status: "Realizado",
      date: "9 de Novembro, 2024",
      description: "Documentário sobre a tentativa frustrada de Orson Welles de filmar 'It's All True' no Nordeste brasileiro nos anos 1940.",
      imageUrl: JangadaDeWelles,
      highlight: false,
      screenplay: "Rogério Sganzerla",
      cast: "Documentário com imagens de arquivo",
      rating: 3.8,
      reviewCount: 67,
      genre: "Documentário",
      duration: "85 min",
      language: "Português/Inglês",
      awards: ["Melhor Documentário - É Tudo Verdade"],
      tags: ["Documentário", "História", "Cinema"],
      views: 980,
      materialsLink: "/materiais?debate=jangada-welles",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 6
    },
    {
      id: 7,
      title: "Onde os Fracos Não Têm Vez",
      director: "Joel e Ethan Coen",
      year: 2007,
      status: "Realizado",
      date: "16 de Novembro, 2024",
      description: "Adaptação do romance de Cormac McCarthy. No Texas, Llewelyn Moss encontra dois milhões de dólares em dinheiro de droga no deserto.",
      imageUrl: FracosNaoTemVez,
      highlight: false,
      screenplay: "Joel Coen, Ethan Coen (baseado em Cormac McCarthy)",
      cast: "Tommy Lee Jones, Javier Bardem, Josh Brolin",
      rating: 4.6,
      reviewCount: 345,
      genre: "Suspense/Drama",
      duration: "122 min",
      language: "Inglês",
      awards: ["4 Oscars", "Globo de Ouro"],
      tags: ["Suspense", "Policial", "Prêmios"],
      views: 3240,
      materialsLink: "/materiais?debate=fracos-nao-tem-vez",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 7
    },
    {
      id: 8,
      title: "Corra!",
      director: "Jordan Peele",
      year: 2017,
      status: "Realizado",
      date: "23 de Novembro, 2024",
      description: "Chris, um jovem fotógrafo negro, visita a família de sua namorada branca pela primeira vez. O que começa como um fim de semana tenso se transforma em um pesadelo.",
      imageUrl: Corra,
      highlight: false,
      screenplay: "Jordan Peele",
      cast: "Daniel Kaluuya, Allison Williams, Bradley Whitford",
      rating: 4.8,
      reviewCount: 432,
      genre: "Terror/Suspense",
      duration: "104 min",
      language: "Inglês",
      awards: ["Oscar de Melhor Roteiro Original"],
      tags: ["Terror", "Suspense", "Social"],
      views: 4120,
      materialsLink: "/materiais?debate=corra",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 8
    },
    {
      id: 9,
      title: "Medida Provisória",
      director: "Lázaro Ramos",
      year: 2022,
      status: "Realizado",
      date: "30 de Novembro, 2024",
      description: "Em um futuro distópico, o governo brasileiro decreta uma medida provisória que obriga afrodescendentes a emigrarem para a África.",
      imageUrl: MedidaProvisoria,
      highlight: false,
      screenplay: "Lázaro Ramos, Aldri Anunciação",
      cast: "Taís Araújo, Alfred Enoch, Seu Jorge",
      rating: 4.1,
      reviewCount: 178,
      genre: "Ficção Científica/Drama",
      duration: "115 min",
      language: "Português",
      awards: ["Melhor Direção - Festival do Rio"],
      tags: ["Ficção", "Distopia", "Social"],
      views: 1870,
      materialsLink: "/materiais?debate=medida-provisoria",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 9
    },
    {
      id: 10,
      title: "Nós que Aqui Estamos por Vós Esperamos",
      director: "Marcelo Masagão",
      year: 1999,
      status: "Realizado",
      date: "7 de Dezembro, 2024",
      description: "Documentário experimental que traça um panorama do século XX através de imagens de arquivo.",
      imageUrl: NosQueAquiEstamos,
      highlight: false,
      screenplay: "Marcelo Masagão",
      cast: "Documentário com imagens de arquivo",
      rating: 4.4,
      reviewCount: 123,
      genre: "Documentário Experimental",
      duration: "73 min",
      language: "Português",
      awards: ["Prêmio Especial do Júri - É Tudo Verdade"],
      tags: ["Documentário", "Experimental", "História"],
      views: 1100,
      materialsLink: "/materiais?debate=nos-que-aqui-estamos",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 10
    },
    {
      id: 11,
      title: "O Último Pulp",
      director: "Sergio Bianchi",
      year: 2002,
      status: "Realizado",
      date: "14 de Dezembro, 2024",
      description: "Sátira sobre a indústria cultural brasileira através da história de Tarso, um diretor de TV que decide fazer um filme autoral.",
      imageUrl: UltimoPulp,
      highlight: false,
      screenplay: "Sergio Bianchi",
      cast: "Fernando Alves Pinto, Dira Paes, Cássia Kiss",
      rating: 3.9,
      reviewCount: 87,
      genre: "Comédia/Drama",
      duration: "90 min",
      language: "Português",
      awards: ["Melhor Ator - Festival de Brasília"],
      tags: ["Comédia", "Sátira", "Cinema"],
      views: 920,
      materialsLink: "/materiais?debate=ultimo-pulp",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 11
    },
    {
      id: 12,
      title: "O Agente Secreto",
      director: "Kleber Mendonça Filho", 
      year: 2025, 
      status: "Próximo", 
      date: "6 de Novembro, 2025", 
      description: "Em 1977, durante a ditadura militar brasileira, o ex-professor Armando retorna a Recife em busca de refúgio, mas se vê perseguido por um passado político violento e envolto em uma teia de corrupção e segredos.",
      imageUrl: AgenteSecreto,
      highlight: true,
      screenplay: "Kleber Mendonça Filho",
      cast: "Wagner Moura, Maria Fernanda Cândido, Gabriel Leone, Alice Carvalho, Udo Kier",
      rating: 4.4, 
      reviewCount: 215, 
      genre: "Thriller Político/Drama",
      duration: "158 min", 
      language: "Português", 
      awards: ["Melhor Diretor - Cannes 2025", "Melhor Ator (Wagner Moura) - Cannes 2025", "Globo de Ouro de Melhor Filme Estrangeiro 2026"],
      tags: ["Thriller Político", "Ditadura", "Recife", "Prêmios"],
      views: 0,
      materialsLink: "/materiais?debate=agente-secreto",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 12
    }
  ]);

  const [selectedFilme, setSelectedFilme] = useState<Filme>(filmes[11]);
  const [favorites, setFavorites] = useState<number[]>([8, 11]);
  const [watchlist, setWatchlist] = useState<number[]>([2, 7]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'realized' | 'upcoming'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const shareRef = useRef<HTMLDivElement>(null);
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  // Filtragem de filmes
  const filteredFilmes = filmes.filter(filme => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'realized' && filme.status === 'Realizado') ||
      (activeFilter === 'upcoming' && filme.status === 'Próximo');
    
    const matchesSearch = searchTerm === '' || 
      filme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filme.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filme.genre.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Alternar tema com animação
  const toggleTheme = () => {
    setIsThemeChanging(true);
    setTheme(theme === 'light' ? 'dark' : 'light');
    setTimeout(() => setIsThemeChanging(false), 300);
  };

  // Fechar menu de compartilhamento ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Aplicar tema ao body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Funções de interação
  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const toggleWatchlist = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchlist(prev => 
      prev.includes(id) ? prev.filter(watchId => watchId !== id) : [...prev, id]
    );
  };

  const shareFilme = () => {
    if (navigator.share) {
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
    alert('Link copiado!');
  };

  // Funções de navegação
  const handleGoToMaterials = () => {
    if (selectedFilme.materialsLink) {
      window.location.href = selectedFilme.materialsLink;
    }
  };

  const handleGoToCineMarPlaylist = () => {
    navigate(`/playlists?playlistId=${selectedFilme.playlistId || selectedFilme.id}`);
  };

  const handleOpenExternalPlaylist = () => {
    if (selectedFilme.playlistLink) {
      window.open(selectedFilme.playlistLink, '_blank');
    }
  };

  // Componente ÚNICO para botões de acesso
  const AccessButtons = () => {
    if (selectedFilme.status !== 'Realizado') return null;

    return (
      <div className={styles.accessSection}>
        <h3 className={styles.sectionTitle}>Acessos Disponíveis</h3>
        <div className={styles.accessButtons}>
          {selectedFilme.materialsLink && (
            <button 
              className={styles.accessButton}
              onClick={handleGoToMaterials}
            >
              <FaImages className={styles.buttonIcon} />
              <div className={styles.buttonInfo}>
                <span className={styles.buttonTitle}>Materiais do Debate</span>
                <span className={styles.buttonSubtitle}>Fotos e documentos</span>
              </div>
            </button>
          )}
          
          <button 
            className={`${styles.accessButton} ${styles.playlistButton}`}
            onClick={handleGoToCineMarPlaylist}
          >
            <FaHeadphones className={styles.buttonIcon} />
            <div className={styles.buttonInfo}>
              <span className={styles.buttonTitle}>Playlist Oficial</span>
              <span className={styles.buttonSubtitle}>CineMar no Spotify</span>
            </div>
          </button>
          
          {selectedFilme.playlistLink && (
            <button 
              className={styles.accessButton}
              onClick={handleOpenExternalPlaylist}
            >
              <FaMusic className={styles.buttonIcon} />
              <div className={styles.buttonInfo}>
                <span className={styles.buttonTitle}>Trilha Sonora</span>
                <span className={styles.buttonSubtitle}>YouTube Music</span>
              </div>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.filmesContainer} ${theme === 'dark' ? styles.dark : ''} ${isThemeChanging ? styles.themeChanging : ''}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTop}>
            <div className={styles.title}>
              <span className={styles.titleMain}>FILMES</span>
              <span className={styles.titleSub}>CINEMAR</span>
            </div>
            <button 
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
          </div>
          <p className={styles.subtitle}>
            Programação completa • {filteredFilmes.length} filmes • Tema {theme === 'light' ? 'Claro' : 'Escuro'}
          </p>
        </div>
      </header>

      <div className={styles.filmesContent}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>
              <FaFilter /> Programação
            </h2>
            <span className={styles.totalFilmes}>
              {filteredFilmes.length} filmes
            </span>
          </div>

          {/* Filtros */}
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
                Próximo
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
                <button 
                  className={styles.clearSearch}
                  onClick={() => setSearchTerm('')}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Lista de Filmes */}
          <div className={styles.filmeList}>
            {filteredFilmes.map((filme) => (
              <div
                key={filme.id}
                className={`${styles.filmeListItem} ${
                  selectedFilme.id === filme.id ? styles.active : ''
                } ${filme.highlight ? styles.highlighted : ''}`}
                onClick={() => setSelectedFilme(filme)}
              >
                <div className={styles.listItemImage}>
                  <img 
                    src={filme.imageUrl} 
                    alt={filme.title}
                    className={styles.filmeThumbnail}
                  />
                  {filme.status === 'Próximo' && (
                    <div className={styles.upcomingBadge}>
                      <FaFire /> PRÓXIMO
                    </div>
                  )}
                </div>
                
                <div className={styles.listItemContent}>
                  <div className={styles.listItemHeader}>
                    <div className={styles.filmeNumber}>
                      #{filme.id.toString().padStart(2, '0')}
                    </div>
                    <div className={styles.itemActions}>
                      <button
                        className={`${styles.actionBtn} ${favorites.includes(filme.id) ? styles.active : ''}`}
                        onClick={(e) => toggleFavorite(filme.id, e)}
                        title={favorites.includes(filme.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >
                        <FaHeart />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${watchlist.includes(filme.id) ? styles.active : ''}`}
                        onClick={(e) => toggleWatchlist(filme.id, e)}
                        title={watchlist.includes(filme.id) ? "Remover da watchlist" : "Adicionar à watchlist"}
                      >
                        <FaBookmark />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className={styles.listItemTitle}>{filme.title}</h3>
                  <div className={styles.listItemMeta}>
                    <span className={styles.listItemYear}>{filme.year}</span>
                    <span className={styles.listItemDirector}>
                      {filme.director.split(' e ')[0]}
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
            ))}
          </div>
        </div>

        {/* Detalhes do Filme */}
        <div className={styles.filmeDetails}>
          <div className={styles.detailsContainer}>
            {/* Header do Filme */}
            <div className={styles.detailsHeader}>
              <div className={styles.titleSection}>
                <div className={styles.titleRow}>
                  <h2 className={styles.detailsTitle}>{selectedFilme.title}</h2>
                  {selectedFilme.status === 'Próximo' && (
                    <div className={styles.highlightBadge}>
                      <FaFire /> FILME DESTAQUE
                    </div>
                  )}
                </div>
                <div className={styles.titleMeta}>
                  <span className={styles.detailsYear}>{selectedFilme.year}</span>
                  <span className={styles.detailsGenre}>
                    <FaTag /> {selectedFilme.genre}
                  </span>
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
                  <span className={styles.ratingValue}>{selectedFilme.rating.toFixed(1)}</span>
                  <span className={styles.ratingCount}>({selectedFilme.reviewCount})</span>
                </div>
                
                <div className={styles.actionsRight}>
                  <button
                    className={`${styles.iconButton} ${favorites.includes(selectedFilme.id) ? styles.active : ''}`}
                    onClick={(e) => toggleFavorite(selectedFilme.id, e)}
                    title={favorites.includes(selectedFilme.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    {favorites.includes(selectedFilme.id) ? (
                      <FaHeart className={styles.iconActive} />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>
                  <button
                    className={`${styles.iconButton} ${watchlist.includes(selectedFilme.id) ? styles.active : ''}`}
                    onClick={(e) => toggleWatchlist(selectedFilme.id, e)}
                    title={watchlist.includes(selectedFilme.id) ? "Remover da watchlist" : "Adicionar à watchlist"}
                  >
                    {watchlist.includes(selectedFilme.id) ? (
                      <FaBookmark className={styles.iconActive} />
                    ) : (
                      <FaRegBookmark />
                    )}
                  </button>
                  <div className={styles.shareContainer} ref={shareRef}>
                    <button
                      className={styles.iconButton}
                      onClick={shareFilme}
                      title="Compartilhar"
                    >
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
                        >
                          <FaTwitter /> Compartilhar no Twitter
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className={styles.detailsMainContent}>
              {/* Coluna Esquerda: Poster e Informações */}
              <div className={styles.leftColumn}>
                <div className={styles.posterContainer}>
                  <img 
                    src={selectedFilme.imageUrl} 
                    alt={selectedFilme.title}
                    className={styles.posterImage}
                  />
                  <div className={styles.filmeStatusBadge}>
                    <span className={`${styles.statusBadge} ${styles[selectedFilme.status.toLowerCase()]}`}>
                      {selectedFilme.status === 'Próximo' ? 'EM BREVE' : 'EXIBIDO'}
                    </span>
                  </div>
                </div>

                {/* Informações Rápidas */}
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
                  
                  <div className={styles.infoCard}>
                    <FaStar className={styles.infoIcon} />
                    <div>
                      <h4>Avaliação</h4>
                      <p>{selectedFilme.rating.toFixed(1)} ({selectedFilme.reviewCount} avaliações)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna Direita: Conteúdo Detalhado */}
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
                      {selectedFilme.awards.map((award, index) => (
                        <div key={index} className={styles.awardItem}>
                          <FaAward className={styles.awardIcon} />
                          <span>{award}</span>
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
                      {selectedFilme.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ÚNICA SEÇÃO DE ACESSOS */}
                <AccessButtons />

                {/* Informações da Próxima Exibição */}
                {selectedFilme.status === 'Próximo' && (
                  <div className={styles.nextFilmeInfo}>
                    <h3 className={styles.sectionTitle}>Informações da Exibição</h3>
                    <div className={styles.nextFilmeDetails}>
                      <div className={styles.nextFilmeDetail}>
                        <strong>Horário:</strong> 19:30h
                      </div>
                      <div className={styles.nextFilmeDetail}>
                        <strong>Local:</strong> Auditório Principal - CineMar
                      </div>
                      <div className={styles.nextFilmeDetail}>
                        <strong>Ingressos:</strong> Entrada Gratuita
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer das Ações */}
            <div className={styles.mainActions}>
              {selectedFilme.status === 'Próximo' ? (
                <div className={styles.upcomingActions}>
                  <button className={styles.primaryButton}>
                    <FaCalendarCheck /> Adicionar à Agenda
                  </button>
                  <button className={styles.secondaryButton} onClick={shareFilme}>
                    <FaShareAlt /> Compartilhar
                  </button>
                </div>
              ) : (
                <div className={styles.pastFilmeNote}>
                  <FaCalendarTimes className={styles.pastIcon} />
                  <span>Filme realizado em {selectedFilme.date}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}