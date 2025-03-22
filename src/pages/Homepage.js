import React from 'react';
import QuizCategory from './Quizcategories';
import './Homepage.css';

const HomePage = () => {
  return (
    <div className="landing-page">
      <h1 className="main-heading">BrainGoated</h1>
      <img src="/bud-e.png" alt="BrainGoated Logo" className="logo" />
      <p className="tagline">Water your curiosity, Watch it grow!</p>
      <div className="quiz-category-space"></div>

      <QuizCategory />
    </div>
  );
};

export default HomePage;
