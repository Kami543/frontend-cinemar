import { useState } from 'react';
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
  FaRegCalendarCheck,
  FaClock,
  FaSun,
  FaMoon
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [filtroAtivo, setFiltroAtivo] = useState<string>('todos');
  const [busca, setBusca] = useState<string>('');

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
      descricao: 'Celebração do Dia Mundial do Livro com maratona de leitura, troca de livros, encontro com autores locais e oficinas de produção literária.',
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
    },
    {
      id: 11,
      titulo: 'Mutirão de Limpeza das Praias',
      data: 'Janeiro 2025',
      dataCompleta: '18 de Janeiro de 2025',
      local: 'Praias de Camocim',
      descricao: 'Ação comunitária para retirada de resíduos sólidos das praias, com educação ambiental sobre impacto do lixo nos ecossistemas marinhos.',
      tipo: 'sustentabilidade',
      status: 'realizado',
      parceiros: ['Surfistas de Camocim', 'Projeto Tamar', 'Comunidade Costeira'],
      importancia: 'media',
      link: '/limpeza-praias'
    },
    {
      id: 12,
      titulo: 'Marcha das Mulheres de Camocim',
      data: 'Março 2025',
      dataCompleta: '8 de Março de 2025',
      local: 'Centro de Camocim',
      descricao: 'Marcha pelo Dia Internacional da Mulher, com pautas específicas da realidade local: combate à violência, direitos reprodutivos e igualdade salarial.',
      tipo: 'movimento-social',
      status: 'futuro',
      parceiros: ['Coletivo de Mulheres', 'Fórum de Enfrentamento à Violência', 'Sindicato das Trabalhadoras Domésticas'],
      importancia: 'alta',
      link: '/marcha-mulheres'
    }
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const tiposEvento = [
    { id: 'todos', label: 'Todos os Eventos', icone: FaCalendarAlt, cor: '#dc2626' },
    { id: 'movimento-social', label: 'Movimentos Sociais', icone: FaUsers, cor: '#3b82f6' },
    { id: 'plebiscito', label: 'Plebiscitos Populares', icone: FaVoteYea, cor: '#8b5cf6' },
    { id: 'sustentabilidade', label: 'Sustentabilidade', icone: FaLeaf, cor: '#10b981' },
    { id: 'evento-local', label: 'Eventos Locais', icone: FaMapMarkerAlt, cor: '#f59e0b' },
    { id: 'cultural', label: 'Eventos Culturais', icone: FaBook, cor: '#ec4899' }
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

  return (
    <div className={`${styles.eventosPage} ${isDarkMode ? styles.dark : ''}`}>
      {/* Header */}
      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <div className={styles.breadcrumb}>
              <Link to="/" className={styles.breadcrumbLink}>
                <FaArrowLeft /> Voltar para Início
              </Link>
            </div>
            <button 
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={isDarkMode ? "Alternar para tema claro" : "Alternar para tema escuro"}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
              <span>{isDarkMode ? "Tema Claro" : "Tema Escuro"}</span>
            </button>
          </div>
          
          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>
              <FaHandsHelping className={styles.titleIcon} />
              EVENTOS E MOBILIZAÇÕES
            </h1>
            <p className={styles.heroSubtitle}>
              O CineMar apoia e participa ativamente de diversos movimentos sociais, plebiscitos, 
              pautas sustentáveis e eventos culturais em Camocim e região.
            </p>
          </div>
        </div>
      </header>

      {/* Filtros e Busca */}
      <div className={styles.filtersSection}>
        <div className={styles.filtersContent}>
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar eventos por título, local ou descrição..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className={styles.searchInput}
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
                    className={`${styles.tipoFilterBtn} ${filtroAtivo === tipo.id ? styles.active : ''}`}
                    onClick={() => setFiltroAtivo(tipo.id)}
                    style={{ borderColor: tipo.cor }}
                  >
                    <Icone />
                    <span>{tipo.label}</span>
                    {filtroAtivo === tipo.id && (
                      <div className={styles.activeIndicator} style={{ backgroundColor: tipo.cor }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className={styles.mainContent}>
        {/* Todos os Eventos */}
        <div className={styles.allEvents}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <FaCalendarAlt className={styles.sectionTitleIcon} />
              Todos os Eventos
              <span className={styles.eventosCount}>({eventosFiltrados.length})</span>
            </h2>
          </div>
          
          {eventosFiltrados.length === 0 ? (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>
                <FaSearch />
              </div>
              <h3>Nenhum evento encontrado</h3>
              <p>Tente alterar os filtros ou termos de busca</p>
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
                <div key={evento.id} className={styles.eventoCard}>
                  <div className={styles.eventoCardHeader}>
                    <div className={styles.eventoCardTipo}>
                      {getIconePorTipo(evento.tipo)}
                      <span>{tiposEvento.find(t => t.id === evento.tipo)?.label}</span>
                    </div>
                    <div className={`${styles.eventoCardStatus} ${styles[evento.status]}`}>
                      {getTextoStatus(evento.status)}
                    </div>
                  </div>
                  
                  <div className={styles.eventoCardContent}>
                    <h3 className={styles.eventoCardTitulo}>{evento.titulo}</h3>
                    
                    <div className={styles.eventoCardMeta}>
                      <div className={styles.metaItem}>
                        <FaCalendarAlt className={styles.metaItemIcon} />
                        <span className={styles.metaItemText}>{evento.dataCompleta}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <FaMapMarkerAlt className={styles.metaItemIcon} />
                        <span className={styles.metaItemText}>{evento.local}</span>
                      </div>
                    </div>
                    
                    <p className={styles.eventoCardDescricao}>
                      {evento.descricao}
                    </p>
                    
                    <div className={styles.eventoCardParceiros}>
                      <div className={styles.parceirosPreview}>
                        {evento.parceiros.slice(0, 3).map((parceiro, index) => (
                          <span key={index} className={styles.parceiroTag}>{parceiro}</span>
                        ))}
                        {evento.parceiros.length > 3 && (
                          <span className={styles.moreParceiros}>+{evento.parceiros.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.eventoCardFooter}>
                    {evento.link && (
                      <Link to={evento.link} className={styles.eventoCardLink}>
                        Detalhes <FaArrowRight className={styles.eventoCardLinkIcon} />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className={styles.ctaSection}>
          <div className={styles.ctaCard}>
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
                  <FaUsers className={styles.ctaButtonIcon} /> Propor Parceria
                </Link>
                <Link to="/sobre-nos" className={styles.ctaButtonSecondary}>
                  <FaArrowRight className={styles.ctaButtonSecondaryIcon} /> Conheça Nossos Critérios
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Eventos;