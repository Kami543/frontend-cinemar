// frontend/src/pages/Fotos.tsx

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaFilm,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaVideo,
  FaImage,
  FaGoogleDrive,
  FaRegImages,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaUserShield,
  FaCamera,
  FaLink,
  FaTag,
  FaCalendar,
  FaInfoCircle,
  FaYoutube,
  FaVimeo,
  FaSpinner,
  FaExclamationTriangle,
  FaUsers,
  FaClock,
  FaStar,
} from 'react-icons/fa';
import { useTheme } from '../components/context/ThemeContext';
import styles from '../styles/Fotos.module.css';
import { useSessoes } from '../hooks/useSessions';
import type { Sessao, Foto } from '../services/sessoes.service';
import PlaceholderImage from '../images/Fallback.png';

/* =========================================================
   COMPONENTE: IMAGEM COM FALLBACK
   ======================================================= */
interface MidiaProps {
  midia: Foto;
  dark: boolean;
  className: string;
}

function ImagemComFallback({ midia, dark, className }: MidiaProps) {
  const [erro, setErro] = useState(false);

  const abrirDrive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (midia.driveLink) window.open(midia.driveLink, '_blank');
    else if (midia.url.includes('drive.google.com')) window.open(midia.url, '_blank');
  };

  if (erro) {
    return (
      <div className={`${styles.fallbackImage} ${dark ? styles.darkFallback : ''}`}>
        <FaRegImages className={styles.fallbackIcon} />
        <p className={styles.fallbackText}>Imagem indisponível</p>
        {(midia.driveLink || midia.url.includes('drive.google.com')) && (
          <button className={styles.driveButton} onClick={abrirDrive}>
            <FaGoogleDrive />
            Ver no Google Drive
          </button>
        )}
      </div>
    );
  }

  return (
    <img
      src={midia.url}
      alt={midia.titulo}
      className={className}
      onError={() => setErro(true)}
      loading="lazy"
      decoding="async"
    />
  );
}

function VideoComFallback({ midia, dark, className }: MidiaProps) {
  const [erro, setErro] = useState(false);
  
  const getEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/([^/]+)/) || url.match(/id=([^&]+)/);
      const id = match?.[1];
      if (id) return `https://drive.google.com/file/d/${id}/preview`;
    }
    return url;
  };

  const src = getEmbedUrl(midia.url);

  const abrirDrive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (midia.driveLink) window.open(midia.driveLink, '_blank');
    else if (midia.url) window.open(midia.url, '_blank');
  };

  if (erro) {
    return (
      <div className={`${styles.fallbackVideo} ${dark ? styles.darkFallback : ''}`}>
        <FaVideo className={styles.fallbackIcon} />
        <p className={styles.fallbackText}>Vídeo indisponível</p>
        {(midia.driveLink || midia.url) && (
          <button className={styles.driveButton} onClick={abrirDrive}>
            <FaGoogleDrive />
            Assistir no Google Drive
          </button>
        )}
      </div>
    );
  }

  return (
    <iframe
      src={src}
      title={midia.titulo}
      className={className}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
      onError={() => setErro(true)}
    />
  );
}

/* =========================================================
   COMPONENTE: CARD DE SESSÃO
   ======================================================= */
