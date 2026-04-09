import { useNavigate, useLocation } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import styles from '../../styles/Menu.module.css';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
  logo: string;
}

export default function Menu({ 
  isOpen, 
  onClose, 
  onLogin, 
  onRegister, 
  logo 
}: MenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const menuItems = [
    { id: 1, label: 'Sessões', path: '/sessions' },
    { id: 2, label: 'Filmes', path: '/filmes' },
    { id: 3, label: 'Playlists', path: '/playlists' },
    { id: 4, label: 'Fotos', path: '/fotos' },
    { id: 5, label: 'Contatos', path: '/contact' },
    { id: 6, label: 'Sobre', path: '/about' },
    { id: 7, label: 'Eventos', path: '/eventos' },
    { id: 8, label: 'Podcasts', path: '/podcasts' },
    { id: 9, label: 'Membros', path: '/members' },
    { id: 10, label: 'Localização', path: '/localizacao' },
  ];

  // Previne scroll do body quando menu está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      setIsClosing(false);
    } else {
      // Aguarda a animação terminar antes de restaurar o scroll
      const timer = setTimeout(() => {
        document.body.style.overflow = 'auto';
        document.body.style.position = 'static';
      }, 300);
      
      return () => clearTimeout(timer);
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
    };
  }, [isOpen]);

  // Fecha o menu com animação
  const closeMenuWithAnimation = () => {
    if (isClosing) return;
    
    setIsClosing(true);
    onClose();
  };

  const handleMenuItemClick = (path: string) => {
    // Verifica se já está na página atual
    if (location.pathname === path) {
      closeMenuWithAnimation();
      return;
    }
    
    // Fecha o menu com animação
    closeMenuWithAnimation();
    
    // Navega imediatamente (sem delay)
    navigate(path);
    
    // Para dispositivos móveis, focar no conteúdo principal após navegação
    setTimeout(() => {
      const mainContent = document.querySelector('main, [role="main"]');
      if (mainContent && mainContent instanceof HTMLElement) {
        mainContent.focus();
      }
    }, 50);
  };

  const handleAuthClick = (action: () => void) => {
    closeMenuWithAnimation();
    
    // Pequeno delay para garantir que o foco não se perca
    setTimeout(() => {
      action();
    }, 50);
  };

  // Prevenir fechamento acidental ao clicar nos botões
  const handleButtonMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleButtonTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`${styles.menuOverlay} ${isOpen ? styles.open : ''}`}
      onClick={closeMenuWithAnimation}
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
      ref={menuRef}
    >
      <div 
        className={styles.menuContent}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <button 
          className={styles.closeButton}
          onClick={closeMenuWithAnimation}
          aria-label="Fechar menu"
          onMouseDown={handleButtonMouseDown}
          onTouchStart={handleButtonTouchStart}
        >
          <FaTimes />
        </button>
        
        <div className={styles.menuBody}>
          <nav className={styles.menuNavigation} aria-label="Menu principal">
            <ul className={styles.menuList}>
              {menuItems.map((item) => (
                <li key={item.id} className={styles.menuListItem}>
                  <button 
                    className={`${styles.menuItemButton} ${
                      location.pathname === item.path ? styles.active : ''
                    }`}
                    onClick={() => handleMenuItemClick(item.path)}
                    onMouseDown={handleButtonMouseDown}
                    onTouchStart={handleButtonTouchStart}
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                  >
                    <span className={styles.menuItemLabel}>{item.label}</span>
                    <span className={styles.menuArrow}>&gt;</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className={styles.menuAuthSection}>
            <p className={styles.menuInfo}>
              Para acessar todas as funcionalidades do site, faça login ou crie uma conta.
            </p>
            
            <div className={styles.menuAuthButtons}>
              <button 
                className={styles.menuLoginButton}
                onClick={() => handleAuthClick(onLogin)}
                onMouseDown={handleButtonMouseDown}
                onTouchStart={handleButtonTouchStart}
              >
                <span>Login</span>
              </button>
              <button 
                className={styles.menuRegisterButton}
                onClick={() => handleAuthClick(onRegister)}
                onMouseDown={handleButtonMouseDown}
                onTouchStart={handleButtonTouchStart}
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}