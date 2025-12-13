/* ================= HOME PAGE ================= */
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar";

/* 🔥 30 Daily Tips */
const tips = [
  "Stay consistent, even small progress matters.",
  "Break tasks into smaller chunks.",
  "Avoid multitasking, focus on one thing.",
  "Use a to-do list to track tasks.",
  "Take 5 min breaks every 25 min.",
  "Review your goals every Sunday.",
  "Learn something new daily.",
  "Start with the hardest task first.",
  "Avoid checking your phone for 1 hour in the morning.",
  "Plan tomorrow before sleeping.",
  "Celebrate small wins.",
  "Eliminate one distraction today.",
  "Write down your top 3 priorities.",
  "Practice mindfulness for 5 min.",
  "Drink enough water today.",
  "Do one task you’ve been procrastinating.",
  "Limit social media to 30 min.",
  "Use positive affirmations.",
  "Keep your desk tidy.",
  "Learn a new shortcut in your tools.",
  "Read one motivational quote.",
  "Wake up 10 minutes earlier.",
  "Reflect on your progress today.",
  "Help someone without expecting anything.",
  "Eat one healthy meal today.",
  "Review your weekly goals.",
  "Spend 10 min learning a new skill.",
  "Take deep breaths when stressed.",
  "Don’t compare, focus on your journey.",
  "End the day with gratitude.",
];

/* 🔥 30 Daily Challenges */
const challenges = [
  "Write down 3 things you are grateful for.",
  "Do 10 push-ups or a quick stretch.",
  "Read 5 pages of a book.",
  "Organize your desk for 5 minutes.",
  "Compliment one person today.",
  "Take a 15 min walk.",
  "Drink 2 liters of water.",
  "Meditate for 5 minutes.",
  "Call a friend/family member.",
  "Write your goals for the week.",
  "Do 20 squats.",
  "Cook a healthy meal.",
  "Learn a new word.",
  "Write a short journal entry.",
  "Try a breathing exercise.",
  "Declutter one small space.",
  "Avoid junk food for the day.",
  "Listen to a podcast.",
  "Do 15 minutes of stretching.",
  "Limit screen time for 1 hour.",
  "Draw or doodle something.",
  "Write down one fear & how to overcome it.",
  "Do a random act of kindness.",
  "Say no to something unnecessary.",
  "Read about a new topic.",
  "Wake up without snoozing.",
  "Go to bed early.",
  "Spend 30 min without technology.",
  "Practice handwriting.",
  "Write one motivational quote.",
];

/* 🔥 30 Fun Facts */
const funFacts = [
  "Did you know? Honey never spoils.",
  "Sharks existed before trees.",
  "Bananas are berries, but strawberries are not.",
  "Octopuses have three hearts.",
  "Butterflies taste with their feet.",
  "A day on Venus is longer than a year.",
  "Sloths can hold their breath longer than dolphins.",
  "Your stomach gets a new lining every 3-4 days.",
  "Otters hold hands while sleeping.",
  "Water can boil and freeze at the same time.",
  "Avocados are poisonous to birds.",
  "Pineapples take two years to grow.",
  "Cows have best friends.",
  "Snails can sleep for 3 years.",
  "Wombat poop is cube-shaped.",
  "An ostrich’s eye is bigger than its brain.",
  "A crocodile cannot stick its tongue out.",
  "The heart of a blue whale weighs a ton.",
  "Some cats are allergic to humans.",
  "Jellyfish are 95% water.",
  "Sea otters use kelp to anchor themselves.",
  "Giraffes only sleep 30 min a day.",
  "Elephants can’t jump.",
  "Slugs have 4 noses.",
  "A group of flamingos is called a flamboyance.",
  "There are more stars than grains of sand on Earth.",
  "Tomatoes were once considered poisonous.",
  "The Eiffel Tower grows taller in summer.",
  "Owls can’t move their eyes.",
  "A cloud can weigh more than a million pounds.",
];

