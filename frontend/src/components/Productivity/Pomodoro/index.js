import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../Navbar";
import "./index.css";

// ✅ Constants
const DEFAULT_WORK = 25 * 60;   // 25 minutes
const DEFAULT_BREAK = 5 * 60;   // 5 minutes
const LONG_BREAK = 15 * 60;     // 15 minutes
const CYCLE_LIMIT = 4;          // After 4 work sessions → long break

const Pomodoro = () => {
  const [workTime, setWorkTime] = useState(DEFAULT_WORK);
  const [breakTime, setBreakTime] = useState(DEFAULT_BREAK);

  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem("pomodoro-timeLeft");
    return saved ? JSON.parse(saved) : DEFAULT_WORK;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [cycles, setCycles] = useState(0);
  const [theme, setTheme] = useState("light");
  const [dailyMinutes, setDailyMinutes] = useState(() => {
    return JSON.parse(localStorage.getItem("pomodoro-dailyMinutes")) || 0;
  });

  const [toast, setToast] = useState(null); // ✅ popup messages
  const timerRef = useRef(null);

  // ✅ Persist state
  useEffect(() => {
    localStorage.setItem("pomodoro-timeLeft", JSON.stringify(timeLeft));
    localStorage.setItem("pomodoro-isRunning", JSON.stringify(isRunning));
    localStorage.setItem("pomodoro-isWork", JSON.stringify(isWork));
    localStorage.setItem("pomodoro-cycles", JSON.stringify(cycles));
    localStorage.setItem("pomodoro-dailyMinutes", JSON.stringify(dailyMinutes));
  }, [timeLeft, isRunning, isWork, cycles, dailyMinutes]);

  // ✅ Format mm:ss
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // ✅ Double beep sound (different pitch for work vs break)
  const playBeep = (isWorkSessionEnd) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const frequency = isWorkSessionEnd ? 1000 : 500;

    // First beep
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.3);

    // Second beep
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(frequency, ctx.currentTime + 0.4);
    osc2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.4);
    osc2.stop(ctx.currentTime + 0.7);
  };

  // ✅ Toast popup
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // ✅ Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) return prev - 1;

          clearInterval(timerRef.current);

          // 🔔 Play beep + toast
          playBeep(isWork);
          if (isWork) {
            showToast("✅ Work done! Take a break ☕");
            setDailyMinutes((d) => d + workTime / 60);
            setIsWork(false);
            setTimeLeft(cycles + 1 === CYCLE_LIMIT ? LONG_BREAK : breakTime);
          } else {
            showToast("🚀 Break over! Back to work 💻");
            setIsWork(true);
            setTimeLeft(workTime);
            setCycles((c) => (c + 1) % CYCLE_LIMIT);
          }

          setIsRunning(false);
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isWork, cycles, workTime, breakTime]);

  // ✅ Handlers
  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setIsWork(true);
    setTimeLeft(workTime);
    setCycles(0);
  };
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <div className={`pomodoro-container ${theme}`}>
      <Navbar />
      <h2 className="pomodoro-title">🍅 Pomodoro Timer</h2>
      <h3 className="mode-label">
        {isWork ? "💻 Work Session" : "☕ Break Session"}
      </h3>

      {/* Timer */}
      <div className="timer-display">{formatTime(timeLeft)}</div>

      {/* Progress bar */}
      {/* Progress bar */}
<div className="progress-bar">
  <div
    className="progress-bar-fill"
    style={{
      width: `${
        ((isWork
          ? workTime - timeLeft
          : (cycles + 1 === CYCLE_LIMIT ? LONG_BREAK : breakTime) - timeLeft) /
          (isWork
            ? workTime
            : cycles + 1 === CYCLE_LIMIT
            ? LONG_BREAK
            : breakTime)) *
        100
      }%`
    }}
  ></div>
</div>

      {/* Controls */}
      <div className="controls">
        <button onClick={handleStartPause}>
          {isRunning ? "⏸ Pause" : "▶ Start"}
        </button>
        <button onClick={handleReset}>🔄 Reset</button>
        <button onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      {/* Settings */}
      <div className="settings">
        <label>
          Work (mins):{" "}
          <input
            type="number"
            value={workTime / 60}
            onChange={(e) => setWorkTime(e.target.value * 60)}
          />
        </label>
        <label>
          Break (mins):{" "}
          <input
            type="number"
            value={breakTime / 60}
            onChange={(e) => setBreakTime(e.target.value * 60)}
          />
        </label>
      </div>

      {/* Stats */}
      <p className="cycle-info">✅ Completed Cycles: {cycles}</p>
      <p className="daily-info">📅 Today's Work: {dailyMinutes} min</p>

      {/* ✅ Toast popup */}
      {toast && <div className="toast-popup">{toast}</div>}
    </div>
  );
};

export default Pomodoro;
