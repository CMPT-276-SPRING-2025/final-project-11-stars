import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizCategory from './Quizcategories'; // Import QuizCategory component
import './Homepage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1 className="main-heading">BrainGoated</h1>
      <img src="/bud-e.png" alt="BrainGoated Logo" className="logo" />
      <p className="tagline">Water your curiosity, Watch it grow!</p>


      {/* Add a space to create scrolling effect */}
      <div className="quiz-category-space"></div>

      {/* QuizCategory comes next */}
      <QuizCategory />
    </div>
  );
};

export default HomePage;
