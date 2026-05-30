// frontend/src/pages/Fotos.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaFilm,
  FaSearch,
  FaChevronLeft,
  FaChevvronRight,
  FaTimes,
  FaVideo,
  FaImage,
  FaGoogleDrive,
  FaRegImages,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaCamera,
  FaTag,
  FaSpinner,
  FaExclamationTriangle,
  FaUsers,
} from 'react-icons/fa';
import { useTheme } from '../components/context/ThemeContext';
import styles from '../styles/Fotos.module.css';
import FilmesService, { type Filme, type FilmeFoto } from '../services/filmes.service';
import { getImageUrl, getPlaceholderImage } from '../utils/imageUtils';
import { useAuth } from '../contexts/AuthContext';

const PLACEHOLDER_IMAGE = getPlaceholderImage();

// Função para construir URL de mídia
function buildMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const API_BASE = import.meta.env.VITE_API_URL ?? 'https://backend-cinemar-6.onrender.com';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

/* =========================================================
   COMPONENTE: IMAGEM COM FALLBACK
   ======================================================= */
function ImagemComFallback({ 
  foto, 
  dark, 
  className 
}: { 
  foto: FilmeFoto; 
  dark: boolean; 
  className: string;
}) {
  const [erro, setErro] = useState(false);
  const imageUrl = buildMediaUrl(foto.path) || PLACEHOLDER_IMAGE;

  if (erro) {
    return (
      <div className={`${styles.fallbackImage} ${dark ? styles.darkFallback : ''}`}>
        <FaRegImages className={styles.fallbackIcon} />
        <p className={styles.fallbackText}>Imagem indisponível</p>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={foto.titulo}
      className={className}
      onError={() => setErro(true)}
      loading="lazy"
      decoding="async"
    />
  );
}

/* =========================================================
   COMPONENTE: CARD DE FOTO
   ======================================================= */
function FotoCard({
  foto,
  dark,
  onClick,
  isAdmin,
  onDelete,
}: {
  foto: FilmeFoto;
  dark: boolean;
  onClick: () => void;
  isAdmin: boolean;
  onDelete: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className={`${styles.midiaCard} ${dark ? styles.darkCard : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className={styles.midiaImagemContainer}>
        <ImagemComFallback foto={foto} dark={dark} className={styles.midiaImagem} />
        <div className={styles.midiaTipoBadge}>
          <FaImage />
        </div>
        {foto.principal && (
          <div className={styles.principalBadge}>
            <FaCamera /> Principal
          </div>
        )}
      </div>

      <div className={styles.midiaInfo}>
        <h4 className={styles.midiaTitulo}>{foto.titulo}</h4>
        <p className={styles.midiaDescricao}>{foto.descricao}</p>
        <div className={styles.midiaMeta}>
          <span className={styles.midiaData}>
            <FaCalendarAlt /> {new Date(foto.createdAt).toLocaleDateString('pt-BR')}
          </span>
          {foto.tipo && (
            <span className={styles.midiaCategoria}>
              <FaTag /> {foto.tipo}
            </span>
          )}
        </div>
        {isAdmin && (
          <div className={styles.midiaAdminActions}>
            <button onClick={onDelete} className={styles.midiaDeleteBtn}>
              <FaTrash />
            </button>
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
  foto,
  filmeTitulo,
  dark,
  onFechar,
  onNavegar,
}: {
  foto: FilmeFoto;
  filmeTitulo: string;
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

  const imageUrl = buildMediaUrl(foto.path) || PLACEHOLDER_IMAGE;

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
            <img
              src={imageUrl}
              alt={foto.titulo}
              className={styles.visualizadorImagem}
            />
          </div>

          <button className={styles.navegacaoButton} onClick={() => onNavegar('proximo')}>
            <FaChevronRight />
          </button>
        </div>

        <div className={styles.visualizadorInfo}>
          <h3 className={styles.visualizadorTitulo}>
            {foto.titulo}
            <span className={styles.midiaTipoBadgeVisualizador}>
              Foto
            </span>
          </h3>
          <p className={styles.visualizadorDescricao}>{foto.descricao}</p>
          <div className={styles.visualizadorMeta}>
            <span><FaCalendarAlt /> {new Date(foto.createdAt).toLocaleDateString('pt-BR')}</span>
            {foto.tipo && <span><FaTag /> {foto.tipo}</span>}
            <span><FaFilm /> Filme: {filmeTitulo}</span>
          </div>
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
  const { user, isAdmin } = useAuth();
  const isDarkMode = theme === 'dark';
  const [searchParams] = useSearchParams();

  const filmeId = searchParams.get('filmeId');
  const filmeTitulo = searchParams.get('titulo');
  const tipo = searchParams.get('tipo');
  const fotoId = searchParams.get('fotoId');

  const [filme, setFilme] = useState<Filme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fotoSelecionada, setFotoSelecionada] = useState<FilmeFoto | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Carregar filme e suas fotos
  useEffect(() => {
    const loadFilme = async () => {
      if (!filmeId || tipo !== 'filme') {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const filmeData = await FilmesService.findById(filmeId);
        setFilme(filmeData);
      } catch (err: any) {
        console.error('Erro ao carregar filme:', err);
        setError('Não foi possível carregar as fotos do filme.');
      } finally {
        setIsLoading(false);
      }
    };

    loadFilme();
  }, [filmeId, tipo]);

  // Se tem fotoId, abrir o visualizador
  useEffect(() => {
    if (fotoId && filme?.filmesFotos) {
      const foto = filme.filmesFotos.find(f => f.id === fotoId);
      if (foto) {
        setFotoSelecionada(foto);
      }
    }
  }, [fotoId, filme]);

  const fotos = filme?.filmesFotos || [];

  // Navegação no visualizador
  const navegarFoto = useCallback(
    (dir: 'anterior' | 'proximo') => {
      if (!fotoSelecionada || fotos.length === 0) return;
      const idx = fotos.findIndex(f => f.id === fotoSelecionada.id);
      const next = dir === 'anterior'
        ? fotos[idx > 0 ? idx - 1 : fotos.length - 1]
        : fotos[idx < fotos.length - 1 ? idx + 1 : 0];
      if (next) setFotoSelecionada(next);
    },
    [fotoSelecionada, fotos]
  );

  const handleDeleteFoto = async (fotoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!filmeId) return;
    
    if (confirm('Tem certeza que deseja excluir esta foto?')) {
      setDeleting(true);
      try {
        await FilmesService.deleteFoto(filmeId, fotoId);
        // Recarregar o filme
        const filmeAtualizado = await FilmesService.findById(filmeId);
        setFilme(filmeAtualizado);
        if (fotoSelecionada?.id === fotoId) {
          setFotoSelecionada(null);
        }
      } catch (err) {
        console.error('Erro ao deletar foto:', err);
        alert('Erro ao deletar foto.');
      } finally {
        setDeleting(false);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`${styles.fotosContainer} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.loadingSpinner} />
          <p>Carregando fotos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`${styles.fotosContainer} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={styles.errorContainer}>
          <FaExclamationTriangle />
          <h3>Erro ao carregar fotos</h3>
          <p>{error}</p>
          <Link to="/filmes" className={styles.backButton}>
            Voltar para filmes
          </Link>
        </div>
      </div>
    );
  }

  // Sem filme selecionado
  if (!filmeId || tipo !== 'filme') {
    return (
      <div className={`${styles.fotosContainer} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={styles.errorContainer}>
          <FaExclamationTriangle />
          <h3>Nenhum filme selecionado</h3>
          <p>Selecione um filme para ver suas fotos.</p>
          <Link to="/filmes" className={styles.backButton}>
            Voltar para filmes
          </Link>
        </div>
      </div>
    );
  }

  // Sem fotos
  if (fotos.length === 0) {
    return (
      <div className={`${styles.fotosContainer} ${isDarkMode ? styles.darkMode : ''}`}>
        <header className={styles.heroHeader}>
          <div className={styles.heroHeaderContent}>
            <div className={styles.heroHeaderTop}>
              <Link to="/filmes" className={styles.backLink}>
                <FaArrowLeft /> Voltar para filmes
              </Link>
            </div>
            <div className={styles.heroMain}>
              <h1 className={styles.heroTitle}>{filmeTitulo || filme?.title}</h1>
              <p className={styles.heroSubtitle}>Galeria de fotos</p>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>
              <FaImage />
            </div>
            <h3>Nenhuma foto encontrada</h3>
            <p>Este filme ainda não possui fotos na galeria.</p>
            <Link to="/filmes" className={styles.clearFiltersBtn}>
              Voltar para filmes
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`${styles.fotosContainer} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* HEADER */}
      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/filmes" className={styles.backLink}>
              <FaArrowLeft /> Voltar para filmes
            </Link>
          </div>

          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>
              {filme?.title || filmeTitulo}
            </h1>
            <p className={styles.heroSubtitle}>
              Galeria de fotos - {fotos.length} {fotos.length === 1 ? 'foto' : 'fotos'}
            </p>
            {filme?.director && (
              <div className={styles.heroStats}>
                <span>Diretor: {filme.director}</span>
                <span>•</span>
                <span>Ano: {filme.year}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* GALERIA */}
      <main className={styles.mainContent}>
        <div className={styles.galeriaContainer}>
          <div className={styles.galeriaGrid}>
            {fotos.map(foto => (
              <FotoCard
                key={foto.id}
                foto={foto}
                dark={isDarkMode}
                onClick={() => setFotoSelecionada(foto)}
                isAdmin={isAdmin}
                onDelete={(e) => handleDeleteFoto(foto.id, e)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* VISUALIZADOR */}
      {fotoSelecionada && filme && (
        <Visualizador
          foto={fotoSelecionada}
          filmeTitulo={filme.title}
          dark={isDarkMode}
          onFechar={() => setFotoSelecionada(null)}
          onNavegar={navegarFoto}
        />
      )}
    </div>
  );
}