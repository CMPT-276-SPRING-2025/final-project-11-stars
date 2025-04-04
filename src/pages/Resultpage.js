import React, { useContext, useState, useEffect } from "react";
import { QuizContext } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";
import "./Resultpage.css";

const ResultPage = () => {
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark-mode", savedMode);
    document.body.classList.toggle("light-mode", !savedMode);
  }, []);
  const navigate = useNavigate();
  const { score, resetQuiz, answeredQuestions, questions } = useContext(QuizContext);
  const [filter, setFilter] = useState("all");

  const getFilteredQuestions = () => {
    if (filter === "correct") return answeredQuestions.filter((q) => q.isCorrect);
    if (filter === "incorrect") return answeredQuestions.filter((q) => !q.isCorrect);
    return answeredQuestions;
  };

  const filtered = getFilteredQuestions();

  const renderVisualAnswer = (answer) => {
    // If answer is an object with a valid `url`
    if (answer && typeof answer === "object" && answer.url) {
      return (
        <img
          src={answer.url}
          alt={answer.description || "answer image"}
          className="result-thumbnail"
        />
      );
    }

    // If answer is a stringified object with a `url` field
    if (typeof answer === "string") {
      try {
        const parsed = JSON.parse(answer);
        if (parsed.url) {
          return (
            <img
              src={parsed.url}
              alt={parsed.description || "answer image"}
              className="result-thumbnail"
            />
          );
        }
      } catch (e) {
        // not JSON, fall through
      }
    }

    // Fallback for plain text answers
    return <span>{typeof answer === "string" ? answer : JSON.stringify(answer)}</span>;
  };

  return (
    (questions && answeredQuestions) ? (
      <div className="result-container">
        <h1 className="score-message">Score: {score}/{questions.length}</h1>
  
        <p className="result-info">
          {(() => {
            const percentage = (score / questions.length) * 100;
  
            if (percentage <= 50) {
              return "Great effort! Every mistake is a step towards learning! 😊";
            } else if (percentage < 80) {
              return "You are improving! Keep up the good work! 💪";
            } else {
              return "Congratulations! You are officially BrainGoated! 😎";
            }
          })()}
        </p>
        {answeredQuestions.length > 0 ? (
          <>
            <div className="filter-buttons">
              <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>
                All
              </button>
              <button onClick={() => setFilter("correct")} className={filter === "correct" ? "active" : ""}>
                Correct
              </button>
              <button onClick={() => setFilter("incorrect")} className={filter === "incorrect" ? "active" : ""}>
                Incorrect
              </button>
            </div>
  
            <h2 className="section-title">Questions Answered</h2>
  
            <div className="review-section">
              {filtered.map((q, index) => (
                <div key={index} className={`review-card ${q.isCorrect ? "correct" : "incorrect"}`}>
                  <p><strong>Q{index + 1}:</strong> {q.question}</p>
                  <div className="answer-pair">
                    <div>
                      <strong>Your Answer:</strong><br />
                      {renderVisualAnswer(q.selectedAnswer)}
                    </div>
  
                    {!q.isCorrect && (
                      <div>
                        <strong>Correct Answer:</strong><br />
                        {renderVisualAnswer(q.correctAnswer)}
                      </div>
                    )}
                  </div>
  
                  {q.explanation && (
                    <p className="explanation"><em>{q.explanation}</em></p>
                  )}
                </div>
              ))}
            </div>
  
            <div className="result-buttons spaced-bottom">
              <button
                className="go-back-button"
                onClick={() => {
                  resetQuiz();
                  navigate("/");
                }}
              >
                Go back to Quiz Categories
              </button>
            </div>
          </>
        ) : (
          <div className="no-answers-placeholder">
            <img src="/bud-e.png" alt="Bud-E" className="no-answers-icon" />
            <p className="no-answers-text">
              You didn't answer any questions this time, but that's okay! 🌱<br />
              Try another quiz to grow your knowledge! 🚀
            </p>
            <button
              className="go-back-button"
              onClick={() => {
                resetQuiz();
                navigate("/");
              }}
            >
              Back to Categories
            </button>
          </div>
        )}
      </div>
    ) : (
      <div className="result-container">
        <h1 className="score-message">Score: 0/0</h1>
        <p className="result-info">Results unavailable — please complete a quiz first.</p>
      </div>
    )
  );  
}  

export default ResultPage;
