// Correct import path to Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const HomePage = ({ startQuiz }) => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    startQuiz();
    navigate('/quiz'); // Navigate to the quiz page when the quiz starts
  };

  return (
    <div className="landing-page">
      <h1 className="main-heading">BrainGoated</h1>
      <img src="/bud-e.png" alt="BrainGoated Logo" className="logo" />
      <p className="tagline">Water your curiosity, Watch it grow!</p>
    </div>
  );
};

export default HomePage;

