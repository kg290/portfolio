import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components - OPTIMIZED (reduced animations)
import AntiGravity from './components/AntiGravity/AntiGravity';
import Waves from './components/Waves/Waves';
import TargetCursor from './components/TargetCursor/TargetCursor';
import StaggeredMenu from './components/StaggeredMenu/StaggeredMenu';
import GooeyNav from './components/GooeyNav/GooeyNav';
import Lanyard from './components/Lanyard/Lanyard';
import TextReveal from './components/TextReveal/TextReveal';
import MagneticButton, { MagneticWrapper } from './components/MagneticButton/MagneticButton';
import SpotlightCard from './components/SpotlightCard/SpotlightCard';
import BorderBeam from './components/BorderBeam/BorderBeam';
import BlurFade from './components/BlurFade/BlurFade';
import { RetroGrid } from './components/GridPattern/GridPattern';
import { StatCard } from './components/NumberCounter/NumberCounter';
import GradientText from './components/GradientText/GradientText';
import Meteors from './components/Meteors/Meteors';
import Preloader from './components/Preloader/Preloader';
import { GlowButton, OutlineButton } from './components/ShinyButton/ShinyButton';
import PixelCard from './components/PixelCard/PixelCard';
import StarBorder from './components/StarBorder/StarBorder';

// Icons
import { 
  FaGithub, FaLinkedin, FaEnvelope, FaPython, FaReact, FaDocker, FaAws, 
  FaCode, FaBrain, FaRocket, FaGraduationCap, FaArrowRight, FaExternalLinkAlt, 
  FaTrophy, FaCertificate, FaStar, FaDatabase
} from 'react-icons/fa';
import { 
  SiTensorflow, SiPytorch, SiOpenai, SiKubernetes, SiMongodb, SiFastapi,
  SiTypescript, SiTailwindcss, SiNextdotjs, SiLangchain, SiHuggingface,
  SiGooglecloud, SiPostgresql, SiDocker, SiJavascript
} from 'react-icons/si';
import { cn } from './lib/utils';
import './App.css';

// Data
import {
  personalInfo,
  education,
  projects,
  skills,
  achievements,
  certifications,
  stats
} from './data/resumeData';

const NAV_ITEMS = [
  { label: 'Home', link: '#hero' },
  { label: 'Skills', link: '#skills' },
  { label: 'Projects', link: '#projects' },
  { label: 'Achievements', link: '#achievements' },
  { label: 'Certifications', link: '#certifications' },
  { label: 'Contact', link: '#contact' },
];

const TECH_ICONS = {
  Python: <FaPython size={18} />,
  TensorFlow: <SiTensorflow size={18} />,
  PyTorch: <SiPytorch size={18} />,
  React: <FaReact size={18} />,
  'Next.js': <SiNextdotjs size={18} />,
  TypeScript: <SiTypescript size={18} />,
  JavaScript: <SiJavascript size={18} />,
  FastAPI: <SiFastapi size={18} />,
  Docker: <SiDocker size={18} />,
  Kubernetes: <SiKubernetes size={18} />,
  AWS: <FaAws size={18} />,
  MongoDB: <SiMongodb size={18} />,
  PostgreSQL: <SiPostgresql size={18} />,
  'OpenAI APIs': <SiOpenai size={18} />,
  LangChain: <SiLangchain size={18} />,
  'Hugging Face': <SiHuggingface size={18} />,
  'Tailwind CSS': <SiTailwindcss size={18} />,
  'Google Cloud': <SiGooglecloud size={18} />,
};

