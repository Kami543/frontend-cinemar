// frontend/src/pages/TermosDeUso.tsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChevronLeft, FaFilm, FaShieldAlt, FaUserCheck,
  FaBan, FaDatabase, FaEnvelope, FaGavel, FaSync,
  FaCookieBite, FaLink, FaExclamationTriangle, FaChevronDown,
} from 'react-icons/fa';
import { useTheme } from '../components/context/ThemeContext';
import styles from '../styles/TermosDeUso.module.css';

interface Section {
  id: string;
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
}

export default function TermosDeUso() {
  const { theme } = useTheme();
  const isDarkMode   = theme === 'dark';
  const [activeId,   setActiveId]   = useState<string>('');
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['uso']));
  const sectionRefs  = useRef<Record<string, HTMLDivElement | null>>({});

  // Marca seção ativa conforme o scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    Object.values(sectionRefs.current).forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (!openSections.has(id)) toggleSection(id);
  };

  const sections: Section[] = [
    {
      id: 'uso',
      icon: FaFilm,
      title: 'Uso da Plataforma',
      content: (
        <>
          <p>O CineMar é uma plataforma cultural dedicada à exibição e discussão de filmes. Ao acessar nosso site, você concorda com os presentes Termos de Uso em sua totalidade.</p>
          <p>A plataforma é destinada a pessoas com interesse em cinema, cultura e debates cinematográficos. O uso é gratuito para fins não comerciais.</p>
          <ul>
            <li>Acesso ao catálogo completo de sessões realizadas e programadas</li>
            <li>Participação nos debates e discussões sobre os filmes</li>
            <li>Consulta às playlists, podcasts e materiais de apoio</li>
            <li>Criação de conta para interações avançadas (favoritos, comentários, feedbacks)</li>
          </ul>
          <p>O CineMar reserva o direito de modificar, suspender ou encerrar qualquer funcionalidade a qualquer momento, mediante aviso prévio quando possível.</p>
        </>
      ),
    },
    {
      id: 'conta',
      icon: FaUserCheck,
      title: 'Cadastro e Conta de Usuário',
      content: (
        <>
          <p>Para acessar recursos como comentários, favoritos e feedbacks, é necessário criar uma conta. Ao se cadastrar, você garante que:</p>
          <ul>
            <li>As informações fornecidas são verdadeiras, precisas e atualizadas</li>
            <li>Você tem pelo menos 13 anos de idade</li>
            <li>Você é responsável pela confidencialidade de sua senha</li>
            <li>Todas as atividades realizadas sob sua conta são de sua responsabilidade</li>
          </ul>
          <p>Não é permitido criar múltiplas contas para o mesmo usuário, utilizar contas de terceiros ou tentar acessar contas alheias de qualquer forma.</p>
          <p>Em caso de uso suspeito ou não autorizado de sua conta, comunique-nos imediatamente pelo e-mail de contato disponível ao final destes Termos.</p>
        </>
      ),
    },
    {
      id: 'conduta',
      icon: FaBan,
      title: 'Conduta e Conteúdo Proibido',
      content: (
        <>
          <p>O CineMar é um espaço de debate cultural respeitoso. É estritamente vedado:</p>
          <ul>
            <li>Publicar conteúdo ofensivo, discriminatório, racista, sexista ou que promova ódio</li>
            <li>Fazer spam, publicidade não autorizada ou tentativas de phishing</li>
            <li>Enviar vírus, malware ou qualquer código malicioso</li>
            <li>Reproduzir, distribuir ou comercializar conteúdo protegido por direitos autorais sem autorização</li>
            <li>Realizar engenharia reversa ou tentar comprometer a segurança da plataforma</li>
            <li>Usar bots, scrapers ou ferramentas automatizadas sem permissão expressa</li>
            <li>Criar conteúdo falso, enganoso ou que prejudique terceiros</li>
          </ul>
          <p>O descumprimento dessas regras pode resultar na suspensão imediata da conta, sem aviso prévio, e eventuais medidas legais cabíveis.</p>
        </>
      ),
    },
    {
      id: 'dados',
      icon: FaDatabase,
      title: 'Dados Pessoais e Privacidade',
      content: (
        <>
          <p>O CineMar coleta e trata dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018). Os dados coletados incluem:</p>
          <ul>
            <li><strong>Cadastro:</strong> nome, e-mail e senha (armazenada de forma criptografada)</li>
            <li><strong>Interações:</strong> comentários, feedbacks, favoritos e participações em eventos</li>
            <li><strong>Navegação:</strong> logs de acesso para segurança e melhoria da plataforma</li>
          </ul>
          <p>Seus dados <strong>não são vendidos</strong> a terceiros. Podemos compartilhá-los apenas quando exigido por lei ou para operar serviços essenciais da plataforma (ex.: hospedagem).</p>
          <p>Você tem direito a acessar, corrigir, exportar e solicitar a exclusão de seus dados pessoais a qualquer momento entrando em contato conosco.</p>
        </>
      ),
    },
    {
      id: 'cookies',
      icon: FaCookieBite,
      title: 'Cookies e Tecnologias de Rastreamento',
      content: (
        <>
          <p>Utilizamos cookies e tecnologias similares para:</p>
          <ul>
            <li>Manter sua sessão autenticada durante a navegação</li>
            <li>Memorizar preferências como tema (claro/escuro) e filtros</li>
            <li>Analisar o uso da plataforma para melhorias contínuas</li>
          </ul>
          <p>Não utilizamos cookies de rastreamento para fins publicitários. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar o funcionamento de algumas funcionalidades.</p>
          <p>Dados armazenados localmente (localStorage) incluem suas preferências de tema, lista de favoritos e watchlist, que permanecem apenas no seu dispositivo.</p>
        </>
      ),
    },
    {
      id: 'propriedade',
      icon: FaShieldAlt,
      title: 'Propriedade Intelectual',
      content: (
        <>
          <p>Todo o conteúdo original do CineMar — incluindo textos, sinopses, identidade visual, código-fonte e materiais produzidos pela equipe — é protegido por direitos autorais e pertence ao CineMar ou aos seus respectivos criadores.</p>
          <p>É permitido compartilhar links para o conteúdo da plataforma. Não é permitido:</p>
          <ul>
            <li>Reproduzir o conteúdo em outros sites sem autorização escrita</li>
            <li>Usar a marca CineMar para fins comerciais ou enganosos</li>
            <li>Remover atribuições de autoria de materiais publicados</li>
          </ul>
          <p>Os filmes exibidos nas sessões são propriedade de seus respectivos detentores de direitos. O CineMar não reivindica propriedade sobre obras cinematográficas de terceiros.</p>
        </>
      ),
    },
    {
      id: 'links',
      icon: FaLink,
      title: 'Links Externos',
      content: (
        <>
          <p>Nossa plataforma pode conter links para recursos externos, como:</p>
          <ul>
            <li>Playlists no Spotify e YouTube</li>
            <li>Materiais de debate no Google Drive</li>
            <li>Perfis em redes sociais dos membros</li>
            <li>Sites de parceiros e colaboradores</li>
          </ul>
          <p>O CineMar não se responsabiliza pelo conteúdo, disponibilidade ou práticas de privacidade de sites externos. O acesso a esses links é por sua conta e risco.</p>
          <p>Recomendamos verificar os termos e políticas de privacidade de cada serviço externo antes de utilizá-los.</p>
        </>
      ),
    },
    {
      id: 'responsabilidade',
      icon: FaExclamationTriangle,
      title: 'Limitação de Responsabilidade',
      content: (
        <>
          <p>O CineMar é oferecido "como está", sem garantias expressas ou implícitas de disponibilidade contínua, ausência de erros ou adequação a propósito específico.</p>
          <p>Não nos responsabilizamos por:</p>
          <ul>
            <li>Interrupções temporárias no serviço por manutenção ou falhas técnicas</li>
            <li>Perda de dados causada por falhas de terceiros (hospedagem, banco de dados)</li>
            <li>Danos decorrentes do uso indevido da plataforma por outros usuários</li>
            <li>Conteúdo publicado por usuários em comentários e feedbacks</li>
          </ul>
          <p>Em nenhuma hipótese o CineMar será responsável por danos indiretos, incidentais ou consequentes decorrentes do uso ou impossibilidade de uso da plataforma.</p>
        </>
      ),
    },
    {
      id: 'atualizacoes',
      icon: FaSync,
      title: 'Atualizações dos Termos',
      content: (
        <>
          <p>Estes Termos de Uso podem ser atualizados periodicamente para refletir mudanças na plataforma, na legislação aplicável ou em nossas práticas.</p>
          <p>Quando houver alterações relevantes:</p>
          <ul>
            <li>Atualizaremos a data de última revisão no topo desta página</li>
            <li>Notificaremos usuários cadastrados por e-mail em casos de mudanças significativas</li>
            <li>O uso continuado da plataforma após as alterações implica aceitação dos novos Termos</li>
          </ul>
          <p>Recomendamos revisar esta página periodicamente. Se não concordar com as alterações, você pode encerrar sua conta a qualquer momento.</p>
        </>
      ),
    },
    {
      id: 'contato',
      icon: FaEnvelope,
      title: 'Contato e Suporte',
      content: (
        <>
          <p>Para dúvidas, solicitações relacionadas a dados pessoais, denúncias de conteúdo impróprio ou qualquer outra questão relacionada a estes Termos, entre em contato:</p>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} aria-hidden="true" />
              <div>
                <strong>E-mail geral</strong>
                <a href="mailto:contato@cinemar.com.br">contato@cinemar.com.br</a>
              </div>
            </div>
            <div className={styles.contactItem}>
              <FaShieldAlt className={styles.contactIcon} aria-hidden="true" />
              <div>
                <strong>Privacidade e dados</strong>
                <a href="mailto:privacidade@cinemar.com.br">privacidade@cinemar.com.br</a>
              </div>
            </div>
            <div className={styles.contactItem}>
              <FaExclamationTriangle className={styles.contactIcon} aria-hidden="true" />
              <div>
                <strong>Denúncias</strong>
                <a href="mailto:denuncia@cinemar.com.br">denuncia@cinemar.com.br</a>
              </div>
            </div>
          </div>
          <p>Respondemos em até <strong>5 dias úteis</strong>. Para solicitações de dados pessoais, o prazo pode ser de até 15 dias conforme a LGPD.</p>
        </>
      ),
    },
    {
      id: 'jurisdicao',
      icon: FaGavel,
      title: 'Legislação Aplicável e Foro',
      content: (
        <>
          <p>Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, em especial:</p>
          <ul>
            <li>Lei Geral de Proteção de Dados — LGPD (Lei nº 13.709/2018)</li>
            <li>Marco Civil da Internet (Lei nº 12.965/2014)</li>
            <li>Código de Defesa do Consumidor (Lei nº 8.078/1990)</li>
            <li>Código Civil Brasileiro (Lei nº 10.406/2002)</li>
          </ul>
          <p>Fica eleito o foro da comarca de Fortaleza, Estado do Ceará, para dirimir quaisquer controvérsias decorrentes destes Termos, com renúncia expressa a qualquer outro foro, por mais privilegiado que seja.</p>
        </>
      ),
    },
  ];

  const navItems = sections.map(s => ({ id: s.id, title: s.title }));

  return (
    <div className={`${styles.page} ${isDarkMode ? styles.dark : ''}`}>

      {/* HEADER */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <Link to="/" className={styles.backLink}>
            <FaChevronLeft aria-hidden="true" /> Voltar para Início
          </Link>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <FaGavel aria-hidden="true" /> Documento Legal
            </div>
            <h1 className={styles.heroTitle}>Termos de Uso</h1>
            <p className={styles.heroSubtitle}>
              Leia com atenção as condições que regem o uso da plataforma CineMar.
            </p>
            <div className={styles.heroMeta}>
              <span>Versão 1.0</span>
              <span className={styles.metaDot}>·</span>
              <span>Última atualização: junho de 2025</span>
              <span className={styles.metaDot}>·</span>
              <span>Vigência: imediata</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.layout}>

        {/* SUMÁRIO LATERAL */}
        <aside className={styles.toc}>
          <div className={styles.tocInner}>
            <p className={styles.tocLabel}>Sumário</p>
            <nav>
              <ol className={styles.tocList}>
                {navItems.map((item, i) => (
                  <li key={item.id}>
                    <button
                      className={`${styles.tocItem} ${activeId === item.id ? styles.tocActive : ''}`}
                      onClick={() => scrollTo(item.id)}
                    >
                      <span className={styles.tocNum}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={styles.tocText}>{item.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </aside>

        {/* CONTEÚDO */}
        <main className={styles.content}>

          {/* Banner de aviso */}
          <div className={styles.noticeBanner}>
            <FaExclamationTriangle className={styles.noticeIcon} aria-hidden="true" />
            <p>
              Ao utilizar a plataforma CineMar, você confirma que leu, compreendeu e concorda
              com todos os termos e condições descritos neste documento.
            </p>
          </div>

          {/* Seções */}
          {sections.map((section, index) => {
            const Icon    = section.icon;
            const isOpen  = openSections.has(section.id);
            return (
              <div
                key={section.id}
                id={section.id}
                ref={el => { sectionRefs.current[section.id] = el; }}
                className={`${styles.section} ${isOpen ? styles.sectionOpen : ''}`}
              >
                <button
                  className={styles.sectionHeader}
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isOpen}
                >
                  <div className={styles.sectionHeaderLeft}>
                    <span className={styles.sectionNum}>{String(index + 1).padStart(2, '0')}</span>
                    <div className={styles.sectionIconWrap}>
                      <Icon aria-hidden="true" />
                    </div>
                    <h2 className={styles.sectionTitle}>{section.title}</h2>
                  </div>
                  <FaChevronDown
                    className={`${styles.sectionChevron} ${isOpen ? styles.sectionChevronOpen : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div className={styles.sectionBody}>
                    {section.content}
                  </div>
                )}
              </div>
            );
          })}

          {/* Rodapé do documento */}
          <div className={styles.docFooter}>
            <div className={styles.docFooterTop}>
              <FaFilm className={styles.docFooterLogo} aria-hidden="true" />
              <div>
                <strong>CineMar</strong>
                <p>Plataforma cultural de cinema e debate</p>
              </div>
            </div>
            <p className={styles.docFooterNote}>
              Este documento constitui um acordo legal entre você e o CineMar. Em caso de
              dúvidas sobre qualquer cláusula, entre em contato antes de utilizar a plataforma.
            </p>
            <div className={styles.docFooterLinks}>
              <Link to="/">Página Inicial</Link>
              <span>·</span>
              <Link to="/membros">Nossa Equipe</Link>
              <span>·</span>
              <a href="mailto:contato@cinemar.com.br">Contato</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}