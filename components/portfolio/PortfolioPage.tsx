"use client";

import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowRight, FaArrowUp, FaArrowUpRightFromSquare, FaCode, FaTrophy } from "react-icons/fa6";
import Reveal from "./Reveal";
import { marqueeProjects, skillGroups } from "./data";
import Footer from "./sections/Footer";
import Navigation from "./sections/Navigation";

const tag = (text: string) => <span className="tag" key={text}>{text}</span>;
const roles = ["Backend Developer", "System Builder", "Problem Solver"];

export default function PortfolioPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<{ name: string; image: string } | null>(null);

  useEffect(() => {
    const welcomeTimer = window.setTimeout(() => setShowWelcome(false), 2400);
    const roleTimer = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % roles.length);
    }, 2600);
    const updateScrollProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0);
      setShowBackToTop(window.scrollY > 520);
    };
    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    const elements = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => entry.target.classList.add("in-view"));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
    elements.forEach((element) => observer.observe(element));
    return () => {
      window.clearTimeout(welcomeTimer);
      window.clearInterval(roleTimer);
      window.removeEventListener("scroll", updateScrollProgress);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!selectedCertificate) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedCertificate(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedCertificate]);

  return (
    <>
      <div className="page-decor" aria-hidden="true">
        <div className="page-orb page-orb-one" />
        <div className="page-orb page-orb-two" />
        <div className="page-orb page-orb-three" />
        <div className="page-bubble page-bubble-one" />
        <div className="page-bubble page-bubble-two" />
        <div className="page-bubble page-bubble-three" />
        <div className="page-cube page-cube-one"><span /><span /><span /><span /><span /><span /></div>
        <div className="page-cube page-cube-two"><span /><span /><span /><span /><span /><span /></div>
      </div>
      <div
        className="portfolio-page"
        onMouseMove={(event) => {
          const target = event.currentTarget;
          target.style.setProperty("--pointer-x", `${event.clientX}px`);
          target.style.setProperty("--pointer-y", `${event.clientY}px`);
        }}
      >
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
      <div className={`welcome-screen ${showWelcome ? "" : "welcome-screen-hidden"}`} aria-hidden={!showWelcome}>
        <div className="welcome-glow welcome-glow-one" />
        <div className="welcome-glow welcome-glow-two" />
        <div className="welcome-content">
          <span className="welcome-kicker">Hello, world!</span>
          <h2>Hi, Welcome To My Portfolio</h2>
          <span className="welcome-line" />
        </div>
      </div>
      <Navigation />
      <header className="hero hero-reference">
        <div className="wrap hero-grid">
          <div className="hero-inner">
            <Reveal><span className="availability"><span className="availability-dot" /> Available for backend projects</span></Reveal>
            <Reveal><span className="hero-kicker">Backend Developer · Prayagraj, India</span></Reveal>
            <Reveal delay={0.1}><h1>Utkarsh<br /><span>Gupta</span></h1></Reveal>
            <Reveal delay={0.15}><div className="hero-role"><span>I&apos;m a</span><strong key={roles[roleIndex]}>{roles[roleIndex]}</strong><i>|</i></div></Reveal>
            <Reveal delay={0.2}><p className="lede">I like the moment a messy idea becomes a working service. I spend most days with Java, Spring Boot, queues and databases, trying to make the parts behind an app feel simple.</p></Reveal>
            <Reveal className="hero-stats" delay={0.3}>
              <div><strong>06</strong><span>Featured<br />projects</span></div>
              <div><strong>250+</strong><span>Problems<br />solved</span></div>
            </Reveal>
            <Reveal className="hero-cta" delay={0.4}><a className="btn btn-solid" href="#work">Explore my work <FaArrowUpRightFromSquare aria-hidden="true" /></a></Reveal>
            <Reveal className="hero-socials" delay={0.5}>
              <a href="https://github.com/Utkarsh-Gupta-Git-Hub" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://linkedin.com/in/utkarsh-gupta-8a1611294" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://leetcode.com/u/dVLRU9fohL/" target="_blank" rel="noreferrer">LeetCode</a>
              <a href="mailto:utkarshgupta2307@gmail.com">Email</a>
            </Reveal>
          </div>
          <Reveal className="hero-portrait" delay={0.2}>
            <div className="portrait-frame"><div className="photo-well"><img className="hero-profile-image" src="/profile.png" alt="Utkarsh Gupta" /></div></div>
          </Reveal>
        </div>
        <div className="hero-scroll wrap"><span>Scroll to explore</span><FaArrowDown aria-hidden="true" /></div>
      </header>

      <section id="about"><div className="wrap about-grid"><div><Reveal><span className="eyebrow">A little about me</span></Reveal><Reveal delay={0.1}><p>I&apos;m Utkarsh, a final-year <strong>B.Tech Computer Science</strong> student at Gurukula Kangri Vishwavidyalaya. I learned most of my backend habits by building things, breaking them, and then figuring out why.</p></Reveal><Reveal delay={0.2}><p>These days I work on the less visible parts of products: APIs, event queues, authentication and rate limits. I enjoy the detective work of finding the one slow query or lost message that makes a whole system feel unreliable.</p></Reveal><Reveal delay={0.3}><p>Outside code, I&apos;m usually learning something new, solving a problem on LeetCode, or sketching the next small project I want to try.</p></Reveal></div>
        <Reveal className="facts" delay={0.2}><ul><li><span className="k">Location</span><span className="v">Prayagraj, UP, India</span></li><li><span className="k">Degree</span><span className="v">B.Tech CSE, GKV Haridwar</span></li><li><span className="k">CGPA</span><span className="v accent-text">8.6 / 10</span></li><li><span className="k">Currently</span><span className="v">Backend Developer</span></li><li><span className="k">LeetCode</span><span className="v">250+ problems solved</span></li><li><span className="k">Focus</span><span className="v">Java · Spring Boot · Distributed Systems</span></li></ul></Reveal>
      </div></section>

      <section id="stack" className="alt skills-section"><div className="skills-orb skills-orb-one" /><div className="skills-orb skills-orb-two" /><div className="skills-bubble bubble-one" /><div className="skills-bubble bubble-two" /><div className="skills-cube cube-one"><span /><span /><span /><span /><span /><span /></div><div className="skills-cube cube-two"><span /><span /><span /><span /><span /><span /></div><div className="wrap"><div className="sec-head"><Reveal><span className="eyebrow">My everyday toolkit</span></Reveal><Reveal delay={0.1}><h2>The tools I reach for first</h2></Reveal><Reveal delay={0.2}><p className="section-intro">I don&apos;t try to use everything. These are the technologies I&apos;ve spent time with and would happily pick up again.</p></Reveal></div><div className="skill-cloud">{skillGroups.map(([name, items], groupIndex) => <div className={`skill-group skill-group-${groupIndex + 1}`} key={name}><Reveal><h3>{name}</h3></Reveal><div className="skill-pills">{items.map((item, itemIndex) => <Reveal delay={0.05 * itemIndex} key={item}><span className="skill-pill"><span className="skill-pill-dot" />{item}</span></Reveal>)}</div></div>)}</div><Reveal delay={0.25}><p className="skills-hint">Hover a skill to explore</p></Reveal></div></section>

      <section id="deep-dive" className="deep-dive"><div className="deep-dive-glow deep-dive-glow-one" /><div className="deep-dive-glow deep-dive-glow-two" /><div className="wrap"><div className="sec-head"><Reveal><span className="eyebrow">More to explore</span></Reveal><Reveal delay={0.1}><h2>Deep dive</h2></Reveal></div><div className="deep-dive-grid">
        <Reveal className="dive-card certificate-card"><span className="dive-icon"><FaTrophy aria-hidden="true" /></span><h3>Certificate Vault</h3><div className="dive-stats"><div><strong>10</strong><span>Certificates</span></div><div><strong>05</strong><span>Internships</span></div><div><strong>01</strong><span>NPTEL Elite</span></div></div><p>Redis, Spring, AI, cloud and project management learning from Redis, IBM, HP, Udemy and NPTEL.</p><a href="#education">Explore <FaArrowRight aria-hidden="true" /></a></Reveal>
        <Reveal className="dive-card leetcode-card" delay={0.1}><span className="dive-icon"><FaCode aria-hidden="true" /></span><h3>LeetCode Arena</h3><strong className="dive-number">250+</strong><span className="dive-label">problems solved</span><div className="dive-rings"><span><i>90+</i><small>Easy</small></span><span><i>75+</i><small>Medium</small></span><span><i>10+</i><small>Hard</small></span></div><a href="https://leetcode.com/u/dVLRU9fohL/" target="_blank" rel="noreferrer">Explore <FaArrowRight aria-hidden="true" /></a></Reveal>
        <Reveal className="dive-card github-card" delay={0.2}><span className="dive-icon"><FaCode aria-hidden="true" /></span><h3>GitHub Stats</h3><div className="dive-stats"><div><strong>06</strong><span>Featured repos</span></div><div><strong>250+</strong><span>DSA solved</span></div><div><strong>∞</strong><span>Ideas shipped</span></div></div><p className="dive-subtitle">Top toolkit</p><div className="dive-tags"><span>Java</span><span>Spring Boot</span><span>Kafka</span><span>Redis</span><span>AI</span></div><a href="https://github.com/Utkarsh-Gupta-Git-Hub" target="_blank" rel="noreferrer">Explore <FaArrowRight aria-hidden="true" /></a></Reveal>
      </div></div></section>

      <div className="marquee"><div className="marquee-track">{[...marqueeProjects, ...marqueeProjects].map(([name, short], i) => <div className="m-item" key={`${name}-${i}`}>{name} <span className="mono-tag">{short}</span></div>)}</div></div>

      <section id="work"><div className="wrap"><div className="sec-head"><Reveal><span className="eyebrow">Selected work</span></Reveal><Reveal delay={0.1}><h2>Systems that speak for themselves</h2></Reveal></div><div className="project-grid">
        {[
          ["01 / civic infrastructure", "Smart Civic Complaint Management System", "An event-driven platform for filing and routing civic complaints, with service discovery, centralized configuration and Kafka messaging underneath. AI prioritizes incoming complaints, while circuit breakers, bulkheads, rate limiting and a retry-plus-dead-letter-queue setup keep the system upright when a downstream service misbehaves.", ["Java 21", "Spring Boot", "Kafka", "Spring AI", "Ollama", "Resilience4j"], "https://github.com/Utkarsh-Gupta-Git-Hub/Complience_System"],
          ["03 / fintech", "Finance Platform Backend", "A microservices backend for personal expense management. JWT auth and RBAC guard the API, RabbitMQ carries events between services, and the Gemini API runs asynchronous spending analysis without blocking the request path.", ["Spring Boot", "RabbitMQ", "JWT", "Gemini API", "MongoDB"], undefined],
          ["05 / infrastructure", "Token Bucket Rate Limiter", "A distributed rate limiter built on Redis and Lua, enforcing limits per IP and per user/endpoint so one client can&apos;t take down an API for everyone else.", ["Java 21", "Redis", "Lua", "Docker"], "https://github.com/Utkarsh-Gupta-Git-Hub/TokenBucketRateLimiter"],
          ["06 / applied ai", "Ollama RAG", "A retrieval-augmented generation app running entirely on a locally hosted LLM, so answers stay grounded in retrieved context instead of the model&apos;s own guesses.", ["Spring AI", "Ollama", "RAG"], "https://github.com/Utkarsh-Gupta-Git-Hub/Ollama-Rag"],
        ].map(([idx, name, description, tags, link], i) => <Reveal className={`project ${i < 2 ? "featured" : ""}`} delay={i === 1 ? 0.1 : 0} key={name as string}><div className="idx">{idx}</div><div className="project-head"><h3>{name}</h3>{link && <a className="link" href={link as string} target="_blank" rel="noreferrer">View code</a>}</div><p>{description}</p><div className="tags">{(tags as string[]).map(tag)}</div></Reveal>)}
      </div></div></section>

      <section className="now-building"><div className="wrap now-building-inner"><Reveal><span className="eyebrow">What I&apos;m curious about</span></Reveal><Reveal delay={0.1}><h2>Currently learning by building.</h2></Reveal><Reveal delay={0.2}><p>I&apos;m digging deeper into distributed systems and Spring AI, mostly by turning small ideas into working projects. The best conversations usually start with a real problem, not a perfect brief.</p></Reveal><Reveal className="now-building-actions" delay={0.3}><a className="btn btn-solid" href="mailto:utkarshgupta2307@gmail.com">Say hello <FaArrowUpRightFromSquare aria-hidden="true" /></a><a className="text-link" href="#contact">See contact details</a></Reveal></div><div className="now-building-shape shape-one" /><div className="now-building-shape shape-two" /></section>

      <section id="process" className="alt"><div className="wrap"><div className="sec-head"><Reveal><span className="eyebrow">How I work</span></Reveal><Reveal delay={0.1}><h2>From rough idea to reliable service</h2></Reveal></div><div className="process">{[["01", "Ask better questions", "I start with the user, the data and the awkward edge cases, not the framework."], ["02", "Make a small version", "A thin working path teaches me more than a week of designing every future feature."], ["03", "Try to break it", "I look for slow requests, bad inputs and failure points before someone else finds them."], ["04", "Keep it understandable", "Good code should make the next change easier, not turn every fix into archaeology."]].map(([num, title, text], i) => <Reveal className="proc-step" delay={i * 0.1} key={num}><span className="num">{num}</span><h3>{title}</h3><p>{text}</p></Reveal>)}</div></div></section>

      <section id="philosophy"><div className="wrap phil-grid"><div><Reveal><span className="eyebrow">The human bit</span></Reveal><Reveal delay={0.1}><p>I care about the parts of a product people only notice when they fail: the message that never arrives, the page that hangs, or the login that suddenly stops working.</p></Reveal><Reveal delay={0.2}><p>That is why I enjoy backend work. It is part engineering, part patience, and part asking “what happens if this goes wrong?” before shipping.</p></Reveal><Reveal delay={0.3}><p>&quot;Make it work. Then make it clear. Then make it kind to the next person.&quot;</p></Reveal></div><Reveal className="avatar-block" delay={0.2}><div className="avatar-circle">UG</div><div className="name">Utkarsh Gupta</div><div className="role">Backend Developer &amp; Final-Year CS Student</div><div className="since mono">Prayagraj · GKV Haridwar</div></Reveal></div></section>

      <section id="experience" className="alt credentials-section"><div className="wrap"><div className="sec-head"><Reveal><span className="eyebrow">Experience</span></Reveal><Reveal delay={0.1}><h2>Where I&apos;ve learned by doing</h2></Reveal><Reveal delay={0.2}><p className="section-intro">A short record of the places that gave me room to try, ask questions and ship something useful.</p></Reveal></div><div className="experience-timeline">{[["Internship", "Java Developer Intern", "Oasis Infobyte", "Practised Java fundamentals by turning small requirements into working applications."], ["Internship", "Java Developer Intern", "ShadowFox", "Worked through practical development tasks and got more comfortable reading code written by others."], ["Internship", "AI & Cloud Technology", "IBM SkillsBuild · Edunet Foundation", "Explored cloud concepts and the building blocks behind modern AI products."], ["Internship", "Data Analyst", "IBM SkillsBuild · CSRBOX", "Used data cleaning and analysis to turn raw information into something people could use."], ["Internship", "Python Programming", "VaultofCodes", "Built a stronger base in Python through guided projects and regular practice."]].map(([when, title, org, text], i) => <Reveal className="experience-card" delay={i * 0.05} key={`${title}-${org}`}><div className="experience-marker">{String(i + 1).padStart(2, "0")}</div><div className="experience-body"><span className="when">{when}</span><h3>{title}</h3><div className="org">{org}</div><p>{text}</p></div><div className="experience-arrow"><FaArrowUpRightFromSquare aria-hidden="true" /></div></Reveal>)}</div></div></section>

      <section id="education"><div className="wrap edu-cert-grid"><div><Reveal><span className="eyebrow">Education</span></Reveal><Reveal delay={0.1}><h2 className="small-heading">Grounded in fundamentals</h2></Reveal>{[["Gurukula Kangri Vishwavidyalaya, Haridwar", "B.Tech, Computer Science & Engineering", "CGPA 8.6 / 10 · Graduating 2027"], ["Saroj VidyaShankar Inter College", "Intermediate, UP Board", "90.8%"], ["Saroj VidyaShankar Inter College", "High School, UP Board", "84.5%"]].map(([name, degree, score], i) => <Reveal className="edu-item" delay={0.15 + i * 0.05} key={degree}><h3>{name}</h3><div className="deg">{degree}</div><div className="score">{score}</div></Reveal>)}</div><div><Reveal><span className="eyebrow">Certifications</span></Reveal><Reveal delay={0.1}><h2 className="small-heading">Milestones worth showing</h2></Reveal><div className="certificate-grid">{[["Get Started with Redis", "Redis", "/CertificateImage/Redis Certificate_page.jpg"], ["Generative AI Mastermind", "IBM SkillsBuild", "/CertificateImage/AI Ibm.jpg"], ["Agile Project Management Foundation", "HP", "/CertificateImage/Agile Project Management_page.jpg"], ["GitHub Certificate", "GitHub", "/CertificateImage/GitHub Certificate_page.jpg"], ["JDBC, DAO & SQL: Practical Crash Course", "Udemy", "/CertificateImage/JDBC Certificate.jpg"], ["Forward Learning Program", "McKinsey & Co.", "/CertificateImage/Mckensy Certificate.jpg"], ["National Entrepreneurship Challenge", "E-Cell, IIT Bombay", "/CertificateImage/NEC Certificate.jpg"], ["React Certificate", "React", "/CertificateImage/React Certificate_page.jpg"], ["Spring Boot", "IBM SkillsBuild", "/CertificateImage/Spring Boot IBM Certificate_page.jpg"], ["Spring Framework & Dependency Injection", "IBM SkillsBuild", "/CertificateImage/Spring Framework IBM Certificate_page.jpg"]].map(([name, issuer, image], i) => <Reveal className="certificate-card" delay={0.1 + i * 0.04} key={name}>      <button className="certificate-preview certificate-image-button" type="button" onClick={() => setSelectedCertificate({ name, image })} aria-label={`Open ${name} certificate`}><img src={image} alt="" /><span>Click to view</span></button>      <div className="certificate-info"><div className="certificate-meta"><span className="certificate-label">Verified credential</span><span className="certificate-provider-mark">{issuer.slice(0, 1)}</span></div><h3>{name}</h3><div className="certificate-provider"><span className="issuer">{issuer}</span><span className="certificate-arrow"><FaArrowUpRightFromSquare aria-hidden="true" /></span></div></div></Reveal>)}</div></div></div></section>

      <section className="cta-final alt" id="contact"><div className="wrap inner"><Reveal><span className="eyebrow centered">If this sounds like your kind of work</span></Reveal><Reveal delay={0.1}><h2>Let&apos;s make something that earns its place.</h2></Reveal><Reveal className="hero-cta centered" delay={0.2}><a className="btn btn-solid" href="mailto:utkarshgupta2307@gmail.com">Send me a note</a><a className="btn btn-line" href="/resume.pdf" target="_blank" rel="noreferrer">Download Resume <FaArrowDown aria-hidden="true" /></a></Reveal></div></section>
      <Footer />
      {selectedCertificate && <div className="certificate-lightbox" role="dialog" aria-modal="true" aria-label={`${selectedCertificate.name} certificate`} onClick={() => setSelectedCertificate(null)}><div className="certificate-lightbox-content" onClick={(event) => event.stopPropagation()}><button className="certificate-lightbox-close" type="button" onClick={() => setSelectedCertificate(null)} aria-label="Close certificate">×</button><img src={selectedCertificate.image} alt={`${selectedCertificate.name} certificate`} /><p>{selectedCertificate.name}</p></div></div>}
      {showBackToTop && <button className="back-to-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top"><FaArrowUp aria-hidden="true" /></button>}
      </div>
    </>
  );
}
