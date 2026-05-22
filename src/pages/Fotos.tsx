import { useState, useEffect, useCallback, useRef } from 'react';
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
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/context/ThemeContext';
import styles from '../styles/Fotos.module.css';

/* =========================================================
   TIPOS
   ======================================================= */
interface Foto {
  id: number;
  url: string;
  titulo: string;
  descricao: string;
  data: string;
  categoria: string;
  tipo: 'foto' | 'video';
  driveLink?: string;
}

interface Sessao {
  id: number;
  titulo: string;
  diretor: string;
  ano: number;
  dataSessao: string;
  participantes: number;
  descricao: string;
  fotos: Foto[];
}

/* =========================================================
   UTILITÁRIOS
   ======================================================= */
function getDriveEmbedUrl(url: string, tipo: 'foto' | 'video'): string {
  if (tipo !== 'video') return url;
  const match = url.match(/\/d\/([^/]+)/) ?? url.match(/id=([^&]+)/);
  const id = match?.[1];
  return id ? `https://drive.google.com/file/d/${id}/preview` : url;
}

/* =========================================================
   DADOS INICIAIS
   ======================================================= */
const SESSOES_INICIAIS: Sessao[] = [
  {
    id: 6,
    titulo: 'O AGENTE SECRETO',
    diretor: 'Kleber Mendonça Filho',
    ano: 2025,
    dataSessao: '06/11/2024',
    participantes: 68,
    descricao:
      'Sessão especial de pré-estreia com debate sobre o novo filme de Kleber Mendonça Filho, abordando temas como ditadura, identidade nacional e cinema contemporâneo brasileiro.',
    fotos: [
      {
        id: 1,
        url: 'https://drive.google.com/thumbnail?id=1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t1&sz=w1000',
        driveLink: 'https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t1/view',
        titulo: 'Debate completo — parte 1',
        descricao: 'Momentos iniciais do debate sobre O Agente Secreto',
        data: '06/11/2024',
        categoria: 'Debate',
        tipo: 'foto',
      },
      {
        id: 2,
        url: 'https://drive.google.com/thumbnail?id=1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t2&sz=w1000',
        driveLink: 'https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t2/view',
        titulo: 'Apresentação do filme',
        descricao: 'Introdução à obra de Kleber Mendonça Filho',
        data: '06/11/2024',
        categoria: 'Apresentação',
        tipo: 'foto',
      },
      {
        id: 101,
        url: 'https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t7/preview',
        driveLink: 'https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t7/view',
        titulo: 'Debate completo — gravação integral',
        descricao: 'Gravação completa da sessão de debate (2h 15min)',
        data: '06/11/2024',
        categoria: 'Debate',
        tipo: 'video',
      },
      {
        id: 201,
        url: 'https://drive.google.com/thumbnail?id=1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t10&sz=w1000',
        driveLink: 'https://drive.google.com/file/d/1QTWlJfQqI9F2G7J8FQ3JYqMkLqP8V2t10/view',
        titulo: 'Preparação do espaço',
        descricao: 'Organização antes do início da sessão',
        data: '06/11/2024',
        categoria: 'Bastidores',
        tipo: 'foto',
      },
    ],
  },
  {
    id: 1,
    titulo: 'AINDA ESTOU AQUI',
    diretor: 'Walter Salles',
    ano: 2024,
    dataSessao: '05/10/2024',
    participantes: 42,
    descricao:
      'Documentário sobre a trajetória de Walter Salles no cinema nacional, com debate sobre linguagem cinematográfica e memória visual brasileira.',
    fotos: [
      {
        id: 1001,
        url: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80',
        titulo: 'Abertura da sessão',
        descricao: 'Momento inicial do debate sobre Walter Salles',
        data: '05/10/2024',
        categoria: 'Debate',
        tipo: 'foto',
      },
      {
        id: 1002,
        url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
        titulo: 'Mediação',
        descricao: 'Mediação do debate pelos coordenadores',
        data: '05/10/2024',
        categoria: 'Debate',
        tipo: 'foto',
      },
    ],
  },
];

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
  };

  if (erro) {
    return (
      <div className={`${styles.fallbackImage} ${dark ? styles.darkFallback : ''}`}>
        <FaRegImages className={styles.fallbackIcon} />
        <p className={styles.fallbackText}>Imagem indisponível</p>
        {midia.driveLink && (
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
  const src = getDriveEmbedUrl(midia.url, 'video');

  const abrirDrive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (midia.driveLink) window.open(midia.driveLink, '_blank');
  };

  if (erro) {
    return (
      <div className={`${styles.fallbackVideo} ${dark ? styles.darkFallback : ''}`}>
        <FaVideo className={styles.fallbackIcon} />
        <p className={styles.fallbackText}>Vídeo indisponível</p>
        {midia.driveLink && (
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
  const fotos = sessao.fotos.filter(f => f.tipo === 'foto').length;
  const videos = sessao.fotos.filter(f => f.tipo === 'video').length;

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
        <span className={styles.sessaoCardStatus}>{sessao.participantes} participantes</span>
      </div>

      <div className={styles.sessaoCardContent}>
        <div className={styles.eventoCardMeta}>
          <span className={styles.metaItem}>
            <FaCalendarAlt className={styles.metaItemIcon} />
            {sessao.dataSessao}
          </span>
          <span className={styles.metaItem}>
            <FaFilm className={styles.metaItemIcon} />
            {sessao.diretor}
          </span>
        </div>

        <p className={styles.eventoCardDescricao}>{sessao.descricao}</p>

        <div className={styles.sessaoCardStats}>
          <span className={styles.statItem}>{fotos} foto{fotos !== 1 ? 's' : ''}</span>
          <span className={styles.statItem}>{videos} vídeo{videos !== 1 ? 's' : ''}</span>
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
      </div>

      <div className={styles.midiaInfo}>
        <div className={styles.midiaTipo}>
          {isVideo ? <FaVideo /> : <FaImage />}
          <span>{isVideo ? 'Vídeo' : 'Foto'}</span>
        </div>
        <h4 className={styles.midiaTitulo}>{midia.titulo}</h4>
        <p className={styles.midiaDescricao}>{midia.descricao}</p>
        <div className={styles.midiaMeta}>
          <span className={styles.midiaData}>{midia.data}</span>
          <span className={styles.midiaCategoria}>{midia.categoria}</span>
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
            <span className={styles.midiaTipoBadge}>{isVideo ? 'Vídeo' : 'Foto'}</span>
          </h3>
          <p className={styles.visualizadorDescricao}>{midia.descricao}</p>
          <div className={styles.visualizadorMeta}>
            <span>{midia.data}</span>
            <span>{midia.categoria}</span>
            <span>Sessão: {sessaoTitulo}</span>
          </div>
          {midia.driveLink && (
            <button className={styles.visualizadorDriveButton} onClick={() => window.open(midia.driveLink, '_blank')}>
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
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<Sessao | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroAno, setFiltroAno] = useState('todos');
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');
  const [midiaSelecionada, setMidiaSelecionada] = useState<Foto | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSessaoForm, setShowSessaoForm] = useState(false);
  const [editingSessao, setEditingSessao] = useState<Sessao | null>(null);
  const [editingMidia, setEditingMidia] = useState<{ sessaoId: number; midia: Foto } | null>(null);

  // Estado do formulário de Sessão
  const [sessaoForm, setSessaoForm] = useState<Partial<Sessao>>({
    titulo: '',
    diretor: '',
    ano: new Date().getFullYear(),
    dataSessao: '',
    participantes: 0,
    descricao: '',
    fotos: []
  });

  // Estado do formulário de Mídia
  const [midiaForm, setMidiaForm] = useState<Partial<Foto>>({
    url: '',
    titulo: '',
    descricao: '',
    data: '',
    categoria: '',
    tipo: 'foto',
    driveLink: ''
  });

  // Carregar dados do localStorage
  useEffect(() => {
    const storedSessoes = localStorage.getItem('cinemar_sessoes');
    if (storedSessoes) {
      setSessoes(JSON.parse(storedSessoes));
    } else {
      setSessoes(SESSOES_INICIAIS);
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    if (sessoes.length > 0) {
      localStorage.setItem('cinemar_sessoes', JSON.stringify(sessoes));
    }
  }, [sessoes]);

  // Verificar usuário logado
  useEffect(() => {
    const storedUser = localStorage.getItem('cinemar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    document.body.style.overflow = midiaSelecionada ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [midiaSelecionada]);

  useEffect(() => {
    setCategoriaAtiva('todas');
  }, [sessaoSelecionada]);

  // ===== CRUD SESSÕES =====
  const handleAddSessao = () => {
    if (!sessaoForm.titulo || !sessaoForm.diretor || !sessaoForm.dataSessao) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const newSessao: Sessao = {
      id: Date.now(),
      titulo: sessaoForm.titulo!,
      diretor: sessaoForm.diretor!,
      ano: sessaoForm.ano || new Date().getFullYear(),
      dataSessao: sessaoForm.dataSessao!,
      participantes: sessaoForm.participantes || 0,
      descricao: sessaoForm.descricao || '',
      fotos: []
    };

    setSessoes([newSessao, ...sessoes]);
    resetSessaoForm();
    setShowSessaoForm(false);
  };

  const handleEditSessao = () => {
    if (!editingSessao) return;

    const updatedSessoes = sessoes.map(s =>
      s.id === editingSessao.id ? { ...s, ...sessaoForm } : s
    );

    setSessoes(updatedSessoes);
    resetSessaoForm();
    setShowSessaoForm(false);
    setEditingSessao(null);
    if (sessaoSelecionada?.id === editingSessao.id) {
      setSessaoSelecionada({ ...editingSessao, ...sessaoForm });
    }
  };

  const handleDeleteSessao = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta sessão e todas as suas fotos/vídeos?')) {
      setSessoes(sessoes.filter(s => s.id !== id));
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
      fotos: []
    });
    setEditingSessao(null);
  };

  // ===== CRUD MÍDIAS =====
  const handleAddMidia = () => {
    if (!sessaoSelecionada) return;
    if (!midiaForm.url || !midiaForm.titulo || !midiaForm.categoria) {
      alert('Preencha URL, título e categoria!');
      return;
    }

    const newMidia: Foto = {
      id: Date.now(),
      url: midiaForm.url!,
      titulo: midiaForm.titulo!,
      descricao: midiaForm.descricao || '',
      data: midiaForm.data || new Date().toLocaleDateString('pt-BR'),
      categoria: midiaForm.categoria!,
      tipo: midiaForm.tipo || 'foto',
      driveLink: midiaForm.driveLink
    };

    const updatedSessoes = sessoes.map(s =>
      s.id === sessaoSelecionada.id ? { ...s, fotos: [...s.fotos, newMidia] } : s
    );

    setSessoes(updatedSessoes);
    setSessaoSelecionada({ ...sessaoSelecionada, fotos: [...sessaoSelecionada.fotos, newMidia] });
    resetMidiaForm();
    setShowForm(false);
  };

  const handleEditMidia = () => {
    if (!sessaoSelecionada || !editingMidia) return;

    const updatedFotos = sessaoSelecionada.fotos.map(f =>
      f.id === editingMidia.midia.id ? { ...f, ...midiaForm } : f
    );

    const updatedSessoes = sessoes.map(s =>
      s.id === sessaoSelecionada.id ? { ...s, fotos: updatedFotos } : s
    );

    setSessoes(updatedSessoes);
    setSessaoSelecionada({ ...sessaoSelecionada, fotos: updatedFotos });
    resetMidiaForm();
    setShowForm(false);
    setEditingMidia(null);
  };

  const handleDeleteMidia = (sessaoId: number, midiaId: number) => {
    if (confirm('Tem certeza que deseja excluir esta mídia?')) {
      const updatedSessoes = sessoes.map(s =>
        s.id === sessaoId ? { ...s, fotos: s.fotos.filter(f => f.id !== midiaId) } : s
      );

      setSessoes(updatedSessoes);
      if (sessaoSelecionada?.id === sessaoId) {
        setSessaoSelecionada({
          ...sessaoSelecionada,
          fotos: sessaoSelecionada.fotos.filter(f => f.id !== midiaId)
        });
      }
      if (midiaSelecionada?.id === midiaId) setMidiaSelecionada(null);
    }
  };

  const openEditMidia = (sessaoId: number, midia: Foto, e: React.MouseEvent) => {
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
      data: '',
      categoria: '',
      tipo: 'foto',
      driveLink: ''
    });
    setEditingMidia(null);
  };

  /* Filtros da lista de sessões */
  const anosUnicos = ['todos', ...Array.from(
    new Set(sessoes.map(s => s.dataSessao.split('/')[2] ?? ''))
  ).filter(Boolean)];

  const sessoesFiltradas = sessoes.filter(s => {
    const q = busca.toLowerCase();
    const matchBusca = !q ||
      s.titulo.toLowerCase().includes(q) ||
      s.diretor.toLowerCase().includes(q) ||
      s.descricao.toLowerCase().includes(q);
    const matchAno = filtroAno === 'todos' || (s.dataSessao.split('/')[2] ?? '') === filtroAno;
    return matchBusca && matchAno;
  });

  /* Filtros da galeria */
  const categorias = sessaoSelecionada
    ? ['todas', ...Array.from(new Set(sessaoSelecionada.fotos.map(f => f.categoria)))]
    : [];

  const midiasFiltradas = sessaoSelecionada
    ? categoriaAtiva === 'todas'
      ? sessaoSelecionada.fotos
      : sessaoSelecionada.fotos.filter(f => f.categoria === categoriaAtiva)
    : [];

  /* Navegação no visualizador */
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

  return (
    <div className={`${styles.fotosContainer} ${isDarkMode ? styles.darkMode : ''}`}>

      {/* ---- HEADER ---- */}
      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={styles.backLink}>
              ← Voltar para Início
            </Link>
          </div>

          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>
              {sessaoSelecionada ? sessaoSelecionada.titulo : 'Fotos e vídeos das sessões'}
            </h1>
            <p className={styles.heroSubtitle}>
              {sessaoSelecionada
                ? `Galeria da sessão · ${sessaoSelecionada.diretor}`
                : 'Galeria completa dos debates do CineMar'}
            </p>
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
                    type="text"
                    value={sessaoForm.dataSessao}
                    onChange={(e) => setSessaoForm({ ...sessaoForm, dataSessao: e.target.value })}
                    placeholder="DD/MM/AAAA"
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
                    type="text"
                    value={midiaForm.data}
                    onChange={(e) => setMidiaForm({ ...midiaForm, data: e.target.value })}
                    placeholder="DD/MM/AAAA"
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
                  Todas as sessões
                  <span className={styles.eventosCount}>{sessoesFiltradas.length}</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  Selecione uma sessão para ver fotos, vídeos e momentos especiais
                </p>
              </div>

              {sessoesFiltradas.length === 0 ? (
                <div className={styles.noResults}>
                  <div className={styles.noResultsIcon}><FaSearch /></div>
                  <h3>Nenhuma sessão encontrada</h3>
                  <p>Tente alterar os filtros ou o termo de busca</p>
                  <button
                    className={styles.clearFiltersBtn}
                    onClick={() => { setFiltroAno('todos'); setBusca(''); }}
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                <div className={styles.sessoesList}>
                  {sessoesFiltradas.map(sessao => (
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
                <div className={styles.sessaoStats}>
                  <span>{sessaoSelecionada.fotos.filter(f => f.tipo === 'foto').length} fotos</span>
                  <span>{sessaoSelecionada.fotos.filter(f => f.tipo === 'video').length} vídeos</span>
                </div>
              </div>

              <div className={styles.sessaoDetalhes}>
                <div className={styles.sessaoInfoLinha}>
                  <span className={styles.sessaoInfoItem}>
                    <FaFilm />
                    {sessaoSelecionada.diretor} · {sessaoSelecionada.ano}
                  </span>
                  <span className={styles.sessaoInfoItem}>
                    <FaCalendarAlt />
                    {sessaoSelecionada.dataSessao}
                  </span>
                </div>
                <p className={styles.sessaoDescricao}>{sessaoSelecionada.descricao}</p>
              </div>
            </div>

            <nav className={styles.categoriasNavegacao}>
              {categorias.map(cat => (
                <button
                  key={cat}
                  className={`${styles.categoriaButton} ${categoriaAtiva === cat ? styles.ativa : ''}`}
                  onClick={() => setCategoriaAtiva(cat)}
                >
                  {cat === 'todas'
                    ? 'Todos os materiais'
                    : `${cat} (${sessaoSelecionada.fotos.filter(f => f.categoria === cat).length})`}
                </button>
              ))}
            </nav>
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
      {midiaSelecionada && (
        <Visualizador
          midia={midiaSelecionada}
          sessaoTitulo={sessaoSelecionada?.titulo ?? ''}
          dark={isDarkMode}
          onFechar={() => setMidiaSelecionada(null)}
          onNavegar={navegarMidia}
        />
      )}
    </div>
  );
}