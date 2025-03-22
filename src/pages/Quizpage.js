import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext"; // Import global state
import "./Quizpage.css";

const QuizPage = () => {
  const navigate = useNavigate();

  // Global states: need to persist across multiple questions
  const {
    score, setScore, 
    questions, 
    currentQuestion, setCurrentQuestion, 
    resetQuiz, getExplanation
  } = useContext(QuizContext);

  // Local state (specific to this component)
  const [timeLeft, setTimeLeft] = useState(30);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showIncorrectPopup, setShowIncorrectPopup] = useState(false);
  const [showCorrectPopup, setShowCorrectPopup] = useState(false);
  const [explanation, setExplanation] = useState(null); // Stores explanation
  const timerRef = useRef(null);
  
  const handleTimeout = useCallback(() => {
    if (!answered) {
      setAnswered(true);
      setShowIncorrectPopup(true);
      clearInterval(timerRef.current);
    }
  }, [answered]);

  useEffect(() => {
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentQuestion, handleTimeout]);

  // Handle fetching fun fact when user selects an answer
  useEffect(() => {
    if (answered && questions[currentQuestion]?.explanation === null) {
      getExplanation(currentQuestion).then((fact) => setExplanation(fact)); // Fetch fun fact
    } else {
      setExplanation(questions[currentQuestion]?.explanation); // Set existing explanation
    }
  }, [answered, currentQuestion, questions, getExplanation]);

  // If questions haven't loaded yet, show a loading message
  if (questions.length === 0) {
    return <h2>Loading Questions...</h2>;
  }

  const question = questions[currentQuestion];

  // Ensure question text is correctly accessed
  const questionText = question?.text || "Question not available";

  const handleOptionClick = (option) => {
    if (!answered) {
      setSelected(option);
      clearInterval(timerRef.current);

      if (option === question.answer) {
        setScore(score + 1);
        setShowCorrectPopup(true);
      } else {
        setShowIncorrectPopup(true);
      }
      setAnswered(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1); // Move to next question
      setSelected(null);
      setAnswered(false);
      setShowCorrectPopup(false);
      setShowIncorrectPopup(false);
      setExplanation(null); // Reset fun fact state
      setTimeLeft(30);
    } else {
      navigate("/result");
    }
  };

  return (
    <div className="quiz-container">
      <div className="header">
        <div className="timer-box">Timer: {timeLeft}s</div>
        <div className="score-box">Score: {score}</div>
      </div>
      <div className="question-box">
        <p className="question-text">Q{currentQuestion + 1}: {questionText}</p> {/* Ensure question text is displayed */}
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
      <button className="exit-button" onClick={() => {
        resetQuiz(); // Reset global state variables
        navigate("/");
      }}>Exit</button>

      {/* Incorrect Answer Popup */}
      {showIncorrectPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2 className="incorrect">Incorrect!</h2>
            <p className="correct-answer">Correct Answer: {question.answer}</p>
            <div className="explanation-box">
              <p>{explanation || "Fetching fun fact..."}</p> {/* Displays fun fact */}
            </div>
            <div className="chatbot-container">
              <p>Learn more with Bud-E!</p>
              <img src="/bud-e.png" alt="Bud-E" className="ai-icon" />
              <input type="text" placeholder="Ask anything" />
            </div>
            <div className="feedback-popup-buttons">
              <button className="complete-button" onClick={() => navigate("/result")}>Complete Quiz</button>
              <button className="next-button" onClick={handleNextQuestion}>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Correct Answer Popup */}
      {showCorrectPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2 className="correct">Correct!</h2>
            <div className="explanation-box">
              <p>{explanation || "Fetching fun fact..."}</p>
            </div>
            <div className="chatbot-container">
              <p>Learn more with Bud-E!</p>
              <img src="/bud-e.png" alt="Bud-E" className="ai-icon" />
              <input type="text" placeholder="Ask anything" />
            </div>
            <div className="feedback-popup-buttons">
              <button className="complete-button" onClick={() => navigate("/result")}>Complete Quiz</button>
              <button className="next-button" onClick={handleNextQuestion}>Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;