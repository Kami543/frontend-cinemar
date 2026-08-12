// frontend/src/pages/Fotos.tsx
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaFilm,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaVideo,
  FaImage,
  FaRegImages,
  FaBook,
  FaNewspaper,
  FaFileAlt,
  FaExternalLinkAlt,
  FaTag,
  FaSpinner,
  FaExclamationTriangle,
  FaUsers,
  FaTrash,
  FaPlus,
  FaUpload,
  FaEdit,
  FaDrive,
} from 'react-icons/fa';
import { useTheme } from '../components/context/ThemeContext';
import styles from '../styles/Fotos.module.css';
import SessoesService, { type Sessao, type Foto, type TipoMidia, type UploadMidiaPayload } from '../services/sessoes.service';
import { getPlaceholderImage } from '../utils/imageUtils';
import { useAuth } from '../contexts/AuthContext';

const PLACEHOLDER_IMAGE = getPlaceholderImage();

function buildMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const API_BASE = import.meta.env.VITE_API_URL ?? 'https://backend-cinemar-6.onrender.com';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

const TIPOS: { value: TipoMidia | 'todos'; label: string; icon: typeof FaImage }[] = [
  { value: 'todos', label: 'Todos', icon: FaRegImages },
  { value: 'foto', label: 'Fotos', icon: FaImage },
  { value: 'video', label: 'Vídeos', icon: FaVideo },
  { value: 'livro', label: 'Livros', icon: FaBook },
  { value: 'artigo', label: 'Artigos', icon: FaNewspaper },
  { value: 'reportagem', label: 'Reportagens', icon: FaFileAlt },
];

const ICON_POR_TIPO: Record<TipoMidia, typeof FaImage> = {
  foto: FaImage,
  video: FaVideo,
  livro: FaBook,
  artigo: FaNewspaper,
  reportagem: FaFileAlt,
};

const ACCEPT_POR_TIPO: Record<TipoMidia, string> = {
  foto: 'image/jpeg,image/png,image/webp,image/gif',
  video: 'video/mp4,video/webm,video/quicktime',
  livro: 'application/pdf,application/epub+zip',
  artigo: 'application/pdf',
  reportagem: 'application/pdf',
};

const TEM_THUMB = (tipo: TipoMidia) => tipo === 'foto' || tipo === 'video';

// ============================================================
// TOAST SYSTEM
// ============================================================
type ToastType = 'success' | 'error' | 'warn';

