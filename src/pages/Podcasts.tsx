import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHeadphones,
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaShareAlt,
  FaHeart,
  FaRegHeart,
  FaYoutube,
  FaExternalLinkAlt,
  FaSun,
  FaMoon,
  FaPlay,
  FaSearch,
  FaFilter,
  FaTimes,
  FaStar,
  FaTag
} from 'react-icons/fa';
import styles from '../styles/Podcasts.module.css';

interface Timestamp {
  id: number;
  tempo: string;
  titulo: string;
  descricao: string;
  categoria: string;
  importante: boolean;
}

interface Podcast {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  duracao: string;
  participantes: string[];
  tags: string[];
  link: string;
  videoId: string;
  plataforma: 'youtube';
  destaque: boolean;
  episodio: number;
  temporada: string;
  organizador: string;
  contexto: string;
}

export default function Podcasts() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [favorito, setFavorito] = useState<boolean>(true);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('importante');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Aplica o modo escuro
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('darkMode');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('darkMode');
      root.style.colorScheme = 'light';
    }
    
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleFavorito = () => {
    setFavorito(!favorito);
  };

  const compartilharPodcast = () => {
    if (navigator.share) {
      navigator.share({
        title: podcast.titulo,
        text: podcast.descricao,
        url: podcast.link,
      });
    } else {
      navigator.clipboard.writeText(podcast.link);
      alert('Link copiado para a área de transferência!');
    }
  };

  const pularParaTempo = (tempoString: string) => {
    // Converte o tempo para segundos
    const [horas, minutos, segundos] = tempoString.split(':').map(Number);
    const tempoTotalSegundos = horas * 3600 + minutos * 60 + segundos;
    
    // Procura o iframe do YouTube
    const iframe = document.getElementById('youtube-video') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      // Envia comando para pular para o tempo específico
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [tempoTotalSegundos, true]
      }), '*');
    }
  };

  const podcast: Podcast = {
    id: 1,
    titulo: 'História do CineMar - Podcast Cunversa (Ep. 87)',
    descricao: 'Participação especial contando a trajetória completa do CineMar, desde sua concepção até o impacto na comunidade de Camocim. Uma conversa rica sobre cinema, educação, cultura e a história dos cinemas na cidade.',
    data: '05 de Setembro de 2025',
    duracao: '02:09:54',
    participantes: [
      'Professor Luiz (Co-fundador do CineMar)',
      'Renato (Co-fundador do CineMar)',
      'Santiago (Apresentador do Podcast Cunversa)',
      'Co-apresentador do Podcast Cunversa'
    ],
    tags: ['CineMar', 'cinema comunitário', 'Camocim', 'podcast', 'cultura', 'educação', 'ACCAL'],
    link: 'https://www.youtube.com/watch?v=1ZDVBWUxj_o',
    videoId: '1ZDVBWUxj_o',
    plataforma: 'youtube',
    destaque: true,
    episodio: 87,
    temporada: '2025',
    organizador: 'Academia Camocinense de Ciências, Artes e Letras (ACCAL)',
    contexto: 'Participação no podcast Cunversa da ACCAL, onde contamos a história completa do CineMar, desde a ideia inicial até as sessões atuais e seu impacto na comunidade de Camocim.',
  };

  // Dados completos da linha do tempo
  const timelineData: Timestamp[] = [
    // INÍCIO E APRESENTAÇÃO
    { id: 1, tempo: '00:01:38', titulo: 'Introdução Filosófica', descricao: 'O episódio começa com uma declaração filosófica sobre as coisas simples da vida serem as melhores.', categoria: 'introducao', importante: true },
    { id: 2, tempo: '00:09:49', titulo: 'Boas-vindas ao Episódio 87', descricao: 'Os anfitriões dão as boas-vindas ao episódio 87 do Podcast Cunversa.', categoria: 'introducao', importante: false },
    { id: 3, tempo: '00:11:30', titulo: 'Homenagem e Lançamento de Livro', descricao: 'Homenagem a Altan Rego e anúncio do livro do Dr. Luís Fernando.', categoria: 'introducao', importante: true },
    
    // HISTÓRIA PESSOAL
    { id: 4, tempo: '00:16:58', titulo: 'De São Paulo a Camocim', descricao: 'Professor Renato conta sua jornada de São Paulo para Camocim.', categoria: 'historia', importante: true },
    { id: 5, tempo: '00:24:32', titulo: 'Ativismo Político', descricao: 'Relato do ativismo político durante a redemocratização do Brasil.', categoria: 'historia', importante: false },
    { id: 6, tempo: '00:32:58', titulo: 'Chegada ao Ceará', descricao: 'História da mudança para Camocim e início da vida no Nordeste.', categoria: 'historia', importante: true },
    
    // ORIGEM DO CINEMAR
    { id: 7, tempo: '00:40:59', titulo: 'Origem do CineMar', descricao: 'Como surgiu a ideia do projeto CineMar em Camocim.', categoria: 'cinemar', importante: true },
    { id: 8, tempo: '00:58:12', titulo: 'Criação do CineMar', descricao: 'Processo de fundação e primeiras sessões do CineMar.', categoria: 'cinemar', importante: true },
    { id: 9, tempo: '01:02:03', titulo: 'Objetivos do Projeto', descricao: 'Missão e propósitos do CineMar na comunidade.', categoria: 'cinemar', importante: true },
    
    // CINEMA EM CAMOCIM
    { id: 10, tempo: '01:13:32', titulo: 'Cinemas de Camocim', descricao: 'História dos cinemas tradicionais de Camocim.', categoria: 'cinema', importante: true },
    { id: 11, tempo: '01:16:37', titulo: 'Declínio dos Cinemas de Rua', descricao: 'O desaparecimento dos cinemas tradicionais.', categoria: 'cinema', importante: false },
    { id: 12, tempo: '01:26:21', titulo: 'Evolução dos Espaços Públicos', descricao: 'Como os espaços públicos mudaram ao longo do tempo.', categoria: 'cinema', importante: false },
    
    // PODER DO CINEMA
    { id: 13, tempo: '01:31:01', titulo: 'Poder do Cinema', descricao: 'Como o cinema transforma e educa as pessoas.', categoria: 'cinema', importante: true },
    { id: 14, tempo: '01:37:37', titulo: 'Experiência Social do Cinema', descricao: 'O cinema como atividade social e coletiva.', categoria: 'cinema', importante: false },
    { id: 15, tempo: '01:42:34', titulo: 'Cinema na Educação', descricao: 'Uso do cinema como ferramenta educacional.', categoria: 'educacao', importante: true },
    
    // FUNCIONAMENTO DO CINEMAR
    { id: 16, tempo: '01:50:13', titulo: 'Funcionamento do CineMar', descricao: 'Como são organizadas as sessões e engajamento comunitário.', categoria: 'cinemar', importante: true },
    { id: 17, tempo: '01:54:55', titulo: 'Impacto do Cinema na Sociedade', descricao: 'Como o cinema afeta a sociedade e os jovens.', categoria: 'educacao', importante: false },
    { id: 18, tempo: '01:58:45', titulo: 'Poder do Engajamento Comunitário', descricao: 'Importância do envolvimento da comunidade no CineMar.', categoria: 'cinemar', importante: false },
    
    // CONSIDERAÇÕES FINAIS
    { id: 19, tempo: '02:02:09', titulo: 'Considerações Finais', descricao: 'Conclusão do episódio e agradecimentos.', categoria: 'conclusao', importante: true },
    { id: 20, tempo: '02:08:11', titulo: 'Encerramento', descricao: 'Encerramento do episódio e convite para próximas sessões.', categoria: 'conclusao', importante: false }
  ];

  // Configuração simplificada das categorias
  const categories = [
    { 
      id: 'todos', 
      label: 'Todos os Momentos', 
      count: timelineData.length
    },
    { 
      id: 'importante', 
      label: 'Apenas Importantes', 
      count: timelineData.filter(t => t.importante).length
    },
    { 
      id: 'introducao', 
      label: 'Introdução', 
      count: timelineData.filter(t => t.categoria === 'introducao').length
    },
    { 
      id: 'historia', 
      label: 'História Pessoal', 
      count: timelineData.filter(t => t.categoria === 'historia').length
    },
    { 
      id: 'cinemar', 
      label: 'CineMar', 
      count: timelineData.filter(t => t.categoria === 'cinemar').length
    },
    { 
      id: 'cinema', 
      label: 'Cinema', 
      count: timelineData.filter(t => t.categoria === 'cinema').length
    },
    { 
      id: 'educacao', 
      label: 'Educação', 
      count: timelineData.filter(t => t.categoria === 'educacao').length
    },
    { 
      id: 'conclusao', 
      label: 'Conclusão', 
      count: timelineData.filter(t => t.categoria === 'conclusao').length
    }
  ];

  // Filtra os dados baseado na busca e categoria
  const filteredTimeline = timelineData.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'todos' || 
      (selectedCategory === 'importante' && item.importante) ||
      item.categoria === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Agrupa por categoria
  const groupedTimeline = filteredTimeline.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = [];
    }
    acc[item.categoria].push(item);
    return acc;
  }, {} as Record<string, Timestamp[]>);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('todos');
  };

  const formatTempo = (tempo: string) => {
    const [horas, minutos] = tempo.split(':');
    return `${horas}:${minutos}`;
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  return (
    <div className={`${styles.podcastsPage} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* Header */}
      <header className={`${styles.heroHeader} ${isDarkMode ? styles.darkHeader : ''}`}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={styles.backButton}>
              <FaArrowLeft />
              <span>Voltar para Início</span>
            </Link>
            
            <div className={styles.themeControls}>
              <button 
                className={`${styles.themeToggle} ${isDarkMode ? styles.darkToggle : ''}`}
                onClick={toggleTheme}
              >
                {isDarkMode ? <FaSun /> : <FaMoon />}
                <span className={styles.themeLabel}>
                  {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                </span>
              </button>
            </div>
          </div>
          
          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>
              <FaHeadphones className={styles.titleIcon} />
              Podcast CineMar
            </h1>
            <p className={styles.heroSubtitle}>
              Linha do tempo interativa da nossa participação no Cunversa
            </p>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className={`${styles.mainContent} ${isDarkMode ? styles.darkMain : ''}`}>
        <div className={styles.contentWrapper}>
          
          {/* Vídeo */}
          <div className={styles.videoContainer}>
            <div className={`${styles.videoCard} ${isDarkMode ? styles.darkCard : ''}`}>
              <div className={styles.videoHeader}>
                <h2 className={styles.videoTitle}>
                  {podcast.titulo}
                </h2>
                
                <div className={styles.videoMeta}>
                  <div className={styles.metaItem}>
                    <FaCalendarAlt />
                    <span>{podcast.data}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <FaClock />
                    <span>{podcast.duracao}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <FaYoutube />
                    <span>Episódio {podcast.episodio}</span>
                  </div>
                </div>
              </div>
              
              {/* Container do Vídeo */}
              <div className={styles.youtubeContainer}>
                {!videoLoaded && (
                  <div className={styles.videoLoading}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Carregando vídeo...</p>
                  </div>
                )}
                
                <iframe
                  id="youtube-video"
                  className={styles.youtubeIframe}
                  src={`https://www.youtube.com/embed/${podcast.videoId}?rel=0&modestbranding=1`}
                  title={podcast.titulo}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={handleVideoLoad}
                />
                
                <div className={styles.videoActions}>
                  <button 
                    className={`${styles.favoritoBtn} ${favorito ? styles.favoritado : ''}`}
                    onClick={toggleFavorito}
                    title={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    {favorito ? <FaHeart /> : <FaRegHeart />}
                    <span className={styles.buttonLabel}>
                      {favorito ? 'Favoritado' : 'Favoritar'}
                    </span>
                  </button>
                  
                  <button 
                    className={styles.compartilharBtn}
                    onClick={compartilharPodcast}
                    title="Compartilhar este podcast"
                  >
                    <FaShareAlt />
                    <span className={styles.buttonLabel}>Compartilhar</span>
                  </button>
                  
                  <a 
                    href={podcast.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.youtubeLink}
                    title="Abrir no YouTube"
                  >
                    <FaExternalLinkAlt />
                    <span className={styles.buttonLabel}>YouTube</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filtros da Linha do Tempo */}
          <div className={styles.timelineFilters}>
            <div className={`${styles.searchBox} ${isDarkMode ? styles.darkSearchBox : ''}`}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar na linha do tempo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button 
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery('')}
                  title="Limpar busca"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            
            <div className={styles.categoryFilters}>
              <div className={styles.filtersHeader}>
                <FaFilter />
                <span>Filtrar por categoria:</span>
              </div>
              
              <div className={styles.categoryButtons}>
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`${styles.categoryBtn} ${selectedCategory === category.id ? styles.active : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className={styles.categoryLabel}>{category.label}</span>
                    <span className={styles.categoryCount}>({category.count})</span>
                  </button>
                ))}
                
                {(searchQuery || selectedCategory !== 'todos') && (
                  <button 
                    className={styles.clearFiltersBtn}
                    onClick={clearFilters}
                    title="Limpar todos os filtros"
                  >
                    <FaTimes />
                    <span>Limpar Filtros</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Linha do Tempo */}
          <div className={styles.timelineContainer}>
            <div className={`${styles.timelineCard} ${isDarkMode ? styles.darkCard : ''}`}>
              <div className={styles.timelineHeader}>
                <h3 className={styles.timelineTitle}>
                  Linha do Tempo Interativa
                </h3>
                <div className={styles.timelineStats}>
                  <span className={styles.statsItem}>
                    <strong>{filteredTimeline.length}</strong> momentos
                  </span>
                  <span className={styles.statsItem}>
                    <strong>{Object.keys(groupedTimeline).length}</strong> categorias
                  </span>
                </div>
              </div>
              
              {/* Lista da Linha do Tempo */}
              <div className={styles.timelineList}>
                {Object.keys(groupedTimeline).length > 0 ? (
                  Object.entries(groupedTimeline).map(([category, items]) => {
                    const isExpanded = expandedCategory === category || expandedCategory === 'todos';
                    const categoryInfo = categories.find(c => c.id === category);
                    
                    return (
                      <div key={category} className={styles.timelineCategory}>
                        <div 
                          className={`${styles.categoryHeader} ${isExpanded ? styles.expanded : ''}`}
                          onClick={() => toggleCategory(category)}
                        >
                          <div className={styles.categoryHeaderContent}>
                            <div className={styles.categoryInfo}>
                              <h4 className={styles.categoryTitle}>
                                {categoryInfo?.label || category}
                              </h4>
                              <span className={styles.categorySubtitle}>
                                {items.length} momento{items.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className={styles.categoryItems}>
                            {items.map((item) => (
                              <div 
                                key={item.id} 
                                className={`${styles.timelineItem} ${item.importante ? styles.importante : ''}`}
                                onClick={() => pularParaTempo(item.tempo)}
                              >
                                <div className={styles.timelineMarker}>
                                  <div className={styles.markerTime}>
                                    {formatTempo(item.tempo)}
                                  </div>
                                </div>
                                
                                <div className={styles.timelineContent}>
                                  <div className={styles.itemHeader}>
                                    <h5 className={styles.itemTitle}>
                                      {item.titulo}
                                      {item.importante && (
                                        <span className={styles.importanteBadge}>
                                          <FaStar className={styles.importanteIcon} />
                                          Importante
                                        </span>
                                      )}
                                    </h5>
                                    <button 
                                      className={styles.itemPlayBtn}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        pularParaTempo(item.tempo);
                                      }}
                                    >
                                      <FaPlay />
                                      <span>Assistir</span>
                                    </button>
                                  </div>
                                  
                                  <p className={styles.itemDescription}>
                                    {item.descricao}
                                  </p>
                                  
                                  <div className={styles.itemMeta}>
                                    <span className={styles.itemTime}>
                                      {item.tempo}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}>
                      <FaSearch />
                    </div>
                    <h4>Nenhum momento encontrado</h4>
                    <p>Tente alterar os termos de busca ou categorias</p>
                    <button 
                      className={styles.clearFiltersBtn}
                      onClick={clearFilters}
                    >
                      <FaTimes />
                      Limpar Filtros
                    </button>
                  </div>
                )}
              </div>
              
              {/* Resumo */}
              <div className={styles.timelineSummary}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Duração total:</span>
                  <span className={styles.summaryValue}>{podcast.duracao}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Momentos importantes:</span>
                  <span className={styles.summaryValue}>
                    {timelineData.filter(t => t.importante).length} de {timelineData.length}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Categorias:</span>
                  <span className={styles.summaryValue}>{Object.keys(groupedTimeline).length}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Informações Complementares */}
          <div className={styles.infoContainer}>
            {/* Participantes */}
            <div className={`${styles.infoCard} ${isDarkMode ? styles.darkCard : ''}`}>
              <div className={styles.infoCardHeader}>
                <h3 className={styles.sectionTitle}>
                  Participantes
                </h3>
              </div>
              <div className={styles.participantesList}>
                {podcast.participantes.map((participante, index) => (
                  <div key={index} className={styles.participanteItem}>
                    <div className={styles.participanteInfo}>
                      <span className={styles.participanteNome}>{participante}</span>
                      <span className={styles.participanteRole}>
                        {index < 2 ? 'Co-fundador do CineMar' : 'Apresentador do Cunversa'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sobre a ACCAL */}
            <div className={`${styles.infoCard} ${isDarkMode ? styles.darkCard : ''}`}>
              <div className={styles.infoCardHeader}>
                <h3 className={styles.sectionTitle}>
                  Sobre a ACCAL
                </h3>
              </div>
              <p className={styles.infoText}>
                A Academia Camocinense de Ciências, Artes e Letras (ACCAL) é uma instituição cultural 
                dedicada à promoção e preservação do conhecimento, artes e letras em Camocim. 
                Através do podcast <strong>Cunversa</strong>, a ACCAL proporciona um espaço para 
                diálogos enriquecedores sobre cultura, educação e desenvolvimento comunitário.
              </p>
              <div className={styles.infoLinks}>
                <a 
                  href="https://www.youtube.com/@AcademiaCamocinensedeCiencia" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.infoLink}
                >
                  <FaYoutube />
                  <span>Visitar canal da ACCAL</span>
                </a>
              </div>
            </div>
            
            {/* Localização */}
            <div className={`${styles.infoCard} ${isDarkMode ? styles.darkCard : ''}`}>
              <div className={styles.infoCardHeader}>
                <h3 className={styles.sectionTitle}>
                  Localização
                </h3>
              </div>
              <p className={styles.infoText}>
                O CineMar atua em <strong>Camocim, Ceará</strong>, realizando sessões quinzenais 
                que promovem cinema, cultura e diálogo comunitário. O projeto tem como objetivo 
                resgatar a tradição cinematográfica da cidade e criar novos espaços de encontro.
              </p>
              <div className={styles.infoLinks}>
                <Link 
                  to="/eventos" 
                  className={styles.infoLink}
                >
                  <FaCalendarAlt />
                  <span>Ver Próximos Eventos</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          <div className={styles.tagsContainer}>
            <div className={`${styles.tagsCard} ${isDarkMode ? styles.darkCard : ''}`}>
              <div className={styles.tagsHeader}>
                <h3 className={styles.sectionTitle}>
                  <FaTag />
                  Tags
                </h3>
              </div>
              <div className={styles.tagsList}>
                {podcast.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}