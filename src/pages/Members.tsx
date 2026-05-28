// frontend/src/pages/Members.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers, FaGraduationCap, FaEnvelope,
  FaPhone, FaFacebook, FaInstagram,
  FaYoutube, FaLinkedin, FaStar, FaAward, FaHeart,
  FaUserGraduate, FaHandsHelping,
  FaBriefcase, FaBook,
  FaSearch, FaTimes, FaPlus,
  FaEdit, FaTrash, FaSave, FaCamera,
  FaSpinner, FaExclamationTriangle, FaCheck,
  FaEye, FaImage, FaChevronLeft,
} from 'react-icons/fa';
import styles from '../styles/Members.module.css';
import { useMembers } from '../hooks/useMembers';
import type { CreateMemberPayload, UpdateMemberPayload } from '../services/members.service';
import { useTheme } from '../components/context/ThemeContext';

// ─── URL helper ───────────────────────────────────────────────────────────────
// O backend serve os uploads em sua própria porta (ex: 3000).
// Sem o prefixo, o browser tentaria buscar em localhost:5173 (Vite) e daria 404.
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function buildMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  // Já é URL absoluta — retorna como está
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Caminho relativo: garante barra inicial e prefixa com a origin do backend
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}
// ──────────────────────────────────────────────────────────────────────────────

const TIPOS = [
  { value: 'todos',      label: 'Todos',         icon: FaUsers },
  { value: 'cofundador', label: 'Co-fundadores',  icon: FaStar },
  { value: 'estudante',  label: 'Estudantes',     icon: FaUserGraduate },
  { value: 'parceiro',   label: 'Parceiros',      icon: FaHandsHelping },
  { value: 'apoiador',   label: 'Apoiadores',     icon: FaHeart },
];

