import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const githubUrl = 'https://github.com/Elihuangsddf';
const githubReposUrl = `${githubUrl}?tab=repositories`;
const githubApi = 'https://api.github.com/users/Elihuangsddf/repos?sort=updated&direction=desc&per_page=100';
const linkedinUrl = 'https://www.linkedin.com/in/elihú-neftalí-ángeles-pérez-866942377';

const skillGroups = {
  software: ['Python', 'JavaScript', 'Java', 'C#', 'C++', 'HTML5 & CSS3', 'Git'],
  web: ['React', 'Node.js', 'Django', 'Flask', 'Spring Boot', 'Firebase', 'Supabase', 'Railway', 'Docker'],
  data: ['MySQL', 'PostgreSQL', 'Figma', 'Postman', 'GitHub', 'Android Studio'],
  networks: ['DHCP', 'Static routing', 'Windows Directory', 'Cisco Packet Tracer', 'Ubuntu Server', 'Arduino', 'ESP32', 'Sensors']
};

const fallbackRepos = [
  ['Rick_and_Morty_Appi_Flask', 'CSS', '2026-09-01T19:37:08Z'],
  ['BarberShop_App_Movil-Web', 'Kotlin', '2026-08-15T00:14:56Z'],
  ['RANDOMUSER_APP_ELIHU', 'CSS', '2026-08-07T02:20:01Z'],
  ['WorkSpaceHub', 'TypeScript', '2026-08-06T10:23:43Z'],
  ['App_RH_CRUD', 'Kotlin', '2026-08-06T10:22:05Z'],
  ['Elihuangsddf', null, '2026-07-30T02:47:20Z'],
  ['ServicioRender_Docker_Yarn', 'Dockerfile', '2026-07-19T03:11:10Z'],
  ['AmazonDjangoClon', 'Python', '2026-07-19T03:11:07Z'],
  ['StreamlitAutomatas', 'Jupyter Notebook', '2026-07-19T03:11:01Z']
].map(([name, language, updated_at], index) => ({ id: index + 1, name, language, updated_at, html_url: `${githubUrl}/${name}` }));

const repoDescriptions = {
  Rick_and_Morty_Appi_Flask: { es: 'Aplicación web construida con Flask que consume información de una API externa.', en: 'Web application built with Flask that consumes data from an external API.' },
  'BarberShop_App_Movil-Web': { es: 'Solución móvil y web para la operación y experiencia de una barbería.', en: 'Mobile and web solution for barbershop operations and customer experience.' },
  RANDOMUSER_APP_ELIHU: { es: 'Aplicación en Flask para consumir y mostrar datos de la API RandomUser.', en: 'Flask application for consuming and displaying data from the RandomUser API.' },
  WorkSpaceHub: { es: 'Proyecto desarrollado con TypeScript para centralizar herramientas y espacios de trabajo.', en: 'TypeScript project designed to centralize tools and workspaces.' },
  App_RH_CRUD: { es: 'Aplicación móvil CRUD orientada a la gestión de recursos humanos.', en: 'Mobile CRUD application focused on human resources management.' },
  Elihuangsddf: { es: 'Repositorio de presentación y configuración del perfil de GitHub.', en: 'Presentation and configuration repository for the GitHub profile.' },
  ServicioRender_Docker_Yarn: { es: 'Servicio preparado para despliegue utilizando Docker y Yarn.', en: 'Deployment-ready service built with Docker and Yarn.' },
  AmazonDjangoClon: { es: 'Clon funcional de Amazon desarrollado con Django.', en: 'Functional Amazon clone developed with Django.' },
  StreamlitAutomatas: { es: 'Proyecto interactivo sobre autómatas desarrollado con Streamlit y notebooks.', en: 'Interactive automata project developed with Streamlit and notebooks.' }
};

