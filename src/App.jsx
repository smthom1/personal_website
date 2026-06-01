import React, { useState, useEffect, useRef } from 'react';
import SkillsComponent from './components/SkillsComponent';
import EcosystemComponent from './components/EcosystemComponent';
import MLPlayground from './components/MLPlayground';

// ==========================================================================
// SOPHIA THOMPSON - PORTFOLIO MAIN APP SHELL
// ==========================================================================
// Welcome to the core React controller of my website! 
// This page orchestrates the main layouts, sticky scrolls, cursor radial glows, 
// typewriter effects, and the interactive lightbox galleries.
// ==========================================================================

const App = () => {
    // ----------------------------------------------------
    // Theme Management Hooks (Dark mode is default!)
    // ----------------------------------------------------
    // Checks localStorage first, and if empty, checks system browser preferences
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme) return savedTheme;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPrefersDark ? 'dark' : 'light';
    });

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    // ----------------------------------------------------
    // Radial Cursor Glow (Performance-Optimized via DOM Refs)
    // ----------------------------------------------------
    // Directly manipulates the DOM elements to prevent high-frequency React rerenders 
    // when moving the mouse around the page. Keeps the animation highly performant!
    const cursorGlowRef = useRef(null);

    useEffect(() => {
        const glow = cursorGlowRef.current;
        if (!glow) return;

        let isGlowVisible = false;

        const handleMouseMove = (e) => {
            if (!isGlowVisible) {
                glow.style.opacity = '1';
                isGlowVisible = true;
            }
            glow.style.left = `${e.clientX}px`;
            glow.style.top = `${e.clientY}px`;
        };

        const handleMouseLeave = () => {
            glow.style.opacity = '0';
            isGlowVisible = false;
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // ----------------------------------------------------
    // Sticky Header Scroll Toggles
    // ----------------------------------------------------
    // Adds a visual border and solid blur background to the navbar when scrolled down
    const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsHeaderScrolled(true);
            } else {
                setIsHeaderScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initialize state

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ----------------------------------------------------
    // Mobile Drawer Navigation Controllers
    // ----------------------------------------------------
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ----------------------------------------------------
    // Typewriter Simulation Loops
    // ----------------------------------------------------
    // Smooth, responsive typing simulation going through my core titles
    const [typedText, setTypedText] = useState('');
    const phrases = ['Data Scientist', 'Machine Learning Engineer', 'Quantitative Analyst', 'Computational Researcher'];

    useEffect(() => {
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        let timeoutId;

        const typeRoutine = () => {
            const currentPhrase = phrases[phraseIdx];

            if (isDeleting) {
                // Deleting state: slice off the last character
                setTypedText(currentPhrase.substring(0, charIdx - 1));
                charIdx--;
                typingSpeed = 50; // Quicker deleting speeds
            } else {
                // Typing state: append the next character
                setTypedText(currentPhrase.substring(0, charIdx + 1));
                charIdx++;
                typingSpeed = 120; // Natural typing pace
            }

            // Transitioning logic between typing, pausing, and erasing
            if (!isDeleting && charIdx === currentPhrase.length) {
                typingSpeed = 1800; // Pause at the end of phrase
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typingSpeed = 500; // Pause before typing the next word
            }

            timeoutId = setTimeout(typeRoutine, typingSpeed);
        };

        timeoutId = setTimeout(typeRoutine, 1000);
        return () => clearTimeout(timeoutId);
    }, []);

    // ----------------------------------------------------
    // Scroll-Spy Sitemap Observer
    // ----------------------------------------------------
    // Automatically highlights the active nav link as the user scrolls through sections
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const sections = document.querySelectorAll('section');
        const options = {
            root: null,
            rootMargin: '-30% 0px -60% 0px', // Target the exact middle of the screen
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.getAttribute('id'));
                }
            });
        }, options);

        sections.forEach(section => observer.observe(section));
        return () => {
            sections.forEach(section => observer.unobserve(section));
        };
    }, []);

    // ----------------------------------------------------
    // Projects Data & Search Filtering States
    // ----------------------------------------------------
    const [projectFilter, setProjectFilter] = useState('all');

    // Portfolio data - image directories updated to images/
    const PROJECTS = [
        {
            id: 1,
            title: "OCD Habit Tracker",
            category: "dev",
            categoryLabel: "FULL-STACK & DATA TOOLS",
            desc: "A sophisticated clinical behavior-tracking tool mapping repetitive actions onto interactive body charts and floorplan heatmaps. Engineered portable flat-file storage optimized for direct R/Pandas data pipelines.",
            tech: ["Python / Flask", "HTML5 SVG Map", "CSS Heatmaps", "CSV Data Store"],
            link: "https://github.com/smthom1/ocd-tracker",
            overlayClass: "p-grad-4",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            )
        },
        {
            id: 2,
            title: "HAPPI Cognitive Platform",
            category: "ml",
            categoryLabel: "MACHINE LEARNING & AI",
            desc: "Winner of \"Best Assistive Technology\" at HackDavis 2025. A clinical app for Alzheimer's/dementia patients, integrating large language models (Gemini API) and visual health metric charts.",
            tech: ["Streamlit", "Gemini API", "MongoDB", "Firebase"],
            link: "https://github.com/smthom1/alz-data",
            overlayClass: "p-grad-1",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                    <path d="M12 2V12L17 17" />
                </svg>
            )
        },
        {
            id: 3,
            title: "Pistachio Split Recognition",
            category: "ml",
            categoryLabel: "MACHINE LEARNING & AI",
            desc: "Automated visual crop sorting model created for the UC Davis Tree Systems Lab. Built custom dataset annotations inside CVAT and trained YOLO v8 models to sort pistachio split degree qualities.",
            tech: ["Python", "YOLO v8", "CVAT", "Computer Vision"],
            link: "https://github.com/smthom1/Pistachio-Split-Recognition",
            overlayClass: "p-grad-2",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
            )
        },
        {
            id: 4,
            title: "Edible Trees Spatial Database",
            category: "research",
            categoryLabel: "RESEARCH & DATABASES",
            desc: "Designed a scalable PostgreSQL/PostGIS database structure for the UC Davis Urban Sciences Lab to index regional urban tree populations, integrating automated QA/QC data ingestion pipelines.",
            tech: ["PostgreSQL", "PostGIS Spatial Extension", "Python QAQC", "Java"],
            link: null,
            overlayClass: "p-grad-3",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            )
        },
        {
            id: 5,
            title: "Retro & Modern OS Profile Website",
            category: "dev",
            categoryLabel: "FULL-STACK & DATA TOOLS",
            desc: "My original personal portfolio website featuring a highly interactive, dual-theme virtual operating system desktop interface. Features custom draggable workspace directories and visual layout toggles between full Windows 98 and Windows 11 layouts.",
            tech: ["HTML5 / CSS3", "Vanilla JS", "Draggable OS Window", "UI Layout Engine"],
            link: "https://github.com/smthom1/profile",
            win98Image: "images/win98_web.png",
            win11Image: "images/win11_web.png"
        }
    ];

    // ----------------------------------------------------
    // Lightbox / Photo Modal Details State
    // ----------------------------------------------------
    // Holds the selected gallery item metadata when opened. Lock background scrolling.
    const [lightboxPhoto, setLightboxPhoto] = useState(null);

    const GALLERY_ITEMS = [
        {
            id: 'photo-card-1',
            tag: 'COMPUTER VISION (PYTORCH)',
            details: 'Multi-Task Demographic CNN',
            title: 'Face Demographics Recognition',
            desc: 'A PyTorch-based multi-task deep learning model predicting Age, Race, and Gender from facial images. A shared Convolutional Neural Network (CNN) backbone extracts features, which are then passed into three separate feed-forward neural network heads to predict each attribute simultaneously.<br><br><span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Image source: <a href="https://pages.nist.gov/frvt/html/frvt_demographics.html" target="_blank" style="color: var(--color-accent); text-decoration: underline;">NIST Face Recognition Technology Evaluation: Demographic Effects in Face Recognition</a></span>',
            gradientClass: 'ph-grad-1',
            link: 'https://github.com/smthom1/demographic_recog',
            image: 'images/people.png'
        },
        {
            id: 'photo-card-2',
            tag: 'REAL-TIME DEEP LEARNING',
            details: 'Webcam ASL Landmark Classifier',
            title: 'ASL Real-Time Recognition System',
            desc: 'Real-time American Sign Language (ASL) alphabet recognition system using computer vision and deep learning. MediaPipe detects hand joint landmarks from a live webcam feed and maps coordinates into a pretrained classifier.<br><br><span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Image source: <a href="https://www.mdpi.com/1424-8220/25/7/2138" target="_blank" style="color: var(--color-accent); text-decoration: underline;">Real-Time American Sign Language Interpretation Using Deep Learning and Keypoint Tracking, by Alsharif et al. (2025)</a></span>',
            gradientClass: 'ph-grad-2',
            link: 'https://github.com/smthom1/cs273p_ml-project',
            image: 'https://pub.mdpi-res.com/sensors/sensors-25-02138/article_deploy/html/images/sensors-25-02138-g003-550.jpg'
        },
        {
            id: 'photo-card-3',
            tag: 'QUANTITATIVE & NEURAL PIPELINE',
            details: 'Conspiracy Belief Taxonomy Model',
            title: 'Belief Architecture Analysis Pipeline',
            desc: 'Python computational pipeline analyzing structural interdependence of conspiracy beliefs and personality traits (Dark Triad, Anomie). Processes survey data to uncover taxonomies via unsupervised clustering and neural predictors.',
            gradientClass: 'ph-grad-3',
            link: 'https://github.com/smthom1/belief-architecture',
            image: 'images/belief_arch.png'
        }
    ];

    // Lock global background scroll when modal is active
    useEffect(() => {
        if (lightboxPhoto) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [lightboxPhoto]);

    // Keyboard event listener for accessible Escape key close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setLightboxPhoto(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // ----------------------------------------------------
    // Contact Form Submissions Hook
    // ----------------------------------------------------
    // Handles API submission simulator state, clears alerts after 5 seconds
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [feedback, setFeedback] = useState({ text: '', type: '' });

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setIsSending(true);

        // Simulate sending a message to a personal database endpoint
        setTimeout(() => {
            setFeedback({
                text: 'Message sent successfully! I will get back to you shortly.',
                type: 'success'
            });

            // Reset inputs
            setContactName('');
            setContactEmail('');
            setContactMessage('');
            setIsSending(false);

            // Hide alert banner after 5s
            setTimeout(() => {
                setFeedback({ text: '', type: '' });
            }, 5000);
        }, 1200);
    };

    const handleNavLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <React.Fragment>
            {/* Mouse Radial Glow Overlay */}
            <div ref={cursorGlowRef} id="cursor-glow" className="cursor-glow"></div>

            {/* Glowing Decorative Background Blobs */}
            <div className="ambient-orb orb-1"></div>
            <div className="ambient-orb orb-2"></div>
            <div className="ambient-orb orb-3"></div>
            <div className="ambient-orb orb-4"></div>

            {/* Main Navigation Header */}
            <header className={`main-header glass-card ${isHeaderScrolled ? 'scrolled' : ''}`}>
                <div className="header-container">
                    <a href="#" className="logo" id="header-logo">
                        <span className="logo-accent">&lt;</span>Sophia<span className="logo-accent">.T/&gt;</span>
                    </a>

                    <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} id="nav-menu">
                        <a href="#hero" className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`} onClick={handleNavLinkClick}>Home</a>
                        <a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`} onClick={handleNavLinkClick}>About</a>
                        <a href="#ecosystem" className={`nav-link ${activeSection === 'ecosystem' ? 'active' : ''}`} onClick={handleNavLinkClick}>Ecosystem</a>
                        <a href="#timeline" className={`nav-link ${activeSection === 'timeline' ? 'active' : ''}`} onClick={handleNavLinkClick}>Timeline</a>
                        <a href="#projects" className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`} onClick={handleNavLinkClick}>Projects</a>
                        <a href="#sandbox" className={`nav-link ${activeSection === 'sandbox' ? 'active' : ''}`} onClick={handleNavLinkClick}>Sandbox</a>
                        <a href="#photos" className={`nav-link ${activeSection === 'photos' ? 'active' : ''}`} onClick={handleNavLinkClick}>Gallery</a>
                        <a href="#contact" className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`} onClick={handleNavLinkClick}>Contact</a>
                    </nav>

                    <div className="header-actions">
                        {/* Theme Toggle Button */}
                        <button className="theme-toggle-btn" id="theme-toggle" onClick={handleThemeToggle} aria-label="Toggle visual theme">
                            {/* Sun Icon */}
                            <svg className="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="4"></circle>
                                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
                            </svg>
                            {/* Moon Icon */}
                            <svg className="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                            </svg>
                        </button>

                        {/* Mobile Hamburger Burger button */}
                        <button className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`} id="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle mobile menu">
                            <span className="menu-bar"></span>
                            <span className="menu-bar"></span>
                            <span className="menu-bar"></span>
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Showcase Section */}
                <section id="hero" className="hero-section">
                    <div className="hero-container container">
                        <div className="hero-content">
                            <span className="hero-sub">SOPHIA THOMPSON | DATA SCIENTIST</span>
                            <h1 className="hero-title">
                                Designing <span className="gradient-text">Data-Driven</span> Solutions
                            </h1>
                            <p className="hero-description" style={{ minHeight: '4.5rem' }}>
                                Hi, I'm Sophia! I'm a{' '}
                                <span className="typing-text" id="typing-text">
                                    {typedText}
                                </span>
                            </p>
                            <div className="hero-ctas">
                                <a href="#projects" className="btn btn-primary" id="btn-view-projects">
                                    Explore Data Projects
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </a>
                                <a href="SophiaThompson_resume.pdf" target="_blank" className="btn btn-secondary" id="btn-get-touch">Download Resume (PDF)</a>
                            </div>
                        </div>

                        <div className="hero-visual">
                            <div className="avatar-container glass-card">
                                <div className="avatar-glow"></div>
                                <div className="avatar-frame">
                                    {/* Stylized premium abstract code logo */}
                                    <svg className="avatar-placeholder" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="var(--color-primary)" />
                                                <stop offset="100%" stopColor="var(--color-accent)" />
                                            </linearGradient>
                                        </defs>
                                        <circle cx="100" cy="100" r="95" fill="none" stroke="url(#avatarGrad)" strokeWidth="3" strokeDasharray="10 5" />
                                        <circle cx="100" cy="100" r="85" fill="var(--bg-card)" />
                                        <g transform="translate(45, 45)">
                                            <path d="M55 25 C65 25, 75 35, 75 50 C75 75, 55 90, 55 90 C55 90, 35 75, 35 50 C35 35, 45 25, 55 25 Z" fill="url(#avatarGrad)" opacity="0.15" />
                                            <path d="M30 45 L15 55 L30 65" fill="none" stroke="url(#avatarGrad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M80 45 L95 55 L80 65" fill="none" stroke="url(#avatarGrad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M60 35 L50 75" fill="none" stroke="url(#avatarGrad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                        <circle cx="100" cy="100" r="6" fill="var(--color-primary)" />
                                        <circle cx="70" cy="80" r="4" fill="var(--color-accent)" />
                                        <circle cx="130" cy="120" r="5" fill="var(--color-primary)" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="scroll-indicator">
                        <a href="#about" aria-label="Scroll to About Section">
                            <span className="mouse-wheel"></span>
                        </a>
                    </div>
                </section>

                {/* Biography & Skills Section */}
                <section id="about" className="about-section section-padding">
                    <div className="container">
                        <div className="section-header">
                            <span className="sub-title">MY BIOGRAPHY</span>
                            <h2 className="section-title">Crafting Elegant Code</h2>
                            <div className="heading-line"></div>
                        </div>

                        <div className="about-grid">
                            <div className="about-details glass-card">
                                <h3>Who I Am</h3>
                                <p>
                                    I am a Data Scientist and Computer Scientist focused on bridging advanced computational
                                    modeling with real-world human impact. Currently pursuing my Master of Data Science at UC
                                    Irvine, I have a deep foundation in computer vision, statistical forecasting, and spatial
                                    database engineering.
                                </p>
                                <p>
                                    I work best when considering the intersections between complex data pipelines and
                                    user-centered design, ranging from implementing real-time object detection models for agricultural yields to
                                    crafting accessibility-focused tools for clinical systems. Ultimately, I aim to build
                                    intelligent systems that translate raw data into actionable, life-enhancing solutions.
                                </p>

                                <div className="about-stats">
                                    <div className="stat-box">
                                        <span className="stat-number">MDS/BS</span>
                                        <span className="stat-label">UCI & UC Davis Graduate</span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-number">6+ Core</span>
                                        <span className="stat-label">Data Projects Shipped</span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-number">2 Award</span>
                                        <span className="stat-label">HackDavis Victories</span>
                                    </div>
                                </div>
                            </div>

                            {/* Embedded Core Skills Component */}
                            <div id="skills-root" className="skills-wrapper glass-card">
                                <SkillsComponent />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Beyond the Code: Creative Ecosystem Section */}
                <section id="ecosystem" className="ecosystem-section section-padding">
                    <div className="container">
                        <div className="section-header">
                            <span className="sub-title" style={{ color: 'var(--color-human)' }}>BEYOND THE CODE</span>
                            <h2 className="section-title">My Creative Ecosystem</h2>
                            <div className="heading-line" style={{ background: 'linear-gradient(135deg, var(--color-human), var(--color-accent))' }}></div>
                        </div>

                        {/* Embedded Creative Ecosystem Component */}
                        <div id="ecosystem-root" className="ecosystem-wrapper">
                            <EcosystemComponent />
                        </div>
                    </div>
                </section>

                {/* journey timeline section */}
                <section id="timeline" className="timeline-section section-padding">
                    <div className="container">
                        <div className="section-header">
                            <span className="sub-title">JOURNEY & MILESTONES</span>
                            <h2 className="section-title">My Major Accomplishments</h2>
                            <div className="heading-line"></div>
                        </div>

                        <div className="timeline-container">
                            <div className="timeline-line"></div>

                            {/* Timeline Item 1 */}
                            <div className="timeline-item left-align">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content glass-card">
                                    <span className="timeline-date">2025 (EXPECTED DEC)</span>
                                    <h4>Master of Data Science</h4>
                                    <p className="timeline-sub">University of California, Irvine</p>
                                    <p>Intensive postgraduate focus on advanced machine learning algorithms, deep learning neural nets, predictive modeling pipelines, and multi-dimensional statistical forecasting.</p>
                                </div>
                            </div>

                            {/* Timeline Item 2 */}
                            <div className="timeline-item right-align">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content glass-card">
                                    <span className="timeline-date">JAN 2025 - JUL 2025</span>
                                    <h4>Data Engineer & QA Assistant</h4>
                                    <p className="timeline-sub">UC Davis Urban Sciences Lab</p>
                                    <p>Managed the relational Edible Trees Database. Engineered high-performance, automated Python pipelines to perform large-scale data cleansing, CSV manipulations, and spatial QA/QC routines.</p>
                                </div>
                            </div>

                            {/* Timeline Item 3 */}
                            <div className="timeline-item left-align">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content glass-card">
                                    <span className="timeline-date">OCT 2024 - MAR 2025</span>
                                    <h4>Environmental Data Analyst</h4>
                                    <p className="timeline-sub">EcoTelesis, Inc.</p>
                                    <p>Conducted data mining and analytics to model waste recovery rates and estimate carbon emissions of LA's recycling programs, formulating actionable insights based on climate policy protocols.</p>
                                </div>
                            </div>

                            {/* Timeline Item 4 */}
                            <div className="timeline-item right-align">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content glass-card">
                                    <span className="timeline-date">MAR 2024 - SEP 2024</span>
                                    <h4>Machine Learning Research Assistant</h4>
                                    <p className="timeline-sub">UC Davis Tree Systems Lab (Marino Lab)</p>
                                    <p>Developed custom computer vision pipelines using YOLO v8 and CVAT to automate split classification of pistachio fruit. Designed statistical Python and R analytics scripts to optimize sensor loggers.</p>
                                </div>
                            </div>

                            {/* Timeline Item 5 */}
                            <div className="timeline-item left-align">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content glass-card">
                                    <span className="timeline-date">2021 - 2025</span>
                                    <h4>B.S. in Computer Science</h4>
                                    <p className="timeline-sub">University of California, Davis</p>
                                    <p>Focused on complex programming architectures and spatial algorithms. Minored in Sociology & Urban Forestry, integrating tech modeling with environmental research. Active HackDavis winner.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Professional Projects Grid */}
                <section id="projects" className="projects-section section-padding">
                    <div className="container">
                        <div className="section-header">
                            <span className="sub-title">PORTFOLIO</span>
                            <h2 className="section-title">Sophia's Portfolio</h2>
                            <div className="heading-line"></div>
                        </div>

                        {/* Interactive Filter Navigation */}
                        <div className="project-filters">
                            <button className={`filter-btn ${projectFilter === 'all' ? 'active' : ''}`} onClick={() => setProjectFilter('all')}>All Work</button>
                            <button className={`filter-btn ${projectFilter === 'ml' ? 'active' : ''}`} onClick={() => setProjectFilter('ml')}>Machine Learning & AI</button>
                            <button className={`filter-btn ${projectFilter === 'dev' ? 'active' : ''}`} onClick={() => setProjectFilter('dev')}>Full-Stack & Data Tools</button>
                            <button className={`filter-btn ${projectFilter === 'research' ? 'active' : ''}`} onClick={() => setProjectFilter('research')}>Research & Databases</button>
                        </div>

                        <div className="projects-grid">
                            {PROJECTS.map(proj => {
                                const isVisible = projectFilter === 'all' || proj.category === projectFilter;
                                
                                // Render modern virtual Operating System switcher for Retro Project
                                if (proj.win98Image) {
                                    return (
                                        <div key={proj.id} className={`project-card glass-card ${isVisible ? '' : 'hide'}`}>
                                            <div className="project-image-wrapper image-toggle-hover">
                                                <div className="project-image win98" style={{ backgroundImage: `url(${proj.win98Image})` }}></div>
                                                <div className="project-image win11" style={{ backgroundImage: `url(${proj.win11Image})` }}></div>
                                                <div className="image-overlay-label">Hover to toggle Win11 / Win98</div>
                                            </div>
                                            <div className="project-info">
                                                <span className="project-cat">{proj.categoryLabel}</span>
                                                <h4>{proj.title}</h4>
                                                <p>{proj.desc}</p>
                                                <div className="project-tech">
                                                    {proj.tech.map((t, i) => <span key={i}>{t}</span>)}
                                                </div>
                                                <div className="project-links">
                                                    <a href={proj.link} className="project-link-item" target="_blank" rel="noopener noreferrer">
                                                        <span>Repository</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={proj.id} className={`project-card glass-card ${isVisible ? '' : 'hide'}`}>
                                        <div className="project-image-wrapper">
                                            <div className={`image-placeholder-overlay ${proj.overlayClass}`}>
                                                <div className="placeholder-icon">
                                                    {proj.icon}
                                                </div>
                                                <span className="placeholder-text">{proj.title} Showcase</span>
                                            </div>
                                        </div>
                                        <div className="project-info">
                                            <span className="project-cat">{proj.categoryLabel}</span>
                                            <h4>{proj.title}</h4>
                                            <p>{proj.desc}</p>
                                            <div className="project-tech">
                                                {proj.tech.map((t, i) => <span key={i}>{t}</span>)}
                                            </div>
                                            {proj.link && (
                                                <div className="project-links">
                                                    <a href={proj.link} className="project-link-item" target="_blank" rel="noopener noreferrer">
                                                        <span>Repository</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Interactive ML Sandbox Section */}
                <section id="sandbox" className="sandbox-section section-padding">
                    <div className="container">
                        <div className="section-header">
                            <span className="sub-title">INTERACTIVE SANDBOX</span>
                            <h2 className="section-title">Live Machine Learning Playground</h2>
                            <div className="heading-line"></div>
                        </div>

                        <p className="gallery-description">
                            Adjust hyperparameters and train a real-time linear classifier model on synthetic data. Watch the
                            convergence in real time:
                        </p>

                        <div id="sandbox-root" className="sandbox-wrapper">
                            <MLPlayground />
                        </div>
                    </div>
                </section>

                {/* Deep Learning Galleries Section */}
                <section id="photos" className="photos-section section-padding">
                    <div className="container">
                        <div className="section-header">
                            <span className="sub-title">DEEP LEARNING RESEARCH SHOWCASES</span>
                            <h2 className="section-title">Advanced Model Galleries</h2>
                            <div className="heading-line"></div>
                        </div>

                        <p className="gallery-description">
                            Interactive visualizations of advanced neural architectures, computer vision landmark mappings, and
                            quantitative statistical pipelines. Click on any showcase card below to explore parameters and view
                            source repositories:
                        </p>

                        <div className="photos-grid">
                            {GALLERY_ITEMS.map(item => (
                                <div
                                    key={item.id}
                                    className="photo-card glass-card"
                                    tabIndex={0}
                                    onClick={() => setLightboxPhoto(item)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setLightboxPhoto(item);
                                        }
                                    }}
                                    aria-label={`View details of ${item.title}`}
                                >
                                    <div className="photo-aspect-container">
                                        <div className={`photo-placeholder-overlay ${item.gradientClass}`}>
                                            <span className="photo-tag">{item.tag}</span>
                                            <span className="photo-details">{item.details}</span>
                                            <div className="interactive-prompt">Click to Explore Details</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Lightbox / Modal for Photos */}
                {lightboxPhoto && (
                    <div className="lightbox-modal active" role="dialog" aria-modal="true">
                        <button className="lightbox-close" onClick={() => setLightboxPhoto(null)} aria-label="Close Lightbox">&times;</button>
                        <div className="lightbox-content">
                            <div
                                className={`lightbox-gradient ${lightboxPhoto.gradientClass}`}
                                style={{
                                    backgroundImage: lightboxPhoto.image ? `url(${lightboxPhoto.image})` : '',
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    backgroundColor: '#0b0f19'
                                }}
                            ></div>
                            <div className="lightbox-caption">
                                <h4>{lightboxPhoto.title}</h4>
                                <p dangerouslySetInnerHTML={{ __html: lightboxPhoto.desc }}></p>
                                <div style={{ marginTop: '16px' }}>
                                    <a href={lightboxPhoto.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                                        View Code Repository
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Form Section */}
                <section id="contact" className="contact-section section-padding">
                    <div className="container">
                        <div className="section-header">
                            <span className="sub-title">GET IN TOUCH</span>
                            <h2 className="section-title">Let's Build Something Together</h2>
                            <div className="heading-line"></div>
                        </div>

                        <div className="contact-wrapper">
                            <div className="contact-info glass-card">
                                <h3>Contact Information</h3>
                                <p>Feel free to reach out for consultations, project proposals, or simple tech greetings.</p>

                                <div className="info-links">
                                    <div className="info-link-item">
                                        <div className="icon-circle">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                            </svg>
                                        </div>
                                        <div className="info-texts">
                                            <span className="info-label">Email Me Directly</span>
                                            <a href="mailto:sthom954@gmail.com" className="info-value">sthom954@gmail.com</a>
                                        </div>
                                    </div>

                                    <div className="info-link-item">
                                        <div className="icon-circle">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </div>
                                        <div className="info-texts">
                                            <span className="info-label">Base Location</span>
                                            <span className="info-value">Orange County, CA</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="social-circles">
                                    <a href="https://github.com/smthom1" className="social-circle-item" target="_blank" rel="noopener noreferrer" aria-label="GitHub Page">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                            <path d="M9 18c-4.51 2-5-2-7-2" />
                                        </svg>
                                    </a>
                                    <a href="https://www.linkedin.com/in/sm-thompson/" className="social-circle-item" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Page">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                            <rect width="4" height="12" x="2" y="9" />
                                            <circle cx="4" cy="4" r="2" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <form className="contact-form glass-card" id="portfolio-contact-form" onSubmit={handleContactSubmit}>
                                <h3>Send a Message</h3>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="contact-name"
                                        className="form-input"
                                        placeholder=" "
                                        required
                                        value={contactName}
                                        onChange={(e) => setContactName(e.target.value)}
                                        autoComplete="name"
                                    />
                                    <label htmlFor="contact-name" className="form-label">Full Name</label>
                                </div>

                                <div className="form-group">
                                    <input
                                        type="email"
                                        id="contact-email"
                                        className="form-input"
                                        placeholder=" "
                                        required
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                        autoComplete="email"
                                    />
                                    <label htmlFor="contact-email" className="form-label">Email Address</label>
                                </div>

                                <div className="form-group">
                                    <textarea
                                        id="contact-message"
                                        className="form-input textarea-input"
                                        placeholder=" "
                                        required
                                        value={contactMessage}
                                        onChange={(e) => setContactMessage(e.target.value)}
                                    ></textarea>
                                    <label htmlFor="contact-message" className="form-label">Your Message</label>
                                </div>

                                <button type="submit" className="btn btn-primary btn-submit" id="form-submit-btn" disabled={isSending}>
                                    <span>{isSending ? 'Sending...' : 'Send Message'}</span>
                                    <svg className="submit-arrow" style={{ transform: isSending ? 'rotate(-45deg)' : '' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>

                                {feedback.text && (
                                    <div className={`form-feedback-message ${feedback.type}`}>
                                        {feedback.text}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer Sitemap */}
            <footer className="footer">
                <div className="container footer-container">
                    <div className="footer-left">
                        <a href="#" className="logo footer-logo">
                            <span className="logo-accent">&lt;</span>Sophia<span className="logo-accent">.T/&gt;</span>
                        </a>
                        <p>Applying machine learning models and spatial statistics to bridge technical innovation with human impact.</p>
                    </div>

                    <div className="footer-links">
                        <h4>Sitemap</h4>
                        <a href="#hero">Home</a>
                        <a href="#about">About</a>
                        <a href="#ecosystem">Ecosystem</a>
                        <a href="#timeline">Timeline</a>
                        <a href="#projects">Projects</a>
                        <a href="#sandbox">Sandbox</a>
                        <a href="#photos">Gallery</a>
                    </div>

                    <div className="footer-right">
                        <p className="copyright">&copy; <span id="current-year">{new Date().getFullYear()}</span> Sophia Thompson.</p>
                    </div>
                </div>
            </footer>
        </React.Fragment>
    );
};

export default App;
