import React, { useState, useEffect, useMemo } from 'react';

// ==========================================================================
// MY CREATIVE ECOSYSTEM COMPONENT
// ==========================================================================
// Hello! If you're reading this, welcome to the human side of my portfolio. 
// I created this section because I believe data science shouldn't live in a silo.
// This component connects my major life domains (Sociology, Environment, Tech)
// and houses some interactive widgets showing my favorite offline pursuits.
// ==========================================================================

const EcosystemComponent = () => {
    // Basic navigation state to switch between the custom tabs
    const [activeTab, setActiveTab] = useState("intersection");
    const [activeNode, setActiveNode] = useState("core");

    // Weaving loom grid state (144 cells for a 12x12 tapestry frame)
    // #0b0f19 represents the raw dark space of an empty loom warp thread
    const [loomGrid, setLoomGrid] = useState(Array(144).fill("#0b0f19"));
    const [selectedLoomColor, setSelectedLoomColor] = useState("var(--color-human)");

    // Selected biometrics tracker for local California trails
    const [activeTrail, setActiveTrail] = useState("tahoe");

    // Drawer display state for my physical shelf curios
    const [activeCurio, setActiveCurio] = useState("handweaving");

    // Curated wool yarn palette inspired by nature & HSL themes
    const LOOM_COLORS = [
        "var(--color-human)",  // Terracotta Earth
        "var(--color-accent)", // Cyan Stream
        "var(--color-primary)",// Violet Sky
        "#10b981",             // Forest Green
        "#f3f4f6",             // Soft Cotton Grey
        "#0b0f19"              // Empty Warp Thread (Erase)
    ];

    // Toggle warp/weft cell colors on click
    const handleCellClick = (index) => {
        setLoomGrid(prev => {
            const next = [...prev];
            // If the cell already has this yarn color, erase it back to default dark warp
            next[index] = next[index] === selectedLoomColor ? "#0b0f19" : selectedLoomColor;
            return next;
        });
    };

    // Erase the tapestry back to its bare threads
    const resetLoom = () => {
        setLoomGrid(Array(144).fill("#0b0f19"));
    };

    // Generate a mathematically-balanced diamond/check checkerboard tapestry
    // Showing how binary code structures relate to weaving loops
    const autoWeave = () => {
        const newGrid = Array(144).fill("#0b0f19");
        for (let r = 0; r < 12; r++) {
            for (let c = 0; c < 12; c++) {
                const idx = r * 12 + c;
                // Elegant mathematical symmetry using simple modulus indexing
                if ((r + c) % 4 === 0) {
                    newGrid[idx] = "var(--color-human)";
                } else if ((r - c) % 4 === 0) {
                    newGrid[idx] = "var(--color-accent)";
                } else if (r === 5 || r === 6 || c === 5 || c === 6) {
                    newGrid[idx] = "var(--color-primary)";
                }
            }
        }
        setLoomGrid(newGrid);
    };

    // Data mappings for my interdisciplinary intersections
    // Connecting academic sociology and urban forestry with modern coding pipelines
    const INTERSECT_DATA = {
        core: {
            title: "Sophia Thompson",
            subtitle: "The Human Element",
            desc: "I operate at the intersection of three distinct disciplines: Sociology, Environment, and Technology. Instead of viewing these as separate aspects of my life, I tend to look for ways they intersect and strengthen one another. My love for hands-on hobbies, from crochet and weaving to running, keep me anchored and remind me that data-driven interfaces should always remain centered on the human experience.",
            points: ["Master of Data Science Candidate at UC Irvine", "B.S. in Computer Science with a Sociology & Urban Forestry Minor", "Double HackDavis Winner focusing on Assistive Technologies"]
        },
        sociology: {
            title: "Sociology & Society",
            subtitle: "Understanding Systems of Connection",
            desc: "My training in sociology shapes how I write code and design systems. I analyze human behaviors, digital social networks, and community patterns. By understanding how institutions and technology affect human lives, I focus on building accessible, high-utility tools, like behavioral tracking and clinical support programs, that address systemic challenges rather than superficial problems.",
            points: ["Minor in Sociology from UC Davis", "Researching conspiracy taxonomy and structural belief models", "Designing human-first UI layouts that reduce user friction in stressful contexts"]
        },
        environment: {
            title: "Ecology & Space",
            subtitle: "Mapping Our Living World",
            desc: "Despite ongoing environmental challenges, I believe technology can be a powerful tool for stewardship. My work in urban sciences involves utilizing PostgreSQL/PostGIS spatial databases to map urban tree canopies, crop health, and model carbon footprints. By visualizing urban agriculture and industrial waste pipelines, I strive to make green planning intuitive, practical, and data-rigorous.",
            points: ["EcoTelesis carbon metrics modeler", "UC Davis Urban Sciences Edible Trees data engineer", "Pistachio Split Recognition Computer Vision specialist"]
        },
        technology: {
            title: "Advanced Technology",
            subtitle: "Logic, Models, & Pipelines",
            desc: "Logic and math provide a framework to solve large-scale problems. From training real-time YOLO object detectors to optimizing data ingest QA/QC pipelines, I specialize in building robust backend databases, reliable machine learning systems, and interactive UI playgrounds. Technology is my vehicle for putting sociological empathy and ecological stewardship into code.",
            points: ["Proficient in Python, R, SQL, Java, C++, PyTorch & Flask", "Best Assistive Tech Winner for Alzheimer's clinical Streamlit app", "Developed custom YOLO v8 pistachio fruit classification engine"]
        }
    };

    // My biometric meters for trail runs that clear my mind
    const TRAILS = {
        tahoe: {
            name: "Tahoe Rim Trail Run",
            dist: "12.5 Miles",
            elev: "2,400 ft",
            diff: "Strenuous",
            desc: "A high-altitude wilderness run on rocky ridge tracks. Connects me to the sheer scale of the Sierra Nevada mountains, offering fresh perspective away from high-powered terminals.",
            bars: { physical: 90, mental: 98, nature: 95 }
        },
        yosemite: {
            name: "Yosemite Falls Hike",
            dist: "7.6 Miles",
            elev: "2,700 ft",
            diff: "Very Hard",
            desc: "A steep, winding climb up ancient granite stairs to the top of North America's tallest waterfall. The thunderous falls and raw geology showcase nature's scaling power.",
            bars: { physical: 95, mental: 88, nature: 100 }
        },
        bigsur: {
            name: "Big Sur Coastal Climb",
            dist: "5.2 Miles",
            elev: "1,500 ft",
            diff: "Moderate",
            desc: "Hiking through old-growth redwood canyons and onto bluffs looking over the Pacific. A peaceful, sensory immersion bridging oceanic winds and ancient forest canopies.",
            bars: { physical: 65, mental: 95, nature: 92 }
        }
    };

    // Personal curios drawer items (paths changed from thumbnails/ to images/ to match clean conventions)
    const CURIOS = {
        handweaving: {
            icon: "images/weave.png",
            name: "Handweaving",
            desc: "Looms and weaving are the foundation of textile and material construction, not to mention its importance in the development of computer science through Ada Lovelace and punch cards. Using a 4-shaft table loom, I enjoy experimenting with weave structures, textures, and color combinations, allowing me to step back and consider the technical and cultural importance of fiber and textile arts."
        },
        exploration: {
            icon: "images/explore.png",
            name: "Exploration",
            desc: "I love to find new areas to explore, whether hiking hidden natural reserves or hunting down local history in urban neighborhoods. As a physical keepsake of my travels, I love to collect library cards from the different towns and cities I visit. I'm currently at 15 cards and counting!"
        },
        volunteering: {
            icon: "images/help.png",
            name: "Volunteering",
            desc: "I love to give back to my community where I can, and I love working with animals at local shelters. This is both a cathartic action since I get to play with animals and be present with them, and a meaningful way for me to contribute directly to animal welfare."
        }
    };

    const activeNodeData = INTERSECT_DATA[activeNode];

    return (
        <div className="ecosystem-grid">
            {/* LEFT COLUMN: INTERACTIVE VISUAL NODE MAP */}
            <div className="ecosystem-map-container glass-card">
                <div>
                    <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-human)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>
                        Creative Intersection Map
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "8px" }}>
                        Click on the nodes to see how my core disciplines intersect with the human experience, or select a tab on the right to explore my creative hobbies.
                    </p>
                </div>

                <div className="ecosystem-map-visual">
                    {/* SVG Connecting Lines - Active node lines light up with full gradients! */}
                    <svg className="ecosystem-svg-connectors">
                        {/* Core to Sociology */}
                        <line
                            x1="50%" y1="40%" x2="15%" y2="5%"
                            className={`ecosystem-line ${activeNode === 'sociology' ? 'active ecosystem-line-soc' : ''}`}
                        />
                        {/* Core to Environment */}
                        <line
                            x1="50%" y1="40%" x2="85%" y2="5%"
                            className={`ecosystem-line ${activeNode === 'environment' ? 'active ecosystem-line-env' : ''}`}
                        />
                        {/* Core to Technology */}
                        <line
                            x1="50%" y1="40%" x2="50%" y2="95%"
                            className={`ecosystem-line ${activeNode === 'technology' ? 'active ecosystem-line-tech' : ''}`}
                        />
                    </svg>

                    {/* Central Core Node (Me) */}
                    <div
                        className={`ecosystem-node node-core ${activeNode === 'core' ? 'active-node' : ''}`}
                        onClick={() => { setActiveNode("core"); setActiveTab("intersection"); }}
                        style={{ color: "var(--color-human)" }}
                    >
                        <span>Me</span>
                    </div>

                    {/* Academic Sociology Node */}
                    <div
                        className={`ecosystem-node node-soc ${activeNode === 'sociology' ? 'active-node' : ''}`}
                        onClick={() => { setActiveNode("sociology"); setActiveTab("intersection"); }}
                        style={{ color: "hsl(263, 90%, 65%)" }}
                    >
                        <span>Sociology</span>
                    </div>

                    {/* Environmental Sciences Node */}
                    <div
                        className={`ecosystem-node node-env ${activeNode === 'environment' ? 'active-node' : ''}`}
                        onClick={() => { setActiveNode("environment"); setActiveTab("intersection"); }}
                        style={{ color: "hsl(142, 70%, 45%)" }}
                    >
                        <span>Environment</span>
                    </div>

                    {/* Tech & Data Engineering Node */}
                    <div
                        className={`ecosystem-node node-tech ${activeNode === 'technology' ? 'active-node' : ''}`}
                        onClick={() => { setActiveNode("technology"); setActiveTab("intersection"); }}
                        style={{ color: "hsl(190, 95%, 50%)" }}
                    >
                        <span>Technology</span>
                    </div>
                </div>

                <div className="ecosystem-legend" style={{ display: "flex", justifyContent: "center", gap: "16px", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "12px" }}>
                    <span>● Clicking nodes updates the details panel</span>
                </div>
            </div>

            {/* RIGHT COLUMN: RICH DETAILS & TABS */}
            <div className="ecosystem-details-card glass-card">
                <div>
                    {/* Tabs Navigation */}
                    <div className="ecosystem-tabs">
                        <button
                            className={`ecosystem-tab-btn ${activeTab === 'intersection' ? 'active' : ''}`}
                            onClick={() => setActiveTab("intersection")}
                        >
                            My Core Intersections
                        </button>
                        <button
                            className={`ecosystem-tab-btn ${activeTab === 'fiber' ? 'active' : ''}`}
                            onClick={() => { setActiveTab("fiber"); setActiveNode("core"); }}
                        >
                            Fiber Arts
                        </button>
                        <button
                            className={`ecosystem-tab-btn ${activeTab === 'outdoors' ? 'active' : ''}`}
                            onClick={() => { setActiveTab("outdoors"); setActiveNode("core"); }}
                        >
                            Trail & Movement
                        </button>
                        <button
                            className={`ecosystem-tab-btn ${activeTab === 'niche' ? 'active' : ''}`}
                            onClick={() => { setActiveTab("niche"); setActiveNode("core"); }}
                        >
                            Outlets & Pursuits
                        </button>
                    </div>

                    {/* Tab CONTENT 1: INTERSECTION DETAILS */}
                    {activeTab === 'intersection' && activeNodeData && (
                        <div style={{ animation: "fadeIn 0.4s ease" }}>
                            <h4 className="ecosystem-panel-title">
                                {activeNodeData.title}
                            </h4>
                            <span className="ecosystem-panel-subtitle">{activeNodeData.subtitle}</span>
                            <p className="ecosystem-panel-desc">
                                {activeNodeData.desc}
                            </p>
                            <div>
                                <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
                                    Key Interdisciplinary Anchors:
                                </span>
                                <ul style={{ paddingLeft: "16px", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "6px" }}>
                                    {activeNodeData.points.map((pt, i) => (
                                        <li key={i}>{pt}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Tab CONTENT 2: FIBER ARTS TAPESTRY */}
                    {activeTab === 'fiber' && (
                        <div style={{ animation: "fadeIn 0.4s ease" }}>
                            <h4 className="ecosystem-panel-title">
                                Fiber Arts: The Tactile Code
                            </h4>
                            <span className="ecosystem-panel-subtitle">Crochet, Knitting, & Weaving Patterning</span>
                            <p className="ecosystem-panel-desc">
                                I view fiber arts as the historical precursors to computer science. Weaving looms were the first programmed machines, utilizing wood punch cards to direct threads. Crochet and knitting patterns are effectively tactile algorithms: structured loops, conditional increases, and looping recursive procedures!
                                <br /><br />
                                <strong>Try weaving your own pattern below:</strong> Click cells in the grid to weave threads. Use the color palette to switch wool yarn hues!
                            </p>

                            <div className="loom-container">
                                {/* Yarn Picker Palette */}
                                <div className="loom-controls">
                                    <span>Yarn Palette:</span>
                                    <div className="loom-color-picker">
                                        {LOOM_COLORS.map((c, i) => (
                                            <div
                                                key={i}
                                                className={`loom-color-dot ${selectedLoomColor === c ? 'active' : ''}`}
                                                style={{ backgroundColor: c }}
                                                onClick={() => setSelectedLoomColor(c)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Interactive Warp/Weft Grid Loom */}
                                <div className="loom-grid">
                                    {loomGrid.map((color, idx) => (
                                        <div
                                            key={idx}
                                            className="loom-cell"
                                            style={{ backgroundColor: color }}
                                            onClick={() => handleCellClick(idx)}
                                        />
                                    ))}
                                </div>

                                <div className="loom-controls">
                                    <button className="ecosystem-tab-btn" onClick={autoWeave} style={{ padding: "4px 10px", fontSize: "0.7rem" }}>
                                        Auto-Weave Tapestry
                                    </button>
                                    <button className="ecosystem-tab-btn" onClick={resetLoom} style={{ padding: "4px 10px", fontSize: "0.7rem" }}>
                                        Reset Loom
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab CONTENT 3: OUTDOORS & TRAILS */}
                    {activeTab === 'outdoors' && (
                        <div style={{ animation: "fadeIn 0.4s ease" }}>
                            <h4 className="ecosystem-panel-title">
                                Ecosystem Athletics
                            </h4>
                            <span className="ecosystem-panel-subtitle">Kinetic Outdoor Exploration</span>
                            <p className="ecosystem-panel-desc">
                                Connecting with physical space grounds my digital pursuits. Running trails and climbing up California's ranges allows me to study topography first-hand, bridging urban forestry theory with physical endurance.
                                <br /><br />
                                Select an adventure below to see its biometrics and nature profile:
                            </p>

                            <div className="ecosystem-tabs" style={{ marginBottom: "16px" }}>
                                {Object.keys(TRAILS).map(key => (
                                    <button
                                        key={key}
                                        className={`ecosystem-tab-btn ${activeTrail === key ? 'active' : ''}`}
                                        style={{ fontSize: "0.72rem", borderStyle: "dashed" }}
                                        onClick={() => setActiveTrail(key)}
                                    >
                                        {TRAILS[key].name}
                                    </button>
                                ))}
                            </div>

                            {TRAILS[activeTrail] && (
                                <div className="trail-tracker glass-card" style={{ padding: "16px", background: "rgba(255,255,255,0.01)" }}>
                                    <h5 style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "0.95rem" }}>
                                        {TRAILS[activeTrail].name}
                                    </h5>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", margin: "8px 0", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                                        <div>Distance: <strong>{TRAILS[activeTrail].dist}</strong></div>
                                        <div>Elevation: <strong>{TRAILS[activeTrail].elev}</strong></div>
                                        <div>Difficulty: <strong style={{ color: "var(--color-human)" }}>{TRAILS[activeTrail].diff}</strong></div>
                                    </div>
                                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                                        {TRAILS[activeTrail].desc}
                                    </p>

                                    {/* Responsive Progress Biometric Bars */}
                                    <div className="trail-bar-group">
                                        <div className="trail-bar-header">
                                            <span className="trail-bar-name">Physical Intensity</span>
                                            <span className="trail-bar-num">{TRAILS[activeTrail].bars.physical}%</span>
                                        </div>
                                        <div className="trail-progress-bg">
                                            <div className="trail-progress-fill" style={{ width: `${TRAILS[activeTrail].bars.physical}%` }} />
                                        </div>
                                    </div>

                                    <div className="trail-bar-group" style={{ marginTop: "8px" }}>
                                        <div className="trail-bar-header">
                                            <span className="trail-bar-name">Mental Clarity Recharge</span>
                                            <span className="trail-bar-num">{TRAILS[activeTrail].bars.mental}%</span>
                                        </div>
                                        <div className="trail-progress-bg">
                                            <div className="trail-progress-fill" style={{ width: `${TRAILS[activeTrail].bars.mental}%`, background: "linear-gradient(90deg, var(--color-human), var(--color-primary))" }} />
                                        </div>
                                    </div>

                                    <div className="trail-bar-group" style={{ marginTop: "8px" }}>
                                        <div className="trail-bar-header">
                                            <span className="trail-bar-name">Ecological Connection</span>
                                            <span className="trail-bar-num">{TRAILS[activeTrail].bars.nature}%</span>
                                        </div>
                                        <div className="trail-progress-bg">
                                            <div className="trail-progress-fill" style={{ width: `${TRAILS[activeTrail].bars.nature}%`, background: "linear-gradient(90deg, var(--color-accent), #10b981)" }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab CONTENT 4: PERSONAL PURSUITS */}
                    {activeTab === 'niche' && (
                        <div style={{ animation: "fadeIn 0.4s ease" }}>
                            <h4 className="ecosystem-panel-title">
                                Creative Outlets & Community Pursuits
                            </h4>
                            <span className="ecosystem-panel-subtitle">Personal Outlets Outside of Code</span>
                            <p className="ecosystem-panel-desc">
                                Engaging in hands-on hobbies and community outlets keeps my mind agile, balanced, and grounded, reminding me that data-driven systems should always serve human lives.
                                <br /><br />
                                Click a pursuit in my drawer to examine it:
                            </p>

                            <div className="curio-grid">
                                {Object.keys(CURIOS).map(key => {
                                    const isImage = CURIOS[key].icon && CURIOS[key].icon.endsWith(".png");
                                    return (
                                        <div
                                            key={key}
                                            className={`curio-item ${activeCurio === key ? 'active-node' : ''}`}
                                            style={{ borderColor: activeCurio === key ? 'var(--color-human)' : '' }}
                                            onClick={() => setActiveCurio(key)}
                                        >
                                            <span className="curio-icon" style={{ display: "block", textAlign: "center" }}>
                                                {isImage ? (
                                                    <img
                                                        src={CURIOS[key].icon}
                                                        alt={CURIOS[key].name}
                                                        className="curio-grid-icon"
                                                    />
                                                ) : CURIOS[key].icon}
                                            </span>
                                            <span className="curio-name">{CURIOS[key].name}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {CURIOS[activeCurio] && (
                                <div className="curio-popup-box">
                                    <strong style={{ color: "var(--color-human)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontSize: "0.9rem" }}>
                                        {CURIOS[activeCurio].icon && CURIOS[activeCurio].icon.endsWith(".png") ? (
                                            <img
                                                src={CURIOS[activeCurio].icon}
                                                alt=""
                                                className="curio-detail-icon"
                                                style={{ width: "20px", height: "20px", objectFit: "contain" }}
                                            />
                                        ) : CURIOS[activeCurio].icon}
                                        {CURIOS[activeCurio].name}
                                    </strong>
                                    <p style={{ lineHeight: "1.5" }}>{CURIOS[activeCurio].desc}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EcosystemComponent;