const copy = {
  es: {
    locale: 'es-MX', documentLang: 'es-419', title: 'Elihú Ángeles Pérez — Software, Cloud y Redes', description: 'Portafolio profesional de Elihú Neftalí Ángeles Pérez, estudiante de Ingeniería en Tecnologías de la Información.',
    nav: { about: 'Sobre mí', experience: 'Experiencia', projects: 'Proyectos', contact: 'Hablemos', menu: 'Abrir menú', language: 'Seleccionar idioma' },
    hero: { status: 'Disponible para nuevas oportunidades', line1: 'Construyo', accent: 'soluciones', line3: 'que conectan.', intro: 'Estudiante de Ingeniería en Tecnologías de la Información con enfoque en desarrollo de software, cloud computing y redes.', projects: 'Explorar proyectos', know: 'Conóceme mejor', art: 'Ilustración abstracta de redes y tecnología', scroll: 'Desliza para explorar' },
    stats: { achievements: 'logros competitivos', repos: 'repositorios públicos', since: 'inicio de formación TI', note1: 'Ingeniería con propósito', note2: 'y evolución constante.' },
    about: { label: '01 / SOBRE MÍ', title: 'Perfil', accent: 'híbrido.', lead: 'Me muevo entre el código, la infraestructura y el hardware para entender el sistema completo.', body: 'Actualmente curso el noveno cuatrimestre de Ingeniería en Tecnologías de la Información en la Universidad Politécnica Metropolitana de Hidalgo. Me interesa convertir problemas complejos en experiencias digitales claras, confiables y bien construidas.', signature: '— curiosidad + ejecución', tabs: { software: 'Software', web: 'Web y Cloud', data: 'Datos y Diseño', networks: 'Redes y Hardware' } },
    experience: { label: '02 / EXPERIENCIA Y LOGROS', title: 'Momentos que', accent: 'marcan la diferencia.', intro: 'Experiencias que combinan presión, colaboración y el deseo de seguir aprendiendo.', items: [
      ['2026', '✦', 'RECONOCIMIENTO · CLOUD', 'Huawei ICT Competition', '2.º lugar a nivel nacional en la categoría Cloud Computing, representando a la UPMH junto con mi equipo.'],
      ['2025', '+', 'ESTADÍAS PROFESIONALES', 'The Excellence Collection', 'Configuración y administración de redes y bases de datos para la operación de Excellence Riviera Cancún. Soporte a equipos, telefonía y switches.'],
      ['2025', '⚡', 'ELECTRÓNICA · ESP32', 'Rally de Electrónica', '1.er lugar desarrollando sistemas electrónicos y resolviendo el reto con microcontroladores ESP32.'],
      ['2024', '◉', 'ROBÓTICA · AUTONOMÍA', 'Carrito seguidor de línea', '2.º lugar regional por equipos, programando y calibrando sensores para navegación autónoma.']
    ] },
    projects: { label: '03 / REPOSITORIOS DE GITHUB', title: 'Trabajo que', accent: 'evoluciona.', live: 'Sincronizado con GitHub', syncing: 'Sincronizando…', fallback: 'Mostrando última versión', automatic: 'Actualización automática al cargar', repository: 'Repositorio', generic: 'Repositorio de {language} publicado en GitHub.', updated: 'Actualizado', all: 'Explorar todos los repositorios en GitHub' },
    education: { label: '04 / FORMACIÓN', current: '2023 — ACTUALIDAD', degree: 'Ingeniería en Tecnologías de la Información', university: 'Universidad Politécnica Metropolitana de Hidalgo (UPMH)', schoolYears: '2018 — 2021', technical: 'Técnico en Tecnologías de la Información', school: 'Colegio de Bachilleres del Estado de Hidalgo · CEMSAD San Cristóbal' },
    contact: { label: '05 / CONTACTO', title: '¿Construimos algo', accent: 'interesante?', location: 'Pachuca de Soto, Hidalgo, México', email: 'Correo', emailAction: 'Enviar mensaje', linkedin: 'LinkedIn', linkedinAction: 'Ver perfil profesional', github: 'GitHub', githubAction: 'Explorar repositorios' },
    footer: { made: 'Diseñado y desarrollado con curiosidad', top: 'Volver arriba ↑' }
  },
  en: {
    locale: 'en-US', documentLang: 'en', title: 'Elihú Ángeles Pérez — Software, Cloud & Networks', description: 'Professional portfolio of Elihú Neftalí Ángeles Pérez, Information Technology Engineering student.',
    nav: { about: 'About', experience: 'Experience', projects: 'Projects', contact: "Let's talk", menu: 'Open menu', language: 'Select language' },
    hero: { status: 'Available for new opportunities', line1: 'I build', accent: 'solutions', line3: 'that connect.', intro: 'Information Technology Engineering student focused on software development, cloud computing, and networks.', projects: 'Explore projects', know: 'Get to know me', art: 'Abstract illustration of networks and technology', scroll: 'Scroll to explore' },
    stats: { achievements: 'competitive achievements', repos: 'public repositories', since: 'IT journey started', note1: 'Engineering with purpose', note2: 'and constant evolution.' },
    about: { label: '01 / ABOUT ME', title: 'Hybrid', accent: 'profile.', lead: 'I move between code, infrastructure, and hardware to understand the complete system.', body: 'I am currently in the ninth term of Information Technology Engineering at Universidad Politécnica Metropolitana de Hidalgo. I am interested in turning complex problems into clear, reliable, and well-crafted digital experiences.', signature: '— curiosity + execution', tabs: { software: 'Software', web: 'Web & Cloud', data: 'Data & Design', networks: 'Networks & Hardware' } },
    experience: { label: '02 / EXPERIENCE & ACHIEVEMENTS', title: 'Moments that', accent: 'make a difference.', intro: 'Experiences that combine pressure, collaboration, and a drive to keep learning.', items: [
      ['2026', '✦', 'RECOGNITION · CLOUD', 'Huawei ICT Competition', '2nd place nationwide in the Cloud Computing category, representing UPMH together with my team.'],
      ['2025', '+', 'PROFESSIONAL INTERNSHIP', 'The Excellence Collection', 'Configured and managed networks and databases for Excellence Riviera Cancún operations. Supported computers, telephony, and network switches.'],
      ['2025', '⚡', 'ELECTRONICS · ESP32', 'Electronics Rally', '1st place developing electronic systems and solving the challenge with ESP32 microcontrollers.'],
      ['2024', '◉', 'ROBOTICS · AUTONOMY', 'Line-following robot', '2nd place regionally as a team, programming and calibrating sensors for autonomous navigation.']
    ] },
    projects: { label: '03 / GITHUB REPOSITORIES', title: 'Work that', accent: 'keeps evolving.', live: 'Synced with GitHub', syncing: 'Syncing…', fallback: 'Showing latest version', automatic: 'Automatically updated on load', repository: 'Repository', generic: '{language} repository published on GitHub.', updated: 'Updated', all: 'Explore all repositories on GitHub' },
    education: { label: '04 / EDUCATION', current: '2023 — PRESENT', degree: 'B.Eng. in Information Technology', university: 'Universidad Politécnica Metropolitana de Hidalgo (UPMH)', schoolYears: '2018 — 2021', technical: 'Information Technology Technician', school: 'Colegio de Bachilleres del Estado de Hidalgo · CEMSAD San Cristóbal' },
    contact: { label: '05 / CONTACT', title: 'Shall we build something', accent: 'interesting?', location: 'Pachuca de Soto, Hidalgo, Mexico', email: 'Email', emailAction: 'Send a message', linkedin: 'LinkedIn', linkedinAction: 'View professional profile', github: 'GitHub', githubAction: 'Explore repositories' },
    footer: { made: 'Designed and developed with curiosity', top: 'Back to top ↑' }
  }
};

