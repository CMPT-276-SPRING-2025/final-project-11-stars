import React, { useContext, useState, useEffect, useRef } from "react";
import { QuizContext } from "../context/QuizContext";
import { useNavigate} from "react-router-dom";
import "./Resultpage.css";

const ResultPage = () => {
  const finalChimeRef = useRef(null);
  
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark-mode", savedMode);
    document.body.classList.toggle("light-mode", !savedMode);
  }, []);

  useEffect(() => {
  if (typeof window !== "undefined" && finalChimeRef.current) {
    finalChimeRef.current.play().catch(() => {
      // Fail silently in case autoplay is blocked or unsupported
    });
  }
  }, []);

  const navigate = useNavigate();
  const { score, resetQuiz, answeredQuestions, questions } = useContext(QuizContext);
  const [filter, setFilter] = useState("all");
  const [showAnswers, setShowAnswers] = useState(true); // 👈 added toggle state

  useEffect(() => {
  const blockPopState = () => {
    resetQuiz();
    window.location.replace("/"); // hard redirect
  };

  window.history.pushState(null, "", window.location.href);
  window.addEventListener("popstate", blockPopState);

  return () => {
    window.removeEventListener("popstate", blockPopState);
  };
}, [resetQuiz]);


  const getFilteredQuestions = () => {
    if (filter === "correct") return answeredQuestions.filter((q) => q.isCorrect);
    if (filter === "incorrect") return answeredQuestions.filter((q) => !q.isCorrect);
    return answeredQuestions;
  };

  const filtered = getFilteredQuestions();

  const renderVisualAnswer = (answer) => {
    if (answer && typeof answer === "object" && answer.url) {
      return (
        <img
          src={answer.url}
          alt={answer.description || "answer image"}
          className="result-thumbnail"
        />
      );
    }

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

    return <span>{typeof answer === "string" ? answer : JSON.stringify(answer)}</span>;
  };

  return (
    <>
      {(questions && answeredQuestions) ? (
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
  
          {answeredQuestions.length > 0 && (
            <>
              <div className="filter-buttons">
                <button
                  onClick={() => {
                    if (filter === "all" && showAnswers) {
                      setShowAnswers(false);
                    } else {
                      setFilter("all");
                      setShowAnswers(true);
                    }
                  }}
                  className={filter === "all" && showAnswers ? "active" : ""}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setFilter("correct");
                    setShowAnswers(true);
                  }}
                  className={filter === "correct" ? "active" : ""}
                >
                  Correct
                </button>
                <button
                  onClick={() => {
                    setFilter("incorrect");
                    setShowAnswers(true);
                  }}
                  className={filter === "incorrect" ? "active" : ""}
                >
                  Incorrect
                </button>
              </div>
  
              {showAnswers && (
                <>
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
                </>
              )}
  
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
          )}
  
          {answeredQuestions.length === 0 && (
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
      )}
  
        <audio ref={finalChimeRef} src="/final-chime.mp3" preload="auto" />
    </>
  );
}
export default ResultPage;  