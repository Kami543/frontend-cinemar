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
} from 'react-icons/fa';
import styles from '../styles/Members.module.css';
import { useMembers } from '../hooks/useMembers';
import type { CreateMemberPayload, UpdateMemberPayload } from '../services/members.service';
import { useTheme } from '../components/context/ThemeContext';

// Tipos de membros
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

  // Estados locais
  const [user, setUser] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Formulário
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

  // Hook de membros
  const {
    members,
    isLoading,
    error,
    toast,
    stats,
    createMember,
    updateMember,
    removeMember,
    setSearch,
    setTipo,
    refetch,
  } = useMembers({ limit: 100 });

  // Usuário logado
  useEffect(() => {
    const stored = localStorage.getItem('cinemar_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); }
      catch (e) { console.error('Erro ao parsear usuário:', e); }
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  // Filtros locais
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

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchTerm); }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, setSearch]);

  const handleTipoFilter = (tipo: string) => {
    setFiltroTipo(tipo);
    setTipo(tipo !== 'todos' ? tipo : '');
  };

  const destaques = useMemo(() => members.filter(m => m.destaque), [members]);

  // Imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { 
      alert('Selecione um arquivo de imagem válido.'); 
      return; 
    }
    if (file.size > 5 * 1024 * 1024) { 
      alert('A imagem deve ter no máximo 5MB.'); 
      return; 
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadFoto = async (memberId: string, file: File) => {
    const formData = new FormData();
    formData.append('foto', file);
    
    try {
      const response = await fetch(`/api/v1/members/${memberId}/foto`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('cinemar_token')}`,
        },
        body: formData,
      });
      
      if (!response.ok) throw new Error('Erro ao fazer upload da foto');
      
      const updatedMember = await response.json();
      return updatedMember;
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  };

  // CRUD
  const handleAddMember = async () => {
    if (!formData.nome || !formData.cargo || !formData.bio || !formData.email) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

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
      await refetch();
    }

    resetForm();
    setShowForm(false);
  };

  const handleEditMember = async () => {
    if (!selectedMember) return;

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

    await updateMember(selectedMember.id, payload);
    if (imageFile) {
      await uploadFoto(selectedMember.id, imageFile);
      await refetch();
    }

    resetForm();
    setShowForm(false);
    setIsEditing(false);
    setSelectedMember(null);
  };

  const handleDeleteMember = async (id: string) => {
    if (confirmDelete === id) {
      await removeMember(id);
      setConfirmDelete(null);
      if (selectedMember?.id === id) setSelectedMember(null);
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
    setImagePreview(member.foto || '');
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

  // Helpers de formulário
  const handleArrayFieldChange = (
    field: 'responsabilidades' | 'experiencia',
    value: string,
  ) => {
    const array = value.split(',').map(i => i.trim()).filter(Boolean);
    setFormData({ ...formData, [field]: array });
  };

  const handleRedesSociaisChange = (
    index: number,
    field: 'plataforma' | 'username',
    value: string,
  ) => {
    const redes = [...(formData.redesSociais || [])];
    if (!redes[index]) redes[index] = { plataforma: '', username: '' };
    redes[index][field] = value;
    setFormData({ ...formData, redesSociais: redes });
  };

  const addRedeSocial = () =>
    setFormData({
      ...formData,
      redesSociais: [...(formData.redesSociais || []), { plataforma: '', username: '' }],
    });

  const removeRedeSocial = (index: number) => {
    const redes = [...(formData.redesSociais || [])];
    redes.splice(index, 1);
    setFormData({ ...formData, redesSociais: redes });
  };

  // Helpers de UI
  const getTipoLabel = (tipo: string) =>
    TIPOS.find(t => t.value === tipo)?.label ?? tipo;

  const getTipoIcon = (tipo: string) => {
    const Info = TIPOS.find(t => t.value === tipo);
    const Icon = Info?.icon ?? FaUsers;
    return <Icon aria-hidden="true" />;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFiltroTipo('todos');
    setTipo('');
  };

  // Loading
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

  // Error
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
            <Link to="/" className={styles.backLink}>← Voltar para Início</Link>
          </div>
          <div className={styles.heroMain}>
            <h1 className={styles.heroTitle}>Equipe CineMar</h1>
            <p className={styles.heroSubtitle}>
              Conheça as pessoas que tornam o CineMar possível
            </p>
            {stats && (
              <div className={styles.heroStats}>
                <span>{stats.total} membros</span>
                <span>•</span>
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
        >
          <FaPlus />
        </button>
      )}

      {/* Formulário */}
      {showForm && isAdmin && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h3>{isEditing ? 'Editar Membro' : 'Novo Membro'}</h3>
              <button
                onClick={() => { setShowForm(false); resetForm(); }}
                className={styles.formClose}
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
                    <label>Nome *</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={e => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Cargo *</label>
                    <input
                      type="text"
                      value={formData.cargo}
                      onChange={e => setFormData({ ...formData, cargo: e.target.value })}
                      placeholder="Cargo ou função"
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Telefone</label>
                    <input
                      type="text"
                      value={formData.telefone}
                      onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </div>

              {/* Classificação */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Classificação</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Tipo *</label>
                    <select
                      value={formData.tipo}
                      onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                    >
                      {TIPOS.filter(t => t.value !== 'todos').map(tipo => (
                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Destaque</label>
                    <select
                      value={formData.destaque ? 'sim' : 'nao'}
                      onChange={e => setFormData({ ...formData, destaque: e.target.value === 'sim' })}
                    >
                      <option value="nao">Não</option>
                      <option value="sim">Sim</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Foto */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Foto</h4>
                <div className={styles.imageUploadContainer}>
                  {imagePreview ? (
                    <div className={styles.imagePreview}>
                      <img src={imagePreview} alt="Preview" />
                      <button
                        type="button"
                        className={styles.removeImageBtn}
                        onClick={() => { setImageFile(null); setImagePreview(''); }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <FaUserGraduate />
                      <span>Sem foto</span>
                    </div>
                  )}
                  <label className={styles.uploadButton}>
                    <FaCamera />
                    {imagePreview ? 'Trocar foto' : 'Adicionar foto'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* Biografia */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Biografia *</h4>
                <div className={styles.formGroup}>
                  <textarea
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    placeholder="Conte um pouco sobre este membro..."
                  />
                </div>
              </div>

              {/* Formação */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Formação</h4>
                <div className={styles.formGroup}>
                  <textarea
                    value={formData.formacao}
                    onChange={e => setFormData({ ...formData, formacao: e.target.value })}
                    rows={3}
                    placeholder="Separe múltiplas formações com | (barra vertical)"
                  />
                  <small>Exemplo: Graduação em Cinema - USP | Mestrado em Comunicação - Unicamp</small>
                </div>
              </div>

              {/* Responsabilidades e Experiência */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Responsabilidades e Experiência</h4>
                <div className={styles.formGroup}>
                  <label>Responsabilidades (separar por vírgula)</label>
                  <input
                    type="text"
                    value={formData.responsabilidades?.join(', ')}
                    onChange={e => handleArrayFieldChange('responsabilidades', e.target.value)}
                    placeholder="Curadoria de filmes, Organização de eventos..."
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.mt2}`}>
                  <label>Experiência (separar por vírgula)</label>
                  <input
                    type="text"
                    value={formData.experiencia?.join(', ')}
                    onChange={e => handleArrayFieldChange('experiencia', e.target.value)}
                    placeholder="Cineclube XYZ, Festival ABC..."
                  />
                </div>
              </div>

              {/* Redes Sociais */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Redes Sociais</h4>
                {(formData.redesSociais || []).map((rede, index) => (
                  <div key={index} className={`${styles.formRow} ${styles.mt2}`}>
                    <div className={styles.formGroup}>
                      <select
                        value={rede.plataforma}
                        onChange={e => handleRedesSociaisChange(index, 'plataforma', e.target.value)}
                      >
                        <option value="">Selecione</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="youtube">YouTube</option>
                        <option value="linkedin">LinkedIn</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <input
                        type="text"
                        placeholder="Username ou @"
                        value={rede.username}
                        onChange={e => handleRedesSociaisChange(index, 'username', e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className={styles.removeRedeBtn}
                      onClick={() => removeRedeSocial(index)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className={styles.addRedeBtn}
                  onClick={addRedeSocial}
                >
                  <FaPlus /> Adicionar rede social
                </button>
              </div>
            </div>

            <div className={styles.formFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => { setShowForm(false); resetForm(); }}
              >
                Cancelar
              </button>
              <button
                className={styles.submitBtn}
                onClick={isEditing ? handleEditMember : handleAddMember}
              >
                <FaSave /> {isEditing ? 'Salvar Alterações' : 'Adicionar Membro'}
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
              <FaSearch className={styles.searchIcon} />
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Buscar membro..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className={styles.clearSearch} onClick={() => setSearchTerm('')}>
                  <FaTimes />
                </button>
              )}
            </div>
            <div className={styles.filtersInfo}>
              <span>{membersFiltrados.length} membro(s) encontrado(s)</span>
            </div>
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
                <FaStar className={styles.sectionIcon} /> Co-fundadores
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
                        {member.foto
                          ? <img src={member.foto} alt={member.nome} />
                          : <div className={styles.featuredIcon}>{getTipoIcon(member.tipo)}</div>
                        }
                        <div className={styles.featuredTag}><FaAward /> Destaque</div>
                      </div>
                      <div className={styles.featuredContent}>
                        <h3 className={styles.featuredName}>{member.nome}</h3>
                        <p className={styles.featuredRole}>{member.cargo}</p>
                        <p className={styles.featuredBio}>
                          {member.bio.substring(0, 100)}...
                        </p>
                        <div className={styles.featuredButton}>
                          Ver perfil completo →
                        </div>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className={styles.cardAdminActions}>
                        <button
                          className={styles.cardEditBtn}
                          onClick={() => openEditForm(member)}
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className={styles.cardDeleteBtn}
                          onClick={() => handleDeleteMember(member.id)}
                          title={confirmDelete === member.id ? 'Confirmar exclusão?' : 'Excluir'}
                        >
                          {confirmDelete === member.id ? <FaTimes /> : <FaTrash />}
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
              <FaUsers className={styles.sectionIcon} />
              {filtroTipo === 'todos' ? 'Membros' : getTipoLabel(filtroTipo)}
              <span className={styles.membersCount}>({membersFiltrados.length})</span>
            </h2>

            {membersFiltrados.length === 0 ? (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}><FaUsers /></div>
                <h3>Nenhum membro encontrado</h3>
                <p>
                  {searchTerm
                    ? `Sem resultados para "${searchTerm}"`
                    : 'Nenhum membro nesta categoria.'}
                </p>
                <button className={styles.clearFiltersBtn} onClick={clearFilters}>
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className={styles.membersGrid}>
                {membersFiltrados
                  .filter(m => !m.destaque || filtroTipo !== 'todos')
                  .map(member => (
                    <div
                      key={member.id}
                      className={`${styles.memberCard} ${styles[member.tipo]}`}
                    >
                      <div
                        className={styles.memberCardClickable}
                        onClick={() => setSelectedMember(member)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && setSelectedMember(member)}
                      >
                        <div className={styles.memberCardHeader}>
                          <div className={styles.memberImage}>
                            {member.foto
                              ? <img src={member.foto} alt={member.nome} />
                              : <div className={styles.memberIcon}>{getTipoIcon(member.tipo)}</div>
                            }
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
                          <p className={styles.memberBio}>
                            {member.bio.substring(0, 80)}...
                          </p>
                          <div className={styles.memberDetails}>
                            {member.email && (
                              <div className={styles.detailItem}>
                                <FaEnvelope className={styles.detailIcon} />
                                <span className={styles.detailText}>{member.email}</span>
                              </div>
                            )}
                            {member.formacao && (
                              <div className={styles.detailItem}>
                                <FaGraduationCap className={styles.detailIcon} />
                                <span className={styles.detailText}>
                                  {member.formacao.split('|')[0].trim()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={styles.memberCardFooter}>
                          <div className={styles.memberButton}>
                            <span className={styles.buttonIcon}>👁</span>
                            Ver detalhes
                          </div>
                        </div>
                      </div>

                      {isAdmin && (
                        <div className={styles.cardAdminActions}>
                          <button
                            className={styles.cardEditBtn}
                            onClick={() => openEditForm(member)}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className={styles.cardDeleteBtn}
                            onClick={() => handleDeleteMember(member.id)}
                            title={confirmDelete === member.id ? 'Confirmar?' : 'Excluir'}
                          >
                            {confirmDelete === member.id ? <FaTimes /> : <FaTrash />}
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
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedMember(null)}
        >
          <div
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            <button
              className={styles.closeModal}
              onClick={() => setSelectedMember(null)}
            >
              <FaTimes />
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalImage}>
                {selectedMember.foto
                  ? <img src={selectedMember.foto} alt={selectedMember.nome} />
                  : <div className={styles.modalImagePlaceholder}>
                      {getTipoIcon(selectedMember.tipo)}
                    </div>
                }
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
                  <button
                    className={styles.modalEditBtn}
                    onClick={() => { setSelectedMember(null); openEditForm(selectedMember); }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className={styles.modalDeleteBtn}
                    onClick={() => handleDeleteMember(selectedMember.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <h3><FaBook /> Sobre</h3>
                <p className={styles.modalBio}>{selectedMember.bio}</p>
              </div>

              {selectedMember.formacao && (
                <div className={styles.modalSection}>
                  <h3><FaGraduationCap /> Formação</h3>
                  <div className={styles.formacaoList}>
                    {selectedMember.formacao.split('|').map((item: string, i: number) => (
                      <div key={i} className={styles.formacaoItem}>
                        <FaBook />
                        <span>{item.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMember.experiencia?.length > 0 && (
                <div className={styles.modalSection}>
                  <h3><FaBriefcase /> Experiência</h3>
                  <div className={styles.experienciaList}>
                    {selectedMember.experiencia.map((exp: any, i: number) => (
                      <div key={i} className={styles.experienciaItem}>
                        <FaBriefcase />
                        <span>{exp.texto || exp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMember.responsabilidades?.length > 0 && (
                <div className={styles.modalSection}>
                  <h3><FaHeart /> Responsabilidades</h3>
                  <div className={styles.responsibilitiesList}>
                    {selectedMember.responsabilidades.map((resp: any, i: number) => (
                      <div key={i} className={styles.responsibilityItem}>
                        <FaHeart />
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
                    <div className={styles.contactItem}>
                      <FaEnvelope /> {selectedMember.email}
                    </div>
                  )}
                  {selectedMember.telefone && (
                    <div className={styles.contactItem}>
                      <FaPhone /> {selectedMember.telefone}
                    </div>
                  )}
                </div>
                {selectedMember.redesSociais?.length > 0 && (
                  <div>
                    <h3>Redes Sociais</h3>
                    <div className={styles.socialLinks}>
                      {selectedMember.redesSociais.map((rede: any, i: number) => {
                        const icons: Record<string, any> = {
                          facebook:  FaFacebook,
                          instagram: FaInstagram,
                          youtube:   FaYoutube,
                          linkedin:  FaLinkedin,
                        };
                        const Icon = icons[rede.plataforma] ?? FaUsers;
                        return (
                          <a
                            key={i}
                            href={`https://${rede.plataforma}.com/${rede.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`${rede.plataforma}: ${rede.username}`}
                          >
                            <Icon />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setSelectedMember(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>
          {toast.type === 'success' && <FaCheck />}
          {toast.type === 'error'   && <FaExclamationTriangle />}
          {toast.type === 'warn'    && <FaExclamationTriangle />}
          <span>{toast.msg}</span>
        </div>
      )}

    </div>
  );
}