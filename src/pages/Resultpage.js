import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Resultpage.css'; // Ensure to create and style this file accordingly

const ResultPage = () => {
  const navigate = useNavigate();

  return (
    <div className="result-container">
      <div className="result-header">
        <div className="timer-box">Timer:</div>
        <div className="score-box">Score:</div>
      </div>
      
      <div className="result-content">
        <div className="score-message">Score:</div>
        <div className="result-info">
          <p>Congratulations! You are officially BrainGoated!</p>
        </div>
        
        <div className="ai-assistant">
          <img src="/bud-e.png" alt="Bud-E" className="ai-icon" />
        </div>
        
        <div className="result-buttons">
          <button className="go-back-button" onClick={() => navigate('/quiz-categories')}>
            Go back to Quiz Categories
          </button>
        </div>
      </div>
      
      <button className="exit-button" onClick={() => navigate('/')}> 
            Exit
          </button>
    </div>
  );
};

export default ResultPage;
