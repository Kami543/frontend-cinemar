// Contact.tsx - Versão completa com painel de mensagens
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt,
  FaPaperPlane,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaPlus,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaInbox,
  FaEye,
  FaReply,
  FaSpinner
} from 'react-icons/fa';
import { useTheme } from '../components/context/ThemeContext';
import styles from '../styles/Contact.module.css';

interface ContactInfo {
  id: number;
  title: string;
  details: string[];
  link?: string;
}

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface Message {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
  data: string;
  lida: boolean;
  resposta?: string;
}

const getIconByTitle = (title: string) => {
  switch (title) {
    case 'E-mail': return <FaEnvelope />;
    case 'Telefone': return <FaPhone />;
    case 'Localização': return <FaMapMarkerAlt />;
    case 'Horário': return <FaClock />;
    default: return <FaEnvelope />;
  }
};

export default function Contact() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showMessagesPanel, setShowMessagesPanel] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  // Edit states
  const [editingContactId, setEditingContactId] = useState<number | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);

  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([
    {
      id: 1,
      title: 'E-mail',
      details: ['cinemar.camocim@gmail.com'],
      link: 'mailto:cinemar.camocim@gmail.com'
    },
    {
      id: 2,
      title: 'Telefone',
      details: ['(88) 99999-9999', '(88) 99999-8888'],
      link: 'tel:+5588999999999'
    },
    {
      id: 3,
      title: 'Localização',
      details: ['Sindicato dos Pescadores', 'Rua Estados Unidos, 118 - Camocim, CE'],
      link: 'https://maps.google.com/?q=Rua+Estados+Unidos+118+Camocim+CE'
    },
    {
      id: 4,
      title: 'Horário',
      details: ['Sessões quinzenais', 'Sábados às 17:30h']
    }
  ]);

  const [faqItems, setFaqItems] = useState<FaqItem[]>([
    {
      id: 1,
      question: 'Como participar das sessões?',
      answer: 'As sessões são gratuitas e abertas ao público. Compareça no Sindicato dos Pescadores (Rua Estados Unidos, 118) aos sábados às 17:30h.'
    },
    {
      id: 2,
      question: 'Posso sugerir um filme?',
      answer: 'Sim! Aceitamos sugestões da comunidade através do formulário ou diretamente nas sessões.'
    },
    {
      id: 3,
      question: 'O CineMar aceita doações?',
      answer: 'Sim, é um projeto comunitário sem fins lucrativos. Aceitamos doações nas sessões.'
    },
    {
      id: 4,
      question: 'Como me voluntariar?',
      answer: 'Entre em contato conosco para conhecer as oportunidades de voluntariado disponíveis.'
    }
  ]);

  const [editContactForm, setEditContactForm] = useState<ContactInfo>({
    id: 0,
    title: '',
    details: [],
    link: ''
  });

  const [newContactForm, setNewContactForm] = useState<Omit<ContactInfo, 'id'>>({
    title: '',
    details: [''],
    link: ''
  });

  const [editFaqForm, setEditFaqForm] = useState<FaqItem>({
    id: 0,
    question: '',
    answer: ''
  });
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [newFaqForm, setNewFaqForm] = useState<Omit<FaqItem, 'id'>>({
    question: '',
    answer: ''
  });

  const assuntoOptions = [
    'Sugestão de filme',
    'Voluntariado',
    'Doação/Patrocínio',
    'Parceria',
    'Dúvida sobre sessões',
    'Outro'
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('cinemar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const savedContact = localStorage.getItem('cinemar_contact_info');
    if (savedContact) {
      setContactInfo(JSON.parse(savedContact));
    }

    const savedFaq = localStorage.getItem('cinemar_faq_items');
    if (savedFaq) {
      setFaqItems(JSON.parse(savedFaq));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cinemar_contact_info', JSON.stringify(contactInfo));
  }, [contactInfo]);

  useEffect(() => {
    localStorage.setItem('cinemar_faq_items', JSON.stringify(faqItems));
  }, [faqItems]);

  // Carregar mensagens do localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('cinemar_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Salvar mensagens no localStorage
  useEffect(() => {
    localStorage.setItem('cinemar_messages', JSON.stringify(messages));
  }, [messages]);

  const isAdmin = user?.role === 'admin';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newMessage: Message = {
        id: Date.now(),
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        assunto: formData.assunto,
        mensagem: formData.mensagem,
        data: new Date().toLocaleString('pt-BR'),
        lida: false
      };

      setMessages(prev => [newMessage, ...prev]);
      setSubmitSuccess(true);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
      });

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsRead = (messageId: number) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, lida: true } : msg
    ));
  };

  const handleDeleteMessage = (messageId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta mensagem?')) {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;
    
    setIsReplying(true);
    try {
      setMessages(prev => prev.map(msg =>
        msg.id === selectedMessage.id 
          ? { ...msg, resposta: replyText, lida: true }
          : msg
      ));
      
      alert(`Resposta registrada para ${selectedMessage.email}!\n\nMensagem: ${replyText}`);
      setReplyText('');
      setSelectedMessage(null);
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      alert('Erro ao enviar resposta. Tente novamente.');
    } finally {
      setIsReplying(false);
    }
  };

  // ===== CRUD CONTACT INFO =====
  const handleEditContact = (contact: ContactInfo) => {
    setEditContactForm(contact);
    setEditingContactId(contact.id);
  };

  const handleSaveContact = () => {
    setContactInfo(prev => prev.map(c =>
      c.id === editContactForm.id ? editContactForm : c
    ));
    setEditingContactId(null);
  };

  const handleAddContact = () => {
    const newId = Math.max(...contactInfo.map(c => c.id), 0) + 1;
    setContactInfo([...contactInfo, { ...newContactForm, id: newId }]);
    setNewContactForm({ title: '', details: [''], link: '' });
    setIsAddingContact(false);
  };

  const handleDeleteContact = (id: number) => {
    setContactInfo(prev => prev.filter(c => c.id !== id));
  };

  const handleDetailChange = (index: number, value: string) => {
    const newDetails = [...editContactForm.details];
    newDetails[index] = value;
    setEditContactForm({ ...editContactForm, details: newDetails });
  };

  const handleAddDetail = () => {
    setEditContactForm({ ...editContactForm, details: [...editContactForm.details, ''] });
  };

  const handleRemoveDetail = (index: number) => {
    const newDetails = editContactForm.details.filter((_, i) => i !== index);
    setEditContactForm({ ...editContactForm, details: newDetails });
  };

  // ===== CRUD FAQ =====
  const handleEditFaq = (faq: FaqItem) => {
    setEditFaqForm(faq);
    setEditingContactId(faq.id);
  };

  const handleSaveFaq = () => {
    setFaqItems(prev => prev.map(f =>
      f.id === editFaqForm.id ? editFaqForm : f
    ));
    setEditingContactId(null);
  };

  const handleAddFaq = () => {
    const newId = Math.max(...faqItems.map(f => f.id), 0) + 1;
    setFaqItems([...faqItems, { ...newFaqForm, id: newId }]);
    setNewFaqForm({ question: '', answer: '' });
    setIsAddingFaq(false);
  };

  const handleDeleteFaq = (id: number) => {
    setFaqItems(prev => prev.filter(f => f.id !== id));
  };

  const unreadCount = messages.filter(msg => !msg.lida).length;

  return (
    <div className={`${styles.contactPage} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* Header */}
      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={styles.backLink}>
              ← Voltar para Início
            </Link>
            {isAdmin && (
              <button
                className={styles.messagesButton}
                onClick={() => setShowMessagesPanel(!showMessagesPanel)}
              >
                <FaInbox />
                <span>Mensagens</span>
                {unreadCount > 0 && (
                  <span className={styles.unreadBadge}>{unreadCount}</span>
                )}
              </button>
            )}
          </div>

          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>Contato CineMar</h1>
            <p className={styles.heroSubtitle}>
              Entre em contato conosco para sugestões, dúvidas ou parcerias
            </p>
          </div>
        </div>
      </header>

      {/* Painel de Mensagens */}
      {showMessagesPanel && isAdmin && (
        <div className={styles.messagesPanel}>
          <div className={styles.messagesPanelHeader}>
            <h2>
              <FaInbox /> Mensagens Recebidas
              {unreadCount > 0 && ` (${unreadCount} não lidas)`}
            </h2>
            <button onClick={() => setShowMessagesPanel(false)} className={styles.closePanelBtn}>
              <FaTimes />
            </button>
          </div>
          
          <div className={styles.messagesPanelContent}>
            <div className={styles.messagesList}>
              {messages.length === 0 ? (
                <div className={styles.noMessages}>
                  <FaInbox />
                  <p>Nenhuma mensagem recebida ainda</p>
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`${styles.messageItem} ${!message.lida ? styles.unreadMessage : ''}`}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.lida) handleMarkAsRead(message.id);
                    }}
                  >
                    <div className={styles.messageHeader}>
                      <strong>{message.nome}</strong>
                      <span className={styles.messageDate}>{message.data}</span>
                    </div>
                    <div className={styles.messageSubject}>{message.assunto}</div>
                    <div className={styles.messagePreview}>
                      {message.mensagem.substring(0, 100)}...
                    </div>
                    {message.resposta && (
                      <div className={styles.repliedBadge}>
                        <FaReply /> Respondida
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {selectedMessage && (
              <div className={styles.messageDetail}>
                <div className={styles.messageDetailHeader}>
                  <h3>Detalhe da Mensagem</h3>
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className={styles.deleteMessageBtn}
                  >
                    <FaTrash /> Excluir
                  </button>
                </div>
                <div className={styles.messageDetailContent}>
                  <p><strong>De:</strong> {selectedMessage.nome}</p>
                  <p><strong>Email:</strong> {selectedMessage.email}</p>
                  {selectedMessage.telefone && (
                    <p><strong>Telefone:</strong> {selectedMessage.telefone}</p>
                  )}
                  <p><strong>Assunto:</strong> {selectedMessage.assunto}</p>
                  <p><strong>Data:</strong> {selectedMessage.data}</p>
                  <p><strong>Mensagem:</strong></p>
                  <p className={styles.messageFullText}>{selectedMessage.mensagem}</p>
                  
                  {selectedMessage.resposta ? (
                    <div className={styles.existingReply}>
                      <h4>Sua Resposta:</h4>
                      <p>{selectedMessage.resposta}</p>
                    </div>
                  ) : (
                    <div className={styles.replySection}>
                      <h4>Responder:</h4>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Digite sua resposta aqui..."
                        rows={4}
                        className={styles.replyTextarea}
                      />
                      <button
                        onClick={handleSendReply}
                        disabled={isReplying || !replyText.trim()}
                        className={styles.sendReplyBtn}
                      >
                        {isReplying ? <FaSpinner className={styles.spinning} /> : <FaReply />}
                        {isReplying ? 'Enviando...' : 'Registrar Resposta'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botão flutuante de adicionar (apenas admin) */}
      {isAdmin && !showMessagesPanel && (
        <button
          className={styles.floatingAddBtn}
          onClick={() => setIsAddingContact(true)}
          title="Adicionar contato"
        >
          <FaPlus />
        </button>
      )}

      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Informações de Contato */}
          <section className={styles.contactInfoSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Informações de Contato</h2>
            </div>

            <div className={styles.contactInfoGrid}>
              {contactInfo.map((info) => (
                <div key={info.id} className={styles.contactInfoCard}>
                  {editingContactId === info.id ? (
                    <div className={styles.editForm}>
                      <input
                        type="text"
                        value={editContactForm.title}
                        onChange={(e) => setEditContactForm({ ...editContactForm, title: e.target.value })}
                        className={styles.editInput}
                        placeholder="Título"
                      />
                      {editContactForm.details.map((detail, idx) => (
                        <div key={idx} className={styles.detailInputWrapper}>
                          <input
                            type="text"
                            value={detail}
                            onChange={(e) => handleDetailChange(idx, e.target.value)}
                            className={styles.editInput}
                            placeholder={`Detalhe ${idx + 1}`}
                          />
                          <button onClick={() => handleRemoveDetail(idx)} className={styles.removeDetailBtn}>
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                      <button onClick={handleAddDetail} className={styles.addDetailBtn}>
                        + Adicionar linha
                      </button>
                      <input
                        type="text"
                        value={editContactForm.link || ''}
                        onChange={(e) => setEditContactForm({ ...editContactForm, link: e.target.value })}
                        className={styles.editInput}
                        placeholder="Link (opcional)"
                      />
                      <div className={styles.editActions}>
                        <button onClick={handleSaveContact} className={styles.saveBtn}>
                          <FaSave /> Salvar
                        </button>
                        <button onClick={() => setEditingContactId(null)} className={styles.cancelBtn}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.contactInfoContent}>
                      <div className={styles.contactIconWrapper}>
                        {getIconByTitle(info.title)}
                      </div>
                      <h3 className={styles.contactInfoTitle}>{info.title}</h3>
                      <div className={styles.contactInfoDetails}>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className={styles.detailText}>{detail}</p>
                        ))}
                      </div>
                      {info.link && (
                        <a
                          href={info.link}
                          className={styles.contactInfoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Acessar
                        </a>
                      )}
                      {isAdmin && (
                        <div className={styles.cardActions}>
                          <button onClick={() => handleEditContact(info)} className={styles.editCardBtn}>
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDeleteContact(info.id)} className={styles.deleteCardBtn}>
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal de adicionar contato */}
            {isAddingContact && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <h3>Adicionar Contato</h3>
                  <input
                    type="text"
                    placeholder="Título"
                    value={newContactForm.title}
                    onChange={(e) => setNewContactForm({ ...newContactForm, title: e.target.value })}
                    className={styles.editInput}
                  />
                  <input
                    type="text"
                    placeholder="Detalhe 1"
                    value={newContactForm.details[0]}
                    onChange={(e) => setNewContactForm({ ...newContactForm, details: [e.target.value] })}
                    className={styles.editInput}
                  />
                  <input
                    type="text"
                    placeholder="Link (opcional)"
                    value={newContactForm.link}
                    onChange={(e) => setNewContactForm({ ...newContactForm, link: e.target.value })}
                    className={styles.editInput}
                  />
                  <div className={styles.editActions}>
                    <button onClick={handleAddContact} className={styles.saveBtn}>Adicionar</button>
                    <button onClick={() => setIsAddingContact(false)} className={styles.cancelBtn}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Formulário de Contato */}
          <section className={styles.contactFormSection}>
            <h2 className={styles.sectionTitle}>
              <FaPaperPlane className={styles.sectionTitleIcon} />
              Envie sua Mensagem
            </h2>

            {submitSuccess && (
              <div className={styles.successMessage}>
                <FaCheckCircle className={styles.successIcon} />
                <span>Mensagem enviada com sucesso! Entraremos em contato em breve.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="nome">Nome Completo *</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={styles.formInput}
                    required
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">E-mail *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.formInput}
                    required
                    placeholder="seu@email.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="(88) 99999-9999"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="assunto">Assunto *</label>
                  <select
                    id="assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                    className={styles.formSelect}
                    required
                  >
                    <option value="">Selecione um assunto</option>
                    {assuntoOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mensagem">Mensagem *</label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  className={styles.formTextarea}
                  rows={5}
                  required
                  placeholder="Digite sua mensagem aqui..."
                />
              </div>

              <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className={styles.loadingSpinner}></span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Enviar Mensagem
                  </>
                )}
              </button>
            </form>
          </section>

          {/* FAQ */}
          <section className={styles.faqSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Perguntas Frequentes</h2>
              {isAdmin && (
                <button
                  className={styles.addFaqBtn}
                  onClick={() => setIsAddingFaq(true)}
                >
                  <FaPlus /> Adicionar FAQ
                </button>
              )}
            </div>

            <div className={styles.faqGrid}>
              {faqItems.map((item) => (
                <div key={item.id} className={styles.faqItem}>
                  {editingContactId === item.id ? (
                    <div className={styles.editForm}>
                      <input
                        type="text"
                        value={editFaqForm.question}
                        onChange={(e) => setEditFaqForm({ ...editFaqForm, question: e.target.value })}
                        className={styles.editInput}
                        placeholder="Pergunta"
                      />
                      <textarea
                        value={editFaqForm.answer}
                        onChange={(e) => setEditFaqForm({ ...editFaqForm, answer: e.target.value })}
                        className={styles.editTextarea}
                        rows={3}
                        placeholder="Resposta"
                      />
                      <div className={styles.editActions}>
                        <button onClick={handleSaveFaq} className={styles.saveBtn}>
                          <FaSave /> Salvar
                        </button>
                        <button onClick={() => setEditingContactId(null)} className={styles.cancelBtn}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className={styles.faqQuestion}>{item.question}</h3>
                      <p className={styles.faqAnswer}>{item.answer}</p>
                      {isAdmin && (
                        <div className={styles.cardActions}>
                          <button onClick={() => handleEditFaq(item)} className={styles.editCardBtn}>
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDeleteFaq(item.id)} className={styles.deleteCardBtn}>
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Modal de adicionar FAQ */}
            {isAddingFaq && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <h3>Adicionar FAQ</h3>
                  <input
                    type="text"
                    placeholder="Pergunta"
                    value={newFaqForm.question}
                    onChange={(e) => setNewFaqForm({ ...newFaqForm, question: e.target.value })}
                    className={styles.editInput}
                  />
                  <textarea
                    placeholder="Resposta"
                    value={newFaqForm.answer}
                    onChange={(e) => setNewFaqForm({ ...newFaqForm, answer: e.target.value })}
                    className={styles.editTextarea}
                    rows={3}
                  />
                  <div className={styles.editActions}>
                    <button onClick={handleAddFaq} className={styles.saveBtn}>Adicionar</button>
                    <button onClick={() => setIsAddingFaq(false)} className={styles.cancelBtn}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Call to Action */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Participe das nossas sessões!</h2>
              <p className={styles.ctaText}>
                O CineMar é feito por e para a comunidade. Sua presença e participação
                são essenciais para o sucesso do projeto.
              </p>
              <div className={styles.ctaButtons}>
                <Link to="/eventos" className={styles.ctaButton}>
                  <FaCalendarAlt />
                  <span>Ver Próximas Sessões</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}