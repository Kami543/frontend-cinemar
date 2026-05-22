import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaLeaf, FaBook,
  FaHandsHelping, FaVoteYea, FaArrowRight,
  FaSearch, FaStar, FaClock,
  FaCheckCircle, FaCalendarPlus, FaPlus, FaTimes,
  FaTrash, FaEdit, FaSave, FaEye, FaWhatsapp, FaEnvelope
} from 'react-icons/fa';
import styles from '../styles/Eventos.module.css';

interface Evento {
  id: number;
  titulo: string;
  data: string;
  dataCompleta: string;
  local: string;
  descricao: string;
  tipo: 'movimento-social' | 'plebiscito' | 'sustentabilidade' | 'evento-local' | 'cultural';
  status: 'ativo' | 'realizado' | 'futuro';
  parceiros: string[];
  link?: string;
  importancia: 'alta' | 'media' | 'baixa';
  imagem?: string;
  contato?: string;
  horario?: string;
}

function Eventos() {
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState<string>('todos');
  const [busca, setBusca] = useState<string>('');

  const [formData, setFormData] = useState<Partial<Evento>>({
    titulo: '',
    data: '',
    dataCompleta: '',
    local: '',
    descricao: '',
    tipo: 'evento-local',
    status: 'futuro',
    parceiros: [],
    importancia: 'media',
    imagem: '',
    contato: '',
    horario: ''
  });

  const eventosIniciais: Evento[] = [
    {
      id: 1, titulo: 'Novembro Negro - Consciência Negra',
      data: 'Novembro 2024', dataCompleta: '20 de Novembro de 2024',
      local: 'Escola EEEP Mess & Comunidade',
      descricao: 'Série de atividades culturais e educativas em celebração ao Dia da Consciência Negra. Inclui rodas de conversa, exibições de filmes afrocentrados, oficinas de dança e música afro-brasileira.',
      tipo: 'cultural', status: 'realizado',
      parceiros: ['EEEP Mess', 'Movimento Negro de Camocim', 'Secretaria de Cultura'],
      importancia: 'alta', link: '/novembro-negro', horario: '14h às 20h'
    },
    {
      id: 2, titulo: 'Plebiscito Popular sobre Reforma Agrária',
      data: 'Outubro 2024', dataCompleta: '15 de Outubro de 2024',
      local: 'Praça Central de Camocim',
      descricao: 'Consulta popular organizada por movimentos sociais para debater e votar propostas sobre reforma agrária e direitos dos trabalhadores rurais.',
      tipo: 'plebiscito', status: 'realizado',
      parceiros: ['MST', 'CPT', 'Sindicato dos Trabalhadores Rurais'],
      importancia: 'alta', link: '/plebiscito-reforma-agraria', horario: '8h às 17h'
    },
    {
      id: 3, titulo: 'Dia do Livro - EEEP Mess',
      data: 'Abril 2025', dataCompleta: '23 de Abril de 2025',
      local: 'Escola EEEP Mess',
      descricao: 'Celebração o Dia Mundial do Livro com maratona de leitura, troca de livros, encontro com autores locais e oficinas de produção literária.',
      tipo: 'evento-local', status: 'ativo',
      parceiros: ['EEEP Mess', 'Biblioteca Municipal', 'Editora Independente'],
      importancia: 'alta', link: '/dia-do-livro', horario: '9h às 18h'
    }
  ];

  const tiposEvento = [
    { id: 'todos', label: 'Todos', icone: FaCalendarAlt, cor: '#dc2626' },
    { id: 'movimento-social', label: 'Sociais', icone: FaUsers, cor: '#3b82f6' },
    { id: 'plebiscito', label: 'Plebiscitos', icone: FaVoteYea, cor: '#8b5cf6' },
    { id: 'sustentabilidade', label: 'Sustentabilidade', icone: FaLeaf, cor: '#10b981' },
    { id: 'evento-local', label: 'Locais', icone: FaMapMarkerAlt, cor: '#f59e0b' },
    { id: 'cultural', label: 'Culturais', icone: FaBook, cor: '#ec4899' },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('cinemar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const storedEventos = localStorage.getItem('cinemar_eventos');
    if (storedEventos) {
      setEventos(JSON.parse(storedEventos));
    } else {
      setEventos(eventosIniciais);
    }
  }, []);

  useEffect(() => {
    if (eventos.length > 0) {
      localStorage.setItem('cinemar_eventos', JSON.stringify(eventos));
    }
  }, [eventos]);

  const isAdmin = user?.role === 'admin';

  const eventosFiltrados = eventos.filter(ev => {
    const passaFiltro = filtroAtivo === 'todos' || ev.tipo === filtroAtivo;
    const passaBusca = !busca ||
      ev.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      ev.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      ev.local.toLowerCase().includes(busca.toLowerCase());
    return passaFiltro && passaBusca;
  });

  const handleAddEvento = () => {
    if (!formData.titulo || !formData.data || !formData.local || !formData.descricao) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    const novoEvento: Evento = {
      id: Date.now(),
      titulo: formData.titulo!,
      data: formData.data!,
      dataCompleta: formData.dataCompleta || formData.data!,
      local: formData.local!,
      descricao: formData.descricao!,
      tipo: formData.tipo as any,
      status: formData.status as any,
      parceiros: formData.parceiros || [],
      importancia: formData.importancia as any,
      link: formData.link,
      imagem: formData.imagem,
      contato: formData.contato,
      horario: formData.horario
    };
    setEventos([novoEvento, ...eventos]);
    resetForm();
    setShowForm(false);
  };

  const handleEditEvento = () => {
    if (!selectedEvento) return;
    const updatedEventos = eventos.map(ev =>
      ev.id === selectedEvento.id ? { ...ev, ...formData } : ev
    );
    setEventos(updatedEventos);
    resetForm();
    setShowForm(false);
    setIsEditing(false);
    setSelectedEvento(null);
  };

  const handleDeleteEvento = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      setEventos(eventos.filter(ev => ev.id !== id));
      if (selectedEvento?.id === id) setSelectedEvento(null);
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
      parceiros: evento.parceiros,
      importancia: evento.importancia,
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
      parceiros: [],
      importancia: 'media',
      imagem: '',
      contato: '',
      horario: ''
    });
    setIsEditing(false);
    setSelectedEvento(null);
  };

  const getIconeTipo = (tipo: string) => {
    const map: Record<string, JSX.Element> = {
      'movimento-social': <FaUsers aria-hidden="true" />,
      'plebiscito': <FaVoteYea aria-hidden="true" />,
      'sustentabilidade': <FaLeaf aria-hidden="true" />,
      'evento-local': <FaMapMarkerAlt aria-hidden="true" />,
      'cultural': <FaBook aria-hidden="true" />,
    };
    return map[tipo] ?? <FaCalendarAlt aria-hidden="true" />;
  };

  const getIconeStatus = (status: string) => {
    const map: Record<string, JSX.Element> = {
      ativo: <FaClock aria-hidden="true" />,
      realizado: <FaCheckCircle aria-hidden="true" />,
      futuro: <FaCalendarPlus aria-hidden="true" />,
    };
    return map[status] ?? <FaCalendarAlt aria-hidden="true" />;
  };

  const getCorStatus = (status: string) =>
    ({ ativo: '#10b981', realizado: '#6b7280', futuro: '#3b82f6' }[status] ?? '#6b7280');

  const getTextoStatus = (status: string) =>
    ({ ativo: 'Em Andamento', realizado: 'Realizado', futuro: 'Em Breve' }[status] ?? status);

  const ModalDetalhes = ({ evento, onClose }: { evento: Evento; onClose: () => void }) => (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          <FaTimes />
        </button>

        <div className={styles.modalHeader}>
          <h2>{evento.titulo}</h2>
          <div className={styles.modalBadges}>
            <span className={styles.modalTipo} style={{ background: tiposEvento.find(t => t.id === evento.tipo)?.cor }}>
              {getIconeTipo(evento.tipo)} {tiposEvento.find(t => t.id === evento.tipo)?.label}
            </span>
            <span className={styles.modalStatus} style={{ color: getCorStatus(evento.status) }}>
              {getIconeStatus(evento.status)} {getTextoStatus(evento.status)}
            </span>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalInfo}>
            <div className={styles.modalInfoItem}>
              <FaCalendarAlt /> <strong>Data:</strong> {evento.dataCompleta}
              {evento.horario && <span className={styles.modalHorario}> • {evento.horario}</span>}
            </div>
            <div className={styles.modalInfoItem}>
              <FaMapMarkerAlt /> <strong>Local:</strong> {evento.local}
            </div>
            <div className={styles.modalInfoItem}>
              <FaStar /> <strong>Importância:</strong> {evento.importancia === 'alta' ? 'Alta' : evento.importancia === 'media' ? 'Média' : 'Baixa'}
            </div>
          </div>

          <div className={styles.modalDescricao}>
            <h3>Sobre o evento</h3>
            <p>{evento.descricao}</p>
          </div>

          {evento.parceiros.length > 0 && (
            <div className={styles.modalParceiros}>
              <h3>Parceiros</h3>
              <div className={styles.parceirosList}>
                {evento.parceiros.map((p, i) => (
                  <span key={i} className={styles.parceiroTag}>{p}</span>
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
            {evento.link && (
              <Link to={evento.link} className={styles.modalButton}>
                Mais Informações <FaArrowRight />
              </Link>
            )}
            <div className={styles.modalShare}>
              <span>Compartilhar:</span>
              <a href={`https://wa.me/?text=${encodeURIComponent(`Confira o evento: ${evento.titulo} em ${evento.local}`)}`} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp />
              </a>
              <a href={`mailto:?subject=${encodeURIComponent(evento.titulo)}&body=${encodeURIComponent(evento.descricao)}`}>
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.eventosPage}>
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
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                    >
                      {tiposEvento.filter(t => t.id !== 'todos').map(tipo => (
                        <option key={tipo.id} value={tipo.id}>{tipo.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
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
                      onChange={(e) => setFormData({ ...formData, importancia: e.target.value as any })}
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
                    value={formData.parceiros?.join(', ')}
                    onChange={(e) => setFormData({ ...formData, parceiros: e.target.value.split(',').map(p => p.trim()).filter(p => p) })}
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
            </div>

            <div className={styles.tipoFilters}>
              {tiposEvento.map(tipo => {
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
              <button className={styles.clearFiltersBtn} onClick={() => { setFiltroAtivo('todos'); setBusca(''); }}>
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className={styles.eventsGrid}>
              {eventosFiltrados.map(evento => {
                const tipoInfo = tiposEvento.find(t => t.id === evento.tipo);
                return (
                  <article key={evento.id} className={styles.eventoCard}>
                    <div className={styles.eventoCardHeader}>
                      <div className={styles.eventoTipo}>
                        <div className={styles.tipoContent}>
                          {getIconeTipo(evento.tipo)}
                          <span className={styles.tipoLabel}>{tipoInfo?.label}</span>
                        </div>
                      </div>
                      <div className={styles.eventoStatus} style={{ color: getCorStatus(evento.status) }}>
                        {getIconeStatus(evento.status)}
                        <span>{getTextoStatus(evento.status)}</span>
                      </div>
                    </div>

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
                      </div>
                      <p className={styles.eventoDescricao}>{evento.descricao.substring(0, 120)}...</p>

                      <div className={styles.eventoCardFooterCompact}>
                        <button
                          className={styles.eventoLinkCompact}
                          onClick={() => setSelectedEvento(evento)}
                        >
                          <FaEye /> Ver Detalhes
                        </button>

                        {isAdmin && (
                          <div className={styles.adminActions}>
                            <button onClick={() => openEditForm(evento)} className={styles.editBtn}>
                              <FaEdit />
                            </button>
                            <button onClick={() => handleDeleteEvento(evento.id)} className={styles.deleteBtn}>
                              <FaTrash />
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

          {selectedEvento && !showForm && (
            <ModalDetalhes evento={selectedEvento} onClose={() => setSelectedEvento(null)} />
          )}
        </div>
      </main>
    </div>
  );
}

export default Eventos;