import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./index.css";
import { NavLink } from "react-router-dom";
// Dynamic API base URL
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const PeerLearning = () => {
  const token = localStorage.getItem("token") || "";
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");

  // ✅ Memoize authHeader to prevent useEffect from running every render
  const authHeader = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  // Helper to safely get string from object or string
  const getString = (value, fallback = "Unknown") => {
    if (!value) return fallback;
    if (typeof value === "string") return value;
    return value.name || value.username || fallback;
  };

  // Fetch all groups
  useEffect(() => {
    axios
      .get(`${API}/api/groups`, { headers: authHeader })
      .then((res) => {
        const normalized = (res.data || []).map((g) => ({
          id: g.id || g._id,
          name: g.name,
          description: g.description || "",
          created_by: g.created_by,
          members: g.members || [],
        }));
        setGroups(normalized);
      })
      .catch((err) => {
        console.error("Failed to fetch groups:", err);
        setGroups([]);
      });
  }, [authHeader]); // ✅ dependency now safe

  // Create group
  const createGroup = async () => {
    if (!groupName.trim()) return alert("Enter a group name");
    try {
      const res = await axios.post(
        `${API}/api/groups`,
        { name: groupName.trim(), description: groupDesc.trim() },
        { headers: authHeader }
      );
      const created = res.data;
      setGroups((prev) => [{ ...created, id: created.id || created._id }, ...prev]);
      setGroupName("");
      setGroupDesc("");
    } catch (e) {
      console.error("Create group failed:", e);
      alert(e?.response?.data?.error || "Failed to create group");
    }
  };

  // Join group
  const joinGroup = async (groupId) => {
    try {
      const res = await axios.post(
        `${API}/api/groups/${groupId}/join`,
        {},
        { headers: authHeader }
      );
      const updated = res.data;
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...updated, id: updated.id || updated._id } : g))
      );
    } catch (e) {
      console.error("Join failed:", e);
      alert(e?.response?.data?.error || "Could not join group");
    }
  };

  // Delete group
  const deleteGroup = async (groupId) => {
    if (!window.confirm("Delete this group?")) return;
    try {
      const res = await axios.delete(`${API}/api/groups/${groupId}`, {
        headers: authHeader,
      });
      console.log(res.data.message);
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
    } catch (e) {
      console.error("Delete failed:", e);
      alert(e?.response?.data?.error || "Could not delete group");
    }
  };

  return (
    <div>
 <div>
    {/* 🔹 Replace Navbar with inline academic sub-navbar */}
    <nav className="sub-navbar">
      <div className="sub-nav-left">
        <Link to="/" className="sub-nav-logo">MyApp</Link>

        <NavLink
          id="tour-smart-notes"
          to="/academic/smart-notes"
          className={({ isActive }) => isActive ? "sub-nav-item active" : "sub-nav-item"}
        >Smart Notes</NavLink>

        <NavLink
          id="tour-deadline"
          to="/academic/assignment-tracker"
          className={({ isActive }) => isActive ? "sub-nav-item active" : "sub-nav-item"}
        >Deadline Tracker</NavLink>

        <NavLink
          id="tour-peer"
          to="/academic/peer-learning"
          className={({ isActive }) => isActive ? "sub-nav-item active" : "sub-nav-item"}
        >Peer Learning</NavLink>

        <NavLink
          id="tour-faq"
          to="/academic/faqs"
          className={({ isActive }) => isActive ? "sub-nav-item active" : "sub-nav-item"}
        >FAQs</NavLink>
      </div>
    </nav>
    </div>      <div className="peerlearning-container">
        {/* LEFT SIDE */}
        <div className="left-panel">
          <h1>🤝 Peer Learning</h1>
          <p>Find people with similar interests and collaborate together.</p>

          <div className="peer-input">
            <input
              type="text"
              placeholder="Enter Group Name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter Group Description..."
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
            />
            <button onClick={createGroup}>Create Group</button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-panel">
          <h2>Groups</h2>
          {groups.length === 0 ? (
            <p className="empty">No groups yet.</p>
          ) : (
            groups.map((group) => (
              <div key={group.id} className="group-card">
                <h3>{group.name}</h3>
                {group.description && <p>{group.description}</p>}
                <p>
                  Members: {(group.members || []).length}
                  <br />
                  Admin: <strong>{getString(group.created_by, "Not set")}</strong>
                </p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => joinGroup(group.id)}>Join Group</button>
                  <button
                    onClick={() => deleteGroup(group.id)}
                    style={{ background: "red", color: "white" }}
                  >
                    Delete Group
                  </button>
                  <Link
                    to={`/peerlearning/chat/${group.id}`}
                    state={{ group }}
                    className="chat-link"
                  >
                    Go to Chat
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PeerLearning;
