import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHeadphones,
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaShareAlt,
  FaHeart,
  FaRegHeart,
  FaYoutube,
  FaExternalLinkAlt,
  FaPlay,
  FaSearch,
  FaFilter,
  FaTimes,
  FaStar,
  FaTag,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave
} from 'react-icons/fa';
import { useTheme } from '../components/context/ThemeContext';
import styles from '../styles/Podcasts.module.css';

interface Timestamp {
  id: number;
  tempo: string;
  titulo: string;
  descricao: string;
  categoria: string;
  importante: boolean;
}

interface Podcast {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  duracao: string;
  participantes: string[];
  tags: string[];
  link: string;
  videoId: string;
  plataforma: 'youtube';
  destaque: boolean;
  episodio: number;
  temporada: string;
  organizador: string;
  contexto: string;
}

export default function Podcasts() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [user, setUser] = useState<any>(null);

  const [favorito, setFavorito] = useState<boolean>(true);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('importante');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Estados de Admin
  const [isEditingPodcast, setIsEditingPodcast] = useState(false);
  const [editingTimestampId, setEditingTimestampId] = useState<number | null>(null);
  const [isAddingTimestamp, setIsAddingTimestamp] = useState(false);
  const [editingParticipantIndex, setEditingParticipantIndex] = useState<number | null>(null);
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);

  // Dados do Podcast
  const [podcast, setPodcast] = useState<Podcast>({
    id: 1,
    titulo: 'História do CineMar - Podcast Cunversa (Ep. 87)',
    descricao: 'Participação especial contando a trajetória completa do CineMar, desde sua concepção até o impacto na comunidade de Camocim. Uma conversa rica sobre cinema, educação, cultura e a história dos cinemas na cidade.',
    data: '05 de Setembro de 2025',
    duracao: '02:09:54',
    participantes: [
      'Professor Luiz (Co-fundador do CineMar)',
      'Renato (Co-fundador do CineMar)',
      'Santiago (Apresentador do Podcast Cunversa)',
      'Co-apresentador do Podcast Cunversa'
    ],
    tags: ['CineMar', 'cinema comunitário', 'Camocim', 'podcast', 'cultura', 'educação', 'ACCAL'],
    link: 'https://www.youtube.com/watch?v=1ZDVBWUxj_o',
    videoId: '1ZDVBWUxj_o',
    plataforma: 'youtube',
    destaque: true,
    episodio: 87,
    temporada: '2025',
    organizador: 'Academia Camocinense de Ciências, Artes e Letras (ACCAL)',
    contexto: 'Participação no podcast Cunversa da ACCAL, onde contamos a história completa do CineMar, desde a ideia inicial até as sessões atuais e seu impacto na comunidade de Camocim.',
  });

  // Dados da linha do tempo
  const [timelineData, setTimelineData] = useState<Timestamp[]>([
    { id: 1, tempo: '00:01:38', titulo: 'Introdução Filosófica', descricao: 'O episódio começa com uma declaração filosófica sobre as coisas simples da vida serem as melhores.', categoria: 'introducao', importante: true },
    { id: 2, tempo: '00:09:49', titulo: 'Boas-vindas ao Episódio 87', descricao: 'Os anfitriões dão as boas-vindas ao episódio 87 do Podcast Cunversa.', categoria: 'introducao', importante: false },
    { id: 3, tempo: '00:11:30', titulo: 'Homenagem e Lançamento de Livro', descricao: 'Homenagem a Altan Rego e anúncio do livro do Dr. Luís Fernando.', categoria: 'introducao', importante: true },
    { id: 4, tempo: '00:16:58', titulo: 'De São Paulo a Camocim', descricao: 'Professor Renato conta sua jornada de São Paulo para Camocim.', categoria: 'historia', importante: true },
    { id: 5, tempo: '00:24:32', titulo: 'Ativismo Político', descricao: 'Relato do ativismo político durante a redemocratização do Brasil.', categoria: 'historia', importante: false },
    { id: 6, tempo: '00:32:58', titulo: 'Chegada ao Ceará', descricao: 'História da mudança para Camocim e início da vida no Nordeste.', categoria: 'historia', importante: true },
    { id: 7, tempo: '00:40:59', titulo: 'Origem do CineMar', descricao: 'Como surgiu a ideia do projeto CineMar em Camocim.', categoria: 'cinemar', importante: true },
    { id: 8, tempo: '00:58:12', titulo: 'Criação do CineMar', descricao: 'Processo de fundação e primeiras sessões do CineMar.', categoria: 'cinemar', importante: true },
    { id: 9, tempo: '01:02:03', titulo: 'Objetivos do Projeto', descricao: 'Missão e propósitos do CineMar na comunidade.', categoria: 'cinemar', importante: true },
    { id: 10, tempo: '01:13:32', titulo: 'Cinemas de Camocim', descricao: 'História dos cinemas tradicionais de Camocim.', categoria: 'cinema', importante: true },
    { id: 11, tempo: '01:16:37', titulo: 'Declínio dos Cinemas de Rua', descricao: 'O desaparecimento dos cinemas tradicionais.', categoria: 'cinema', importante: false },
    { id: 12, tempo: '01:26:21', titulo: 'Evolução dos Espaços Públicos', descricao: 'Como os espaços públicos mudaram ao longo do tempo.', categoria: 'cinema', importante: false },
    { id: 13, tempo: '01:31:01', titulo: 'Poder do Cinema', descricao: 'Como o cinema transforma e educa as pessoas.', categoria: 'cinema', importante: true },
    { id: 14, tempo: '01:37:37', titulo: 'Experiência Social do Cinema', descricao: 'O cinema como atividade social e coletiva.', categoria: 'cinema', importante: false },
    { id: 15, tempo: '01:42:34', titulo: 'Cinema na Educação', descricao: 'Uso do cinema como ferramenta educacional.', categoria: 'educacao', importante: true },
    { id: 16, tempo: '01:50:13', titulo: 'Funcionamento do CineMar', descricao: 'Como são organizadas as sessões e engajamento comunitário.', categoria: 'cinemar', importante: true },
    { id: 17, tempo: '01:54:55', titulo: 'Impacto do Cinema na Sociedade', descricao: 'Como o cinema afeta a sociedade e os jovens.', categoria: 'educacao', importante: false },
    { id: 18, tempo: '01:58:45', titulo: 'Poder do Engajamento Comunitário', descricao: 'Importância do envolvimento da comunidade no CineMar.', categoria: 'cinemar', importante: false },
    { id: 19, tempo: '02:02:09', titulo: 'Considerações Finais', descricao: 'Conclusão do episódio e agradecimentos.', categoria: 'conclusao', importante: true },
    { id: 20, tempo: '02:08:11', titulo: 'Encerramento', descricao: 'Encerramento do episódio e convite para próximas sessões.', categoria: 'conclusao', importante: false }
  ]);

  // Configuração das categorias
  const categories = [
    { id: 'todos', label: 'Todos os Momentos', count: timelineData.length },
    { id: 'importante', label: 'Apenas Importantes', count: timelineData.filter(t => t.importante).length },
    { id: 'introducao', label: 'Introdução', count: timelineData.filter(t => t.categoria === 'introducao').length },
    { id: 'historia', label: 'História Pessoal', count: timelineData.filter(t => t.categoria === 'historia').length },
    { id: 'cinemar', label: 'CineMar', count: timelineData.filter(t => t.categoria === 'cinemar').length },
    { id: 'cinema', label: 'Cinema', count: timelineData.filter(t => t.categoria === 'cinema').length },
    { id: 'educacao', label: 'Educação', count: timelineData.filter(t => t.categoria === 'educacao').length },
    { id: 'conclusao', label: 'Conclusão', count: timelineData.filter(t => t.categoria === 'conclusao').length }
  ];

  // Estados de edição do podcast
  const [editPodcastForm, setEditPodcastForm] = useState<Podcast>(podcast);
  const [editTimestampForm, setEditTimestampForm] = useState<Timestamp>({ id: 0, tempo: '', titulo: '', descricao: '', categoria: '', importante: false });
  const [newTimestamp, setNewTimestamp] = useState<Omit<Timestamp, 'id'>>({ tempo: '', titulo: '', descricao: '', categoria: 'cinemar', importante: false });
  const [newParticipant, setNewParticipant] = useState('');
  const [newTag, setNewTag] = useState('');

  // Verificar usuário logado
  useEffect(() => {
    const storedUser = localStorage.getItem('cinemar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedPodcast = localStorage.getItem('cinemar_podcast');
    if (savedPodcast) setPodcast(JSON.parse(savedPodcast));
    const savedTimeline = localStorage.getItem('cinemar_podcast_timeline');
    if (savedTimeline) setTimelineData(JSON.parse(savedTimeline));
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('cinemar_podcast', JSON.stringify(podcast));
  }, [podcast]);
  useEffect(() => {
    localStorage.setItem('cinemar_podcast_timeline', JSON.stringify(timelineData));
  }, [timelineData]);

  const isAdmin = user?.role === 'admin';

  const toggleFavorito = () => setFavorito(!favorito);

  const compartilharPodcast = () => {
    if (navigator.share) {
      navigator.share({ title: podcast.titulo, text: podcast.descricao, url: podcast.link });
    } else {
      navigator.clipboard.writeText(podcast.link);
      alert('Link copiado!');
    }
  };

  const pularParaTempo = (tempoString: string) => {
    const [horas, minutos, segundos] = tempoString.split(':').map(Number);
    const tempoTotalSegundos = horas * 3600 + minutos * 60 + segundos;
    const iframe = document.getElementById('youtube-video') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [tempoTotalSegundos, true] }), '*');
    }
  };

  // CRUD Podcast
  const handleSavePodcast = () => {
    setPodcast(editPodcastForm);
    setIsEditingPodcast(false);
  };

  // CRUD Timestamps
  const handleEditTimestamp = (item: Timestamp) => {
    setEditTimestampForm(item);
    setEditingTimestampId(item.id);
  };

  const handleSaveTimestamp = () => {
    setTimelineData(timelineData.map(t => t.id === editTimestampForm.id ? editTimestampForm : t));
    setEditingTimestampId(null);
  };

  const handleAddTimestamp = () => {
    const newId = Math.max(...timelineData.map(t => t.id), 0) + 1;
    setTimelineData([...timelineData, { ...newTimestamp, id: newId }]);
    setNewTimestamp({ tempo: '', titulo: '', descricao: '', categoria: 'cinemar', importante: false });
    setIsAddingTimestamp(false);
  };

  const handleDeleteTimestamp = (id: number) => {
    setTimelineData(timelineData.filter(t => t.id !== id));
  };

  // CRUD Participantes
  const handleAddParticipant = () => {
    if (newParticipant.trim()) {
      setPodcast({ ...podcast, participantes: [...podcast.participantes, newParticipant.trim()] });
      setNewParticipant('');
      setIsAddingParticipant(false);
    }
  };

  const handleEditParticipant = (index: number, value: string) => {
    const newParticipants = [...podcast.participantes];
    newParticipants[index] = value;
    setPodcast({ ...podcast, participantes: newParticipants });
    setEditingParticipantIndex(null);
  };

  const handleDeleteParticipant = (index: number) => {
    setPodcast({ ...podcast, participantes: podcast.participantes.filter((_, i) => i !== index) });
  };

  // CRUD Tags
  const handleAddTag = () => {
    if (newTag.trim()) {
      setPodcast({ ...podcast, tags: [...podcast.tags, newTag.trim()] });
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  const handleEditTag = (index: number, value: string) => {
    const newTags = [...podcast.tags];
    newTags[index] = value;
    setPodcast({ ...podcast, tags: newTags });
    setEditingTagIndex(null);
  };

  const handleDeleteTag = (index: number) => {
    setPodcast({ ...podcast, tags: podcast.tags.filter((_, i) => i !== index) });
  };

  // Filtros
  const filteredTimeline = timelineData.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || 
      (selectedCategory === 'importante' && item.importante) ||
      item.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedTimeline = filteredTimeline.reduce((acc, item) => {
    if (!acc[item.categoria]) acc[item.categoria] = [];
    acc[item.categoria].push(item);
    return acc;
  }, {} as Record<string, Timestamp[]>);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('todos');
  };

  const formatTempo = (tempo: string) => {
    const [horas, minutos] = tempo.split(':');
    return `${horas}:${minutos}`;
  };

  const handleVideoLoad = () => setVideoLoaded(true);

  return (
    <div className={`${styles.podcastsPage} ${isDarkMode ? styles.darkMode : ''}`}>
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
              Podcast CineMar
            </h1>
            <p className={styles.heroSubtitle}>
              Linha do tempo interativa da nossa participação no Cunversa
            </p>
          </div>
        </div>
      </header>

      {/* Botão flutuante de adicionar (apenas admin) */}
      {isAdmin && (
        <button
          className={styles.floatingAddBtn}
          onClick={() => setIsAddingTimestamp(true)}
          title="Adicionar momento"
        >
          <FaPlus />
        </button>
      )}

      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          
          {/* Vídeo */}
          <div className={styles.videoContainer}>
            <div className={styles.videoHeader}>
              {isEditingPodcast && isAdmin ? (
                <div className={styles.editForm}>
                  <input type="text" value={editPodcastForm.titulo} onChange={(e) => setEditPodcastForm({ ...editPodcastForm, titulo: e.target.value })} className={styles.editInput} placeholder="Título" />
                  <textarea value={editPodcastForm.descricao} onChange={(e) => setEditPodcastForm({ ...editPodcastForm, descricao: e.target.value })} className={styles.editTextarea} rows={3} placeholder="Descrição" />
                  <input type="text" value={editPodcastForm.data} onChange={(e) => setEditPodcastForm({ ...editPodcastForm, data: e.target.value })} className={styles.editInput} placeholder="Data" />
                  <input type="text" value={editPodcastForm.duracao} onChange={(e) => setEditPodcastForm({ ...editPodcastForm, duracao: e.target.value })} className={styles.editInput} placeholder="Duração" />
                  <div className={styles.editActions}>
                    <button onClick={handleSavePodcast} className={styles.saveBtn}><FaSave /> Salvar</button>
                    <button onClick={() => setIsEditingPodcast(false)} className={styles.cancelBtn}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className={styles.videoTitle}>{podcast.titulo}</h2>
                  <div className={styles.videoMeta}>
                    <div className={styles.metaItem}><FaCalendarAlt /><span>{podcast.data}</span></div>
                    <div className={styles.metaItem}><FaClock /><span>{podcast.duracao}</span></div>
                    <div className={styles.metaItem}><FaYoutube /><span>Episódio {podcast.episodio}</span></div>
                  </div>
                  {isAdmin && (
                    <button onClick={() => { setEditPodcastForm(podcast); setIsEditingPodcast(true); }} className={styles.editIconBtn}><FaEdit /> Editar</button>
                  )}
                </>
              )}
            </div>
            
            <div className={styles.youtubeContainer}>
              {!videoLoaded && (
                <div className={styles.videoLoading}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Carregando vídeo...</p>
                </div>
              )}
              <iframe
                id="youtube-video"
                className={styles.youtubeIframe}
                src={`https://www.youtube.com/embed/${podcast.videoId}?rel=0&modestbranding=1`}
                title={podcast.titulo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={handleVideoLoad}
              />
              <div className={styles.videoActions}>
                <button className={`${styles.favoritoBtn} ${favorito ? styles.favoritado : ''}`} onClick={toggleFavorito}>
                  {favorito ? <FaHeart /> : <FaRegHeart />}
                  <span>{favorito ? 'Favoritado' : 'Favoritar'}</span>
                </button>
                <button className={styles.compartilharBtn} onClick={compartilharPodcast}>
                  <FaShareAlt /><span>Compartilhar</span>
                </button>
                <a href={podcast.link} target="_blank" rel="noopener noreferrer" className={styles.youtubeLink}>
                  <FaExternalLinkAlt /><span>YouTube</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Filtros */}
          <div className={styles.timelineFilters}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input type="text" placeholder="Buscar na linha do tempo..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
              {searchQuery && <button className={styles.clearSearchBtn} onClick={() => setSearchQuery('')}><FaTimes /></button>}
            </div>
            <div className={styles.categoryFilters}>
              <div className={styles.filtersHeader}><FaFilter /><span>Filtrar por categoria:</span></div>
              <div className={styles.categoryButtons}>
                {categories.map(category => (
                  <button key={category.id} className={`${styles.categoryBtn} ${selectedCategory === category.id ? styles.active : ''}`} onClick={() => setSelectedCategory(category.id)}>
                    <span className={styles.categoryLabel}>{category.label}</span>
                    <span className={styles.categoryCount}>({category.count})</span>
                  </button>
                ))}
                {(searchQuery || selectedCategory !== 'todos') && (
                  <button className={styles.clearFiltersBtn} onClick={clearFilters}><FaTimes /><span>Limpar Filtros</span></button>
                )}
              </div>
            </div>
          </div>
          
          {/* Linha do Tempo */}
          <div className={styles.timelineContainer}>
            <div className={styles.timelineHeader}>
              <h3 className={styles.timelineTitle}>Linha do Tempo Interativa</h3>
              <div className={styles.timelineStats}>
                <span className={styles.statsItem}><strong>{filteredTimeline.length}</strong> momentos</span>
                <span className={styles.statsItem}><strong>{Object.keys(groupedTimeline).length}</strong> categorias</span>
              </div>
            </div>
            
            <div className={styles.timelineList}>
              {Object.keys(groupedTimeline).length > 0 ? (
                Object.entries(groupedTimeline).map(([category, items]) => {
                  const isExpanded = expandedCategory === category || expandedCategory === 'todos';
                  const categoryInfo = categories.find(c => c.id === category);
                  return (
                    <div key={category} className={styles.timelineCategory}>
                      <div className={`${styles.categoryHeader} ${isExpanded ? styles.expanded : ''}`} onClick={() => toggleCategory(category)}>
                        <div className={styles.categoryInfo}>
                          <h4 className={styles.categoryTitle}>{categoryInfo?.label || category}</h4>
                          <span className={styles.categorySubtitle}>{items.length} momento{items.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className={styles.categoryItems}>
                          {items.map((item) => (
                            <div key={item.id} className={`${styles.timelineItem} ${item.importante ? styles.importante : ''}`}>
                              {editingTimestampId === item.id && isAdmin ? (
                                <div className={styles.editInline}>
                                  <input type="text" value={editTimestampForm.tempo} onChange={(e) => setEditTimestampForm({ ...editTimestampForm, tempo: e.target.value })} className={styles.editInput} placeholder="Tempo" />
                                  <input type="text" value={editTimestampForm.titulo} onChange={(e) => setEditTimestampForm({ ...editTimestampForm, titulo: e.target.value })} className={styles.editInput} placeholder="Título" />
                                  <textarea value={editTimestampForm.descricao} onChange={(e) => setEditTimestampForm({ ...editTimestampForm, descricao: e.target.value })} className={styles.editTextarea} rows={2} placeholder="Descrição" />
                                  <select value={editTimestampForm.categoria} onChange={(e) => setEditTimestampForm({ ...editTimestampForm, categoria: e.target.value })} className={styles.editInput}>
                                    <option value="introducao">Introdução</option>
                                    <option value="historia">História Pessoal</option>
                                    <option value="cinemar">CineMar</option>
                                    <option value="cinema">Cinema</option>
                                    <option value="educacao">Educação</option>
                                    <option value="conclusao">Conclusão</option>
                                  </select>
                                  <label className={styles.checkboxLabel}><input type="checkbox" checked={editTimestampForm.importante} onChange={(e) => setEditTimestampForm({ ...editTimestampForm, importante: e.target.checked })} /> Importante</label>
                                  <div className={styles.editActionsInline}>
                                    <button onClick={handleSaveTimestamp} className={styles.saveBtn}><FaSave /></button>
                                    <button onClick={() => setEditingTimestampId(null)} className={styles.cancelBtn}><FaTimes /></button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className={styles.timelineMarker}><div className={styles.markerTime}>{formatTempo(item.tempo)}</div></div>
                                  <div className={styles.timelineContent}>
                                    <div className={styles.itemHeader}>
                                      <h5 className={styles.itemTitle}>{item.titulo}{item.importante && <span className={styles.importanteBadge}><FaStar /> Importante</span>}</h5>
                                      <div className={styles.itemActions}>
                                        <button className={styles.itemPlayBtn} onClick={() => pularParaTempo(item.tempo)}><FaPlay /> Assistir</button>
                                        {isAdmin && (
                                          <>
                                            <button onClick={() => handleEditTimestamp(item)} className={styles.editCardBtn}><FaEdit /></button>
                                            <button onClick={() => handleDeleteTimestamp(item.id)} className={styles.deleteCardBtn}><FaTrash /></button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <p className={styles.itemDescription}>{item.descricao}</p>
                                    <div className={styles.itemMeta}><span>{item.tempo}</span></div>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className={styles.noResults}>
                  <div className={styles.noResultsIcon}><FaSearch /></div>
                  <h4>Nenhum momento encontrado</h4>
                  <button className={styles.clearFiltersBtn} onClick={clearFilters}><FaTimes /> Limpar Filtros</button>
                </div>
              )}
            </div>
            
            <div className={styles.timelineSummary}>
              <div className={styles.summaryItem}><span className={styles.summaryLabel}>Duração total:</span><span className={styles.summaryValue}>{podcast.duracao}</span></div>
              <div className={styles.summaryItem}><span className={styles.summaryLabel}>Momentos importantes:</span><span className={styles.summaryValue}>{timelineData.filter(t => t.importante).length} de {timelineData.length}</span></div>
              <div className={styles.summaryItem}><span className={styles.summaryLabel}>Categorias:</span><span className={styles.summaryValue}>{Object.keys(groupedTimeline).length}</span></div>
            </div>
          </div>
          
          {/* Informações Complementares */}
          <div className={styles.infoContainer}>
            {/* Participantes */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <h3 className={styles.sectionTitle}>Participantes</h3>
                {isAdmin && <button onClick={() => setIsAddingParticipant(true)} className={styles.addIconBtn}><FaPlus /></button>}
              </div>
              <div className={styles.participantesList}>
                {podcast.participantes.map((participante, index) => (
                  <div key={index} className={styles.participanteItem}>
                    {editingParticipantIndex === index && isAdmin ? (
                      <div className={styles.editInline}>
                        <input type="text" value={participante} onChange={(e) => handleEditParticipant(index, e.target.value)} className={styles.editInput} />
                        <button onClick={() => setEditingParticipantIndex(null)} className={styles.cancelBtn}><FaTimes /></button>
                      </div>
                    ) : (
                      <div className={styles.participanteInfo}>
                        <span className={styles.participanteNome}>{participante}</span>
                        {isAdmin && (
                          <div className={styles.itemActionsInline}>
                            <button onClick={() => setEditingParticipantIndex(index)} className={styles.editCardBtn}><FaEdit /></button>
                            <button onClick={() => handleDeleteParticipant(index)} className={styles.deleteCardBtn}><FaTrash /></button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sobre a ACCAL */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}><h3 className={styles.sectionTitle}>Sobre a ACCAL</h3></div>
              <p className={styles.infoText}>A Academia Camocinense de Ciências, Artes e Letras (ACCAL) é uma instituição cultural dedicada à promoção e preservação do conhecimento, artes e letras em Camocim. Através do podcast <strong>Cunversa</strong>, a ACCAL proporciona um espaço para diálogos enriquecedores sobre cultura, educação e desenvolvimento comunitário.</p>
              <div className={styles.infoLinks}>
                <a href="https://www.youtube.com/@AcademiaCamocinensedeCiencia" target="_blank" rel="noopener noreferrer" className={styles.infoLink}><FaYoutube /><span>Visitar canal da ACCAL</span></a>
              </div>
            </div>
            
            {/* Localização */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}><h3 className={styles.sectionTitle}>Localização</h3></div>
              <p className={styles.infoText}>O CineMar atua em <strong>Camocim, Ceará</strong>, realizando sessões quinzenais que promovem cinema, cultura e diálogo comunitário. O projeto tem como objetivo resgatar a tradição cinematográfica da cidade e criar novos espaços de encontro.</p>
              <div className={styles.infoLinks}>
                <Link to="/eventos" className={styles.infoLink}><FaCalendarAlt /><span>Ver Próximos Eventos</span></Link>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          <div className={styles.tagsContainer}>
            <div className={styles.tagsHeader}><FaTag /><h3 className={styles.sectionTitle}>Tags</h3>{isAdmin && <button onClick={() => setIsAddingTag(true)} className={styles.addIconBtn}><FaPlus /></button>}</div>
            <div className={styles.tagsList}>
              {podcast.tags.map((tag, index) => (
                <div key={index} className={styles.tagWrapper}>
                  {editingTagIndex === index && isAdmin ? (
                    <div className={styles.editInline}>
                      <input type="text" value={tag} onChange={(e) => handleEditTag(index, e.target.value)} className={styles.editInputSmall} />
                      <button onClick={() => setEditingTagIndex(null)} className={styles.cancelBtn}><FaTimes /></button>
                    </div>
                  ) : (
                    <>
                      <span className={styles.tag}>{tag}</span>
                      {isAdmin && (
                        <div className={styles.tagActions}>
                          <button onClick={() => setEditingTagIndex(index)} className={styles.editCardBtn}><FaEdit /></button>
                          <button onClick={() => handleDeleteTag(index)} className={styles.deleteCardBtn}><FaTrash /></button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modais de adicionar */}
      {isAddingTimestamp && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Adicionar Momento</h3>
            <input type="text" placeholder="Tempo (00:00:00)" value={newTimestamp.tempo} onChange={(e) => setNewTimestamp({ ...newTimestamp, tempo: e.target.value })} className={styles.editInput} />
            <input type="text" placeholder="Título" value={newTimestamp.titulo} onChange={(e) => setNewTimestamp({ ...newTimestamp, titulo: e.target.value })} className={styles.editInput} />
            <textarea placeholder="Descrição" value={newTimestamp.descricao} onChange={(e) => setNewTimestamp({ ...newTimestamp, descricao: e.target.value })} className={styles.editTextarea} rows={3} />
            <select value={newTimestamp.categoria} onChange={(e) => setNewTimestamp({ ...newTimestamp, categoria: e.target.value })} className={styles.editInput}>
              <option value="introducao">Introdução</option>
              <option value="historia">História Pessoal</option>
              <option value="cinemar">CineMar</option>
              <option value="cinema">Cinema</option>
              <option value="educacao">Educação</option>
              <option value="conclusao">Conclusão</option>
            </select>
            <label className={styles.checkboxLabel}><input type="checkbox" checked={newTimestamp.importante} onChange={(e) => setNewTimestamp({ ...newTimestamp, importante: e.target.checked })} /> Marcar como importante</label>
            <div className={styles.editActions}>
              <button onClick={handleAddTimestamp} className={styles.saveBtn}>Adicionar</button>
              <button onClick={() => setIsAddingTimestamp(false)} className={styles.cancelBtn}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isAddingParticipant && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Adicionar Participante</h3>
            <input type="text" placeholder="Nome do participante" value={newParticipant} onChange={(e) => setNewParticipant(e.target.value)} className={styles.editInput} />
            <div className={styles.editActions}>
              <button onClick={handleAddParticipant} className={styles.saveBtn}>Adicionar</button>
              <button onClick={() => setIsAddingParticipant(false)} className={styles.cancelBtn}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isAddingTag && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Adicionar Tag</h3>
            <input type="text" placeholder="Tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} className={styles.editInput} />
            <div className={styles.editActions}>
              <button onClick={handleAddTag} className={styles.saveBtn}>Adicionar</button>
              <button onClick={() => setIsAddingTag(false)} className={styles.cancelBtn}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}