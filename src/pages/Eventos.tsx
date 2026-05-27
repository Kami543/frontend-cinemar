// pages/Eventos.tsx
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaLeaf, FaBook,
  FaHandsHelping, FaVoteYea, FaArrowRight, FaEye,
  FaSearch, FaStar, FaClock, FaCalendarPlus, FaCheckCircle,
  FaPlus, FaTimes, FaTrash, FaEdit, FaSave,
  FaWhatsapp, FaEnvelope, FaSpinner, FaExclamationTriangle,
  FaFilter, FaUserPlus, FaUserCheck, FaHeart, FaRegHeart,
  FaShareAlt, FaCopy, FaTwitter, FaRegBookmark, FaBookmark
} from 'react-icons/fa';
import styles from '../styles/Eventos.module.css';
import { useEventos } from '../hooks/useEventos';
import type { CreateEventoPayload, Evento } from '../services/eventos.service';
import { useTheme } from '../components/context/ThemeContext';
import PlaceholderImage from '../images/Fallback.png';

// Mapeamento de tipo para ícone e cor
const TIPOS_CONFIG = [
  { id: 'todos', label: 'Todos', icone: FaCalendarAlt, cor: '#dc2626' },
  { id: 'movimento-social', label: 'Movimentos Sociais', icone: FaUsers, cor: '#3b82f6' },
  { id: 'plebiscito', label: 'Plebiscitos', icone: FaVoteYea, cor: '#8b5cf6' },
  { id: 'sustentabilidade', label: 'Sustentabilidade', icone: FaLeaf, cor: '#10b981' },
  { id: 'evento-local', label: 'Eventos Locais', icone: FaMapMarkerAlt, cor: '#f59e0b' },
  { id: 'cultural', label: 'Culturais', icone: FaBook, cor: '#ec4899' },
];

// Mapeamento de status
const STATUS_CONFIG = {
  ativo: { label: 'Em Andamento', icon: FaClock, color: '#10b981' },
  futuro: { label: 'Em Breve', icon: FaCalendarPlus, color: '#3b82f6' },
  realizado: { label: 'Realizado', icon: FaCheckCircle, color: '#6b7280' },
};

// Mapeamento de importância
const IMPORTANCIA_CONFIG = {
  alta: { label: 'Alta', color: '#ef4444' },
  media: { label: 'Média', color: '#f59e0b' },
  baixa: { label: 'Baixa', color: '#10b981' },
};

