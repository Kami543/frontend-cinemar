import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowLeft, FaUsers, FaFilm, FaGraduationCap, FaEnvelope,
  FaPhone, FaCalendarAlt, FaFacebook, FaInstagram,
  FaYoutube, FaLinkedin, FaUniversity, FaStar, FaAward, FaHeart,
  FaLightbulb, FaFish, FaSchool, FaUserGraduate, FaHandsHelping,
  FaBriefcase, FaMapMarkerAlt, FaGlobeAmericas, FaBook,
  FaChalkboardTeacher, FaSearch, FaTimes, FaFilter, FaPlus,
  FaEdit, FaTrash, FaSave, FaCamera
} from 'react-icons/fa';
import styles from '../styles/Members.module.css';
import Renato from '../images/prof-renato.jpeg';

interface Member {
  id: number;
  nome: string;
  cargo: string;
  bio: string;
  formacao: string;
  email: string;
  telefone: string;
  responsabilidades: string[];
  foto?: string;
  redesSociais: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  destaque: boolean;
  tipo: 'cofundador' | 'estudante' | 'parceiro' | 'apoiador';
  experiencia?: string[];
}

export default function Members() {
  // ===== ESTADOS =====
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [membersData, setMembersData] = useState<Member[]>([]);
  
  // Estado para imagem
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Estado do formulário
  const [formData, setFormData] = useState<Partial<Member>>({
    nome: '',
    cargo: '',
    bio: '',
    formacao: '',
    email: '',
    telefone: '',
    responsabilidades: [],
    redesSociais: {},
    destaque: false,
    tipo: 'apoiador',
    experiencia: []
  });

  const previousFocusRef = useRef<HTMLElement | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Dados iniciais dos membros
  const membersDataInicial: Member[] = [
    {
      id: 1,
      nome: 'Prof. Renato Kleibson da Silva',
      cargo: 'Co-fundador e Coordenador Geral',
      bio: 'Professor de sociologia com experiência em educação popular e projetos culturais. Doutor em Ciências Sociais pela UFRN, foi pesquisador visitante na UCLA e professor substituto na UFRN. Natural de São Paulo, participou ativamente da redemocratização brasileira. Idealizador e coordenador principal do CineMar.',
      formacao: 'Doutorado em Ciências Sociais (UFRN) | Mestrado em Ciências Sociais (UFRN) | Graduação em Ciências Sociais (UFPE)',
      email: 'renato.cinemar@gmail.com',
      telefone: '(88) 99999-9999',
      experiencia: [
        'Pesquisador Visitante na UCLA (Universidade da Califórnia, Los Angeles)',
        'Professor Substituto - Departamento de Ciências Sociais UFRN',
        'Professor da Seduc Ceará'
      ],
      responsabilidades: ['Coordenação geral do projeto', 'Seleção de filmes e curadoria', 'Mediação dos debates', 'Formação de voluntários', 'Articulação comunitária', 'Planejamento estratégico'],
      foto: Renato,
      redesSociais: { facebook: 'renato.cinemar', instagram: '@prof.renato.cinemar', linkedin: 'renato-kleibson-da-silva' },
      destaque: true, 
      tipo: 'cofundador'
    },
    {
      id: 2,
      nome: 'Prof. Luiz Seixas',
      cargo: 'Co-fundador e Coordenador Educacional',
      bio: 'Professor apaixonado por cinema e educação. Doutor em Educação com experiência em projetos pedagógicos inovadores. Responsável pela dimensão pedagógica do projeto.',
      formacao: 'Doutorado em Educação | Mestrado em Educação | Licenciatura em Pedagogia',
      email: 'luiz.cinemar@gmail.com', 
      telefone: '(88) 99999-8888',
      responsabilidades: ['Planejamento pedagógico das sessões', 'Material didático e roteiros de debate', 'Capacitação de mediadores', 'Avaliação do impacto educacional', 'Desenvolvimento de metodologias'],
      experiencia: ['Professor de Educação Básica - 10 anos', 'Coordenador Pedagógico em projetos culturais', 'Palestrante em eventos educacionais'],
      redesSociais: { instagram: '@prof.luiz.cinemar', linkedin: 'professor-luiz-cinemar' },
      destaque: true, 
      tipo: 'cofundador'
    },
    {
      id: 3, 
      nome: 'Prof. Marcelo Lima', 
      cargo: 'Co-fundador Inicial',
      bio: 'Professor de História e um dos idealizadores iniciais do CineMar. Com experiência em educação popular, contribuiu para a concepção do projeto como espaço de fomento cultural em Camocim.',
      formacao: 'Licenciatura em História | Especialização em História do Brasil',
      email: 'marcelo.cinemar@gmail.com', 
      telefone: '(88) 99999-7777',
      responsabilidades: ['Concepção inicial do projeto', 'Pesquisa histórica para curadoria', 'Mediação de debates históricos', 'Articulação com instituições culturais', 'Contextualização histórica dos filmes'],
      experiencia: ['Professor de História - 8 anos', 'Pesquisador em História Regional', 'Mediador em cineclubes escolares'],
      redesSociais: { instagram: '@marcelo.cinemar.historia' },
      destaque: false, 
      tipo: 'cofundador'
    },
    {
      id: 4, 
      nome: 'Daniela Lopes', 
      cargo: 'Estudante e Nomeadora',
      bio: 'Estudante do Ensino Médio que propôs o nome "CineMar" durante as discussões iniciais. Ativa participante das sessões e organização do projeto, representa o engajamento juvenil.',
      formacao: 'Estudante do Ensino Médio - EEM Camocim',
      email: 'daniela.cinemar@gmail.com', 
      telefone: '(88) 99999-6666',
      responsabilidades: ['Sugestão do nome do projeto', 'Apoio na organização das sessões', 'Divulgação nas redes estudantis', 'Participação ativa nas sessões', 'Ponte entre escola e projeto'],
      experiencia: ['Liderança estudantil', 'Participação em grêmio escolar', 'Voluntária em eventos culturais'],
      redesSociais: { instagram: '@dani.cinemar.student' },
      destaque: false, 
      tipo: 'estudante'
    },
    {
      id: 5, 
      nome: 'Victor Kelves', 
      cargo: 'Estudante Participante',
      bio: 'Estudante ativo nas reuniões iniciais que definiram a viabilidade do projeto. Apoia na logística e engajamento de outros estudantes, sendo importante voz juvenil.',
      formacao: 'Estudante do Ensino Médio - IFCE Camocim',
      email: 'victor.cinemar@gmail.com', 
      telefone: '(88) 99999-5555',
      responsabilidades: ['Participação nas reuniões decisórias', 'Apoio logístico nas sessões', 'Engajamento de outros estudantes', 'Feedback sobre programação', 'Suporte técnico'],
      experiencia: ['Monitor de informática', 'Participante de projetos escolares', 'Conhecimento em audiovisual'],
      redesSociais: { instagram: '@victor.cinemar.k' },
      destaque: false, 
      tipo: 'estudante'
    },
    {
      id: 6, 
      nome: 'Prof. Cassiano Ricardo', 
      cargo: 'Parceiro Institucional (IFCE)',
      bio: 'Professor do Instituto Federal do Ceará - campus Camocim. Trabalha para estabelecer o CineMar como projeto de extensão do IFCE, contribuindo com expertise acadêmica.',
      formacao: 'Mestrado em Educação | Professor do IFCE Camocim',
      email: 'cassiano.cinemar@gmail.com', 
      telefone: '(88) 99999-4444',
      responsabilidades: ['Articulação institucional com IFCE', 'Busca de financiamento como projeto de extensão', 'Integração acadêmica', 'Documentação institucional', 'Coordenação de extensão'],
      experiencia: ['Professor do IFCE - 5 anos', 'Coordenador de projetos de extensão', 'Pesquisador em educação profissional'],
      redesSociais: { linkedin: 'cassiano-ricardo-ifce' },
      destaque: false, 
      tipo: 'parceiro'
    },
    {
      id: 7, 
      nome: 'Prof. Santhiago Pontes', 
      cargo: 'Parceiro Cultural (ACCAL)',
      bio: 'Presidente da Academia Camocinense de Ciências, Artes e Letras (ACCAL). Cedeu gentilmente o espaço da Academia para sessões do CineMar, fortalecendo os laços culturais.',
      formacao: 'Presidente da ACCAL | Especialista em Cultura Regional',
      email: 'santhiago.accal@gmail.com', 
      telefone: '(88) 99999-3333',
      responsabilidades: ['Cedência do espaço da ACCAL', 'Articulação cultural local', 'Promoção das sessões especiais', 'Integração com a comunidade acadêmica', 'Mediação cultural'],
      experiencia: ['Presidente da ACCAL - 3 anos', 'Gestor cultural', 'Promotor de eventos artísticos'],
      redesSociais: { instagram: '@santhiago.accal' },
      destaque: false, 
      tipo: 'parceiro'
    },
    {
      id: 8, 
      nome: 'Sr. Manoel Silva', 
      cargo: 'Apoiador - Sindicato dos Pescadores',
      bio: 'Presidente do Sindicato dos Pescadores e Pescadoras de Camocim. Acolheu a proposta e cedeu o auditório do sindicato para as sessões quinzenais, demonstrando compromisso com a comunidade.',
      formacao: 'Presidente do Sindicato dos Pescadores | Liderança Comunitária',
      email: 'sindicato.pescadores@gmail.com', 
      telefone: '(88) 99999-2222',
      responsabilidades: ['Cedência do espaço do sindicato', 'Apoio logístico às sessões', 'Articulação com a comunidade pesqueira', 'Promoção entre os associados', 'Representação comunitária'],
      experiencia: ['Presidente do Sindicato - 8 anos', 'Liderança comunitária', 'Mediação de conflitos trabalhistas'],
      redesSociais: {}, 
      destaque: false, 
      tipo: 'apoiador'
    },
    {
      id: 9, 
      nome: 'Sr. Francisco', 
      cargo: 'Vice-presidente do Sindicato',
      bio: 'Vice-presidente do Sindicato dos Pescadores e Pescadoras de Camocim. Participou ativamente da reunião inicial que definiu a viabilidade do projeto, apoiando a iniciativa.',
      formacao: 'Vice-presidente do Sindicato | Pesca Artesanal',
      email: 'francisco.sindicato@gmail.com', 
      telefone: '(88) 99999-1111',
      responsabilidades: ['Apoio na gestão do espaço', 'Mediação com a comunidade', 'Logística de infraestrutura', 'Participação nas decisões', 'Relações institucionais'],
      experiencia: ['Vice-presidente do Sindicato - 4 anos', 'Pescador artesanal - 20 anos', 'Representante de categoria'],
      redesSociais: {}, 
      destaque: false, 
      tipo: 'apoiador'
    }
  ];

  // Tipos de membros
  const tipos = [
    { value: 'todos', label: 'Todos', icon: FaUsers },
    { value: 'cofundador', label: 'Co-fundadores', icon: FaStar },
    { value: 'estudante', label: 'Estudantes', icon: FaUserGraduate },
    { value: 'parceiro', label: 'Parceiros', icon: FaHandsHelping },
    { value: 'apoiador', label: 'Apoiadores', icon: FaHeart },
  ];

  // ===== EFFECTS =====
  // Verificar usuário logado
  useEffect(() => {
    const storedUser = localStorage.getItem('cinemar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Carregar membros do localStorage
  useEffect(() => {
    const storedMembers = localStorage.getItem('cinemar_members');
    if (storedMembers) {
      setMembersData(JSON.parse(storedMembers));
    } else {
      setMembersData(membersDataInicial);
    }
  }, []);

  // Salvar membros no localStorage
  useEffect(() => {
    if (membersData.length > 0) {
      localStorage.setItem('cinemar_members', JSON.stringify(membersData));
    }
  }, [membersData]);

  // ===== FUNÇÕES DE IMAGEM =====
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem válido.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // ===== CRUD FUNCTIONS =====
  const isAdmin = user?.role === 'admin';

  const handleAddMember = async () => {
    if (!formData.nome || !formData.cargo || !formData.bio || !formData.email) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    let fotoBase64 = '';
    if (imageFile) {
      fotoBase64 = await fileToBase64(imageFile);
    }

    const newMember: Member = {
      id: Date.now(),
      nome: formData.nome!,
      cargo: formData.cargo!,
      bio: formData.bio!,
      formacao: formData.formacao || '',
      email: formData.email!,
      telefone: formData.telefone || '',
      responsabilidades: formData.responsabilidades || [],
      redesSociais: formData.redesSociais || {},
      destaque: formData.destaque || false,
      tipo: formData.tipo as any,
      experiencia: formData.experiencia || [],
      foto: fotoBase64 || undefined
    };

    setMembersData([newMember, ...membersData]);
    resetForm();
    setShowForm(false);
  };

  const handleEditMember = async () => {
    if (!selectedMember) return;
    
    let fotoBase64 = selectedMember.foto;
    if (imageFile) {
      fotoBase64 = await fileToBase64(imageFile);
    }
    
    const updatedMembers = membersData.map(m => 
      m.id === selectedMember.id 
        ? { ...m, ...formData, foto: fotoBase64 }
        : m
    );
    
    setMembersData(updatedMembers);
    resetForm();
    setShowForm(false);
    setIsEditing(false);
    setSelectedMember(null);
  };

  const handleDeleteMember = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este membro?')) {
      setMembersData(membersData.filter(m => m.id !== id));
      if (selectedMember?.id === id) setSelectedMember(null);
    }
  };

  const openEditForm = (member: Member) => {
    setFormData({
      nome: member.nome,
      cargo: member.cargo,
      bio: member.bio,
      formacao: member.formacao,
      email: member.email,
      telefone: member.telefone,
      responsabilidades: member.responsabilidades,
      redesSociais: member.redesSociais,
      destaque: member.destaque,
      tipo: member.tipo,
      experiencia: member.experiencia
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
      redesSociais: {},
      destaque: false,
      tipo: 'apoiador',
      experiencia: []
    });
    setImageFile(null);
    setImagePreview('');
    setIsEditing(false);
    setSelectedMember(null);
  };

  // Helper para campos de array
  const handleArrayFieldChange = (field: 'responsabilidades' | 'experiencia', value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, [field]: array });
  };

  const handleRedesSociaisChange = (rede: string, value: string) => {
    setFormData({
      ...formData,
      redesSociais: { ...formData.redesSociais, [rede]: value }
    });
  };

  // ===== FILTERS =====
  const filteredMembers = membersData.filter(m => {
    const matchesTipo = filtroTipo === 'todos' || m.tipo === filtroTipo;
    const matchesSearch = searchTerm === '' ||
      m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.bio.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTipo && matchesSearch;
  });

  const destaques = membersData.filter(m => m.destaque);

  // ===== MODAL FUNCTIONS =====
  const openMemberModal = (member: Member, trigger?: HTMLElement) => {
    previousFocusRef.current = (trigger ?? document.activeElement) as HTMLElement;
    setSelectedMember(member);
    document.body.style.overflow = 'hidden';
    setTimeout(() => modalContentRef.current?.focus(), 50);
  };

  const closeMemberModal = useCallback(() => {
    setSelectedMember(null);
    document.body.style.overflow = 'auto';
    previousFocusRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!selectedMember) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeMemberModal(); return; }
      if (e.key === 'Tab') {
        const focusable = modalContentRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedMember, closeMemberModal]);

  useEffect(() => { return () => { document.body.style.overflow = 'auto'; }; }, []);

  // ===== HELPER FUNCTIONS =====
  const getTipoLabel = (tipo: string) => tipos.find(t => t.value === tipo)?.label ?? tipo;
  const getTipoIcon = (tipo: string) => {
    const Info = tipos.find(t => t.value === tipo);
    const Icon = Info?.icon ?? FaUsers;
    return <Icon aria-hidden="true" />;
  };

  const resultadoLabel = `${filteredMembers.length} ${filteredMembers.length === 1 ? 'membro' : 'membros'}`;

  const clearFilters = () => {
    setSearchTerm('');
    setFiltroTipo('todos');
  };

  // ===== RENDER =====
  return (
    <div className={styles.membersPage}>
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
              Equipe CineMar
            </h1>
            <p className={styles.heroSubtitle}>
              Conheça as pessoas que tornam o CineMar possível
            </p>
          </div>
        </div>
      </header>

      {/* Botão flutuante de adicionar (apenas admin) */}
      {isAdmin && (
        <button
          className={styles.floatingAddBtn}
          onClick={() => { resetForm(); setShowForm(true); }}
          title="Adicionar membro"
        >
          <FaPlus />
        </button>
      )}

      {/* Formulário de Membro */}
      {showForm && isAdmin && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h3>{isEditing ? 'Editar Membro' : 'Novo Membro'}</h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className={styles.formClose}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.formBody}>
              {/* Seção 1: Identificação */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Identificação</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Nome *</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Cargo *</label>
                    <input
                      type="text"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      placeholder="Cargo/função"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Telefone</label>
                    <input
                      type="text"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      placeholder="(88) 99999-9999"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 2: Classificação */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Classificação</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Tipo</label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                    >
                      {tipos.filter(t => t.value !== 'todos').map(tipo => (
                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Destaque</label>
                    <select
                      value={formData.destaque ? 'sim' : 'nao'}
                      onChange={(e) => setFormData({ ...formData, destaque: e.target.value === 'sim' })}
                    >
                      <option value="nao">Não</option>
                      <option value="sim">Sim</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Seção 3: Foto */}
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
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>
                </div>
                <small className={styles.uploadHint}>Formatos: JPG, PNG. Máximo 5MB.</small>
              </div>

              {/* Seção 4: Biografia */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Biografia</h4>
                <div className={styles.formGroup}>
                  <label>Biografia *</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Biografia do membro..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Seção 5: Formação */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Formação</h4>
                <div className={styles.formGroup}>
                  <label>Formação (separar por |)</label>
                  <textarea
                    value={formData.formacao}
                    onChange={(e) => setFormData({ ...formData, formacao: e.target.value })}
                    placeholder="Formação acadêmica (separe por |)"
                    rows={3}
                  />
                </div>
              </div>

              {/* Seção 6: Responsabilidades e Experiência */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Responsabilidades e Experiência</h4>
                <div className={styles.formGroup}>
                  <label>Responsabilidades (separar por vírgula)</label>
                  <input
                    type="text"
                    value={formData.responsabilidades?.join(', ')}
                    onChange={(e) => handleArrayFieldChange('responsabilidades', e.target.value)}
                    placeholder="Responsabilidade 1, Responsabilidade 2, ..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Experiência (separar por vírgula)</label>
                  <input
                    type="text"
                    value={formData.experiencia?.join(', ')}
                    onChange={(e) => handleArrayFieldChange('experiencia', e.target.value)}
                    placeholder="Experiência 1, Experiência 2, ..."
                  />
                </div>
              </div>

              {/* Seção 7: Redes Sociais */}
              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Redes Sociais</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Facebook</label>
                    <input
                      type="text"
                      value={formData.redesSociais?.facebook || ''}
                      onChange={(e) => handleRedesSociaisChange('facebook', e.target.value)}
                      placeholder="@username"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Instagram</label>
                    <input
                      type="text"
                      value={formData.redesSociais?.instagram || ''}
                      onChange={(e) => handleRedesSociaisChange('instagram', e.target.value)}
                      placeholder="@username"
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>YouTube</label>
                    <input
                      type="text"
                      value={formData.redesSociais?.youtube || ''}
                      onChange={(e) => handleRedesSociaisChange('youtube', e.target.value)}
                      placeholder="/channel/..."
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>LinkedIn</label>
                    <input
                      type="text"
                      value={formData.redesSociais?.linkedin || ''}
                      onChange={(e) => handleRedesSociaisChange('linkedin', e.target.value)}
                      placeholder="/in/username"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formFooter}>
              <button className={styles.cancelBtn} onClick={() => { setShowForm(false); resetForm(); }}>
                Cancelar
              </button>
              <button className={styles.submitBtn} onClick={isEditing ? handleEditMember : handleAddMember}>
                <FaSave /> {isEditing ? 'Salvar Alterações' : 'Adicionar Membro'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros Section */}
      <section className={styles.filtersSection}>
        <div className={styles.filtersContent}>
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="search"
                placeholder="Buscar membro..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.filtersInfo}>
              <FaFilter className={styles.filterIcon} />
              <span>Filtrar por:</span>
            </div>
          </div>

          <div className={styles.tipoFilters}>
            {tipos.map(tipo => {
              const Icon = tipo.icon;
              const isActive = filtroTipo === tipo.value;
              return (
                <button
                  key={tipo.value}
                  className={`${styles.tipoFilterBtn} ${isActive ? styles.active : ''}`}
                  onClick={() => setFiltroTipo(tipo.value)}
                >
                  <Icon />
                  {tipo.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Destaques */}
          {filtroTipo === 'todos' && destaques.length > 0 && (
            <section className={styles.featuredSection}>
              <h2 className={styles.sectionTitle}>
                <FaStar className={styles.sectionIcon} />
                Co-fundadores
              </h2>
              <div className={styles.featuredGrid}>
                {destaques.map(member => (
                  <div key={member.id} className={styles.featuredCard}>
                    <div
                      className={styles.featuredCardClickable}
                      onClick={e => openMemberModal(member, e.currentTarget as HTMLElement)}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && openMemberModal(member, e.currentTarget as HTMLElement)}
                      role="button" tabIndex={0}
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
                        <p className={styles.featuredBio}>{member.bio.substring(0, 80)}...</p>
                        <div className={styles.featuredButton}><span>Ver perfil</span></div>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className={styles.cardAdminActions}>
                        <button onClick={() => openEditForm(member)} className={styles.cardEditBtn}><FaEdit /></button>
                        <button onClick={() => handleDeleteMember(member.id)} className={styles.cardDeleteBtn}><FaTrash /></button>
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
              <span className={styles.membersCount}>({resultadoLabel})</span>
            </h2>

            {filteredMembers.length === 0 ? (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}><FaUsers /></div>
                <h3>Nenhum membro encontrado</h3>
                <button onClick={clearFilters} className={styles.clearFiltersBtn}>Limpar filtros</button>
              </div>
            ) : (
              <div className={styles.membersGrid}>
                {filteredMembers.filter(m => !m.destaque || filtroTipo !== 'todos').map(member => (
                  <div key={member.id} className={`${styles.memberCard} ${styles[member.tipo]}`}>
                    <div
                      className={styles.memberCardClickable}
                      onClick={e => openMemberModal(member, e.currentTarget as HTMLElement)}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && openMemberModal(member, e.currentTarget as HTMLElement)}
                      role="button" tabIndex={0}
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
                          {getTipoIcon(member.tipo)}
                          <span>{getTipoLabel(member.tipo)}</span>
                        </div>
                      </div>

                      <div className={styles.memberCardContent}>
                        <p className={styles.memberBio}>{member.bio.substring(0, 80)}...</p>
                        <div className={styles.memberDetails}>
                          <div className={styles.detailItem}>
                            <FaGraduationCap className={styles.detailIcon} />
                            <span className={styles.detailText}>{member.formacao.split('|')[0].trim()}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <FaBriefcase className={styles.detailIcon} />
                            <span className={styles.detailText}>{member.responsabilidades.length} responsabilidades</span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.memberCardFooter}>
                        <button className={styles.memberButton}>
                          <FaEnvelope className={styles.buttonIcon} />
                          <span>Ver detalhes</span>
                        </button>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className={styles.cardAdminActions}>
                        <button onClick={() => openEditForm(member)} className={styles.cardEditBtn}><FaEdit /></button>
                        <button onClick={() => handleDeleteMember(member.id)} className={styles.cardDeleteBtn}><FaTrash /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sobre a Equipe */}
          <section className={styles.aboutTeam}>
            <div className={styles.aboutHeader}>
              <FaLightbulb className={styles.aboutIcon} />
              <h2 className={styles.aboutTitle}>Sobre a equipe</h2>
            </div>
            <div className={styles.aboutGrid}>
              <div className={styles.aboutItem}><h3><FaUsers /> Origem</h3><p>O CineMar surgiu em 2023 da iniciativa de professores e estudantes.</p></div>
              <div className={styles.aboutItem}><h3><FaFish /> Comunidade</h3><p>Parceria com o Sindicato dos Pescadores para sessões quinzenais.</p></div>
              <div className={styles.aboutItem}><h3><FaSchool /> Educação</h3><p>Buscamos transformar o CineMar em projeto de extensão do IFCE.</p></div>
              <div className={styles.aboutItem}><h3><FaFilm /> Cultura</h3><p>Promovemos o cinema nacional como ferramenta de transformação social.</p></div>
            </div>
          </section>

          {/* Call to Action */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaCard}>
              <div className={styles.ctaContent}>
                <h2 className={styles.ctaTitle}><FaHeart /> Participe!</h2>
                <p className={styles.ctaText}>Sessões quinzenais no Sindicato dos Pescadores<br />Rua Estados Unidos, 118 - Camocim/CE</p>
                <div className={styles.ctaActions}>
                  <Link to="/eventos" className={styles.ctaButton}><FaCalendarAlt /> Ver próximas sessões</Link>
                  <Link to="/contact" className={styles.ctaButtonSecondary}><FaEnvelope /> Entrar em contato</Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Modal de Detalhes */}
      {selectedMember && !showForm && (
        <div className={styles.modalOverlay} onClick={closeMemberModal}>
          <div ref={modalContentRef} className={styles.modalContent} onClick={e => e.stopPropagation()} tabIndex={-1}>
            <button className={styles.closeModal} onClick={closeMemberModal}><FaTimes /></button>

            <div className={styles.modalHeader}>
              <div className={styles.modalImage}>
                {selectedMember.foto ? <img src={selectedMember.foto} alt={selectedMember.nome} /> : <div className={styles.modalIcon}>{getTipoIcon(selectedMember.tipo)}</div>}
              </div>
              <div className={styles.modalTitle}>
                <div className={styles.modalTipoTag}>{getTipoIcon(selectedMember.tipo)}<span>{getTipoLabel(selectedMember.tipo)}</span></div>
                <h2>{selectedMember.nome}</h2>
                <p className={styles.modalRole}>{selectedMember.cargo}</p>
              </div>
              {isAdmin && (
                <div className={styles.modalAdminActions}>
                  <button onClick={() => openEditForm(selectedMember)} className={styles.modalEditBtn}><FaEdit /></button>
                  <button onClick={() => handleDeleteMember(selectedMember.id)} className={styles.modalDeleteBtn}><FaTrash /></button>
                </div>
              )}
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalSection}><h3><FaUserGraduate /> Sobre</h3><p className={styles.modalBio}>{selectedMember.bio}</p></div>
              <div className={styles.modalSection}><h3><FaGraduationCap /> Formação</h3><div className={styles.formacaoList}>{selectedMember.formacao.split('|').map((item, i) => (<div key={i} className={styles.formacaoItem}><FaBook /><span>{item.trim()}</span></div>))}</div></div>
              {selectedMember.experiencia && selectedMember.experiencia.length > 0 && (<div className={styles.modalSection}><h3><FaBriefcase /> Experiência</h3><ul className={styles.experienciaList}>{selectedMember.experiencia.map((exp, i) => (<li key={i} className={styles.experienciaItem}><FaChalkboardTeacher /><span>{exp}</span></li>))}</ul></div>)}
              <div className={styles.modalSection}><h3><FaHandsHelping /> Responsabilidades</h3><ul className={styles.responsibilitiesList}>{selectedMember.responsabilidades.map((resp, i) => (<li key={i} className={styles.responsibilityItem}><FaHeart /><span>{resp}</span></li>))}</ul></div>

              <div className={styles.modalGrid}>
                <div className={styles.contactInfo}><h3><FaEnvelope /> Contato</h3><div className={styles.contactItem}><FaEnvelope /><span>{selectedMember.email}</span></div><div className={styles.contactItem}><FaPhone /><span>{selectedMember.telefone}</span></div></div>
                {Object.keys(selectedMember.redesSociais).length > 0 && (<div className={styles.socialInfo}><h3><FaGlobeAmericas /> Redes</h3><div className={styles.socialLinks}>{selectedMember.redesSociais.facebook && <a href={`https://facebook.com/${selectedMember.redesSociais.facebook}`} target="_blank" rel="noopener noreferrer"><FaFacebook /></a>}{selectedMember.redesSociais.instagram && <a href={`https://instagram.com/${selectedMember.redesSociais.instagram}`} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>}{selectedMember.redesSociais.linkedin && <a href={`https://linkedin.com/in/${selectedMember.redesSociais.linkedin}`} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>}</div></div>)}
              </div>
            </div>

            <div className={styles.modalFooter}><button className={styles.modalCloseBtn} onClick={closeMemberModal}>Fechar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}