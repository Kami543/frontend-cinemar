// frontend/src/pages/Editais.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChevronLeft,
  FaFileAlt,
  FaDownload,
  FaCalendarAlt,
  FaClock,
  FaSearch,
  FaFilter,
  FaTimes,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaSpinner,
  FaFilm,
  FaBullhorn,
  FaPenAlt,
  FaTrophy,
  FaQuestionCircle,
  FaEnvelope,
  FaPhone,
  FaInfoCircle,
} from 'react-icons/fa';
import { useTheme } from '../components/context/ThemeContext';
import styles from '../styles/Editais.module.css';

interface Edital {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'selecao' | 'chamada' | 'inscricao' | 'resultado';
  dataPublicacao: string;
  dataEncerramento: string;
  arquivoUrl: string;
  status: 'aberto' | 'encerrado' | 'em_breve';
  linkExterno?: string;
  categorias?: string[];
}

const EditaisPage = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [isLoading, setIsLoading] = useState(false);
  const [editais, setEditais] = useState<Edital[]>([
    {
      id: '1',
      titulo: 'Chamada Pública para Seleção de Filmes - Edição 2025',
      descricao: 'Seleção de curtas e longas-metragens para compor a programação do CineMar 2025. Serão aceitos filmes de todas as regiões do Brasil.',
      tipo: 'selecao',
      dataPublicacao: '10/06/2025',
      dataEncerramento: '10/08/2025',
      arquivoUrl: '/editais/chamada-filmes-2025.pdf',
      status: 'aberto',
      categorias: ['Curtas', 'Longas', 'Documentários'],
    },
    {
      id: '2',
      titulo: 'Edital de Apoio a Projetos Audiovisuais',
      descricao: 'Programa de incentivo à produção audiovisual independente no Ceará. Serão contemplados 5 projetos com verba de R$ 10.000 cada.',
      tipo: 'chamada',
      dataPublicacao: '01/06/2025',
      dataEncerramento: '30/07/2025',
      arquivoUrl: '/editais/apoio-audiovisual.pdf',
      status: 'aberto',
      categorias: ['Produção', 'Desenvolvimento'],
    },
    {
      id: '3',
      titulo: 'Inscrições para Oficinas de Cinema',
      descricao: 'Oficinas gratuitas de roteiro, direção e edição. Vagas limitadas para jovens de 16 a 29 anos.',
      tipo: 'inscricao',
      dataPublicacao: '15/05/2025',
      dataEncerramento: '15/06/2025',
      arquivoUrl: '/editais/oficinas-cinema.pdf',
      status: 'encerrado',
      categorias: ['Oficinas', 'Formação'],
    },
    {
      id: '4',
      titulo: 'Resultado Final - Bolsa de Pesquisa em Cinema',
      descricao: 'Divulgação dos selecionados para a Bolsa de Pesquisa em Cinema e Educação.',
      tipo: 'resultado',
      dataPublicacao: '20/05/2025',
      dataEncerramento: '20/05/2025',
      arquivoUrl: '/editais/resultado-bolsa.pdf',
      status: 'encerrado',
      linkExterno: 'https://docs.google.com/resultado-bolsa',
      categorias: ['Pesquisa', 'Bolsa'],
    },
    {
      id: '5',
      titulo: 'Seleção de Monitores para o CineMar 2025',
      descricao: 'Estudantes de cinema e áreas afins podem se inscrever para atuar como monitores nas sessões e eventos.',
      tipo: 'selecao',
      dataPublicacao: '25/06/2025',
      dataEncerramento: '25/07/2025',
      arquivoUrl: '/editais/selecao-monitores.pdf',
      status: 'aberto',
      categorias: ['Monitoria', 'Estágio'],
    },
    {
      id: '6',
      titulo: 'Chamada para Mostra Competitiva - 5ª Edição',
      descricao: 'Inscrições abertas para a Mostra Competitiva do CineMar. Serão selecionados 10 filmes para exibição e premiação.',
      tipo: 'chamada',
      dataPublicacao: '05/06/2025',
      dataEncerramento: '05/09/2025',
      arquivoUrl: '/editais/mostra-competitiva.pdf',
      status: 'aberto',
      linkExterno: 'https://forms.google.com/mostra-competitiva',
      categorias: ['Competitiva', 'Premiação'],
    },
    {
      id: '7',
      titulo: 'Edital de Ocupação do Espaço CineMar',
      descricao: 'Artistas e coletivos podem solicitar o uso do espaço para exibições, debates e oficinas.',
      tipo: 'chamada',
      dataPublicacao: '01/04/2025',
      dataEncerramento: '01/06/2025',
      arquivoUrl: '/editais/ocupacao-espaco.pdf',
      status: 'encerrado',
      categorias: ['Ocupação', 'Eventos'],
    },
    {
      id: '8',
      titulo: 'Edital de Fomento ao Curta-Metragem',
      descricao: 'Edital de fomento para produção de curtas-metragens. Inscrições abertas em breve.',
      tipo: 'chamada',
      dataPublicacao: '30/06/2025',
      dataEncerramento: '30/09/2025',
      arquivoUrl: '',
      status: 'em_breve',
      categorias: ['Fomento', 'Produção'],
    },
  ]);

  // Filtrar editais
  const editaisFiltrados = editais.filter(edital => {
    const matchSearch = edital.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       edital.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filterTipo === 'todos' || edital.tipo === filterTipo;
    const matchStatus = filterStatus === 'todos' || edital.status === filterStatus;
    return matchSearch && matchTipo && matchStatus;
  });

  const getTipoLabel = (tipo: string) => {
    const tipos = {
      selecao: 'Seleção',
      chamada: 'Chamada',
      inscricao: 'Inscrição',
      resultado: 'Resultado',
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'selecao': return <FaFilm />;
      case 'chamada': return <FaBullhorn />;
      case 'inscricao': return <FaPenAlt />;
      case 'resultado': return <FaTrophy />;
      default: return <FaFileAlt />;
    }
  };

  const getStatusLabel = (status: string) => {
    const statuses = {
      aberto: 'Aberto',
      encerrado: 'Encerrado',
      em_breve: 'Em Breve',
    };
    return statuses[status as keyof typeof statuses] || status;
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'aberto': return styles.statusAberto;
      case 'encerrado': return styles.statusEncerrado;
      case 'em_breve': return styles.statusEmBreve;
      default: return '';
    }
  };

  const handleDownload = (edital: Edital) => {
    if (edital.linkExterno) {
      window.open(edital.linkExterno, '_blank');
    } else if (edital.arquivoUrl) {
      alert(`Download do arquivo: ${edital.arquivoUrl}`);
    }
  };

  const tiposDisponiveis = ['todos', ...new Set(editais.map(e => e.tipo))];
  const statusDisponiveis = ['todos', ...new Set(editais.map(e => e.status))];

  const stats = {
    total: editais.length,
    abertos: editais.filter(e => e.status === 'aberto').length,
    encerrados: editais.filter(e => e.status === 'encerrado').length,
    emBreve: editais.filter(e => e.status === 'em_breve').length,
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterTipo('todos');
    setFilterStatus('todos');
  };

  return (
    <div className={`${styles.page} ${isDarkMode ? styles.dark : ''}`}>
      
      {/* HEADER */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <Link to="/" className={styles.backLink}>
            <FaChevronLeft aria-hidden="true" /> Voltar para Início
          </Link>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <FaFileAlt aria-hidden="true" /> Transparência
            </div>
            <h1 className={styles.heroTitle}>Editais e Chamadas Públicas</h1>
            <p className={styles.heroSubtitle}>
              Acompanhe as oportunidades de seleção, chamadas, inscrições e resultados do CineMar.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{stats.total}</span>
                <span className={styles.statLabel}>Total</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{stats.abertos}</span>
                <span className={styles.statLabel}>Abertos</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{stats.encerrados}</span>
                <span className={styles.statLabel}>Encerrados</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{stats.emBreve}</span>
                <span className={styles.statLabel}>Em Breve</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* FILTROS */}
      <div className={styles.filtersSection}>
        <div className={styles.filtersContainer}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Buscar por título ou descrição..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button className={styles.clearSearch} onClick={() => setSearchTerm('')}>
                <FaTimes />
              </button>
            )}
          </div>

          <div className={styles.filtersRow}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                <FaFilter /> Tipo
              </label>
              <div className={styles.filterButtons}>
                {tiposDisponiveis.map(tipo => (
                  <button
                    key={tipo}
                    className={`${styles.filterBtn} ${filterTipo === tipo ? styles.active : ''}`}
                    onClick={() => setFilterTipo(tipo)}
                  >
                    {tipo === 'todos' ? 'Todos' : getTipoLabel(tipo)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                <FaClock /> Status
              </label>
              <div className={styles.filterButtons}>
                {statusDisponiveis.map(status => (
                  <button
                    key={status}
                    className={`${styles.filterBtn} ${filterStatus === status ? styles.active : ''}`}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status === 'todos' ? 'Todos' : getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {(searchTerm || filterTipo !== 'todos' || filterStatus !== 'todos') && (
            <div className={styles.activeFilters}>
              <span>Filtros ativos:</span>
              <button onClick={clearFilters} className={styles.clearFiltersBtn}>
                <FaTimes /> Limpar todos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* LISTA DE EDITAIS */}
      <main className={styles.mainContent}>
        <div className={styles.editaisGrid}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <FaSpinner className={styles.loadingSpinner} />
              <p>Carregando editais...</p>
            </div>
          ) : editaisFiltrados.length === 0 ? (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>
                <FaFileAlt />
              </div>
              <h3>Nenhum edital encontrado</h3>
              <p>Tente alterar os filtros ou o termo de busca</p>
              <button onClick={clearFilters} className={styles.noResultsBtn}>
                Limpar filtros
              </button>
            </div>
          ) : (
            editaisFiltrados.map(edital => (
              <div key={edital.id} className={`${styles.editalCard} ${isDarkMode ? styles.darkCard : ''}`}>
                <div className={styles.editalHeader}>
                  <div className={styles.editalTipo}>
                    <span className={styles.tipoIcon}>{getTipoIcon(edital.tipo)}</span>
                    <span className={styles.tipoLabel}>{getTipoLabel(edital.tipo)}</span>
                  </div>
                  <div className={`${styles.editalStatus} ${getStatusClass(edital.status)}`}>
                    {getStatusLabel(edital.status)}
                  </div>
                </div>

                <div className={styles.editalContent}>
                  <h2 className={styles.editalTitulo}>{edital.titulo}</h2>
                  <p className={styles.editalDescricao}>{edital.descricao}</p>

                  <div className={styles.editalDates}>
                    <div className={styles.dateItem}>
                      <FaCalendarAlt className={styles.dateIcon} />
                      <div>
                        <strong>Publicação</strong>
                        <span>{edital.dataPublicacao}</span>
                      </div>
                    </div>
                    <div className={styles.dateItem}>
                      <FaClock className={styles.dateIcon} />
                      <div>
                        <strong>Encerramento</strong>
                        <span>{edital.dataEncerramento}</span>
                      </div>
                    </div>
                  </div>

                  {edital.categorias && edital.categorias.length > 0 && (
                    <div className={styles.editalCategorias}>
                      {edital.categorias.map((cat, i) => (
                        <span key={i} className={styles.categoriaTag}>{cat}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.editalFooter}>
                  <button
                    className={`${styles.downloadBtn} ${edital.status !== 'aberto' ? styles.disabled : ''}`}
                    onClick={() => handleDownload(edital)}
                    disabled={edital.status !== 'aberto' && !edital.linkExterno}
                  >
                    {edital.linkExterno ? (
                      <>
                        <FaExternalLinkAlt />
                        Acessar
                      </>
                    ) : (
                      <>
                        <FaDownload />
                        {edital.status === 'aberto' ? 'Baixar Edital' : 'Ver Detalhes'}
                      </>
                    )}
                  </button>
                  {edital.status === 'aberto' && (
                    <button className={styles.inscreverBtn}>
                      <FaCheckCircle />
                      Inscrever-se
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* INFORMAÇÕES ADICIONAIS */}
        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3><FaInfoCircle /> Como participar?</h3>
            <p>
              1. Leia atentamente o edital de seu interesse<br />
              2. Verifique os prazos e requisitos<br />
              3. Prepare a documentação necessária<br />
              4. Envie sua inscrição conforme instruções<br />
              5. Acompanhe os resultados no site
            </p>
          </div>
          <div className={styles.infoCard}>
            <h3><FaQuestionCircle /> Dúvidas?</h3>
            <p>
              Entre em contato pelo e-mail:<br />
              <strong>editais@cinemar.com.br</strong><br />
              ou pelo telefone:<br />
              <strong>(88) 9xxxx-xxxx</strong>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditaisPage;