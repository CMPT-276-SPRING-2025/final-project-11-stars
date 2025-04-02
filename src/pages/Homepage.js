import React from 'react';
import {useEffect,useState } from "react"
import QuizCategory from './Quizcategories';
import './Homepage.css';

const HomePage = () => {
    const [animateShrink, setAnimateShrink] = useState(false);
    useEffect(() => {
      // Automatically scroll down after 3 seconds (3000 ms)
      const timer = setTimeout(() => {
        setAnimateShrink(true);
        document.getElementById('quiz-category-space')?.scrollIntoView({ behavior: 'smooth' });
      }, 3000);
  
      // Cleanup: clear timer if component unmounts before it fires
      return () => clearTimeout(timer);
    }, []);
  return (
    <div className="landing-page">
      <div className={`welcome-section ${animateShrink ? 'shrink' : ''}`}>
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
