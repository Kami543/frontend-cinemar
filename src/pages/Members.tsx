import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaUsers,
  FaFilm,
  FaGraduationCap,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaSun,
  FaMoon,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaUniversity,
  FaStar,
  FaAward,
  FaHeart,
  FaLightbulb,
  FaFish,
  FaSchool,
  FaUserGraduate,
  FaHandsHelping,
  FaBriefcase,
  FaMapMarkerAlt,
  FaGlobeAmericas,
  FaBook,
  FaChalkboardTeacher
} from 'react-icons/fa';
import styles from '../styles/Members.module.css';
import Renato from '../images/prof-renato.jpeg';

interface Member {
  id: number;
  nome: string;
  cargo: string;
  bio: string;
  formacao: string;
  email: string;
  telefone: string;
  responsabilidades: string[];
  foto?: string;
  redesSociais: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  destaque: boolean;
  tipo: 'cofundador' | 'estudante' | 'parceiro' | 'apoiador';
  experiencia?: string[];
}

export default function Members() {
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

  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  // Dados dos membros do CineMar - Atualizado com mais informações
  const membersData: Member[] = [
    {
      id: 1,
      nome: 'Prof. Renato Kleibson da Silva',
      cargo: 'Co-fundador e Coordenador Geral',
      bio: 'Professor de sociologia com experiência em educação popular e projetos culturais. Doutor em Ciências Sociais pela UFRN (2015-2019), foi pesquisador visitante na UCLA (2017-2018) e professor substituto na UFRN (2019-2021). Natural de São Paulo, participou ativamente da redemocratização brasileira. Idealizador e coordenador principal do CineMar.',
      formacao: 'Doutorado em Ciências Sociais (UFRN, 2015-2019) | Mestrado em Ciências Sociais (UFRN, 2013-2015) | Graduação em Ciências Sociais (UFPE, 2008-2012)',
      email: 'renato.cinemar@gmail.com',
      telefone: '(88) 99999-9999',
      experiencia: [
        'Pesquisador Visitante na UCLA (Universidade da Califórnia, Los Angeles) - 2017-2018',
        'Professor Substituto - Departamento de Ciências Sociais UFRN - 2019-2021',
        'Professor da Seduc Ceará - Atual'
      ],
      responsabilidades: [
        'Coordenação geral do projeto',
        'Seleção de filmes e curadoria',
        'Mediação dos debates',
        'Formação de voluntários',
        'Articulação comunitária',
        'Planejamento estratégico'
      ],
      foto: Renato,
      redesSociais: {
        facebook: 'renato.cinemar',
        instagram: '@prof.renato.cinemar',
        linkedin: 'renato-kleibson-da-silva'
      },
      destaque: true,
      tipo: 'cofundador'
    },
    {
      id: 2,
      nome: 'Prof. Luiz Seixas',
      cargo: 'Co-fundador e Coordenador Educacional',
      bio: 'Professor apaixonado por cinema e educação. Doutor em Educação com experiência em projetos pedagógicos inovadores. Participou do episódio 87 do Podcast Conversa sobre a história do CineMar. Responsável pela dimensão pedagógica do projeto.',
      formacao: 'Doutorado em Educação | Mestrado em Educação | Licenciatura em Pedagogia',
      email: 'luiz.cinemar@gmail.com',
      telefone: '(88) 99999-8888',
      responsabilidades: [
        'Planejamento pedagógico das sessões',
        'Material didático e roteiros de debate',
        'Capacitação de mediadores',
        'Avaliação do impacto educacional',
        'Desenvolvimento de metodologias'
      ],
      experiencia: [
        'Professor de Educação Básica - 10 anos',
        'Coordenador Pedagógico em projetos culturais',
        'Palestrante em eventos educacionais'
      ],
      redesSociais: {
        instagram: '@prof.luiz.cinemar',
        linkedin: 'professor-luiz-cinemar'
      },
      destaque: true,
      tipo: 'cofundador'
    },
    {
      id: 3,
      nome: 'Prof. Marcelo Lima',
      cargo: 'Co-fundador Inicial',
      bio: 'Professor de História e um dos idealizadores iniciais do CineMar. Com experiência em educação popular, contribuiu para a concepção do projeto como espaço de fomento cultural em Camocim.',
      formacao: 'Licenciatura em História | Especialização em História do Brasil',
      email: 'marcelo.cinemar@gmail.com',
      telefone: '(88) 99999-7777',
      responsabilidades: [
        'Concepção inicial do projeto',
        'Pesquisa histórica para curadoria',
        'Mediação de debates históricos',
        'Articulação com instituições culturais',
        'Contextualização histórica dos filmes'
      ],
      experiencia: [
        'Professor de História - 8 anos',
        'Pesquisador em História Regional',
        'Mediador em cineclubes escolares'
      ],
      redesSociais: {
        instagram: '@marcelo.cinemar.historia'
      },
      destaque: false,
      tipo: 'cofundador'
    },
    {
      id: 4,
      nome: 'Daniela Lopes',
      cargo: 'Estudante e Nomeadora',
      bio: 'Estudante do Ensino Médio que propôs o nome "CineMar" durante as discussões iniciais. Ativa participante das sessões e organização do projeto, representa o engajamento juvenil.',
      formacao: 'Estudante do Ensino Médio - EEM Camocim',
      email: 'daniela.cinemar@gmail.com',
      telefone: '(88) 99999-6666',
      responsabilidades: [
        'Sugestão do nome do projeto',
        'Apoio na organização das sessões',
        'Divulgação nas redes estudantis',
        'Participação ativa nas sessões',
        'Ponte entre escola e projeto'
      ],
      experiencia: [
        'Liderança estudantil',
        'Participação em grêmio escolar',
        'Voluntária em eventos culturais'
      ],
      redesSociais: {
        instagram: '@dani.cinemar.student'
      },
      destaque: false,
      tipo: 'estudante'
    },
    {
      id: 5,
      nome: 'Victor Kelves',
      cargo: 'Estudante Participante',
      bio: 'Estudante ativo nas reuniões iniciais que definiram a viabilidade do projeto. Apoia na logística e engajamento de outros estudantes, sendo importante voz juvenil.',
      formacao: 'Estudante do Ensino Médio - IFCE Camocim',
      email: 'victor.cinemar@gmail.com',
      telefone: '(88) 99999-5555',
      responsabilidades: [
        'Participação nas reuniões decisórias',
        'Apoio logístico nas sessões',
        'Engajamento de outros estudantes',
        'Feedback sobre programação',
        'Suporte técnico'
      ],
      experiencia: [
        'Monitor de informática',
        'Participante de projetos escolares',
        'Conhecimento em audiovisual'
      ],
      redesSociais: {
        instagram: '@victor.cinemar.k'
      },
      destaque: false,
      tipo: 'estudante'
    },
    {
      id: 6,
      nome: 'Prof. Cassiano Ricardo',
      cargo: 'Parceiro Institucional (IFCE)',
      bio: 'Professor do Instituto Federal do Ceará - campus Camocim. Trabalha para estabelecer o CineMar como projeto de extensão do IFCE, contribuindo com expertise acadêmica.',
      formacao: 'Mestrado em Educação | Professor do IFCE Camocim',
      email: 'cassiano.cinemar@gmail.com',
      telefone: '(88) 99999-4444',
      responsabilidades: [
        'Articulação institucional com IFCE',
        'Busca de financiamento como projeto de extensão',
        'Integração acadêmica',
        'Documentação institucional',
        'Coordenação de extensão'
      ],
      experiencia: [
        'Professor do IFCE - 5 anos',
        'Coordenador de projetos de extensão',
        'Pesquisador em educação profissional'
      ],
      redesSociais: {
        linkedin: 'cassiano-ricardo-ifce'
      },
      destaque: false,
      tipo: 'parceiro'
    },
    {
      id: 7,
      nome: 'Prof. Santhiago Pontes',
      cargo: 'Parceiro Cultural (ACCAL)',
      bio: 'Presidente da Academia Camocinense de Ciências, Artes e Letras (ACCAL). Cedeu gentilmente o espaço da Academia para sessões do CineMar, fortalecendo os laços culturais.',
      formacao: 'Presidente da ACCAL | Especialista em Cultura Regional',
      email: 'santhiago.accal@gmail.com',
      telefone: '(88) 99999-3333',
      responsabilidades: [
        'Cedência do espaço da ACCAL',
        'Articulação cultural local',
        'Promoção das sessões especiais',
        'Integração com a comunidade acadêmica',
        'Mediação cultural'
      ],
      experiencia: [
        'Presidente da ACCAL - 3 anos',
        'Gestor cultural',
        'Promotor de eventos artísticos'
      ],
      redesSociais: {
        instagram: '@santhiago.accal'
      },
      destaque: false,
      tipo: 'parceiro'
    },
    {
      id: 8,
      nome: 'Sr. Manoel Silva',
      cargo: 'Apoiador - Sindicato dos Pescadores',
      bio: 'Presidente do Sindicato dos Pescadores e Pescadoras de Camocim. Acolheu a proposta e cedeu o auditório do sindicato para as sessões quinzenais, demonstrando compromisso com a comunidade.',
      formacao: 'Presidente do Sindicato dos Pescadores | Liderança Comunitária',
      email: 'sindicato.pescadores@gmail.com',
      telefone: '(88) 99999-2222',
      responsabilidades: [
        'Cedência do espaço do sindicato',
        'Apoio logístico às sessões',
        'Articulação com a comunidade pesqueira',
        'Promoção entre os associados',
        'Representação comunitária'
      ],
      experiencia: [
        'Presidente do Sindicato - 8 anos',
        'Liderança comunitária',
        'Mediação de conflitos trabalhistas'
      ],
      redesSociais: {},
      destaque: false,
      tipo: 'apoiador'
    },
    {
      id: 9,
      nome: 'Sr. Francisco',
      cargo: 'Vice-presidente do Sindicato',
      bio: 'Vice-presidente do Sindicato dos Pescadores e Pescadoras de Camocim. Participou ativamente da reunião inicial que definiu a viabilidade do projeto, apoiando a iniciativa.',
      formacao: 'Vice-presidente do Sindicato | Pesca Artesanal',
      email: 'francisco.sindicato@gmail.com',
      telefone: '(88) 99999-1111',
      responsabilidades: [
        'Apoio na gestão do espaço',
        'Mediação com a comunidade',
        'Logística de infraestrutura',
        'Participação nas decisões',
        'Relações institucionais'
      ],
      experiencia: [
        'Vice-presidente do Sindicato - 4 anos',
        'Pescador artesanal - 20 anos',
        'Representante de categoria'
      ],
      redesSociais: {},
      destaque: false,
      tipo: 'apoiador'
    }
  ];

  const tipos = [
    { value: 'todos', label: 'Todos os Membros', icon: FaUsers },
    { value: 'cofundador', label: 'Co-fundadores', icon: FaStar },
    { value: 'estudante', label: 'Estudantes', icon: FaUserGraduate },
    { value: 'parceiro', label: 'Parceiros', icon: FaHandsHelping },
    { value: 'apoiador', label: 'Apoiadores', icon: FaHeart }
  ];

  const filteredMembers = membersData.filter(member => {
    const matchesTipo = filtroTipo === 'todos' || member.tipo === filtroTipo;
    const matchesSearch = searchTerm === '' || 
      member.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.bio.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTipo && matchesSearch;
  });

  const destaques = membersData.filter(member => member.destaque);

  const openMemberModal = (member: Member) => {
    setSelectedMember(member);
    document.body.style.overflow = 'hidden';
  };

  const closeMemberModal = () => {
    setSelectedMember(null);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const getTipoLabel = (tipo: string) => {
    return tipos.find(t => t.value === tipo)?.label || tipo;
  };

  const getTipoIcon = (tipo: string) => {
    const tipoInfo = tipos.find(t => t.value === tipo);
    const Icon = tipoInfo?.icon || FaUsers;
    return <Icon />;
  };

  return (
    <div className={`${styles.membersPage} ${isDarkMode ? styles.darkMode : ''}`}>
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
                className={styles.themeToggle}
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
              <FaUsers className={styles.titleIcon} />
              Equipe CineMar
            </h1>
            <p className={styles.heroSubtitle}>
              Conheça as pessoas que tornam o CineMar possível através de dedicação, 
              conhecimento e paixão pelo cinema comunitário em Camocim.
            </p>
          </div>
        </div>
      </header>

      <main className={`${styles.mainContent} ${isDarkMode ? styles.darkMain : ''}`}>
        <div className={styles.contentWrapper}>
          {/* Filtros e Busca */}
          <section className={styles.filtersSection}>
            <div className={`${styles.filtersCard} ${isDarkMode ? styles.darkCard : ''}`}>
              <h2 className={styles.filtersTitle}>
                <FaUniversity className={styles.filtersIcon} />
                Filtre por Categoria
              </h2>
              
              {/* Barra de Busca */}
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Buscar membro por nome, cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                <FaUsers className={styles.searchIcon} />
              </div>
              
              <div className={styles.filtersGrid}>
                {tipos.map((tipo) => {
                  const Icon = tipo.icon;
                  return (
                    <button
                      key={tipo.value}
                      className={`${styles.filterButton} ${filtroTipo === tipo.value ? styles.active : ''}`}
                      onClick={() => setFiltroTipo(tipo.value)}
                    >
                      <Icon className={styles.filterIcon} />
                      {tipo.label}
                    </button>
                  );
                })}
              </div>
              
              <div className={styles.filterInfo}>
                <span className={styles.membersCount}>
                  {filteredMembers.length} {filteredMembers.length === 1 ? 'membro encontrado' : 'membros encontrados'}
                </span>
              </div>
            </div>
          </section>

          {/* Membros em Destaque (Co-fundadores) */}
          {filtroTipo === 'todos' && destaques.length > 0 && (
            <section className={styles.featuredSection}>
              <h2 className={styles.sectionTitle}>
                <FaStar className={styles.titleIcon} />
                Co-fundadores e Lideranças
              </h2>
              <div className={styles.featuredGrid}>
                {destaques.map(member => (
                  <div 
                    key={member.id} 
                    className={`${styles.featuredCard} ${isDarkMode ? styles.darkCard : ''}`}
                    onClick={() => openMemberModal(member)}
                  >
                    <div className={styles.featuredImage}>
                      {member.foto ? (
                        <img src={member.foto} alt={member.nome} />
                      ) : (
                        <div className={styles.featuredIcon}>
                          {getTipoIcon(member.tipo)}
                        </div>
                      )}
                      <div className={styles.featuredTag}>
                        <FaAward /> Co-fundador
                      </div>
                    </div>
                    <div className={styles.featuredContent}>
                      <div className={styles.featuredHeader}>
                        <h3 className={styles.featuredName}>{member.nome}</h3>
                        <p className={styles.featuredRole}>{member.cargo}</p>
                      </div>
                      <div className={styles.featuredBio}>
                        <p>{member.bio.substring(0, 120)}...</p>
                      </div>
                      <div className={styles.featuredDetails}>
                        <div className={styles.detailItem}>
                          <FaGraduationCap className={styles.detailIcon} />
                          <span>{member.formacao.split('|')[0].trim()}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <FaHandsHelping className={styles.detailIcon} />
                          <span>{member.responsabilidades.length} responsabilidades</span>
                        </div>
                      </div>
                      <div className={styles.featuredButton}>
                        <span>Ver Perfil Completo</span>
                        <FaUsers className={styles.buttonIcon} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Lista de Membros */}
          <section className={styles.membersSection}>
            <h2 className={styles.sectionTitle}>
              <FaUsers className={styles.titleIcon} />
              {filtroTipo === 'todos' ? 'Nossa Equipe Completa' : getTipoLabel(filtroTipo)}
              <span className={styles.membersCount}>({filteredMembers.length})</span>
            </h2>
            
            {filteredMembers.length === 0 ? (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>
                  <FaUsers />
                </div>
                <h3>Nenhum membro encontrado</h3>
                <p>Tente ajustar os filtros ou a busca</p>
              </div>
            ) : (
              <div className={styles.membersGrid}>
                {filteredMembers
                  .filter(member => !member.destaque || filtroTipo !== 'todos')
                  .map(member => (
                  <div 
                    key={member.id} 
                    className={`${styles.memberCard} ${isDarkMode ? styles.darkCard : ''}`}
                    onClick={() => openMemberModal(member)}
                  >
                    <div className={styles.cardHeaderSection}>
                      <div className={styles.cardImage}>
                        {member.foto ? (
                          <img src={member.foto} alt={member.nome} />
                        ) : (
                          <div className={styles.cardIcon}>
                            {getTipoIcon(member.tipo)}
                          </div>
                        )}
                        <div className={`${styles.cardTipoTag} ${styles[member.tipo]}`}>
                          {getTipoIcon(member.tipo)}
                          <span>{getTipoLabel(member.tipo)}</span>
                        </div>
                      </div>
                      <div className={styles.cardTitle}>
                        <h3 className={styles.cardName}>{member.nome}</h3>
                        <p className={styles.cardRole}>{member.cargo}</p>
                      </div>
                    </div>
                    
                    <div className={styles.cardBody}>
                      <p className={styles.cardBio}>
                        {member.bio.substring(0, 90)}...
                      </p>
                      
                      <div className={styles.cardDetails}>
                        <div className={styles.detailItem}>
                          <FaGraduationCap className={styles.detailIcon} />
                          <span className={styles.detailText}>
                            {member.formacao.split('|')[0].trim()}
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <FaBriefcase className={styles.detailIcon} />
                          <span className={styles.detailText}>
                            {member.responsabilidades.length} funções
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.cardFooter}>
                      <button className={styles.cardButton}>
                        <FaEnvelope className={styles.buttonIcon} />
                        <span>Ver Detalhes</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sobre a Equipe */}
          <section className={`${styles.aboutTeam} ${isDarkMode ? styles.darkCard : ''}`}>
            <div className={styles.aboutContent}>
              <div className={styles.aboutHeader}>
                <FaLightbulb className={styles.aboutIcon} />
                <h2 className={styles.aboutTitle}>Nossa História e Missão</h2>
              </div>
              <div className={styles.aboutGrid}>
                <div className={styles.aboutItem}>
                  <h3><FaUsers className={styles.aboutItemIcon} /> Origem</h3>
                  <p>O CineMar surgiu em 2023 da iniciativa de professores e estudantes para criar um espaço de cineclubismo em Camocim.</p>
                </div>
                <div className={styles.aboutItem}>
                  <h3><FaFish className={styles.aboutItemIcon} /> Comunidade</h3>
                  <p>Parceria com o Sindicato dos Pescadores possibilitou sessões quinzenais abertas à comunidade.</p>
                </div>
                <div className={styles.aboutItem}>
                  <h3><FaSchool className={styles.aboutItemIcon} /> Educação</h3>
                  <p>Buscamos transformar o CineMar em projeto de extensão do IFCE para ampliar o impacto educacional.</p>
                </div>
                <div className={styles.aboutItem}>
                  <h3><FaFilm className={styles.aboutItemIcon} /> Cultura</h3>
                  <p>Promovemos o cinema nacional e debates culturais como ferramentas de transformação social.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className={styles.ctaSection}>
            <div className={`${styles.ctaContent} ${isDarkMode ? styles.darkCard : ''}`}>
              <h2 className={styles.ctaTitle}>Junte-se a Nós!</h2>
              <p className={styles.ctaText}>
                Participe das nossas sessões quinzenais no Sindicato dos Pescadores 
                (Rua Estados Unidos, 118) e faça parte desta comunidade cinéfila.
              </p>
              <div className={styles.ctaButtons}>
                <Link to="/eventos" className={styles.ctaButton}>
                  <FaCalendarAlt className={styles.ctaIcon} />
                  <span>Próximas Sessões</span>
                </Link>
                <Link to="/contato" className={styles.ctaButtonSecondary}>
                  <FaEnvelope className={styles.ctaIcon} />
                  <span>Entre em Contato</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Modal do Membro */}
      {selectedMember && (
        <div className={styles.modalOverlay} onClick={closeMemberModal}>
          <div 
            className={`${styles.modalContent} ${isDarkMode ? styles.darkCard : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeModal} onClick={closeMemberModal}>
              ×
            </button>
            
            <div className={styles.modalHeader}>
              <div className={styles.modalImage}>
                {selectedMember.foto ? (
                  <img src={selectedMember.foto} alt={selectedMember.nome} />
                ) : (
                  <div className={styles.modalIcon}>
                    {getTipoIcon(selectedMember.tipo)}
                  </div>
                )}
              </div>
              <div className={styles.modalTitle}>
                <div className={styles.modalTipoTag}>
                  {getTipoIcon(selectedMember.tipo)}
                  <span>{getTipoLabel(selectedMember.tipo)}</span>
                </div>
                <h2>{selectedMember.nome}</h2>
                <p className={styles.modalRole}>{selectedMember.cargo}</p>
                {selectedMember.destaque && (
                  <div className={styles.modalTag}>
                    <FaStar className={styles.tagIcon} /> Co-fundador
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalBody}>
              {/* Bio */}
              <div className={styles.modalSection}>
                <h3>
                  <FaUserGraduate className={styles.modalSectionIcon} />
                  Sobre
                </h3>
                <p className={styles.modalBio}>{selectedMember.bio}</p>
              </div>

              {/* Formação */}
              <div className={styles.modalSection}>
                <h3>
                  <FaGraduationCap className={styles.modalSectionIcon} />
                  Formação Acadêmica
                </h3>
                <div className={styles.formacaoList}>
                  {selectedMember.formacao.split('|').map((item, index) => (
                    <div key={index} className={styles.formacaoItem}>
                      <FaBook className={styles.formacaoIcon} />
                      <span>{item.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experiência */}
              {selectedMember.experiencia && selectedMember.experiencia.length > 0 && (
                <div className={styles.modalSection}>
                  <h3>
                    <FaBriefcase className={styles.modalSectionIcon} />
                    Experiência Relevante
                  </h3>
                  <ul className={styles.experienciaList}>
                    {selectedMember.experiencia.map((exp, index) => (
                      <li key={index} className={styles.experienciaItem}>
                        <FaChalkboardTeacher className={styles.expIcon} />
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Responsabilidades */}
              <div className={styles.modalSection}>
                <h3>
                  <FaHandsHelping className={styles.modalSectionIcon} />
                  Responsabilidades no CineMar
                </h3>
                <ul className={styles.responsibilitiesList}>
                  {selectedMember.responsabilidades.map((resp, index) => (
                    <li key={index} className={styles.responsibilityItem}>
                      <FaHeart className={styles.respIcon} />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contato e Redes Sociais */}
              <div className={styles.modalGrid}>
                <div className={styles.contactInfo}>
                  <h3>
                    <FaEnvelope className={styles.modalSectionIcon} />
                    Contato
                  </h3>
                  <div className={styles.contactItem}>
                    <FaEnvelope className={styles.contactIcon} />
                    <span className={styles.contactText}>{selectedMember.email}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <FaPhone className={styles.contactIcon} />
                    <span className={styles.contactText}>{selectedMember.telefone}</span>
                  </div>
                </div>

                {Object.keys(selectedMember.redesSociais).length > 0 && (
                  <div className={styles.socialInfo}>
                    <h3>
                      <FaGlobeAmericas className={styles.modalSectionIcon} />
                      Redes Sociais
                    </h3>
                    <div className={styles.socialLinks}>
                      {selectedMember.redesSociais.facebook && (
                        <a 
                          href={`https://facebook.com/${selectedMember.redesSociais.facebook}`}
                          className={styles.socialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaFacebook className={styles.socialIcon} />
                        </a>
                      )}
                      {selectedMember.redesSociais.instagram && (
                        <a 
                          href={`https://instagram.com/${selectedMember.redesSociais.instagram}`}
                          className={styles.socialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaInstagram className={styles.socialIcon} />
                        </a>
                      )}
                      {selectedMember.redesSociais.youtube && (
                        <a 
                          href={`https://youtube.com/${selectedMember.redesSociais.youtube}`}
                          className={styles.socialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaYoutube className={styles.socialIcon} />
                        </a>
                      )}
                      {selectedMember.redesSociais.linkedin && (
                        <a 
                          href={`https://linkedin.com/in/${selectedMember.redesSociais.linkedin}`}
                          className={styles.socialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaLinkedin className={styles.socialIcon} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.modalCloseBtn} onClick={closeMemberModal}>
                Fechar Perfil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}