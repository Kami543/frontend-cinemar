import { useState, useEffect } from 'react';
import { 
  FaImages, 
  FaVideo, 
  FaFilePdf, 
  FaDownload, 
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaUsers,
  FaFilm,
  FaChevronLeft,
  FaChevronRight,
  FaPlayCircle,
  FaTimes,
  FaSearch,
  FaFilter,
  FaSun,
  FaMoon,
  FaArrowLeft
} from 'react-icons/fa';
import styles from '../styles/Materiais.module.css';

// Dados dos materiais dos debates realizados
const materiaisPorDebate = [
  {
    id: 1,
    titulo: "A HORA DA ESTRELA",
    data: "19/03/2026",
    participantes: 47,
    descricao: "Debate sobre a adaptação cinematográfica da obra de Clarice Lispector",
    fotos: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        titulo: "ABERTURA DO DEBATE",
        descricao: "Momento inicial com os mediadores",
        data: "19/03/2026",
        tipo: "foto"
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        titulo: "DISCUSSÃO EM GRUPO",
        descricao: "Participantes interagindo durante o debate",
        data: "19/03/2026",
        tipo: "foto"
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        titulo: "APRESENTAÇÃO DOS MEDIADORES",
        descricao: "Professores apresentando suas perspectivas",
        data: "19/03/2026",
        tipo: "foto"
      }
    ],
    videos: [
      {
        id: 1,
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        titulo: "DEBATE COMPLETO",
        descricao: "Gravação integral do debate (2h 15min)",
        duracao: "2:15:00",
        data: "19/03/2026",
        tipo: "video"
      },
      {
        id: 2,
        url: "https://www.youtube.com/embed/tgbNymZ7vqY",
        titulo: "HIGHLIGHTS DO DEBATE",
        descricao: "Melhores momentos da discussão",
        duracao: "15:30",
        data: "19/03/2026",
        tipo: "video"
      }
    ],
    documentos: [
      {
        id: 1,
        url: "/materiais/presentacao-hora-estrela.pdf",
        titulo: "APRESENTAÇÃO COMPLETA",
        descricao: "Slides utilizados pelos mediadores (PDF)",
        tamanho: "4.2 MB",
        tipo: "pdf",
        paginas: 28
      },
      {
        id: 2,
        url: "/materiais/referencias-hora-estrela.pdf",
        titulo: "BIBLIOGRAFIA RECOMENDADA",
        descricao: "Lista de obras de referência sobre Clarice Lispector",
        tamanho: "1.8 MB",
        tipo: "pdf",
        paginas: 12
      },
      {
        id: 3,
        url: "/materiais/guia-debate-hora-estrela.pdf",
        titulo: "GUIA DE DISCUSSÃO",
        descricao: "Perguntas e temas para reflexão pós-debate",
        tamanho: "2.1 MB",
        tipo: "pdf",
        paginas: 15
      }
    ]
  },
  {
    id: 2,
    titulo: "CLARICE LISPECTOR: UNIVERSO LITERÁRIO",
    data: "12/02/2026",
    participantes: 38,
    descricao: "Discussão sobre a obra completa de Clarice Lispector",
    fotos: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        titulo: "EXPOSIÇÃO DE OBRAS",
        descricao: "Livros de Clarice expostos durante o evento",
        data: "12/02/2026",
        tipo: "foto"
      }
    ],
    videos: [
      {
        id: 1,
        url: "https://www.youtube.com/embed/tgbNymZ7vqY",
        titulo: "DEBATE SOBRE LITERATURA",
        descricao: "Análise das principais obras",
        duracao: "1:45:00",
        data: "12/02/2026",
        tipo: "video"
      }
    ],
    documentos: [
      {
        id: 1,
        url: "/materiais/clarice-lispector-guia.pdf",
        titulo: "GUIA DE LEITURA",
        descricao: "Cronologia e análise das obras",
        tamanho: "3.5 MB",
        tipo: "pdf",
        paginas: 22
      }
    ]
  },
  {
    id: 3,
    titulo: "CINEMA NACIONAL: ANOS 80",
    data: "05/02/2026",
    participantes: 42,
    descricao: "Análise do cinema brasileiro na década de 80",
    fotos: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        titulo: "CINE DEBATE",
        descricao: "Momento da projeção do filme",
        data: "05/02/2026",
        tipo: "foto"
      }
    ],
    videos: [
      {
        id: 1,
        url: "https://www.youtube.com/embed/tgbNymZ7vqY",
        titulo: "ANÁLISE CINEMATOGRÁFICA",
        descricao: "Discussão técnica sobre os filmes",
        duracao: "1:30:00",
        data: "05/02/2026",
        tipo: "video"
      }
    ],
    documentos: [
      {
        id: 1,
        url: "/materiais/cinema-anos-80.pdf",
        titulo: "LINHA DO TEMPO DO CINEMA 80",
        descricao: "Principais filmes e diretores da época",
        tamanho: "2.8 MB",
        tipo: "pdf",
        paginas: 18
      }
    ]
  }
];

