// pages/Sessions.tsx - versão completamente corrigida
import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaFilm,
  FaUsers,
  FaChair,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaSearch,
  FaFilter,
  FaEye,
  FaSpinner,
  FaExclamationTriangle,
  FaUserCheck,
  FaVideo,
  FaYoutube,
  FaArrowRight,
  FaRegCalendarAlt,
  FaStar,
  FaUser,
  FaTimes,
} from 'react-icons/fa';
import styles from '../styles/Sessions.module.css';
import { useSessoes } from '../hooks/useSessions';
import { type CreateSessaoPayload, type Sessao } from '../services/sessoes.service';
import { useTheme } from '../components/context/ThemeContext';

// Configuração de status baseada em dataSessao
const getStatusFromDate = (dataSessao: string): 'AGENDADA' | 'REALIZADA' | 'EM_ANDAMENTO' => {
  if (!dataSessao) return 'AGENDADA';
  const hoje = new Date();
  const dataSessaoDate = new Date(dataSessao);
  
  if (dataSessaoDate > hoje) return 'AGENDADA';
  if (dataSessaoDate.toDateString() === hoje.toDateString()) return 'EM_ANDAMENTO';
  return 'REALIZADA';
};

const STATUS_CONFIG = {
  AGENDADA: { label: 'Agendada', icon: FaRegCalendarAlt, color: '#3b82f6', bgColor: '#dbeafe' },
  EM_ANDAMENTO: { label: 'Em Andamento', icon: FaVideo, color: '#f59e0b', bgColor: '#fed7aa' },
  REALIZADA: { label: 'Realizada', icon: FaCheckCircle, color: '#10b981', bgColor: '#d1fae5' },
};

// Tipos fixos para frontend
const TIPO_CONFIG = [
  { id: 'TODOS', label: 'Todos', icon: FaCalendarAlt },
  { id: 'FILME', label: 'Filmes', icon: FaFilm },
  { id: 'DEBATE', label: 'Debates', icon: FaUsers },
  { id: 'WORKSHOP', label: 'Workshops', icon: FaUsers },
  { id: 'ESPECIAL', label: 'Especiais', icon: FaStar },
];