function SessaoCard({
  sessao,
  dark,
  onClick,
  isAdmin,
  onEdit,
  onDelete,
}: {
  sessao: Sessao;
  dark: boolean;
  onClick: () => void;
  isAdmin: boolean;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const fotosCount = sessao.fotos?.filter(f => f.tipo === 'foto').length || 0;
  const videosCount = sessao.fotos?.filter(f => f.tipo === 'video').length || 0;
  const status = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSessao = new Date(sessao.dataSessao);
    dataSessao.setHours(0, 0, 0, 0);
    
    if (dataSessao > hoje) return { label: 'Agendada', color: '#3b82f6' };
    if (dataSessao.toDateString() === hoje.toDateString()) return { label: 'Hoje!', color: '#f59e0b' };
    return { label: 'Realizada', color: '#10b981' };
  }, [sessao.dataSessao]);

  return (
    <div
      className={`${styles.sessaoCard} ${dark ? styles.darkCard : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className={styles.sessaoCardHeader}>
        <h3 className={styles.sessaoCardTitulo}>{sessao.titulo}</h3>
        <span className={styles.sessaoCardStatus} style={{ backgroundColor: status.color }}>
          {status.label}
        </span>
      </div>

      <div className={styles.sessaoCardContent}>
        <div className={styles.eventoCardMeta}>
          <span className={styles.metaItem}>
            <FaCalendarAlt className={styles.metaItemIcon} />
            {new Date(sessao.dataSessao).toLocaleDateString('pt-BR')}
          </span>
          <span className={styles.metaItem}>
            <FaFilm className={styles.metaItemIcon} />
            {sessao.diretor}
          </span>
          <span className={styles.metaItem}>
            <FaUsers className={styles.metaItemIcon} />
            {sessao.participantes || 0} participantes
          </span>
        </div>

        <p className={styles.eventoCardDescricao}>{sessao.descricao}</p>

        <div className={styles.sessaoCardStats}>
          <span className={styles.statItem}>
            <FaImage /> {fotosCount} foto{fotosCount !== 1 ? 's' : ''}
          </span>
          <span className={styles.statItem}>
            <FaVideo /> {videosCount} vídeo{videosCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className={styles.sessaoCardFooter}>
        <button className={styles.verFotosButton}>Ver galeria completa</button>
        {isAdmin && (
          <div className={styles.cardAdminActions}>
            <button onClick={onEdit} className={styles.cardEditBtn}><FaEdit /></button>
            <button onClick={onDelete} className={styles.cardDeleteBtn}><FaTrash /></button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTE: CARD DE MÍDIA
   ======================================================= */
function MidiaCard({
  midia,
  dark,
  onClick,
  isAdmin,
  onEdit,
  onDelete,
}: {
  midia: Foto;
  dark: boolean;
  onClick: () => void;
  isAdmin: boolean;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const isVideo = midia.tipo === 'video';

  return (
    <div
      className={`${styles.midiaCard} ${isVideo ? styles.videoCard : ''} ${dark ? styles.darkCard : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className={styles.midiaImagemContainer}>
        {isVideo ? (
          <VideoComFallback midia={midia} dark={dark} className={styles.videoPreview} />
        ) : (
          <ImagemComFallback midia={midia} dark={dark} className={styles.midiaImagem} />
        )}
        <div className={styles.midiaTipoBadge}>
          {isVideo ? <FaVideo /> : <FaImage />}
        </div>
      </div>

      <div className={styles.midiaInfo}>
        <h4 className={styles.midiaTitulo}>{midia.titulo}</h4>
        <p className={styles.midiaDescricao}>{midia.descricao}</p>
        <div className={styles.midiaMeta}>
          <span className={styles.midiaData}>
            <FaCalendarAlt /> {new Date(midia.data).toLocaleDateString('pt-BR')}
          </span>
          <span className={styles.midiaCategoria}>
            <FaTag /> {midia.categoria}
          </span>
        </div>
        {isAdmin && (
          <div className={styles.midiaAdminActions}>
            <button onClick={onEdit} className={styles.midiaEditBtn}><FaEdit /></button>
            <button onClick={onDelete} className={styles.midiaDeleteBtn}><FaTrash /></button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTE: VISUALIZADOR
   ======================================================= */
function Visualizador({
  midia,
  sessaoTitulo,
  dark,
  onFechar,
  onNavegar,
}: {
  midia: Foto;
  sessaoTitulo: string;
  dark: boolean;
  onFechar: () => void;
  onNavegar: (dir: 'anterior' | 'proximo') => void;
}) {
  const isVideo = midia.tipo === 'video';

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar();
      if (e.key === 'ArrowLeft') onNavegar('anterior');
      if (e.key === 'ArrowRight') onNavegar('proximo');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onFechar, onNavegar]);

  return (
    <div className={styles.visualizadorOverlay} onClick={e => e.target === e.currentTarget && onFechar()}>
      <div className={styles.visualizadorContent}>
        <button className={styles.fecharVisualizador} onClick={onFechar}>
          <FaTimes />
        </button>

        <div className={styles.visualizadorNavegacao}>
          <button className={styles.navegacaoButton} onClick={() => onNavegar('anterior')}>
            <FaChevronLeft />
          </button>

          <div className={styles.visualizadorPrincipal}>
            {isVideo ? (
              <VideoComFallback midia={midia} dark={dark} className={styles.visualizadorVideo} />
            ) : (
              <ImagemComFallback midia={midia} dark={dark} className={styles.visualizadorImagem} />
            )}
          </div>

          <button className={styles.navegacaoButton} onClick={() => onNavegar('proximo')}>
            <FaChevronRight />
          </button>
        </div>

        <div className={styles.visualizadorInfo}>
          <h3 className={styles.visualizadorTitulo}>
            {midia.titulo}
            <span className={styles.midiaTipoBadgeVisualizador}>
              {isVideo ? 'Vídeo' : 'Foto'}
            </span>
          </h3>
          <p className={styles.visualizadorDescricao}>{midia.descricao}</p>
          <div className={styles.visualizadorMeta}>
            <span><FaCalendarAlt /> {new Date(midia.data).toLocaleDateString('pt-BR')}</span>
            <span><FaTag /> {midia.categoria}</span>
            <span><FaFilm /> Sessão: {sessaoTitulo}</span>
          </div>
          {(midia.driveLink || midia.url.includes('drive.google.com')) && (
            <button 
              className={styles.visualizadorDriveButton} 
              onClick={() => window.open(midia.driveLink || midia.url, '_blank')}
            >
              <FaGoogleDrive />
              Abrir no Google Drive
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ======================================================= */
export default function Fotos() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<Sessao | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroAno, setFiltroAno] = useState<string>('todos');
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');
  const [midiaSelecionada, setMidiaSelecionada] = useState<Foto | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSessaoForm, setShowSessaoForm] = useState(false);
  const [editingSessao, setEditingSessao] = useState<Sessao | null>(null);
  const [editingMidia, setEditingMidia] = useState<{ sessaoId: string; midia: Foto } | null>(null);
  const [filmeDestaque, setFilmeDestaque] = useState<{ id: string; titulo: string } | null>(null);

  // Parâmetros da URL para filmes
  const filmeId = searchParams.get('filmeId');
  const filmeTitulo = searchParams.get('titulo');
  const tipo = searchParams.get('tipo');
  const fotoId = searchParams.get('fotoId');

  // Hook de sessões
  const {
    sessoes,
    isLoading,
    error,
    toast,
    stats,
    createSessao,
    updateSessao,
    removeSessao,
    addFoto,
    removeFoto,
    setSearch,
    setAno,
    resetFilters,
    refetch,
    getFotosBySessao,
  } = useSessoes({ initialLimit: 100 });

  // Verificar usuário logado
  useEffect(() => {
    const storedUser = localStorage.getItem('cinemar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  // Estado do formulário de Sessão
  const [sessaoForm, setSessaoForm] = useState<Partial<Omit<Sessao, 'id' | 'createdAt' | 'updatedAt'>>>({
    titulo: '',
    diretor: '',
    ano: new Date().getFullYear(),
    dataSessao: '',
    participantes: 0,
    descricao: '',
  });

  // Estado do formulário de Mídia
  const [midiaForm, setMidiaForm] = useState<Partial<Omit<Foto, 'id' | 'createdAt' | 'sessaoId'>>>({
    url: '',
    titulo: '',
    descricao: '',
    data: new Date().toISOString().split('T')[0],
    categoria: '',
    tipo: 'foto',
    driveLink: ''
  });

  // Se veio de um filme, destacar e filtrar
  useEffect(() => {
    if (filmeId && tipo === 'filme') {
      setFilmeDestaque({ id: filmeId, titulo: filmeTitulo || 'Filme' });
      // Buscar na lista de sessões por um título que contenha o nome do filme
      const sessaoDoFilme = sessoes.find(s => 
        s.titulo.toLowerCase().includes(filmeTitulo?.toLowerCase() || '')
      );
      if (sessaoDoFilme) {
        setSessaoSelecionada(sessaoDoFilme);
      }
    }
  }, [filmeId, filmeTitulo, tipo, sessoes]);

  // Se tem fotoId, abrir o visualizador
  useEffect(() => {
    if (fotoId && sessaoSelecionada) {
      const fotos = getFotosBySessao(sessaoSelecionada.id);
      const foto = fotos.find(f => f.id === fotoId);
      if (foto) {
        setMidiaSelecionada(foto);
      }
    }
  }, [fotoId, sessaoSelecionada, getFotosBySessao]);

  // Filtro de busca com debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(busca);
    }, 500);
    return () => clearTimeout(timer);
  }, [busca, setSearch]);

  // Filtro de ano
  useEffect(() => {
    setAno(filtroAno === 'todos' ? undefined : parseInt(filtroAno));
  }, [filtroAno, setAno]);

  // Anos únicos para filtro
  const anosUnicos = useMemo(() => {
    const anos = sessoes.map(s => new Date(s.dataSessao).getFullYear());
    return ['todos', ...Array.from(new Set(anos)).sort((a, b) => b - a)];
  }, [sessoes]);

  // Categorias únicas da sessão selecionada
  const categorias = useMemo(() => {
    if (!sessaoSelecionada) return [];
    const fotos = getFotosBySessao(sessaoSelecionada.id);
    return ['todas', ...Array.from(new Set(fotos.map(f => f.categoria)))];
  }, [sessaoSelecionada, getFotosBySessao]);

  // Mídias filtradas da sessão selecionada
  const midiasFiltradas = useMemo(() => {
    if (!sessaoSelecionada) return [];
    const fotos = getFotosBySessao(sessaoSelecionada.id);
    if (categoriaAtiva === 'todas') return fotos;
    return fotos.filter(f => f.categoria === categoriaAtiva);
  }, [sessaoSelecionada, categoriaAtiva, getFotosBySessao]);

  // Navegação no visualizador
  const navegarMidia = useCallback(
    (dir: 'anterior' | 'proximo') => {
      if (!midiaSelecionada) return;
      const idx = midiasFiltradas.findIndex(f => f.id === midiaSelecionada.id);
      const next = dir === 'anterior'
        ? midiasFiltradas[idx > 0 ? idx - 1 : midiasFiltradas.length - 1]
        : midiasFiltradas[idx < midiasFiltradas.length - 1 ? idx + 1 : 0];
      if (next) setMidiaSelecionada(next);
    },
    [midiaSelecionada, midiasFiltradas]
  );

  // CRUD Sessões
  const handleAddSessao = async () => {
    if (!sessaoForm.titulo || !sessaoForm.diretor || !sessaoForm.dataSessao || !sessaoForm.descricao) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    await createSessao({
      titulo: sessaoForm.titulo!,
      diretor: sessaoForm.diretor!,
      ano: sessaoForm.ano || new Date().getFullYear(),
      dataSessao: sessaoForm.dataSessao!,
      descricao: sessaoForm.descricao!,
      participantes: sessaoForm.participantes || 0,
    });

    resetSessaoForm();
    setShowSessaoForm(false);
  };

  const handleEditSessao = async () => {
    if (!editingSessao) return;

    await updateSessao(editingSessao.id, {
      titulo: sessaoForm.titulo,
      diretor: sessaoForm.diretor,
      ano: sessaoForm.ano,
      dataSessao: sessaoForm.dataSessao,
      descricao: sessaoForm.descricao,
      participantes: sessaoForm.participantes,
    });

    resetSessaoForm();
    setShowSessaoForm(false);
    setEditingSessao(null);
    if (sessaoSelecionada?.id === editingSessao.id) {
      setSessaoSelecionada({ ...editingSessao, ...sessaoForm });
    }
  };

  const handleDeleteSessao = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta sessão e todas as suas fotos/vídeos?')) {
      await removeSessao(id);
      if (sessaoSelecionada?.id === id) setSessaoSelecionada(null);
    }
  };

  const openEditSessao = (sessao: Sessao, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessaoForm({
      titulo: sessao.titulo,
      diretor: sessao.diretor,
      ano: sessao.ano,
      dataSessao: sessao.dataSessao,
      participantes: sessao.participantes,
      descricao: sessao.descricao,
    });
    setEditingSessao(sessao);
    setShowSessaoForm(true);
  };

  const resetSessaoForm = () => {
    setSessaoForm({
      titulo: '',
      diretor: '',
      ano: new Date().getFullYear(),
      dataSessao: '',
      participantes: 0,
      descricao: '',
    });
    setEditingSessao(null);
  };

  // CRUD Mídias
  const handleAddMidia = async () => {
    if (!sessaoSelecionada) return;
    if (!midiaForm.url || !midiaForm.titulo || !midiaForm.categoria) {
      alert('Preencha URL, título e categoria!');
      return;
    }

    await addFoto(sessaoSelecionada.id, {
      url: midiaForm.url!,
      titulo: midiaForm.titulo!,
      descricao: midiaForm.descricao || '',
      data: midiaForm.data || new Date().toISOString().split('T')[0],
      categoria: midiaForm.categoria!,
      tipo: midiaForm.tipo || 'foto',
      driveLink: midiaForm.driveLink,
    });

    resetMidiaForm();
    setShowForm(false);
  };

  const handleEditMidia = async () => {
    if (!sessaoSelecionada || !editingMidia) return;

    await removeFoto(sessaoSelecionada.id, editingMidia.midia.id);
    await addFoto(sessaoSelecionada.id, {
      url: midiaForm.url!,
      titulo: midiaForm.titulo!,
      descricao: midiaForm.descricao || '',
      data: midiaForm.data || new Date().toISOString().split('T')[0],
      categoria: midiaForm.categoria!,
      tipo: midiaForm.tipo || 'foto',
      driveLink: midiaForm.driveLink,
    });

    resetMidiaForm();
    setShowForm(false);
    setEditingMidia(null);
  };

  const handleDeleteMidia = async (sessaoId: string, midiaId: string) => {
    if (confirm('Tem certeza que deseja excluir esta mídia?')) {
      await removeFoto(sessaoId, midiaId);
      if (midiaSelecionada?.id === midiaId) setMidiaSelecionada(null);
    }
  };

  const openEditMidia = (sessaoId: string, midia: Foto, e: React.MouseEvent) => {
    e.stopPropagation();
    setMidiaForm({
      url: midia.url,
      titulo: midia.titulo,
      descricao: midia.descricao,
      data: midia.data,
      categoria: midia.categoria,
      tipo: midia.tipo,
      driveLink: midia.driveLink
    });
    setEditingMidia({ sessaoId, midia });
    setShowForm(true);
  };

  const resetMidiaForm = () => {
    setMidiaForm({
      url: '',
      titulo: '',
      descricao: '',
      data: new Date().toISOString().split('T')[0],
      categoria: '',
      tipo: 'foto',
      driveLink: ''
    });
    setEditingMidia(null);
  };

  const clearAllFilters = () => {
    setBusca('');
    setFiltroAno('todos');
    resetFilters();
  };

  // Loading state
  if (isLoading && sessoes.length === 0) {
    return (
      <div className={`${styles.fotosContainer} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.loadingSpinner} />
          <p>Carregando sessões...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && sessoes.length === 0) {
    return (
      <div className={`${styles.fotosContainer} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={styles.errorContainer}>
          <FaExclamationTriangle />
          <h3>Erro ao carregar sessões</h3>
          <p>{error}</p>
          <button onClick={() => refetch()}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.fotosContainer} ${isDarkMode ? styles.darkMode : ''}`}>

      {/* ---- HEADER ---- */}
      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={styles.backLink}>
              ← Voltar para Início
            </Link>
            {filmeDestaque && (
              <Link to="/filmes" className={styles.backLink}>
                ← Voltar para Catálogo de Filmes
              </Link>
            )}
          </div>

          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>
              {sessaoSelecionada 
                ? sessaoSelecionada.titulo 
                : filmeDestaque 
                  ? `Fotos do filme: ${filmeDestaque.titulo}`
                  : 'Fotos e vídeos das sessões'}
            </h1>
            <p className={styles.heroSubtitle}>
              {sessaoSelecionada
                ? `Galeria da sessão · ${sessaoSelecionada.diretor}`
                : filmeDestaque
                  ? `Galeria completa de fotos do filme ${filmeDestaque.titulo}`
                  : 'Galeria completa dos debates do CineMar'}
            </p>
            {stats && !sessaoSelecionada && !filmeDestaque && (
              <div className={styles.heroStats}>
                <span>{stats.totalSessoes} sessões</span>
                <span>•</span>
                <span>{stats.totalFotos} mídias</span>
                <span>•</span>
                <span>{stats.totalParticipantes} participantes</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Botão flutuante de adicionar (apenas admin) */}
      {isAdmin && !sessaoSelecionada && (
        <button
          className={styles.floatingAddBtn}
          onClick={() => setShowSessaoForm(true)}
          title="Adicionar sessão"
        >
          <FaPlus />
        </button>
      )}

      {isAdmin && sessaoSelecionada && (
        <button
          className={styles.floatingAddBtn}
          onClick={() => { resetMidiaForm(); setShowForm(true); }}
          title="Adicionar mídia"
        >
          <FaPlus />
        </button>
      )}

      {/* Formulário de Sessão */}
      {showSessaoForm && isAdmin && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h3>{editingSessao ? 'Editar Sessão' : 'Nova Sessão'}</h3>
              <button onClick={() => { setShowSessaoForm(false); resetSessaoForm(); }} className={styles.formClose}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.formBody}>
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Informações da Sessão</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Título *</label>
                    <input
                      type="text"
                      value={sessaoForm.titulo}
                      onChange={(e) => setSessaoForm({ ...sessaoForm, titulo: e.target.value })}
                      placeholder="Nome da sessão"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Diretor *</label>
                    <input
                      type="text"
                      value={sessaoForm.diretor}
                      onChange={(e) => setSessaoForm({ ...sessaoForm, diretor: e.target.value })}
                      placeholder="Diretor do filme"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Ano</label>
                    <input
                      type="number"
                      value={sessaoForm.ano}
                      onChange={(e) => setSessaoForm({ ...sessaoForm, ano: parseInt(e.target.value) })}
                      placeholder="2024"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Data da Sessão *</label>
                    <input
                      type="date"
                      value={sessaoForm.dataSessao?.split('T')[0]}
                      onChange={(e) => setSessaoForm({ ...sessaoForm, dataSessao: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Participantes</label>
                    <input
                      type="number"
                      value={sessaoForm.participantes}
                      onChange={(e) => setSessaoForm({ ...sessaoForm, participantes: parseInt(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Descrição *</label>
                  <textarea
                    value={sessaoForm.descricao}
                    onChange={(e) => setSessaoForm({ ...sessaoForm, descricao: e.target.value })}
                    placeholder="Descrição da sessão..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formFooter}>
              <button className={styles.cancelBtn} onClick={() => { setShowSessaoForm(false); resetSessaoForm(); }}>
                Cancelar
              </button>
              <button className={styles.submitBtn} onClick={editingSessao ? handleEditSessao : handleAddSessao}>
                <FaSave /> {editingSessao ? 'Salvar Alterações' : 'Adicionar Sessão'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulário de Mídia */}
      {showForm && isAdmin && sessaoSelecionada && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h3>{editingMidia ? 'Editar Mídia' : 'Adicionar Mídia'}</h3>
              <button onClick={() => { setShowForm(false); resetMidiaForm(); }} className={styles.formClose}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.formBody}>
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Informações da Mídia</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Tipo *</label>
                    <select
                      value={midiaForm.tipo}
                      onChange={(e) => setMidiaForm({ ...midiaForm, tipo: e.target.value as 'foto' | 'video' })}
                    >
                      <option value="foto">Foto</option>
                      <option value="video">Vídeo</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Categoria *</label>
                    <input
                      type="text"
                      value={midiaForm.categoria}
                      onChange={(e) => setMidiaForm({ ...midiaForm, categoria: e.target.value })}
                      placeholder="Debate, Apresentação, Bastidores..."
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>URL *</label>
                  <input
                    type="text"
                    value={midiaForm.url}
                    onChange={(e) => setMidiaForm({ ...midiaForm, url: e.target.value })}
                    placeholder="Link da imagem ou vídeo"
                  />
                  <small>Use link direto do Google Drive ou URL da imagem</small>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Título *</label>
                    <input
                      type="text"
                      value={midiaForm.titulo}
                      onChange={(e) => setMidiaForm({ ...midiaForm, titulo: e.target.value })}
                      placeholder="Título da mídia"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Data</label>
                    <input
                      type="date"
                      value={midiaForm.data?.split('T')[0]}
                      onChange={(e) => setMidiaForm({ ...midiaForm, data: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Descrição</label>
                  <textarea
                    value={midiaForm.descricao}
                    onChange={(e) => setMidiaForm({ ...midiaForm, descricao: e.target.value })}
                    placeholder="Descrição da mídia..."
                    rows={3}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Link do Google Drive (opcional)</label>
                  <input
                    type="text"
                    value={midiaForm.driveLink}
                    onChange={(e) => setMidiaForm({ ...midiaForm, driveLink: e.target.value })}
                    placeholder="https://drive.google.com/file/d/.../view"
                  />
                </div>
              </div>
            </div>

            <div className={styles.formFooter}>
              <button className={styles.cancelBtn} onClick={() => { setShowForm(false); resetMidiaForm(); }}>
                Cancelar
              </button>
              <button className={styles.submitBtn} onClick={editingMidia ? handleEditMidia : handleAddMidia}>
                <FaSave /> {editingMidia ? 'Salvar Alterações' : 'Adicionar Mídia'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- LISTA DE SESSÕES ---- */}
      {!sessaoSelecionada ? (
        <>
          <div className={styles.filtersSection}>
            <div className={styles.filtersContent}>
              <div className={styles.searchContainer}>
                <div className={styles.searchBox}>
                  <FaSearch className={styles.searchIcon} />
                  <input
                    type="search"
                    placeholder="Buscar por título, diretor ou descrição…"
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    className={styles.searchInput}
                  />
                  {busca && (
                    <button className={styles.clearSearch} onClick={() => setBusca('')}>
                      <FaTimes />
                    </button>
                  )}
                </div>

                <div className={styles.filtersInfo}>
                  <span>Filtrar por ano:</span>
                </div>

                <div className={styles.tipoFilters}>
                  {anosUnicos.map(ano => (
                    <button
                      key={ano}
                      className={`${styles.tipoFilterBtn} ${filtroAno === ano ? styles.active : ''}`}
                      onClick={() => setFiltroAno(ano)}
                    >
                      {ano === 'todos' ? 'Todos os anos' : `Ano ${ano}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <main className={styles.mainContent}>
            <div className={styles.allEvents}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.selecaoTitulo}>
                  <FaCalendarAlt className={styles.sectionTitleIcon} />
                  {filmeDestaque ? `Fotos do filme: ${filmeDestaque.titulo}` : 'Todas as sessões'}
                  <span className={styles.eventosCount}>{sessoes.length}</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  {filmeDestaque 
                    ? `Galeria de fotos do filme ${filmeDestaque.titulo}` 
                    : 'Selecione uma sessão para ver fotos, vídeos e momentos especiais'}
                </p>
              </div>

              {sessoes.length === 0 ? (
                <div className={styles.noResults}>
                  <div className={styles.noResultsIcon}><FaSearch /></div>
                  <h3>Nenhuma sessão encontrada</h3>
                  <p>Tente alterar os filtros ou o termo de busca</p>
                  <button
                    className={styles.clearFiltersBtn}
                    onClick={clearAllFilters}
                  >
                    Limpar filtros
                  </button>
                  {isAdmin && (
                    <button
                      className={styles.addSessaoButton}
                      onClick={() => setShowSessaoForm(true)}
                    >
                      <FaPlus /> Criar primeira sessão
                    </button>
                  )}
                </div>
              ) : (
                <div className={styles.sessoesList}>
                  {sessoes.map(sessao => (
                    <SessaoCard
                      key={sessao.id}
                      sessao={sessao}
                      dark={isDarkMode}
                      onClick={() => setSessaoSelecionada(sessao)}
                      isAdmin={isAdmin}
                      onEdit={(e) => openEditSessao(sessao, e)}
                      onDelete={(e) => { e.stopPropagation(); handleDeleteSessao(sessao.id); }}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </>
      ) : (
        /* ---- GALERIA DA SESSÃO ---- */
        <main className={styles.mainContent}>
          <div className={`${styles.sessaoHeader} ${isDarkMode ? styles.darkCard : ''}`}>
            <div className={styles.sessaoInfo}>
              <div className={styles.sessaoHeaderTop}>
                <h2 className={styles.sessaoTitulo}>{sessaoSelecionada.titulo}</h2>
                <button 
                  className={styles.voltarButton}
                  onClick={() => {
                    setSessaoSelecionada(null);
                    setFilmeDestaque(null);
                  }}
                >
                  ← Voltar para lista
                </button>
              </div>

              <div className={styles.sessaoDetalhes}>
                <div className={styles.sessaoInfoLinha}>
                  <span className={styles.sessaoInfoItem}>
                    <FaFilm />
                    {sessaoSelecionada.diretor} · {sessaoSelecionada.ano}
                  </span>
                  <span className={styles.sessaoInfoItem}>
                    <FaCalendarAlt />
                    {new Date(sessaoSelecionada.dataSessao).toLocaleDateString('pt-BR')}
                  </span>
                  <span className={styles.sessaoInfoItem}>
                    <FaUsers />
                    {sessaoSelecionada.participantes || 0} participantes
                  </span>
                </div>
                <p className={styles.sessaoDescricao}>{sessaoSelecionada.descricao}</p>
              </div>

              <div className={styles.sessaoStats}>
                <span className={styles.statBadge}>
                  <FaImage /> {getFotosBySessao(sessaoSelecionada.id).filter(f => f.tipo === 'foto').length} fotos
                </span>
                <span className={styles.statBadge}>
                  <FaVideo /> {getFotosBySessao(sessaoSelecionada.id).filter(f => f.tipo === 'video').length} vídeos
                </span>
              </div>
            </div>

            {categorias.length > 1 && (
              <nav className={styles.categoriasNavegacao}>
                {categorias.map(cat => (
                  <button
                    key={cat}
                    className={`${styles.categoriaButton} ${categoriaAtiva === cat ? styles.ativa : ''}`}
                    onClick={() => setCategoriaAtiva(cat)}
                  >
                    {cat === 'todas'
                      ? 'Todos os materiais'
                      : `${cat} (${getFotosBySessao(sessaoSelecionada.id).filter(f => f.categoria === cat).length})`}
                  </button>
                ))}
              </nav>
            )}
          </div>

          <div className={styles.galeriaContainer}>
            {midiasFiltradas.length > 0 ? (
              <div className={styles.galeriaGrid}>
                {midiasFiltradas.map(midia => (
                  <MidiaCard
                    key={midia.id}
                    midia={midia}
                    dark={isDarkMode}
                    onClick={() => setMidiaSelecionada(midia)}
                    isAdmin={isAdmin}
                    onEdit={(e) => openEditMidia(sessaoSelecionada.id, midia, e)}
                    onDelete={(e) => { e.stopPropagation(); handleDeleteMidia(sessaoSelecionada.id, midia.id); }}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}><FaSearch /></div>
                <h3>Nenhum material encontrado</h3>
                <p>Tente selecionar outra categoria</p>
                <button className={styles.clearFiltersBtn} onClick={() => setCategoriaAtiva('todas')}>
                  Mostrar todos
                </button>
                {isAdmin && (
                  <button
                    className={styles.addMidiaButton}
                    onClick={() => { resetMidiaForm(); setShowForm(true); }}
                  >
                    <FaPlus /> Adicionar primeira mídia
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      )}

      {/* ---- VISUALIZADOR ---- */}
      {midiaSelecionada && sessaoSelecionada && (
        <Visualizador
          midia={midiaSelecionada}
          sessaoTitulo={sessaoSelecionada.titulo}
          dark={isDarkMode}
          onFechar={() => setMidiaSelecionada(null)}
          onNavegar={navegarMidia}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>
          {toast.type === 'success' && <FaSave />}
          {toast.type === 'error' && <FaExclamationTriangle />}
          {toast.type === 'warn' && <FaExclamationTriangle />}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}