export default function Materiais() {
  // Estado para controlar o fluxo
  const [telaAtiva, setTelaAtiva] = useState<'selecao' | 'materiais'>('selecao');
  const [debateSelecionado, setDebateSelecionado] = useState(materiaisPorDebate[0]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<'todos' | 'fotos' | 'videos' | 'documentos'>('todos');
  const [visualizadorAtivo, setVisualizadorAtivo] = useState(false);
  const [midiaSelecionada, setMidiaSelecionada] = useState<any>(null);
  const [busca, setBusca] = useState('');
  const [filtroAno, setFiltroAno] = useState<string>('todos');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [themeChanging, setThemeChanging] = useState(false);

  const toggleTheme = () => {
    setThemeChanging(true);
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    setTimeout(() => setThemeChanging(false), 300);
  };

  // Obter anos únicos para filtro
  const anosUnicos = ['todos', ...Array.from(new Set(materiaisPorDebate.map(d => d.data.split('/')[2])))];

  // Filtrar debates
  const debatesFiltrados = materiaisPorDebate.filter(debate => {
    const buscaMatch = busca === '' || 
      debate.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      debate.descricao.toLowerCase().includes(busca.toLowerCase());
    
    const anoMatch = filtroAno === 'todos' || debate.data.split('/')[2] === filtroAno;
    
    return buscaMatch && anoMatch;
  });

  // Função para selecionar um debate
  const selecionarDebate = (debate: any) => {
    setDebateSelecionado(debate);
    setTelaAtiva('materiais');
    // Resetar categoria para "todos" quando mudar de debate
    setCategoriaAtiva('todos');
  };

  // Função para voltar para a seleção de debates
  const voltarParaSelecao = () => {
    setTelaAtiva('selecao');
  };

  // Abrir visualizador de mídia
  const abrirVisualizador = (midia: any) => {
    setMidiaSelecionada(midia);
    setVisualizadorAtivo(true);
    document.body.style.overflow = 'hidden';
  };

  // Fechar visualizador
  const fecharVisualizador = () => {
    setVisualizadorAtivo(false);
    setMidiaSelecionada(null);
    document.body.style.overflow = 'auto';
  };

  // Navegar entre mídias
  const navegarMidia = (direcao: 'anterior' | 'proximo') => {
    const todosMateriais = [
      ...debateSelecionado.fotos,
      ...debateSelecionado.videos,
      ...debateSelecionado.documentos
    ];
    
    const indexAtual = todosMateriais.findIndex(m => m.id === midiaSelecionada.id && m.tipo === midiaSelecionada.tipo);
    
    if (direcao === 'anterior') {
      const anterior = indexAtual > 0 ? todosMateriais[indexAtual - 1] : todosMateriais[todosMateriais.length - 1];
      setMidiaSelecionada(anterior);
    } else {
      const proximo = indexAtual < todosMateriais.length - 1 ? todosMateriais[indexAtual + 1] : todosMateriais[0];
      setMidiaSelecionada(proximo);
    }
  };

  // Download de documento
  const baixarDocumento = (url: string, titulo: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = titulo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Contar materiais por tipo
  const contarMateriais = (tipo: 'fotos' | 'videos' | 'documentos') => {
    return debateSelecionado[tipo].length;
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={`${styles.materiaisContainer} ${styles[theme]} ${themeChanging ? styles.themeChanging : ''}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTop}>
            <div className={styles.title}>
              <h1 className={styles.titulo}>MATERIAIS DOS DEBATES</h1>
              <p className={styles.subtitulo}>
                Fotos, vídeos e documentos dos debates já realizados
              </p>
            </div>
            
            <button 
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        {/* Tela de Seleção de Debates */}
        {telaAtiva === 'selecao' && (
          <>
            {/* Filtros e Busca */}
            <div className={styles.filtrosContainer}>
              <div className={styles.buscaContainer}>
                <FaSearch className={styles.buscaIcon} />
                <input
                  type="text"
                  placeholder="BUSCAR DEBATES..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className={styles.buscaInput}
                />
              </div>
              
              <div className={styles.filtros}>
                <div className={styles.filtroGrupo}>
                  <FaFilter className={styles.filtroIcon} />
                  <select 
                    value={filtroAno}
                    onChange={(e) => setFiltroAno(e.target.value)}
                    className={styles.filtroSelect}
                  >
                    {anosUnicos.map(ano => (
                      <option key={ano} value={ano}>
                        {ano === 'todos' ? 'TODOS OS ANOS' : `ANO ${ano}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Lista de Debates */}
            <div className={styles.debatesGrid}>
              <h2 className={styles.selecaoTitulo}>SELECIONE UM DEBATE PARA VER OS MATERIAIS</h2>
              
              <div className={styles.debatesListSelecao}>
                {debatesFiltrados.map(debate => (
                  <div
                    key={debate.id}
                    className={styles.debateCardSelecao}
                    onClick={() => selecionarDebate(debate)}
                  >
                    <div className={styles.debateCardHeader}>
                      <h3 className={styles.debateCardTitulo}>{debate.titulo}</h3>
                      <span className={styles.debateCardData}>{debate.data}</span>
                    </div>
                    
                    <p className={styles.debateCardDescricao}>{debate.descricao}</p>
                    
                    <div className={styles.debateCardStats}>
                      <div className={styles.statItem}>
                        <FaUsers className={styles.statIcon} />
                        <span>{debate.participantes} participantes</span>
                      </div>
                      
                      <div className={styles.statItem}>
                        <FaImages className={styles.statIcon} />
                        <span>{debate.fotos.length} fotos</span>
                      </div>
                      
                      <div className={styles.statItem}>
                        <FaVideo className={styles.statIcon} />
                        <span>{debate.videos.length} vídeos</span>
                      </div>
                      
                      <div className={styles.statItem}>
                        <FaFilePdf className={styles.statIcon} />
                        <span>{debate.documentos.length} documentos</span>
                      </div>
                    </div>
                    
                    <div className={styles.debateCardFooter}>
                      <button 
                        className={styles.verMateriaisButton}
                        onClick={() => selecionarDebate(debate)}
                      >
                        VER MATERIAIS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tela de Materiais do Debate Selecionado */}
        {telaAtiva === 'materiais' && (
          <>
            {/* Cabeçalho do Debate com botão de voltar */}
            <div className={styles.materiaisHeader}>
              <button 
                className={styles.voltarButton}
                onClick={voltarParaSelecao}
              >
                <FaArrowLeft /> VOLTAR PARA LISTA DE DEBATES
              </button>
              
              <div className={styles.debateInfoSelecionado}>
                <h2 className={styles.debateTituloSelecionado}>
                  {debateSelecionado.titulo}
                </h2>
                <div className={styles.debateInfoDetalhes}>
                  <span className={styles.debateInfoItemSelecionado}>
                    <FaCalendarAlt /> REALIZADO EM {debateSelecionado.data}
                  </span>
                  <span className={styles.debateInfoItemSelecionado}>
                    <FaUsers /> {debateSelecionado.participantes} PARTICIPANTES
                  </span>
                  <p className={styles.debateDescricaoSelecionado}>
                    {debateSelecionado.descricao}
                  </p>
                </div>
              </div>
              
              <div className={styles.categoriasNavegacao}>
                <button
                  className={`${styles.categoriaButton} ${categoriaAtiva === 'todos' ? styles.ativa : ''}`}
                  onClick={() => setCategoriaAtiva('todos')}
                >
                  TODOS OS MATERIAIS
                </button>
                <button
                  className={`${styles.categoriaButton} ${categoriaAtiva === 'fotos' ? styles.ativa : ''}`}
                  onClick={() => setCategoriaAtiva('fotos')}
                >
                  FOTOS ({contarMateriais('fotos')})
                </button>
                <button
                  className={`${styles.categoriaButton} ${categoriaAtiva === 'videos' ? styles.ativa : ''}`}
                  onClick={() => setCategoriaAtiva('videos')}
                >
                  VÍDEOS ({contarMateriais('videos')})
                </button>
                <button
                  className={`${styles.categoriaButton} ${categoriaAtiva === 'documentos' ? styles.ativa : ''}`}
                  onClick={() => setCategoriaAtiva('documentos')}
                >
                  DOCUMENTOS ({contarMateriais('documentos')})
                </button>
              </div>
            </div>

            {/* Galeria de Fotos */}
            {(categoriaAtiva === 'todos' || categoriaAtiva === 'fotos') && debateSelecionado.fotos.length > 0 && (
              <section className={styles.materiaisSection}>
                <h3 className={styles.sectionTitulo}>
                  GALERIA DE FOTOS
                </h3>
                
                <div className={styles.galeriaGrid}>
                  {debateSelecionado.fotos.map(foto => (
                    <div 
                      key={foto.id}
                      className={styles.galeriaItem}
                      onClick={() => abrirVisualizador(foto)}
                    >
                      <div className={styles.galeriaImagemContainer}>
                        <img 
                          src={foto.url} 
                          alt={foto.titulo}
                          className={styles.galeriaImagem}
                        />
                        <div className={styles.galeriaOverlay}>
                          <FaExternalLinkAlt className={styles.overlayIcon} />
                        </div>
                      </div>
                      
                      <div className={styles.galeriaInfo}>
                        <h4 className={styles.galeriaTitulo}>{foto.titulo}</h4>
                        <p className={styles.galeriaDescricao}>{foto.descricao}</p>
                        <span className={styles.galeriaData}>{foto.data}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Vídeos */}
            {(categoriaAtiva === 'todos' || categoriaAtiva === 'videos') && debateSelecionado.videos.length > 0 && (
              <section className={styles.materiaisSection}>
                <h3 className={styles.sectionTitulo}>
                  VÍDEOS DO DEBATE
                </h3>
                
                <div className={styles.videosGrid}>
                  {debateSelecionado.videos.map(video => (
                    <div key={video.id} className={styles.videoCard}>
                      <div className={styles.videoPlayerContainer}>
                        <iframe
                          src={video.url}
                          title={video.titulo}
                          className={styles.videoIframe}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      
                      <div className={styles.videoInfo}>
                        <h4 className={styles.videoTitulo}>{video.titulo}</h4>
                        <p className={styles.videoDescricao}>{video.descricao}</p>
                        
                        <div className={styles.videoMeta}>
                          <span>{video.duracao}</span>
                          <span>{video.data}</span>
                        </div>
                        
                        <button 
                          className={styles.assistirButton}
                          onClick={() => abrirVisualizador(video)}
                        >
                          <FaPlayCircle /> ASSISTIR EM TELA CHEIA
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Documentos */}
            {(categoriaAtiva === 'todos' || categoriaAtiva === 'documentos') && debateSelecionado.documentos.length > 0 && (
              <section className={styles.materiaisSection}>
                <h3 className={styles.sectionTitulo}>
                  DOCUMENTOS PARA DOWNLOAD
                </h3>
                
                <div className={styles.documentosGrid}>
                  {debateSelecionado.documentos.map(documento => (
                    <div key={documento.id} className={styles.documentoCard}>
                      <div className={styles.documentoIcon}>
                        <FaFilePdf />
                      </div>
                      
                      <div className={styles.documentoInfo}>
                        <h4 className={styles.documentoTitulo}>{documento.titulo}</h4>
                        <p className={styles.documentoDescricao}>{documento.descricao}</p>
                        
                        <div className={styles.documentoMeta}>
                          <span>{documento.tamanho}</span>
                          <span>{documento.paginas} PÁGINAS</span>
                        </div>
                      </div>
                      
                      <button 
                        className={styles.downloadButton}
                        onClick={() => baixarDocumento(documento.url, documento.titulo)}
                      >
                        <FaDownload /> DOWNLOAD
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Mensagem se não houver materiais */}
            {((categoriaAtiva === 'fotos' && debateSelecionado.fotos.length === 0) ||
              (categoriaAtiva === 'videos' && debateSelecionado.videos.length === 0) ||
              (categoriaAtiva === 'documentos' && debateSelecionado.documentos.length === 0)) && (
              <div className={styles.semMateriais}>
                <p>NÃO HÁ MATERIAIS DISPONÍVEIS NESTA CATEGORIA</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Visualizador de Mídia em Tela Cheia */}
      {visualizadorAtivo && midiaSelecionada && (
        <div className={styles.visualizadorOverlay}>
          <div className={styles.visualizadorContent}>
            <button 
              className={styles.fecharVisualizador} 
              onClick={fecharVisualizador}
              aria-label="Fechar visualizador"
            >
              <FaTimes />
            </button>
            
            <div className={styles.visualizadorNavegacao}>
              <button 
                className={styles.navegacaoButton}
                onClick={() => navegarMidia('anterior')}
                aria-label="Mídia anterior"
              >
                <FaChevronLeft />
              </button>
              
              <div className={styles.visualizadorPrincipal}>
                {midiaSelecionada.tipo === 'foto' && (
                  <img 
                    src={midiaSelecionada.url} 
                    alt={midiaSelecionada.titulo}
                    className={styles.visualizadorImagem}
                  />
                )}
                
                {midiaSelecionada.tipo === 'video' && (
                  <div className={styles.visualizadorVideoContainer}>
                    <iframe
                      src={midiaSelecionada.url}
                      title={midiaSelecionada.titulo}
                      className={styles.visualizadorVideo}
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                
                {midiaSelecionada.tipo === 'pdf' && (
                  <div className={styles.visualizadorDocumento}>
                    <FaFilePdf className={styles.documentoVisualizadorIcon} />
                    <h3>{midiaSelecionada.titulo}</h3>
                    <p>{midiaSelecionada.descricao}</p>
                    <button 
                      className={styles.downloadVisualizadorButton}
                      onClick={() => baixarDocumento(midiaSelecionada.url, midiaSelecionada.titulo)}
                    >
                      <FaDownload /> DOWNLOAD ({midiaSelecionada.tamanho})
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                className={styles.navegacaoButton}
                onClick={() => navegarMidia('proximo')}
                aria-label="Próxima mídia"
              >
                <FaChevronRight />
              </button>
            </div>
            
            <div className={styles.visualizadorInfo}>
              <h3 className={styles.visualizadorTitulo}>{midiaSelecionada.titulo}</h3>
              <p className={styles.visualizadorDescricao}>{midiaSelecionada.descricao}</p>
              <div className={styles.visualizadorMeta}>
                <span>{midiaSelecionada.data}</span>
                {midiaSelecionada.duracao && (
                  <span>{midiaSelecionada.duracao}</span>
                )}
                {midiaSelecionada.tamanho && (
                  <span>{midiaSelecionada.tamanho}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}