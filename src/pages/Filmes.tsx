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
} from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../styles/Filmes.module.css';
import { useTheme } from '../components/context/ThemeContext';

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

const filmesBaseInicial: Omit<Filme, 'status' | 'highlight' | 'views'>[] = [
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
];

export default function Filmes() {
  const navigate = useNavigate();
  const { theme } = useTheme(); // ✅ Usando apenas o tema do contexto
  const isDarkMode = theme === 'dark';
  const today = useMemo(() => new Date(), []);
  
  // Estados de loading individuais
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const [loadingYouTube, setLoadingYouTube] = useState(false);
  
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  // Estados de Admin
  const [user, setUser] = useState<any>(null);
  const [showFilmeForm, setShowFilmeForm] = useState(false);
  const [editingFilme, setEditingFilme] = useState<Filme | null>(null);
  const [filmesBase, setFilmesBase] = useState(filmesBaseInicial);

  // Estado do formulário
  const [filmeForm, setFilmeForm] = useState<Partial<Omit<Filme, 'status' | 'highlight' | 'views'>>>({
    title: '',
    director: '',
    year: new Date().getFullYear(),
    date: '',
    description: '',
    imageUrl: '',
    screenplay: '',
    cast: '',
    rating: 0,
    reviewCount: 0,
    genre: '',
    duration: '',
    language: '',
    awards: [],
    tags: [],
    materialsLink: '',
    playlistLink: '',
    playlistId: 0
  });

  // Estado para Toast
  const [toast, setToast] = useState<{msg: string; type: 'success' | 'error' | 'warn'} | null>(null);

  // Estado para confirmação de exclusão
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'warn' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Verificar usuário logado
  useEffect(() => {
    const storedUser = localStorage.getItem('cinemar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Carregar filmes do localStorage
  useEffect(() => {
    const storedFilmes = localStorage.getItem('cinemar_filmes_base');
    if (storedFilmes) {
      setFilmesBase(JSON.parse(storedFilmes));
    }
  }, []);

  // Salvar filmes no localStorage
  useEffect(() => {
    if (filmesBase.length > 0) {
      localStorage.setItem('cinemar_filmes_base', JSON.stringify(filmesBase));
    }
  }, [filmesBase]);

  const isAdmin = user?.role === 'admin';

  // ✅ Removido o useEffect que tentava usar setTheme

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
  const shareRef = useRef<HTMLDivElement>(null);

  // ✅ Removido o segundo useEffect que tentava carregar tema

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

  // ✅ Removido o useEffect que aplicava tema ao body (agora o contexto faz isso)

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
    showToast('Link copiado!', 'success');
  };

  // Funções de navegação com estados individuais
  const handleGoToMaterials = useCallback(() => {
    if (selectedFilme.materialsLink) {
      setLoadingMaterials(true);
      window.location.href = selectedFilme.materialsLink;
    }
  }, [selectedFilme.materialsLink]);

  const handleGoToCineMarPlaylist = useCallback(() => {
    setLoadingPlaylist(true);
    navigate(`/playlists?playlistId=${selectedFilme.playlistId || selectedFilme.id}`);
  }, [navigate, selectedFilme.playlistId, selectedFilme.id]);

  const handleOpenExternalPlaylist = useCallback(() => {
    if (selectedFilme.playlistLink) {
      setLoadingYouTube(true);
      window.open(selectedFilme.playlistLink, '_blank');
      setTimeout(() => setLoadingYouTube(false), 500);
    }
  }, [selectedFilme.playlistLink]);

  // Função para agendar filme
  const scheduleFilme = useCallback(() => {
    const filmeDate = parseDate(selectedFilme.date);
    const formattedDate = filmeDate.toISOString().split('T')[0];
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`CineMar: ${selectedFilme.title}`)}&dates=${formattedDate.replace(/-/g, '')}T193000/${formattedDate.replace(/-/g, '')}T220000&details=${encodeURIComponent(`${selectedFilme.description}\n\nDiretor: ${selectedFilme.director}\nLocal: Auditório Principal - CineMar`)}&location=${encodeURIComponent('Auditório Principal - CineMar')}`;
    window.open(googleCalendarUrl, '_blank');
    showToast('Evento adicionado ao Google Calendar!', 'success');
  }, [selectedFilme, parseDate]);

  // ===== CRUD FILMES =====
  const handleAddFilme = () => {
    if (!filmeForm.title || !filmeForm.director || !filmeForm.date) {
      showToast('Preencha título, diretor e data!', 'error');
      return;
    }

    const newFilme: Omit<Filme, 'status' | 'highlight' | 'views'> = {
      id: Date.now(),
      title: filmeForm.title!,
      director: filmeForm.director!,
      year: filmeForm.year || new Date().getFullYear(),
      date: filmeForm.date!,
      description: filmeForm.description || '',
      imageUrl: filmeForm.imageUrl || PlaceholderImage,
      screenplay: filmeForm.screenplay || '',
      cast: filmeForm.cast || '',
      rating: filmeForm.rating || 0,
      reviewCount: filmeForm.reviewCount || 0,
      genre: filmeForm.genre || '',
      duration: filmeForm.duration,
      language: filmeForm.language,
      awards: filmeForm.awards || [],
      tags: filmeForm.tags || [],
      materialsLink: filmeForm.materialsLink,
      playlistLink: filmeForm.playlistLink,
      playlistId: filmeForm.playlistId
    };

    setFilmesBase([newFilme, ...filmesBase]);
    resetFilmeForm();
    setShowFilmeForm(false);
    showToast(`"${newFilme.title}" adicionado com sucesso!`);
  };

  const handleEditFilme = () => {
    if (!editingFilme) return;

    const updatedFilmes = filmesBase.map(f =>
      f.id === editingFilme.id
        ? { ...f, ...filmeForm }
        : f
    );

    setFilmesBase(updatedFilmes);
    if (selectedFilme.id === editingFilme.id) {
      setSelectedFilme({ ...editingFilme, ...filmeForm, status: selectedFilme.status, highlight: selectedFilme.highlight, views: selectedFilme.views });
    }
    resetFilmeForm();
    setShowFilmeForm(false);
    setEditingFilme(null);
    showToast(`"${filmeForm.title}" atualizado!`);
  };

  const handleDeleteFilme = (id: number) => {
    if (confirmDelete === id) {
      setFilmesBase(filmesBase.filter(f => f.id !== id));
      if (selectedFilme.id === id) {
        const next = filmesOrdenados.find(f => f.id !== id);
        if (next) setSelectedFilme(next);
      }
      showToast('Filme removido.', 'warn');
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const openEditFilme = (filme: Filme) => {
    setFilmeForm({
      title: filme.title,
      director: filme.director,
      year: filme.year,
      date: filme.date,
      description: filme.description,
      imageUrl: filme.imageUrl,
      screenplay: filme.screenplay,
      cast: filme.cast,
      rating: filme.rating,
      reviewCount: filme.reviewCount,
      genre: filme.genre,
      duration: filme.duration,
      language: filme.language,
      awards: filme.awards,
      tags: filme.tags,
      materialsLink: filme.materialsLink,
      playlistLink: filme.playlistLink,
      playlistId: filme.playlistId
    });
    setEditingFilme(filme);
    setShowFilmeForm(true);
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
      rating: 0,
      reviewCount: 0,
      genre: '',
      duration: '',
      language: '',
      awards: [],
      tags: [],
      materialsLink: '',
      playlistLink: '',
      playlistId: 0
    });
    setEditingFilme(null);
  };

  // Helpers para campos de array
  const handleArrayFieldChange = (field: 'awards' | 'tags', value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFilmeForm({ ...filmeForm, [field]: array });
  };

  // Componente AccessButtons com loading individual
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
    );
  }, [selectedFilme, loadingMaterials, loadingPlaylist, loadingYouTube, handleGoToMaterials, handleGoToCineMarPlaylist, handleOpenExternalPlaylist]);

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

  return (
    // ✅ Removida a classe isThemeChanging que não existia
    <div className={`${styles.filmesContainer} ${isDarkMode ? styles.dark : ''}`}>
      {/* Header */}
      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={styles.backLink}>
              ← Voltar para sessões
            </Link>
          </div>
          
          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>
              CATÁLOGO DE FILMES
            </h1>
            <p className={styles.heroSubtitle}>
              Explore todos os filmes já exibidos e as próximas sessões do CineMar
            </p>
          </div>
        </div>
      </header>

      {/* Botão flutuante de adicionar (apenas admin) */}
      {isAdmin && (
        <button
          className={styles.floatingAddBtn}
          onClick={() => { resetFilmeForm(); setShowFilmeForm(true); }}
          title="Adicionar filme"
        >
          <FaPlus />
        </button>
      )}

      {/* Formulário de Filme com seções e preview */}
      {showFilmeForm && isAdmin && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h3>{editingFilme ? 'Editar Filme' : 'Novo Filme'}</h3>
              <button onClick={() => { setShowFilmeForm(false); resetFilmeForm(); }} className={styles.formClose}>
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
                    <input type="text" value={filmeForm.title}
                      onChange={(e) => setFilmeForm({ ...filmeForm, title: e.target.value })}
                      placeholder="Nome do filme" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Diretor *</label>
                    <input type="text" value={filmeForm.director}
                      onChange={(e) => setFilmeForm({ ...filmeForm, director: e.target.value })}
                      placeholder="Nome do diretor" />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Ano</label>
                    <input type="number" value={filmeForm.year}
                      onChange={(e) => setFilmeForm({ ...filmeForm, year: parseInt(e.target.value) })} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Data da Sessão *</label>
                    <input type="text" value={filmeForm.date}
                      onChange={(e) => setFilmeForm({ ...filmeForm, date: e.target.value })}
                      placeholder="29 de Março, 2025" />
                  </div>
                </div>
              </div>

              {/* Seção 2: Detalhes */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Detalhes</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Gênero</label>
                    <input type="text" value={filmeForm.genre}
                      onChange={(e) => setFilmeForm({ ...filmeForm, genre: e.target.value })}
                      placeholder="Drama, Suspense..." />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Duração</label>
                    <input type="text" value={filmeForm.duration}
                      onChange={(e) => setFilmeForm({ ...filmeForm, duration: e.target.value })}
                      placeholder="120 min" />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Avaliação (0–5)</label>
                    <input type="number" step="0.1" min="0" max="5" value={filmeForm.rating}
                      onChange={(e) => setFilmeForm({ ...filmeForm, rating: parseFloat(e.target.value) })} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Idioma</label>
                    <input type="text" value={filmeForm.language}
                      onChange={(e) => setFilmeForm({ ...filmeForm, language: e.target.value })}
                      placeholder="Português" />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Sinopse</label>
                  <textarea value={filmeForm.description}
                    onChange={(e) => setFilmeForm({ ...filmeForm, description: e.target.value })}
                    rows={4} placeholder="Descrição do filme..." />
                </div>
                <div className={styles.formGroup}>
                  <label>Roteiro</label>
                  <textarea value={filmeForm.screenplay}
                    onChange={(e) => setFilmeForm({ ...filmeForm, screenplay: e.target.value })}
                    rows={2} />
                </div>
                <div className={styles.formGroup}>
                  <label>Elenco Principal</label>
                  <textarea value={filmeForm.cast}
                    onChange={(e) => setFilmeForm({ ...filmeForm, cast: e.target.value })}
                    rows={2} />
                </div>
              </div>

              {/* Seção 3: Imagem */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Imagem</h4>
                <div className={styles.formGroup}>
                  <label>URL da Imagem</label>
                  <input type="text" value={filmeForm.imageUrl}
                    onChange={(e) => setFilmeForm({ ...filmeForm, imageUrl: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg" />
                  <small>Deixe em branco para usar imagem padrão</small>
                </div>
                {filmeForm.imageUrl && (
                  <div className={styles.imagePreview}>
                    <img
                      src={filmeForm.imageUrl}
                      alt="Preview"
                      onError={(e) => (e.currentTarget.src = PlaceholderImage)}
                    />
                  </div>
                )}
              </div>

              {/* Seção 4: Prêmios e Tags */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Prêmios e Tags</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Prêmios (separar por vírgula)</label>
                    <input type="text" value={filmeForm.awards?.join(', ')}
                      onChange={(e) => handleArrayFieldChange('awards', e.target.value)}
                      placeholder="Oscar, Cannes..." />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Tags (separar por vírgula)</label>
                    <input type="text" value={filmeForm.tags?.join(', ')}
                      onChange={(e) => handleArrayFieldChange('tags', e.target.value)}
                      placeholder="Drama, Nacional..." />
                  </div>
                </div>
              </div>

              {/* Seção 5: Links */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Links</h4>
                <div className={styles.formGroup}>
                  <label>Link dos Materiais</label>
                  <input type="text" value={filmeForm.materialsLink}
                    onChange={(e) => setFilmeForm({ ...filmeForm, materialsLink: e.target.value })}
                    placeholder="/materiais?debate=nome-do-filme" />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Link da Playlist</label>
                    <input type="text" value={filmeForm.playlistLink}
                      onChange={(e) => setFilmeForm({ ...filmeForm, playlistLink: e.target.value })}
                      placeholder="https://music.youtube.com/..." />
                  </div>
                  <div className={styles.formGroup}>
                    <label>ID da Playlist</label>
                    <input type="number" value={filmeForm.playlistId}
                      onChange={(e) => setFilmeForm({ ...filmeForm, playlistId: parseInt(e.target.value) })} />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formFooter}>
              <button className={styles.cancelBtn} onClick={() => { setShowFilmeForm(false); resetFilmeForm(); }}>
                Cancelar
              </button>
              <button className={styles.submitBtn} onClick={editingFilme ? handleEditFilme : handleAddFilme}>
                <FaSave /> {editingFilme ? 'Salvar Alterações' : 'Adicionar Filme'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                        >
                          {favorites.includes(filme.id) ? <FaHeart /> : <FaRegHeart />}
                        </button>
                        <button
                          className={`${styles.actionBtn} ${watchlist.includes(filme.id) ? styles.active : ''}`}
                          onClick={(e) => toggleWatchlist(filme.id, e)}
                        >
                          {watchlist.includes(filme.id) ? <FaBookmark /> : <FaRegBookmark />}
                        </button>
                        {isAdmin && (
                          <span className={styles.adminActions}>
                            <button
                              className={styles.actionBtn}
                              onClick={(e) => { e.stopPropagation(); openEditFilme(filme); }}
                              title="Editar"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className={`${styles.actionBtn} ${confirmDelete === filme.id ? styles.confirmingDelete : styles.deleteActionBtn}`}
                              onClick={(e) => { e.stopPropagation(); handleDeleteFilme(filme.id); }}
                              title={confirmDelete === filme.id ? 'Confirmar exclusão?' : 'Excluir'}
                            >
                              {confirmDelete === filme.id ? <FaTimes /> : <FaTrash />}
                            </button>
                          </span>
                        )}
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
                  {isAdmin && (
                    <div className={styles.adminDetailsActions}>
                      <button
                        className={styles.iconButton}
                        onClick={() => openEditFilme(selectedFilme)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={`${styles.iconButton} ${styles.deleteIconButton}`}
                        onClick={() => handleDeleteFilme(selectedFilme.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className={styles.detailsMainContent}>
              {/* Coluna Esquerda */}
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

              {/* Coluna Direita */}
              <div className={styles.rightColumn}>
                <div className={styles.synopsisSection}>
                  <h3 className={styles.sectionTitle}>Sinopse</h3>
                  <p className={styles.synopsisText}>{selectedFilme.description}</p>
                </div>

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

                <AccessButtons />

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

      {/* Toast Notification */}
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