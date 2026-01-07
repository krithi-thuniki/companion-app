import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./academic.css";
import { useScrollReveal } from "./useScrollReveal"; // make sure this file exists


const AcademicPage = () => {
  // 🧭 Guided Tour State
  const [tourStep, setTourStep] = useState(0);

  const tourSteps = [
    {
      id: "tour-smart-notes",
      text: "Start here to create and organize your notes 📘",
    },
    {
      id: "tour-deadline",
      text: "Track assignments and never miss deadlines ⏰",
    },
    {
      id: "tour-peer",
      text: "Collaborate and learn with peers 🤝",
    },
    {
      id: "tour-faq",
      text: "Find answers quickly when you’re stuck ❓",
    },
  ];

  const currentTarget =
    tourStep > 0
      ? document.getElementById(tourSteps[tourStep - 1].id)
      : null;

  const targetPosition = currentTarget
    ? currentTarget.getBoundingClientRect()
    : null;
 const [heroRef, heroVisible] = useScrollReveal({ threshold: 0.2 });
  const [statsRef, statsVisible] = useScrollReveal({ threshold: 0.2 });
  const [toolsRef, toolsVisible] = useScrollReveal({ threshold: 0.2 });
  const [tipsRef, tipsVisible] = useScrollReveal({ threshold: 0.2 });
  return (
    <div className="academic-container">
      {/* SUB NAVBAR */}
      <nav className="sub-navbar">
        <div className="sub-nav-left">
          <Link to="/" className="sub-nav-logo">
            MyApp
          </Link>

          <NavLink
            id="tour-smart-notes"
            to="/academic/smart-notes"
            className={({ isActive }) =>
              isActive ? "sub-nav-item active" : "sub-nav-item"
            }
          >
            Smart Notes
          </NavLink>

          <NavLink
            id="tour-deadline"
            to="/academic/assignment-tracker"
            className={({ isActive }) =>
              isActive ? "sub-nav-item active" : "sub-nav-item"
            }
          >
            Deadline Tracker
          </NavLink>

          <NavLink
            id="tour-peer"
            to="/academic/peer-learning"
            className={({ isActive }) =>
              isActive ? "sub-nav-item active" : "sub-nav-item"
            }
          >
            Peer Learning
          </NavLink>

          <NavLink
            id="tour-faq"
            to="/academic/faqs"
            className={({ isActive }) =>
              isActive ? "sub-nav-item active" : "sub-nav-item"
            }
          >
            FAQs
          </NavLink>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="academic-content">
        {/* HERO SECTION */}
 <div ref={heroRef} className={`academic-hero ${heroVisible ? "reveal-right" : "hidden-right"}`}>     
       <h1>
            Empower Your <span>Academic Journey</span>
          </h1>

          <p>
            Smart tools to organize studies, track deadlines, and collaborate
            effortlessly — all in one place.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => setTourStep(1)}
            >
              Guided Tour
            </button>
          </div>

          <p className="hero-subtext">
            Student-friendly • Built for focus
          </p>
        </div>

        {/* 🧩 GUIDED TOUR OVERLAY */}
        {tourStep > 0 && targetPosition && (
          <div className="tour-overlay">
            <div
              className="tour-tooltip"
              style={{
                top: targetPosition.bottom + 12,
                left: targetPosition.left,
              }}
            >
              <p>{tourSteps[tourStep - 1].text}</p>

              <div className="tour-actions">
                <button
                  className="btn-primary"
                  onClick={() =>
                    tourStep === tourSteps.length
                      ? setTourStep(0)
                      : setTourStep(tourStep + 1)
                  }
                >
                  {tourStep === tourSteps.length ? "Finish" : "Next"}
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => setTourStep(0)}
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATS */}
<div ref={statsRef} className={`academic-stats ${statsVisible ? "reveal-left" : "hidden-left"}`}>

          <div className="stat-card accent">
            <h2>Privacy-Focused</h2>
            <p>Your Data, Fully Secure</p>
          </div>

          <div className="stat-card light">
            <h2>4</h2>
            <p>Academic Tools Live</p>
          </div>

          <div className="stat-card dark">
            <h2>100%</h2>
            <p>Custom-Built UI</p>
          </div>

          <div className="stat-card light">
            <h2>Weekly</h2>
            <p>Feature Updates</p>
          </div>
        </div>
        {/* TOOLS */}
                <div ref={toolsRef} className={`academic-tools ${toolsVisible ? "reveal-right" : "hidden-right"}`}>

          <div className="tool-card">
            <h3>Smart Notes</h3>
            <p>Create, organize, and review notes efficiently.</p>
          </div>

          <div className="tool-card">
            <h3>Deadline Tracker</h3>
            <p>Stay on top of assignments and submission dates.</p>
          </div>

          <div className="tool-card">
            <h3>Peer Learning</h3>
            <p>Collaborate with classmates and enhance understanding.</p>
          </div>

          <div className="tool-card">
            <h3>Quiz & Assessment</h3>
            <p>Test your knowledge with interactive quizzes.</p>
          </div>
        </div>
        {/* TIPS */}
                <div ref={tipsRef} className={`academic-tips ${tipsVisible ? "reveal-left" : "hidden-left"}`}>

          <h2>Daily Study Tips</h2>
          <ul>
            <li>Break your study sessions into small chunks.</li>
            <li>Take short breaks every 25–30 minutes.</li>
            <li>Review notes and concepts daily.</li>
            <li>Use peer collaboration to reinforce learning.</li>
          </ul>
        </div>
      </div>
      </div>
  );
};

export default AcademicPage;