const HomePage = () => {
  const [streak, setStreak] = useState(0);
  const [animateFire, setAnimateFire] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showToolsModal, setShowToolsModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);

  const todayIndex = (new Date().getDate() - 1) % 30;

  useEffect(() => {
    setPageLoaded(true);
    const lastLogin = localStorage.getItem("lastLogin");
    const savedStreak = parseInt(localStorage.getItem("streak") || "0", 10);
    const today = new Date();
    const todayStr = today.toDateString();

    if (lastLogin) {
      const diffDays = Math.floor(
        (today - new Date(lastLogin)) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        setStreak(savedStreak + 1);
        localStorage.setItem("streak", savedStreak + 1);
        setAnimateFire(true);
        setTimeout(() => setAnimateFire(false), 1200);
      } else if (diffDays > 1) {
        setStreak(1);
        localStorage.setItem("streak", 1);
      } else {
        setStreak(savedStreak);
      }
    } else {
      setStreak(1);
      localStorage.setItem("streak", 1);
    }

    localStorage.setItem("lastLogin", todayStr);
  }, []);

  const suggestedTool = streak < 5 ? "Focus Timer" : "Advanced Analytics Tool";
  const toolsList = ["Pomodoro Timer", "Habit Tracker", "Goal Planner", suggestedTool];

  return (
    <div
      style={{
        opacity: pageLoaded ? 1 : 0,
        transition: "opacity 0.8s ease-in-out",
        background: "linear-gradient(135deg, #f8f5ff, #ffffff)",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <HeroSection
        streak={streak}
        onExplore={() => setShowToolsModal(true)}
        onInsights={() => setShowInsightsModal(true)}
      />

      <div
        style={{
          height: "1px",
          background: "linear-gradient(to right, transparent, #ddd, transparent)",
          margin: "40px 0",
        }}
      />

      {/* ================== Daily Cards Section ================== */}
      <div style={{ padding: "20px 20px 40px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "25px",
            marginTop: "15px",
          }}
        >
          <AnimatedCard>
            <Card title="💡 Tip of the Day" text={tips[todayIndex]} today highlight={false} />
          </AnimatedCard>
          <AnimatedCard>
            <Card
              title="🔥 Consistency Score"
              text={`${streak}-day streak`}
              animate={animateFire}
              highlight={true}
            />
          </AnimatedCard>
          <AnimatedCard>
            <Card
              title="🎯 Mini Daily Challenge"
              text={challenges[todayIndex]}
              today
              highlight={false}
            />
          </AnimatedCard>
          <AnimatedCard>
            <Card title="🤓 Brain Teaser" text={funFacts[todayIndex]} highlight={false} />
          </AnimatedCard>
        </div>
      </div>

      <AboutSection />
      <ValuesSection />

      {/* Tools Modal */}
      {showToolsModal && (
        <Modal onClose={() => setShowToolsModal(false)} title="Explore Tools">
          <ul>
            {toolsList.map((tool, i) => (
              <li key={i} style={{ marginBottom: "8px" }}>
                {tool} {i === toolsList.length - 1 && <span>🔥 New tool added today!</span>}
              </li>
            ))}
          </ul>
        </Modal>
      )}

      {/* Insights Modal */}
      {showInsightsModal && (
        <Modal onClose={() => setShowInsightsModal(false)} title="Your Insights">
          <p>📈 Current Streak: {streak}-day</p>
          <p>🎯 Today's Challenge: {challenges[todayIndex]}</p>
          <p>💡 Tip: {tips[todayIndex]}</p>
          <p>
            Filter:{" "}
            <select>
              <option>Last 7 days</option>
              <option>Last month</option>
              <option>All time</option>
            </select>
          </p>
          {streak % 7 === 0 && <p>🎉 Milestone reached! Congrats!</p>}
        </Modal>
      )}

      <Footer />
    </div>
  );
};

/* ================= ANIMATED CARD WRAPPER ================= */
const AnimatedCard = ({ children }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(40px)",
        transition: "all 0.7s ease-out",
      }}
    >
      {children}
    </div>
  );
};

