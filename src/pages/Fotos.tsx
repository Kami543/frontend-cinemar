import { useState, useEffect } from 'react';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaUsers, 
  FaFilm, 
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExternalLinkAlt,
  FaVideo,
  FaImage,
  FaChevronUp,
  FaChevronDown,
  FaSun,
  FaMoon,
  FaGoogleDrive,
  FaRegImages,
  FaDownload
} from 'react-icons/fa';
import styles from '../styles/Fotos.module.css';

// Definir interfaces TypeScript
interface Foto {
  id: number;
  url: string;
  titulo: string;
  descricao: string;
  data: string;
  categoria: string;
  tipo: 'foto' | 'video';
  driveLink?: string; // Link original do Google Drive
}

interface Sessao {
  id: number;
  titulo: string;
  diretor: string;
  ano: number;
  dataSessao: string;
  participantes: number;
  descricao: string;
  totalFotos: number;
  fotos: Foto[];
}

// URLs do Google Drive para a sessão "O AGENTE SECRETO"
const AGENTE_SECRETO_FOTOS = {
  fotosDebate: [
    {
      id: 1,
      url: "https://drive.google.com/thumbnail?id=1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t1&sz=w1000",
      driveLink: "https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t1/view",
      titulo: "DEBATE COMPLETO - PARTE 1",
      descricao: "Momentos iniciais do debate sobre O Agente Secreto",
      data: "06/11/2024",
      categoria: "Debate",
      tipo: "foto" as const
    },
    {
      id: 2,
      url: "https://drive.google.com/thumbnail?id=1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t2&sz=w1000",
      driveLink: "https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t2/view",
      titulo: "APRESENTAÇÃO DO FILME",
      descricao: "Introdução à obra de Kleber Mendonça Filho",
      data: "06/11/2024",
      categoria: "Apresentação",
      tipo: "foto" as const
    },
    {
      id: 3,
      url: "https://drive.google.com/thumbnail?id=1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t3&sz=w1000",
      driveLink: "https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t3/view",
      titulo: "MEDIAÇÃO DO DEBATE",
      descricao: "Coordenação das discussões sobre o filme",
      data: "06/11/2024",
      categoria: "Mediação",
      tipo: "foto" as const
    },
    {
      id: 4,
      url: "https://drive.google.com/thumbnail?id=1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t4&sz=w1000",
      driveLink: "https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t4/view",
      titulo: "PARTICIPANTES ATENTOS",
      descricao: "Público engajado durante o debate",
      data: "06/11/2024",
      categoria: "Participação",
      tipo: "foto" as const
    },
    {
      id: 5,
      url: "https://drive.google.com/thumbnail?id=1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t5&sz=w1000",
      driveLink: "https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t5/view",
      titulo: "MOMENTOS DE REFLEXÃO",
      descricao: "Discussões sobre ditadura e cinema brasileiro",
      data: "06/11/2024",
      categoria: "Debate",
      tipo: "foto" as const
    },
    {
      id: 6,
      url: "https://drive.google.com/thumbnail?id=1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t6&sz=w1000",
      driveLink: "https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t6/view",
      titulo: "ENCERRAMENTO",
      descricao: "Final da sessão com conclusões importantes",
      data: "06/11/2024",
      categoria: "Encerramento",
      tipo: "foto" as const
    }
  ],
  videos: [
    {
      id: 101,
      url: "https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t7/preview",
      driveLink: "https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t7/view",
      titulo: "DEBATE COMPLETO - GRAVAÇÃO INTEGRAL",
      descricao: "Gravação completa da sessão de debate (2h 15min)",
      data: "06/11/2024",
      categoria: "Debate",
      tipo: "video" as const
    },
    {
      id: 102,
      url: "https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t8/preview",
      driveLink: "https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t8/view",
      titulo: "MELHORES MOMENTOS",
      descricao: "Compilação dos momentos mais importantes do debate",
      data: "06/11/2024",
      categoria: "Highlights",
      tipo: "video" as const
    },
    {
      id: 103,
      url: "https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t9/preview",
      driveLink: "https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t9/view",
      titulo: "ENTREVISTAS COM PARTICIPANTES",
      descricao: "Depoimentos após a sessão",
      data: "06/11/2024",
      categoria: "Entrevistas",
      tipo: "video" as const
    }
  ],
  bastidores: [
    {
      id: 201,
      url: "https://drive.google.com/thumbnail?id=1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t10&sz=w1000",
      driveLink: "https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t10/view",
      titulo: "PREPARAÇÃO DO ESPAÇO",
      descricao: "Organização antes do início da sessão",
      data: "06/11/2024",
      categoria: "Bastidores",
      tipo: "foto" as const
    },
    {
      id: 202,
      url: "https://drive.google.com/thumbnail?id=1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t11&sz=w1000",
      driveLink: "https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t11/view",
      titulo: "EQUIPE DE PRODUÇÃO",
      descricao: "Trabalho da equipe organizadora",
      data: "06/11/2024",
      categoria: "Bastidores",
      tipo: "foto" as const
    },
    {
      id: 203,
      url: "https://drive.google.com/thumbnail?id=1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t12&sz=w1000",
      driveLink: "https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t12/view",
      titulo: "INTERAÇÕES INFORMÁIS",
      descricao: "Conversas entre participantes antes do debate",
      data: "06/11/2024",
      categoria: "Bastidores",
      tipo: "foto" as const
    }
  ]
};

