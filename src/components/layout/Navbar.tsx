// frontend/src/components/layout/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import image from '../../images/cinemar-logo.png';
import styles from '../../styles/Navbar.module.css';
import Menu from './Menu';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth(); // ✅ Usando o AuthContext
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLButtonElement>(null);

  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/register');
  
  const handleLogout = () => {
    logout(); // ✅ Usando o logout do AuthContext
  };

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  useEffect(() => {
    document.body.style.paddingTop = '80px';
    return () => { document.body.style.paddingTop = '0'; };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (burgerMenuRef.current?.contains(e.target as HTMLElement)) return;
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Principal"
        className={styles.navbar}
      >
        <div className={styles.container}>

          {/* Burger */}
          <div className={styles.menuContainer}>
            <button
              ref={burgerMenuRef}
              className={`${styles.burgerMenu} ${isMenuOpen ? styles.open : ''}`}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMenuOpen}
              aria-controls="main-menu"
            >
              <span className={styles.burgerLine} />
              <span className={styles.burgerLine} />
              <span className={styles.burgerLine} />
            </button>
            <span className={styles.menuText}>Menu</span>
          </div>

          {/* Logo */}
          <Link
            to="/"
            className={styles.brand}
            aria-label="Ir para a página inicial"
            onClick={() => setIsMenuOpen(false)}
          >
            <img src={image} alt="CineMar" className={styles.logoImage} />
          </Link>

          {/* Auth apenas - sem botão de sair */}
          <div className={styles.desktopNav}>
            <div className={styles.authButtons}>
              {isAuthenticated && user ? (
                <span className={styles.userGreeting}>
                  {user.nome || user.email?.split('@')[0]}
                </span>
              ) : (
                <>
                  <button
                    className={styles.registerButton}
                    onClick={handleRegister}
                  >
                    Cadastrar
                  </button>
                  <button
                    className={styles.loginButton}
                    onClick={handleLogin}
                    aria-label="Entrar"
                  >
                    <FaUser />
                    <span>Entrar</span>
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </nav>

      <Menu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        user={user}
        logo={image}
      />
    </>
  );
}