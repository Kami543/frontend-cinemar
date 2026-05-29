// frontend/src/pages/Register.tsx
import { useState, useId, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle, FiArrowLeft, FiFilm, FiHeadphones, FiCamera, FiUsers } from 'react-icons/fi';
import logoImage from '../images/cinemar-logo.png';
import styles from '../styles/Auth.module.css';
import { useAuth } from '../contexts/AuthContext';

function getStrength(pwd: string): 0 | 1 | 2 | 3 | 4 {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8)          s++;
  if (/[A-Z]/.test(pwd))        s++;
  if (/[0-9]/.test(pwd))        s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s as 0 | 1 | 2 | 3 | 4;
}

const STRENGTH_LABEL = ['', 'Fraca', 'Razoável', 'Boa', 'Forte'];
const STRENGTH_CLASS = ['', 's1', 's2', 's3', 's4'] as const;

export default function Register() {
  const navigate  = useNavigate();
  const firstId   = useId();
  const lastId    = useId();
  const emailId   = useId();
  const pwdId     = useId();
  const confirmId = useId();
  const { register, isLoading, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirm: '', terms: false,
  });
  const [errors, setErrors]      = useState<Record<string, string>>({});
  const [showPwd, setShowPwd]    = useState(false);
  const [showConf, setShowConf]  = useState(false);
  const [success, setSuccess]    = useState(false);
  const [globalError, setGlobal] = useState('');

  const strength = getStrength(form.password);

  // Se já estiver autenticado, redirecionar para home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim())  e.firstName = 'Nome obrigatório';
    if (!form.lastName.trim())   e.lastName  = 'Sobrenome obrigatório';
    if (!form.email.trim())                                      e.email    = 'E-mail obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))   e.email    = 'E-mail inválido';
    if (!form.password)          e.password  = 'Senha obrigatória';
    else if (form.password.length < 8)                           e.password = 'Mínimo 8 caracteres';
    if (!form.confirm)           e.confirm   = 'Confirmação obrigatória';
    else if (form.confirm !== form.password)                     e.confirm  = 'As senhas não coincidem';
    if (!form.terms)             e.terms     = 'Aceite os termos para continuar';
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setGlobal('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    try {
      await register({
        email: form.email,
        nome: `${form.firstName.trim()} ${form.lastName.trim()}`,
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setGlobal(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Erro ao criar conta. Tente novamente.'));
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const features = [
    { icon: <FiFilm />,       text: 'Participe das sessões quinzenais' },
    { icon: <FiHeadphones />, text: 'Acesso aos podcasts do cineclube' },
    { icon: <FiCamera />,     text: 'Galeria de fotos das sessões' },
    { icon: <FiUsers />,      text: 'Comunidade de Camocim e região' },
  ];

  return (
    <div className={styles.authPage}>
      <div className={styles.sidePanel} aria-hidden="true">
        <div className={styles.sidePanelContent}>
          <img src={logoImage} alt="" className={styles.sideLogo} />
          <div className={styles.sideDivider} />
          <p className={styles.sideTagline}>
            Junte-se ao CineMar e faça parte<br />
            da maior iniciativa de cinema<br />
            comunitário de Camocim.
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

      <main className={styles.formPanel}>
        <div className={styles.formCard}>
          <header className={styles.formHeader}>
            <h1 className={styles.formTitle}>Criar conta</h1>
            <p className={styles.formSubtitle}>
              Cadastro gratuito. Participe das sessões e eventos do CineMar.
            </p>
          </header>

          {globalError && (
            <div className={styles.alertError} role="alert">
              <FiAlertCircle />
              {globalError}
            </div>
          )}

          {success && (
            <div className={styles.alertSuccess} role="status">
              <FiCheckCircle />
              Conta criada! Redirecionando…
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate aria-label="Formulário de cadastro">
            <div className={styles.fieldGroup}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor={firstId}>Nome</label>
                  <input
                    id={firstId}
                    type="text"
                    autoComplete="given-name"
                    placeholder="Maria"
                    value={form.firstName}
                    onChange={set('firstName')}
                    className={`${styles.fieldInput} ${errors.firstName ? styles.error : ''}`}
                    aria-describedby={errors.firstName ? `${firstId}-err` : undefined}
                    aria-invalid={!!errors.firstName}
                  />
                  {errors.firstName && (
                    <span id={`${firstId}-err`} className={styles.fieldError} role="alert">
                      {errors.firstName}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor={lastId}>Sobrenome</label>
                  <input
                    id={lastId}
                    type="text"
                    autoComplete="family-name"
                    placeholder="Silva"
                    value={form.lastName}
                    onChange={set('lastName')}
                    className={`${styles.fieldInput} ${errors.lastName ? styles.error : ''}`}
                    aria-describedby={errors.lastName ? `${lastId}-err` : undefined}
                    aria-invalid={!!errors.lastName}
                  />
                  {errors.lastName && (
                    <span id={`${lastId}-err`} className={styles.fieldError} role="alert">
                      {errors.lastName}
                    </span>
                  )}
                </div>
              </div>

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

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor={pwdId}>Senha</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id={pwdId}
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres"
                    value={form.password}
                    onChange={set('password')}
                    className={`${styles.fieldInput} ${errors.password ? styles.error : ''}`}
                    aria-describedby={`${pwdId}-strength${errors.password ? ` ${pwdId}-err` : ''}`}
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
                  <span id={`${pwdId}-err`} className={styles.fieldError} role="alert">
                    {errors.password}
                  </span>
                )}
                {form.password && (
                  <>
                    <div
                      className={styles.strengthBar}
                      id={`${pwdId}-strength`}
                      role="img"
                      aria-label={`Força da senha: ${STRENGTH_LABEL[strength]}`}
                    >
                      {([1, 2, 3, 4] as const).map(i => (
                        <div
                          key={i}
                          className={`${styles.strengthSeg} ${i <= strength ? styles[STRENGTH_CLASS[strength]] : ''}`}
                        />
                      ))}
                    </div>
                    <span className={styles.strengthText} aria-hidden="true">
                      {STRENGTH_LABEL[strength]}
                    </span>
                  </>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor={confirmId}>Confirmar senha</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id={confirmId}
                    type={showConf ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repita a senha"
                    value={form.confirm}
                    onChange={set('confirm')}
                    className={`${styles.fieldInput} ${errors.confirm ? styles.error : ''}`}
                    aria-describedby={errors.confirm ? `${confirmId}-err` : undefined}
                    aria-invalid={!!errors.confirm}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowConf(v => !v)}
                    aria-label={showConf ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                    aria-pressed={showConf}
                  >
                    {showConf ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirm && (
                  <span id={`${confirmId}-err`} className={styles.fieldError} role="alert">
                    {errors.confirm}
                  </span>
                )}
              </div>

              <div className={styles.field}>
                <div className={styles.checkboxField}>
                  <input
                    type="checkbox"
                    id="terms"
                    checked={form.terms}
                    onChange={set('terms')}
                    className={styles.checkboxInput}
                    aria-describedby={errors.terms ? 'terms-err' : undefined}
                    aria-invalid={!!errors.terms}
                  />
                  <label htmlFor="terms" className={styles.checkboxLabel}>
                    Li e aceito os{' '}
                    <Link to="/termos" target="_blank" rel="noopener">Termos de Uso</Link>
                    {' '}e a{' '}
                    <Link to="/privacidade" target="_blank" rel="noopener">Política de Privacidade</Link>
                  </label>
                </div>
                {errors.terms && (
                  <span id="terms-err" className={styles.fieldError} role="alert">
                    {errors.terms}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading || success}
              aria-busy={isLoading}
            >
              {isLoading
                ? <><div className={styles.spinner} aria-hidden="true" /> Criando conta…</>
                : 'Criar conta'
              }
            </button>
          </form>

          <div className={styles.divider} aria-hidden="true">
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>já tem conta?</span>
            <div className={styles.dividerLine} />
          </div>

          <div className={styles.formFooter}>
            <Link to="/login" className={styles.footerLink}>
              Entrar na minha conta
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