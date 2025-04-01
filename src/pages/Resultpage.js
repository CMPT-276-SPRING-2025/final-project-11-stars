import React, {useContext} from 'react';
import { QuizContext } from "../context/QuizContext";
import { useNavigate } from 'react-router-dom';
import './Resultpage.css'; // Ensure to create and style this file accordingly

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
        {(score<=4&&(<p>Great effort! Every mistake is a step towards learning!</p>))||(score>4&&score<8&&(<p>You are improving! Keep up the good work!</p>))||(score>=8&&(<p>Congratulations! You are officially BrainGoated!</p>))}
        </div>
        
        <div className="ai-assistant">
          <img src="/bud-e.png" alt="Bud-E" className="ai-icon" />
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
