import { FaTimes } from 'react-icons/fa';
import styles from '../../styles/Menu.module.css';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuItemClick: (path: string) => void;
  onLogin: () => void;
  onRegister: () => void;
  logo: string;
}

export default function Menu({ 
  isOpen, 
  onClose, 
  onMenuItemClick, 
  onLogin, 
  onRegister, 
  logo 
}: MenuProps) {
  
  const menuItems = [
    { id: 1, label: 'Sessões', path: '/sessions' },
    { id: 2, label: 'Filmes', path: '/filmes' },
    { id: 3, label: 'Playlists', path: '/playlists' },
    { id: 4, label: 'Fotos', path: '/photos' },
    { id: 5, label: 'Contatos', path: '/contact' },
    { id: 6, label: 'Sobre', path: '/about' },
    { id: 7, label: 'Eventos', path: '/eventos' },
    { id: 8, label: 'Podcasts', path: '/podcasts' },
    { id: 9, label: 'Membros', path: '/members' }, // Nova aba adicionada
    { id: 10, label: 'Local', path: '/location' }, // Nova aba adicionada
  ];

  return (
    <div 
      className={`${styles.menuOverlay} ${isOpen ? styles.open : ''}`}
      onClick={onClose}
    >
      <div 
        className={styles.menuContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.menuBody}>
          {/* Lista de navegação */}
          <nav className={styles.menuNavigation} aria-label="Menu principal">
            <ul className={styles.menuList}>
              {menuItems.map((item) => (
                <li key={item.id} className={styles.menuListItem}>
                  <button 
                    className={styles.menuItemButton}
                    onClick={() => {
                      onMenuItemClick(item.path);
                      onClose();
                    }}
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
                onClick={() => {
                  onLogin();
                  onClose();
                }}
              >
                <span>Login</span>
              </button>
              <button 
                className={styles.menuRegisterButton}
                onClick={() => {
                  onRegister();
                  onClose();
                }}
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