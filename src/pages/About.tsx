import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowLeft, FaHandshake, FaUsers, FaChartLine,
  FaQuoteLeft, FaQuoteRight, FaCalendarAlt,
  FaBullhorn, FaLightbulb, FaFilm, FaEdit, FaTrash,
  FaSave, FaTimes, FaPlus, FaUserShield,
  FaStar, FaAward, FaBook, FaVideo, FaMusic
} from 'react-icons/fa';
import { useTheme } from '../components/context/ThemeContext';
import styles from '../styles/About.module.css';

interface Member {
  id: number;
  name: string;
  role: string;
  initials: string;
}

interface Partnership {
  id: number;
  name: string;
  type: string;
  description: string;
}

interface Objective {
  id: number;
  text: string;
}

export default function About() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [user, setUser] = useState<any>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Estados para edição
  const [isEditingHistory, setIsEditingHistory] = useState(false);
  const [editHistory, setEditHistory] = useState('');
  
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [editQuote, setEditQuote] = useState('');
  const [editQuoteAuthor, setEditQuoteAuthor] = useState('');
  
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: 'Luiz Seixas', role: 'Coordenador & Professor de Sociologia', initials: 'LS' },
    { id: 2, name: 'Renato Silva', role: 'Coordenador & Professor de Sociologia', initials: 'RS' },
    { id: 3, name: 'Marcelo Lima', role: 'Professor de História & Cofundador', initials: 'ML' },
    { id: 4, name: 'Victor Kelves', role: 'Estudante & Colaborador Fundador', initials: 'VK' },
    { id: 5, name: 'Daniela Lopes', role: 'Estudante & Colaboradora Fundadora', initials: 'DL' },
    { id: 6, name: 'Manoel Silva', role: 'Presidente do Sindicato dos Pescadores', initials: 'MS' },
    { id: 7, name: 'Francisco', role: 'Vice-Presidente do Sindicato', initials: 'FR' },
    { id: 8, name: 'Santhiago Pontes', role: 'Presidente da ACCAL', initials: 'SP' },
    { id: 9, name: 'Cassiano Ricardo', role: 'Professor do IFCE Camocim', initials: 'CR' },
  ]);

  const [partnerships, setPartnerships] = useState<Partnership[]>([
    {
      id: 1,
      name: 'Sindicato dos Pescadores e Pescadoras de Camocim',
      type: 'Sede Principal',
      description: 'Auditório onde nasceu o CineMar e onde são realizadas as sessões quinzenais.',
    },
    {
      id: 2,
      name: 'ACCAL - Academia Camocinense de Ciências, Artes e Letras',
      type: 'Parceria Cultural',
      description: 'Local para sessões especiais sob o franqueamento do professor Santhiago Pontes.',
    },
    {
      id: 3,
      name: 'IFCE - Instituto Federal do Ceará (Campus Camocim)',
      type: 'Parceria Institucional',
      description: 'Busca de formalização como projeto de extensão através do professor Cassiano Ricardo.',
    },
    {
      id: 4,
      name: 'Cunversa Podcast',
      type: 'Divulgação',
      description: 'Espaço de discussão sobre cineclubismo e divulgação das atividades do CineMar.',
    },
  ]);

  const [objectives, setObjectives] = useState<Objective[]>([
    { id: 1, text: 'Estabelecer-se como projeto de Extensão do Instituto Federal do Ceará' },
    { id: 2, text: 'Expandir o alcance para diferentes bairros de Camocim' },
    { id: 3, text: 'Realizar oficinas de audiovisual para a comunidade' },
    { id: 4, text: 'Consolidar parcerias permanentes' },
    { id: 5, text: 'Registro das histórias dos pescadores e da comunidade' },
    { id: 6, text: 'Primeiro festival de cinema comunitário de Camocim' },
  ]);

  const [quote, setQuote] = useState({
    text: 'Esperamos que as ações do cineclube tenham vida longa e que sua efetividade perdure por bom tempo em Camocim. Porque o cinema é, acima de tudo, um encontro.',
    author: 'Equipe CineMar, 2026'
  });

  // Estados para modais de edição
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editingPartnership, setEditingPartnership] = useState<Partnership | null>(null);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isAddingPartnership, setIsAddingPartnership] = useState(false);
  const [isAddingObjective, setIsAddingObjective] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '', initials: '' });
  const [newPartnership, setNewPartnership] = useState({ name: '', type: '', description: '' });
  const [newObjective, setNewObjective] = useState('');

  // História inicial
  const initialHistory = `A ideia surgiu em meados de 2023 quando os professores de Sociologia **Luiz Seixas**, **Renato Silva** e o de História **Marcelo Lima** resolveram criar um cineclube na cidade de Camocim (CE).

A proposta inicial tinha como objetivo criar um espaço de fomento à cultura audiovisual na cidade, com destaque para a prática do cineclubismo.

O projeto ficou fermentando nas intenções de seus proponentes até março de 2025 quando, finalmente, os professores Luiz Seixas, Renato Silva e os estudantes Victor Kelves e Daniela Lopes, junto com o presidente e vice-presidente do Sindicato dos Pescadores e Pescadoras de Camocim, respectivamente, sr. Manoel Silva e sr. Francisco, reuniram-se no auditório do sindicato para debater a viabilidade da proposta.

Na reunião, foi decidido que as sessões seriam realizadas quinzenalmente. A princípio, o nome do cineclube seria CineSind. Em seguida, ventilou-se a possibilidade de outros nomes até que a discente Daniela Lopes batizou o cineclube com o nome que possui até hoje: **CineMar**.
`;

  const [history, setHistory] = useState(initialHistory);

  // Observer para animações de scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-section');
          if (id) {
            setVisibleSections((prev) => {
              const newSet = new Set(prev);
              if (entry.isIntersecting) {
                newSet.add(id);
              } else {
                newSet.delete(id);
              }
              return newSet;
            });
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // REMOVIDO: useEffect do tema (agora é global via ThemeContext)
  // O tema não precisa mais ser salvo manualmente

  // Verificar usuário logado
  useEffect(() => {
    const storedUser = localStorage.getItem('cinemar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('cinemar_about_history');
    if (savedHistory) setHistory(savedHistory);
    
    const savedMembers = localStorage.getItem('cinemar_about_members');
    if (savedMembers) setMembers(JSON.parse(savedMembers));
    
    const savedPartnerships = localStorage.getItem('cinemar_about_partnerships');
    if (savedPartnerships) setPartnerships(JSON.parse(savedPartnerships));
    
    const savedObjectives = localStorage.getItem('cinemar_about_objectives');
    if (savedObjectives) setObjectives(JSON.parse(savedObjectives));
    
    const savedQuote = localStorage.getItem('cinemar_about_quote');
    if (savedQuote) setQuote(JSON.parse(savedQuote));
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('cinemar_about_history', history);
  }, [history]);

  useEffect(() => {
    localStorage.setItem('cinemar_about_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('cinemar_about_partnerships', JSON.stringify(partnerships));
  }, [partnerships]);

  useEffect(() => {
    localStorage.setItem('cinemar_about_objectives', JSON.stringify(objectives));
  }, [objectives]);

  useEffect(() => {
    localStorage.setItem('cinemar_about_quote', JSON.stringify(quote));
  }, [quote]);

  const isAdmin = user?.role === 'admin';

  // Funções de edição da história
  const handleSaveHistory = () => {
    setHistory(editHistory);
    setIsEditingHistory(false);
  };

  // Funções de edição da citação
  const handleSaveQuote = () => {
    setQuote({ text: editQuote, author: editQuoteAuthor });
    setIsEditingQuote(false);
  };

  // CRUD Membros
  const handleAddMember = () => {
    if (!newMember.name || !newMember.role) return;
    const newId = Math.max(...members.map(m => m.id), 0) + 1;
    const initials = newMember.initials || newMember.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    setMembers([...members, { ...newMember, id: newId, initials }]);
    setNewMember({ name: '', role: '', initials: '' });
    setIsAddingMember(false);
  };

  const handleUpdateMember = () => {
    if (!editingMember) return;
    setMembers(members.map(m => m.id === editingMember.id ? editingMember : m));
    setEditingMember(null);
  };

  const handleDeleteMember = (id: number) => {
    setMembers(members.filter(m => m.id !== id));
  };

  // CRUD Parcerias
  const handleAddPartnership = () => {
    if (!newPartnership.name) return;
    const newId = Math.max(...partnerships.map(p => p.id), 0) + 1;
    setPartnerships([...partnerships, { ...newPartnership, id: newId }]);
    setNewPartnership({ name: '', type: '', description: '' });
    setIsAddingPartnership(false);
  };

  const handleUpdatePartnership = () => {
    if (!editingPartnership) return;
    setPartnerships(partnerships.map(p => p.id === editingPartnership.id ? editingPartnership : p));
    setEditingPartnership(null);
  };

  const handleDeletePartnership = (id: number) => {
    setPartnerships(partnerships.filter(p => p.id !== id));
  };

  // CRUD Objetivos
  const handleAddObjective = () => {
    if (!newObjective) return;
    const newId = Math.max(...objectives.map(o => o.id), 0) + 1;
    setObjectives([...objectives, { id: newId, text: newObjective }]);
    setNewObjective('');
    setIsAddingObjective(false);
  };

  const handleUpdateObjective = () => {
    if (!editingObjective) return;
    setObjectives(objectives.map(o => o.id === editingObjective.id ? editingObjective : o));
    setEditingObjective(null);
  };

  const handleDeleteObjective = (id: number) => {
    setObjectives(objectives.filter(o => o.id !== id));
  };

  // Renderizar texto com markdown simples
  const renderText = (text: string) => {
    return text.split('\n\n').map((paragraph, i) => {
      const formatted = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ''}`}>

      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={styles.backLink}>
              ← Voltar para Início
            </Link>
          </div>

          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>CineMar Camocim</h1>
            <p className={styles.heroSubtitle}>
              Um cineclube dedicado à exibição, discussão e formação crítica através do
              audiovisual em Camocim, Ceará.
            </p>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>

        {/* História */}
        <section 
          ref={(el) => (sectionRefs.current['history'] = el)}
          data-section="history"
          className={`${styles.contentSection} ${visibleSections.has('history') ? styles.visible : ''}`}
        >
          <div className={styles.sectionHeader}>
            <FaFilm className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Nossa História</h2>
            {isAdmin && !isEditingHistory && (
              <button 
                className={styles.editIconBtn}
                onClick={() => { setEditHistory(history); setIsEditingHistory(true); }}
              >
                <FaEdit />
              </button>
            )}
          </div>

          {isEditingHistory && isAdmin ? (
            <div className={styles.editForm}>
              <textarea
                value={editHistory}
                onChange={(e) => setEditHistory(e.target.value)}
                rows={12}
                className={styles.editTextarea}
              />
              <div className={styles.editActions}>
                <button onClick={handleSaveHistory} className={styles.saveBtn}><FaSave /> Salvar</button>
                <button onClick={() => setIsEditingHistory(false)} className={styles.cancelBtn}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div className={styles.textBlock}>{renderText(history)}</div>
          )}
        </section>

        {/* Marcos Importantes */}
        <section 
          ref={(el) => (sectionRefs.current['timeline'] = el)}
          data-section="timeline"
          className={`${styles.contentSection} ${visibleSections.has('timeline') ? styles.visible : ''}`}
        >
          <div className={styles.sectionHeader}>
            <FaCalendarAlt className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Marcos Importantes</h2>
          </div>

          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <span className={styles.timelineYear}>Março 2025 – Fevereiro 2026</span>
              <h3 className={styles.timelineTitle}>Sessões Realizadas</h3>
              <p className={styles.timelineDescription}>
                Mais de uma dezena de exibições de filmes nacionais, internacionais e documentários.
                Uma das sessões ocorreu na ACCAL sob o franqueamento do professor Santhiago Pontes.
              </p>
            </div>

            <div className={styles.timelineItem}>
              <span className={styles.timelineYear}>2025</span>
              <h3 className={styles.timelineTitle}>Participação no Cunversa Podcast</h3>
              <p className={styles.timelineDescription}>
                Os professores Renato Silva e Luiz Seixas participaram do Cunversa Podcast (Ep#87),
                narrando a história do CineMar e falando sobre suas formações no cineclubismo.
              </p>
            </div>
          </div>
        </section>

        {/* Parcerias */}
        <section 
          ref={(el) => (sectionRefs.current['partnerships'] = el)}
          data-section="partnerships"
          className={`${styles.contentSection} ${visibleSections.has('partnerships') ? styles.visible : ''}`}
        >
          <div className={styles.sectionHeader}>
            <FaHandshake className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Nossas Parcerias</h2>
            {isAdmin && (
              <button className={styles.addBtn} onClick={() => setIsAddingPartnership(true)}>
                <FaPlus /> Adicionar
              </button>
            )}
          </div>

          <div className={styles.partnershipGrid}>
            {partnerships.map((partner) => (
              <div key={partner.id} className={styles.partnershipCard}>
                {isAdmin && editingPartnership?.id === partner.id ? (
                  <div className={styles.editForm}>
                    <input
                      type="text"
                      value={editingPartnership.name}
                      onChange={(e) => setEditingPartnership({ ...editingPartnership, name: e.target.value })}
                      placeholder="Nome"
                      className={styles.editInput}
                    />
                    <input
                      type="text"
                      value={editingPartnership.type}
                      onChange={(e) => setEditingPartnership({ ...editingPartnership, type: e.target.value })}
                      placeholder="Tipo"
                      className={styles.editInput}
                    />
                    <textarea
                      value={editingPartnership.description}
                      onChange={(e) => setEditingPartnership({ ...editingPartnership, description: e.target.value })}
                      placeholder="Descrição"
                      rows={2}
                      className={styles.editTextarea}
                    />
                    <div className={styles.editActions}>
                      <button onClick={handleUpdatePartnership} className={styles.saveBtn}><FaSave /> Salvar</button>
                      <button onClick={() => setEditingPartnership(null)} className={styles.cancelBtn}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.partnerIconWrapper}>
                      <FaBullhorn className={styles.partnershipLogo} />
                    </div>
                    <h3 className={styles.partnershipName}>{partner.name}</h3>
                    <span className={styles.partnershipType}>{partner.type}</span>
                    <p className={styles.partnershipDescription}>{partner.description}</p>
                    {isAdmin && (
                      <div className={styles.cardActions}>
                        <button onClick={() => setEditingPartnership(partner)} className={styles.editCardBtn}><FaEdit /></button>
                        <button onClick={() => handleDeletePartnership(partner.id)} className={styles.deleteCardBtn}><FaTrash /></button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {isAddingPartnership && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h3>Adicionar Parceria</h3>
                <input type="text" placeholder="Nome" value={newPartnership.name} onChange={(e) => setNewPartnership({ ...newPartnership, name: e.target.value })} className={styles.editInput} />
                <input type="text" placeholder="Tipo" value={newPartnership.type} onChange={(e) => setNewPartnership({ ...newPartnership, type: e.target.value })} className={styles.editInput} />
                <textarea placeholder="Descrição" value={newPartnership.description} onChange={(e) => setNewPartnership({ ...newPartnership, description: e.target.value })} rows={3} className={styles.editTextarea} />
                <div className={styles.editActions}>
                  <button onClick={handleAddPartnership} className={styles.saveBtn}>Adicionar</button>
                  <button onClick={() => setIsAddingPartnership(false)} className={styles.cancelBtn}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Equipe */}
        <section 
          ref={(el) => (sectionRefs.current['team'] = el)}
          data-section="team"
          className={`${styles.contentSection} ${visibleSections.has('team') ? styles.visible : ''}`}
        >
          <div className={styles.sectionHeader}>
            <FaUsers className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Nossa Equipe</h2>
            {isAdmin && (
              <button className={styles.addBtn} onClick={() => setIsAddingMember(true)}>
                <FaPlus /> Adicionar
              </button>
            )}
          </div>

          <ul className={styles.memberGrid}>
            {members.map((member) => (
              <li key={member.id} className={styles.memberCard}>
                {isAdmin && editingMember?.id === member.id ? (
                  <div className={styles.editForm}>
                    <input type="text" value={editingMember.name} onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })} placeholder="Nome" className={styles.editInput} />
                    <input type="text" value={editingMember.role} onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })} placeholder="Cargo" className={styles.editInput} />
                    <input type="text" value={editingMember.initials} onChange={(e) => setEditingMember({ ...editingMember, initials: e.target.value })} placeholder="Iniciais" className={styles.editInput} />
                    <div className={styles.editActions}>
                      <button onClick={handleUpdateMember} className={styles.saveBtn}><FaSave /> Salvar</button>
                      <button onClick={() => setEditingMember(null)} className={styles.cancelBtn}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.memberHeader}>
                      <div className={styles.memberAvatar}>{member.initials}</div>
                      <div className={styles.memberInfo}>
                        <h3 className={styles.memberName}>{member.name}</h3>
                        <span className={styles.memberRole}>{member.role}</span>
                      </div>
                    </div>
                    <p className={styles.memberDescription}>Contribui ativamente para o crescimento do CineMar.</p>
                    {isAdmin && (
                      <div className={styles.cardActions}>
                        <button onClick={() => setEditingMember(member)} className={styles.editCardBtn}><FaEdit /></button>
                        <button onClick={() => handleDeleteMember(member.id)} className={styles.deleteCardBtn}><FaTrash /></button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>

          {isAddingMember && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h3>Adicionar Membro</h3>
                <input type="text" placeholder="Nome" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} className={styles.editInput} />
                <input type="text" placeholder="Cargo" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} className={styles.editInput} />
                <input type="text" placeholder="Iniciais (opcional)" value={newMember.initials} onChange={(e) => setNewMember({ ...newMember, initials: e.target.value })} className={styles.editInput} />
                <div className={styles.editActions}>
                  <button onClick={handleAddMember} className={styles.saveBtn}>Adicionar</button>
                  <button onClick={() => setIsAddingMember(false)} className={styles.cancelBtn}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Perspectivas futuras */}
        <section 
          ref={(el) => (sectionRefs.current['future'] = el)}
          data-section="future"
          className={`${styles.contentSection} ${visibleSections.has('future') ? styles.visible : ''}`}
        >
          <div className={styles.sectionHeader}>
            <FaChartLine className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Perspectivas Futuras</h2>
            {isAdmin && (
              <button className={styles.addBtn} onClick={() => setIsAddingObjective(true)}>
                <FaPlus /> Adicionar
              </button>
            )}
          </div>

          <div className={styles.textBlock}>
            <p>O CineMar continua com as suas propostas de intervenção cultural no município de Camocim (CE), buscando estreitar parcerias na cidade e angariar novos participantes.</p>
          </div>

          <ul className={styles.objectivesList}>
            {objectives.map((obj) => (
              <li key={obj.id} className={styles.objectiveItem}>
                {isAdmin && editingObjective?.id === obj.id ? (
                  <div className={styles.editInline}>
                    <input type="text" value={editingObjective.text} onChange={(e) => setEditingObjective({ ...editingObjective, text: e.target.value })} className={styles.editInput} />
                    <div className={styles.editActionsInline}>
                      <button onClick={handleUpdateObjective} className={styles.saveBtn}><FaSave /></button>
                      <button onClick={() => setEditingObjective(null)} className={styles.cancelBtn}><FaTimes /></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <FaLightbulb className={styles.objectiveIcon} />
                    <span className={styles.objectiveText}>{obj.text}</span>
                    {isAdmin && (
                      <div className={styles.inlineActions}>
                        <button onClick={() => setEditingObjective(obj)} className={styles.editInlineBtn}><FaEdit /></button>
                        <button onClick={() => handleDeleteObjective(obj.id)} className={styles.deleteInlineBtn}><FaTrash /></button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>

          {isAddingObjective && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h3>Adicionar Objetivo</h3>
                <input type="text" placeholder="Objetivo" value={newObjective} onChange={(e) => setNewObjective(e.target.value)} className={styles.editInput} />
                <div className={styles.editActions}>
                  <button onClick={handleAddObjective} className={styles.saveBtn}>Adicionar</button>
                  <button onClick={() => setIsAddingObjective(false)} className={styles.cancelBtn}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Citação */}
        <section 
          ref={(el) => (sectionRefs.current['quote'] = el)}
          data-section="quote"
          className={`${styles.quoteSection} ${visibleSections.has('quote') ? styles.visible : ''}`}
        >
          <div className={styles.quoteHeader}>
            {isAdmin && !isEditingQuote && (
              <button className={styles.editQuoteBtn} onClick={() => { setEditQuote(quote.text); setEditQuoteAuthor(quote.author); setIsEditingQuote(true); }}>
                <FaEdit /> Editar
              </button>
            )}
          </div>
          {isEditingQuote && isAdmin ? (
            <div className={styles.editForm}>
              <textarea value={editQuote} onChange={(e) => setEditQuote(e.target.value)} rows={4} className={styles.editTextarea} />
              <input type="text" value={editQuoteAuthor} onChange={(e) => setEditQuoteAuthor(e.target.value)} placeholder="Autor" className={styles.editInput} />
              <div className={styles.editActions}>
                <button onClick={handleSaveQuote} className={styles.saveBtn}><FaSave /> Salvar</button>
                <button onClick={() => setIsEditingQuote(false)} className={styles.cancelBtn}>Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <blockquote className={styles.quote}>
                <FaQuoteLeft className={styles.quoteIconLeft} /> {quote.text} <FaQuoteRight className={styles.quoteIconRight} />
              </blockquote>
              <p className={styles.quoteAuthor}>— {quote.author}</p>
            </>
          )}
        </section>

        {/* Ações */}
        <nav className={styles.actions}>
          <Link to="/filmes" className={styles.primaryButton}>
            <FaFilm /> Ver Catálogo de Filmes
          </Link>
          <Link to="/eventos" className={styles.secondaryButton}>
            <FaCalendarAlt /> Próximas Sessões
          </Link>
        </nav>

      </main>
    </div>
  );
}