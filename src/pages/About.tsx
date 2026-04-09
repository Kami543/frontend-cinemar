import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaHandshake,
  FaUsers,
  FaChartLine,
  FaQuoteLeft,
  FaQuoteRight,
  FaMoon,
  FaSun,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBullhorn,
  FaLightbulb,
  FaUserTie,
  FaFilm
} from 'react-icons/fa';
import styles from "../styles/About.module.css";

export default function About() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Verifica se há preferência salva
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      // Verifica preferência do sistema
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Membros do time
  const teamMembers = [
    { name: "Luiz Seixas", role: "Coordenador & Professor de Sociologia", initials: "LS" },
    { name: "Renato Silva", role: "Coordenador & Professor de Sociologia", initials: "RS" },
    { name: "Marcelo Lima", role: "Professor de História & Cofundador", initials: "ML" },
    { name: "Victor Kelves", role: "Estudante & Colaborador Fundador", initials: "VK" },
    { name: "Daniela Lopes", role: "Estudante & Colaboradora Fundadora", initials: "DL" },
    { name: "Manoel Silva", role: "Presidente do Sindicato dos Pescadores", initials: "MS" },
    { name: "Francisco", role: "Vice-Presidente do Sindicato", initials: "FR" },
    { name: "Santhiago Pontes", role: "Presidente da ACCAL", initials: "SP" },
    { name: "Cassiano Ricardo", role: "Professor do IFCE Camocim", initials: "CR" }
  ];

  // Parcerias
  const partnerships = [
    { 
      name: "Sindicato dos Pescadores e Pescadoras de Camocim", 
      type: "Sede Principal",
      description: "Auditório onde nasceu o CineMar e onde são realizadas as sessões quinzenais."
    },
    { 
      name: "ACCAL - Academia Camocinense de Ciências, Artes e Letras", 
      type: "Parceria Cultural",
      description: "Local para sessões especiais sob o franqueamento do professor Santhiago Pontes."
    },
    { 
      name: "IFCE - Instituto Federal do Ceará (Campus Camocim)", 
      type: "Parceria Institucional",
      description: "Busca de formalização como projeto de extensão através do professor Cassiano Ricardo."
    },
    { 
      name: "Cunversa Podcast", 
      type: "Divulgação",
      description: "Espaço de discussão sobre cineclubismo e divulgação das atividades do CineMar."
    }
  ];

  // Objetivos futuros
  const futureObjectives = [
    "Estabelecer-se como projeto de Extensão do Instituto Federal do Ceará",
    "Expandir o alcance para diferentes bairros de Camocim",
    "Realizar oficinas de audiovisual para a comunidade",
    "Consolidar parcerias permanentes",
    "Registro das histórias dos pescadores e da comunidade",
    "Primeiro festival de cinema comunitário de Camocim"
  ];

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* Header igual ao módulo Fotos */}
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
                onClick={toggleDarkMode}
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
            <h1 className={styles.heroTitle}>CineMar Camocim</h1>
            <p className={styles.heroSubtitle}>
              Um cineclube dedicado à exibição, discussão e formação crítica através do audiovisual em Camocim, Ceará.
            </p>
          </div>
        </div>
      </header>

      <main className={`${styles.mainContent} ${isDarkMode ? styles.darkMain : ''}`}>
        {/* História */}
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <FaFilm className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Nossa História</h2>
          </div>
          
          <div className={`${styles.textBlock} ${isDarkMode ? styles.darkText : ''}`}>
            <p>
              A ideia surgiu em meados de 2023 quando os professores de Sociologia <strong>Luiz Seixas</strong>, 
              <strong> Renato Silva</strong> e o de História <strong>Marcelo Lima</strong> resolveram criar um 
              cineclube na cidade de Camocim (CE).
            </p>
            <p>
              A proposta inicial tinha como objetivo criar um espaço de fomento à cultura audiovisual na cidade, 
              com destaque para a prática do cineclubismo.
            </p>
            <p>
              O projeto ficou fermentando nas intenções de seus proponentes até março de 2025 quando, finalmente, 
              os professores Luiz Seixas, Renato Silva e os estudantes Victor Kelves e Daniela Lopes, junto com o 
              presidente e vice-presidente do Sindicato dos Pescadores e Pescadoras de Camocim, respectivamente, 
              sr. Manoel Silva e sr. Francisco, reuniram-se no auditório do sindicato para debater a viabilidade 
              da proposta a ser realizada no próprio ambiente citado.
            </p>
            <p>
              Na reunião, foi decidido que as sessões seriam realizadas quinzenalmente. A princípio, o nome do 
              cineclube seria CineSind – um acrônimo das palavras cineclube com sindicato. Em seguida, ventilou-se 
              a possibilidade de outros nomes até que a discente Daniela Lopes fez as vezes de João Batista e 
              batizou o cineclube com o nome que possui até hoje: CineMar.
            </p>
          </div>
        </section>

        {/* Linha do Tempo */}
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <FaCalendarAlt className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Marcos Importantes</h2>
          </div>
          
          <div className={styles.timeline}>
            <div className={`${styles.timelineItem} ${isDarkMode ? styles.darkCard : ''}`}>
              <span className={styles.timelineYear}>Março 2025 - Fevereiro 2026</span>
              <h3 className={styles.timelineTitle}>Sessões Realizadas</h3>
              <p className={`${styles.timelineDescription} ${isDarkMode ? styles.darkTextSecondary : ''}`}>
                Mais de uma dezena de exibições de filmes nacionais, internacionais e documentários.
                Uma das sessões ocorreu na Academia Camocinense de Ciências, Artes e Letras (ACCAL) 
                sob o franqueamento gentil do então presidente da Academia, professor Santhiago Pontes.
              </p>
            </div>
            
            <div className={`${styles.timelineItem} ${isDarkMode ? styles.darkCard : ''}`}>
              <span className={styles.timelineYear}>2025</span>
              <h3 className={styles.timelineTitle}>Participação no Cunversa Podcast</h3>
              <p className={`${styles.timelineDescription} ${isDarkMode ? styles.darkTextSecondary : ''}`}>
                Os professores e coordenadores do CineMar, Renato Silva e Luiz Seixas, participaram do 
                Cunversa Podcast (Ep#87). Na ocasião, os coordenadores narraram uma breve história do 
                CineMar até o momento e falaram também sobre as suas respectivas formações na cultura 
                do cineclubismo.
              </p>
            </div>
          </div>
        </section>

        {/* Parcerias */}
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <FaHandshake className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Nossas Parcerias</h2>
          </div>
          
          <div className={styles.partnershipGrid}>
            {partnerships.map((partner, index) => (
              <div key={index} className={`${styles.partnershipCard} ${isDarkMode ? styles.darkCard : ''}`}>
                <FaBullhorn className={styles.partnershipLogo} />
                <h3 className={`${styles.partnershipName} ${isDarkMode ? styles.darkText : ''}`}>
                  {partner.name}
                </h3>
                <span className={styles.partnershipType}>{partner.type}</span>
                <p className={`${styles.partnershipDescription} ${isDarkMode ? styles.darkTextSecondary : ''}`}>
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Equipe */}
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <FaUsers className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Nossa Equipe</h2>
          </div>
          
          <div className={styles.memberGrid}>
            {teamMembers.map((member, index) => (
              <div key={index} className={`${styles.memberCard} ${isDarkMode ? styles.darkCard : ''}`}>
                <div className={styles.memberHeader}>
                  <div className={styles.memberAvatar}>
                    {member.initials}
                  </div>
                  <div className={styles.memberInfo}>
                    <h3 className={`${styles.memberName} ${isDarkMode ? styles.darkText : ''}`}>
                      {member.name}
                    </h3>
                    <span className={styles.memberRole}>{member.role}</span>
                  </div>
                </div>
                <p className={`${styles.memberDescription} ${isDarkMode ? styles.darkTextSecondary : ''}`}>
                  Contribui ativamente para o crescimento e consolidação do CineMar na comunidade camocinense.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Perspectivas Futuras */}
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <FaChartLine className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Perspectivas Futuras</h2>
          </div>
          
          <div className={`${styles.textBlock} ${isDarkMode ? styles.darkText : ''}`}>
            <p>
              O CineMar continua com as suas propostas de intervenção cultural no município de Camocim (CE), 
              buscando estreitar parcerias na cidade e angariar novas participantes.
            </p>
          </div>
          
          <ul className={styles.objectivesList}>
            {futureObjectives.map((objective, index) => (
              <li key={index} className={`${styles.objectiveItem} ${isDarkMode ? styles.darkCard : ''}`}>
                <FaLightbulb className={styles.objectiveIcon} />
                <span className={`${styles.objectiveText} ${isDarkMode ? styles.darkTextSecondary : ''}`}>
                  {objective}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Citação Final */}
        <section className={`${styles.quoteSection} ${isDarkMode ? styles.darkCard : ''}`}>
          <blockquote className={`${styles.quote} ${isDarkMode ? styles.darkText : ''}`}>
            <FaQuoteLeft /> Esperamos que as ações do cineclube tenham vida longa e que sua 
            efetividade perdure por bom tempo em Camocim. Porque o cinema é, acima de tudo, um encontro. <FaQuoteRight />
          </blockquote>
          <div className={`${styles.quoteAuthor} ${isDarkMode ? styles.darkTextSecondary : ''}`}>
            — Equipe CineMar, 2026
          </div>
        </section>

        {/* Ações */}
        <div className={styles.actions}>
          <Link to="/filmes" className={styles.primaryButton}>
            <FaFilm />
            Ver Catálogo de Filmes
          </Link>
          <Link to="/eventos" className={styles.secondaryButton}>
            <FaCalendarAlt />
            Próximas Sessões
          </Link>
        </div>
      </main>
    </div>
  );
}