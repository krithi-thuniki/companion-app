import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";

// 🔥 30 Daily Tips
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

// 🔥 30 Daily Challenges
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

// 🔥 30 Fun Facts
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

  const todayIndex = (new Date().getDate() - 1) % 30;

  useEffect(() => {
    const lastLogin = localStorage.getItem("lastLogin");
    const savedStreak = parseInt(localStorage.getItem("streak") || "0", 10);
    const today = new Date();
    const todayStr = today.toDateString();

    if (lastLogin) {
      const lastLoginDate = new Date(lastLogin);
      const diffTime = today - lastLoginDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        setStreak(savedStreak + 1);
        localStorage.setItem("streak", savedStreak + 1);
        setAnimateFire(true);
        setTimeout(() => setAnimateFire(false), 1500);
      } else if (diffDays > 1) {
        setStreak(0);
        localStorage.setItem("streak", 0);
      } else {
        setStreak(savedStreak);
      }
    } else {
      setStreak(1);
      localStorage.setItem("streak", 1);
      setAnimateFire(true);
      setTimeout(() => setAnimateFire(false), 1500);
    }

    localStorage.setItem("lastLogin", todayStr);
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px", marginTop: "80px" }}>
  <h1>Welcome to Student Portal 🎓</h1>
  <p>Select a category from the navigation above to get started.</p>


        {/* 🔥 Cards Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginTop: "30px",
            justifyItems: "center",
          }}
        >
          <Card title="💡 Tip of the Day" text={tips[todayIndex]} />
          <Card
            title="🔥 Consistency Score"
            text={`You are on a ${streak}-day streak!`}
            animate={animateFire}
          />
          <Card title="🎯 Mini Daily Challenge" text={challenges[todayIndex]} />
          <Card title="🤓 Brain Teaser" text={funFacts[todayIndex]} />
        </div>
      </div>

      {/* ✅ Footer Section */}
      <Footer />
    </div>
  );
};

// ✅ Card Component
const Card = ({ title, text, animate }) => {
  const baseStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 12px #9b5de5",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    aspectRatio: "1 / 1",
    minWidth: "200px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    position: "relative",
  };

  const hoverStyle = {
    transform: "translateY(-8px) scale(1.03)",
    boxShadow: "0 12px 20px #9b5de5",
  };

  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        ...baseStyle,
        ...(hover ? hoverStyle : {}),
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <h2 style={{ color: "#9b5de5" }}>{title}</h2>
      <p>{text}</p>

      {/* 🔥 Fire animation */}
      {animate && (
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "2rem",
            animation: "firePulse 1s infinite",
          }}
        >
          🔥
        </span>
      )}

      <style>
        {`
          @keyframes firePulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.4); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

// ✅ Footer Component - Founder Info in a Single Line
// ✅ Footer Component - Gradient Background + Founder Info
// ✅ Footer Component - Funny & Universal
const Footer = () => {
  return (
    <footer
      style={{
        marginTop: "60px",
        padding: "30px 20px",
        background: "linear-gradient(to bottom right, #9b5de5, #5f2eea)",
        color: "white",
        textAlign: "center",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
      }}
    >
      {/* Portal Tagline */}
      <div style={{ marginBottom: "25px", lineHeight: "1.6" }}>
        <h2 style={{ margin: 0, fontSize: "1.4rem" }}>
          For Humans Who Want to Level Up 🚀
        </h2>
        <p style={{ margin: "10px 0 0 0", fontSize: "1rem", opacity: 0.9 }}>
          Little wins, big laughs, and curious facts for every human | © {new Date().getFullYear()}
        </p>
      </div>

      {/* Founder Info - Responsive */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "40px",
          fontSize: "0.95rem",
          marginTop: "10px",
        }}
      >
        <span>👩‍💻 Thuniki Krithi Reddy</span>
        <span>
          📧{" "}
          <a
            href="mailto:krithireddy20045@gmail.com"
            style={{
              color: "white",
              textDecoration: "underline",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#FFD700")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            krithireddy20045@gmail.com
          </a>
        </span>
        <span>
          🔗{" "}
          <a
            href="https://www.linkedin.com/in/krithi-thuniki"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "white",
              textDecoration: "underline",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#FFD700")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            linkedin.com/in/krithi-thuniki
          </a>
        </span>
      </div>

      {/* Responsive Styling */}
      <style>
        {`
          @media (max-width: 600px) {
            footer div span {
              flex-basis: 100%;
              text-align: center;
            }
          }
        `}
      </style>
    </footer>
  );
};




export default HomePage;
