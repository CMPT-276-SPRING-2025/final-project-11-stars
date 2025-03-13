import React, { useState } from "react";
import "./Quizpage.css";
import { useNavigate } from "react-router-dom";

const QuizPage = () => {
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showIncorrectPopup, setShowIncorrectPopup] = useState(false);
  const [showCorrectPopup, setShowCorrectPopup] = useState(false);
  
  const question = {
    text: "Which city is the capital city of Turkey?",
    options: ["A) Istanbul", "B) Izmir", "C) Ankara", "D) Antalya"],
    answer: "C) Ankara",
    explanation: "The Name Changed Over Time! Ankara wasn’t always called Ankara! In ancient times, it was known as Ancyra, which means 'anchor' in Greek."
  };

  const handleOptionClick = (option) => {
    if (!answered) {
      setSelected(option);
      if (option === question.answer) {
        setScore(score + 1);
        setShowCorrectPopup(true);
      } else {
        setShowIncorrectPopup(true);
      }
      setAnswered(true);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="quiz-container">
      <div className="header">
        <div className="timer-box">Timer:</div>
        <div className="score-box">Score: {score}</div>
      </div>
      <div className="question-box">
        <p className="question-text">Q1: {question.text}</p>
        <div className="options-container">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option ${selected === option ? (option === question.answer ? "correct" : "wrong") : ""}`}
              onClick={() => handleOptionClick(option)}
              disabled={answered}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <button className="exit-button" onClick={() => navigate("/")}>Exit</button>
      {showIncorrectPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2 className="incorrect">Incorrect!</h2>
            <p className="correct-answer">Correct Answer: {question.answer}</p>
            <div className="explanation-box">
              <p>{question.explanation}</p>
            </div>
            <div className="chatbot-container">
              <p>Learn more with Bud-E!</p>
              <input type="text" placeholder="Ask anything" />
            </div>
            <button className="complete-button">Complete Quiz</button>
          </div>
        </div>
      )}
      {showCorrectPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2 className="correct">Correct!</h2>
            <div className="explanation-box">
              <p>{question.explanation}</p>
            </div>
            <div className="chatbot-container">
              <p>Learn more with Bud-E!</p>
              <input type="text" placeholder="Ask anything" />
            </div>
            <button className="complete-button">Complete Quiz</button>

          </div>
        </div>
      )}
    </div>
  );
};
export default QuizPage;
