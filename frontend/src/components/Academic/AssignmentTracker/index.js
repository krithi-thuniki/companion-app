import React, { useState, useEffect, useRef, useCallback } from "react";
import { format, parseISO, isBefore, subHours, isToday } from "date-fns";
import "./index.css";
import { Link, NavLink } from "react-router-dom";

// 👇 Import backend API helper
import { apiFetch } from "../../../services/backendApi";

const AssignmentTracker = () => {
  const token = localStorage.getItem("token");

  // tasks + form state
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");

  // show October 2025 by default so it matches your screenshot
  const [calendarDate, setCalendarDate] = useState(new Date(2025, 9, 1));
  const [streak, setStreak] = useState(() =>
    JSON.parse(localStorage.getItem("streak") || "0")
  );
  const [lastStreakDate, setLastStreakDate] = useState(() => {
    const saved = localStorage.getItem("lastStreakDate");
    return saved ? new Date(saved) : null;
  });

  const remindedTasksRef = useRef(new Set());

  // Fetch tasks from backend
  const fetchTasks = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiFetch("/tasks");
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch tasks error:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Save streak
  useEffect(() => {
    localStorage.setItem("streak", JSON.stringify(streak));
    if (lastStreakDate)
      localStorage.setItem("lastStreakDate", lastStreakDate.toISOString());
  }, [streak, lastStreakDate]);

  // Reminder system (every 1 minute)
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const now = new Date();

      tasks.forEach((task) => {
        if (!task.deadline || remindedTasksRef.current.has(task._id)) return;

        const taskTime = parseISO(task.deadline);
        const oneHourBefore = subHours(taskTime, 1);

        if (isBefore(oneHourBefore, now) && isBefore(now, taskTime)) {
          remindedTasksRef.current.add(task._id);

          if (Notification.permission === "granted") {
            new Notification("⏰ Deadline Reminder", {
              body: `"${task.text}" is due at ${format(taskTime, "hh:mm a")}`,
            });
          }

          const sound = new Audio("/notification.mp3");
          sound.play().catch(() => {});
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  // Add new task
  const addTask = async () => {
    if (!newTask.trim() || !deadline) return alert("Please enter all fields!");
    const deadlineDate = new Date(deadline);
    if (isBefore(deadlineDate, new Date()))
      return alert("❌ Cannot add past deadlines!");

    try {
      const task = await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({ text: newTask, deadline, priority }),
      });

      if (task && task._id) {
        setTasks((prev) => [...prev, task]);
        setNewTask("");
        setDeadline("");
        setPriority("Medium");
      }
    } catch (err) {
      console.error("Add task error:", err);
    }
  };

  // Toggle completion
  const toggleComplete = async (id) => {
    try {
      const updatedTask = await apiFetch(`/tasks/${id}/toggle`, {
        method: "PUT",
      });
      if (updatedTask && updatedTask._id) {
        setTasks((prev) => prev.map((t) => (t._id === id ? updatedTask : t)));
      }
    } catch (err) {
      console.error("Toggle complete error:", err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await apiFetch(`/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  // Daily streak logic
  useEffect(() => {
    const todayTasks = tasks.filter((t) => isToday(new Date(t.deadline)));
    const allDone =
      todayTasks.length > 0 && todayTasks.every((t) => t.completed);

    if (allDone && (!lastStreakDate || !isToday(lastStreakDate))) {
      setStreak((prev) => prev + 1);
      setLastStreakDate(new Date());
    }
  }, [tasks, lastStreakDate]);

  // Filters
  const filteredTasks = tasks.filter((task) => {
    const now = new Date();
    const deadlineDate = new Date(task.deadline);

    switch (filter) {
      case "High Priority":
        return task.priority === "High" && deadlineDate >= now;
      case "Overdue":
        return !task.completed && deadlineDate < now;
      case "This Week":
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        return deadlineDate >= now && deadlineDate <= nextWeek;
      case "History":
        return task.completed || deadlineDate < now;
      default:
        return deadlineDate >= now;
    }
  });

  // Navigation helpers (optional)
  const prevMonth = () =>
    setCalendarDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setCalendarDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // build calendar cells (handles accurate weekday alignment)
  const renderCalendarCells = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth(); // 0-indexed
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun

    const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;
    const cells = [];

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDayIndex + 1;
      const isEmpty = dayNumber <= 0 || dayNumber > daysInMonth;

      if (isEmpty) {
        cells.push(
          <div key={`empty-${i}`} className="calendar-day empty">
            <div className="calendar-empty" />
          </div>
        );
      } else {
       const date = new Date(year, month, dayNumber);
const dateStr = format(date, "yyyy-MM-dd");

// FIXED: always parse ISO string properly to avoid timezone shift
// FIX: Convert stored ISO date to its true UTC calendar day
const todaysTasks = tasks.filter((t) => {
  if (!t.deadline) return false;

  const d = parseISO(t.deadline);  // interpret MongoDB stored date

  // extract only the UTC date parts (this avoids timezone shift)
  const fixedDate = new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate()
  );

  const fixedDateStr = format(fixedDate, "yyyy-MM-dd");

  return fixedDateStr === dateStr;
});



        const isCurrentDay = isToday(date);

        // show up to 3 dots, then a +n indicator
        const dotsToShow = todaysTasks.slice(0, 3);
        const extra = todaysTasks.length - dotsToShow.length;

        cells.push(
          <div
            key={`day-${dayNumber}`}
            className={`calendar-day ${isCurrentDay ? "today-highlight" : ""}`}
          >
            <div className="date-pill">{dayNumber}</div>

            <div className="dots-container">
              {dotsToShow.map((t) => {
                const color =
                  t.priority === "High"
                    ? "#ff4b5c"
                    : t.priority === "Medium"
                    ? "#ff9800"
                    : "#4caf50";
                return (
                  <span
                    key={t._id}
                    className="deadline-dot"
                    style={{ backgroundColor: color }}
                    title={`${t.priority} - ${t.text}`}
                  />
                );
              })}

              {extra > 0 && <span className="extra-count">+{extra}</span>}
            </div>
          </div>
        );
      }
    }

    return cells;
  };

  return (
    <div>
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
    </nav>      <div className="tracker-container">
        <div className="task-section">
          <h1>📅 Deadline Tracker</h1>
          <p>🔥 Streak: {streak} days</p>

          <div className="input-area">
            <input
              type="text"
              placeholder="Enter assignment..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="High">🔥 High</option>
              <option value="Medium">⚡ Medium</option>
              <option value="Low">🌱 Low</option>
            </select>
            <button onClick={addTask}>Add Task</button>
          </div>

          <div className="filter-bar">
            {["All", "High Priority", "Overdue", "This Week", "History"].map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={filter === f ? "active" : ""}
                >
                  {f}
                </button>
              )
            )}
          </div>

          <div className="task-list">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className={`task-card ${task.priority.toLowerCase()} ${
                    task.completed ? "completed" : ""
                  } ${filter === "History" ? "history" : ""}`}
                >
                  <h3>{task.text}</h3>
                  <p>⏰ {format(new Date(task.deadline), "PPpp")}</p>
                  <span className="priority-tag">{task.priority}</span>
                  <div className="task-actions">
                    <button onClick={() => toggleComplete(task._id)}>
                      {task.completed ? "✅ Undo" : "✔ Mark Done"}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task._id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-task">
                {filter === "History" ? "No past tasks 📜" : "No tasks found 🎉"}
              </p>
            )}
          </div>
        </div>

        {/* Calendar Section (accurate weekday alignment) */}
        <div className="calendar-section">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="nav-btn" onClick={prevMonth}>
              ◀
            </button>
            <h2 style={{ margin: 0 }}>{format(calendarDate, "LLLL yyyy")}</h2>
            <button className="nav-btn" onClick={nextMonth}>
              ▶
            </button>
          </div>

          <div className="calendar-grid" aria-hidden={false}>
            {/* headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="calendar-header">
                {d}
              </div>
            ))}

            {/* days */}
            {renderCalendarCells()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentTracker;
