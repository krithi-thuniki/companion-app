import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../Navbar";
import "./index.css";

// Constants...
const DEFAULT_WORK = 25 * 60; // seconds
const DEFAULT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;
const CYCLE_LIMIT = 4;

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

  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  // --- NEW: refs to always read latest values from anywhere (including inside effects)
  const workTimeRef = useRef(workTime);
  const breakTimeRef = useRef(breakTime);
  const cyclesRef = useRef(cycles);
  const dailyMinutesRef = useRef(dailyMinutes);
  const isWorkRef = useRef(isWork);

  // keep refs in sync with state
  useEffect(() => { workTimeRef.current = workTime; }, [workTime]);
  useEffect(() => { breakTimeRef.current = breakTime; }, [breakTime]);
  useEffect(() => { cyclesRef.current = cycles; }, [cycles]);
  useEffect(() => { dailyMinutesRef.current = dailyMinutes; }, [dailyMinutes]);
  useEffect(() => { isWorkRef.current = isWork; }, [isWork]);

  // Persist state in localStorage
  useEffect(() => {
    localStorage.setItem("pomodoro-timeLeft", JSON.stringify(timeLeft));
    localStorage.setItem("pomodoro-isRunning", JSON.stringify(isRunning));
    localStorage.setItem("pomodoro-isWork", JSON.stringify(isWork));
    localStorage.setItem("pomodoro-cycles", JSON.stringify(cycles));
    localStorage.setItem("pomodoro-dailyMinutes", JSON.stringify(dailyMinutes));
  }, [timeLeft, isRunning, isWork, cycles, dailyMinutes]);

  // ✅ Helper: Log to backend (reads from refs to ensure latest values)
  const logPomodoroAction = async (actionType, override = {}) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No token found in localStorage — user not logged in");
        return;
      }

      // Read the latest values (use override when a caller wants to pass explicit numbers)
      const payload = {
        actionType,
        isWork: override.isWork ?? isWorkRef.current,
        workTime: override.workTime ?? workTimeRef.current,
        breakTime: override.breakTime ?? breakTimeRef.current,
        cycles: override.cycles ?? cyclesRef.current,
        dailyMinutes: override.dailyMinutes ?? dailyMinutesRef.current,
      };

      const res = await fetch("http://localhost:5000/api/pomodoro/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📤 Pomodoro log response:", data);

      if (!res.ok) {
        console.error("❌ Pomodoro log failed:", data);
      }
    } catch (err) {
      console.error("🔥 Error logging Pomodoro action:", err);
    }
  };

  // Format mm:ss
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Beep etc...
  const playBeep = (isWorkSessionEnd) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const frequency = isWorkSessionEnd ? 1000 : 500;
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.3);
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(frequency, ctx.currentTime + 0.4);
    osc2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.4);
    osc2.stop(ctx.currentTime + 0.7);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Timer logic — useEffect still depends on relevant state so it re-creates when times change
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) return prev - 1;

          clearInterval(timerRef.current);
          playBeep(isWorkRef.current);

          if (isWorkRef.current) {
            showToast("✅ Work done! Take a break ☕");

            // increment dailyMinutes by integer minutes of the work session
            const addedMinutes = Math.round(workTimeRef.current / 60);
            setDailyMinutes((d) => {
              const next = d + addedMinutes;
              return next;
            });

            // switch to break
            setIsWork(false);
            setTimeLeft(cyclesRef.current + 1 === CYCLE_LIMIT ? LONG_BREAK : breakTimeRef.current);

            // Log the sessionComplete with the exact numbers (use override)
            logPomodoroAction("sessionComplete", {
              isWork: true,
              workTime: workTimeRef.current,
              breakTime: breakTimeRef.current,
              cycles: cyclesRef.current,
              dailyMinutes: dailyMinutesRef.current + addedMinutes, // show the new daily total
            });
          } else {
            showToast("🚀 Break over! Back to work 💻");
            setIsWork(true);
            setTimeLeft(workTimeRef.current);
            setCycles((c) => (c + 1) % CYCLE_LIMIT);
          }

          setIsRunning(false);
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, /* include times so effect re-creates on change */ workTime, breakTime, cycles]);

  // Handlers: use latest values via refs where useful
  const handleStartPause = () => {
    setIsRunning((prev) => {
      const newRunning = !prev;
      // log using latest values
      logPomodoroAction(newRunning ? "start" : "pause");
      return newRunning;
    });
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setIsWork(true);
    setTimeLeft(workTimeRef.current);
    setCycles(0);
    // log reset with current values
    logPomodoroAction("reset");
  };

  // when user edits work/break inputs, coerce to integer seconds
  const onWorkMinsChange = (e) => {
    const mins = parseInt(e.target.value, 10) || 0;
    setWorkTime(mins * 60);
  };
  const onBreakMinsChange = (e) => {
    const mins = parseInt(e.target.value, 10) || 0;
    setBreakTime(mins * 60);
  };

  // UI below unchanged except input onChange handlers
  return (
    <div className={`pomodoro-container ${theme}`}>
      <Navbar />
      <h2 className="pomodoro-title">🍅 Pomodoro Timer</h2>
      <h3 className="mode-label">{isWork ? "💻 Work Session" : "☕ Break Session"}</h3>

      <div className="timer-display">{formatTime(timeLeft)}</div>

      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{
            width: `${
              ((isWork
                ? workTime - timeLeft
                : (cycles + 1 === CYCLE_LIMIT ? LONG_BREAK : breakTime) - timeLeft) /
                (isWork ? workTime : cycles + 1 === CYCLE_LIMIT ? LONG_BREAK : breakTime)) *
              100
            }%`,
          }}
        ></div>
      </div>

      <div className="controls">
        <button onClick={handleStartPause}>{isRunning ? "⏸ Pause" : "▶ Start"}</button>
        <button onClick={handleReset}>🔄 Reset</button>
        <button onClick={() => setTheme((p) => (p === "light" ? "dark" : "light"))}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      <div className="settings">
        <label>
          Work (mins):{" "}
          <input type="number" value={Math.round(workTime / 60)} onChange={onWorkMinsChange} />
        </label>
        <label>
          Break (mins):{" "}
          <input type="number" value={Math.round(breakTime / 60)} onChange={onBreakMinsChange} />
        </label>
      </div>

      <p className="cycle-info">✅ Completed Cycles: {cycles}</p>
      <p className="daily-info">📅 Today's Work: {dailyMinutes} min</p>

      {toast && <div className="toast-popup">{toast}</div>}
    </div>
  );
};

export default Pomodoro;
