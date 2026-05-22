import { useState, useEffect } from 'react';
import {
  FaImages, FaVideo, FaFilePdf, FaDownload, FaExternalLinkAlt,
  FaCalendarAlt, FaUsers, FaFilm, FaChevronLeft, FaChevronRight,
  FaPlayCircle, FaTimes, FaSearch, FaSun, FaMoon, FaArrowLeft,
  FaPlus, FaShieldAlt, FaLink, FaTrash, FaCheck
} from 'react-icons/fa';
import styles from '../styles/Materiais.module.css';

/* ── dados ─────────────────────────────────────────────────────── */
const DEBATES = [
  { id:1,  titulo:'AINDA ESTOU AQUI',                    diretor:'Walter Carvalho',                          ano:2015, data:'05/10/2024', participantes:42,  fotos:3, videos:2, docs:2 },
  { id:2,  titulo:'BACURAU',                             diretor:'Kleber Mendonça Filho e Juliano Dornelles', ano:2019, data:'12/10/2024', participantes:56,  fotos:2, videos:1, docs:2 },
  { id:3,  titulo:'A HORA DA ESTRELA',                   diretor:'Suzana Amaral',                            ano:1985, data:'19/10/2024', participantes:48,  fotos:2, videos:1, docs:2 },
  { id:4,  titulo:'BICHO DE SETE CABEÇAS',               diretor:'Laís Bodanzky',                            ano:2000, data:'26/10/2024', participantes:39,  fotos:2, videos:1, docs:1 },
  { id:5,  titulo:'TERRA ESTRANGEIRA',                   diretor:'Walter Salles e Daniela Thomas',           ano:1995, data:'02/11/2024', participantes:41,  fotos:2, videos:1, docs:1 },
  { id:6,  titulo:'ONDE OS FRACOS NÃO TÊM VEZ',         diretor:'Joel e Ethan Coen',                        ano:2007, data:'16/11/2024', participantes:52,  fotos:2, videos:1, docs:2 },
  { id:7,  titulo:'CORRA!',                              diretor:'Jordan Peele',                             ano:2017, data:'23/11/2024', participantes:61,  fotos:2, videos:2, docs:3 },
  { id:8,  titulo:'MEDIDA PROVISÓRIA',                   diretor:'Lázaro Ramos',                             ano:2022, data:'30/11/2024', participantes:49,  fotos:2, videos:1, docs:1 },
  { id:9,  titulo:'NÓS QUE AQUI ESTAMOS POR VÓS ESPERAMOS', diretor:'Marcelo Masagão',                    ano:1999, data:'07/12/2024', participantes:35,  fotos:2, videos:1, docs:1 },
  { id:10, titulo:'O ÚLTIMO PULP',                       diretor:'Sergio Bianchi',                           ano:2002, data:'14/12/2024', participantes:38,  fotos:2, videos:1, docs:1 },
  { id:11, titulo:'O AGENTE SECRETO',                    diretor:'Kleber Mendonça Filho',                    ano:2025, data:'06/11/2025', participantes:0,   fotos:3, videos:2, docs:3 },
];

function statusDebate(data) {
  const [d, m, a] = data.split('/').map(Number);
  const dt = new Date(a, m - 1, d);
  const hoje = new Date();
  if (dt > hoje) return 'PRÓXIMO';
  if (dt.toDateString() === hoje.toDateString()) return 'HOJE';
  return 'REALIZADO';
}

