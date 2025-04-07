// HomePage.js
// This is the main landing page for the BrainGoated app.
// It includes theme toggling (dark/light mode), a welcome animation,
// a help button, a scroll hint arrow, and category selection for quizzes.

import React, { useEffect, useState } from 'react';
import QuizCategory from './Quizcategories';
import './Homepage.css';
import HelpButton from './HelpButton';

const HomePage = () => {
  // Dark mode state, loaded from localStorage on initial render
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Controls visibility of the scroll-down arrow after delay
  const [showArrow, setShowArrow] = useState(false);

  // Effect responsible for visually switching between dark and light themes, and remembering the user’s choice using the browser’s local storage
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Effect to show arrow after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowArrow(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

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

      {showArrow && (
        <img
          src="/arrow-down.png"
          alt="Scroll to Quiz Categories"
          className="bouncing-arrow"
          onClick={() => {
            document.getElementById('quiz-category-space')?.scrollIntoView({ behavior: 'smooth' });
            setShowArrow(false);
          }}
        />
      )}

      <div id="quiz-category-space" className="quiz-category-space"></div>
      <QuizCategory />
    </div>
  );
};

export default HomePage;
