import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowLeft
} from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
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
import Tatuagem from '../images/filmes/Tatuagem.jpeg';

// Imagem placeholder para fallback
import PlaceholderImage from '../images/Fallback.png';

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
  const today = useMemo(() => new Date(), []);
  const [isLoading, setIsLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Função para converter datas do formato "29 de Março, 2025" para Date
  const parseDate = useCallback((dateStr: string): Date => {
    const months: {[key: string]: number} = {
      'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
      'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
      'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
    };
    
    try {
      const cleanedDate = dateStr.trim();
      const yearMatch = cleanedDate.match(/\d{4}/);
      const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
      const dateWithoutYear = cleanedDate.replace(/\d{4}/, '').trim();
      
      let month = 0;
      let day = 1;
      
      for (const [monthName, monthIndex] of Object.entries(months)) {
        if (dateWithoutYear.toLowerCase().includes(monthName)) {
          month = monthIndex;
          const dayMatch = dateWithoutYear.match(/\d+/);
          day = dayMatch ? parseInt(dayMatch[0]) : 1;
          break;
        }
      }
      
      return new Date(year, month, day);
    } catch (error) {
      console.error(`Erro ao parsear data: ${dateStr}`, error);
      return new Date(0);
    }
  }, []);

  // Função para determinar o status baseado na data
  const getStatusByDate = useCallback((dateStr: string): 'Realizado' | 'Próximo' => {
    const filmeDate = parseDate(dateStr);
    return filmeDate < today ? 'Realizado' : 'Próximo';
  }, [parseDate, today]);

  // Função para determinar se o filme deve ser destacado
  const isHighlighted = useCallback((dateStr: string): boolean => {
    const filmeDate = parseDate(dateStr);
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return filmeDate >= today && filmeDate <= thirtyDaysFromNow;
  }, [parseDate, today]);

  // Função para gerar views aleatórias baseado no status
  const generateViews = useCallback((status: 'Realizado' | 'Próximo', baseViews: number): number => {
    if (status === 'Realizado') {
      return Math.floor(Math.random() * (5000 - 800 + 1)) + 800;
    } else {
      return Math.floor(Math.random() * 201);
    }
  }, []);

  const filmesBase: Omit<Filme, 'status' | 'highlight' | 'views'>[] = useMemo(() => [
    {
      id: 1,
      title: "Ainda Estou Aqui",
      director: "Walter Carvalho",
      year: 2015,
      date: "29 de Março, 2025",
      description: "Documentário que retrata a vida e obra do fotógrafo e cineasta brasileiro Walter Carvalho, explorando sua trajetória no cinema nacional e suas reflexões sobre a arte da imagem.",
      imageUrl: AindaEstouAqui,
      screenplay: "Walter Carvalho, Maria Ramos",
      cast: "Documentário com entrevistas",
      rating: 4.2,
      reviewCount: 89,
      genre: "Documentário",
      duration: "92 min",
      language: "Português",
      awards: ["Melhor Documentário - Festival do Rio"],
      tags: ["Documentário", "Arte", "Cinema Brasileiro"],
      materialsLink: "/materiais?debate=ainda-estou-aqui",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 1
    },
    {
      id: 2,
      title: "Bacurau",
      director: "Kleber Mendonça Filho e Juliano Dornelles",
      year: 2019,
      date: "10 de Maio, 2025",
      description: "Os moradores de Bacurau, um pequeno povoado do sertão brasileiro, descobrem que a comunidade não consta mais em qualquer mapa. A situação se agrava quando estrangeiros começam a atacar a cidade.",
      imageUrl: Bacurau,
      screenplay: "Kleber Mendonça Filho, Juliano Dornelles",
      cast: "Sônia Braga, Udo Kier, Bárbara Colen, Thomas Aquino",
      rating: 4.5,
      reviewCount: 234,
      genre: "Ficção Científica/Drama",
      duration: "131 min",
      language: "Português",
      awards: ["Prêmio do Júri - Cannes", "Melhor Filme - Festival de Brasília"],
      tags: ["Ficção", "Sertão", "Ação", "Drama"],
      materialsLink: "/materiais?debate=bacurau",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 2
    },
    {
      id: 3,
      title: "Bicho de Sete Cabeças",
      director: "Laís Bodanzky",
      year: 2000,
      date: "24 de Maio, 2025",
      description: "Baseado na história real de Austregésilo Carrano Bueno, o filme mostra Neto, um jovem que é internado contra a vontade em um hospital psiquiátrico por seu pai.",
      imageUrl: BichoDeSeteCabecas,
      screenplay: "Laís Bodanzky, Luiz Bolognesi",
      cast: "Rodrigo Santoro, Cássia Kiss, Othon Bastos",
      rating: 4.3,
      reviewCount: 112,
      genre: "Drama",
      duration: "73 min",
      language: "Português",
      awards: ["Melhor Filme - Festival de Gramado"],
      tags: ["Drama", "Saúde Mental", "Baseado em Fatos"],
      materialsLink: "/materiais?debate=bicho-sete-cabecas",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 3
    },
    {
      id: 4,
      title: "A Hora da Estrela",
      director: "Suzana Amaral",
      year: 1985,
      date: "7 de Junho, 2025",
      description: "Baseado na obra de Clarice Lispector, conta a história de Macabéa, uma datilógrafa alagoana que se muda para São Paulo em busca de uma vida melhor.",
      imageUrl: HoraDaEstrela,
      screenplay: "Suzana Amaral (baseado em Clarice Lispector)",
      cast: "Marcélia Cartaxo, José Dumont, Tamara Taxman",
      rating: 4.7,
      reviewCount: 156,
      genre: "Drama",
      duration: "96 min",
      language: "Português",
      awards: ["Urso de Prata - Berlim", "Melhor Atriz - Festival de Brasília"],
      tags: ["Clássico", "Drama", "Literatura"],
      materialsLink: "/materiais?debate=hora-estrela",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 4
    },
    {
      id: 5,
      title: "Tatuagem",
      director: "Ailton Lacerda",
      year: 2023,
      date: "28 de Junho, 2025",
      description: "Um tatuador renomado enfrenta um dilema ético quando um cliente misterioso pede uma tatuagem com um símbolo proibido que pode desencadear consequências inesperadas.",
      imageUrl: Tatuagem,
      screenplay: "Ailton Lacerda, Mariana Silva",
      cast: "Rodrigo Lombardi, Maria Fernanda Cândido, João Miguel",
      rating: 4.3,
      reviewCount: 45,
      genre: "Drama/Suspense",
      duration: "118 min",
      language: "Português",
      awards: ["Melhor Roteiro - Festival de Cinema Brasileiro"],
      tags: ["Drama", "Suspense", "Arte", "Ética"],
      materialsLink: "/materiais?debate=tatuagem",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 5
    },
    {
      id: 6,
      title: "A Jangada de Welles",
      director: "Rogério Sganzerla",
      year: 2004,
      date: "16 de Agosto, 2025",
      description: "Documentário sobre a tentativa frustrada de Orson Welles de filmar 'It's All True' no Nordeste brasileiro nos anos 1940.",
      imageUrl: JangadaDeWelles,
      screenplay: "Rogério Sganzerla",
      cast: "Documentário com imagens de arquivo",
      rating: 3.8,
      reviewCount: 67,
      genre: "Documentário",
      duration: "85 min",
      language: "Português/Inglês",
      awards: ["Melhor Documentário - É Tudo Verdade"],
      tags: ["Documentário", "História", "Cinema"],
      materialsLink: "/materiais?debate=jangada-welles",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 6
    },
    {
      id: 7,
      title: "Terra Estrangeira",
      director: "Walter Salles e Daniela Thomas",
      year: 1995,
      date: "6 de Setembro, 2025",
      description: "Durante o Plano Collor em 1990, Pedro parte para Lisboa após a morte de sua mãe, levando consigo um pacote misterioso.",
      imageUrl: TerraEstrangeira,
      screenplay: "Walter Salles, Daniela Thomas, Marcos Bernstein",
      cast: "Fernanda Torres, Fernando Alves Pinto, Alexandre Borges",
      rating: 4.0,
      reviewCount: 98,
      genre: "Drama",
      duration: "100 min",
      language: "Português",
      awards: ["Melhor Filme - Festival de Havana"],
      tags: ["Drama", "Viagem", "Identidade"],
      materialsLink: "/materiais?debate=terra-estrangeira",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 7
    },
    {
      id: 8,
      title: "Onde os Fracos Não Têm Vez",
      director: "Joel e Ethan Coen",
      year: 2007,
      date: "20 de Setembro, 2025",
      description: "Adaptação do romance de Cormac McCarthy. No Texas, Llewelyn Moss encontra dois milhões de dólares em dinheiro de droga no deserto.",
      imageUrl: FracosNaoTemVez,
      screenplay: "Joel Coen, Ethan Coen (baseado em Cormac McCarthy)",
      cast: "Tommy Lee Jones, Javier Bardem, Josh Brolin",
      rating: 4.6,
      reviewCount: 345,
      genre: "Suspense/Drama",
      duration: "122 min",
      language: "Inglês",
      awards: ["4 Oscars", "Globo de Ouro"],
      tags: ["Suspense", "Policial", "Prêmios"],
      materialsLink: "/materiais?debate=fracos-nao-tem-vez",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 8
    },
    {
      id: 9,
      title: "Corra!",
      director: "Jordan Peele",
      year: 2017,
      date: "4 de Outubro, 2025",
      description: "Chris, um jovem fotógrafo negro, visita a família de sua namorada branca pela primeira vez. O que começa como um fim de semana tenso se transforma em um pesadelo.",
      imageUrl: Corra,
      screenplay: "Jordan Peele",
      cast: "Daniel Kaluuya, Allison Williams, Bradley Whitford",
      rating: 4.8,
      reviewCount: 432,
      genre: "Terror/Suspense",
      duration: "104 min",
      language: "Inglês",
      awards: ["Oscar de Melhor Roteiro Original"],
      tags: ["Terror", "Suspense", "Social"],
      materialsLink: "/materiais?debate=corra",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 9
    },
    {
      id: 10,
      title: "Nós que Aqui Estamos por Vós Esperamos",
      director: "Marcelo Masagão",
      year: 1999,
      date: "1 de Novembro, 2025",
      description: "Documentário experimental que traça um panorama do século XX através de imagens de arquivo.",
      imageUrl: NosQueAquiEstamos,
      screenplay: "Marcelo Masagão",
      cast: "Documentário com imagens de arquivo",
      rating: 4.4,
      reviewCount: 123,
      genre: "Documentário Experimental",
      duration: "73 min",
      language: "Português",
      awards: ["Prêmio Especial do Júri - É Tudo Verdade"],
      tags: ["Documentário", "Experimental", "História"],
      materialsLink: "/materiais?debate=nos-que-aqui-estamos",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 10
    },
    {
      id: 11,
      title: "Medida Provisória",
      director: "Lázaro Ramos",
      year: 2022,
      date: "22 de Novembro, 2025",
      description: "Em um futuro distópico, o governo brasileiro decreta uma medida provisória que obriga afrodescendentes a emigrarem para a África.",
      imageUrl: MedidaProvisoria,
      screenplay: "Lázaro Ramos, Aldri Anunciação",
      cast: "Taís Araújo, Alfred Enoch, Seu Jorge",
      rating: 4.1,
      reviewCount: 178,
      genre: "Ficção Científica/Drama",
      duration: "115 min",
      language: "Português",
      awards: ["Melhor Direção - Festival do Rio"],
      tags: ["Ficção", "Distopia", "Social"],
      materialsLink: "/materiais?debate=medida-provisoria",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 11
    },
    {
      id: 12,
      title: "O Último Pulp",
      director: "Sergio Bianchi",
      year: 2002,
      date: "10 de Janeiro, 2026",
      description: "Sátira sobre a indústria cultural brasileira através da história de Tarso, um diretor de TV que decide fazer um filme autoral.",
      imageUrl: UltimoPulp,
      screenplay: "Sergio Bianchi",
      cast: "Fernando Alves Pinto, Dira Paes, Cássia Kiss",
      rating: 3.9,
      reviewCount: 87,
      genre: "Comédia/Drama",
      duration: "90 min",
      language: "Português",
      awards: ["Melhor Ator - Festival de Brasília"],
      tags: ["Comédia", "Sátira", "Cinema"],
      materialsLink: "/materiais?debate=ultimo-pulp",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 12
    },
    {
      id: 13,
      title: "O Agente Secreto",
      director: "Kleber Mendonça Filho", 
      year: 2025, 
      date: "7 de Fevereiro, 2026", 
      description: "Em 1977, durante a ditadura militar brasileira, o ex-professor Armando retorna a Recife em busca de refúgio, mas se vê perseguido por um passado político violento e envolto em uma teia de corrupção e segredos.",
      imageUrl: AgenteSecreto,
      screenplay: "Kleber Mendonça Filho",
      cast: "Wagner Moura, Maria Fernanda Cândido, Gabriel Leone, Alice Carvalho, Udo Kier",
      rating: 4.4, 
      reviewCount: 215, 
      genre: "Thriller Político/Drama",
      duration: "158 min", 
      language: "Português", 
      awards: ["Melhor Diretor - Cannes 2025", "Melhor Ator (Wagner Moura) - Cannes 2025", "Globo de Ouro de Melhor Filme Estrangeiro 2026"],
      tags: ["Thriller Político", "Ditadura", "Recife", "Prêmios"],
      materialsLink: "/materiais?debate=agente-secreto",
      playlistLink: "https://music.youtube.com/playlist?list=PL6gx4Cwl9DGBsvRxJJOzG4r4k_zLKrnxl",
      playlistId: 13
    }
  ], []);

  // Processar filmes para determinar status dinamicamente
  const filmesProcessados = useMemo(() => 
    filmesBase.map(filme => {
      const status = getStatusByDate(filme.date);
      const highlight = isHighlighted(filme.date);
      const views = generateViews(status, 1000);
      
      return {
        ...filme,
        status,
        highlight,
        views
      };
    }), [filmesBase, getStatusByDate, isHighlighted, generateViews]);

  // Ordenar filmes
  const filmesOrdenados = useMemo(() => 
    [...filmesProcessados].sort((a, b) => {
      if (a.status === 'Realizado' && b.status === 'Próximo') return -1;
      if (a.status === 'Próximo' && b.status === 'Realizado') return 1;
      
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      
      if (a.status === 'Realizado') {
        return dateB.getTime() - dateA.getTime();
      } else {
        return dateA.getTime() - dateB.getTime();
      }
    }), [filmesProcessados, parseDate]);

  const [selectedFilme, setSelectedFilme] = useState<Filme>(filmesOrdenados[0]);
  const [favorites, setFavorites] = useState<number[]>([8, 11]);
  const [watchlist, setWatchlist] = useState<number[]>([2, 7]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'realized' | 'upcoming'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const shareRef = useRef<HTMLDivElement>(null);
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  // Filtragem de filmes
  const filteredFilmes = useMemo(() => 
    filmesOrdenados.filter(filme => {
      const matchesFilter = activeFilter === 'all' || 
        (activeFilter === 'realized' && filme.status === 'Realizado') ||
        (activeFilter === 'upcoming' && filme.status === 'Próximo');
      
      const matchesSearch = searchTerm === '' || 
        filme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        filme.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        filme.genre.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    }), [filmesOrdenados, activeFilter, searchTerm]);

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
    localStorage.setItem('cinemar-theme', theme);
  }, [theme]);

  // Carregar tema salvo
  useEffect(() => {
    const savedTheme = localStorage.getItem('cinemar-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Atualizar o filme selecionado quando o array de filmes muda
  useEffect(() => {
    if (filmesOrdenados.length > 0 && !selectedFilme) {
      setSelectedFilme(filmesOrdenados[0]);
    }
  }, [filmesOrdenados, selectedFilme]);

  // Funções de interação
  const toggleFavorite = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  }, []);

  const toggleWatchlist = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchlist(prev => 
      prev.includes(id) ? prev.filter(watchId => watchId !== id) : [...prev, id]
    );
  }, []);

  const handleImageError = useCallback((id: number) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  }, []);

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
  const handleGoToMaterials = useCallback(() => {
    if (selectedFilme.materialsLink) {
      setIsLoading(true);
      window.location.href = selectedFilme.materialsLink;
    }
  }, [selectedFilme.materialsLink]);

  const handleGoToCineMarPlaylist = useCallback(() => {
    setIsLoading(true);
    navigate(`/playlists?playlistId=${selectedFilme.playlistId || selectedFilme.id}`);
  }, [navigate, selectedFilme.playlistId, selectedFilme.id]);

  const handleOpenExternalPlaylist = useCallback(() => {
    if (selectedFilme.playlistLink) {
      window.open(selectedFilme.playlistLink, '_blank');
    }
  }, [selectedFilme.playlistLink]);

  // Função para agendar filme
  const scheduleFilme = useCallback(() => {
    const filmeDate = parseDate(selectedFilme.date);
    const formattedDate = filmeDate.toISOString().split('T')[0];
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`CineMar: ${selectedFilme.title}`)}&dates=${formattedDate.replace(/-/g, '')}T193000/${formattedDate.replace(/-/g, '')}T220000&details=${encodeURIComponent(`${selectedFilme.description}\n\nDiretor: ${selectedFilme.director}\nLocal: Auditório Principal - CineMar`)}&location=${encodeURIComponent('Auditório Principal - CineMar')}`;
    window.open(googleCalendarUrl, '_blank');
  }, [selectedFilme, parseDate]);

  // Componente para botões de acesso
  const AccessButtons = useCallback(() => {
    if (selectedFilme.status !== 'Realizado') return null;

    return (
      <div className={styles.accessSection}>
        <h3 className={styles.sectionTitle}>Acessos Disponíveis</h3>
        <div className={styles.accessButtons}>
          {selectedFilme.materialsLink && (
            <button 
              className={styles.accessButton}
              onClick={handleGoToMaterials}
              disabled={isLoading}
            >
              <FaImages className={styles.buttonIcon} />
              <div className={styles.buttonInfo}>
                <span className={styles.buttonTitle}>Materiais do Debate</span>
                <span className={styles.buttonSubtitle}>Fotos e documentos</span>
              </div>
              {isLoading && <FaSpinner className={styles.loadingSpinner} />}
            </button>
          )}
          
          <button 
            className={`${styles.accessButton} ${styles.playlistButton}`}
            onClick={handleGoToCineMarPlaylist}
            disabled={isLoading}
          >
            <FaHeadphones className={styles.buttonIcon} />
            <div className={styles.buttonInfo}>
              <span className={styles.buttonTitle}>Playlist Oficial</span>
              <span className={styles.buttonSubtitle}>CineMar no Spotify</span>
            </div>
            {isLoading && <FaSpinner className={styles.loadingSpinner} />}
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
              <FaExternalLinkAlt className={styles.externalIcon} />
            </button>
          )}
        </div>
      </div>
    );
  }, [selectedFilme, isLoading, handleGoToMaterials, handleGoToCineMarPlaylist, handleOpenExternalPlaylist]);

  // Componente para mostrar contagem de filmes por status
  const FilmStats = useCallback(() => {
    const realizados = filmesOrdenados.filter(f => f.status === 'Realizado').length;
    const proximos = filmesOrdenados.filter(f => f.status === 'Próximo').length;
    
    return (
      <div className={styles.filmStats}>
        <span className={styles.statItem}>
          <span className={styles.statNumber}>{realizados}</span> Realizados
        </span>
        <span className={styles.statDivider}>•</span>
        <span className={styles.statItem}>
          <span className={styles.statNumber}>{proximos}</span> Próximos
        </span>
      </div>
    );
  }, [filmesOrdenados]);

  // Componente de Loading
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.loadingSpinnerLarge} />
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.filmesContainer} ${theme === 'dark' ? styles.dark : ''} ${isThemeChanging ? styles.themeChanging : ''}`}>
      {/* Header Sóbrio - Estilo Home e Membros */}
      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={styles.backButton}>
              <FaArrowLeft className={styles.buttonIcon} />
              <span>Voltar para Início</span>
            </Link>
            
            <button 
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={theme === 'light' ? "Alternar para modo escuro" : "Alternar para modo claro"}
              disabled={isThemeChanging}
            >
              {theme === 'light' ? <FaMoon className={styles.themeIcon} /> : <FaSun className={styles.themeIcon} />}
              <span className={styles.themeLabel}>
                {theme === 'light' ? "Tema Escuro" : "Tema Claro"}
              </span>
              {isThemeChanging && <FaSpinner className={styles.themeSpinner} />}
            </button>
          </div>
          
          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>
              <FaFilm className={styles.titleIcon} />
              CATÁLOGO DE FILMES
            </h1>
            <p className={styles.heroSubtitle}>
              Explore todos os filmes já exibidos e as próximas sessões do CineMar
            </p>
          </div>
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
                aria-pressed={activeFilter === 'all'}
              >
                Todos
              </button>
              <button
                className={`${styles.filterBtn} ${activeFilter === 'realized' ? styles.active : ''}`}
                onClick={() => setActiveFilter('realized')}
                aria-pressed={activeFilter === 'realized'}
              >
                Realizados
              </button>
              <button
                className={`${styles.filterBtn} ${activeFilter === 'upcoming' ? styles.active : ''}`}
                onClick={() => setActiveFilter('upcoming')}
                aria-pressed={activeFilter === 'upcoming'}
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
                aria-label="Buscar filmes"
              />
              {searchTerm && (
                <button 
                  className={styles.clearSearch}
                  onClick={() => setSearchTerm('')}
                  aria-label="Limpar busca"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Lista de Filmes */}
          <div className={styles.filmeList}>
            {filteredFilmes.length === 0 ? (
              <div className={styles.noResults}>
                <FaExclamationTriangle />
                <p>Nenhum filme encontrado para a busca "{searchTerm}"</p>
                <button 
                  className={styles.clearFiltersBtn}
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('all');
                  }}
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              filteredFilmes.map((filme) => (
                <div
                  key={filme.id}
                  className={`${styles.filmeListItem} ${
                    selectedFilme.id === filme.id ? styles.active : ''
                  } ${filme.highlight ? styles.highlighted : ''}`}
                  onClick={() => setSelectedFilme(filme)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedFilme(filme)}
                  aria-label={`Selecionar filme: ${filme.title}`}
                >
                  <div className={styles.listItemImage}>
                    <img 
                      src={imageErrors[filme.id] ? PlaceholderImage : filme.imageUrl} 
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
                      <div className={styles.filmeNumber}>
                        #{filme.id.toString().padStart(2, '0')}
                      </div>
                      <div className={styles.itemActions}>
                        <button
                          className={`${styles.actionBtn} ${favorites.includes(filme.id) ? styles.active : ''}`}
                          onClick={(e) => toggleFavorite(filme.id, e)}
                          title={favorites.includes(filme.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                          aria-label={favorites.includes(filme.id) ? `Remover ${filme.title} dos favoritos` : `Adicionar ${filme.title} aos favoritos`}
                        >
                          {favorites.includes(filme.id) ? <FaHeart /> : <FaRegHeart />}
                        </button>
                        <button
                          className={`${styles.actionBtn} ${watchlist.includes(filme.id) ? styles.active : ''}`}
                          onClick={(e) => toggleWatchlist(filme.id, e)}
                          title={watchlist.includes(filme.id) ? "Remover da watchlist" : "Adicionar à watchlist"}
                          aria-label={watchlist.includes(filme.id) ? `Remover ${filme.title} da watchlist` : `Adicionar ${filme.title} à watchlist`}
                        >
                          {watchlist.includes(filme.id) ? <FaBookmark /> : <FaRegBookmark />}
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
              ))
            )}
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
                  {selectedFilme.highlight && selectedFilme.status === 'Próximo' && (
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
                          className={styles.twitterShare}
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
                    src={imageErrors[selectedFilme.id] ? PlaceholderImage : selectedFilme.imageUrl} 
                    alt={selectedFilme.title}
                    className={styles.posterImage}
                    onError={() => handleImageError(selectedFilme.id)}
                    loading="lazy"
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

                {/* Seção de Acessos */}
                <AccessButtons />

                {/* Informações da Próxima Exibição */}
                {selectedFilme.status === 'Próximo' && (
                  <div className={styles.nextFilmeInfo}>
                    <h3 className={styles.sectionTitle}>
                      {selectedFilme.highlight ? 'EXIBIÇÃO PRÓXIMA!' : 'Informações da Exibição'}
                    </h3>
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
                  <button 
                    className={styles.primaryButton}
                    onClick={scheduleFilme}
                  >
                    <FaCalendarCheck /> Adicionar à Agenda
                  </button>
                  <button 
                    className={styles.secondaryButton} 
                    onClick={shareFilme}
                  >
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