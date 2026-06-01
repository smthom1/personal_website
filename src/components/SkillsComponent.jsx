import React, { useState, useEffect, useMemo } from 'react';

// ==========================================================================
// MY INTERACTIVE COMPETENCIES PANEL
// ==========================================================================
// I decided to make this qualitative rather than quantitative.
// Honestly, giving myself "85% in Python" or "90% in Machine Learning" felt 
// completely arbitrary and a bit corporate. I either can do the thing, or I 
// am actively learning it! Here is a clean, searchable breakdown.
// ==========================================================================

const SKILLS_DATA = [
    {
        id: "languages",
        name: "Programming Languages",
        category: "languages",
        desc: "Advanced software engineering and scripting capabilities. Highly proficient in Python and R for custom statistical models, SQL for complex relational database wrangling, and structured Java/C++ object-oriented designs.",
        tools: ["Python", "R Language", "SQL", "Java", "C++", "JavaScript", "SAS Core", "CSS & HTML5"]
    },
    {
        id: "ml",
        name: "Machine Learning & AI Modeling",
        category: "ml",
        desc: "Specialized in training and deploying deep learning pipelines. Practical expertise in convolutional neural networks, YOLO object detection classifiers, CVAT image annotations, and modern transformer API integrations.",
        tools: ["Machine Learning", "YOLO Object Detection", "CVAT Annotations", "PyTorch Framework", "Predictive Modeling", "Gemini & OpenAI APIs"]
    },
    {
        id: "stats",
        name: "Data Analytics & Statistics",
        category: "stats",
        desc: "Performing deep mathematical inference and data modeling. Experienced in exploratory data analysis (EDA), time-series predictions, A/B testing validations, regression analyses, and agent-based spatial simulations.",
        tools: ["Statistical Inference", "Time-series Forecasting", "Exploratory Analytics (EDA)", "Agent-Based Modeling", "Streamlit Dashboarding", "D3.js Visualization"]
    },
    {
        id: "databases",
        name: "Data Engineering & Databases",
        category: "databases",
        desc: "Architecting relational, NoSQL, and geospatial database layouts. Expert in optimizing automated Python ETL ingestion scripts, bulk CSV manipulations, and large-scale data sanity QA/QC algorithms.",
        tools: ["PostgreSQL", "PostGIS Spatial Extension", "MongoDB NoSQL", "MySQL / Oracle DB", "Automated QA/QC Scripts", "ETL Data Pipelines"]
    }
];

const SkillsComponent = () => {
    const [skills, setSkills] = useState(SKILLS_DATA);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [selectedSkillId, setSelectedSkillId] = useState(SKILLS_DATA[0].id);
    const [animated, setAnimated] = useState(false);

    // Simple mount trigger to fade things in smoothly
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimated(true);
        }, 150);
        return () => clearTimeout(timer);
    }, []);

    // Filter skills dynamically in real-time based on categories and search query
    // Recruiting managers can type "Python" or "SQL" and see exactly what fits
    const filteredSkills = useMemo(() => {
        return skills.filter(skill => {
            const matchesCategory = activeCategory === "all" || skill.category === activeCategory;
            const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 skill.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 skill.tools.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [skills, searchTerm, activeCategory]);

    // Make sure we select the first matching skill in a category when a tab is clicked
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        const matching = SKILLS_DATA.find(s => category === "all" || s.category === category);
        if (matching) {
            setSelectedSkillId(matching.id);
        }
    };

    const selectedSkillDetails = useMemo(() => {
        return SKILLS_DATA.find(s => s.id === selectedSkillId);
    }, [selectedSkillId]);

    return (
        <React.Fragment>
            <h3>Core Competencies</h3>
            <p className="skills-intro-text">
                My data science skills are fully interactive. Filter by domain or search tools in real-time:
            </p>

            {/* Dynamic Category Filtering Tabs */}
            <div className="skills-react-categories">
                <button 
                    className={`skills-react-cat-btn ${activeCategory === "all" ? "active" : ""}`}
                    onClick={() => handleCategoryChange("all")}
                >
                    All Skills
                </button>
                <button 
                    className={`skills-react-cat-btn ${activeCategory === "languages" ? "active" : ""}`}
                    onClick={() => handleCategoryChange("languages")}
                >
                    Languages
                </button>
                <button 
                    className={`skills-react-cat-btn ${activeCategory === "ml" ? "active" : ""}`}
                    onClick={() => handleCategoryChange("ml")}
                >
                    Machine Learning & AI
                </button>
                <button 
                    className={`skills-react-cat-btn ${activeCategory === "stats" ? "active" : ""}`}
                    onClick={() => handleCategoryChange("stats")}
                >
                    Statistics & Viz
                </button>
                <button 
                    className={`skills-react-cat-btn ${activeCategory === "databases" ? "active" : ""}`}
                    onClick={() => handleCategoryChange("databases")}
                >
                    Data Engineering
                </button>
            </div>

            {/* Real-Time Live Search Input */}
            <div className="skills-search-wrapper">
                <svg className="skills-search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input 
                    type="text" 
                    className="skills-search-input" 
                    placeholder="Search tools, models, or conceptual databases (e.g. Python, YOLO, PostGIS)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Dynamically Rendered Skills Grid */}
            <div className="skills-list">
                {filteredSkills.length > 0 ? (
                    filteredSkills.map(skill => (
                        <div 
                            key={skill.id} 
                            className={`skill-item ${selectedSkillId === skill.id ? "selected-skill" : ""}`}
                            style={{ 
                                cursor: "pointer",
                                padding: "12px 18px",
                                borderRadius: "var(--radius-sm)",
                                border: "1px solid var(--border-color)",
                                background: selectedSkillId === skill.id ? "rgba(6, 182, 212, 0.06)" : "transparent",
                                borderColor: selectedSkillId === skill.id ? "var(--color-accent)" : "var(--border-color)",
                                transition: "all var(--transition-fast) ease"
                            }}
                            onClick={() => setSelectedSkillId(skill.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setSelectedSkillId(skill.id);
                                }
                            }}
                        >
                            <div className="skill-info" style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "flex-start" }}>
                                <span style={{ 
                                    color: selectedSkillId === skill.id ? "var(--color-accent)" : "var(--text-muted)",
                                    fontSize: "0.8rem"
                                }}>✦</span>
                                <span className="skill-name" style={{ fontSize: "1.02rem" }}>{skill.name}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-muted)", fontSize: "0.95rem" }}>
                        No matching skills found.
                    </div>
                )}
            </div>

            {/* Rich Detail Panel dynamically showing details of the active selected item */}
            {selectedSkillDetails && (
                <div className="skills-detail-panel">
                    <h4 className="skills-detail-title">{selectedSkillDetails.name}</h4>
                    <p className="skills-detail-desc">{selectedSkillDetails.desc}</p>
                    
                    <div style={{ marginTop: "16px" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
                            Core Technologies & Competencies:
                        </span>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {selectedSkillDetails.tools.map((tool, idx) => (
                                <span 
                                    key={idx} 
                                    style={{ 
                                        fontSize: "0.7rem", 
                                        fontWeight: "600", 
                                        padding: "4px 10px", 
                                        borderRadius: "var(--radius-full)", 
                                        backgroundColor: "rgba(6, 182, 212, 0.1)", 
                                        border: "1px solid rgba(6, 182, 212, 0.2)",
                                        color: "var(--color-accent)" 
                                    }}
                                >
                                    {tool}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default SkillsComponent;