const formatRepoName = (name) => name.replaceAll('_', ' ').replaceAll('-', ' ');

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.12 });
    const observe = () => ref.current?.querySelectorAll('.reveal:not(.is-visible)').forEach((element) => observer.observe(element));
    observe();
    const mutations = new MutationObserver(observe);
    if (ref.current) mutations.observe(ref.current, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutations.disconnect(); };
  }, []);
  return ref;
}

function Arrow() { return <span className="arrow">↗</span>; }

function ContactIcon({ type }) {
  if (type === 'linkedin') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5.2 7.3H1.6V22h3.6V7.3ZM3.4 1.9a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2ZM22.4 13.6c0-4.4-2.3-6.5-5.5-6.5-2.5 0-3.7 1.4-4.3 2.4V7.3H9V22h3.6v-7.3c0-1.9.4-3.8 2.8-3.8 2.4 0 2.4 2.2 2.4 3.9V22h3.6l1-8.4Z" /></svg>;
  if (type === 'github') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .7a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.6.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17 5 18 5.3 18 5.3c.6 1.5.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.8 5.4-5.5 5.7.4.4.8 1.1.8 2.2v3.1c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .7Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 5.5h18v13H3zM3.5 6l8.5 7 8.5-7" /></svg>;
}

function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem('portfolio-language') || 'es');
  const [menuOpen, setMenuOpen] = useState(false);
  const [skillTab, setSkillTab] = useState('software');
  const [repos, setRepos] = useState(fallbackRepos);
  const [repoStatus, setRepoStatus] = useState('syncing');
  const [scrollProgress, setScrollProgress] = useState(0);
  const page = useReveal();
  const t = copy[language];
  const closeMenu = () => setMenuOpen(false);
  const formatDate = (date) => new Intl.DateTimeFormat(t.locale, { month: 'short', year: 'numeric' }).format(new Date(date));

  const chooseLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem('portfolio-language', nextLanguage);
    closeMenu();
  };

  useEffect(() => {
    document.documentElement.lang = t.documentLang;
    document.title = t.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.description);
  }, [t]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(githubApi, { signal: controller.signal, cache: 'no-store', headers: { Accept: 'application/vnd.github+json' } })
      .then((response) => { if (!response.ok) throw new Error('GitHub API unavailable'); return response.json(); })
      .then((data) => { if (data.length) setRepos(data); setRepoStatus('live'); })
      .catch((error) => { if (error.name !== 'AbortError') setRepoStatus('fallback'); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(height > 0 ? (window.scrollY / height) * 100 : 0);
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const handlePointerMove = (event) => {
    page.current?.style.setProperty('--mouse-x', `${event.clientX}px`);
    page.current?.style.setProperty('--mouse-y', `${event.clientY}px`);
  };

  return (
    <div ref={page} className="site-shell" onPointerMove={handlePointerMove}>
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress / 100})` }} />
      <div className="grain" /><div className="cursor-aura" /><div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="nav-wrap"><nav className="nav container">
        <a href="#inicio" className="brand" onClick={closeMenu}><span className="brand-mark">ENAP</span><span className="brand-name">ELIHÚ NEFTALÍ ÁNGELES PÉREZ<span className="brand-dot">.</span></span></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={t.nav.menu} aria-expanded={menuOpen}><span /><span /></button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#sobre-mi" onClick={closeMenu}>{t.nav.about}</a><a href="#experiencia" onClick={closeMenu}>{t.nav.experience}</a><a href="#proyectos" onClick={closeMenu}>{t.nav.projects}</a><a href="#contacto" className="nav-cta" onClick={closeMenu}>{t.nav.contact} <Arrow /></a>
          <div className="language-switch" role="group" aria-label={t.nav.language}><button className={language === 'es' ? 'active' : ''} onClick={() => chooseLanguage('es')} aria-pressed={language === 'es'}>ES <span>Latam</span></button><button className={language === 'en' ? 'active' : ''} onClick={() => chooseLanguage('en')} aria-pressed={language === 'en'}>EN <span>English</span></button></div>
        </div>
      </nav></header>

      <main>
        <section id="inicio" className="hero container"><div className="hero-copy"><div className="eyebrow"><span className="pulse" /> {t.hero.status}</div><h1>{t.hero.line1}<br /><em>{t.hero.accent}</em><br />{t.hero.line3}</h1><p className="hero-intro">{t.hero.intro}</p><div className="hero-actions"><a href="#proyectos" className="button button-primary">{t.hero.projects} <Arrow /></a><a href="#contacto" className="text-link">{t.hero.know} <Arrow /></a></div></div>
          <div className="hero-art" aria-label={t.hero.art}><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><div className="core"><span className="core-label">ENAP</span><span className="core-caption">IT<br />ENGINEERING</span></div><span className="float-card card-cloud">CLOUD <strong>02</strong></span><span className="float-card card-code">&lt;/&gt;</span><span className="float-card card-network">◌ <strong>NETWORKS</strong></span></div><div className="scroll-cue"><span>{t.hero.scroll}</span><i /></div>
        </section>

        <section className="stat-strip"><div className="container stats"><div><strong>03</strong><span>{t.stats.achievements}</span></div><div><strong>{String(repos.length).padStart(2, '0')}</strong><span>{t.stats.repos}</span></div><div><strong>2023</strong><span>{t.stats.since}</span></div><div className="stat-note">{t.stats.note1}<br /><span>{t.stats.note2}</span></div></div></section>
        <div className="expertise-marquee" aria-hidden="true"><div className="marquee-track"><span>SOFTWARE ENGINEERING</span><i>✦</i><span>CLOUD COMPUTING</span><i>✦</i><span>NETWORK INFRASTRUCTURE</span><i>✦</i><span>FULL-STACK DEVELOPMENT</span><i>✦</i><span>SOFTWARE ENGINEERING</span><i>✦</i><span>CLOUD COMPUTING</span><i>✦</i></div></div>

        <section id="sobre-mi" className="section container about-section"><div className="section-label reveal">{t.about.label}</div><div className="about-grid"><div className="about-title reveal"><h2>{t.about.title}<br /><em>{t.about.accent}</em></h2><div className="vertical-line" /></div><div className="about-body reveal"><p className="lead">{t.about.lead}</p><p>{t.about.body}</p><div className="signature">Elihú Neftalí Ángeles Pérez <span>{t.about.signature}</span></div></div></div><div className="skills-panel reveal"><div className="skills-tabs">{Object.keys(skillGroups).map((tab) => <button key={tab} className={skillTab === tab ? 'active' : ''} onClick={() => setSkillTab(tab)}>{t.about.tabs[tab]}</button>)}</div><div className="skill-cloud">{skillGroups[skillTab].map((skill, index) => <span key={skill} style={{ '--i': index }}>{skill}</span>)}</div></div></section>

        <section id="experiencia" className="section experience-section"><div className="container"><div className="section-label reveal">{t.experience.label}</div><div className="experience-heading reveal"><h2>{t.experience.title}<br /><em>{t.experience.accent}</em></h2><p>{t.experience.intro}</p></div><div className="timeline">{t.experience.items.map(([year, icon, tag, title, text], index) => <article className="timeline-item reveal" key={`${language}-${title}`}><div className="timeline-year">{year}</div><div className="timeline-marker">{icon}</div><div className="timeline-content"><span className={`tag tag-${['lime', 'orange', 'pink', 'blue'][index]}`}>{tag}</span><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>

        <section id="proyectos" className="section container projects-section"><div className="section-label reveal">{t.projects.label}</div><div className="projects-top reveal"><h2>{t.projects.title}<br /><em>{t.projects.accent}</em></h2><div className="github-sync"><span className={`sync-dot ${repoStatus}`} />{repoStatus === 'live' ? t.projects.live : repoStatus === 'syncing' ? t.projects.syncing : t.projects.fallback}<small>{t.projects.automatic}</small></div></div><div className="project-grid">{repos.map((repo, index) => {
          const languageLabel = repo.language || t.projects.repository;
          const description = repoDescriptions[repo.name]?.[language] || repo.description || t.projects.generic.replace('{language}', languageLabel);
          return <a className="project-card repo-card" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.id ?? repo.name} style={{ '--delay': `${index * 70}ms` }}><div className="project-top"><span>{String(index + 1).padStart(2, '0')}</span><Arrow /></div><span className="tag">{languageLabel}</span><h3>{formatRepoName(repo.name)}</h3><p>{description}</p><div className="repo-meta"><span>{t.projects.updated} {formatDate(repo.updated_at)}</span><span>{repo.stargazers_count ?? 0} ★</span></div></a>;
        })}</div><a className="github-all reveal" href={githubReposUrl} target="_blank" rel="noreferrer"><span>{t.projects.all}</span><Arrow /></a></section>

        <section className="education-section"><div className="container education-grid"><div className="section-label reveal">{t.education.label}</div><div className="education-content reveal"><div className="edu-item"><span className="edu-year">{t.education.current}</span><h3>{t.education.degree}</h3><p>{t.education.university}</p></div><div className="edu-item"><span className="edu-year">{t.education.schoolYears}</span><h3>{t.education.technical}</h3><p>{t.education.school}</p></div></div></div></section>
        <section id="contacto" className="contact-section"><div className="container contact-inner"><div className="section-label">{t.contact.label}</div><h2 className="reveal">{t.contact.title}<br /><em>{t.contact.accent}</em></h2>
          <div className="contact-links reveal">
            <a className="contact-card" href="mailto:241110001@upmh.edu.mx" aria-label={`${t.contact.email}: 241110001@upmh.edu.mx`}><span className="contact-icon"><ContactIcon type="email" /></span><span className="contact-card-copy"><small>{t.contact.email}</small><strong>241110001@upmh.edu.mx</strong><em>{t.contact.emailAction}</em></span><Arrow /></a>
            <a className="contact-card" href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={`${t.contact.linkedin}: Elihú Neftalí Ángeles Pérez`}><span className="contact-icon linkedin"><ContactIcon type="linkedin" /></span><span className="contact-card-copy"><small>{t.contact.linkedin}</small><strong>Elihú Neftalí Ángeles Pérez</strong><em>{t.contact.linkedinAction}</em></span><Arrow /></a>
            <a className="contact-card" href={githubReposUrl} target="_blank" rel="noopener noreferrer" aria-label={`${t.contact.github}: Elihuangsddf`}><span className="contact-icon"><ContactIcon type="github" /></span><span className="contact-card-copy"><small>{t.contact.github}</small><strong>@Elihuangsddf</strong><em>{t.contact.githubAction}</em></span><Arrow /></a>
          </div>
          <div className="contact-meta reveal"><span>{t.contact.location}</span><span>+52 771 163 9926</span></div>
        </div></section>
      </main>
      <footer className="footer"><div className="container"><span>© 2026 ELIHÚ NEFTALÍ ÁNGELES PÉREZ</span><span>{t.footer.made}</span><a href="#inicio">{t.footer.top}</a></div></footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
