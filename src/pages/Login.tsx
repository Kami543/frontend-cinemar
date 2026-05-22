import { useState, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiAlertCircle, FiArrowLeft, FiFilm, FiHeadphones, FiCamera, FiUsers } from 'react-icons/fi';
import logoImage from '../images/cinemar-logo.png';
import styles from '../styles/Auth.module.css';

// ✅ Dados de login pré-definidos para teste
const USUARIOS_TESTE = [
  {
    id: 1,
    email: 'admin@cinemar.com',
    password: 'admin123',
    nome: 'Administrador',
    role: 'admin'
  },
  {
    id: 2,
    email: 'usuario@cinemar.com',
    password: 'usuario123',
    nome: 'Usuário Comum',
    role: 'user'
  }
];

export default function Login() {
  const navigate    = useNavigate();
  const emailId     = useId();
  const passwordId  = useId();

  const [form, setForm]          = useState({ email: '', password: '' });
  const [errors, setErrors]      = useState<Record<string, string>>({});
  const [showPwd, setShowPwd]    = useState(false);
  const [loading, setLoading]    = useState(false);
  const [globalError, setGlobal] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim())                                       e.email    = 'E-mail obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))    e.email    = 'E-mail inválido';
    if (!form.password)                                           e.password = 'Senha obrigatória';
    else if (form.password.length < 6)                            e.password = 'Mínimo 6 caracteres';
    return e;
  };

  // ✅ Função para autenticar o usuário
  const autenticarUsuario = (email: string, password: string) => {
    return USUARIOS_TESTE.find(
      user => user.email === email && user.password === password
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobal('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    
    try {
      // ✅ Simula um pequeno delay de rede (opcional)
      await new Promise(r => setTimeout(r, 800));
      
      // ✅ Verifica se o usuário existe nos dados de teste
      const usuario = autenticarUsuario(form.email, form.password);
      
      if (usuario) {
        // ✅ Salva os dados do usuário no localStorage (opcional)
        localStorage.setItem('cinemar_user', JSON.stringify({
          id: usuario.id,
          email: usuario.email,
          nome: usuario.nome,
          role: usuario.role
        }));
        
        // ✅ Redireciona para a página inicial
        navigate('/');
      } else {
        setGlobal('E-mail ou senha incorretos. Tente novamente.');
      }
    } catch {
      setGlobal('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Função para preencher automaticamente os dados de teste (útil para desenvolvimento)
  const preencherUsuario = (email: string, password: string) => {
    setForm({ email, password });
    setErrors({});
    setGlobal('');
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const features = [
    { icon: <FiFilm />, text: 'Participe das sessões quinzenais' },
    { icon: <FiHeadphones />, text: 'Acesso aos podcasts do cineclube' },
    { icon: <FiCamera />, text: 'Galeria de fotos das sessões' },
    { icon: <FiUsers />, text: 'Comunidade de Camocim e região' },
  ];

  return (
    <div className={styles.authPage}>

      {/* ── Painel esquerdo ── */}
      <div className={styles.sidePanel} aria-hidden="true">
        <div className={styles.sidePanelContent}>
          <img
            src={logoImage}
            alt=""
            className={styles.sideLogo}
          />
          <div className={styles.sideDivider} />
          <p className={styles.sideTagline}>
            Cinema comunitário em Camocim.<br />
            Cultura, debate e transformação social.
          </p>
          <div className={styles.sideFeatures}>
            {features.map((f, i) => (
              <div key={i} className={styles.sideFeature}>
                <div className={styles.sideFeatureIcon}>{f.icon}</div>
                <span className={styles.sideFeatureText}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Formulário ── */}
      <main className={styles.formPanel}>
        <div className={styles.formCard}>

          <header className={styles.formHeader}>
            <h1 className={styles.formTitle}>Entrar na conta</h1>
            <p className={styles.formSubtitle}>
              Bem-vindo de volta ao CineMar. Insira seus dados para continuar.
            </p>
          </header>

          {globalError && (
            <div className={styles.alertError} role="alert">
              <FiAlertCircle />
              {globalError}
            </div>
          )}

          {/* ✅ Botões de acesso rápido para teste (opcional - remova se não quiser) */}
          <div className={styles.testUsers}>
            <p className={styles.testUsersTitle}>🔐 Contas de teste:</p>
            <div className={styles.testUsersButtons}>
              <button
                type="button"
                className={styles.testUserBtn}
                onClick={() => preencherUsuario('admin@cinemar.com', 'admin123')}
              >
                Admin
              </button>
              <button
                type="button"
                className={styles.testUserBtn}
                onClick={() => preencherUsuario('usuario@cinemar.com', 'usuario123')}
              >
                Usuário
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate aria-label="Formulário de login">
            <div className={styles.fieldGroup}>

              {/* E-mail */}
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor={emailId}>E-mail</label>
                <input
                  id={emailId}
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={set('email')}
                  className={`${styles.fieldInput} ${errors.email ? styles.error : ''}`}
                  aria-describedby={errors.email ? `${emailId}-err` : undefined}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <span id={`${emailId}-err`} className={styles.fieldError} role="alert">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Senha */}
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor={passwordId}>Senha</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id={passwordId}
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set('password')}
                    className={`${styles.fieldInput} ${errors.password ? styles.error : ''}`}
                    aria-describedby={errors.password ? `${passwordId}-err` : undefined}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPwd(v => !v)}
                    aria-label={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
                    aria-pressed={showPwd}
                  >
                    {showPwd ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <span id={`${passwordId}-err`} className={styles.fieldError} role="alert">
                    {errors.password}
                  </span>
                )}
                <Link to="/recuperar-senha" className={styles.forgotLink}>
                  Esqueci minha senha
                </Link>
              </div>

            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
              aria-busy={loading}
            >
              {loading
                ? <><div className={styles.spinner} aria-hidden="true" /> Entrando…</>
                : 'Entrar'
              }
            </button>
          </form>

          <div className={styles.divider} aria-hidden="true">
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>não tem conta?</span>
            <div className={styles.dividerLine} />
          </div>

          <div className={styles.formFooter}>
            <Link to="/register" className={styles.footerLink}>
              Criar conta gratuita
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/" className={styles.backLink}>
              <FiArrowLeft />
              Voltar para o site
            </Link>
          </div>

        </div>
      </main>

    </div>
  );
}