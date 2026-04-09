import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaClock, 
  FaUsers, 
  FaHeart,
  FaBuilding,
  FaHandshake,
  FaMoon,
  FaSun,
  FaSpinner,
  FaExternalLinkAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaInfoCircle
} from 'react-icons/fa';
import styles from '../styles/Location.module.css';

export default function Location() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Alternar tema com animação
  const toggleTheme = () => {
    setIsThemeChanging(true);
    setTheme(theme === 'light' ? 'dark' : 'light');
    setTimeout(() => setIsThemeChanging(false), 300);
  };

  // Aplicar tema ao body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('cinemar-theme', theme);
  }, [theme]);

  // Carregar tema salvo
  useEffect(() => {
    const savedTheme = localStorage.getItem('cinemar-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Coordenadas do Sindicato dos Pescadores de Camocim
  const location = {
    name: "Sindicato dos Pescadores e Pescadoras de Camocim",
    address: "Rua EUA, 118, Praia - Camocim/CE",
    cep: "62400-000",
    city: "Camocim",
    state: "Ceará",
    coordinates: {
      lat: -2.9005,
      lng: -40.8417
    },
    phone: "(88) 99999-9999",
    email: "cinemar@camocim.com",
    schedule: "Sessões quinzenais às Sextas-feiras",
    time: "19:30h",
    capacity: 80,
    accessibility: true,
    free: true
  };

  // URL do mapa estático (Google Maps Static API - fallback)
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.coordinates.lat},${location.coordinates.lng}&zoom=15&size=600x300&markers=color:red%7C${location.coordinates.lat},${location.coordinates.lng}&key=YOUR_API_KEY`;

  // Link para abrir no Google Maps
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`;
  
  // Link para Waze
  const wazeLink = `https://waze.com/ul?ll=${location.coordinates.lat},${location.coordinates.lng}&navigate=yes`;

  return (
    <div className={`${styles.locationContainer} ${theme === 'dark' ? styles.darkMode : ''} ${isThemeChanging ? styles.themeChanging : ''}`}>
      {/* Header */}
      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={styles.backButton}>
              <FaArrowLeft />
              <span>Voltar para Início</span>
            </Link>
            
            <button 
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={theme === 'light' ? "Alternar para modo escuro" : "Alternar para modo claro"}
              disabled={isThemeChanging}
            >
              {theme === 'light' ? <FaMoon className={styles.themeIcon} /> : <FaSun className={styles.themeIcon} />}
              <span className={styles.themeLabel}>
                {theme === 'light' ? "Tema Escuro" : "Tema Claro"}
              </span>
              {isThemeChanging && <FaSpinner className={styles.themeSpinner} />}
            </button>
          </div>
          
          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>
              <FaMapMarkerAlt className={styles.titleIcon} />
              ONDE ESTAMOS
            </h1>
            <p className={styles.heroSubtitle}>
              Localização e informações para participar das nossas sessões
            </p>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className={styles.mainContent}>
        <div className={styles.contentGrid}>
          {/* Coluna Esquerda - Informações */}
          <div className={styles.infoColumn}>
            {/* Card da Sede */}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <FaBuilding className={styles.cardIcon} />
                <h2 className={styles.cardTitle}>NOSSA SEDE</h2>
              </div>
              <div className={styles.cardContent}>
                <p className={styles.venueName}>{location.name}</p>
                <p className={styles.address}>
                  {location.address}<br />
                  {location.city} - {location.state}<br />
                  CEP: {location.cep}
                </p>
                <div className={styles.contactInfo}>
                  {location.phone && (
                    <div className={styles.contactItem}>
                      <FaPhone className={styles.contactIcon} />
                      <span>{location.phone}</span>
                    </div>
                  )}
                  {location.email && (
                    <div className={styles.contactItem}>
                      <FaEnvelope className={styles.contactIcon} />
                      <span>{location.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card das Sessões */}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <FaCalendarAlt className={styles.cardIcon} />
                <h2 className={styles.cardTitle}>HORÁRIOS</h2>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.scheduleItem}>
                  <FaClock className={styles.scheduleIcon} />
                  <div>
                    <strong>Sessões quinzenais</strong>
                    <p>Sextas-feiras • {location.time}</p>
                  </div>
                </div>
                <div className={styles.scheduleItem}>
                  <FaUsers className={styles.scheduleIcon} />
                  <div>
                    <strong>Capacidade</strong>
                    <p>{location.capacity} pessoas</p>
                  </div>
                </div>
                <div className={styles.scheduleItem}>
                  <FaHeart className={styles.scheduleIcon} />
                  <div>
                    <strong>Entrada</strong>
                    <p>{location.free ? 'Gratuita' : 'Consulte valores'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card da Parceria */}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <FaHandshake className={styles.cardIcon} />
                <h2 className={styles.cardTitle}>PARCERIA</h2>
              </div>
              <div className={styles.cardContent}>
                <p>
                  O CineMar é realizado em parceria com o <strong>Sindicato dos Pescadores e Pescadoras de Camocim</strong>, 
                  que gentilmente cede o espaço para nossas sessões quinzenais.
                </p>
                <p className={styles.partnershipNote}>
                  Esta parceria representa uma aliança que reconhece a cultura como direito social fundamental, 
                  fortalecendo os laços entre movimento sindical e produção cultural comunitária.
                </p>
              </div>
            </div>

            {/* Card de Acessibilidade */}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <FaInfoCircle className={styles.cardIcon} />
                <h2 className={styles.cardTitle}>ACESSIBILIDADE</h2>
              </div>
              <div className={styles.cardContent}>
                <p>
                  O espaço conta com estrutura adaptada para pessoas com mobilidade reduzida, 
                  garantindo que todos possam participar das nossas atividades.
                </p>
                <div className={styles.accessibilityBadges}>
                  <span className={styles.badge}>♿ Acesso para cadeirantes</span>
                  <span className={styles.badge}>🔊 Ambiente acústico</span>
                  <span className={styles.badge}>📽️ Legendas disponíveis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Mapa */}
          <div className={styles.mapColumn}>
            <div className={styles.mapCard}>
              <div className={styles.cardHeader}>
                <FaMapMarkerAlt className={styles.cardIcon} />
                <h2 className={styles.cardTitle}>LOCALIZAÇÃO</h2>
              </div>
              <div className={styles.mapContainer}>
                {!mapError ? (
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.coordinates.lng - 0.01},${location.coordinates.lat - 0.01},${location.coordinates.lng + 0.01},${location.coordinates.lat + 0.01}&layer=mapnik&marker=${location.coordinates.lat},${location.coordinates.lng}`}
                    className={styles.mapIframe}
                    title="Mapa de localização do CineMar"
                    onError={() => setMapError(true)}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.mapPlaceholder}>
                    <FaMapMarkerAlt className={styles.mapPlaceholderIcon} />
                    <p>Mapa indisponível no momento</p>
                    <p className={styles.mapPlaceholderAddress}>{location.address}</p>
                  </div>
                )}
              </div>
              <div className={styles.mapActions}>
                <a 
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapButton}
                >
                  <FaExternalLinkAlt />
                  Abrir no Google Maps
                </a>
                <a 
                  href={wazeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.mapButton} ${styles.wazeButton}`}
                >
                  <FaExternalLinkAlt />
                  Abrir no Waze
                </a>
              </div>
            </div>

            {/* Como Chegar */}
            <div className={styles.howToGetCard}>
              <h3 className={styles.howToGetTitle}>Como chegar</h3>
              <div className={styles.directionsList}>
                <div className={styles.directionItem}>
                  <strong>De ônibus:</strong>
                  <p>Desça no terminal central de Camocim. O Sindicato fica a 5 minutos de caminhada.</p>
                </div>
                <div className={styles.directionItem}>
                  <strong>De carro:</strong>
                  <p>Siga pela Avenida Beira Mar até a Rua EUA. O local está próximo à praia.</p>
                </div>
                <div className={styles.directionItem}>
                  <strong>Referência:</strong>
                  <p>Em frente à praia principal de Camocim, próximo ao calçadão.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}