function Toast({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.toast} ${styles[`toast_${type}`]}`}>
      {type === 'success' && '✅'}
      {type === 'error' && '❌'}
      {type === 'warn' && '⚠️'}
      {message}
    </div>
  );
}

// ============================================================
// CARD DE MÍDIA
// ============================================================
function MidiaCard({
  midia,
  dark,
  onClick,
  isAdmin,
  onDelete,
  onEdit,
}: {
  midia: Foto;
  dark: boolean;
  onClick: () => void;
  isAdmin: boolean;
  onDelete: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
}) {
  const [erro, setErro] = useState(false);
  const Icon = ICON_POR_TIPO[midia.tipo];
  const url = buildMediaUrl(midia.url) || PLACEHOLDER_IMAGE;
  const mostraThumb = TEM_THUMB(midia.tipo) && !erro;

  return (
    <div
      className={`${styles.midiaCard} ${midia.tipo === 'video' ? styles.videoCard : ''} ${dark ? styles.darkCard : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className={styles.midiaImagemContainer}>
        {mostraThumb ? (
          <img
            src={url}
            alt={midia.titulo}
            className={styles.midiaImagem}
            onError={() => setErro(true)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={`${styles.fallbackImage} ${dark ? styles.darkFallback : ''}`}>
            <Icon className={styles.fallbackIcon} />
            <p className={styles.fallbackText}>{midia.tipo}</p>
          </div>
        )}
        <div className={styles.midiaTipoBadge}>
          <Icon />
          <span>{midia.tipo}</span>
        </div>
      </div>

      <div className={styles.midiaInfo}>
        <h4 className={styles.midiaTitulo}>{midia.titulo}</h4>
        <p className={styles.midiaDescricao}>{midia.descricao}</p>
        <div className={styles.midiaMeta}>
          <span className={styles.midiaData}>
            <FaCalendarAlt /> {midia.data}
          </span>
          {midia.categoria && (
            <span className={styles.midiaCategoria}>
              <FaTag /> {midia.categoria}
            </span>
          )}
        </div>
        {isAdmin && (
          <div className={styles.midiaAdminActions}>
            <button onClick={onEdit} className={styles.midiaEditBtn} title="Editar">
              <FaEdit />
            </button>
            <button onClick={onDelete} className={styles.midiaDeleteBtn} title="Excluir">
              <FaTrash />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// VISUALIZADOR
// ============================================================
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
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar();
      if (e.key === 'ArrowLeft') onNavegar('anterior');
      if (e.key === 'ArrowRight') onNavegar('proximo');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onFechar, onNavegar]);

  const Icon = ICON_POR_TIPO[midia.tipo];
  const url = buildMediaUrl(midia.url) || PLACEHOLDER_IMAGE;
  const linkExterno = midia.driveLink || midia.url;

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
            {midia.tipo === 'foto' && (
              <img src={url} alt={midia.titulo} className={styles.visualizadorImagem} />
            )}

            {midia.tipo === 'video' && (
              <video src={url} controls className={styles.visualizadorVideo} />
            )}

            {(midia.tipo === 'livro' || midia.tipo === 'artigo' || midia.tipo === 'reportagem') && (
              <div className={`${styles.fallbackImage} ${dark ? styles.darkFallback : ''}`}>
                <Icon className={styles.fallbackIcon} />
                <p className={styles.fallbackText}>{midia.tipo}</p>
                {linkExterno && (
                  <a
                    href={buildMediaUrl(linkExterno) || linkExterno}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.visualizadorDriveButton}
                  >
                    <FaExternalLinkAlt /> Abrir {midia.tipo}
                  </a>
                )}
              </div>
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
              {TIPOS.find(t => t.value === midia.tipo)?.label.replace(/s$/, '')}
            </span>
          </h3>
          <p className={styles.visualizadorDescricao}>{midia.descricao}</p>
          <div className={styles.visualizadorMeta}>
            <span><FaCalendarAlt /> {midia.data}</span>
            {midia.categoria && <span><FaTag /> {midia.categoria}</span>}
            <span><FaFilm /> Sessão: {sessaoTitulo}</span>
            {midia.driveLink && (
              <span>
                <FaDrive /> Drive
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FORM DE UPLOAD (usando classes do CSS)
// ============================================================
function UploadMidiaForm({
  onSubmit,
  onCancel,
  submitting,
  editingMidia,
}: {
  onSubmit: (payload: UploadMidiaPayload) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
  editingMidia?: Foto | null;
}) {
  const [tipo, setTipo] = useState<TipoMidia>(editingMidia?.tipo || 'foto');
  const [titulo, setTitulo] = useState(editingMidia?.titulo || '');
  const [descricao, setDescricao] = useState(editingMidia?.descricao || '');
  const [data, setData] = useState(editingMidia?.data || new Date().toISOString().split('T')[0]);
  const [categoria, setCategoria] = useState(editingMidia?.categoria || 'geral');
  const [driveLink, setDriveLink] = useState(editingMidia?.driveLink || '');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !data || !categoria) return;
    if (!file && !driveLink) {
      alert('Envie um arquivo ou informe um link.');
      return;
    }
    await onSubmit({
      titulo,
      descricao,
      data,
      categoria,
      tipo,
      driveLink: driveLink || undefined,
      file: file || undefined,
      url: !file && driveLink ? driveLink : undefined,
    });
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h3>{editingMidia ? 'Editar Mídia' : 'Adicionar Nova Mídia'}</h3>
          <button className={styles.formClose} onClick={onCancel}>
            <FaTimes />
          </button>
        </div>

        <form className={styles.formBody} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Tipo de Mídia</div>
            <div className={styles.uploadFormRow}>
              {TIPOS.filter(t => t.value !== 'todos').map(t => {
                const Icon = t.icon;
                return (
                  <button
                    type="button"
                    key={t.value}
                    className={`${styles.filterTab} ${tipo === t.value ? styles.filterTabActive : ''}`}
                    onClick={() => { setTipo(t.value as TipoMidia); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  >
                    <Icon /> {t.label.replace(/s$/, '')}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Informações</div>
            <div className={styles.formGroup}>
              <label>Título *</label>
              <input
                placeholder="Título da mídia"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Descrição</label>
              <textarea
                placeholder="Descrição detalhada"
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                rows={3}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Data *</label>
                <input
                  type="date"
                  value={data}
                  onChange={e => setData(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Categoria *</label>
                <input
                  placeholder="Ex: Pôster, Making of"
                  value={categoria}
                  onChange={e => setCategoria(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Arquivo ou Link</div>
            
            <div className={styles.formGroup}>
              <label>Arquivo</label>
              <label className={styles.uploadFormFileLabel}>
                <FaUpload /> {file ? file.name : 'Selecionar arquivo'}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPT_POR_TIPO[tipo]}
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  hidden
                />
              </label>
              <small>Formatos aceitos: {ACCEPT_POR_TIPO[tipo].split(',').join(', ')}</small>
            </div>

            <div className={styles.formGroup}>
              <label>Ou Link Externo</label>
              <input
                placeholder="URL do Drive, YouTube, artigo..."
                value={driveLink}
                onChange={e => setDriveLink(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? <FaSpinner className={styles.loadingSpinner} /> : <FaPlus />}
              {submitting ? 'Enviando...' : editingMidia ? 'Salvar alterações' : 'Adicionar mídia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function Fotos() {
  const { theme } = useTheme();
  const { isAdmin } = useAuth();
  const isDarkMode = theme === 'dark';
  const [searchParams] = useSearchParams();

  const sessaoId = searchParams.get('sessaoId');
  const midiaIdParam = searchParams.get('midiaId');

  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [midiaSelecionada, setMidiaSelecionada] = useState<Foto | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<TipoMidia | 'todos'>('todos');
  const [deleting, setDeleting] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingMidia, setEditingMidia] = useState<Foto | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  }, []);

  const loadSessoes = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await SessoesService.findAll();
      setSessoes(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error('Erro ao carregar sessões:', err);
      setSessoes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reloadSessao = useCallback(async () => {
    if (!sessaoId) return;
    try {
      const data = await SessoesService.findById(sessaoId);
      setSessao(data);
      return data;
    } catch (err) {
      console.error('Erro ao recarregar sessão:', err);
      throw err;
    }
  }, [sessaoId]);

  useEffect(() => {
    if (sessaoId) {
      const loadSessao = async () => {
        setIsLoading(true);
        setError(null);
        try {
          await reloadSessao();
        } catch (err) {
          console.error('Erro ao carregar sessão:', err);
          setError('Não foi possível carregar a biblioteca de mídias desta sessão.');
        } finally {
          setIsLoading(false);
        }
      };
      loadSessao();
    } else {
      loadSessoes();
    }
  }, [sessaoId, reloadSessao, loadSessoes]);

  useEffect(() => {
    if (midiaIdParam && sessao?.fotos) {
      const midia = sessao.fotos.find(m => m.id === midiaIdParam);
      if (midia) setMidiaSelecionada(midia);
    }
  }, [midiaIdParam, sessao]);

  const todasMidias = sessao?.fotos || [];
  const midiasFiltradas = useMemo(
    () => (filtroTipo === 'todos' ? todasMidias : todasMidias.filter(m => m.tipo === filtroTipo)),
    [todasMidias, filtroTipo],
  );

  const navegarMidia = useCallback(
    (dir: 'anterior' | 'proximo') => {
      if (!midiaSelecionada || midiasFiltradas.length === 0) return;
      const idx = midiasFiltradas.findIndex(m => m.id === midiaSelecionada.id);
      const next = dir === 'anterior'
        ? midiasFiltradas[idx > 0 ? idx - 1 : midiasFiltradas.length - 1]
        : midiasFiltradas[idx < midiasFiltradas.length - 1 ? idx + 1 : 0];
      if (next) setMidiaSelecionada(next);
    },
    [midiaSelecionada, midiasFiltradas],
  );

  const handleDeleteMidia = async (fotoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!sessaoId) return;

    if (confirm('Tem certeza que deseja excluir esta mídia?')) {
      setDeleting(true);
      try {
        await SessoesService.removeMidia(sessaoId, fotoId);
        await reloadSessao();
        if (midiaSelecionada?.id === fotoId) setMidiaSelecionada(null);
        showToast('Mídia excluída com sucesso!', 'success');
      } catch (err) {
        console.error('Erro ao deletar mídia:', err);
        showToast('Erro ao deletar mídia.', 'error');
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleUpload = async (payload: UploadMidiaPayload) => {
    if (!sessaoId) return;
    setUploading(true);
    try {
      await SessoesService.addMidia(sessaoId, payload);
      await reloadSessao();
      setShowUploadForm(false);
      setEditingMidia(null);
      showToast('Mídia adicionada com sucesso!', 'success');
    } catch (err: any) {
      console.error('Erro ao enviar mídia:', err);
      const message = err.response?.data?.message || 'Erro ao enviar mídia. Verifique o tipo do arquivo.';
      showToast(message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleEditMidia = (midia: Foto, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMidia(midia);
    setShowUploadForm(true);
  };

  const handleUpdateMidia = async (payload: UploadMidiaPayload) => {
    if (!editingMidia) return;
    setUploading(true);
    try {
      await SessoesService.updateMidia(editingMidia.id, payload);
      await reloadSessao();
      setShowUploadForm(false);
      setEditingMidia(null);
      showToast('Mídia atualizada com sucesso!', 'success');
    } catch (err: any) {
      console.error('Erro ao atualizar mídia:', err);
      const message = err.response?.data?.message || 'Erro ao atualizar mídia.';
      showToast(message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const contarPorTipo = (s: Sessao, tipo: TipoMidia) => s.fotos.filter(m => m.tipo === tipo).length;

  // ============================================================
  // LISTA DE SESSÕES
  // ============================================================
  if (!sessaoId) {
    return (
      <div className={`${styles.fotosContainer} ${isDarkMode ? styles.darkMode : ''}`}>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        
        <header className={styles.heroHeader}>
          <div className={styles.heroHeaderContent}>
            <div className={styles.heroMain}>
              <h1 className={styles.heroTitle}>Biblioteca de Mídias</h1>
              <p className={styles.heroSubtitle}>Fotos, vídeos, livros, artigos e reportagens por sessão</p>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <FaSpinner className={styles.loadingSpinner} />
              <p>Carregando sessões...</p>
            </div>
          ) : sessoes.length === 0 ? (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>
                <FaRegImages />
              </div>
              <h3>Nenhuma sessão encontrada</h3>
              <p>Tente novamente mais tarde.</p>
            </div>
          ) : (
            <div className={styles.sessoesList}>
              {sessoes.map(s => (
                <Link
                  key={s.id}
                  to={`/fotos?sessaoId=${s.id}`}
                  className={`${styles.sessaoCard} ${isDarkMode ? styles.darkCard : ''}`}
                >
                  <div className={styles.sessaoCardHeader}>
                    <h3 className={styles.sessaoCardTitulo}>{s.titulo}</h3>
                    <span className={styles.sessaoCardStatus}>
                      {s._count?.fotos ?? s.fotos.length} mídias
                    </span>
                  </div>
                  <div className={styles.sessaoCardContent}>
                    <div className={styles.eventoCardMeta}>
                      <span className={styles.metaItem}>
                        <FaCalendarAlt className={styles.metaItemIcon} />
                        {s.ano}
                      </span>
                      <span className={styles.metaItem}>
                        <FaUsers className={styles.metaItemIcon} />
                        {s.participantes} participantes
                      </span>
                    </div>
                    {s.descricao && (
                      <p className={styles.eventoCardDescricao}>{s.descricao}</p>
                    )}
                    <div className={styles.sessaoCardStats}>
                      {TIPOS.filter(t => t.value !== 'todos').map(t => {
                        const count = contarPorTipo(s, t.value);
                        return count > 0 ? (
                          <span key={t.value} className={styles.statItem}>
                            <t.icon /> {count}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div className={styles.sessaoCardFooter}>
                    <button className={styles.verFotosButton}>
                      Ver mídias
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // ============================================================
  // LOADING / ERROR DA SESSÃO
  // ============================================================
  if (isLoading) {
    return (
      <div className={`${styles.fotosContainer} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.loadingSpinner} />
          <p>Carregando mídias...</p>
        </div>
      </div>
    );
  }

  if (error || !sessao) {
    return (
      <div className={`${styles.fotosContainer} ${isDarkMode ? styles.darkMode : ''}`}>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className={styles.errorContainer}>
          <FaExclamationTriangle />
          <h3>Erro ao carregar mídias</h3>
          <p>{error || 'Sessão não encontrada'}</p>
          <Link to="/fotos" className={styles.backButton}>
            Voltar para sessões
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================
  // SESSÃO COM MÍDIAS
  // ============================================================
  return (
    <div className={`${styles.fotosContainer} ${isDarkMode ? styles.darkMode : ''}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* HEADER */}
      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/fotos" className={styles.backLink}>
              <FaArrowLeft /> Voltar para sessões
            </Link>
          </div>
          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>{sessao.titulo}</h1>
            <p className={styles.heroSubtitle}>
              Biblioteca de mídias - {todasMidias.length} {todasMidias.length === 1 ? 'item' : 'itens'}
            </p>
            {sessao.diretor && (
              <div className={styles.heroStats}>
                <span>Diretor: {sessao.diretor}</span>
                <span>•</span>
                <span>Ano: {sessao.ano}</span>
                <span>•</span>
                <span>{sessao.participantes} participantes</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        {/* FILTROS */}
        <div className={styles.filtersSection}>
          <div className={styles.filtersContent}>
            <div className={styles.tipoFilters}>
              {TIPOS.map(t => {
                const Icon = t.icon;
                const count = t.value === 'todos' ? todasMidias.length : contarPorTipo(sessao, t.value);
                return (
                  <button
                    key={t.value}
                    className={`${styles.tipoFilterBtn} ${filtroTipo === t.value ? styles.active : ''}`}
                    onClick={() => setFiltroTipo(t.value)}
                  >
                    <Icon /> {t.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* GALERIA */}
        {midiasFiltradas.length === 0 ? (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>
              <FaRegImages />
            </div>
            <h3>Nenhuma mídia encontrada</h3>
            <p>Não há itens deste tipo nesta sessão.</p>
          </div>
        ) : (
          <div className={styles.galeriaContainer}>
            <div className={styles.galeriaGrid}>
              {midiasFiltradas.map(midia => (
                <MidiaCard
                  key={midia.id}
                  midia={midia}
                  dark={isDarkMode}
                  onClick={() => setMidiaSelecionada(midia)}
                  isAdmin={isAdmin}
                  onDelete={(e) => handleDeleteMidia(midia.id, e)}
                  onEdit={(e) => handleEditMidia(midia, e)}
                />
              ))}
            </div>
          </div>
        )}

        {/* BOTÃO FLUTUANTE */}
        {isAdmin && (
          <button
            className={styles.floatingAddBtn}
            onClick={() => {
              setEditingMidia(null);
              setShowUploadForm(true);
            }}
            title="Adicionar mídia"
          >
            <FaPlus />
          </button>
        )}
      </main>

      {/* MODAL DE UPLOAD/EDIÇÃO */}
      {showUploadForm && (
        <UploadMidiaForm
          onSubmit={editingMidia ? handleUpdateMidia : handleUpload}
          onCancel={() => {
            setShowUploadForm(false);
            setEditingMidia(null);
          }}
          submitting={uploading}
          editingMidia={editingMidia}
        />
      )}

      {/* VISUALIZADOR */}
      {midiaSelecionada && (
        <Visualizador
          midia={midiaSelecionada}
          sessaoTitulo={sessao.titulo}
          dark={isDarkMode}
          onFechar={() => setMidiaSelecionada(null)}
          onNavegar={navegarMidia}
        />
      )}
    </div>
  );
}