import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { FaUser } from 'react-icons/fa';
import image from '../../images/cinemar-logo.png';
import styles from '../../styles/Navbar.module.css';
import Menu from './Menu';

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate(); // Adicione este hook

  const handleLogin = () => {
    console.log('Login clicked');
    // Aqui você pode redirecionar para a página de login se necessário
    // navigate('/login');
  };

  const handleRegister = () => {
    console.log('Register clicked');
    // Aqui você pode redirecionar para a página de cadastro se necessário
    // navigate('/register');
  };

  const handleMenuItemClick = (path: string) => {
    console.log(`Navigating to ${path}`);
    navigate(path); // Use navigate para mudar a rota
  };

  const toggleMenu = () => {
    console.log('Toggle menu clicked, current state:', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setIsMounted(true);
    
    document.body.style.paddingTop = '80px';
    
    return () => {
      document.body.style.paddingTop = '0';
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (
        isMenuOpen && 
        burgerMenuRef.current && 
        !burgerMenuRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className={`${styles.navbar} ${isMounted ? styles.animated : ''}`}>
        <div className={styles.container}>
          {/* Burger Menu e texto "Menu" na ESQUERDA */}
          <div className={styles.menuContainer} onClick={toggleMenu}>
            <button 
              ref={burgerMenuRef}
              className={`${styles.burgerMenu} ${isMenuOpen ? styles.open : ''}`}
              onClick={(e) => {
                e.stopPropagation(); // Previne duplo clique
                toggleMenu();
              }}
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              <span className={styles.burgerLine}></span>
              <span className={styles.burgerLine}></span>
              <span className={styles.burgerLine}></span>
            </button>
            <span className={styles.menuText}>
              Menu
            </span>
          </div>

          {/* Logo no MEIO */}
          <Link to="/" className={styles.brand} onClick={() => setIsMenuOpen(false)}>
            <img
              src={image}
              alt="CineMar Logo"
              className={styles.logoImage}
            />
          </Link>

          {/* Botões de Auth na DIREITA */}
          <div className={styles.desktopNav}>
            <div className={styles.authButtons}>
              <button 
                className={styles.registerButton}
                onClick={handleRegister}
              >
                Cadastrar
              </button>
              <button 
                className={styles.loginButton}
                onClick={handleLogin}
              >
                <FaUser className={styles.loginIcon} />
                <span>Login</span>
              </button>
            </div>
          </div>

          {/* Componente Menu */}
          <Menu 
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onMenuItemClick={handleMenuItemClick}
            onLogin={handleLogin}
            onRegister={handleRegister}
            logo={image}
          />
        </div>
      </nav>
    </>
  );
}