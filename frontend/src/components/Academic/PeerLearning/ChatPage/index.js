import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import "./index.css";
import { NavLink, Link } from "react-router-dom";


const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ChatPage = () => {
  const { groupId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("currentUser")) ||
    {};
  const token = localStorage.getItem("token") || "";

  const [group, setGroup] = useState(location.state?.group || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [chatSocket, setChatSocket] = useState(null);

  const authHeader = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch group if not passed
  useEffect(() => {
    if (group) return;
    axios
      .get(`${API}/api/groups/${groupId}`, { headers: authHeader })
      .then((res) => {
        const g = res.data;
        setGroup({ ...g, id: g.id || g._id });
      })
      .catch(() => navigate("/academic/peer-learning"));
  }, [group, groupId, authHeader, navigate]);

  // Fetch messages
  useEffect(() => {
    if (!group) return;
    axios
      .get(`${API}/api/messages/${group.id}`, { headers: authHeader })
      .then((res) => setMessages(res.data || []))
      .catch((err) => console.error("Error loading messages:", err));
  }, [group, authHeader]);

  // Initialize socket with JWT
  useEffect(() => {
    if (!group) return;

    const socketInstance = io(API, { auth: { token } });
    setChatSocket(socketInstance);

    socketInstance.emit("join_group", { groupId: group.id });

    const handleNewMessage = (msg) => setMessages((prev) => [...prev, msg]);
    socketInstance.on("new_message", handleNewMessage);

    return () => {
      socketInstance.emit("leave_group", { groupId: group.id });
      socketInstance.off("new_message", handleNewMessage);
      socketInstance.disconnect();
    };
  }, [group, token]);

  // Scroll to bottom on messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !group || !chatSocket) return;

    chatSocket.emit("send_message", {
      groupId: group.id,
      text,
    });
    setInput("");
  };

  if (!group) {
    return (
      <>
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
    </nav></div>        <div className="chatpage-container">Loading chat...</div>
      </>
    );
  }

  const me = (currentUser.username || currentUser.name || "").toLowerCase();

  return (
    <>
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
    </nav></div>      <div className="chatpage-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <h2>{group.name}</h2>
          {group.description && <p className="group-desc">{group.description}</p>}

          <h4>Members</h4>
          <ul className="member-list">
            {(group.members || []).map((m) => {
              // Ensure username is a string
              const username =
                typeof m === "string"
                  ? m
                  : m.username || m.name || "Unknown";
              return (
                <li key={m._id || username} className="member-item">
                  <div className="avatar">
                    {username[0]?.toUpperCase() || "U"}
                    <span className="status-dot online"></span>
                  </div>
                  <span>{username}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Chat area */}
        <div className="chat-main">
          <div className="messages">
            {messages.map((msg) => {
              // Extract sender as string
              const sender =
                msg.senderName ||
                (msg.sender?.name ?? msg.sender?.username) ||
                "User";
              const created = msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";
              return (
                <div
                  key={msg.id || `${sender}-${msg.createdAt}-${msg.text}`}
                  className={`message ${
                    sender.toLowerCase() === me ? "user" : "other"
                  }`}
                >
                  <div className="msg-header">
                    <strong>{sender}</strong>
                    <span className="time">{created}</span>
                  </div>
                  <div className="msg-body">{msg.text}</div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
