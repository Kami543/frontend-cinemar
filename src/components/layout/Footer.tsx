// frontend/src/components/layout/Footer.tsx
import { Link } from 'react-router-dom';
import styles from '../../styles/Footer.module.css';
import logoImage from '../../images/cinemar-logo.png';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        
        {/* Coluna da Esquerda: Logo Grande */}
        <div className={styles.logoColumn}>
          <Link to="/" className={styles.logoLink}>
            <img
              src={logoImage}
              alt="CineMar Logo"
              className={styles.footerLogo}
            />
          </Link>
        </div>

        {/* Coluna da Direita: Todo o Conteúdo */}
        <div className={styles.contentColumn}>
          
          {/* Links de Navegação */}
          <div className={styles.linksSection}>
            <div className={styles.linksContainer}>
              <Link to="/editais" className={styles.footerLink}>
                Editais
              </Link>
              <span className={styles.separator}>|</span>
              <Link to="/politica-privacidade" className={styles.footerLink}>
                Política de Privacidade
              </Link>
            </div>
          </div>

          {/* Container dos Termos e Copyright (lado direito inferior) */}
          <div className={styles.termsCopyrightContainer}>
            
            {/* Links dos Termos */}
            <div className={styles.termsContainer}>
              <Link to="/termos-de-uso" className={styles.termsLink}>
                Termos de Uso
              </Link>
              <span className={styles.termsSeparator}>|</span>
              <Link to="/faq" className={styles.termsLink}>
                FAQ
              </Link>
              <span className={styles.termsSeparator}>|</span>
              <Link to="/contact" className={styles.termsLink}>
                Contato
              </Link>
            </div>

            {/* Copyright Pequeno */}
            <p className={styles.copyright}>
              &copy; {new Date().getFullYear()} CineMar. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;