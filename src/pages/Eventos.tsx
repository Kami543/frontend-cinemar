import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaLeaf,
  FaBook,
  FaHandsHelping,
  FaVoteYea,
  FaArrowRight,
  FaArrowLeft,
  FaFilter,
  FaSearch,
  FaSun,
  FaMoon,
  FaStar,
  FaClock,
  FaCheckCircle,
  FaCalendarPlus
} from 'react-icons/fa';
import styles from '../styles/Eventos.module.css';

interface Evento {
  id: number;
  titulo: string;
  data: string;
  dataCompleta: string;
  local: string;
  descricao: string;
  tipo: 'movimento-social' | 'plebiscito' | 'sustentabilidade' | 'evento-local' | 'cultural';
  status: 'ativo' | 'realizado' | 'futuro';
  imagem?: string;
  parceiros: string[];
  link?: string;
  importancia: 'alta' | 'media' | 'baixa';
}

function Eventos() {
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
  
  const [filtroAtivo, setFiltroAtivo] = useState<string>('todos');
  const [busca, setBusca] = useState<string>('');

  // Aplica o modo escuro ao carregar e quando mudar
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('darkMode');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('darkMode');
      root.style.colorScheme = 'light';
    }
    
    // Salva a preferência
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const eventos: Evento[] = [
    {
      id: 1,
      titulo: 'Novembro Negro - Consciência Negra',
      data: 'Novembro 2024',
      dataCompleta: '20 de Novembro de 2024',
      local: 'Escola EEEP Mess & Comunidade',
      descricao: 'Série de atividades culturais e educativas em celebração ao Dia da Consciência Negra. Inclui rodas de conversa, exibições de filmes afrocentrados, oficinas de dança e música afro-brasileira.',
      tipo: 'cultural',
      status: 'realizado',
      parceiros: ['EEEP Mess', 'Movimento Negro de Camocim', 'Secretaria de Cultura'],
      importancia: 'alta',
      link: '/novembro-negro'
    },
    {
      id: 2,
      titulo: 'Plebiscito Popular sobre Reforma Agrária',
      data: 'Outubro 2024',
      dataCompleta: '15 de Outubro de 2024',
      local: 'Praça Central de Camocim',
      descricao: 'Consulta popular organizada por movimentos sociais para debater e votar propostas sobre reforma agrária e direitos dos trabalhadores rurais.',
      tipo: 'plebiscito',
      status: 'realizado',
      parceiros: ['MST', 'CPT', 'Sindicato dos Trabalhadores Rurais'],
      importancia: 'alta',
      link: '/plebiscito-reforma-agraria'
    },
    {
      id: 3,
      titulo: 'Dia do Livro - EEEP Mess',
      data: 'Abril 2025',
      dataCompleta: '23 de Abril de 2025',
      local: 'Escola EEEP Mess',
      descricao: 'Celebração o Dia Mundial do Livro com maratona de leitura, troca de livros, encontro com autores locais e oficinas de produção literária.',
      tipo: 'evento-local',
      status: 'ativo',
      parceiros: ['EEEP Mess', 'Biblioteca Municipal', 'Editora Independente'],
      importancia: 'alta',
      link: '/dia-do-livro'
    },
    {
      id: 4,
      titulo: 'Movimento pela Democratização da Comunicação',
      data: 'Março 2025',
      dataCompleta: '15 de Março de 2025',
      local: 'Sindicato dos Pescadores',
      descricao: 'Encontro para discutir a democratização dos meios de comunicação e criar uma rádio comunitária em Camocim.',
      tipo: 'movimento-social',
      status: 'ativo',
      parceiros: ['Rede Brasil de Comunicação', 'FNDC', 'Sindicato dos Jornalistas'],
      importancia: 'alta',
      link: '/democratizacao-comunicacao'
    },
    {
      id: 5,
      titulo: 'Campanha Lixo Zero Camocim',
      data: 'Janeiro - Dezembro 2025',
      dataCompleta: 'Todo o ano de 2025',
      local: 'Toda a cidade de Camocim',
      descricao: 'Projeto de educação ambiental e coleta seletiva que visa reduzir o lixo na cidade através de mutirões de limpeza, oficinas de compostagem e reciclagem.',
      tipo: 'sustentabilidade',
      status: 'ativo',
      parceiros: ['Secretaria de Meio Ambiente', 'Cooperativa de Catadores', 'Escolas Municipais'],
      importancia: 'alta',
      link: '/lixo-zero'
    },
    {
      id: 6,
      titulo: 'Proteção dos Manguezais de Camocim',
      data: 'Fevereiro 2025',
      dataCompleta: '5 de Fevereiro de 2025',
      local: 'Manguezais da Zona Costeira',
      descricao: 'Ação de preservação dos manguezais com plantio de mudas, monitoramento da fauna e educação ambiental para pescadores e comunidade.',
      tipo: 'sustentabilidade',
      status: 'ativo',
      parceiros: ['IBAMA', 'Universidade Federal do Ceará', 'Colônia de Pescadores'],
      importancia: 'media',
      link: '/manguezais-camocim'
    },
    {
      id: 7,
      titulo: 'Movimento por Moradia Digna',
      data: 'Maio 2025',
      dataCompleta: '1º de Maio de 2025',
      local: 'Assentamentos Urbanos de Camocim',
      descricao: 'Luta por políticas públicas de habitação e regularização fundiária para famílias em situação de vulnerabilidade social.',
      tipo: 'movimento-social',
      status: 'futuro',
      parceiros: ['MTST', 'Associação de Moradores', 'Defensoria Pública'],
      importancia: 'media',
      link: '/moradia-digna'
    },
    {
      id: 8,
      titulo: 'Feira Agroecológica Solidária',
      data: 'Todo Sábado',
      dataCompleta: 'Sábados, das 6h às 12h',
      local: 'Praça do Mercado Municipal',
      descricao: 'Feira permanente de produtos agroecológicos direto do produtor rural, promovendo alimentação saudável e comércio justo.',
      tipo: 'sustentabilidade',
      status: 'ativo',
      parceiros: ['Agricultores Familiares', 'CONSEA', 'Feira da Reforma Agrária'],
      importancia: 'media',
      link: '/feira-agroecologica'
    },
    {
      id: 9,
      titulo: 'Plebiscito pela Taxação de Grandes Fortunas',
      data: 'Setembro 2025',
      dataCompleta: '7 de Setembro de 2025',
      local: 'Vários pontos de coleta na cidade',
      descricao: 'Consulta popular sobre a implementação de impostos progressivos para financiar políticas públicas de educação e saúde.',
      tipo: 'plebiscito',
      status: 'futuro',
      parceiros: ['Campanha Tributar os Super-Ricos', 'Centrais Sindicais', 'Movimentos Estudantis'],
      importancia: 'alta',
      link: '/taxacao-fortunas'
    },
    {
      id: 10,
      titulo: 'Festival de Cinema Estudantil',
      data: 'Outubro 2025',
      dataCompleta: '15-20 de Outubro de 2025',
      local: 'EEEP Mess e Espaços Culturais',
      descricao: 'Mostra competitiva de filmes produzidos por estudantes das escolas públicas de Camocim, com oficinas de audiovisual.',
      tipo: 'cultural',
      status: 'futuro',
      parceiros: ['EEEP Mess', 'Secretaria de Educação', 'CineMar'],
      importancia: 'media',
      link: '/festival-cinema-estudantil'
    }
  ];

  const tiposEvento = [
    { id: 'todos', label: 'Todos', icone: FaCalendarAlt, cor: '#dc2626' },
    { id: 'movimento-social', label: 'Sociais', icone: FaUsers, cor: '#3b82f6' },
    { id: 'plebiscito', label: 'Plebiscitos', icone: FaVoteYea, cor: '#8b5cf6' },
    { id: 'sustentabilidade', label: 'Sustentabilidade', icone: FaLeaf, cor: '#10b981' },
    { id: 'evento-local', label: 'Locais', icone: FaMapMarkerAlt, cor: '#f59e0b' },
    { id: 'cultural', label: 'Culturais', icone: FaBook, cor: '#ec4899' }
  ];

  const eventosFiltrados = eventos.filter(evento => {
    const passaFiltro = filtroAtivo === 'todos' || evento.tipo === filtroAtivo;
    const passaBusca = !busca || 
      evento.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      evento.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      evento.local.toLowerCase().includes(busca.toLowerCase());
    
    return passaFiltro && passaBusca;
  });

  const getIconePorTipo = (tipo: string) => {
    switch(tipo) {
      case 'movimento-social': return <FaUsers />;
      case 'plebiscito': return <FaVoteYea />;
      case 'sustentabilidade': return <FaLeaf />;
      case 'evento-local': return <FaMapMarkerAlt />;
      case 'cultural': return <FaBook />;
      default: return <FaCalendarAlt />;
    }
  };

  const getIconePorStatus = (status: string) => {
    switch(status) {
      case 'ativo': return <FaClock />;
      case 'realizado': return <FaCheckCircle />;
      case 'futuro': return <FaCalendarPlus />;
      default: return <FaCalendarAlt />;
    }
  };

  const getCorStatus = (status: string) => {
    switch(status) {
      case 'ativo': return '#10b981';
      case 'realizado': return '#6b7280';
      case 'futuro': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getTextoStatus = (status: string) => {
    switch(status) {
      case 'ativo': return 'Em Andamento';
      case 'realizado': return 'Realizado';
      case 'futuro': return 'Em Breve';
      default: return status;
    }
  };

  const getCorImportancia = (importancia: string) => {
    switch(importancia) {
      case 'alta': return '#dc2626';
      case 'media': return '#f59e0b';
      case 'baixa': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className={`${styles.eventosPage} ${isDarkMode ? styles.darkMode : ''}`}>
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
                aria-label={isDarkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
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
              <FaHandsHelping className={styles.titleIcon} />
              Eventos e Mobilizações
            </h1>
            <p className={styles.heroSubtitle}>
              O CineMar apoia e participa ativamente de diversos movimentos sociais, plebiscitos, 
              pautas sustentáveis e eventos culturais em Camocim e região.
            </p>
          </div>
        </div>
      </header>

      {/* Filtros e Busca */}
      <div className={`${styles.filtersSection} ${isDarkMode ? styles.darkFilters : ''}`}>
        <div className={styles.filtersContent}>
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar eventos por título, local ou descrição..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className={`${styles.searchInput} ${isDarkMode ? styles.darkInput : ''}`}
              />
            </div>
            
            <div className={styles.filtersInfo}>
              <FaFilter className={styles.filterIcon} />
              <span>Filtrar por categoria:</span>
            </div>
            
            <div className={styles.tipoFilters}>
              {tiposEvento.map(tipo => {
                const Icone = tipo.icone;
                return (
                  <button
                    key={tipo.id}
                    className={`${styles.tipoFilterBtn} ${filtroAtivo === tipo.id ? styles.active : ''} ${isDarkMode ? styles.darkFilterBtn : ''}`}
                    onClick={() => setFiltroAtivo(tipo.id)}
                    style={filtroAtivo === tipo.id ? { borderColor: tipo.cor, color: tipo.cor } : {}}
                  >
                    <Icone />
                    <span>{tipo.label}</span>
                    {filtroAtivo === tipo.id && (
                      <div 
                        className={styles.activeIndicator} 
                        style={{ background: tipo.cor }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className={`${styles.mainContent} ${isDarkMode ? styles.darkMain : ''}`}>
        <div className={styles.contentWrapper}>
          {/* Grade de Eventos */}
          {eventosFiltrados.length === 0 ? (
            <div className={styles.noResults}>
              <div className={`${styles.noResultsIcon} ${isDarkMode ? styles.darkNoResultsIcon : ''}`}>
                <FaSearch />
              </div>
              <h3 className={isDarkMode ? styles.darkText : ''}>Nenhum evento encontrado</h3>
              <p className={isDarkMode ? styles.darkTextSecondary : ''}>
                Tente alterar os filtros ou termos de busca
              </p>
              <button 
                className={styles.clearFiltersBtn}
                onClick={() => {
                  setFiltroAtivo('todos');
                  setBusca('');
                }}
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            <div className={styles.eventsGrid}>
              {eventosFiltrados.map(evento => (
                <div key={evento.id} className={`${styles.eventoCard} ${isDarkMode ? styles.darkCard : ''}`}>
                  {/* Cabeçalho do Card */}
                  <div className={styles.eventoCardHeader}>
                    <div className={styles.headerLeft}>
                      <div className={`${styles.eventoTipo} ${isDarkMode ? styles.darkTextSecondary : ''}`}>
                        <div className={styles.tipoContent}>
                          {getIconePorTipo(evento.tipo)}
                          <span className={styles.tipoLabel}>
                            {tiposEvento.find(t => t.id === evento.tipo)?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.headerRight}>
                      <div 
                        className={`${styles.eventoStatus} ${styles[evento.status]}`}
                        style={{ 
                          background: `${getCorStatus(evento.status)}15`,
                          color: getCorStatus(evento.status)
                        }}
                      >
                        {getIconePorStatus(evento.status)}
                        <span className={styles.statusText}>
                          {getTextoStatus(evento.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Conteúdo do Card */}
                  <div className={styles.eventoCardContent}>
                    <h3 className={`${styles.eventoTitulo} ${isDarkMode ? styles.darkText : ''}`}>
                      {evento.titulo}
                    </h3>
                    
                    <div className={styles.eventoMetaCompact}>
                      <div className={`${styles.metaItemCompact} ${isDarkMode ? styles.darkMetaItem : ''}`}>
                        <FaCalendarAlt className={styles.metaIconCompact} />
                        <span className={styles.metaValueCompact}>{evento.data}</span>
                      </div>
                      
                      <div className={`${styles.metaItemCompact} ${isDarkMode ? styles.darkMetaItem : ''}`}>
                        <FaMapMarkerAlt className={styles.metaIconCompact} />
                        <span className={styles.metaValueCompact}>{evento.local}</span>
                      </div>
                    </div>
                    
                    <p className={`${styles.eventoDescricao} ${isDarkMode ? styles.darkTextSecondary : ''}`}>
                      {evento.descricao}
                    </p>
                    
                    {/* Rodapé do Card */}
                    <div className={styles.eventoCardFooterCompact}>
                      {evento.link && (
                        <Link to={evento.link} className={styles.eventoLinkCompact}>
                          <span>Detalhes</span>
                          <FaArrowRight className={styles.linkIconCompact} />
                        </Link>
                      )}
                      
                      {/* Importância */}
                      <div className={styles.importanciaBadgeCompact}>
                        <span 
                          className={styles.importanciaTextCompact}
                          style={{ 
                            background: `${getCorImportancia(evento.importancia)}15`,
                            color: getCorImportancia(evento.importancia)
                          }}
                        >
                          <FaStar className={styles.importanciaIconCompact} />
                          {evento.importancia === 'alta' ? 'Alta' :
                           evento.importancia === 'media' ? 'Média' :
                           'Baixa'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className={styles.ctaSection}>
            <div className={`${styles.ctaCard} ${isDarkMode ? styles.darkCard : ''}`}>
              <div className={styles.ctaContent}>
                <h2 className={styles.ctaTitle}>
                  <FaHandsHelping className={styles.ctaTitleIcon} />
                  Quer propor um evento?
                </h2>
                <p className={styles.ctaText}>
                  O CineMar está sempre aberto a novas parcerias e apoios a eventos que 
                  contribuam para o desenvolvimento social, cultural e ambiental de Camocim.
                </p>
                <div className={styles.ctaActions}>
                  <Link to="/contato" className={styles.ctaButton}>
                    <FaUsers className={styles.ctaButtonIcon} /> 
                    Propor Parceria
                  </Link>
                  <Link to="/sobre-nos" className={styles.ctaButtonSecondary}>
                    Conheça Nossos Critérios
                    <FaArrowRight className={styles.ctaButtonIcon} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Eventos;