import React, { useEffect, useRef, useState } from 'react';
import QuizCategory from './Quizcategories';
import './Homepage.css';
import RobotViewer from "../RobotViewer.jsx";

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const headingRef = useRef();
  const taglineRef = useRef();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Scroll after 3.5s on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById('quiz-category-space')?.scrollIntoView({ behavior: 'smooth' });
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Observe heading and tagline for breathing animation
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        headingRef.current?.classList.add("heading-breathe");
        taglineRef.current?.classList.add("tagline-breathe");
      } else {
        headingRef.current?.classList.remove("heading-breathe");
        taglineRef.current?.classList.remove("tagline-breathe");
      }
    }, { threshold: 0.5 });

    if (headingRef.current) {
      observer.observe(headingRef.current);
      headingRef.current.classList.add("heading-once");
      setTimeout(() => headingRef.current?.classList.remove("heading-once"), 3000);
    }

    if (taglineRef.current) {
      observer.observe(taglineRef.current);
      taglineRef.current.classList.add("tagline-once");
      setTimeout(() => taglineRef.current?.classList.remove("tagline-once"), 3000);
    }

    return () => observer.disconnect();
  }, []);

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

      <div className="welcome-section">
        <h1 ref={headingRef} className="main-heading">BrainGoated</h1>

        <div className="robot-3d-wrapper">
          <RobotViewer />
        </div>

        <p ref={taglineRef} className="tagline">
          Water your curiosity, Watch it grow!
        </p>
      </div>

      <div id="quiz-category-space" className="quiz-category-space"></div>
      <QuizCategory />
    </div>
  );
};

export default HomePage;