// Componente para imagem com fallback
const ImagemComFallback = ({ 
  src, 
  alt, 
  className, 
  driveLink,
  modoEscuro 
}: { 
  src: string; 
  alt: string; 
  className: string; 
  driveLink?: string;
  modoEscuro: boolean;
}) => {
  const [erroCarregamento, setErroCarregamento] = useState(false);

  const abrirDrive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (driveLink) {
      window.open(driveLink, '_blank');
    }
  };

  if (erroCarregamento) {
    return (
      <div className={`${styles.fallbackImage} ${modoEscuro ? styles.darkFallback : ''}`}>
        <FaRegImages className={styles.fallbackIcon} />
        <p className={styles.fallbackText}>Imagem indisponível no momento</p>
        {driveLink && (
          <button 
            className={styles.driveButton}
            onClick={abrirDrive}
          >
            <FaGoogleDrive className={styles.driveIcon} />
            Ver no Google Drive
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.imageContainer}>
      <img 
        src={src} 
        alt={alt}
        className={className}
        onError={() => setErroCarregamento(true)}
        loading="lazy"
      />
      {driveLink && (
        <button 
          className={styles.driveOverlayButton}
          onClick={abrirDrive}
          title="Abrir no Google Drive"
        >
          <FaGoogleDrive className={styles.driveOverlayIcon} />
        </button>
      )}
    </div>
  );
};

// Componente para vídeo com fallback
const VideoComFallback = ({ 
  src, 
  titulo, 
  className, 
  driveLink,
  modoEscuro 
}: { 
  src: string; 
  titulo: string; 
  className: string; 
  driveLink?: string;
  modoEscuro: boolean;
}) => {
  const [erroCarregamento, setErroCarregamento] = useState(false);

  const abrirDrive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (driveLink) {
      window.open(driveLink, '_blank');
    }
  };

  if (erroCarregamento) {
    return (
      <div className={`${styles.fallbackVideo} ${modoEscuro ? styles.darkFallback : ''}`}>
        <FaVideo className={styles.fallbackIcon} />
        <p className={styles.fallbackText}>Vídeo indisponível no momento</p>
        {driveLink && (
          <button 
            className={styles.driveButton}
            onClick={abrirDrive}
          >
            <FaGoogleDrive className={styles.driveIcon} />
            Assistir no Google Drive
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.videoContainerWrapper}>
      <iframe
        src={src}
        title={titulo}
        className={className}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onError={() => setErroCarregamento(true)}
      />
      {driveLink && (
        <button 
          className={styles.driveOverlayButton}
          onClick={abrirDrive}
          title="Abrir no Google Drive"
        >
          <FaGoogleDrive className={styles.driveOverlayIcon} />
        </button>
      )}
    </div>
  );
};

// Função para converter links do Google Drive para iframe/view
const getDriveLink = (url: string, tipo: 'foto' | 'video') => {
  if (tipo === 'video') {
    const fileId = url.split('/d/')[1]?.split('/')[0] || 
                   url.split('id=')[1]?.split('&')[0];
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
  }
  return url;
};

// Dados das sessões com fotos
const sessoesComFotos: Sessao[] = [
  {
    id: 6,
    titulo: "O AGENTE SECRETO",
    diretor: "Kleber Mendonça Filho",
    ano: 2025,
    dataSessao: "06/11/2024",
    participantes: 68,
    descricao: "Sessão especial de pré-estreia com debate sobre o novo filme de Kleber Mendonça Filho, abordando temas como ditadura, identidade nacional e cinema contemporâneo brasileiro.",
    totalFotos: 24,
    fotos: [
      ...AGENTE_SECRETO_FOTOS.fotosDebate,
      ...AGENTE_SECRETO_FOTOS.videos,
      ...AGENTE_SECRETO_FOTOS.bastidores
    ]
  },
  {
    id: 1,
    titulo: "AINDA ESTOU AQUI",
    diretor: "Walter Carvalho",
    ano: 2015,
    dataSessao: "05/10/2024",
    participantes: 42,
    descricao: "Documentário sobre a trajetória de Walter Carvalho no cinema nacional",
    totalFotos: 24,
    fotos: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        driveLink: "https://drive.google.com/drive/folders/example",
        titulo: "ABERTURA DA SESSÃO",
        descricao: "Momento inicial do debate sobre Walter Carvalho",
        data: "05/10/2024",
        categoria: "Debate",
        tipo: "foto"
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        driveLink: "https://drive.google.com/drive/folders/example",
        titulo: "MEDIAÇÃO",
        descricao: "Mediação do debate pelos coordenadores",
        data: "05/10/2024",
        categoria: "Debate",
        tipo: "foto"
      }
    ]
  },
  // ... outras sessões
];

