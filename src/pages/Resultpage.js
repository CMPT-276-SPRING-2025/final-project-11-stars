// ResultPage.js
// This component displays the final quiz results in BrainGoated.
// Features:
// - Shows score summary and performance message
// - Lets users filter reviewed questions (all/correct/incorrect)
// - Displays explanations and visual answers
// - Handles redirect and state reset

import React, { useContext, useState, useEffect, useRef } from "react";
import { QuizContext } from "../context/QuizContext";
import { useNavigate} from "react-router-dom";
import "./Resultpage.css";

const ResultPage = () => {
  const finalChimeRef = useRef(null);
  const navigate = useNavigate();
  const { score, resetQuiz, answeredQuestions, questions } = useContext(QuizContext);
  const [filter, setFilter] = useState("all"); // Filter: all, correct, incorrect
  const [showAnswers, setShowAnswers] = useState(true); // Toggle visibility of answer review
  
  // Apply saved theme on load
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark-mode", savedMode);
    document.body.classList.toggle("light-mode", !savedMode);
  }, []);

  // Auto-play final chime sound after quiz ends
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      finalChimeRef.current &&
      typeof finalChimeRef.current.play === "function"
    ) {
      try {
        finalChimeRef.current.play().catch(() => {
          // Autoplay might be blocked by browser
        });
      } catch (e) {
        // In jsdom, .play() throws immediately (not a promise), so we handle that too
      }
    }
  }, []);

  // Prevents user from navigating back into quiz state via browser back button
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

  // Returns filtered list of answered questions
  const getFilteredQuestions = () => {
    if (filter === "correct") return answeredQuestions.filter((q) => q.isCorrect);
    if (filter === "incorrect") return answeredQuestions.filter((q) => !q.isCorrect);
    return answeredQuestions;
  };

  const filtered = getFilteredQuestions();

  // Helper to display text or image answers
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

    // Support stringified image answer format
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
          
          {/* Only show filters and answers if user answered questions */}
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
              
              {/* Display reviewed answers */}
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

              {/* Navigation button back to category selection */}
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

          {/* Fallback if no questions were answered */}
          {answeredQuestions.length === 0 && (
            <div className="no-answers-placeholder">
              <img src="/bud-e.png" 
                alt="Bud-E, a cute robot character with a sprout on its head, smiling and standing with sparkles around it"
                className="no-answers-icon" />
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

        {/* Audio for final success chime */}
        <audio ref={finalChimeRef} src="/final-chime.mp3" preload="auto" />
    </>
  );
}
export default ResultPage;  