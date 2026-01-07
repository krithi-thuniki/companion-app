import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "../academic.css";

const SmartNotes = () => {
  // 🧭 Guided Tour State
  const [tourStep, setTourStep] = useState(0);

  const tourSteps = [
    { id: "tour-smart-notes", text: "Start here to create and organize your notes 📘" },
    { id: "tour-deadline", text: "Track assignments and never miss deadlines ⏰" },
    { id: "tour-peer", text: "Collaborate and learn with peers 🤝" },
    { id: "tour-faq", text: "Find answers quickly when you’re stuck ❓" },
  ];

  const currentTarget =
    tourStep > 0 ? document.getElementById(tourSteps[tourStep - 1].id) : null;

  const targetPosition = currentTarget
    ? currentTarget.getBoundingClientRect()
    : null;

  return (
    <div className="academic-container">
      {/* SUB NAVBAR */}
      <nav className="sub-navbar">
        <div className="sub-nav-left">
          <Link to="/" className="sub-nav-logo">MyApp</Link>

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
                  tourStep === tourSteps.length ? setTourStep(0) : setTourStep(tourStep + 1)
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

      {/* PAGE CONTENT */}
      <div style={{ padding: "20px" }}>
        <h1>📝 Smart Notes</h1>
        <p>This is the Smart Notes landing page.</p>
      </div>
    </div>
  );
};

export default SmartNotes;