export default function Fotos() {
  const [sessaoSelecionada, setSessaoSelecionada] = useState<Sessao | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroAno, setFiltroAno] = useState<string>('todos');
  const [visualizadorAtivo, setVisualizadorAtivo] = useState(false);
  const [midiaSelecionada, setMidiaSelecionada] = useState<Foto | null>(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas');
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const [modoEscuro, setModoEscuro] = useState<boolean>(() => {
    const salvo = localStorage.getItem('modoEscuro');
    if (salvo !== null) return JSON.parse(salvo);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const alternarModoEscuro = () => {
    const novoModo = !modoEscuro;
    setModoEscuro(novoModo);
    localStorage.setItem('modoEscuro', JSON.stringify(novoModo));
  };

  const anosUnicos = ['todos', ...Array.from(new Set(sessoesComFotos.map(s => s.dataSessao.split('/')[2] || '2024')))];

  const sessoesFiltradas = sessoesComFotos.filter(sessao => {
    const buscaMatch = busca === '' || 
      sessao.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      sessao.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      sessao.diretor.toLowerCase().includes(busca.toLowerCase());
    
    const anoMatch = filtroAno === 'todos' || (sessao.dataSessao.split('/')[2] || '2024') === filtroAno;
    
    return buscaMatch && anoMatch;
  });

  const categoriasUnicas = sessaoSelecionada 
    ? ['todas', ...Array.from(new Set(sessaoSelecionada.fotos.map(f => f.categoria)))]
    : [];

  const midiasFiltradas = sessaoSelecionada 
    ? categoriaAtiva === 'todas'
      ? sessaoSelecionada.fotos
      : sessaoSelecionada.fotos.filter(midia => midia.categoria === categoriaAtiva)
    : [];

  const abrirVisualizador = (midia: Foto) => {
    setMidiaSelecionada(midia);
    setVisualizadorAtivo(true);
    document.body.style.overflow = 'hidden';
  };

  const fecharVisualizador = () => {
    setVisualizadorAtivo(false);
    setMidiaSelecionada(null);
    document.body.style.overflow = 'auto';
  };

  const navegarMidia = (direcao: 'anterior' | 'proximo') => {
    if (!midiaSelecionada || !sessaoSelecionada) return;
    
    const midias = midiasFiltradas;
    const indexAtual = midias.findIndex(f => f.id === midiaSelecionada.id);
    
    if (direcao === 'anterior') {
      const anterior = indexAtual > 0 ? midias[indexAtual - 1] : midias[midias.length - 1];
      setMidiaSelecionada(anterior);
    } else {
      const proximo = indexAtual < midias.length - 1 ? midias[indexAtual + 1] : midias[0];
      setMidiaSelecionada(proximo);
    }
  };

  const abrirDriveLink = (driveLink?: string) => {
    if (driveLink) {
      window.open(driveLink, '_blank');
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (modoEscuro) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [modoEscuro]);

  return (
    <div className={`${styles.fotosContainer} ${modoEscuro ? styles.darkMode : ''}`}>
      {/* Header */}
      <header className={`${styles.heroHeader} ${modoEscuro ? styles.darkHeader : ''}`}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <div className={styles.breadcrumb}>
              <button 
                className={styles.voltarInicioButton}
                onClick={() => sessaoSelecionada ? setSessaoSelecionada(null) : window.history.back()}
              >
                <FaArrowLeft className={styles.buttonIcon} /> {sessaoSelecionada ? 'Voltar para Sessões' : 'Voltar para Início'}
              </button>
            </div>
            
            <div className={styles.themeControls}>
              <button 
                className={styles.themeToggle}
                onClick={alternarModoEscuro}
                title={modoEscuro ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
              >
                {modoEscuro ? <FaSun className={styles.themeIcon} /> : <FaMoon className={styles.themeIcon} />}
                <span className={styles.themeLabel}>
                  {modoEscuro ? 'Modo Claro' : 'Modo Escuro'}
                </span>
              </button>
            </div>
          </div>
          
          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>
              {sessaoSelecionada ? sessaoSelecionada.titulo : 'FOTOS E VÍDEOS DAS SESSÕES'}
            </h1>
            <p className={styles.heroSubtitle}>
              {sessaoSelecionada 
                ? `Galeria de fotos e vídeos da sessão - ${sessaoSelecionada.diretor}`
                : 'Galeria completa de fotos e vídeos dos debates do CineMar'
              }
            </p>
          </div>
        </div>
      </header>

      {!sessaoSelecionada ? (
        <>
          {/* Filtros e Busca */}
          <div className={`${styles.filtersSection} ${modoEscuro ? styles.darkFilters : ''}`}>
            <div className={styles.filtersContent}>
              <div className={styles.searchContainer}>
                <div className={styles.searchBox}>
                  <FaSearch className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Buscar sessões por título, diretor ou descrição..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className={`${styles.searchInput} ${modoEscuro ? styles.darkInput : ''}`}
                  />
                </div>
                
                <div className={styles.filtersInfo}>
                  <FaChevronDown className={styles.filterIcon} />
                  <span>Filtrar por ano:</span>
                </div>
                
                <div className={styles.tipoFilters}>
                  {anosUnicos.map(ano => (
                    <button
                      key={ano}
                      className={`${styles.tipoFilterBtn} ${filtroAno === ano ? styles.active : ''} ${modoEscuro ? styles.darkFilterBtn : ''}`}
                      onClick={() => setFiltroAno(ano)}
                    >
                      {ano === 'todos' ? 'Todos os Anos' : `Ano ${ano}`}
                      {filtroAno === ano && (
                        <div className={styles.activeIndicator} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <main className={`${styles.mainContent} ${modoEscuro ? styles.darkMain : ''}`}>
            <div className={styles.allEvents}>
              <div className={styles.sectionHeader}>
                <h2 className={`${styles.selecaoTitulo} ${modoEscuro ? styles.darkTitle : ''}`}>
                  <FaCalendarAlt className={styles.sectionTitleIcon} />
                  Todas as Sessões
                  <span className={styles.eventosCount}>({sessoesFiltradas.length})</span>
                </h2>
                <p className={`${styles.sectionSubtitle} ${modoEscuro ? styles.darkSubtitle : ''}`}>
                  Selecione uma sessão para ver fotos, vídeos e momentos especiais dos debates
                </p>
              </div>
              
              {sessoesFiltradas.length === 0 ? (
                <div className={styles.noResults}>
                  <div className={`${styles.noResultsIcon} ${modoEscuro ? styles.darkNoResultsIcon : ''}`}>
                    <FaSearch className={styles.noResultsIconSvg} />
                  </div>
                  <h3 className={modoEscuro ? styles.darkText : ''}>Nenhuma sessão encontrada</h3>
                  <p className={modoEscuro ? styles.darkText : ''}>Tente alterar os filtros ou termos de busca</p>
                  <button 
                    className={styles.clearFiltersBtn}
                    onClick={() => {
                      setFiltroAno('todos');
                      setBusca('');
                    }}
                  >
                    Limpar Filtros
                  </button>
                </div>
              ) : (
                <div className={styles.sessoesList}>
                  {sessoesFiltradas.map(sessao => (
                    <div
                      key={sessao.id}
                      className={`${styles.sessaoCard} ${modoEscuro ? styles.darkCard : ''}`}
                      onClick={() => setSessaoSelecionada(sessao)}
                    >
                      <div className={styles.sessaoCardHeader}>
                        <h3 className={`${styles.sessaoCardTitulo} ${modoEscuro ? styles.darkText : ''}`}>{sessao.titulo}</h3>
                        <span className={styles.sessaoCardStatus}>
                          {sessao.participantes} participantes
                        </span>
                      </div>
                      
                      <div className={styles.sessaoCardContent}>
                        <div className={styles.eventoCardMeta}>
                          <div className={`${styles.metaItem} ${modoEscuro ? styles.darkMetaItem : ''}`}>
                            <FaCalendarAlt className={styles.metaItemIcon} />
                            <span className={styles.metaItemText}>{sessao.dataSessao}</span>
                          </div>
                          <div className={`${styles.metaItem} ${modoEscuro ? styles.darkMetaItem : ''}`}>
                            <FaFilm className={styles.metaItemIcon} />
                            <span className={styles.metaItemText}>{sessao.diretor}</span>
                          </div>
                        </div>
                        
                        <p className={`${styles.eventoCardDescricao} ${modoEscuro ? styles.darkTextSecondary : ''}`}>
                          {sessao.descricao}
                        </p>
                        
                        <div className={styles.sessaoCardStats}>
                          <div className={`${styles.statItem} ${modoEscuro ? styles.darkTextSecondary : ''}`}>
                            <span>
                              {sessao.fotos.filter(f => f.tipo === 'foto').length} fotos
                            </span>
                          </div>
                          
                          <div className={`${styles.statItem} ${modoEscuro ? styles.darkTextSecondary : ''}`}>
                            <span>
                              {sessao.fotos.filter(f => f.tipo === 'video').length} vídeos
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.sessaoCardFooter}>
                        <button className={styles.verFotosButton}>
                          Ver Galeria Completa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </>
      ) : (
        /* Tela de Galeria da Sessão Selecionada */
        <main className={`${styles.mainContent} ${modoEscuro ? styles.darkMain : ''}`}>
          {/* Cabeçalho da Sessão */}
          <div className={`${styles.sessaoHeader} ${modoEscuro ? styles.darkCard : ''}`}>
            <div className={styles.sessaoInfo}>
              <div className={styles.sessaoHeaderTop}>
                <h2 className={`${styles.sessaoTitulo} ${modoEscuro ? styles.darkText : ''}`}>
                  {sessaoSelecionada.titulo}
                </h2>
                <div className={`${styles.sessaoStats} ${modoEscuro ? styles.darkStats : ''}`}>
                  <span>
                    {sessaoSelecionada.fotos.filter(f => f.tipo === 'foto').length} FOTOS
                  </span>
                  <span>
                    {sessaoSelecionada.fotos.filter(f => f.tipo === 'video').length} VÍDEOS
                  </span>
                </div>
              </div>
              
              <div className={styles.sessaoDetalhes}>
                <div className={styles.sessaoInfoLinha}>
                  <span className={`${styles.sessaoInfoItem} ${modoEscuro ? styles.darkTextSecondary : ''}`}>
                    <FaFilm className={styles.infoItemIcon} /> {sessaoSelecionada.diretor} • {sessaoSelecionada.ano}
                  </span>
                  <span className={`${styles.sessaoInfoItem} ${modoEscuro ? styles.darkTextSecondary : ''}`}>
                    <FaCalendarAlt className={styles.infoItemIcon} /> {sessaoSelecionada.dataSessao}
                  </span>
                  <span className={`${styles.sessaoInfoItem} ${modoEscuro ? styles.darkTextSecondary : ''}`}>
                    <FaUsers className={styles.infoItemIcon} /> {sessaoSelecionada.participantes} PARTICIPANTES
                  </span>
                </div>
                <p className={`${styles.sessaoDescricao} ${modoEscuro ? styles.darkTextSecondary : ''}`}>
                  {sessaoSelecionada.descricao}
                </p>
              </div>
            </div>
            
            {/* Categorias de Mídias */}
            <div className={styles.categoriasNavegacao}>
              {categoriasUnicas.map((categoria: string) => (
                <button
                  key={categoria}
                  className={`${styles.categoriaButton} ${categoriaAtiva === categoria ? styles.ativa : ''} ${modoEscuro ? styles.darkCategoriaButton : ''}`}
                  onClick={() => setCategoriaAtiva(categoria)}
                >
                  {categoria === 'todas' ? 'TODOS OS MATERIAIS' : categoria.toUpperCase()}
                  {categoria !== 'todas' && ` (${sessaoSelecionada.fotos.filter(f => f.categoria === categoria).length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Galeria de Fotos e Vídeos */}
          <div className={styles.galeriaContainer}>
            {midiasFiltradas.length > 0 ? (
              <div className={styles.galeriaGrid}>
                {midiasFiltradas.map(midia => (
                  <div 
                    key={midia.id}
                    className={`${styles.midiaCard} ${midia.tipo === 'video' ? styles.videoCard : ''} ${modoEscuro ? styles.darkCard : ''}`}
                    onClick={() => abrirVisualizador(midia)}
                  >
                    <div className={styles.midiaImagemContainer}>
                      {midia.tipo === 'video' ? (
                        <VideoComFallback
                          src={getDriveLink(midia.url, 'video')}
                          titulo={midia.titulo}
                          className={styles.videoPreview}
                          driveLink={midia.driveLink}
                          modoEscuro={modoEscuro}
                        />
                      ) : (
                        <ImagemComFallback
                          src={getDriveLink(midia.url, 'foto')}
                          alt={midia.titulo}
                          className={styles.midiaImagem}
                          driveLink={midia.driveLink}
                          modoEscuro={modoEscuro}
                        />
                      )}
                    </div>
                    
                    <div className={styles.midiaInfo}>
                      <div className={`${styles.midiaTipo} ${modoEscuro ? styles.darkMidiaTipo : ''}`}>
                        {midia.tipo === 'video' ? <FaVideo className={styles.midiaTipoIcon} /> : <FaImage className={styles.midiaTipoIcon} />}
                        <span>{midia.tipo === 'video' ? 'VÍDEO' : 'FOTO'}</span>
                      </div>
                      <h4 className={`${styles.midiaTitulo} ${modoEscuro ? styles.darkText : ''}`}>{midia.titulo}</h4>
                      <p className={`${styles.midiaDescricao} ${modoEscuro ? styles.darkTextSecondary : ''}`}>{midia.descricao}</p>
                      <div className={styles.midiaMeta}>
                        <span className={`${styles.midiaData} ${midia.tipo === 'video' && !modoEscuro ? styles.videoData : ''}`}>
                          {midia.data}
                        </span>
                        <span className={`${styles.midiaCategoria} ${midia.tipo === 'video' && !modoEscuro ? styles.videoCategoria : ''}`}>
                          {midia.categoria}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <div className={`${styles.noResultsIcon} ${modoEscuro ? styles.darkNoResultsIcon : ''}`}>
                  <FaSearch className={styles.noResultsIconSvg} />
                </div>
                <h3 className={modoEscuro ? styles.darkText : ''}>Nenhum material encontrado</h3>
                <p className={modoEscuro ? styles.darkText : ''}>Tente selecionar outra categoria</p>
                <button 
                  className={styles.clearFiltersBtn}
                  onClick={() => setCategoriaAtiva('todas')}
                >
                  Mostrar Todos
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Visualizador de Mídia em Tela Cheia */}
      {visualizadorAtivo && midiaSelecionada && (
        <div className={`${styles.visualizadorOverlay} ${modoEscuro ? styles.darkVisualizador : ''}`}>
          <div className={styles.visualizadorContent}>
            <button 
              className={styles.fecharVisualizador}
              onClick={fecharVisualizador}
            >
              <FaTimes className={styles.closeIcon} />
            </button>
            
            <div className={styles.visualizadorNavegacao}>
              <button 
                className={styles.navegacaoButton}
                onClick={() => navegarMidia('anterior')}
              >
                <FaChevronLeft className={styles.navIcon} />
              </button>
              
              <div className={styles.visualizadorPrincipal}>
                {midiaSelecionada.tipo === 'video' ? (
                  <VideoComFallback
                    src={getDriveLink(midiaSelecionada.url, 'video')}
                    titulo={midiaSelecionada.titulo}
                    className={styles.visualizadorVideo}
                    driveLink={midiaSelecionada.driveLink}
                    modoEscuro={modoEscuro}
                  />
                ) : (
                  <ImagemComFallback
                    src={getDriveLink(midiaSelecionada.url, 'foto')}
                    alt={midiaSelecionada.titulo}
                    className={styles.visualizadorImagem}
                    driveLink={midiaSelecionada.driveLink}
                    modoEscuro={modoEscuro}
                  />
                )}
              </div>
              
              <button 
                className={styles.navegacaoButton}
                onClick={() => navegarMidia('proximo')}
              >
                <FaChevronRight className={styles.navIcon} />
              </button>
            </div>
            
            <div className={styles.visualizadorInfo}>
              <h3 className={styles.visualizadorTitulo}>
                {midiaSelecionada.titulo}
                <span className={styles.midiaTipoBadge}>
                  {midiaSelecionada.tipo === 'video' ? 'VÍDEO' : 'FOTO'}
                </span>
              </h3>
              <p className={styles.visualizadorDescricao}>{midiaSelecionada.descricao}</p>
              <div className={styles.visualizadorMeta}>
                <span>{midiaSelecionada.data}</span>
                <span>{midiaSelecionada.categoria}</span>
                <span>Sessão: {sessaoSelecionada?.titulo}</span>
              </div>
              {midiaSelecionada.driveLink && (
                <button 
                  className={styles.visualizadorDriveButton}
                  onClick={() => abrirDriveLink(midiaSelecionada.driveLink)}
                >
                  <FaGoogleDrive className={styles.visualizadorDriveIcon} />
                  Abrir no Google Drive
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}