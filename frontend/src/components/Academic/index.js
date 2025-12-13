import { Link } from "react-router-dom";
import "./academic.css";

function AcademicPage() {
  return (
    <div className="academic-container">
      
      {/* SUB NAVBAR */}
      <nav className="sub-navbar">
        <Link to="/academic/smart-notes" className="sub-nav-item">Smart Notes</Link>
        <Link to="/academic/assignment-tracker" className="sub-nav-item">Deadline Tracker</Link>
        <Link to="/academic/peer-learning" className="sub-nav-item">Peer Learning</Link>
        <Link to="/academic/faqs" className="sub-nav-item">FAQs</Link>
      </nav>

      {/* PAGE CONTENT */}
      <div className="academic-content">
        <h2>Select a tool from above</h2>
      </div>
      
    </div>
  );
}

export default AcademicPage;