export default function Members() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [user, setUser] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [imageRefreshKey, setImageRefreshKey] = useState(0);

  const [formData, setFormData] = useState<Partial<CreateMemberPayload>>({
    nome: '',
    cargo: '',
    bio: '',
    formacao: '',
    email: '',
    telefone: '',
    responsabilidades: [],
    experiencia: [],
    redesSociais: [],
    destaque: false,
    tipo: 'apoiador',
  });

  const {
    members,
    isLoading,
    error,
    toast,
    stats,
    createMember,
    updateMember,
    removeMember,
    uploadFoto,
    setSearch,
    setTipo,
    refetch,
  } = useMembers({ limit: 100 });

  useEffect(() => {
    const stored = localStorage.getItem('cinemar_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); }
      catch (e) { console.error('Erro ao parsear usuário:', e); }
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  const membersFiltrados = useMemo(() => {
    let filtered = members;
    if (filtroTipo !== 'todos') {
      filtered = filtered.filter(m => m.tipo === filtroTipo);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(m =>
        m.nome.toLowerCase().includes(lower) ||
        m.cargo.toLowerCase().includes(lower) ||
        m.bio.toLowerCase().includes(lower)
      );
    }
    return filtered;
  }, [members, filtroTipo, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchTerm); }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, setSearch]);

  const handleTipoFilter = (tipo: string) => {
    setFiltroTipo(tipo);
    setTipo(tipo !== 'todos' ? tipo : '');
  };

  const destaques = useMemo(() => members.filter(m => m.destaque), [members]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedMember && !showForm) setSelectedMember(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedMember, showForm]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Selecione um arquivo de imagem válido.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('A imagem deve ter no máximo 5MB.'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAddMember = async () => {
    const requiredFields = {
      nome: 'Nome é obrigatório',
      cargo: 'Cargo é obrigatório',
      bio: 'Biografia é obrigatória',
      email: 'Email é obrigatório',
    };
    for (const [field, message] of Object.entries(requiredFields)) {
      if (!formData[field as keyof typeof formData]) { alert(message); return; }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email!)) { alert('Email inválido'); return; }

    const payload: CreateMemberPayload = {
      nome: formData.nome!,
      cargo: formData.cargo!,
      bio: formData.bio!,
      formacao: formData.formacao || '',
      email: formData.email!,
      telefone: formData.telefone || '',
      responsabilidades: formData.responsabilidades || [],
      experiencia: formData.experiencia || [],
      redesSociais: formData.redesSociais || [],
      destaque: formData.destaque || false,
      tipo: formData.tipo as string,
    };

    const newMember = await createMember(payload);
    if (imageFile && newMember) {
      await uploadFoto(newMember.id, imageFile);
      setImageRefreshKey(prev => prev + 1);
    }
    resetForm();
    setShowForm(false);
  };

  const handleEditMember = async () => {
    if (!selectedMember) return;
    setIsUploading(true);
    try {
      const payload: UpdateMemberPayload = {
        nome: formData.nome,
        cargo: formData.cargo,
        bio: formData.bio,
        formacao: formData.formacao,
        email: formData.email,
        telefone: formData.telefone,
        responsabilidades: formData.responsabilidades,
        experiencia: formData.experiencia,
        redesSociais: formData.redesSociais,
        destaque: formData.destaque,
        tipo: formData.tipo,
      };
      if (imageFile) {
        await uploadFoto(selectedMember.id, imageFile);
        setImageRefreshKey(prev => prev + 1);
      }
      await updateMember(selectedMember.id, payload);
      await refetch();
      resetForm();
      setShowForm(false);
      setIsEditing(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Erro ao editar membro:', error);
      alert('Erro ao salvar as alterações. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirmDelete === id) {
      setIsUploading(true);
      try {
        await removeMember(id);
        setConfirmDelete(null);
        if (selectedMember?.id === id) setSelectedMember(null);
      } finally {
        setIsUploading(false);
      }
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const openEditForm = (member: any) => {
    setFormData({
      nome: member.nome,
      cargo: member.cargo,
      bio: member.bio,
      formacao: member.formacao,
      email: member.email,
      telefone: member.telefone,
      responsabilidades: member.responsabilidades?.map((r: any) => r.texto) || [],
      experiencia: member.experiencia?.map((e: any) => e.texto) || [],
      redesSociais: member.redesSociais?.map((r: any) => ({
        plataforma: r.plataforma,
        username: r.username,
      })) || [],
      destaque: member.destaque,
      tipo: member.tipo,
    });
    // Usa a URL pública para o preview de edição
    setImagePreview(buildMediaUrl(member.foto) || '');
    setImageFile(null);
    setSelectedMember(member);
    setIsEditing(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cargo: '',
      bio: '',
      formacao: '',
      email: '',
      telefone: '',
      responsabilidades: [],
      experiencia: [],
      redesSociais: [],
      destaque: false,
      tipo: 'apoiador',
    });
    setImageFile(null);
    setImagePreview('');
    setIsEditing(false);
    setSelectedMember(null);
  };

  const handleArrayFieldChange = (field: 'responsabilidades' | 'experiencia', value: string) => {
    const array = value.split(',').map(i => i.trim()).filter(Boolean);
    setFormData({ ...formData, [field]: array });
  };

  const handleRedesSociaisChange = (index: number, field: 'plataforma' | 'username', value: string) => {
    const redes = [...(formData.redesSociais || [])];
    if (!redes[index]) redes[index] = { plataforma: '', username: '' };
    redes[index][field] = value;
    setFormData({ ...formData, redesSociais: redes });
  };

  const addRedeSocial = () =>
    setFormData({ ...formData, redesSociais: [...(formData.redesSociais || []), { plataforma: '', username: '' }] });

  const removeRedeSocial = (index: number) => {
    const redes = [...(formData.redesSociais || [])];
    redes.splice(index, 1);
    setFormData({ ...formData, redesSociais: redes });
  };

  const getTipoLabel = (tipo: string) => TIPOS.find(t => t.value === tipo)?.label ?? tipo;

  const getTipoIcon = (tipo: string) => {
    const Info = TIPOS.find(t => t.value === tipo);
    const Icon = Info?.icon ?? FaUsers;
    return <Icon aria-hidden="true" />;
  };

  const clearFilters = () => { setSearchTerm(''); setFiltroTipo('todos'); setTipo(''); };

  // Helper de src com cache-bust — usa buildMediaUrl para garantir URL absoluta
  const memberImgSrc = (foto: string | null | undefined) => {
    const url = buildMediaUrl(foto);
    if (!url) return undefined;
    return `${url}?v=${imageRefreshKey}`;
  };

  if (isLoading && members.length === 0) {
    return (
      <div className={`${styles.membersPage} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.loadingSpinner} />
          <p>Carregando membros da equipe...</p>
        </div>
      </div>
    );
  }

  if (error && members.length === 0) {
    return (
      <div className={`${styles.membersPage} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={styles.errorContainer}>
          <FaExclamationTriangle />
          <h3>Erro ao carregar membros</h3>
          <p>{error}</p>
          <button onClick={() => refetch()}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.membersPage} ${isDarkMode ? styles.darkMode : ''}`}>

      {/* Header */}
      <header className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <div className={styles.heroHeaderTop}>
            <Link to="/" className={styles.backLink}>
              <FaChevronLeft aria-hidden="true" /> Voltar para Início
            </Link>
          </div>
          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>Equipe CineMar</h1>
            <p className={styles.heroSubtitle}>
              Conheça as pessoas que tornam o CineMar possível
            </p>
            {stats && (
              <div className={styles.heroStats}>
                <span>{stats.total} membros</span>
                <span className={styles.heroStatsDivider}>•</span>
                <span>{stats.destaques} destaques</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Botão flutuante */}
      {isAdmin && (
        <button
          className={styles.floatingAddBtn}
          onClick={() => { resetForm(); setShowForm(true); }}
          title="Adicionar membro"
          aria-label="Adicionar novo membro"
        >
          <FaPlus />
        </button>
      )}

      {/* Formulário */}
      {showForm && isAdmin && (
        <div
          className={styles.formOverlay}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowForm(false); resetForm(); } }}
        >
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h3>{isEditing ? 'Editar Membro' : 'Novo Membro'}</h3>
              <button
                onClick={() => { setShowForm(false); resetForm(); }}
                className={styles.formClose}
                aria-label="Fechar formulário"
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.formBody}>
              {/* Identificação */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Identificação</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Nome <span className={styles.required}>*</span></label>
                    <input type="text" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} placeholder="Nome completo" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Cargo <span className={styles.required}>*</span></label>
                    <input type="text" value={formData.cargo} onChange={e => setFormData({ ...formData, cargo: e.target.value })} placeholder="Cargo ou função" />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Email <span className={styles.required}>*</span></label>
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@exemplo.com" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Telefone</label>
                    <input type="text" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} placeholder="(11) 99999-9999" />
                  </div>
                </div>
              </div>

              {/* Classificação */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Classificação</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Tipo <span className={styles.required}>*</span></label>
                    <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })}>
                      {TIPOS.filter(t => t.value !== 'todos').map(tipo => (
                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Destaque</label>
                    <select value={formData.destaque ? 'sim' : 'nao'} onChange={e => setFormData({ ...formData, destaque: e.target.value === 'sim' })}>
                      <option value="nao">Não</option>
                      <option value="sim">Sim</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Foto */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Foto do Perfil</h4>
                <div className={styles.imageUploadContainer}>
                  <div className={styles.imagePreviewArea}>
                    {isUploading ? (
                      <div className={styles.imageUploading}>
                        <FaSpinner className={styles.spinner} />
                        <span>Enviando...</span>
                      </div>
                    ) : imagePreview ? (
                      <div className={styles.imagePreview}>
                        <img src={imagePreview} alt="Preview" />
                      </div>
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <FaImage aria-hidden="true" />
                        <span>Sem foto</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.imageActions}>
                    <label className={styles.uploadButton} aria-disabled={isUploading}>
                      <FaCamera aria-hidden="true" />
                      {imagePreview ? 'Trocar foto' : 'Selecionar foto'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        disabled={isUploading}
                      />
                    </label>
                    {imagePreview && !isUploading && (
                      <button
                        type="button"
                        className={styles.removeImageBtn}
                        onClick={() => { setImageFile(null); setImagePreview(''); }}
                        aria-label="Remover foto"
                      >
                        <FaTrash aria-hidden="true" />
                        Remover foto
                      </button>
                    )}
                    <p className={styles.imageHint}>JPG, PNG ou WebP · máx. 5MB</p>
                  </div>
                </div>
              </div>

              {/* Biografia */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Biografia <span className={styles.required}>*</span></h4>
                <div className={styles.formGroup}>
                  <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} rows={4} placeholder="Conte um pouco sobre este membro..." />
                </div>
              </div>

              {/* Formação */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Formação</h4>
                <div className={styles.formGroup}>
                  <textarea value={formData.formacao} onChange={e => setFormData({ ...formData, formacao: e.target.value })} rows={3} placeholder="Separe múltiplas formações com | (barra vertical)" />
                  <span className={styles.fieldHint}>Exemplo: Graduação em Cinema - USP | Mestrado em Comunicação - Unicamp</span>
                </div>
              </div>

              {/* Responsabilidades e Experiência */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Responsabilidades e Experiência</h4>
                <div className={styles.formGroup}>
                  <label>Responsabilidades</label>
                  <input type="text" value={formData.responsabilidades?.join(', ')} onChange={e => handleArrayFieldChange('responsabilidades', e.target.value)} placeholder="Curadoria de filmes, Organização de eventos..." />
                  <span className={styles.fieldHint}>Separe cada item por vírgula</span>
                </div>
                <div className={styles.formGroup}>
                  <label>Experiência</label>
                  <input type="text" value={formData.experiencia?.join(', ')} onChange={e => handleArrayFieldChange('experiencia', e.target.value)} placeholder="Cineclube XYZ, Festival ABC..." />
                  <span className={styles.fieldHint}>Separe cada item por vírgula</span>
                </div>
              </div>

              {/* Redes Sociais */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Redes Sociais</h4>
                {(formData.redesSociais || []).map((rede, index) => (
                  <div key={index} className={styles.redesSociaisRow}>
                    <div className={styles.formGroup}>
                      <label>Plataforma</label>
                      <select value={rede.plataforma} onChange={e => handleRedesSociaisChange(index, 'plataforma', e.target.value)}>
                        <option value="">Selecione</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="youtube">YouTube</option>
                        <option value="linkedin">LinkedIn</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Usuário</label>
                      <input type="text" placeholder="@username" value={rede.username} onChange={e => handleRedesSociaisChange(index, 'username', e.target.value)} />
                    </div>
                    <button type="button" className={styles.removeRedeBtn} onClick={() => removeRedeSocial(index)} aria-label="Remover rede social" title="Remover">
                      <FaTimes aria-hidden="true" />
                    </button>
                  </div>
                ))}
                <button type="button" className={styles.addRedeBtn} onClick={addRedeSocial}>
                  <FaPlus aria-hidden="true" /> Adicionar rede social
                </button>
              </div>
            </div>

            <div className={styles.formFooter}>
              <button className={styles.cancelBtn} onClick={() => { setShowForm(false); resetForm(); }} disabled={isUploading}>
                Cancelar
              </button>
              <button className={styles.submitBtn} onClick={isEditing ? handleEditMember : handleAddMember} disabled={isUploading}>
                {isUploading
                  ? <><FaSpinner className={styles.spinnerInline} /> Salvando...</>
                  : <><FaSave aria-hidden="true" /> {isEditing ? 'Salvar Alterações' : 'Adicionar Membro'}</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <section className={styles.filtersSection}>
        <div className={styles.filtersContent}>
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} aria-hidden="true" />
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Buscar membro..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                aria-label="Buscar membro"
              />
              {searchTerm && (
                <button className={styles.clearSearch} onClick={() => setSearchTerm('')} aria-label="Limpar busca">
                  <FaTimes aria-hidden="true" />
                </button>
              )}
            </div>
            <span className={styles.filtersInfo}>
              {membersFiltrados.length} membro{membersFiltrados.length !== 1 ? 's' : ''} encontrado{membersFiltrados.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className={styles.tipoFilters}>
            {TIPOS.map(tipo => {
              const Icon = tipo.icon;
              return (
                <button
                  key={tipo.value}
                  className={`${styles.tipoFilterBtn} ${filtroTipo === tipo.value ? styles.active : ''}`}
                  onClick={() => handleTipoFilter(tipo.value)}
                >
                  <Icon aria-hidden="true" /> {tipo.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>

          {/* Destaques */}
          {filtroTipo === 'todos' && destaques.length > 0 && (
            <section className={styles.featuredSection}>
              <h2 className={styles.sectionTitle}>
                <FaStar className={styles.sectionIcon} aria-hidden="true" /> Co-fundadores
              </h2>
              <div className={styles.featuredGrid}>
                {destaques.map(member => (
                  <div key={member.id} className={styles.featuredCard}>
                    <div
                      className={styles.featuredCardClickable}
                      onClick={() => setSelectedMember(member)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && setSelectedMember(member)}
                    >
                      <div className={styles.featuredImage}>
                        {member.foto ? (
                          <img
                            src={memberImgSrc(member.foto)}
                            alt={member.nome}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div className={styles.featuredIconPlaceholder}>
                            {getTipoIcon(member.tipo)}
                          </div>
                        )}
                        <div className={styles.featuredTag}>
                          <FaAward aria-hidden="true" /> Destaque
                        </div>
                      </div>
                      <div className={styles.featuredContent}>
                        <h3 className={styles.featuredName}>{member.nome}</h3>
                        <p className={styles.featuredRole}>{member.cargo}</p>
                        <p className={styles.featuredBio}>{member.bio.substring(0, 100)}...</p>
                        <div className={styles.featuredButton}>Ver perfil completo →</div>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className={styles.cardAdminActions}>
                        <button className={styles.cardEditBtn} onClick={() => openEditForm(member)} title="Editar membro" aria-label="Editar membro">
                          <FaEdit aria-hidden="true" />
                        </button>
                        <button
                          className={`${styles.cardDeleteBtn} ${confirmDelete === member.id ? styles.cardDeleteBtnConfirm : ''}`}
                          onClick={() => handleDeleteMember(member.id)}
                          title={confirmDelete === member.id ? 'Clique novamente para confirmar' : 'Excluir membro'}
                          disabled={isUploading}
                        >
                          <FaTrash aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Lista de Membros */}
          <section className={styles.membersSection}>
            <h2 className={styles.sectionTitle}>
              <FaUsers className={styles.sectionIcon} aria-hidden="true" />
              {filtroTipo === 'todos' ? 'Membros' : getTipoLabel(filtroTipo)}
              <span className={styles.membersCount}>({membersFiltrados.length})</span>
            </h2>

            {membersFiltrados.length === 0 ? (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}><FaUsers aria-hidden="true" /></div>
                <h3>Nenhum membro encontrado</h3>
                <p>{searchTerm ? `Sem resultados para "${searchTerm}"` : 'Nenhum membro nesta categoria.'}</p>
                <button className={styles.clearFiltersBtn} onClick={clearFilters}>Limpar filtros</button>
              </div>
            ) : (
              <div className={styles.membersGrid}>
                {membersFiltrados
                  .filter(m => !m.destaque || filtroTipo !== 'todos')
                  .map(member => (
                    <div key={member.id} className={`${styles.memberCard} ${styles[member.tipo]}`}>
                      <div
                        className={styles.memberCardClickable}
                        onClick={() => setSelectedMember(member)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && setSelectedMember(member)}
                      >
                        <div className={styles.memberCardHeader}>
                          <div className={styles.memberImage}>
                            {member.foto ? (
                              <img
                                src={memberImgSrc(member.foto)}
                                alt={member.nome}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : (
                              <div className={styles.memberIcon}>{getTipoIcon(member.tipo)}</div>
                            )}
                          </div>
                          <div className={styles.memberHeaderInfo}>
                            <h3 className={styles.memberName}>{member.nome}</h3>
                            <p className={styles.memberRole}>{member.cargo}</p>
                          </div>
                          <div className={styles.memberTipoTag}>
                            {getTipoIcon(member.tipo)} {getTipoLabel(member.tipo)}
                          </div>
                        </div>

                        <div className={styles.memberCardContent}>
                          <p className={styles.memberBio}>{member.bio.substring(0, 80)}...</p>
                          <div className={styles.memberDetails}>
                            {member.email && (
                              <div className={styles.detailItem}>
                                <FaEnvelope className={styles.detailIcon} aria-hidden="true" />
                                <span className={styles.detailText}>{member.email}</span>
                              </div>
                            )}
                            {member.formacao && (
                              <div className={styles.detailItem}>
                                <FaGraduationCap className={styles.detailIcon} aria-hidden="true" />
                                <span className={styles.detailText}>{member.formacao.split('|')[0].trim()}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={styles.memberCardFooter}>
                          <div className={styles.memberButton}>
                            <FaEye className={styles.buttonIcon} aria-hidden="true" />
                            Ver detalhes
                          </div>
                        </div>
                      </div>

                      {isAdmin && (
                        <div className={styles.cardAdminActions}>
                          <button className={styles.cardEditBtn} onClick={() => openEditForm(member)} title="Editar membro" aria-label="Editar membro">
                            <FaEdit aria-hidden="true" />
                          </button>
                          <button
                            className={`${styles.cardDeleteBtn} ${confirmDelete === member.id ? styles.cardDeleteBtnConfirm : ''}`}
                            onClick={() => handleDeleteMember(member.id)}
                            title={confirmDelete === member.id ? 'Clique novamente para confirmar' : 'Excluir membro'}
                            disabled={isUploading}
                          >
                            <FaTrash aria-hidden="true" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal de Detalhes */}
      {selectedMember && !showForm && (
        <div className={styles.modalOverlay} onClick={() => setSelectedMember(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Perfil de ${selectedMember.nome}`}>
            <button className={styles.closeModal} onClick={() => setSelectedMember(null)} aria-label="Fechar">
              <FaTimes aria-hidden="true" />
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalImage}>
                {selectedMember.foto ? (
                  <img src={memberImgSrc(selectedMember.foto)} alt={selectedMember.nome} />
                ) : (
                  <div className={styles.modalImagePlaceholder}>{getTipoIcon(selectedMember.tipo)}</div>
                )}
              </div>
              <div className={styles.modalTitle}>
                <div className={styles.modalTipoTag}>
                  {getTipoIcon(selectedMember.tipo)} {getTipoLabel(selectedMember.tipo)}
                </div>
                <h2>{selectedMember.nome}</h2>
                <p className={styles.modalRole}>{selectedMember.cargo}</p>
              </div>
              {isAdmin && (
                <div className={styles.modalAdminActions}>
                  <button className={styles.modalEditBtn} onClick={() => { setSelectedMember(null); openEditForm(selectedMember); }} title="Editar membro" aria-label="Editar membro">
                    <FaEdit aria-hidden="true" />
                  </button>
                  <button className={styles.modalDeleteBtn} onClick={() => handleDeleteMember(selectedMember.id)} title="Excluir membro" aria-label="Excluir membro">
                    <FaTrash aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <h3><FaBook aria-hidden="true" /> Sobre</h3>
                <p className={styles.modalBio}>{selectedMember.bio}</p>
              </div>

              {selectedMember.formacao && (
                <div className={styles.modalSection}>
                  <h3><FaGraduationCap aria-hidden="true" /> Formação</h3>
                  <div className={styles.formacaoList}>
                    {selectedMember.formacao.split('|').map((item: string, i: number) => (
                      <div key={i} className={styles.formacaoItem}>
                        <FaBook aria-hidden="true" />
                        <span>{item.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMember.experiencia?.length > 0 && (
                <div className={styles.modalSection}>
                  <h3><FaBriefcase aria-hidden="true" /> Experiência</h3>
                  <div className={styles.experienciaList}>
                    {selectedMember.experiencia.map((exp: any, i: number) => (
                      <div key={i} className={styles.experienciaItem}>
                        <FaBriefcase aria-hidden="true" />
                        <span>{exp.texto || exp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMember.responsabilidades?.length > 0 && (
                <div className={styles.modalSection}>
                  <h3><FaHeart aria-hidden="true" /> Responsabilidades</h3>
                  <div className={styles.responsibilitiesList}>
                    {selectedMember.responsabilidades.map((resp: any, i: number) => (
                      <div key={i} className={styles.responsibilityItem}>
                        <FaHeart aria-hidden="true" />
                        <span>{resp.texto || resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.modalGrid}>
                <div>
                  <h3>Contato</h3>
                  {selectedMember.email && (
                    <div className={styles.contactItem}><FaEnvelope aria-hidden="true" /> {selectedMember.email}</div>
                  )}
                  {selectedMember.telefone && (
                    <div className={styles.contactItem}><FaPhone aria-hidden="true" /> {selectedMember.telefone}</div>
                  )}
                </div>
                {selectedMember.redesSociais?.length > 0 && (
                  <div>
                    <h3>Redes Sociais</h3>
                    <div className={styles.socialLinks}>
                      {selectedMember.redesSociais.map((rede: any, i: number) => {
                        const icons: Record<string, any> = {
                          facebook: FaFacebook,
                          instagram: FaInstagram,
                          youtube: FaYoutube,
                          linkedin: FaLinkedin,
                        };
                        const Icon = icons[rede.plataforma] ?? FaUsers;
                        return (
                          <a key={i} href={`https://${rede.plataforma}.com/${rede.username}`} target="_blank" rel="noopener noreferrer" title={`${rede.plataforma}: ${rede.username}`} aria-label={`${rede.plataforma}: ${rede.username}`}>
                            <Icon aria-hidden="true" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.modalCloseBtn} onClick={() => setSelectedMember(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`} role="alert" aria-live="polite">
          {toast.type === 'success' && <FaCheck aria-hidden="true" />}
          {toast.type === 'error'   && <FaExclamationTriangle aria-hidden="true" />}
          {toast.type === 'warn'    && <FaExclamationTriangle aria-hidden="true" />}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}