function Eventos() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Estados locais
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState<string>('todos');
  const [busca, setBusca] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [subscribingId, setSubscribingId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Hook de eventos
  const {
    eventos,
    isLoading,
    error,
    toast,
    createEvento,
    updateEvento,
    removeEvento,
    subscribeEvento,
    refetch,
    setQuery,
    stats
  } = useEventos({ limit: 100 });

  // Verificar usuário logado
  useEffect(() => {
    const storedUser = localStorage.getItem('cinemar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Carregar favoritos
  useEffect(() => {
    const storedFavorites = localStorage.getItem('cinemar_event_favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cinemar_event_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Fechar menu de compartilhamento ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = user?.role === 'admin';

  // Estado do formulário
  const [formData, setFormData] = useState<Partial<CreateEventoPayload>>({
    titulo: '',
    data: '',
    dataCompleta: '',
    local: '',
    descricao: '',
    tipo: 'evento-local',
    status: 'futuro',
    importancia: 'media',
    parceirosNomes: [],
    link: '',
    imagem: '',
    contato: '',
    horario: ''
  });

  // Filtrar eventos localmente
  const eventosFiltrados = useMemo(() => {
    let filtered = eventos;
    
    if (filtroAtivo !== 'todos') {
      filtered = filtered.filter(ev => ev.tipo === filtroAtivo);
    }
    
    if (busca) {
      const searchLower = busca.toLowerCase();
      filtered = filtered.filter(ev =>
        ev.titulo.toLowerCase().includes(searchLower) ||
        ev.descricao.toLowerCase().includes(searchLower) ||
        ev.local.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [eventos, filtroAtivo, busca]);

  // Atualizar busca no backend (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (busca) {
        setQuery(prev => ({ ...prev, search: busca, page: 1 }));
      } else {
        setQuery(prev => {
          const { search, ...rest } = prev;
          return { ...rest, page: 1 };
        });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [busca, setQuery]);

  const getIconeTipo = useCallback((tipo: string) => {
    const config = TIPOS_CONFIG.find(t => t.id === tipo);
    return config?.icone ? <config.icone aria-hidden="true" /> : <FaCalendarAlt aria-hidden="true" />;
  }, []);

  const getTipoLabel = useCallback((tipo: string) => {
    return TIPOS_CONFIG.find(t => t.id === tipo)?.label || tipo;
  }, []);

  const getTipoCor = useCallback((tipo: string) => {
    return TIPOS_CONFIG.find(t => t.id === tipo)?.cor || '#6b7280';
  }, []);

  const getStatusConfig = useCallback((status: string) => {
    return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.futuro;
  }, []);

  const getImportanciaConfig = useCallback((importancia: string) => {
    return IMPORTANCIA_CONFIG[importancia as keyof typeof IMPORTANCIA_CONFIG] || IMPORTANCIA_CONFIG.media;
  }, []);

  const toggleFavorite = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  }, []);

  const handleImageError = useCallback((id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  }, []);

  const shareEvento = () => {
    if (selectedEvento && navigator.share) {
      navigator.share({
        title: `CineMar: ${selectedEvento.titulo}`,
        text: `Confira o evento "${selectedEvento.titulo}" no CineMar!`,
        url: window.location.href,
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareMenu(false);
  };

  // CRUD Handlers
  const handleAddEvento = async () => {
    if (!formData.titulo || !formData.data || !formData.local || !formData.descricao) {
      return;
    }

    const payload: CreateEventoPayload = {
      titulo: formData.titulo,
      data: formData.data,
      dataCompleta: formData.dataCompleta || formData.data,
      local: formData.local,
      descricao: formData.descricao,
      tipo: formData.tipo as string,
      status: formData.status as string,
      importancia: formData.importancia as string,
      parceirosNomes: formData.parceirosNomes,
      link: formData.link,
      imagem: formData.imagem,
      contato: formData.contato,
      horario: formData.horario
    };

    await createEvento(payload);
    resetForm();
    setShowForm(false);
  };

  const handleEditEvento = async () => {
    if (!selectedEvento) return;
    
    const payload: Partial<CreateEventoPayload> = {
      titulo: formData.titulo,
      data: formData.data,
      dataCompleta: formData.dataCompleta,
      local: formData.local,
      descricao: formData.descricao,
      tipo: formData.tipo,
      status: formData.status,
      importancia: formData.importancia,
      parceirosNomes: formData.parceirosNomes,
      link: formData.link,
      imagem: formData.imagem,
      contato: formData.contato,
      horario: formData.horario
    };

    await updateEvento(selectedEvento.id, payload);
    resetForm();
    setShowForm(false);
    setIsEditing(false);
    setSelectedEvento(null);
  };

  const handleDeleteEvento = async (id: string) => {
    if (confirmDelete === id) {
      await removeEvento(id);
      setConfirmDelete(null);
      if (selectedEvento?.id === id) setSelectedEvento(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const handleSubscribe = async (id: string) => {
    setSubscribingId(id);
    try {
      await subscribeEvento(id);
    } finally {
      setSubscribingId(null);
    }
  };

  const openEditForm = (evento: Evento) => {
    setFormData({
      titulo: evento.titulo,
      data: evento.data,
      dataCompleta: evento.dataCompleta,
      local: evento.local,
      descricao: evento.descricao,
      tipo: evento.tipo,
      status: evento.status,
      importancia: evento.importancia,
      parceirosNomes: evento.parceiros?.map(p => p.nome) || [],
      link: evento.link,
      imagem: evento.imagem,
      contato: evento.contato,
      horario: evento.horario
    });
    setSelectedEvento(evento);
    setIsEditing(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      data: '',
      dataCompleta: '',
      local: '',
      descricao: '',
      tipo: 'evento-local',
      status: 'futuro',
      importancia: 'media',
      parceirosNomes: [],
      link: '',
      imagem: '',
      contato: '',
      horario: ''
    });
    setIsEditing(false);
    setSelectedEvento(null);
  };

  const clearAllFilters = () => {
    setBusca('');
    setFiltroAtivo('todos');
    setQuery(prev => {
      const { search, ...rest } = prev;
      return { ...rest, page: 1 };
    });
  };

  // Loading state
  if (isLoading && eventos.length === 0) {
    return (
      <div className={`${styles.eventosPage} ${isDarkMode ? styles.dark : ''}`}>
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.loadingSpinner} />
          <p>Carregando eventos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && eventos.length === 0) {
    return (
      <div className={`${styles.eventosPage} ${isDarkMode ? styles.dark : ''}`}>
        <div className={styles.errorContainer}>
          <FaExclamationTriangle />
          <h3>Erro ao carregar eventos</h3>
          <p>{error}</p>
          <button onClick={() => refetch()}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  // Modal de detalhes
  const ModalDetalhes = ({ evento, onClose }: { evento: Evento; onClose: () => void }) => {
    const statusConfig = getStatusConfig(evento.status);
    const importanciaConfig = getImportanciaConfig(evento.importancia);
    const isSubscribed = false;
    const isFavorited = favorites.includes(evento.id);

    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.modalClose} onClick={onClose}>
            <FaTimes />
          </button>

          <div className={styles.modalHeader}>
            <h2>{evento.titulo}</h2>
            <div className={styles.modalBadges}>
              <span className={styles.modalTipo} style={{ background: getTipoCor(evento.tipo) }}>
                {getIconeTipo(evento.tipo)} {getTipoLabel(evento.tipo)}
              </span>
              <span className={styles.modalStatus} style={{ color: statusConfig.color }}>
                <statusConfig.icon /> {statusConfig.label}
              </span>
            </div>
          </div>

          <div className={styles.modalBody}>
            {evento.imagem && (
              <div className={styles.modalImage}>
                <img 
                  src={imageErrors[evento.id] ? PlaceholderImage : evento.imagem} 
                  alt={evento.titulo}
                  onError={() => handleImageError(evento.id)}
                />
              </div>
            )}

            <div className={styles.modalInfo}>
              <div className={styles.modalInfoItem}>
                <FaCalendarAlt /> <strong>Data:</strong> {evento.dataCompleta}
                {evento.horario && <span className={styles.modalHorario}> • {evento.horario}</span>}
              </div>
              <div className={styles.modalInfoItem}>
                <FaMapMarkerAlt /> <strong>Local:</strong> {evento.local}
              </div>
              <div className={styles.modalInfoItem}>
                <FaStar /> <strong>Importância:</strong>{' '}
                <span style={{ color: importanciaConfig.color }}>{importanciaConfig.label}</span>
              </div>
              {evento._count && (
                <div className={styles.modalInfoItem}>
                  <FaUsers /> <strong>Participantes:</strong> {evento._count.participantes || 0}
                </div>
              )}
            </div>

            <div className={styles.modalDescricao}>
              <h3>Sobre o evento</h3>
              <p>{evento.descricao}</p>
            </div>

            {evento.parceiros && evento.parceiros.length > 0 && (
              <div className={styles.modalParceiros}>
                <h3>Parceiros</h3>
                <div className={styles.parceirosList}>
                  {evento.parceiros.map((p, i) => (
                    <span key={i} className={styles.parceiroTag}>{p.nome}</span>
                  ))}
                </div>
              </div>
            )}

            {evento.contato && (
              <div className={styles.modalContato}>
                <h3>Contato</h3>
                <p>{evento.contato}</p>
              </div>
            )}

            <div className={styles.modalActions}>
              <div className={styles.modalLeftActions}>
                <button
                  className={`${styles.iconButton} ${isFavorited ? styles.active : ''}`}
                  onClick={(e) => toggleFavorite(evento.id, e)}
                >
                  {isFavorited ? <FaHeart /> : <FaRegHeart />}
                </button>
                <div className={styles.shareContainer} ref={shareRef}>
                  <button className={styles.iconButton} onClick={shareEvento}>
                    <FaShareAlt />
                  </button>
                  {showShareMenu && (
                    <div className={styles.shareMenu}>
                      <button onClick={copyLink}>
                        <FaCopy /> Copiar link
                      </button>
                      <a 
                        href={`https://twitter.com/intent/tweet?text=Confira o evento "${evento.titulo}" no CineMar!&url=${window.location.href}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaTwitter /> Compartilhar no Twitter
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.modalRightActions}>
                {user && evento.status === 'ativo' && (
                  <button
                    className={`${styles.subscribeButton} ${isSubscribed ? styles.subscribed : ''}`}
                    onClick={() => handleSubscribe(evento.id)}
                    disabled={subscribingId === evento.id}
                  >
                    {subscribingId === evento.id ? (
                      <FaSpinner className={styles.spinner} />
                    ) : isSubscribed ? (
                      <>
                        <FaUserCheck /> Inscrito
                      </>
                    ) : (
                      <>
                        <FaUserPlus /> Participar
                      </>
                    )}
                  </button>
                )}
                
                {evento.link && (
                  <Link to={evento.link} className={styles.modalButton}>
                    Mais Informações <FaArrowRight />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.eventosPage} ${isDarkMode ? styles.dark : ''}`}>
      {/* Header */}
      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={styles.backLink}>
              ← Voltar para Início
            </Link>
          </div>

          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>
              Eventos e Mobilizações
            </h1>
            <p className={styles.heroSubtitle}>
              O CineMar apoia e participa ativamente de diversos movimentos sociais, plebiscitos,
              pautas sustentáveis e eventos culturais em Camocim e região.
            </p>
            {stats && (
              <div className={styles.heroStats}>
                <span>{eventos.filter(e => e.status === 'ativo').length} Ativos</span>
                <span>•</span>
                <span>{eventos.filter(e => e.status === 'futuro').length} Próximos</span>
                <span>•</span>
                <span>{eventos.filter(e => e.status === 'realizado').length} Realizados</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Botão flutuante de adicionar (apenas admin) */}
      {isAdmin && (
        <button
          className={styles.floatingAddBtn}
          onClick={() => { resetForm(); setShowForm(true); }}
          title="Adicionar evento"
        >
          <FaPlus />
        </button>
      )}

      {/* Formulário de evento */}
      {showForm && isAdmin && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h3>{isEditing ? 'Editar Evento' : 'Novo Evento'}</h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className={styles.formClose}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.formBody}>
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Identificação</h4>
                <div className={styles.formGroup}>
                  <label>Título *</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Nome do evento"
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Data *</label>
                    <input
                      type="text"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      placeholder="Ex: Abril 2025"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Data Completa</label>
                    <input
                      type="text"
                      value={formData.dataCompleta}
                      onChange={(e) => setFormData({ ...formData, dataCompleta: e.target.value })}
                      placeholder="Ex: 23 de Abril de 2025"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Horário</label>
                    <input
                      type="text"
                      value={formData.horario}
                      onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                      placeholder="Ex: 14h às 18h"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Local *</label>
                    <input
                      type="text"
                      value={formData.local}
                      onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                      placeholder="Local do evento"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Classificação</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Tipo</label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    >
                      {TIPOS_CONFIG.filter(t => t.id !== 'todos').map(tipo => (
                        <option key={tipo.id} value={tipo.id}>{tipo.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="ativo">Em Andamento</option>
                      <option value="futuro">Em Breve</option>
                      <option value="realizado">Realizado</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Importância</label>
                    <select
                      value={formData.importancia}
                      onChange={(e) => setFormData({ ...formData, importancia: e.target.value })}
                    >
                      <option value="alta">Alta</option>
                      <option value="media">Média</option>
                      <option value="baixa">Baixa</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Link (opcional)</label>
                    <input
                      type="text"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="/pagina-do-evento"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>URL da Imagem (opcional)</label>
                  <input
                    type="text"
                    value={formData.imagem}
                    onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Descrição</h4>
                <div className={styles.formGroup}>
                  <label>Descrição *</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição detalhada do evento..."
                    rows={4}
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Parceiros e Contato</h4>
                <div className={styles.formGroup}>
                  <label>Parceiros (separar por vírgula)</label>
                  <input
                    type="text"
                    value={formData.parceirosNomes?.join(', ')}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      parceirosNomes: e.target.value.split(',').map(p => p.trim()).filter(p => p) 
                    })}
                    placeholder="Parceiro 1, Parceiro 2, Parceiro 3"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Contato (opcional)</label>
                  <input
                    type="text"
                    value={formData.contato}
                    onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
                    placeholder="Telefone ou email para contato"
                  />
                </div>
              </div>
            </div>

            <div className={styles.formFooter}>
              <button className={styles.cancelBtn} onClick={() => { setShowForm(false); resetForm(); }}>
                Cancelar
              </button>
              <button className={styles.submitBtn} onClick={isEditing ? handleEditEvento : handleAddEvento}>
                <FaSave /> {isEditing ? 'Salvar Alterações' : 'Adicionar Evento'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className={styles.filtersSection}>
        <div className={styles.filtersContent}>
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="search"
                placeholder="Buscar eventos..."
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

            <div className={styles.tipoFilters}>
              {TIPOS_CONFIG.map(tipo => {
                const Icone = tipo.icone;
                const isActive = filtroAtivo === tipo.id;
                return (
                  <button
                    key={tipo.id}
                    className={`${styles.tipoFilterBtn} ${isActive ? styles.active : ''}`}
                    onClick={() => setFiltroAtivo(tipo.id)}
                  >
                    <Icone />
                    <span>{tipo.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Eventos */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {eventosFiltrados.length === 0 ? (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}><FaSearch /></div>
              <h2>Nenhum evento encontrado</h2>
              <p>Tente ajustar seus filtros ou busca</p>
              <button
                className={styles.clearFiltersBtn}
                onClick={clearAllFilters}
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className={styles.eventsGrid}>
              {eventosFiltrados.map(evento => {
                const tipoInfo = TIPOS_CONFIG.find(t => t.id === evento.tipo);
                const statusConfig = getStatusConfig(evento.status);
                const importanciaConfig = getImportanciaConfig(evento.importancia);
                const isFavorited = favorites.includes(evento.id);
                
                return (
                  <article key={evento.id} className={styles.eventoCard}>
                    <div className={styles.eventoCardHeader}>
                      <div className={styles.eventoTipo}>
                        <div className={styles.tipoContent} style={{ background: `${tipoInfo?.cor}15` }}>
                          {getIconeTipo(evento.tipo)}
                          <span className={styles.tipoLabel}>{tipoInfo?.label}</span>
                        </div>
                      </div>
                      <div className={styles.eventoStatus} style={{ color: statusConfig.color }}>
                        <statusConfig.icon />
                        <span>{statusConfig.label}</span>
                      </div>
                    </div>

                    {evento.imagem && (
                      <div className={styles.eventoCardImage}>
                        <img 
                          src={imageErrors[evento.id] ? PlaceholderImage : evento.imagem} 
                          alt={evento.titulo}
                          onError={() => handleImageError(evento.id)}
                        />
                      </div>
                    )}

                    <div className={styles.eventoCardContent}>
                      <h2 className={styles.eventoTitulo}>{evento.titulo}</h2>
                      
                      <div className={styles.eventoMetaCompact}>
                        <div className={styles.metaItemCompact}>
                          <FaCalendarAlt />
                          <span>{evento.data}</span>
                        </div>
                        <div className={styles.metaItemCompact}>
                          <FaMapMarkerAlt />
                          <span>{evento.local}</span>
                        </div>
                        {evento.horario && (
                          <div className={styles.metaItemCompact}>
                            <FaClock />
                            <span>{evento.horario}</span>
                          </div>
                        )}
                      </div>

                      <div className={styles.importanciaBadge} style={{ background: importanciaConfig.color }}>
                        <FaStar /> {importanciaConfig.label}
                      </div>

                      <p className={styles.eventoDescricao}>
                        {evento.descricao.substring(0, 120)}
                        {evento.descricao.length > 120 ? '...' : ''}
                      </p>

                      <div className={styles.eventoCardFooterCompact}>
                        <div className={styles.cardActionsLeft}>
                          <button
                            className={`${styles.iconBtn} ${isFavorited ? styles.active : ''}`}
                            onClick={(e) => toggleFavorite(evento.id, e)}
                          >
                            {isFavorited ? <FaHeart /> : <FaRegHeart />}
                          </button>
                          <button
                            className={styles.eventoLinkCompact}
                            onClick={() => setSelectedEvento(evento)}
                          >
                            <FaEye /> Ver Detalhes
                          </button>
                        </div>

                        <div className={styles.cardActionsRight}>
                          {user && evento.status === 'ativo' && (
                            <button
                              className={styles.subscribeBtnCompact}
                              onClick={() => handleSubscribe(evento.id)}
                              disabled={subscribingId === evento.id}
                            >
                              {subscribingId === evento.id ? (
                                <FaSpinner className={styles.spinner} />
                              ) : (
                                <FaUserPlus />
                              )}
                            </button>
                          )}

                          {isAdmin && (
                            <div className={styles.adminActions}>
                              <button onClick={() => openEditForm(evento)} className={styles.editBtn}>
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteEvento(evento.id)}
                                className={`${styles.deleteBtn} ${confirmDelete === evento.id ? styles.confirming : ''}`}
                              >
                                {confirmDelete === evento.id ? <FaTimes /> : <FaTrash />}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Modal de detalhes */}
          {selectedEvento && !showForm && (
            <ModalDetalhes evento={selectedEvento} onClose={() => setSelectedEvento(null)} />
          )}
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>
          {toast.type === 'success' && <FaCheckCircle />}
          {toast.type === 'error' && <FaExclamationTriangle />}
          {toast.type === 'warn' && <FaExclamationTriangle />}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

export default Eventos;