function Sessions() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedSessao, setSelectedSessao] = useState<Sessao | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [busca, setBusca] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmandoPresenca, setConfirmandoPresenca] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    sessoes,
    isLoading,
    error,
    toast,
    createSessao,
    updateSessao,
    removeSessao,
    confirmarPresenca,
    refetch,
    setQuery,
  } = useSessoes({ limit: 100 });

  useEffect(() => {
    const storedUser = localStorage.getItem('cinemar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  // Estado do formulário
  const [formData, setFormData] = useState<Partial<CreateSessaoPayload>>({
    titulo: '',
    diretor: '',
    ano: new Date().getFullYear(),
    dataSessao: '',
    descricao: '',
  });

  // Funções de formatação
  const formatarData = (dataStr: string) => {
    if (!dataStr) return 'Data não informada';
    try {
      const data = new Date(dataStr);
      if (isNaN(data.getTime())) return 'Data inválida';
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      return 'Erro na data';
    }
  };

  const formatarHorario = (dataStr: string) => {
    if (!dataStr) return 'Horário não informado';
    try {
      const data = new Date(dataStr);
      if (isNaN(data.getTime())) return 'Horário inválido';
      return data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Erro no horário';
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      diretor: '',
      ano: new Date().getFullYear(),
      dataSessao: '',
      descricao: '',
    });
    setIsEditing(false);
    setSelectedSessao(null);
  };

  const showToast = (msg: string, type: 'success' | 'error' | 'warn' = 'success') => {
    console.log(`${type}: ${msg}`);
  };

  // Filtrar sessões
  const sessoesFiltradas = useMemo(() => {
    let filtered = sessoes;
    
    if (filtroStatus !== 'TODOS') {
      filtered = filtered.filter(s => getStatusFromDate(s.dataSessao) === filtroStatus);
    }
    
    if (filtroTipo !== 'TODOS') {
      filtered = filtered.filter(s => {
        if (filtroTipo === 'FILME') return s.diretor && s.diretor.length > 0;
        if (filtroTipo === 'DEBATE') return s.titulo.toLowerCase().includes('debate');
        if (filtroTipo === 'WORKSHOP') return s.titulo.toLowerCase().includes('workshop');
        if (filtroTipo === 'ESPECIAL') return s.titulo.toLowerCase().includes('especial');
        return true;
      });
    }
    
    if (busca) {
      const searchLower = busca.toLowerCase();
      filtered = filtered.filter(s =>
        s.titulo.toLowerCase().includes(searchLower) ||
        s.diretor?.toLowerCase().includes(searchLower) ||
        s.descricao?.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [sessoes, filtroStatus, filtroTipo, busca]);

  // CRUD Handlers
  const handleAddSessao = async () => {
    if (!formData.titulo || !formData.dataSessao) {
      showToast('Preencha título e data da sessão!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateSessaoPayload = {
        titulo: formData.titulo,
        diretor: formData.diretor || 'CineMar',
        ano: formData.ano || new Date().getFullYear(),
        dataSessao: formData.dataSessao,
        descricao: formData.descricao || '',
      };

      await createSessao(payload);
      resetForm();
      setShowForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSessao = async () => {
    if (!selectedSessao) return;
    
    setIsSubmitting(true);
    try {
      const payload: Partial<CreateSessaoPayload> = {
        titulo: formData.titulo,
        diretor: formData.diretor,
        ano: formData.ano,
        dataSessao: formData.dataSessao,
        descricao: formData.descricao,
      };

      await updateSessao(selectedSessao.id, payload);
      resetForm();
      setShowForm(false);
      setIsEditing(false);
      setSelectedSessao(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSessao = async (id: string) => {
    if (confirmDelete === id) {
      await removeSessao(id);
      setConfirmDelete(null);
      if (selectedSessao?.id === id) setSelectedSessao(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const handleConfirmarPresenca = async (id: string) => {
    setConfirmandoPresenca(id);
    try {
      await confirmarPresenca(id);
    } finally {
      setConfirmandoPresenca(null);
    }
  };

  const openEditForm = (sessao: Sessao) => {
    setSelectedSessao(null);
    setFormData({
      titulo: sessao.titulo,
      diretor: sessao.diretor,
      ano: sessao.ano,
      dataSessao: sessao.dataSessao.split('T')[0],
      descricao: sessao.descricao,
    });
    setSelectedSessao(sessao);
    setIsEditing(true);
    setShowForm(true);
  };

  if (isLoading && sessoes.length === 0) {
    return (
      <div className={`${styles.sessionsPage} ${isDarkMode ? styles.dark : ''}`}>
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.loadingSpinner} />
          <p>Carregando sessões...</p>
        </div>
      </div>
    );
  }

  if (error && sessoes.length === 0) {
    return (
      <div className={`${styles.sessionsPage} ${isDarkMode ? styles.dark : ''}`}>
        <div className={styles.errorContainer}>
          <FaExclamationTriangle />
          <p>{error}</p>
          <button onClick={() => refetch()}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.sessionsPage} ${isDarkMode ? styles.dark : ''}`}>
      {/* Header */}
      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={styles.backLink}>
              ← Voltar para Início
            </Link>
          </div>

          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>Sessões CineMar</h1>
            <p className={styles.heroSubtitle}>
              Acompanhe todas as sessões de filmes, debates e eventos especiais do CineMar
            </p>
            <div className={styles.statsBar}>
              <span>{sessoes.filter(s => getStatusFromDate(s.dataSessao) === 'AGENDADA').length} Agendadas</span>
              <span>•</span>
              <span>{sessoes.filter(s => getStatusFromDate(s.dataSessao) === 'EM_ANDAMENTO').length} Hoje</span>
              <span>•</span>
              <span>{sessoes.filter(s => getStatusFromDate(s.dataSessao) === 'REALIZADA').length} Realizadas</span>
            </div>
          </div>
        </div>
      </header>

      {/* Botão flutuante de adicionar */}
      {isAdmin && (
        <button className={styles.floatingAddBtn} onClick={() => { resetForm(); setShowForm(true); }}>
          <FaPlus />
        </button>
      )}

      {/* Formulário */}
      {showForm && isAdmin && (
        <div className={styles.formOverlay} onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowForm(false);
            resetForm();
          }
        }}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h3>{isEditing ? 'Editar Sessão' : 'Nova Sessão'}</h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className={styles.formClose}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.formBody}>
              <div className={styles.formGroup}>
                <label>Título *</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Nome da sessão"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Diretor/Organizador</label>
                <input
                  type="text"
                  value={formData.diretor}
                  onChange={(e) => setFormData({ ...formData, diretor: e.target.value })}
                  placeholder="Nome do diretor ou organizador"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Ano</label>
                  <input
                    type="number"
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Data da Sessão *</label>
                  <input
                    type="datetime-local"
                    value={formData.dataSessao}
                    onChange={(e) => setFormData({ ...formData, dataSessao: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={4}
                  placeholder="Descrição detalhada da sessão..."
                />
              </div>
            </div>

            <div className={styles.formFooter}>
              <button className={styles.cancelBtn} onClick={() => { setShowForm(false); resetForm(); }}>
                Cancelar
              </button>
              <button 
                className={styles.submitBtn} 
                onClick={isEditing ? handleEditSessao : handleAddSessao}
                disabled={isSubmitting}
              >
                {isSubmitting ? <FaSpinner className={styles.spinner} /> : <FaSave />}
                {isEditing ? 'Salvar' : 'Adicionar'}
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
                placeholder="Buscar sessões..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}><FaFilter /> Status:</label>
              <div className={styles.filterButtons}>
                {['TODOS', 'AGENDADA', 'EM_ANDAMENTO', 'REALIZADA'].map(status => {
                  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
                  return (
                    <button
                      key={status}
                      className={`${styles.filterBtn} ${filtroStatus === status ? styles.active : ''}`}
                      onClick={() => setFiltroStatus(status)}
                    >
                      {config?.icon && <config.icon />}
                      <span>{status === 'TODOS' ? 'Todos' : config?.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Sessões */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {sessoesFiltradas.length === 0 ? (
            <div className={styles.noResults}>
              <FaSearch />
              <h2>Nenhuma sessão encontrada</h2>
              <button onClick={() => { setFiltroStatus('TODOS'); setFiltroTipo('TODOS'); setBusca(''); }}>
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className={styles.sessionsGrid}>
              {sessoesFiltradas.map(sessao => {
                const status = getStatusFromDate(sessao.dataSessao);
                const statusConfig = STATUS_CONFIG[status];
                const lugaresDisponiveis = 50 - (sessao.participantes || 0);
                
                return (
                  <article key={sessao.id} className={styles.sessaoCard}>
                    <div className={styles.sessaoCardHeader}>
                      <div className={styles.sessaoStatus} style={{ 
                        background: statusConfig.bgColor, 
                        color: statusConfig.color 
                      }}>
                        {statusConfig.icon && <statusConfig.icon />}
                        <span>{statusConfig.label}</span>
                      </div>
                    </div>

                    <div className={styles.sessaoCardContent}>
                      <h2 className={styles.sessaoTitulo}>{sessao.titulo}</h2>
                      
                      <div className={styles.sessaoInfo}>
                        <div className={styles.infoItem}>
                          <FaCalendarAlt />
                          <span>{formatarData(sessao.dataSessao)}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <FaClock />
                          <span>{formatarHorario(sessao.dataSessao)}</span>
                        </div>
                        {sessao.diretor && (
                          <div className={styles.infoItem}>
                            <FaUser />
                            <span>{sessao.diretor}</span>
                          </div>
                        )}
                      </div>

                      <p className={styles.sessaoDescricao}>
                        {sessao.descricao?.substring(0, 100)}
                        {sessao.descricao && sessao.descricao.length > 100 ? '...' : ''}
                      </p>

                      <div className={styles.sessaoStats}>
                        <div className={styles.statItem}>
                          <FaChair />
                          <span>{lugaresDisponiveis} / 50 lugares</span>
                        </div>
                        {sessao.participantes > 0 && (
                          <div className={styles.statItem}>
                            <FaUsers />
                            <span>{sessao.participantes} participantes</span>
                          </div>
                        )}
                      </div>

                      <div className={styles.sessaoCardFooter}>
                        <button className={styles.detalhesBtn} onClick={() => setSelectedSessao(sessao)}>
                          <FaEye /> Ver Detalhes
                        </button>

                        {user && status === 'AGENDADA' && lugaresDisponiveis > 0 && (
                          <button
                            className={styles.confirmarBtn}
                            onClick={() => handleConfirmarPresenca(sessao.id)}
                            disabled={confirmandoPresenca === sessao.id}
                          >
                            {confirmandoPresenca === sessao.id ? (
                              <FaSpinner className={styles.spinner} />
                            ) : (
                              <><FaUserCheck /> Confirmar</>
                            )}
                          </button>
                        )}

                        {isAdmin && (
                          <div className={styles.adminActions}>
                            <button onClick={() => openEditForm(sessao)} className={styles.editBtn}>
                              <FaEdit />
                            </button>
                            <button onClick={() => handleDeleteSessao(sessao.id)} className={styles.deleteBtn}>
                              {confirmDelete === sessao.id ? <FaTimes /> : <FaTrash />}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Detalhes */}
      {selectedSessao && !showForm && (
  <div className={styles.modalOverlay} onClick={() => setSelectedSessao(null)}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button className={styles.modalClose} onClick={() => setSelectedSessao(null)}>
        <FaTimes />
      </button>

      <div className={styles.modalHeader}>
        <h2>{selectedSessao.titulo}</h2>
        <div className={styles.modalBadges}>
          {(() => {
            const status = getStatusFromDate(selectedSessao.dataSessao);
            const config = STATUS_CONFIG[status];
            const IconComponent = config.icon;
            return (
              <span 
                className={styles.modalStatus} 
                style={{
                  background: config.bgColor,
                  color: config.color
                }}
              >
                <IconComponent />
                <span>{config.label}</span>
              </span>
            );
          })()}
        </div>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.modalInfoGrid}>
          <div className={styles.modalInfoItem}>
            <FaCalendarAlt />
            <div>
              <strong>Data</strong>
              <p>{formatarData(selectedSessao.dataSessao)}</p>
            </div>
          </div>
          <div className={styles.modalInfoItem}>
            <FaClock />
            <div>
              <strong>Horário</strong>
              <p>{formatarHorario(selectedSessao.dataSessao)}</p>
            </div>
          </div>
          {selectedSessao.diretor && (
            <div className={styles.modalInfoItem}>
              <FaUser />
              <div>
                <strong>Diretor/Organizador</strong>
                <p>{selectedSessao.diretor}</p>
              </div>
            </div>
          )}
          <div className={styles.modalInfoItem}>
            <FaChair />
            <div>
              <strong>Participantes</strong>
              <p>{selectedSessao.participantes || 0} confirmados</p>
            </div>
          </div>
        </div>

        <div className={styles.modalDescricao}>
          <h3>Sobre a sessão</h3>
          <p>{selectedSessao.descricao || 'Sem descrição disponível.'}</p>
        </div>

        <div className={styles.modalActions}>
          {user && getStatusFromDate(selectedSessao.dataSessao) === 'AGENDADA' && (
            <button
              className={styles.confirmarPresencaBtn}
              onClick={() => handleConfirmarPresenca(selectedSessao.id)}
              disabled={confirmandoPresenca === selectedSessao.id}
            >
              {confirmandoPresenca === selectedSessao.id ? (
                <FaSpinner className={styles.spinner} />
              ) : (
                <>
                  <FaUserCheck /> Confirmar Presença
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
)}

      {/* Toast Notification */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>
          {toast.type === 'success' && <FaCheckCircle />}
          {toast.type === 'error' && <FaExclamationTriangle />}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

export default Sessions;