/* ================= HERO SECTION ================= */
const HeroSection = ({ streak, onExplore, onInsights }) => (
  <section
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "60px 80px",
      flexWrap: "wrap",
    }}
  >
    <div style={{ maxWidth: "520px" }}>
      <p style={{ color: "#9b5de5", fontWeight: 600 }}>PERSONAL GROWTH DASHBOARD</p>
      <h1 style={{ fontSize: "42px", margin: "10px 0" }}>
        Build better habits, <br />
        <span style={{ color: "#9b5de5", position: "relative" }}>
          create meaningful progress
          <span
            style={{
              position: "absolute",
              left: 0,
              bottom: "-8px",
              width: "120px",
              height: "4px",
              borderRadius: "4px",
              background: "linear-gradient(90deg, #9b5de5, #cdb4ff)",
            }}
          />
        </span>
      </h1>
      <p style={{ color: "#555", marginBottom: "25px" }}>
        A human-centric space for productivity, consistency, self-awareness, and continuous growth.
      </p>
      <div style={{ display: "flex", gap: "15px" }}>
        <button
          style={{
            background: "#9b5de5",
            color: "white",
            padding: "12px 24px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(155,93,229,0.35)",
          }}
          onClick={onExplore}
        >
          Explore Tools
        </button>

        <button
          style={{
            background: "transparent",
            color: "#9b5de5",
            padding: "12px 24px",
            borderRadius: "10px",
            border: "1px solid #9b5de5",
            cursor: "pointer",
          }}
          onClick={onInsights}
        >
          View Insights
        </button>
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 210px)",
        gap: "20px",
        marginTop: "30px",
      }}
    >
      <AnimatedCard>
        <StatCard title="🧠 Life Tools" text="Planning & focus systems" />
      </AnimatedCard>
      <AnimatedCard>
        <StatCard
          title="🔍 Focus Area"
          text="Concentrate on what matters most today for better results"
        />
      </AnimatedCard>
      <AnimatedCard>
        <StatCard title="🎯 Daily Actions" text="Small steps, big impact" />
      </AnimatedCard>
      <AnimatedCard>
        <StatCard title="🚀 Personal Growth" text="Progress over perfection" />
      </AnimatedCard>
    </div>
  </section>
);

/* ================= ABOUT SECTION ================= */
const AboutSection = () => (
  <section
    style={{
      background: "#f5f2ff",
      padding: "50px 20px",
      textAlign: "center",
      borderRadius: "16px",
      margin: "0 20px 40px 20px",
    }}
  >
    <p style={{ color: "#555", fontWeight: 600, marginBottom: "10px" }}>ABOUT THE PROJECT</p>
    <h2 style={{ fontSize: "32px", marginBottom: "20px", color: "#111" }}>
      Your Personal Growth Companion
    </h2>
    <p style={{ maxWidth: "700px", margin: "0 auto 40px auto", color: "#555", fontSize: "16px" }}>
      This dashboard helps you track daily habits, challenges, and insights to boost productivity and consistency.
      From actionable tips to fun facts and streak tracking, everything is designed to help you grow step by step.
    </p>

    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      <AnimatedCard>
        <div
          style={{
            background: "linear-gradient(135deg, #9b5de5, #6a4cfc)",
            color: "white",
            padding: "30px",
            borderRadius: "16px",
            minWidth: "280px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontSize: "24px", marginBottom: "20px" }}>Daily Tips</h3>
          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            Practical tips to enhance focus, productivity, and well-being every day.
          </p>
          <span style={{ fontWeight: 600, fontSize: "28px" }}>💡</span>
        </div>
      </AnimatedCard>
      <AnimatedCard>
        <div
          style={{
            background: "linear-gradient(135deg, #9b5de5, #6a4cfc)",
            color: "#1b3b34",
            padding: "30px",
            borderRadius: "16px",
            minWidth: "280px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontSize: "24px", marginBottom: "20px" }}>Challenges & Streaks</h3>
          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            Engage with mini daily challenges, track your streaks, and see your progress grow consistently.
          </p>
          <span style={{ fontWeight: 600, fontSize: "28px" }}>🔥</span>
        </div>
      </AnimatedCard>
    </div>
  </section>
);

/* ================= VALUES / WELL-SPENT SECTION ================= */
const ValuesSection = () => (
  <section
    style={{
      padding: "60px 30px",
      maxWidth: "1200px",
      margin: "0 auto 60px auto",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "24px",
        marginBottom: "40px",
      }}
    >
      <div>
        <p style={{ color: "#6a4cfc", fontWeight: 600, marginBottom: "8px" }}>VALUES</p>
        <h2 style={{ fontSize: "36px", fontWeight: 700 }}>
          Make your effort, <br /> well-spent
        </h2>
      </div>

      <p style={{ maxWidth: "420px", color: "#555", lineHeight: 1.6 }}>
        This project ensures your time and attention are invested intentionally
        through clarity, habit consistency, and meaningful reflection.
      </p>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "24px",
      }}
    >
      <AnimatedCard>
        <ValueCard
          icon="🧭"
          title="Clarity by Design"
          text="Every feature is structured to remove decision fatigue, helping users act with focus instead of uncertainty."
        />
      </AnimatedCard>
      <AnimatedCard>
        <ValueCard
          icon="🌱"
          title="Sustainable Growth"
          text="The system encourages small, repeatable behaviors that compound into long-term personal improvement."
        />
      </AnimatedCard>
      <AnimatedCard>
        <ValueCard
          icon="📊"
          title="Insight-Driven Progress"
          text="User interactions translate into meaningful streaks and patterns, enabling reflection and smarter adjustments."
          highlight
        />
      </AnimatedCard>
    </div>
  </section>
);

/* ================= MODAL COMPONENT ================= */
const Modal = ({ onClose, title, children }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        maxWidth: "500px",
        width: "90%",
        padding: "30px",
        position: "relative",
      }}
    >
      <button
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          border: "none",
          background: "transparent",
          fontSize: "20px",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        ×
      </button>
      <h2 style={{ marginBottom: "20px" }}>{title}</h2>
      {children}
    </div>
  </div>
);

