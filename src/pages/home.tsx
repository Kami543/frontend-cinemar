import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaArrowRight, 
  FaFilm, 
  FaUsers, 
  FaHeart,
  FaStar,
  FaQuoteRight,
  FaBookOpen,
  FaPlayCircle,
  FaUser,
  FaMap,
  FaBuilding,
  FaHandshake,
  FaFire,
  FaHeadphones,
  FaTag,
  FaSun,
  FaMoon,
  FaPlay,
  FaComments,
  FaAngleRight,
  FaRegCircle
} from 'react-icons/fa';
import cinemarLogo from '../images/cinemar-logo.png';
import Corra from '../images/filmes/Corra.jpg';
import AgenteSecreto from '../images/filmes/O-agente-secreto.jpg';
import styles from '../styles/HomePage.module.css';

interface Filme {
  id: number;
  title: string;
  director: string;
  year: number;
  poster: string;
  genre: string;
  duration: string;
  rating: number;
  description: string;
  date: string;
  status: 'Realizado' | 'Próximo';
  highlight: boolean;
  views?: number;
}

function HomePage() {
  const [ultimoFilme, setUltimoFilme] = useState<Filme | null>(null);
  const [proximoFilme, setProximoFilme] = useState<Filme | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('sobre');

  useEffect(() => {
    const loadData = () => {
      const filmesData: Filme[] = [
        { 
          id: 8, 
          title: 'Corra!', 
          director: 'Jordan Peele',
          year: 2017,
          poster: Corra, 
          genre: 'Terror/Suspense', 
          duration: '104 min', 
          rating: 4.8,
          description: 'Chris, um jovem fotógrafo negro, visita a família de sua namorada branca pela primeira vez. O que começa como um fim de semana tenso se transforma em um pesadelo psicológico perturbador que revela preconceitos e tensões raciais profundamente enraizadas na sociedade. Uma obra-prima do terror social que desafia convenções e provoca reflexões urgentes sobre identidade e relações interraciais.',
          date: '23 de Novembro, 2024',
          status: 'Realizado',
          highlight: false,
          views: 4120
        },
        { 
          id: 12, 
          title: 'O Agente Secreto', 
          director: 'Kleber Mendonça Filho',
          year: 2025,
          poster: AgenteSecreto, 
          genre: 'Thriller Político/Drama', 
          duration: '158 min', 
          rating: 4.4,
          description: 'Durante a ditadura militar brasileira, o ex-professor Armando retorna a Recife em busca de refúgio, mas se vê perseguido por um passado político violento e envolto em uma teia de corrupção e segredos. O filme explora as cicatrizes políticas do Brasil através de uma narrativa tensa que mistura drama pessoal com crítica social, questionando os limites entre memória, esquecimento e justiça.',
          date: '6 de Novembro, 2025',
          status: 'Próximo',
          highlight: true,
          views: 0
        }
      ];
      
      const realizados = filmesData.filter(f => f.status === 'Realizado');
      if (realizados.length > 0) {
        const ultimo = realizados.reduce((prev, current) => 
          prev.id > current.id ? prev : current
        );
        setUltimoFilme(ultimo);
      }
      
      const proximos = filmesData.filter(f => f.status === 'Próximo');
      if (proximos.length > 0) {
        setProximoFilme(proximos[0]);
      }
      
      setIsLoading(false);
    };

    setTimeout(loadData, 500);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  if (isLoading) {
    return (
      <div className={`${styles.homePage} ${isDarkMode ? styles.dark : ''}`}>
        <div className={styles.loadingContainer}>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.homePage} ${isDarkMode ? styles.dark : ''}`}>
      {/* Hero Section */}
      <header className={styles.heroHeader}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            {/* Logo menor e Tema Toggle */}
            <div className={styles.heroHeaderTop}>
              <div className={styles.logoContainer}>
                <img src={cinemarLogo} alt="CineMar Logo" className={styles.logo} />
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
                <FaQuoteRight className={styles.titleIcon} />
                PORQUE O CINEMA É UM ENCONTRO
              </h1>
              <p className={styles.heroSubtitle}>
                CineMar • Onde o filme é só o começo
              </p>
            </div>

            {/* Stats Simples */}
            <div className={styles.statsContainer}>
              <div className={styles.statItem}>
                <FaFilm className={styles.statIcon} />
                <div className={styles.statContent}>
                  <span className={styles.statValue}>12</span>
                  <span className={styles.statLabel}>Filmes</span>
                </div>
              </div>
              <div className={styles.statItem}>
                <FaUsers className={styles.statIcon} />
                <div className={styles.statContent}>
                  <span className={styles.statValue}>100+</span>
                  <span className={styles.statLabel}>Participantes</span>
                </div>
              </div>
              <div className={styles.statItem}>
                <FaHeadphones className={styles.statIcon} />
                <div className={styles.statContent}>
                  <span className={styles.statValue}>8</span>
                  <span className={styles.statLabel}>Playlists</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navegação por Categorias */}
      <div className={styles.categoriesNavigation}>
        <div className={styles.container}>
          <div className={styles.categoryFilters}>
            <button 
              className={`${styles.categoryFilterBtn} ${activeCategory === 'sobre' ? styles.active : ''}`}
              onClick={() => handleCategoryClick('sobre')}
            >
              <FaBookOpen className={styles.categoryIcon} />
              <span>Sobre Nós</span>
            </button>
            <button 
              className={`${styles.categoryFilterBtn} ${activeCategory === 'sessoes' ? styles.active : ''}`}
              onClick={() => handleCategoryClick('sessoes')}
            >
              <FaCalendarAlt className={styles.categoryIcon} />
              <span>Sessões</span>
            </button>
            <button 
              className={`${styles.categoryFilterBtn} ${activeCategory === 'playlists' ? styles.active : ''}`}
              onClick={() => handleCategoryClick('playlists')}
            >
              <FaHeadphones className={styles.categoryIcon} />
              <span>Playlists</span>
            </button>
            <button 
              className={`${styles.categoryFilterBtn} ${activeCategory === 'local' ? styles.active : ''}`}
              onClick={() => handleCategoryClick('local')}
            >
              <FaMapMarkerAlt className={styles.categoryIcon} />
              <span>Local</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Grid Principal */}
          <div className={styles.mainGrid}>
            {/* Coluna Esquerda: Sobre o CineMar */}
            <div className={styles.leftColumn}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>
                    <h2>
                      <FaBookOpen className={styles.cardIcon} />
                      O CINEMAR: ESPAÇO DE ENCONTRO E TRANSFORMAÇÃO
                    </h2>
                    <p className={styles.cardSubtitle}>
                      Comunidade Cinematográfica desde 2023
                    </p>
                  </div>
                  <div className={styles.curatorBadge}>
                    <FaHeart /> Comunidade Ativa
                  </div>
                </div>
                
                <div className={styles.cardContent}>
                  <div className={styles.sectionBlock}>
                    <h3 className={styles.sectionTitle}>
                      <FaQuoteRight className={styles.sectionIcon} />
                      Nossa Missão
                    </h3>
                    <div className={styles.sectionContent}>
                      <p>
                        O <strong>CineMar</strong> nasceu em 2023 da paixão compartilhada por cinema e do desejo 
                        de criar um espaço de encontro autêntico em Camocim. Somos um <strong>movimento cultural ativo</strong> 
                        que acredita no poder transformador da sétima arte para unir pessoas, provocar reflexões 
                        críticas e ampliar horizontes culturais.
                      </p>
                      
                      <div className={styles.missionPoints}>
                        <div className={styles.missionPoint}>
                          <FaRegCircle className={styles.missionIcon} />
                          <div className={styles.missionText}>
                            <strong>Acessibilidade:</strong> Cinema de qualidade gratuitamente
                          </div>
                        </div>
                        <div className={styles.missionPoint}>
                          <FaRegCircle className={styles.missionIcon} />
                          <div className={styles.missionText}>
                            <strong>Comunidade:</strong> Diálogo intergeracional através do cinema
                          </div>
                        </div>
                        <div className={styles.missionPoint}>
                          <FaRegCircle className={styles.missionIcon} />
                          <div className={styles.missionText}>
                            <strong>Formação Crítica:</strong> Desenvolver pensamento analítico
                          </div>
                        </div>
                      </div>
                      
                      <p>
                        Nossa <strong>curadoria diversificada</strong> equilibra clássicos atemporais com 
                        produções contemporâneas, sempre priorizando narrativas que estimulam o debate e 
                        a reflexão coletiva.
                      </p>
                    </div>
                  </div>
                  
                  <div className={styles.sectionBlock}>
                    <h3 className={styles.sectionTitle}>
                      <FaUsers className={styles.sectionIcon} />
                      Equipe Fundadora
                    </h3>
                    <div className={styles.membersGrid}>
                      <div className={styles.memberCard}>
                        <div className={styles.memberInfo}>
                          <h4>Coordenador Geral</h4>
                          <p>Maria Silva</p>
                        </div>
                      </div>
                      <div className={styles.memberCard}>
                        <div className={styles.memberInfo}>
                          <h4>Curadoria</h4>
                          <p>João Santos & Ana Costa</p>
                        </div>
                      </div>
                      <div className={styles.memberCard}>
                        <div className={styles.memberInfo}>
                          <h4>Mediação</h4>
                          <p>Pedro Oliveira</p>
                        </div>
                      </div>
                      <div className={styles.memberCard}>
                        <div className={styles.memberInfo}>
                          <h4>Produção</h4>
                          <p>Carla Rodrigues</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.cardActionsFooter}>
                    <Link to="/sobre-nos" className={styles.primaryButton}>
                      EXPLORAR NOSSA HISTÓRIA <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita: Último Filme */}
            <div className={styles.rightColumn}>
              {ultimoFilme && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                      <h2>
                        <FaCalendarAlt className={styles.cardIcon} />
                        ÚLTIMA EXIBIÇÃO
                      </h2>
                    </div>
                    <div className={styles.statusBadge}>
                      <div className={styles.badgeRealizado}>
                        EXIBIDO COM SUCESSO
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.filmeContent}>
                    <div className={styles.filmePoster}>
                      <img src={ultimoFilme.poster} alt={ultimoFilme.title} />
                    </div>
                    
                    <div className={styles.filmeInfo}>
                      <div className={styles.filmeHeader}>
                        <h3 className={styles.filmeTitle}>{ultimoFilme.title}</h3>
                        <div className={styles.filmeMeta}>
                          <span>{ultimoFilme.director}</span>
                          <span>• {ultimoFilme.year}</span>
                        </div>
                      </div>
                      
                      <div className={styles.filmeStats}>
                        <div className={styles.filmeStat}>
                          <FaClock className={styles.statIcon} />
                          <span>{ultimoFilme.duration}</span>
                        </div>
                        <div className={styles.filmeStat}>
                          <FaFilm className={styles.statIcon} />
                          <span>{ultimoFilme.genre}</span>
                        </div>
                        <div className={styles.filmeStat}>
                          <FaStar className={styles.statIcon} />
                          <span>{ultimoFilme.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <div className={styles.filmeDescription}>
                        <p>{ultimoFilme.description}</p>
                      </div>
                      
                      {ultimoFilme.views && (
                        <div className={styles.viewsInfo}>
                          <FaPlayCircle className={styles.infoIcon} />
                          <span>{ultimoFilme.views.toLocaleString()} visualizações do debate</span>
                        </div>
                      )}
                      
                      <div className={styles.filmeActions}>
                        <Link to={`/filmes?id=${ultimoFilme.id}`} className={styles.primaryButton}>
                          <FaPlay className={styles.buttonIcon} /> ASSISTIR DEBATE
                        </Link>
                        <Link to="/materiais" className={styles.secondaryButton}>
                          <FaComments className={styles.buttonIcon} /> MATERIAIS
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Próximo Filme */}
          {proximoFilme && (
            <div className={styles.featuredCard}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>
                    <h2>
                      <FaFire className={styles.cardIcon} />
                      PRÓXIMO ENCONTRO
                    </h2>
                    <p className={styles.cardSubtitle}>
                      {proximoFilme.date}
                    </p>
                  </div>
                  <div className={styles.statusBadge}>
                    <div className={styles.badgeProximo}>
                      EM BREVE
                    </div>
                  </div>
                </div>
                
                <div className={styles.featuredContent}>
                  <div className={styles.featuredInfo}>
                    <h3 className={styles.featuredTitle}>{proximoFilme.title}</h3>
                    
                    <div className={styles.featuredMeta}>
                      <div className={styles.metaItem}>
                        <FaUser className={styles.metaIcon} />
                        <span>{proximoFilme.director}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <FaClock className={styles.metaIcon} />
                        <span>{proximoFilme.duration}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <FaTag className={styles.metaIcon} />
                        <span>{proximoFilme.genre}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <FaStar className={styles.metaIcon} />
                        <span>{proximoFilme.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className={styles.featuredDescription}>
                      <p>{proximoFilme.description}</p>
                    </div>
                    
                    <div className={styles.exhibitionDetails}>
                      <h4 className={styles.detailsTitle}>
                        <FaMapMarkerAlt className={styles.detailsIcon} />
                        INFORMAÇÕES DA SESSÃO
                      </h4>
                      <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}>
                          <strong>Local:</strong> Sindicato dos Pescadores de Camocim
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Endereço:</strong> Rua EUA, 118, Praia - Camocim/CE
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Horário:</strong> 19:30h
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Entrada:</strong> Gratuita • 16 anos
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.featuredActions}>
                      <button className={styles.primaryButton}>
                        <FaCalendarAlt className={styles.buttonIcon} /> SALVAR NA AGENDA
                      </button>
                      <Link to="/filmes" className={styles.secondaryButton}>
                        <FaAngleRight className={styles.buttonIcon} /> VER PROGRAMAÇÃO
                      </Link>
                    </div>
                  </div>
                  
                  <div className={styles.featuredPoster}>
                    <img src={proximoFilme.poster} alt={proximoFilme.title} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Localização e Parceria */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <h2>
                  <FaBuilding className={styles.cardIcon} />
                  LOCALIZAÇÃO E PARCERIA
                </h2>
              </div>
              <div className={styles.curatorBadge}>
                <FaHandshake /> Colaboração
              </div>
            </div>
            
            <div className={styles.locationContent}>
              <div className={styles.locationInfo}>
                <div className={styles.addressCard}>
                  <h4 className={styles.addressTitle}>
                    <FaMapMarkerAlt className={styles.addressIcon} />
                    NOSSA SEDE
                  </h4>
                  <p className={styles.addressDetails}>
                    <strong>Sindicato dos Pescadores de Camocim</strong><br/>
                    Rua EUA, 118, Praia<br/>
                    Camocim - Ceará<br/>
                    CEP: 62400-000
                  </p>
                </div>
                
                <div className={styles.partnershipCard}>
                  <h4 className={styles.partnershipTitle}>
                    <FaHandshake className={styles.partnershipIcon} />
                    PARCERIA ESTRATÉGICA
                  </h4>
                  <p className={styles.partnershipText}>
                    A colaboração com o <strong>Sindicato dos Pescadores</strong> representa uma aliança 
                    que reconhece a cultura como direito social fundamental, possibilitando atividades 
                    culturais acessíveis enquanto fortalece os laços entre movimento sindical e produção 
                    cultural comunitária.
                  </p>
                  
                  <div className={styles.leadershipGrid}>
                    <div className={styles.leaderItem}>
                      <h5>Presidente</h5>
                      <p>Sr. Manoel</p>
                    </div>
                    <div className={styles.leaderItem}>
                      <h5>Vice-Presidente</h5>
                      <p>Sr. Francisco</p>
                    </div>
                  </div>
                </div>
                
                <div className={styles.locationActions}>
                  <Link to="/localizacao" className={styles.primaryButton}>
                    <FaMap className={styles.buttonIcon} /> COMO CHEGAR
                  </Link>
                  <Link to="/contato" className={styles.secondaryButton}>
                    <FaComments className={styles.buttonIcon} /> CONTATAR
                  </Link>
                </div>
              </div>
              
              <div className={styles.locationMap}>
                <div className={styles.mapPlaceholder}>
                  <h4 className={styles.mapTitle}>
                    <FaMapMarkerAlt className={styles.mapIcon} />
                    LOCALIZAÇÃO CENTRAL
                  </h4>
                  <p className={styles.mapDescription}>Centro de Camocim - Ceará</p>
                  <div className={styles.mapNote}>
                    <FaClock className={styles.noteIcon} />
                    <span>Sessões: Sextas e Sábados às 19:30h</span>
                  </div>
                  <div className={styles.mapNote}>
                    <FaUsers className={styles.noteIcon} />
                    <span>Capacidade: 80 pessoas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;