import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import { FaSignOutAlt, FaUser, FaMoon, FaSun } from 'react-icons/fa';
import styles from '../../styles/Menu.module.css';
import { useTheme } from '../context/ThemeContext';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onLogout?: () => void;
  user?: {
    id: number;
    email: string;
    nome: string;
    role: string;
  } | null;
  logo: string;
}

export default function Menu({ 
  isOpen, 
  onClose, 
  onLogin, 
  onRegister, 
  onLogout, 
  user,
  logo
}: MenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme(); // ✅ usando contexto global
  const [isClosing, setIsClosing] = useState(false);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const menuItems = [
    { id: 1,  label: 'Sessões',     path: '/sessions'    },
    { id: 2,  label: 'Filmes',      path: '/filmes'      },
    { id: 3,  label: 'Playlists',   path: '/playlists'   },
    { id: 4,  label: 'Fotos',       path: '/fotos'       },
    { id: 5,  label: 'Contatos',    path: '/contact'     },
    { id: 6,  label: 'Sobre',       path: '/about'       },
    { id: 7,  label: 'Eventos',     path: '/eventos'     },
    { id: 8,  label: 'Podcasts',    path: '/podcasts'    },
    { id: 9,  label: 'Membros',     path: '/members'     },
    { id: 10, label: 'Localização', path: '/localizacao' },
  ];

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const t = setTimeout(() => menuContentRef.current?.focus(), 50);
      return () => clearTimeout(t);
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeMenuWithAnimation(); return; }
      if (e.key === 'Tab') {
        const focusable = menuContentRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      setIsClosing(false);
    } else {
      const t = setTimeout(() => {
        document.body.style.overflow = 'auto';
        document.body.style.position = 'static';
      }, 300);
      return () => clearTimeout(t);
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
    };
  }, [isOpen]);

  const closeMenuWithAnimation = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    onClose();
  }, [isClosing, onClose]);

  const handleMenuItemClick = (path: string) => {
    if (location.pathname === path) { closeMenuWithAnimation(); return; }
    closeMenuWithAnimation();
    navigate(path);
  };

  const handleAuthClick = (action: () => void) => {
    closeMenuWithAnimation();
    setTimeout(() => action(), 50);
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      closeMenuWithAnimation();
      setTimeout(() => onLogout(), 50);
    }
  };

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <div
      className={`${styles.menuOverlay} ${isOpen ? styles.open : ''}`}
      onClick={closeMenuWithAnimation}
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
    >
      <div
        className={`${styles.menuContent} ${theme === 'dark' ? styles.dark : ''}`}
        ref={menuContentRef}
        tabIndex={-1}
        onClick={stop}
        onMouseDown={stop}
        onTouchStart={stop}
      >
        <button
          className={styles.closeButton}
          onClick={closeMenuWithAnimation}
          aria-label="Fechar menu"
        >
          ✕
        </button>

        <div className={styles.menuBody}>
          <nav className={styles.menuNavigation}>
            <ul className={styles.menuList}>
              {menuItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.id}>
                    <button
                      className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                      onClick={() => handleMenuItemClick(item.path)}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Botão de tema */}
          <button
            className={styles.themeButton}
            onClick={toggleTheme}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
            <span>{theme === 'light' ? 'Escuro' : 'Claro'}</span>
          </button>

          {/* Área do usuário */}
          <div className={styles.userArea}>
            {user ? (
              <>
                <div className={styles.userSimple}>
                  <FaUser className={styles.userIcon} />
                  <div>
                    <div className={styles.userSimpleName}>{user.nome}</div>
                    <div className={styles.userSimpleRole}>
                      {user.role === 'admin' ? 'Admin' : 'Membro'}
                    </div>
                  </div>
                </div>
                <button
                  className={styles.logoutButton}
                  onClick={handleLogoutClick}
                >
                  <FaSignOutAlt />
                  Sair
                </button>
              </>
            ) : (
              <>
                <button
                  className={styles.loginButton}
                  onClick={() => handleAuthClick(onLogin)}
                >
                  Entrar
                </button>
                <button
                  className={styles.registerButton}
                  onClick={() => handleAuthClick(onRegister)}
                >
                  Cadastrar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}