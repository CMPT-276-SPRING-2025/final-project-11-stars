import React, { useState } from 'react';
import './HelpButton.css';

const HelpButton = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="help-button-wrapper">
      <button
        className="help-btn"
        onClick={() => setShowHelp(!showHelp)}
        title="How to use this app"
      >
        <img
          src="/question.png"
          alt="Help"
          className="help-icon"
          onError={(e) => {
            e.target.style.display = 'none'; // Hide if broken
          }}
        />
      </button>


      {showHelp && (
        <div className="help-popup">
          <h3>How to Use BrainGoated</h3>
          <ul>
            <li>Choose a quiz category or tap <strong>Build a Quiz</strong> to create your own quiz.</li>
            <li>Each quiz has 10 questions. Select the best answer.</li>
            <li>Use the Bud-E bot for tips after each question!</li>
            <li>Try quizzes in different languages and formats.</li>
            <li>See your results and learn from your mistakes and become <strong>BrainGoated</strong>!</li>
          </ul>
          <button className="close-help" onClick={() => setShowHelp(false)}>Got it!</button>
        </div>
      )}
    </div>
  );
};

export default HelpButton;
