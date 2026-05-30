// frontend/src/pages/PoliticaPrivacidade.tsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChevronLeft, FaShieldAlt, FaUserSecret, FaDatabase,
  FaCookieBite, FaEnvelope, FaGavel, FaSync, FaLock,
  FaUserCheck, FaShareAlt, FaEye, FaFileContract, FaChevronDown,
} from 'react-icons/fa';
import { useTheme } from '../components/context/ThemeContext';
import styles from '../styles/PoliticaPrivacidade.module.css';

interface Section {
  id: string;
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
}

export default function PoliticaPrivacidade() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [activeId, setActiveId] = useState<string>('');
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['coleta']));
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
      id: 'coleta',
      icon: FaDatabase,
      title: 'Coleta de Dados Pessoais',
      content: (
        <>
          <p>O CineMar coleta dados pessoais de diferentes formas para oferecer uma experiência completa e personalizada. Os dados coletados incluem:</p>
          
          <h4>1. Dados fornecidos diretamente por você</h4>
          <ul>
            <li><strong>Cadastro:</strong> nome completo, e-mail, senha (armazenada de forma criptografada)</li>
            <li><strong>Perfil:</strong> foto, cargo, biografia (para membros da equipe)</li>
            <li><strong>Interações:</strong> comentários, avaliações, favoritos, feedbacks</li>
            <li><strong>Contato:</strong> mensagens enviadas pelos formulários de contato</li>
          </ul>

          <h4>2. Dados coletados automaticamente</h4>
          <ul>
            <li><strong>Navegação:</strong> páginas acessadas, tempo de visita, cliques</li>
            <li><strong>Dispositivo:</strong> tipo de dispositivo, sistema operacional, navegador</li>
            <li><strong>Localização:</strong> endereço IP (apenas para segurança e estatísticas)</li>
            <li><strong>Preferências:</strong> tema (claro/escuro), filtros, watchlist</li>
          </ul>

          <p>Os dados são coletados mediante seu consentimento explícito no momento do cadastro ou através de mecanismos transparentes durante a navegação.</p>
        </>
      ),
    },
    {
      id: 'finalidade',
      icon: FaEye,
      title: 'Finalidade do Tratamento',
      content: (
        <>
          <p>Seus dados são tratados exclusivamente para as seguintes finalidades:</p>
          <ul>
            <li><strong>Operação da plataforma:</strong> permitir acesso, navegação e uso das funcionalidades do CineMar</li>
            <li><strong>Personalização:</strong> adaptar conteúdo e experiência com base em suas preferências</li>
            <li><strong>Comunicação:</strong> enviar informações sobre sessões, novidades e eventos (apenas se autorizado)</li>
            <li><strong>Segurança:</strong> prevenir fraudes, abusos e proteger a integridade da plataforma</li>
            <li><strong>Melhoria contínua:</strong> analisar uso para otimizar funcionalidades e conteúdo</li>
            <li><strong>Estatísticas:</strong> gerar dados agregados sobre o uso da plataforma (sem identificação pessoal)</li>
          </ul>
          <p>Não utilizamos seus dados para tomada de decisões automatizadas que possam afetar significativamente seus interesses.</p>
        </>
      ),
    },
    {
      id: 'base',
      icon: FaGavel,
      title: 'Base Legal para Tratamento',
      content: (
        <>
          <p>O tratamento de dados pessoais pelo CineMar é realizado com base nas seguintes hipóteses legais da LGPD:</p>
          <ul>
            <li><strong>Consentimento:</strong> para cadastro, comunicações marketing e cookies não essenciais</li>
            <li><strong>Execução de contrato:</strong> para fornecer os serviços solicitados por você</li>
            <li><strong>Interesse legítimo:</strong> para segurança, melhoria da plataforma e prevenção de fraudes</li>
            <li><strong>Cumprimento de obrigação legal:</strong> quando exigido por lei ou ordem judicial</li>
          </ul>
          <p>Você pode revogar seu consentimento a qualquer momento, sem prejuízo das operações realizadas anteriormente.</p>
        </>
      ),
    },
    {
      id: 'compartilhamento',
      icon: FaShareAlt,
      title: 'Compartilhamento de Dados',
      content: (
        <>
          <p>O CineMar <strong>não vende nem aluga</strong> seus dados pessoais a terceiros. Compartilhamos dados apenas em situações específicas:</p>
          <ul>
            <li><strong>Fornecedores de serviço:</strong> empresas que nos ajudam a operar a plataforma (hospedagem, banco de dados, CDN)</li>
            <li><strong>Parceiros institucionais:</strong> para organização de eventos e sessões especiais (com seu consentimento prévio)</li>
            <li><strong>Obrigação legal:</strong> quando exigido por lei, ordem judicial ou autoridades competentes</li>
            <li><strong>Proteção de direitos:</strong> para proteger os direitos, propriedade ou segurança do CineMar e usuários</li>
          </ul>
          <p>Todos os fornecedores são contratualmente obrigados a tratar os dados com confidencialidade e apenas para os fins autorizados.</p>
        </>
      ),
    },
    {
      id: 'armazenamento',
      icon: FaLock,
      title: 'Armazenamento e Segurança',
      content: (
        <>
          <p>Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou violação:</p>
          <ul>
            <li><strong>Criptografia:</strong> senhas armazenadas com hash e dados sensíveis criptografados</li>
            <li><strong>HTTPS:</strong> toda a comunicação com a plataforma é criptografada</li>
            <li><strong>Controle de acesso:</strong> acesso restrito a funcionários autorizados</li>
            <li><strong>Backups:</strong> cópias de segurança regulares armazenadas em ambiente seguro</li>
            <li><strong>Monitoramento:</strong> sistemas de detecção de ameaças e resposta a incidentes</li>
          </ul>
          <p>Seus dados são armazenados em servidores seguros na plataforma Supabase (AWS) localizados no Brasil ou EUA, conforme práticas de mercado.</p>
          <p>Em caso de incidente de segurança, notificaremos as autoridades e os usuários afetados conforme exigido pela LGPD.</p>
        </>
      ),
    },
    {
      id: 'cookies',
      icon: FaCookieBite,
      title: 'Cookies e Tecnologias de Rastreamento',
      content: (
        <>
          <p>Utilizamos cookies e tecnologias similares para melhorar sua experiência:</p>
          
          <h4>Cookies essenciais (obrigatórios)</h4>
          <ul>
            <li><strong>Autenticação:</strong> mantém sua sessão ativa durante a navegação</li>
            <li><strong>Preferências:</strong> lembra tema (claro/escuro), filtros e watchlist</li>
            <li><strong>Segurança:</strong> protege contra ataques e abusos</li>
          </ul>

          <h4>Cookies não essenciais (com consentimento)</h4>
          <ul>
            <li><strong>Análise:</strong> dados agregados de uso para melhorias (Google Analytics)</li>
            <li><strong>Desempenho:</strong> monitoramento de tempo de carregamento e erros</li>
          </ul>

          <p>Não utilizamos cookies de rastreamento para publicidade comportamental ou remarketing.</p>
          <p>Você pode gerenciar suas preferências de cookies nas configurações do seu navegador. A desativação pode afetar funcionalidades da plataforma.</p>
        </>
      ),
    },
    {
      id: 'direitos',
      icon: FaUserCheck,
      title: 'Seus Direitos (LGPD)',
      content: (
        <>
          <p>A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) garante a você os seguintes direitos:</p>
          
          <div className={styles.rightsGrid}>
            <div className={styles.rightCard}>
              <div className={styles.rightIcon}><FaDatabase /></div>
              <h4>Confirmação e acesso</h4>
              <p>Saber se tratamos seus dados e solicitar cópia completa</p>
            </div>
            <div className={styles.rightCard}>
              <div className={styles.rightIcon}><FaSync /></div>
              <h4>Correção</h4>
              <p>Corrigir dados incompletos, inexatos ou desatualizados</p>
            </div>
            <div className={styles.rightCard}>
              <div className={styles.rightIcon}><FaEye /></div>
              <h4>Anonimização e bloqueio</h4>
              <p>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários</p>
            </div>
            <div className={styles.rightCard}>
              <div className={styles.rightIcon}><FaTrash /></div>
              <h4>Eliminação</h4>
              <p>Solicitar exclusão de dados tratados com consentimento</p>
            </div>
            <div className={styles.rightCard}>
              <div className={styles.rightIcon}><FaDatabase /></div>
              <h4>Portabilidade</h4>
              <p>Receber seus dados em formato estruturado (a partir de 2026 conforme ANPD)</p>
            </div>
            <div className={styles.rightCard}>
              <div className={styles.rightIcon}><FaUserSecret /></div>
              <h4>Revogação de consentimento</h4>
              <p>Retirar seu consentimento a qualquer momento</p>
            </div>
          </div>

          <p>Para exercer seus direitos, entre em contato pelo e-mail <strong>privacidade@cinemar.com.br</strong>. Responderemos em até <strong>15 dias úteis</strong>.</p>
        </>
      ),
    },
    {
      id: 'retecao',
      icon: FaClock,
      title: 'Retenção de Dados',
      content: (
        <>
          <p>Seus dados são mantidos pelo tempo necessário para cumprir as finalidades descritas nesta política:</p>
          <ul>
            <li><strong>Dados de cadastro:</strong> enquanto sua conta estiver ativa ou por até 6 meses após solicitação de exclusão</li>
            <li><strong>Interações (comentários, feedbacks):</strong> mantidos para histórico do debate, anonimizados após 2 anos</li>
            <li><strong>Logs de acesso:</strong> 6 meses para fins de segurança (conforme Marco Civil da Internet)</li>
            <li><strong>Dados de navegação agregados:</strong> indefinidamente, sem identificação pessoal</li>
          </ul>
          <p>Após o período de retenção, os dados são eliminados de forma segura ou anonimizados.</p>
        </>
      ),
    },
    {
      id: 'menores',
      icon: FaUserSecret,
      title: 'Dados de Crianças e Adolescentes',
      content: (
        <>
          <p>O CineMar não coleta intencionalmente dados de crianças menores de 13 anos. Nossa plataforma é destinada a maiores de 13 anos, e recomendamos que jovens entre 13 e 18 anos utilizem o site com supervisão dos responsáveis.</p>
          <p>Se você é responsável e acredita que seu filho nos forneceu dados sem seu consentimento, entre em contato para que possamos eliminar as informações.</p>
          <p>Para adolescentes entre 13 e 18 anos, exigimos consentimento dos responsáveis para coleta de dados sensíveis (ex.: foto, informações de contato).</p>
        </>
      ),
    },
    {
      id: 'atualizacoes',
      icon: FaSync,
      title: 'Atualizações da Política',
      content: (
        <>
          <p>Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças em nossas práticas, na legislação ou na plataforma.</p>
          <p>Quando houver alterações significativas:</p>
          <ul>
            <li>Atualizaremos a data de última revisão no topo desta página</li>
            <li>Notificaremos usuários cadastrados por e-mail</li>
            <li>Exibiremos um aviso na plataforma no primeiro acesso</li>
          </ul>
          <p>Recomendamos revisar esta página periodicamente. O uso continuado da plataforma após alterações implica aceitação da nova política.</p>
        </>
      ),
    },
    {
      id: 'contato',
      icon: FaEnvelope,
      title: 'Encarregado de Dados (DPO)',
      content: (
        <>
          <p>Para questões relacionadas ao tratamento de dados pessoais, você pode entrar em contato com nosso Encarregado (Data Protection Officer):</p>
          
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} aria-hidden="true" />
              <div>
                <strong>E-mail (DPO)</strong>
                <a href="mailto:dpo@cinemar.com.br">dpo@cinemar.com.br</a>
              </div>
            </div>
            <div className={styles.contactItem}>
              <FaShieldAlt className={styles.contactIcon} aria-hidden="true" />
              <div>
                <strong>E-mail geral</strong>
                <a href="mailto:privacidade@cinemar.com.br">privacidade@cinemar.com.br</a>
              </div>
            </div>
          </div>

          <p><strong>Prazo de resposta:</strong> até 15 dias úteis para solicitações de dados pessoais.</p>
          <p><strong>Canais oficiais de atendimento:</strong> Apenas os e-mails acima. Não tratamos dados pessoais por redes sociais.</p>
        </>
      ),
    },
    {
      id: 'jurisdicao',
      icon: FaGavel,
      title: 'Legislação e Foro',
      content: (
        <>
          <p>Esta Política de Privacidade é regida pelas leis da República Federativa do Brasil, em especial:</p>
          <ul>
            <li><strong>Lei Geral de Proteção de Dados</strong> — LGPD (Lei nº 13.709/2018)</li>
            <li><strong>Marco Civil da Internet</strong> (Lei nº 12.965/2014)</li>
            <li><strong>Código de Defesa do Consumidor</strong> (Lei nº 8.078/1990)</li>
          </ul>
          <p>Fica eleito o foro da comarca de Fortaleza, Estado do Ceará, para dirimir quaisquer controvérsias decorrentes desta Política, com renúncia expressa a qualquer outro foro, por mais privilegiado que seja.</p>
          <p>Para usuários internacionais, aplicam-se as leis brasileiras independentemente de onde estejam localizados.</p>
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
              <FaShieldAlt aria-hidden="true" /> LGPD
            </div>
            <h1 className={styles.heroTitle}>Política de Privacidade</h1>
            <p className={styles.heroSubtitle}>
              Seus dados são importantes para nós. Saiba como coletamos, usamos e protegemos suas informações.
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
            <FaLock className={styles.noticeIcon} aria-hidden="true" />
            <p>
              A CineMar respeita sua privacidade e está comprometida com a proteção de seus dados pessoais
              em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </div>

          {/* Seções */}
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isOpen = openSections.has(section.id);
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
              <FaShieldAlt className={styles.docFooterLogo} aria-hidden="true" />
              <div>
                <strong>CineMar</strong>
                <p>Plataforma cultural de cinema e debate</p>
              </div>
            </div>
            <p className={styles.docFooterNote}>
              Esta Política de Privacidade é um documento vivo e será atualizada conforme necessário.
              Em caso de conflito entre versões, prevalece a versão mais recente publicada neste site.
            </p>
            <div className={styles.docFooterLinks}>
              <Link to="/">Página Inicial</Link>
              <span>·</span>
              <Link to="/termos-de-uso">Termos de Uso</Link>
              <span>·</span>
              <Link to="/members">Nossa Equipe</Link>
              <span>·</span>
              <a href="mailto:dpo@cinemar.com.br">Contato DPO</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}