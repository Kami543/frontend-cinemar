import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaArrowRight, 
  FaFilm, 
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
  FaTag,
  FaSun,
  FaMoon,
  FaPlay,
  FaComments,
  FaAngleRight,
  FaRegCircle,
  FaUsers 
} from 'react-icons/fa';
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
            {/* Tema Toggle */}
            <div className={styles.heroHeaderTop}>
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
                CineMar • Um encontro com o cinema e a comunidade
              </p>
            </div>
          </div>
        </div>
      </header>

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
                      Cineclube Camocinense desde 2025
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
                      Nossa História
                    </h3>
                    <div className={styles.sectionContent}>
                      <p>
                        A ideia do <strong>CineMar</strong> surgiu em meados de 2023 quando os professores de Sociologia 
                        <strong> Luiz Seixas</strong> e <strong>Renato Silva</strong>, junto com o professor de História 
                        <strong> Marcelo Lima</strong>, resolveram criar um cineclube na cidade de Camocim (CE).
                      </p>
                      <p>
                        O projeto ficou fermentando nas intenções de seus proponentes até março de 2025 quando, 
                        finalmente, os professores Luiz Seixas, Renato Silva e os estudantes <strong>Victor Kelves</strong> e 
                        <strong> Daniela Lopes</strong>, junto com o presidente e vice-presidente do Sindicato dos 
                        Pescadores, respectivamente <strong>sr. Manoel Silva</strong> e <strong>sr. Francisco</strong>, 
                        reuniram-se no auditório do sindicato para debater a viabilidade da proposta.
                      </p>
                      <p>
                        Foi a discente <strong>Daniela Lopes</strong> quem batizou o cineclube com o nome que possui até hoje: 
                        <strong> CineMar</strong>.
                      </p>
                    </div>
                  </div>
                  
                  <div className={styles.sectionBlock}>
                    <h3 className={styles.sectionTitle}>
                      <FaHandshake className={styles.sectionIcon} />
                      Parcerias Estratégicas
                    </h3>
                    <div className={styles.missionPoints}>
                      <div className={styles.missionPoint}>
                        <FaRegCircle className={styles.missionIcon} />
                        <div className={styles.missionText}>
                          <strong>Sindicato dos Pescadores:</strong> Sede principal e parceiro fundador
                        </div>
                      </div>
                      <div className={styles.missionPoint}>
                        <FaRegCircle className={styles.missionIcon} />
                        <div className={styles.missionText}>
                          <strong>ACCAL:</strong> Sede para sessões especiais
                        </div>
                      </div>
                      <div className={styles.missionPoint}>
                        <FaRegCircle className={styles.missionIcon} />
                        <div className={styles.missionText}>
                          <strong>IFCE Camocim:</strong> Busca de formalização como projeto de extensão
                        </div>
                      </div>
                      <div className={styles.missionPoint}>
                        <FaRegCircle className={styles.missionIcon} />
                        <div className={styles.missionText}>
                          <strong>Cunversa Podcast:</strong> Divulgação das atividades
                        </div>
                      </div>
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
                          <h4>Coordenadores</h4>
                          <p>Luiz Seixas • Renato Silva</p>
                        </div>
                      </div>
                      <div className={styles.memberCard}>
                        <div className={styles.memberInfo}>
                          <h4>Colaboradores Fundadores</h4>
                          <p>Victor Kelves • Daniela Lopes</p>
                        </div>
                      </div>
                      <div className={styles.memberCard}>
                        <div className={styles.memberInfo}>
                          <h4>Parceiros Fundadores</h4>
                          <p>Manoel Silva • Francisco</p>
                        </div>
                      </div>
                      <div className={styles.memberCard}>
                        <div className={styles.memberInfo}>
                          <h4>Parceiros Institucionais</h4>
                          <p>Santhiago Pontes • Cassiano Ricardo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.cardActionsFooter}>
                    <Link to="/sobre-nos" className={styles.primaryButton}>
                      CONHEÇA NOSSA HISTÓRIA <FaArrowRight />
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
                        <div className={styles.detailItem}>
                          <strong>Frequência:</strong> Sessões quinzenais
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
                    <strong>Sindicato dos Pescadores e Pescadoras de Camocim</strong><br/>
                    Rua EUA, 118, Praia<br/>
                    Camocim - Ceará<br/>
                    CEP: 62400-000
                  </p>
                  <div className={styles.mapNote}>
                    <FaClock className={styles.noteIcon} />
                    <span>Sessões quinzenais • Sextas-feiras • 19:30h</span>
                  </div>
                </div>
                
                <div className={styles.partnershipCard}>
                  <h4 className={styles.partnershipTitle}>
                    <FaHandshake className={styles.partnershipIcon} />
                    PARCERIAS ESTRATÉGICAS
                  </h4>
                  <p className={styles.partnershipText}>
                    O CineMar conta com o apoio fundamental de diversas instituições que acreditam 
                    no poder transformador da cultura audiovisual em Camocim.
                  </p>
                  
                  <div className={styles.leadershipGrid}>
                    <div className={styles.leaderItem}>
                      <h5>Sindicato dos Pescadores</h5>
                      <p>Sede e parceiro fundador</p>
                    </div>
                    <div className={styles.leaderItem}>
                      <h5>ACCAL</h5>
                      <p>Sede para sessões especiais</p>
                    </div>
                    <div className={styles.leaderItem}>
                      <h5>IFCE Camocim</h5>
                      <p>Em formalização como projeto de extensão</p>
                    </div>
                    <div className={styles.leaderItem}>
                      <h5>Cunversa Podcast</h5>
                      <p>Divulgação cultural</p>
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
                  <p className={styles.mapDescription}>Praia de Camocim - Ceará</p>
                  <div className={styles.mapNote}>
                    <FaClock className={styles.noteIcon} />
                    <span>Sessões: Quinzenalmente às Sextas 19:30h</span>
                  </div>
                  <div className={styles.mapNote}>
                    <FaUsers className={styles.noteIcon} />
                    <span>Capacidade: 80 pessoas</span>
                  </div>
                  <div className={styles.mapNote}>
                    <FaHeart className={styles.noteIcon} />
                    <span>Entrada Franca • Livre para todos</span>
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