/* ================= STAT CARD COMPONENT ================= */
const StatCard = ({ title, text }) => (
  <div
    style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "16px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      textAlign: "center",
    }}
  >
    <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>{title}</h3>
    <p style={{ fontSize: "16px", color: "#555" }}>{text}</p>
  </div>
);

/* ================= CARD COMPONENT ================= */
const Card = ({ title, text, today, animate, highlight }) => (
  <div
    style={{
      background: highlight ? "linear-gradient(135deg,#9b5de5,#6a4cfc)" : "#fff",
      color: highlight ? "#fff" : "#111",
      padding: "25px",
      borderRadius: "16px",
      minHeight: "160px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: highlight ? "0 10px 25px rgba(155,93,229,0.3)" : "0 5px 15px rgba(0,0,0,0.05)",
      transform: animate ? "scale(1.05)" : "scale(1)",
      transition: "all 0.3s ease",
    }}
  >
    <h4 style={{ fontSize: "18px", marginBottom: "10px" }}>{title}</h4>
    <p style={{ fontSize: "16px" }}>{text}</p>
    {today && <span style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>Today</span>}
  </div>
);

/* ================= VALUE CARD COMPONENT ================= */
const ValueCard = ({ icon, title, text, highlight }) => (
  <div
    style={{
      background: highlight ? "linear-gradient(135deg,#9b5de5,#6a4cfc)" : "#fff",
      color: highlight ? "#fff" : "#111",
      padding: "25px",
      borderRadius: "16px",
      boxShadow: highlight ? "0 10px 25px rgba(155,93,229,0.3)" : "0 5px 15px rgba(0,0,0,0.05)",
      minHeight: "180px",
    }}
  >
    <div style={{ fontSize: "36px", marginBottom: "15px" }}>{icon}</div>
    <h4 style={{ fontSize: "20px", marginBottom: "10px" }}>{title}</h4>
    <p style={{ fontSize: "16px" }}>{text}</p>
  </div>
);

/* ================= FOOTER ================= */
/* ================= FOOTER ================= */
const Footer = () => (
  <footer
    style={{
      marginTop: "60px",
      padding: "40px 20px",
      background: "linear-gradient(to right, #9b5de5, #5f2eea)",
      color: "white",
      textAlign: "center",
      borderTopLeftRadius: "16px",
      borderTopRightRadius: "16px",
    }}
  >
    {/* Quote */}
    <p style={{ fontStyle: "italic", opacity: 0.9, marginBottom: "20px" }}>
      “Progress isn’t loud. It’s consistent.”
    </p>

    {/* Contact Links */}
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "24px",
        flexWrap: "wrap",
        marginBottom: "20px",
        fontSize: "15px",
      }}
    >
      <a
        href="mailto:krithireddy20045@gmail.com"
        style={{ color: "white", textDecoration: "none", fontWeight: 500 }}
      >
        📧 Email
      </a>
      <a
        href="https://www.linkedin.com/in/krithi-thuniki"
        target="_blank"
        rel="noreferrer"
        style={{ color: "white", textDecoration: "none", fontWeight: 500 }}
      >
        🔗 LinkedIn
      </a>
      <a
        href="https://github.com/krithi-thuniki/"
        target="_blank"
        rel="noreferrer"
        style={{ color: "white", textDecoration: "none", fontWeight: 500 }}
      >
        💻 GitHub
      </a>
    </div>

    {/* Copyright */}
    <p style={{ fontSize: "14px", opacity: 0.85 }}>
      © {new Date().getFullYear()} Thuniki Krithi Reddy · Built with consistency 💜
    </p>
  </footer>
);

export default HomePage;