/* ── modal adicionar materiais ──────────────────────────────────── */
function ModalAdicionarMateriais({ debate, onClose, onSave }) {
  const [aba, setAba] = useState('fotos');
  const [fotos, setFotos]   = useState([]);
  const [videos, setVideos] = useState([]);
  const [docs, setDocs]     = useState([]);
  const [videoUrl, setVideoUrl]     = useState('');
  const [videoTitulo, setVideoTitulo] = useState('');
  const [videoDesc, setVideoDesc]   = useState('');
  const [docTitulo, setDocTitulo]   = useState('');

  const addFotoMock = () => {
    const n = fotos.length + 1;
    setFotos(prev => [...prev, { id: Date.now(), nome: `foto_${n}.jpg` }]);
  };
  const addVideo = () => {
    if (!videoUrl.trim()) return;
    setVideos(prev => [...prev, { id: Date.now(), titulo: videoTitulo || 'Sem título', url: videoUrl }]);
    setVideoUrl(''); setVideoTitulo(''); setVideoDesc('');
  };
  const addDocMock = () => {
    const n = docs.length + 1;
    setDocs(prev => [...prev, { id: Date.now(), nome: docTitulo || `documento_${n}.pdf` }]);
    setDocTitulo('');
  };
  const remover = (tipo, id) => {
    if (tipo === 'foto')  setFotos(p  => p.filter(x => x.id !== id));
    if (tipo === 'video') setVideos(p => p.filter(x => x.id !== id));
    if (tipo === 'doc')   setDocs(p   => p.filter(x => x.id !== id));
  };

  const total = fotos.length + videos.length + docs.length;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {/* cabeçalho */}
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitulo}>Adicionar materiais</h3>
            <p className={styles.modalSubtitulo}>{debate.titulo}</p>
          </div>
          <button className={styles.modalFechar} onClick={onClose} aria-label="Fechar">
            <FaTimes />
          </button>
        </div>

        {/* abas */}
        <div className={styles.modalAbas}>
          {[
            { id:'fotos',  label:'Fotos',      icon:<FaImages />,  count: fotos.length  },
            { id:'videos', label:'Vídeos',     icon:<FaVideo />,   count: videos.length },
            { id:'docs',   label:'Documentos', icon:<FaFilePdf />, count: docs.length   },
          ].map(a => (
            <button
              key={a.id}
              className={`${styles.abaBtn} ${aba === a.id ? styles.abaAtiva : ''}`}
              onClick={() => setAba(a.id)}
            >
              {a.icon} {a.label}
              {a.count > 0 && <span className={styles.abaCount}>{a.count}</span>}
            </button>
          ))}
        </div>

        <div className={styles.modalBody}>

          {/* aba fotos */}
          {aba === 'fotos' && (
            <div className={styles.abaConteudo}>
              <div className={styles.uploadZone} onClick={addFotoMock} tabIndex={0} role="button">
                <FaImages className={styles.uploadIcon} />
                <span>Clique para selecionar fotos</span>
                <span className={styles.uploadDica}>JPG, PNG, WEBP — máx. 10 MB cada</span>
              </div>
              {fotos.length > 0 && (
                <div className={styles.itemLista}>
                  {fotos.map(f => (
                    <div key={f.id} className={styles.itemRow}>
                      <FaImages className={styles.itemIcon} />
                      <span className={styles.itemNome}>{f.nome}</span>
                      <button className={styles.removerBtn} onClick={() => remover('foto', f.id)} aria-label="Remover">
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* aba videos */}
          {aba === 'videos' && (
            <div className={styles.abaConteudo}>
              <div className={styles.campoGrupo}>
                <label className={styles.campoLabel}>URL do vídeo (YouTube / Vimeo)</label>
                <div className={styles.campoComIcone}>
                  <FaLink className={styles.campoIcone} />
                  <input
                    className={styles.campoInput}
                    type="url"
                    placeholder="https://youtube.com/embed/..."
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.campoGrupo}>
                <label className={styles.campoLabel}>Título do vídeo</label>
                <input
                  className={styles.campoInput}
                  type="text"
                  placeholder="Ex: Debate completo — 2h"
                  value={videoTitulo}
                  onChange={e => setVideoTitulo(e.target.value)}
                />
              </div>
              <div className={styles.campoGrupo}>
                <label className={styles.campoLabel}>Descrição (opcional)</label>
                <textarea
                  className={styles.campoTextarea}
                  placeholder="Breve descrição do conteúdo..."
                  value={videoDesc}
                  onChange={e => setVideoDesc(e.target.value)}
                />
              </div>
              <button className={styles.btnSecundario} onClick={addVideo}>
                <FaPlus /> Adicionar à lista
              </button>
              {videos.length > 0 && (
                <div className={styles.itemLista}>
                  {videos.map(v => (
                    <div key={v.id} className={styles.itemRow}>
                      <FaVideo className={styles.itemIcon} />
                      <span className={styles.itemNome}>{v.titulo}</span>
                      <button className={styles.removerBtn} onClick={() => remover('video', v.id)} aria-label="Remover">
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* aba docs */}
          {aba === 'docs' && (
            <div className={styles.abaConteudo}>
              <div className={styles.uploadZone} onClick={addDocMock} tabIndex={0} role="button">
                <FaFilePdf className={styles.uploadIcon} />
                <span>Clique para selecionar PDFs</span>
                <span className={styles.uploadDica}>Apenas arquivos .pdf</span>
              </div>
              <div className={styles.campoGrupo}>
                <label className={styles.campoLabel}>Título do documento</label>
                <input
                  className={styles.campoInput}
                  type="text"
                  placeholder="Ex: Apresentação completa"
                  value={docTitulo}
                  onChange={e => setDocTitulo(e.target.value)}
                />
              </div>
              {docs.length > 0 && (
                <div className={styles.itemLista}>
                  {docs.map(d => (
                    <div key={d.id} className={styles.itemRow}>
                      <FaFilePdf className={styles.itemIcon} />
                      <span className={styles.itemNome}>{d.nome}</span>
                      <button className={styles.removerBtn} onClick={() => remover('doc', d.id)} aria-label="Remover">
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* rodapé */}
        <div className={styles.modalRodape}>
          <span className={styles.modalContador}>
            {total > 0 ? `${total} item(s) a salvar` : 'Nenhum item adicionado'}
          </span>
          <div className={styles.modalAcoes}>
            <button className={styles.btnCancelar} onClick={onClose}>Cancelar</button>
            <button
              className={styles.btnSalvar}
              onClick={() => onSave(debate.id, { fotos, videos, docs })}
              disabled={total === 0}
            >
              <FaCheck /> Salvar materiais
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── componente principal ───────────────────────────────────────── */
export default function Materiais({ isAdmin = false, theme = 'light', onToggleTheme }) {
  const [busca, setBusca]             = useState('');
  const [filtroAno, setFiltroAno]     = useState('todos');
  const [modalDebate, setModalDebate] = useState(null);
  const [toast, setToast]             = useState('');

  const anosUnicos = ['todos', ...Array.from(new Set(DEBATES.map(d => d.data.split('/')[2])))];

  const debatesFiltrados = DEBATES.filter(d => {
    const q = busca.toLowerCase();
    const matchBusca = !q || d.titulo.toLowerCase().includes(q) || d.diretor.toLowerCase().includes(q);
    const matchAno   = filtroAno === 'todos' || d.data.split('/')[2] === filtroAno;
    return matchBusca && matchAno;
  });

  const mostrarToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const salvarMateriais = (debateId, dados) => {
    setModalDebate(null);
    const total = dados.fotos.length + dados.videos.length + dados.docs.length;
    mostrarToast(`${total} material(is) salvo(s) com sucesso`);
  };

  useEffect(() => () => { document.body.style.overflow = 'auto'; }, []);

  return (
    <div className={`${styles.materiaisContainer} ${theme === 'dark' ? styles.dark : ''}`}>

      {/* ── HERO HEADER — igual ao da HomePage ── */}
      <header className={styles.heroHeader}>
        <div className={styles.container}>
          <div className={styles.heroContent}>

            {/* tema toggle — só para admin */}
            {isAdmin && (
              <div className={styles.heroHeaderTop}>
                <button
                  className={styles.themeToggle}
                  onClick={onToggleTheme}
                  aria-label={theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
                >
                  {theme === 'light' ? <FaMoon /> : <FaSun />}
                  <span>{theme === 'light' ? 'Tema escuro' : 'Tema claro'}</span>
                </button>
              </div>
            )}

            <div className={styles.heroMain}>
              <h1 className={styles.heroTitle}>MATERIAIS DOS DEBATES</h1>
              <p className={styles.heroSubtitle}>
                CineMar • Fotos, vídeos e documentos de cada sessão
              </p>
            </div>

            {/* stats */}
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValor}>{DEBATES.length}</span>
                <span className={styles.heroStatLabel}>sessões</span>
              </div>
              <div className={styles.heroStatDivisor} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatValor}>{DEBATES.reduce((a, d) => a + d.fotos, 0)}</span>
                <span className={styles.heroStatLabel}>fotos</span>
              </div>
              <div className={styles.heroStatDivisor} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatValor}>{DEBATES.reduce((a, d) => a + d.videos, 0)}</span>
                <span className={styles.heroStatLabel}>vídeos</span>
              </div>
              <div className={styles.heroStatDivisor} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatValor}>{DEBATES.reduce((a, d) => a + d.docs, 0)}</span>
                <span className={styles.heroStatLabel}>documentos</span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* ── CONTEÚDO ── */}
      <main className={styles.mainContent}>
        <div className={styles.container}>

          {/* filtros */}
          <div className={styles.filtrosBar}>
            <div className={styles.buscaWrap}>
              <FaSearch className={styles.buscaIcone} />
              <input
                type="text"
                placeholder="Buscar filme ou diretor..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className={styles.buscaInput}
              />
            </div>
            <select
              className={styles.filtroSelect}
              value={filtroAno}
              onChange={e => setFiltroAno(e.target.value)}
            >
              {anosUnicos.map(a => (
                <option key={a} value={a}>{a === 'todos' ? 'Todos os anos' : `Ano ${a}`}</option>
              ))}
            </select>
          </div>

          {/* grade de debates */}
          <div className={styles.debatesGrid}>
            {debatesFiltrados.length === 0 && (
              <p className={styles.semResultados}>Nenhum debate encontrado.</p>
            )}
            {debatesFiltrados.map(debate => {
              const status = statusDebate(debate.data);
              return (
                <div key={debate.id} className={styles.debateCard}>

                  {/* cabeçalho do card */}
                  <div className={styles.cardTopo}>
                    <span className={`${styles.statusBadge} ${status === 'PRÓXIMO' ? styles.badgeProximo : styles.badgeRealizado}`}>
                      {status}
                    </span>
                    <span className={styles.cardData}>
                      <FaCalendarAlt /> {debate.data}
                    </span>
                  </div>

                  <h3 className={styles.cardTitulo}>{debate.titulo}</h3>
                  <p className={styles.cardDiretor}>
                    <FaFilm /> {debate.diretor} • {debate.ano}
                  </p>

                  {/* stats */}
                  <div className={styles.cardStats}>
                    <span className={styles.statChip}>
                      <FaUsers />
                      {debate.participantes > 0 ? `${debate.participantes} participantes` : 'Próximo debate'}
                    </span>
                    <span className={styles.statChip}><FaImages /> {debate.fotos} fotos</span>
                    <span className={styles.statChip}><FaVideo /> {debate.videos} vídeos</span>
                    <span className={styles.statChip}><FaFilePdf /> {debate.docs} docs</span>
                  </div>

                  {/* ações */}
                  <div className={styles.cardAcoes}>
                    <button className={styles.btnPrimario}>
                      <FaExternalLinkAlt /> Ver materiais
                    </button>

                    {/* botão admin — só aparece quando isAdmin */}
                    {isAdmin && (
                      <button
                        className={styles.btnAdmin}
                        onClick={() => setModalDebate(debate)}
                      >
                        <FaPlus /> Adicionar
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </main>

      {/* ── MODAL ADICIONAR MATERIAIS ── */}
      {modalDebate && (
        <ModalAdicionarMateriais
          debate={modalDebate}
          onClose={() => setModalDebate(null)}
          onSave={salvarMateriais}
        />
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={styles.toast}>
          <FaCheck /> {toast}
        </div>
      )}

    </div>
  );
}