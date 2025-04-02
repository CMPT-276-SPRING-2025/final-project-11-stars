import React from 'react';
import {useEffect} from "react"
import QuizCategory from './Quizcategories';
import './Homepage.css';

const HomePage = () => {
    useEffect(() => {
      // Automatically scroll down after 3 seconds (3000 ms)
      const timer = setTimeout(() => {
        document.getElementById('quiz-category-space')?.scrollIntoView({ behavior: 'smooth' });
      }, 3500);
  
      // Cleanup: clear timer if component unmounts before it fires
      return () => clearTimeout(timer);
    }, []);
  return (
    <div className="landing-page">
      <div className="welcome-section" >
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
      </div>
      <div id="quiz-category-space" className="quiz-category-space">
        <QuizCategory />
      </div>
    </div>


  );
};

export default HomePage;
