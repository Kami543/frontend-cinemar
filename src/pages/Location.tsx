import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaMapMarkerAlt,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaWaze,
  FaCar,
  FaBus,
  FaWalking,
  FaWheelchair,
  FaUniversalAccess,
  FaSignLanguage,
  FaLocationArrow,
  FaMap,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import { useTheme } from '../components/context/ThemeContext';
import styles from '../styles/Location.module.css';

// Interfaces
interface ScheduleItem {
  id: number;
  day: string;
  time: string;
  description: string;
}

interface DirectionItem {
  id: number;
  mode: string;
  description: string;
}

interface AccessibilityItem {
  id: number;
  text: string;
}

interface PartnershipItem {
  id: number;
  title: string;
  description: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  venueName: string;
  address: string;
  partnershipNote: string;
  accessibilityNote: string;
}

export default function Location() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [user, setUser] = useState<any>(null);

  // Dados editáveis
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '(88) 9999-9999',
    email: 'cinemarcamocim@gmail.com',
    venueName: 'Sindicato dos Pescadores e Pescadoras de Camocim',
    address: 'Rua EUA, 118 - Praia\nCamocim - Ceará\nCEP: 62400-000',
    partnershipNote: '* Em parceria com a ACCAL, algumas sessões especiais ocorrem na sede da Academia',
    accessibilityNote: 'Espaço preparado para receber todos com conforto e dignidade'
  });

  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { id: 1, day: "Sextas-feiras (quinzenal)", time: "19:30h", description: "Sessão principal com debate" },
    { id: 2, day: "Sábados (especial)", time: "16:00h", description: "Sessão da tarde (eventos especiais)" }
  ]);

  const [directions, setDirections] = useState<DirectionItem[]>([
    { id: 1, mode: "Carro", description: "Pela CE-085, acesso pela Av. Beira Mar, próximo ao centro da cidade" },
    { id: 2, mode: "Ônibus", description: "Linhas urbanas param na Rua EUA, desembarque em frente ao Sindicato" },
    { id: 3, mode: "A pé", description: "Localização central na Praia de Camocim, fácil acesso para moradores da região" }
  ]);

  const [accessibility, setAccessibility] = useState<AccessibilityItem[]>([
    { id: 1, text: "Acesso para cadeirantes" },
    { id: 2, text: "Espaço adaptado" },
    { id: 3, text: "Legendas descritivas (sob demanda)" }
  ]);

  const [partnerships, setPartnerships] = useState<PartnershipItem[]>([
    { id: 1, title: "ACCAL - Academia Camocinense", description: "Sede alternativa para sessões especiais e eventos culturais" },
    { id: 2, title: "Espaço Cultural", description: "Capacidade para 80 pessoas • Ar condicionado • Projetor HD" },
    { id: 3, title: "Estacionamento", description: "Estacionamento gratuito no local e fácil estacionamento nas proximidades" }
  ]);

  // Estados de edição
  const [editingContact, setEditingContact] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);
  const [editingDirectionId, setEditingDirectionId] = useState<number | null>(null);
  const [editingAccessibilityId, setEditingAccessibilityId] = useState<number | null>(null);
  const [editingPartnershipId, setEditingPartnershipId] = useState<number | null>(null);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [isAddingDirection, setIsAddingDirection] = useState(false);
  const [isAddingAccessibility, setIsAddingAccessibility] = useState(false);
  const [isAddingPartnership, setIsAddingPartnership] = useState(false);

  // Formulários de edição
  const [editContactForm, setEditContactForm] = useState<ContactInfo>(contactInfo);
  const [editScheduleForm, setEditScheduleForm] = useState<ScheduleItem>({ id: 0, day: '', time: '', description: '' });
  const [editDirectionForm, setEditDirectionForm] = useState<DirectionItem>({ id: 0, mode: '', description: '' });
  const [editAccessibilityForm, setEditAccessibilityForm] = useState<AccessibilityItem>({ id: 0, text: '' });
  const [editPartnershipForm, setEditPartnershipForm] = useState<PartnershipItem>({ id: 0, title: '', description: '' });
  
  const [newSchedule, setNewSchedule] = useState<Omit<ScheduleItem, 'id'>>({ day: '', time: '', description: '' });
  const [newDirection, setNewDirection] = useState<Omit<DirectionItem, 'id'>>({ mode: '', description: '' });
  const [newAccessibility, setNewAccessibility] = useState<Omit<AccessibilityItem, 'id'>>({ text: '' });
  const [newPartnership, setNewPartnership] = useState<Omit<PartnershipItem, 'id'>>({ title: '', description: '' });

  // Verificar usuário logado
  useEffect(() => {
    const storedUser = localStorage.getItem('cinemar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedContact = localStorage.getItem('cinemar_location_contact');
    if (savedContact) setContactInfo(JSON.parse(savedContact));
    const savedSchedule = localStorage.getItem('cinemar_location_schedule');
    if (savedSchedule) setSchedule(JSON.parse(savedSchedule));
    const savedDirections = localStorage.getItem('cinemar_location_directions');
    if (savedDirections) setDirections(JSON.parse(savedDirections));
    const savedAccessibility = localStorage.getItem('cinemar_location_accessibility');
    if (savedAccessibility) setAccessibility(JSON.parse(savedAccessibility));
    const savedPartnerships = localStorage.getItem('cinemar_location_partnerships');
    if (savedPartnerships) setPartnerships(JSON.parse(savedPartnerships));
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('cinemar_location_contact', JSON.stringify(contactInfo));
  }, [contactInfo]);
  useEffect(() => {
    localStorage.setItem('cinemar_location_schedule', JSON.stringify(schedule));
  }, [schedule]);
  useEffect(() => {
    localStorage.setItem('cinemar_location_directions', JSON.stringify(directions));
  }, [directions]);
  useEffect(() => {
    localStorage.setItem('cinemar_location_accessibility', JSON.stringify(accessibility));
  }, [accessibility]);
  useEffect(() => {
    localStorage.setItem('cinemar_location_partnerships', JSON.stringify(partnerships));
  }, [partnerships]);

  const isAdmin = user?.role === 'admin';

  // CRUD Contact
  const handleSaveContact = () => {
    setContactInfo(editContactForm);
    setEditingContact(false);
  };

  // CRUD Schedule
  const handleEditSchedule = (item: ScheduleItem) => {
    setEditScheduleForm(item);
    setEditingScheduleId(item.id);
  };

  const handleSaveSchedule = () => {
    setSchedule(schedule.map(s => s.id === editScheduleForm.id ? editScheduleForm : s));
    setEditingScheduleId(null);
  };

  const handleAddSchedule = () => {
    const newId = Math.max(...schedule.map(s => s.id), 0) + 1;
    setSchedule([...schedule, { ...newSchedule, id: newId }]);
    setNewSchedule({ day: '', time: '', description: '' });
    setIsAddingSchedule(false);
  };

  const handleDeleteSchedule = (id: number) => {
    setSchedule(schedule.filter(s => s.id !== id));
  };

  // CRUD Directions
  const handleEditDirection = (item: DirectionItem) => {
    setEditDirectionForm(item);
    setEditingDirectionId(item.id);
  };

  const handleSaveDirection = () => {
    setDirections(directions.map(d => d.id === editDirectionForm.id ? editDirectionForm : d));
    setEditingDirectionId(null);
  };

  const handleAddDirection = () => {
    const newId = Math.max(...directions.map(d => d.id), 0) + 1;
    setDirections([...directions, { ...newDirection, id: newId }]);
    setNewDirection({ mode: '', description: '' });
    setIsAddingDirection(false);
  };

  const handleDeleteDirection = (id: number) => {
    setDirections(directions.filter(d => d.id !== id));
  };

  // CRUD Accessibility
  const handleEditAccessibility = (item: AccessibilityItem) => {
    setEditAccessibilityForm(item);
    setEditingAccessibilityId(item.id);
  };

  const handleSaveAccessibility = () => {
    setAccessibility(accessibility.map(a => a.id === editAccessibilityForm.id ? editAccessibilityForm : a));
    setEditingAccessibilityId(null);
  };

  const handleAddAccessibility = () => {
    const newId = Math.max(...accessibility.map(a => a.id), 0) + 1;
    setAccessibility([...accessibility, { ...newAccessibility, id: newId }]);
    setNewAccessibility({ text: '' });
    setIsAddingAccessibility(false);
  };

  const handleDeleteAccessibility = (id: number) => {
    setAccessibility(accessibility.filter(a => a.id !== id));
  };

  // CRUD Partnerships
  const handleEditPartnership = (item: PartnershipItem) => {
    setEditPartnershipForm(item);
    setEditingPartnershipId(item.id);
  };

  const handleSavePartnership = () => {
    setPartnerships(partnerships.map(p => p.id === editPartnershipForm.id ? editPartnershipForm : p));
    setEditingPartnershipId(null);
  };

  const handleAddPartnership = () => {
    const newId = Math.max(...partnerships.map(p => p.id), 0) + 1;
    setPartnerships([...partnerships, { ...newPartnership, id: newId }]);
    setNewPartnership({ title: '', description: '' });
    setIsAddingPartnership(false);
  };

  const handleDeletePartnership = (id: number) => {
    setPartnerships(partnerships.filter(p => p.id !== id));
  };

  // Função para renderizar texto com quebras de linha
  const renderAddress = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  // Função para obter ícone do modo de transporte
  const getTransportIcon = (mode: string) => {
    const lowerMode = mode.toLowerCase();
    if (lowerMode.includes('carro')) return <FaCar />;
    if (lowerMode.includes('ônibus') || lowerMode.includes('onibus')) return <FaBus />;
    if (lowerMode.includes('pé') || lowerMode.includes('pe')) return <FaWalking />;
    return <FaMapMarkerAlt />;
  };

  return (
    <div className={`${styles.locationContainer} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* Header */}
      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={styles.backLink}>
              ← Voltar para Início
            </Link>
          </div>
          
          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>
              ONDE ESTAMOS
            </h1>
            <p className={styles.heroSubtitle}>
              Localização central na Praia de Camocim • Acesso fácil para toda comunidade
            </p>
          </div>
        </div>
      </header>

      {/* Botão flutuante de adicionar (apenas admin) */}
      {isAdmin && (
        <button
          className={styles.floatingAddBtn}
          onClick={() => setIsAddingSchedule(true)}
          title="Adicionar conteúdo"
        >
          <FaPlus />
        </button>
      )}

      <main className={styles.mainContent}>
        <div className={styles.contentGrid}>
          
          {/* Coluna Esquerda - Informações */}
          <div className={styles.infoColumn}>
            
            {/* Card: Endereço */}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <FaBuilding className={styles.cardIcon} />
                <h2 className={styles.cardTitle}>NOSSA SEDE</h2>
                {isAdmin && !editingContact && (
                  <button onClick={() => { setEditContactForm(contactInfo); setEditingContact(true); }} className={styles.editIconBtn}>
                    <FaEdit />
                  </button>
                )}
              </div>
              <div className={styles.cardContent}>
                {editingContact && isAdmin ? (
                  <div className={styles.editForm}>
                    <input
                      type="text"
                      value={editContactForm.venueName}
                      onChange={(e) => setEditContactForm({ ...editContactForm, venueName: e.target.value })}
                      className={styles.editInput}
                      placeholder="Nome do local"
                    />
                    <textarea
                      value={editContactForm.address}
                      onChange={(e) => setEditContactForm({ ...editContactForm, address: e.target.value })}
                      className={styles.editTextarea}
                      rows={3}
                      placeholder="Endereço"
                    />
                    <input
                      type="text"
                      value={editContactForm.phone}
                      onChange={(e) => setEditContactForm({ ...editContactForm, phone: e.target.value })}
                      className={styles.editInput}
                      placeholder="Telefone"
                    />
                    <input
                      type="email"
                      value={editContactForm.email}
                      onChange={(e) => setEditContactForm({ ...editContactForm, email: e.target.value })}
                      className={styles.editInput}
                      placeholder="E-mail"
                    />
                    <div className={styles.editActions}>
                      <button onClick={handleSaveContact} className={styles.saveBtn}><FaSave /> Salvar</button>
                      <button onClick={() => setEditingContact(false)} className={styles.cancelBtn}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.venueName}>{contactInfo.venueName}</div>
                    <address className={styles.address}>{renderAddress(contactInfo.address)}</address>
                    <div className={styles.contactInfo}>
                      <Link to={`tel:${contactInfo.phone}`} className={styles.contactLink}>
                        <div className={styles.contactItem}>
                          <FaPhone className={styles.contactIcon} />
                          <div className={styles.contactDetails}>
                            <span className={styles.contactLabel}>Telefone</span>
                            <span className={styles.contactValue}>{contactInfo.phone}</span>
                          </div>
                        </div>
                      </Link>
                      <Link to={`mailto:${contactInfo.email}`} className={styles.contactLink}>
                        <div className={styles.contactItem}>
                          <FaEnvelope className={styles.contactIcon} />
                          <div className={styles.contactDetails}>
                            <span className={styles.contactLabel}>E-mail</span>
                            <span className={styles.contactValue}>{contactInfo.email}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Card: Horários das Sessões */}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <FaCalendarAlt className={styles.cardIcon} />
                <h2 className={styles.cardTitle}>HORÁRIOS DAS SESSÕES</h2>
                {isAdmin && (
                  <button onClick={() => setIsAddingSchedule(true)} className={styles.addIconBtn}>
                    <FaPlus />
                  </button>
                )}
              </div>
              <div className={styles.cardContent}>
                {schedule.map((item) => (
                  <div key={item.id} className={styles.scheduleItem}>
                    {editingScheduleId === item.id && isAdmin ? (
                      <div className={styles.editInline}>
                        <input
                          type="text"
                          value={editScheduleForm.day}
                          onChange={(e) => setEditScheduleForm({ ...editScheduleForm, day: e.target.value })}
                          className={styles.editInput}
                          placeholder="Dia"
                        />
                        <input
                          type="text"
                          value={editScheduleForm.time}
                          onChange={(e) => setEditScheduleForm({ ...editScheduleForm, time: e.target.value })}
                          className={styles.editInput}
                          placeholder="Horário"
                        />
                        <input
                          type="text"
                          value={editScheduleForm.description}
                          onChange={(e) => setEditScheduleForm({ ...editScheduleForm, description: e.target.value })}
                          className={styles.editInput}
                          placeholder="Descrição"
                        />
                        <div className={styles.editActionsInline}>
                          <button onClick={handleSaveSchedule} className={styles.saveBtn}><FaSave /></button>
                          <button onClick={() => setEditingScheduleId(null)} className={styles.cancelBtn}><FaTimes /></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <FaClock className={styles.scheduleIcon} />
                        <div>
                          <strong>{item.day}</strong>
                          <p>{item.time} • {item.description}</p>
                        </div>
                        {isAdmin && (
                          <div className={styles.itemActions}>
                            <button onClick={() => handleEditSchedule(item)} className={styles.editCardBtn}><FaEdit /></button>
                            <button onClick={() => handleDeleteSchedule(item.id)} className={styles.deleteCardBtn}><FaTrash /></button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
                <div className={styles.partnershipNote}>{contactInfo.partnershipNote}</div>
              </div>
            </div>

            {/* Card: Acessibilidade */}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <FaUniversalAccess className={styles.cardIcon} />
                <h2 className={styles.cardTitle}>ACESSIBILIDADE</h2>
                {isAdmin && (
                  <button onClick={() => setIsAddingAccessibility(true)} className={styles.addIconBtn}>
                    <FaPlus />
                  </button>
                )}
              </div>
              <div className={styles.cardContent}>
                <div className={styles.accessibilityBadges}>
                  {accessibility.map((item) => (
                    <div key={item.id} className={styles.badge}>
                      {editingAccessibilityId === item.id && isAdmin ? (
                        <div className={styles.editInline}>
                          <input
                            type="text"
                            value={editAccessibilityForm.text}
                            onChange={(e) => setEditAccessibilityForm({ ...editAccessibilityForm, text: e.target.value })}
                            className={styles.editInput}
                          />
                          <div className={styles.editActionsInline}>
                            <button onClick={handleSaveAccessibility} className={styles.saveBtn}><FaSave /></button>
                            <button onClick={() => setEditingAccessibilityId(null)} className={styles.cancelBtn}><FaTimes /></button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {item.icon || <FaWheelchair />}
                          <span>{item.text}</span>
                          {isAdmin && (
                            <div className={styles.itemActionsInline}>
                              <button onClick={() => handleEditAccessibility(item)} className={styles.editCardBtn}><FaEdit /></button>
                              <button onClick={() => handleDeleteAccessibility(item.id)} className={styles.deleteCardBtn}><FaTrash /></button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className={styles.partnershipNote}>{contactInfo.accessibilityNote}</div>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Mapa e Direções */}
          <div className={styles.mapColumn}>
            
            {/* Card: Mapa */}
            <div className={styles.mapCard}>
              <div className={styles.cardHeader}>
                <FaMap className={styles.cardIcon} />
                <h2 className={styles.cardTitle}>LOCALIZAÇÃO NO MAPA</h2>
              </div>
              <div className={styles.mapContainer}>
                <iframe 
                  className={styles.mapIframe}
                  title="Mapa de localização do CineMar - Sindicato dos Pescadores de Camocim"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.757748601503!2d-40.852000!3d-2.900000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7e9a8e6d5c4b3a1%3A0x0!2zMsKwNTQnMDAuMCJTIDQwwrAwLTUxJzEyLjAiVw!5e0!3m2!1spt-BR!2sbr!4v1641234567890!5m2!1spt-BR!2sbr"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className={styles.mapActions}>
                <Link 
                  to="https://www.google.com/maps/dir/?api=1&destination=Sindicato+dos+Pescadores+Camocim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapButton}
                >
                  <FaLocationArrow />
                  Google Maps
                </Link>
                <Link 
                  to="https://waze.com/ul?q=Sindicato+dos+Pescadores+Camocim&navigate=yes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.mapButton} ${styles.wazeButton}`}
                >
                  <FaWaze />
                  Waze
                </Link>
              </div>
            </div>

            {/* Card: Como Chegar */}
            <div className={styles.howToGetCard}>
              <h3 className={styles.howToGetTitle}>
                <FaLocationArrow className={styles.howToGetIcon} />
                COMO CHEGAR
              </h3>
              {isAdmin && (
                <button onClick={() => setIsAddingDirection(true)} className={styles.addInlineBtn}>
                  <FaPlus /> Adicionar
                </button>
              )}
              <div className={styles.directionsList}>
                {directions.map((item) => (
                  <div key={item.id} className={styles.directionItem}>
                    {editingDirectionId === item.id && isAdmin ? (
                      <div className={styles.editInline}>
                        <input
                          type="text"
                          value={editDirectionForm.mode}
                          onChange={(e) => setEditDirectionForm({ ...editDirectionForm, mode: e.target.value })}
                          className={styles.editInput}
                          placeholder="Modo"
                        />
                        <input
                          type="text"
                          value={editDirectionForm.description}
                          onChange={(e) => setEditDirectionForm({ ...editDirectionForm, description: e.target.value })}
                          className={styles.editInput}
                          placeholder="Descrição"
                        />
                        <div className={styles.editActionsInline}>
                          <button onClick={handleSaveDirection} className={styles.saveBtn}><FaSave /></button>
                          <button onClick={() => setEditingDirectionId(null)} className={styles.cancelBtn}><FaTimes /></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <strong>{getTransportIcon(item.mode)} {item.mode}</strong>
                        <p>{item.description}</p>
                        {isAdmin && (
                          <div className={styles.itemActions}>
                            <button onClick={() => handleEditDirection(item)} className={styles.editCardBtn}><FaEdit /></button>
                            <button onClick={() => handleDeleteDirection(item.id)} className={styles.deleteCardBtn}><FaTrash /></button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Card: Informações Adicionais / Parcerias */}
            <div className={styles.howToGetCard}>
              <h3 className={styles.howToGetTitle}>
                <FaBuilding className={styles.howToGetIcon} />
                PARCERIA ESTRATÉGICA
              </h3>
              {isAdmin && (
                <button onClick={() => setIsAddingPartnership(true)} className={styles.addInlineBtn}>
                  <FaPlus /> Adicionar
                </button>
              )}
              <div className={styles.directionsList}>
                {partnerships.map((item) => (
                  <div key={item.id} className={styles.directionItem}>
                    {editingPartnershipId === item.id && isAdmin ? (
                      <div className={styles.editInline}>
                        <input
                          type="text"
                          value={editPartnershipForm.title}
                          onChange={(e) => setEditPartnershipForm({ ...editPartnershipForm, title: e.target.value })}
                          className={styles.editInput}
                          placeholder="Título"
                        />
                        <input
                          type="text"
                          value={editPartnershipForm.description}
                          onChange={(e) => setEditPartnershipForm({ ...editPartnershipForm, description: e.target.value })}
                          className={styles.editInput}
                          placeholder="Descrição"
                        />
                        <div className={styles.editActionsInline}>
                          <button onClick={handleSavePartnership} className={styles.saveBtn}><FaSave /></button>
                          <button onClick={() => setEditingPartnershipId(null)} className={styles.cancelBtn}><FaTimes /></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <strong>{item.title}</strong>
                        <p>{item.description}</p>
                        {isAdmin && (
                          <div className={styles.itemActions}>
                            <button onClick={() => handleEditPartnership(item)} className={styles.editCardBtn}><FaEdit /></button>
                            <button onClick={() => handleDeletePartnership(item.id)} className={styles.deleteCardBtn}><FaTrash /></button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modais de adicionar */}
      {isAddingSchedule && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Adicionar Horário</h3>
            <input type="text" placeholder="Dia" value={newSchedule.day} onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value })} className={styles.editInput} />
            <input type="text" placeholder="Horário" value={newSchedule.time} onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })} className={styles.editInput} />
            <input type="text" placeholder="Descrição" value={newSchedule.description} onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })} className={styles.editInput} />
            <div className={styles.editActions}>
              <button onClick={handleAddSchedule} className={styles.saveBtn}>Adicionar</button>
              <button onClick={() => setIsAddingSchedule(false)} className={styles.cancelBtn}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isAddingDirection && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Adicionar Direção</h3>
            <input type="text" placeholder="Modo (Ex: Carro, Ônibus, A pé)" value={newDirection.mode} onChange={(e) => setNewDirection({ ...newDirection, mode: e.target.value })} className={styles.editInput} />
            <input type="text" placeholder="Descrição" value={newDirection.description} onChange={(e) => setNewDirection({ ...newDirection, description: e.target.value })} className={styles.editInput} />
            <div className={styles.editActions}>
              <button onClick={handleAddDirection} className={styles.saveBtn}>Adicionar</button>
              <button onClick={() => setIsAddingDirection(false)} className={styles.cancelBtn}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isAddingAccessibility && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Adicionar Acessibilidade</h3>
            <input type="text" placeholder="Texto" value={newAccessibility.text} onChange={(e) => setNewAccessibility({ ...newAccessibility, text: e.target.value })} className={styles.editInput} />
            <div className={styles.editActions}>
              <button onClick={handleAddAccessibility} className={styles.saveBtn}>Adicionar</button>
              <button onClick={() => setIsAddingAccessibility(false)} className={styles.cancelBtn}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isAddingPartnership && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Adicionar Parceria</h3>
            <input type="text" placeholder="Título" value={newPartnership.title} onChange={(e) => setNewPartnership({ ...newPartnership, title: e.target.value })} className={styles.editInput} />
            <input type="text" placeholder="Descrição" value={newPartnership.description} onChange={(e) => setNewPartnership({ ...newPartnership, description: e.target.value })} className={styles.editInput} />
            <div className={styles.editActions}>
              <button onClick={handleAddPartnership} className={styles.saveBtn}>Adicionar</button>
              <button onClick={() => setIsAddingPartnership(false)} className={styles.cancelBtn}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}