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
  FaSun,
  FaMoon,
  FaGoogleDrive,
  FaRegImages,
} from 'react-icons/fa';
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

function usePrefersDark(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function useDarkMode(): [boolean, () => void] {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('modoEscuro');
      return saved !== null ? JSON.parse(saved) : usePrefersDark();
    } catch {
      return false;
    }
  });

  const toggle = useCallback(() => {
    setDark(prev => {
      const next = !prev;
      localStorage.setItem('modoEscuro', JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', dark);
  }, [dark]);

  return [dark, toggle];
}

/* =========================================================
   DADOS
   ======================================================= */
const SESSOES: Sessao[] = [
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
        id: 1,
        url: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80',
        titulo: 'Abertura da sessão',
        descricao: 'Momento inicial do debate sobre Walter Salles',
        data: '05/10/2024',
        categoria: 'Debate',
        tipo: 'foto',
      },
      {
        id: 2,
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
}: {
  sessao: Sessao;
  dark: boolean;
  onClick: () => void;
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
      aria-label={`Ver galeria de ${sessao.titulo}`}
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
        <button className={styles.verFotosButton} tabIndex={-1}>
          Ver galeria completa
        </button>
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
}: {
  midia: Foto;
  dark: boolean;
  onClick: () => void;
}) {
  const isVideo = midia.tipo === 'video';

  return (
    <div
      className={`${styles.midiaCard} ${isVideo ? styles.videoCard : ''} ${dark ? styles.darkCard : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`Abrir ${midia.tipo}: ${midia.titulo}`}
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
    <div
      className={`${styles.visualizadorOverlay} ${dark ? styles.darkVisualizador : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Visualizando: ${midia.titulo}`}
      onClick={e => e.target === e.currentTarget && onFechar()}
    >
      <div className={styles.visualizadorContent}>
        <button
          className={styles.fecharVisualizador}
          onClick={onFechar}
          aria-label="Fechar visualizador"
        >
          <FaTimes />
        </button>

        <div className={styles.visualizadorNavegacao}>
          <button
            className={styles.navegacaoButton}
            onClick={() => onNavegar('anterior')}
            aria-label="Mídia anterior"
          >
            <FaChevronLeft />
          </button>

          <div className={styles.visualizadorPrincipal}>
            {isVideo ? (
              <div className={styles.videoContainer}>
                <VideoComFallback
                  midia={midia}
                  dark={dark}
                  className={styles.visualizadorVideo}
                />
              </div>
            ) : (
              <ImagemComFallback
                midia={midia}
                dark={dark}
                className={styles.visualizadorImagem}
              />
            )}
          </div>

          <button
            className={styles.navegacaoButton}
            onClick={() => onNavegar('proximo')}
            aria-label="Próxima mídia"
          >
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
            <button
              className={styles.visualizadorDriveButton}
              onClick={() => window.open(midia.driveLink, '_blank')}
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
  const [dark, toggleDark] = useDarkMode();
  const [themeChanging, setThemeChanging] = useState(false);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<Sessao | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroAno, setFiltroAno] = useState('todos');
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');
  const [midiaSelecionada, setMidiaSelecionada] = useState<Foto | null>(null);

  /* Lock de scroll quando visualizador está aberto */
  useEffect(() => {
    document.body.style.overflow = midiaSelecionada ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [midiaSelecionada]);

  /* Resetar categoria ao trocar de sessão */
  useEffect(() => {
    setCategoriaAtiva('todas');
  }, [sessaoSelecionada]);

  const handleToggleDark = () => {
    setThemeChanging(true);
    toggleDark();
    setTimeout(() => setThemeChanging(false), 450);
  };

  /* Filtros da lista de sessões */
  const anosUnicos = ['todos', ...Array.from(
    new Set(SESSOES.map(s => s.dataSessao.split('/')[2] ?? ''))
  ).filter(Boolean)];

  const sessoesFiltradas = SESSOES.filter(s => {
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

  /* Rótulo do botão de voltar */
  const labelVoltar = sessaoSelecionada ? 'Voltar para sessões' : 'Voltar para início';

  return (
    <div className={`${styles.fotosContainer} ${dark ? styles.darkMode : ''}`}>

      {/* ---- HEADER ---- */}
      <header className={`${styles.heroHeader} ${dark ? styles.darkHeader : ''}`}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <div className={styles.breadcrumb}>
              <button
                className={styles.voltarInicioButton}
                onClick={() => sessaoSelecionada ? setSessaoSelecionada(null) : window.history.back()}
                aria-label={labelVoltar}
              >
                <FaArrowLeft />
                {labelVoltar}
              </button>
            </div>

            <div className={styles.themeControls}>
              <button
                className={`${styles.themeToggle} ${themeChanging ? styles.themeChanging : ''}`}
                onClick={handleToggleDark}
                aria-label={dark ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
              >
                {dark ? <FaSun /> : <FaMoon />}
                <span className={styles.themeLabel}>
                  {dark ? 'Modo claro' : 'Modo escuro'}
                </span>
              </button>
            </div>
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

      {/* ---- LISTA DE SESSÕES ---- */}
      {!sessaoSelecionada ? (
        <>
          <div className={styles.filtersSection}>
            <div className={styles.filtersContent}>
              <div className={styles.searchContainer}>
                <div className={styles.searchBox}>
                  <FaSearch className={styles.searchIcon} aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Buscar por título, diretor ou descrição…"
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    className={styles.searchInput}
                    aria-label="Buscar sessões"
                  />
                </div>

                <div className={styles.filtersInfo}>
                  <span>Filtrar por ano:</span>
                </div>

                <div className={styles.tipoFilters} role="group" aria-label="Filtros de ano">
                  {anosUnicos.map(ano => (
                    <button
                      key={ano}
                      className={`${styles.tipoFilterBtn} ${filtroAno === ano ? styles.active : ''}`}
                      onClick={() => setFiltroAno(ano)}
                      aria-pressed={filtroAno === ano}
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
                  <FaCalendarAlt className={styles.sectionTitleIcon} aria-hidden="true" />
                  Todas as sessões
                  <span className={styles.eventosCount}>{sessoesFiltradas.length}</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  Selecione uma sessão para ver fotos, vídeos e momentos especiais
                </p>
              </div>

              {sessoesFiltradas.length === 0 ? (
                <div className={styles.noResults} role="status">
                  <div className={styles.noResultsIcon} aria-hidden="true">
                    <FaSearch />
                  </div>
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
                      dark={dark}
                      onClick={() => setSessaoSelecionada(sessao)}
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
          <div className={`${styles.sessaoHeader} ${dark ? styles.darkCard : ''}`}>
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
                    <FaFilm aria-hidden="true" />
                    {sessaoSelecionada.diretor} · {sessaoSelecionada.ano}
                  </span>
                  <span className={styles.sessaoInfoItem}>
                    <FaCalendarAlt aria-hidden="true" />
                    {sessaoSelecionada.dataSessao}
                  </span>
                </div>
                <p className={styles.sessaoDescricao}>{sessaoSelecionada.descricao}</p>
              </div>
            </div>

            <nav className={styles.categoriasNavegacao} aria-label="Categorias de mídia">
              {categorias.map(cat => (
                <button
                  key={cat}
                  className={`${styles.categoriaButton} ${categoriaAtiva === cat ? styles.ativa : ''} ${dark ? styles.darkCategoriaButton : ''}`}
                  onClick={() => setCategoriaAtiva(cat)}
                  aria-pressed={categoriaAtiva === cat}
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
                    dark={dark}
                    onClick={() => setMidiaSelecionada(midia)}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.noResults} role="status">
                <div className={styles.noResultsIcon} aria-hidden="true">
                  <FaSearch />
                </div>
                <h3>Nenhum material encontrado</h3>
                <p>Tente selecionar outra categoria</p>
                <button
                  className={styles.clearFiltersBtn}
                  onClick={() => setCategoriaAtiva('todas')}
                >
                  Mostrar todos
                </button>
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
          dark={dark}
          onFechar={() => setMidiaSelecionada(null)}
          onNavegar={navegarMidia}
        />
      )}
    </div>
  );
}