function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const secs = sectionsRef.current.filter(Boolean);
    if (!secs.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionsRef.current.indexOf(entry.target);
            if (idx !== -1) setActiveSection(idx);
          }
        });
      },
      { threshold: 0.3 }
    );
    secs.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isLoaded]);

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Preloader onComplete={() => setIsLoaded(true)} minDuration={1500} />
      
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="app"
          >
            {/* BACKGROUND - OPTIMIZED */}
            <div className="fixed inset-0 z-0">
              <AntiGravity
                count={100}
                magnetRadius={12}
                ringRadius={10}
                waveSpeed={0.2}
                waveAmplitude={1}
                particleSize={1}
                lerpSpeed={0.03}
                color="#6366f1"
                autoAnimate={true}
                particleVariance={1}
                rotationSpeed={0.1}
                depthFactor={1}
                pulseSpeed={2}
                fieldStrength={6}
                particleShape="capsule"
              />
            </div>
            
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
              <Waves
                lineColor="rgba(99, 102, 241, 0.06)"
                backgroundColor="transparent"
                waveSpeedX={0.006}
                waveSpeedY={0.003}
                waveAmpX={30}
                waveAmpY={12}
              />
            </div>

            {/* CURSOR */}
            <TargetCursor targetSelector="button, a, .cursor-target, .project-card, .cert-card" />

            {/* NAVIGATION */}
            <StaggeredMenu
              items={NAV_ITEMS.map((item) => ({ label: item.label, link: item.link }))}
              socialItems={[
                { label: 'GitHub', link: personalInfo.github },
                { label: 'LinkedIn', link: personalInfo.linkedin },
                { label: 'Email', link: `mailto:${personalInfo.email}` },
              ]}
              colors={['#030303', '#6366f1']}
              accentColor="#6366f1"
              menuButtonColor="#fff"
              openMenuButtonColor="#fff"
              isFixed
              closeOnClickAway
            />

            <GooeyNav
              items={NAV_ITEMS.map((item) => ({ label: item.label, href: item.link }))}
              initialActiveIndex={activeSection}
            />

            {/* HERO SECTION */}
            <section 
              id="hero" 
              className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
              ref={(el) => (sectionsRef.current[0] = el)}
            >
              <div className="absolute inset-0 z-0">
                <RetroGrid className="opacity-25" />
              </div>
              
              <Meteors number={10} className="z-0" />

              <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left Content */}
                  <div className="space-y-6">
                    <BlurFade delay={0.1} inView>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Available for opportunities
                      </div>
                    </BlurFade>

                    <div className="space-y-3">
                      <BlurFade delay={0.2} inView>
                        <p className="text-base text-muted-foreground">Hi, I'm</p>
                      </BlurFade>
                      
                      <BlurFade delay={0.3} inView>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
                          <TextReveal className="text-white">Karnajeet</TextReveal>
                          <br />
                          <GradientText 
                            className="text-5xl sm:text-6xl lg:text-7xl font-black"
                            colors={['#6366f1', '#a855f7', '#ec4899', '#6366f1']}
                            animationSpeed={6}
                          >
                            Gosavi
                          </GradientText>
                        </h1>
                      </BlurFade>

                      <BlurFade delay={0.4} inView>
                        <p className="text-lg sm:text-xl text-white/70 max-w-xl">
                          <span className="text-white font-semibold">AI/ML Engineer</span> specializing in LLMs, NLP, and Agentic AI
                        </p>
                        <p className="text-sm text-white/50 max-w-xl mt-2">
                          Published researcher • CGPA: 8.98/10 • VIT Pune
                        </p>
                      </BlurFade>
                    </div>

                    <BlurFade delay={0.5} inView>
                      <div className="flex flex-wrap gap-3">
                        <MagneticButton strength={30} onClick={() => scrollTo('#projects')}>
                          <GlowButton className="px-6 py-3 text-sm">
                            View Projects <FaArrowRight className="ml-2" />
                          </GlowButton>
                        </MagneticButton>

                        <MagneticButton strength={30} onClick={() => scrollTo('#contact')}>
                          <OutlineButton className="px-6 py-3 text-sm">
                            Get In Touch
                          </OutlineButton>
                        </MagneticButton>
                      </div>
                    </BlurFade>

                    <BlurFade delay={0.6} inView>
                      <div className="flex items-center gap-4 pt-2">
                        {[
                          { icon: <FaGithub size={20} />, href: personalInfo.github },
                          { icon: <FaLinkedin size={20} />, href: personalInfo.linkedin },
                          { icon: <FaEnvelope size={20} />, href: `mailto:${personalInfo.email}` },
                        ].map((social, idx) => (
                          <MagneticWrapper key={idx} strength={50}>
                            <a 
                              href={social.href}
                              target={social.href.startsWith('http') ? "_blank" : undefined}
                              rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                              className="text-white/50 hover:text-white transition-colors p-2"
                            >
                              {social.icon}
                            </a>
                          </MagneticWrapper>
                        ))}
                      </div>
                    </BlurFade>
                  </div>

                  {/* Right - Profile Card */}
                  <BlurFade delay={0.4} inView className="hidden lg:flex justify-center">
                    <div className="relative">
                      <div className="absolute -inset-12 bg-gradient-to-r from-primary/15 via-secondary/15 to-primary/15 rounded-full blur-3xl opacity-30 animate-pulse-slow" />
                      <Lanyard 
                        name={personalInfo.name}
                        handle="@kg290" 
                        title="AI/ML Engineer"
                        avatarUrl={personalInfo.avatar}
                      />
                    </div>
                  </BlurFade>
                </div>

                {/* Stats - Compact */}
                <BlurFade delay={0.7} inView>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
                    {stats.map((stat, idx) => (
                      <StatCard
                        key={idx}
                        value={stat.value}
                        suffix={stat.suffix}
                        label={stat.label}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4"
                      />
                    ))}
                  </div>
                </BlurFade>
              </div>
            </section>

            {/* EDUCATION - COMPACT */}
            <section 
              id="education" 
              className="relative py-16"
              ref={(el) => (sectionsRef.current[1] = el)}
            >
              <div className="max-w-6xl mx-auto px-6">
                <BlurFade delay={0.1} inView>
                  <h2 className="text-3xl sm:text-4xl font-black text-center mb-8">
                    <GradientText colors={['#fff', '#6366f1', '#fff']}>
                      Education
                    </GradientText>
                  </h2>
                </BlurFade>

                <BlurFade delay={0.2} inView>
                  <SpotlightCard className="max-w-3xl mx-auto p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <FaGraduationCap className="text-primary text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{education[0].degree}</h3>
                        <p className="text-sm text-white/60">{education[0].institution}</p>
                        <p className="text-xs text-white/40 mt-1">{education[0].period} • CGPA: {education[0].cgpa}</p>
                        <div className="mt-3 space-y-1">
                          {education[0].highlights.map((item, idx) => (
                            <p key={idx} className="text-xs text-white/50 flex items-start gap-2">
                              <FaStar className="text-primary mt-0.5 flex-shrink-0" size={10} />
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </BlurFade>
              </div>
            </section>

            {/* SKILLS SECTION */}
            <section 
              id="skills" 
              className="relative py-16"
              ref={(el) => (sectionsRef.current[2] = el)}
            >
              <div className="max-w-7xl mx-auto px-6">
                <BlurFade delay={0.1} inView>
                  <h2 className="text-3xl sm:text-4xl font-black text-center mb-8">
                    <GradientText colors={['#fff', '#a855f7', '#fff']}>
                      Technical Skills
                    </GradientText>
                  </h2>
                </BlurFade>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                  {skills.categories.map((category, idx) => (
                    <BlurFade key={idx} delay={0.2 + idx * 0.1} inView>
                      <div className="relative group">
                        <BorderBeam 
                          size={120}
                          duration={15}
                          delay={idx * 3}
                          colorFrom={category.color}
                          colorTo={category.color}
                        />
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 h-full">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                              {category.icon === 'brain' && <FaBrain style={{ color: category.color }} size={20} />}
                              {category.icon === 'code' && <FaCode style={{ color: category.color }} size={20} />}
                              {category.icon === 'react' && <FaReact style={{ color: category.color }} size={20} />}
                              {category.icon === 'cloud' && <FaRocket style={{ color: category.color }} size={20} />}
                              {category.icon === 'database' && <FaDatabase style={{ color: category.color }} size={20} />}
                            </div>
                            <h3 className="font-bold text-base">{category.title}</h3>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {category.skills.map((skill, i) => (
                              <span 
                                key={i} 
                                className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-white/80 border border-white/10 hover:border-primary/30 hover:bg-primary/10 transition-all flex items-center gap-1.5"
                              >
                                {TECH_ICONS[skill] && <span className="opacity-70">{TECH_ICONS[skill]}</span>}
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </BlurFade>
                  ))}
                </div>
              </div>
            </section>

            {/* PROJECTS */}
            <section 
              id="projects" 
              className="relative py-16"
              ref={(el) => (sectionsRef.current[3] = el)}
            >
              <div className="max-w-7xl mx-auto px-6">
                <BlurFade delay={0.1} inView>
                  <h2 className="text-3xl sm:text-4xl font-black text-center mb-8">
                    <GradientText colors={['#fff', '#ec4899', '#fff']}>
                      Featured Projects
                    </GradientText>
                  </h2>
                </BlurFade>

                <div className="grid md:grid-cols-2 gap-5 max-w-6xl mx-auto">
                  {projects.map((project, idx) => (
                    <BlurFade key={idx} delay={0.2 + idx * 0.1} inView>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group project-card"
                      >
                        <SpotlightCard className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all">
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                {project.title}
                              </h3>
                              <FaExternalLinkAlt className="text-white/40 group-hover:text-primary transition-colors flex-shrink-0 mt-1" size={14} />
                            </div>
                            {project.tagline && (
                              <p className="text-xs text-primary/80 mb-2">{project.tagline}</p>
                            )}
                            <p className="text-sm text-white/60 mb-3">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {project.tech.slice(0, 5).map((tech, i) => (
                                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 border border-primary/20">
                                  {tech}
                                </span>
                              ))}
                              {project.tech.length > 5 && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">
                                  +{project.tech.length - 5}
                                </span>
                              )}
                            </div>
                          </div>
                        </SpotlightCard>
                      </a>
                    </BlurFade>
                  ))}
                </div>
              </div>
            </section>

            {/* ACHIEVEMENTS - SMALL IMAGES */}
            <section 
              id="achievements" 
              className="relative py-16"
              ref={(el) => (sectionsRef.current[4] = el)}
            >
              <div className="max-w-7xl mx-auto px-6">
                <BlurFade delay={0.1} inView>
                  <h2 className="text-3xl sm:text-4xl font-black text-center mb-8">
                    <GradientText colors={['#fff', '#f59e0b', '#fff']}>
                      Achievements & Hackathons
                    </GradientText>
                  </h2>
                </BlurFade>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                  {achievements.map((achievement, idx) => (
                    <BlurFade key={idx} delay={0.2 + idx * 0.1} inView>
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-primary/30 transition-all">
                        {achievement.image && (
                          <div className="relative h-20 mb-3 rounded-lg overflow-hidden">
                            <img 
                              src={achievement.image}
                              alt={achievement.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-sm">
                              <FaTrophy className="text-yellow-400" size={12} />
                            </div>
                          </div>
                        )}
                        <h3 className="font-bold text-sm mb-1">{achievement.title}</h3>
                        <p className="text-xs text-white/60 mb-1">{achievement.organization}</p>
                        <p className="text-xs text-white/40">{achievement.date}</p>
                      </div>
                    </BlurFade>
                  ))}
                </div>
              </div>
            </section>

            {/* CERTIFICATIONS */}
            <section 
              id="certifications" 
              className="relative py-16"
              ref={(el) => (sectionsRef.current[5] = el)}
            >
              <div className="max-w-7xl mx-auto px-6">
                <BlurFade delay={0.1} inView>
                  <h2 className="text-3xl sm:text-4xl font-black text-center mb-8">
                    <GradientText colors={['#fff', '#22d3ee', '#fff']}>
                      Certifications
                    </GradientText>
                  </h2>
                </BlurFade>

                <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                  {certifications.map((cert, idx) => (
                    <BlurFade key={idx} delay={0.2 + idx * 0.1} inView>
                      <a
                        href={cert.pdfPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group cert-card"
                      >
                        <PixelCard className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-primary/30 transition-all">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                              <FaCertificate className="text-primary" size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-2">
                                {cert.name}
                              </h3>
                            </div>
                          </div>
                          <p className="text-xs text-white/60 mb-1">{cert.issuer}</p>
                          <p className="text-xs text-white/40 mb-3">{cert.date}</p>
                          {cert.skills && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {cert.skills.slice(0, 3).map((skill, i) => (
                                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/70 border border-primary/20">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs text-primary/60 group-hover:text-primary transition-colors">
                            <FaExternalLinkAlt size={10} />
                            <span>View Certificate</span>
                          </div>
                        </PixelCard>
                      </a>
                    </BlurFade>
                  ))}
                </div>
              </div>
            </section>

            {/* CONTACT */}
            <section 
              id="contact" 
              className="relative py-16"
              ref={(el) => (sectionsRef.current[6] = el)}
            >
              <div className="max-w-4xl mx-auto px-6 text-center">
                <BlurFade delay={0.1} inView>
                  <h2 className="text-3xl sm:text-4xl font-black mb-4">
                    <GradientText colors={['#fff', '#6366f1', '#a855f7', '#fff']}>
                      Let's Work Together
                    </GradientText>
                  </h2>
                  <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                    Open to discussing new projects, research collaborations, or opportunities.
                  </p>
                </BlurFade>

                <BlurFade delay={0.2} inView>
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <MagneticButton strength={40}>
                      <a href={`mailto:${personalInfo.email}`}>
                        <GlowButton className="px-8 py-4">
                          <FaEnvelope className="mr-2" />
                          {personalInfo.email}
                        </GlowButton>
                      </a>
                    </MagneticButton>
                  </div>
                </BlurFade>

                <BlurFade delay={0.3} inView>
                  <div className="flex justify-center gap-6">
                    <MagneticWrapper strength={60}>
                      <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
                        <FaGithub size={24} />
                      </a>
                    </MagneticWrapper>
                    <MagneticWrapper strength={60}>
                      <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
                        <FaLinkedin size={24} />
                      </a>
                    </MagneticWrapper>
                  </div>
                </BlurFade>

                <BlurFade delay={0.4} inView>
                  <div className="mt-12 pt-8 border-t border-white/10">
                    <p className="text-sm text-white/40">
                      © {new Date().getFullYear()} {personalInfo.name}. Built with React & Framer Motion.
                    </p>
                  </div>
                </BlurFade>
              </div>
            </section>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
