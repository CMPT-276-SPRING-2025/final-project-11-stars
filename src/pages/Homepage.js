import React, { useEffect, useState } from 'react';
import QuizCategory from './Quizcategories';
import './Homepage.css';
import HelpButton from './HelpButton';

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById('quiz-category-space')?.scrollIntoView({ behavior: 'smooth' });
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className="landing-page">
      {/* Top-right stack (toggle + help button) */}
      <div className="top-right-stack">
        <div className="theme-toggle">
          <span className="theme-label">{darkMode ? "Dark" : "Light"}</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <HelpButton />
      </div>

      {/* Main content */}
      <div className="welcome-section">
        <h1 className="main-heading">BrainGoated</h1>
        <div className="iframe-wrapper">
          <iframe
            src="/BudE_animation.html"
            title="Bud-E Animation"
            className="bud-e-frame"
          />
        </div>
        <p className="tagline">Water your curiosity, Watch it grow!</p>
      </div>

      <div id="quiz-category-space" className="quiz-category-space"></div>
      <QuizCategory />
    </div>
  );
};

export default HomePage;
