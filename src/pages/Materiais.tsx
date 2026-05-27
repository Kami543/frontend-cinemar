// pages/Materiais.tsx - Versão simplificada
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaImages, FaVideo, FaFilePdf, FaDownload, FaExternalLinkAlt,
  FaCalendarAlt, FaUsers, FaFilm, FaTimes, FaSearch,
  FaSun, FaMoon, FaArrowLeft, FaPlus, FaTrash, FaCheck,
  FaSpinner, FaExclamationTriangle, FaEye, FaUserPlus,
  FaCamera, FaPhotoVideo, FaFolderOpen
} from 'react-icons/fa';
import styles from '../styles/Materiais.module.css';
import { useMateriais } from '../hooks/useMateriais';
import { useTheme } from '../components/context/ThemeContext';

// Helper para formatar data
function formatarData(dataStr: string): string {
  const data = new Date(dataStr);
  return data.toLocaleDateString('pt-BR');
}

// Helper para status da sessão
function getSessaoStatus(dataStr: string): 'PRÓXIMO' | 'HOJE' | 'REALIZADO' {
  const data = new Date(dataStr);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  if (data > hoje) return 'PRÓXIMO';
  if (data.toDateString() === hoje.toDateString()) return 'HOJE';
  return 'REALIZADO';
}

// Componente principal
export default function Materiais() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [user, setUser] = useState<any>(null);
  const [busca, setBusca] = useState('');
  const [selectedSessao, setSelectedSessao] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  
  const { sessoes, isLoading, error, toast, uploadFotos, refetch } = useMateriais({ limit: 100 });
  
  useEffect(() => {
    const storedUser = localStorage.getItem('cinemar_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  
  const isAdmin = user?.role === 'admin';
  
  // Filtrar sessões
  const sessoesFiltradas = useMemo(() => {
    if (!busca) return sessoes;
    const lower = busca.toLowerCase();
    return sessoes.filter(s => 
      s.titulo.toLowerCase().includes(lower) ||
      s.diretor.toLowerCase().includes(lower)
    );
  }, [sessoes, busca]);
  
  // Upload de fotos
  const handleFileUpload = async (sessaoId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    const fileArray = Array.from(files);
    const dados = fileArray.map(file => ({
      titulo: file.name,
      descricao: '',
      data: new Date().toISOString().split('T')[0],
      categoria: 'DEBATE',
      tipo: file.type.startsWith('image/') ? 'IMAGEM' : 'DOCUMENTO',
    }));
    
    try {
      await uploadFotos(sessaoId, fileArray, dados);
    } finally {
      setUploading(false);
    }
  };
  
  // Loading state
  if (isLoading && sessoes.length === 0) {
    return (
      <div className={`${styles.materiaisContainer} ${isDarkMode ? styles.dark : ''}`}>
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.loadingSpinner} />
          <p>Carregando materiais...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${styles.materiaisContainer} ${isDarkMode ? styles.dark : ''}`}>
      {/* Header */}
      <header className={styles.heroHeader}>
        <div className={styles.container}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={styles.backLink}>
              <FaArrowLeft /> Voltar
            </Link>
            <button className={styles.themeToggle} onClick={toggleTheme}>
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
          
          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>MATERIAIS DAS SESSÕES</h1>
            <p className={styles.heroSubtitle}>
              Fotos e documentos de cada sessão do CineMar
            </p>
          </div>
        </div>
      </header>
      
      {/* Busca */}
      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar sessão ou diretor..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
      </div>
      
      {/* Grid de Sessões */}
      <main className={styles.mainContent}>
        <div className={styles.sessoesGrid}>
          {sessoesFiltradas.map(sessao => {
            const status = getSessaoStatus(sessao.dataSessao);
            const fotos = sessao.fotos || [];
            
            return (
              <div key={sessao.id} className={styles.sessaoCard}>
                <div className={styles.cardHeader}>
                  <span className={`${styles.statusBadge} ${styles[`badge${status}`]}`}>
                    {status}
                  </span>
                  <span className={styles.cardData}>
                    <FaCalendarAlt /> {formatarData(sessao.dataSessao)}
                  </span>
                </div>
                
                <h3>{sessao.titulo}</h3>
                <p className={styles.diretor}>
                  <FaFilm /> {sessao.diretor} • {sessao.ano}
                </p>
                
                <div className={styles.cardStats}>
                  <span><FaUsers /> {sessao.participantes}</span>
                  <span><FaCamera /> {fotos.length} fotos</span>
                </div>
                
                <div className={styles.cardActions}>
                  <button onClick={() => setSelectedSessao(sessao)}>
                    <FaEye /> Ver materiais
                  </button>
                  
                  {isAdmin && (
                    <label className={styles.uploadLabel}>
                      <FaPlus />
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={e => handleFileUpload(sessao.id, e.target.files)}
                        disabled={uploading}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      
      {/* Modal de Fotos */}
      {selectedSessao && (
        <div className={styles.modalOverlay} onClick={() => setSelectedSessao(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedSessao(null)}>
              <FaTimes />
            </button>
            
            <h2>{selectedSessao.titulo}</h2>
            <p className={styles.modalSubtitle}>
              {selectedSessao.diretor} • {formatarData(selectedSessao.dataSessao)}
            </p>
            
            <div className={styles.fotosGrid}>
              {(selectedSessao.fotos || []).map((foto: any) => (
                <div key={foto.id} className={styles.fotoCard}>
                  <img src={foto.url} alt={foto.titulo} />
                  <div className={styles.fotoInfo}>
                    <span>{foto.titulo}</span>
                    <span className={styles.fotoData}>{foto.data}</span>
                  </div>
                  {foto.driveLink && (
                    <a href={foto.driveLink} target="_blank" rel="noopener noreferrer">
                      <FaGoogleDrive /> Google Drive
                    </a>
                  )}
                </div>
              ))}
              
              {(!selectedSessao.fotos || selectedSessao.fotos.length === 0) && (
                <div className={styles.semFotos}>
                  <FaPhotoVideo />
                  <p>Nenhuma foto disponível</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>
          {toast.type === 'success' && <FaCheck />}
          {toast.type === 'error' && <FaExclamationTriangle />}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}