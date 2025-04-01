import React, {useContext} from 'react';
import { QuizContext } from "../context/QuizContext";
import { useNavigate } from 'react-router-dom';
import './Resultpage.css'; 
import FloatingRobot from '../FloatingRobot';


const ResultPage = () => {
  const navigate = useNavigate();

  const {score, resetQuiz} = useContext(QuizContext);

  return (
    <div className="result-container">
      <div className="result-header">
      </div>
      
      <div className="result-content">
        <div className="score-message">Score: {score}/10</div>
        <div className="result-info">
          <p>Congratulations! You are officially BrainGoated!</p>
        </div>
        
        <div className="ai-assistant">
        <FloatingRobot />
        </div>
        
        <div className="result-buttons">
          <button className="go-back-button" onClick={() => 
            {
              resetQuiz(); // reset global state variables when going back to home page
              navigate('/')
            }}>
            Go back to Quiz Categories
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
