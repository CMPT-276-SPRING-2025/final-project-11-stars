import React, { useEffect, useState } from 'react';
import QuizCategory from './Quizcategories';
import './Homepage.css';

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);
  return (
    <div className="landing-page">
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
      <h1 className="main-heading">BrainGoated</h1>
      {/* <img src="/bud-e.png" alt="BrainGoated Logo" className="logo" /> */}
      <div className="iframe-wrapper">
        <iframe
          src="/BudE_animation.html"
          title="Bud-E Animation"
          className="bud-e-frame"
        />
      </div>
      <p className="tagline">Water your curiosity, Watch it grow!</p>
      <div className="quiz-category-space"></div>

      <QuizCategory />
    </div>


  );
};

export default HomePage;
