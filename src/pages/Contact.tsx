import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowLeft,
  FaPaperPlane,
  FaSun,
  FaMoon
} from 'react-icons/fa';
import styles from '../styles/Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de envio
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  // DADOS DO CINEMAR
  const contactInfo = [
    {
      title: 'E-mail',
      details: ['cinemar.camocim@gmail.com'],
      link: 'mailto:cinemar.camocim@gmail.com'
    },
    {
      title: 'Telefone',
      details: ['Professor Renato: (88) 99999-9999', 'Professor Luiz: (88) 99999-8888'],
      link: 'tel:+5588999999999'
    },
    {
      title: 'Localização',
      details: ['Sindicato dos Pescadores', 'Rua Estados Unidos, 118 - Camocim, CE'],
      link: 'https://maps.google.com/?q=Rua+Estados+Unidos+118+Camocim+CE'
    },
    {
      title: 'Horário',
      details: ['Sessões quinzenais', 'Sábados às 17:30h']
    }
  ];

  // FAQ
  const faqItems = [
    {
      question: 'Como participar das sessões?',
      answer: 'As sessões são gratuitas e abertas ao público. Compareça no Sindicato dos Pescadores (Rua Estados Unidos, 118) aos sábados às 17:30h.'
    },
    {
      question: 'Posso sugerir um filme?',
      answer: 'Sim! Aceitamos sugestões da comunidade através do formulário ou diretamente nas sessões.'
    },
    {
      question: 'O CineMar aceita doações?',
      answer: 'Sim, é um projeto comunitário sem fins lucrativos. Aceitamos doações nas sessões.'
    },
    {
      question: 'Como me voluntariar?',
      answer: 'Entre em contato conosco para conhecer as oportunidades de voluntariado disponíveis.'
    }
  ];

  const assuntoOptions = [
    'Sugestão de filme',
    'Voluntariado',
    'Doação/Patrocínio',
    'Parceria',
    'Dúvida sobre sessões',
    'Outro'
  ];

  return (
    <div className={`${styles.contactPage} ${isDarkMode ? styles.darkMode : ''}`}>
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
              >
                {isDarkMode ? <FaSun /> : <FaMoon />}
                <span className={styles.themeLabel}>
                  {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                </span>
              </button>
            </div>
          </div>
          
          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>Contato CineMar</h1>
            <p className={styles.heroSubtitle}>
              Entre em contato conosco para sugestões, dúvidas ou parcerias
            </p>
          </div>
        </div>
      </header>

      <main className={`${styles.mainContent} ${isDarkMode ? styles.darkMain : ''}`}>
        <div className={styles.contentWrapper}>
          
          {/* Informações de Contato */}
          <section className={styles.contactInfoSection}>
            <h2 className={styles.sectionTitle}>Informações de Contato</h2>
            
            <div className={styles.contactInfoGrid}>
              {contactInfo.map((info, index) => (
                <div key={index} className={`${styles.contactInfoCard} ${isDarkMode ? styles.darkCard : ''}`}>
                  <div className={styles.contactInfoContent}>
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
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Formulário de Contato */}
          <section className={`${styles.contactFormSection} ${isDarkMode ? styles.darkCard : ''}`}>
            <h2 className={styles.sectionTitle}>
              <FaPaperPlane className={styles.sectionTitleIcon} />
              Envie sua Mensagem
            </h2>
            
            {submitSuccess && (
              <div className={styles.successMessage}>
                <p>✅ Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="nome" className={styles.formLabel}>
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={`${styles.formInput} ${isDarkMode ? styles.darkInput : ''}`}
                    required
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${styles.formInput} ${isDarkMode ? styles.darkInput : ''}`}
                    required
                    placeholder="seu@email.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="telefone" className={styles.formLabel}>
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className={`${styles.formInput} ${isDarkMode ? styles.darkInput : ''}`}
                    placeholder="(88) 99999-9999"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="assunto" className={styles.formLabel}>
                    Assunto
                  </label>
                  <select
                    id="assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                    className={`${styles.formSelect} ${isDarkMode ? styles.darkInput : ''}`}
                    required
                  >
                    <option value="">Selecione um assunto</option>
                    {assuntoOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mensagem" className={styles.formLabel}>
                  Mensagem
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  className={`${styles.formTextarea} ${isDarkMode ? styles.darkInput : ''}`}
                  rows={5}
                  required
                  placeholder="Digite sua mensagem aqui..."
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
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
          <section className={`${styles.faqSection} ${isDarkMode ? styles.darkCard : ''}`}>
            <h2 className={styles.sectionTitle}>Perguntas Frequentes</h2>
            
            <div className={styles.faqGrid}>
              {faqItems.map((item, index) => (
                <div key={index} className={`${styles.faqItem} ${isDarkMode ? styles.darkFaqItem : ''}`}>
                  <h3 className={styles.faqQuestion}>{item.question}</h3>
                  <p className={styles.faqAnswer}>{item.answer}</p>
                </div>
              ))}
            </div>
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