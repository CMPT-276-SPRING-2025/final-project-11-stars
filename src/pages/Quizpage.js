// QuizPage.js
// This component renders the quiz experience in BrainGoated.
// Features:
// - Displays questions (text/image-based)
// - Handles timer, score, feedback animations
// - Shows Bud-E chatbot for explanations and Q&A
// - Supports quiz reset, navigation, and user interaction feedback

import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";
import confetti from "canvas-confetti"; 
import "./Quizpage.css";

const QuizPage = () => {
  const navigate = useNavigate();

  const {
    score, setScore,
    questions,
    currentQuestion, setCurrentQuestion,
    getExplanation,
    loading, questionType,
    errorMessage, getBudEReply,
    setAnsweredQuestions, resetQuiz
  } = useContext(QuizContext);

  // Resets quiz state on load and refreshes
  const resetQuizState = useCallback(() => {
    setScore(0);
    setCurrentQuestion(0);
    setAnsweredQuestions([]);
  }, [setScore, setCurrentQuestion, setAnsweredQuestions]);

  useEffect(() => {
    resetQuizState();

     // Cleanup on page unload
    const handleUnload = () => {
      if (!isNavigatingToResult.current) {
        resetQuizState();
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      if (!isNavigatingToResult.current) {
        resetQuizState();
      }
    };
  }, [resetQuizState]);

  // Applies saved theme preference
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark-mode", savedMode);
    document.body.classList.toggle("light-mode", !savedMode);
  }, []);

  const [timeLeft, setTimeLeft] = useState(30);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showCorrectPopup, setShowCorrectPopup] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const timerRef = useRef(null);
  const [budEInput, setBudEInput] = useState("");
  const [budEHistory, setBudEHistory] = useState([]);
  const chatEndRef = useRef(null);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [justStarted, setJustStarted] = useState(true);
  const [isBudEExpanded, setIsBudEExpanded] = useState(false);
  const [shakeEffect, setShakeEffect] = useState(false); 
  const [quizReady, setQuizReady] = useState(false); 
  const [hasSeenTooltip, setHasSeenTooltip] = useState(false);
  const [hasManuallyClosedBudE, setHasManuallyClosedBudE] = useState(false);
  const correctAudioRef = useRef(null);
  const incorrectAudioRef = useRef(null);
  const isNavigatingToResult = useRef(false);
  const location = useLocation();
  const [shouldHideQuizContent, setShouldHideQuizContent] = useState(false);

  // Responsive logic for mobile views
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setShouldHideQuizContent(isMobile && isBudEExpanded);
    };

    handleResize(); // Run once initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isBudEExpanded]);

  // Handles browser back/forward nav reset
  useEffect(() => {
    const navType = performance.getEntriesByType("navigation")[0]?.type;
    if (navType === "back_forward") {
      resetQuiz();
      navigate("/");
    }
  }, [location.key, resetQuiz, navigate]);

  // Helper for comparing answers
  const normalize = (str) => {
    if (typeof str === "string") {
      return str.trim().toLowerCase();
    }
    if (str && typeof str === "object" && str.description) {
      return str.description.trim().toLowerCase();
    }
    return "";
  };

  // Called when time runs out
  const handleTimeout = useCallback(() => {
    if (!answered) {
      setIsTimerActive(false);
      clearInterval(timerRef.current);
      setAnswered(true);
      setIsBudEExpanded(true);
      setShakeEffect(true); 
    }
  }, [answered]);

  // Timer logic: countdown and timeout trigger
  useEffect(() => {
    if (!quizReady || !isTimerActive) return;

    setJustStarted(true);
    const startupDelay = setTimeout(() => setJustStarted(false), 1000);

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

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(startupDelay);
    };
  }, [quizReady, currentQuestion, isTimerActive, handleTimeout]);

  // Flag that quiz is ready once loading is complete
  useEffect(() => {
    if (!loading && questions.length > 0) {
      setQuizReady(true);
    }
  }, [loading, questions]);

  // Fetch fun fact/explanation after question is answered
  useEffect(() => {
    if (answered && questions[currentQuestion]?.explanation === null) {
      getExplanation(currentQuestion).then((fact) => setExplanation(fact));
    } else {
      setExplanation(questions[currentQuestion]?.explanation);
    }
  }, [answered, currentQuestion, questions, getExplanation]);

  // Automatically scrolls Bud-E chat to the bottom when a new message is added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [budEHistory]);

  // Temporarily triggers shake animation
  useEffect(() => {
    if (shakeEffect) {
      const timeout = setTimeout(() => setShakeEffect(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [shakeEffect]);

  // Bud-E tooltip reset on first question
  useEffect(() => {
    if (currentQuestion === 0) {
      setHasSeenTooltip(false);
    }
  }, [currentQuestion]);

  // Tooltip reset on answer if Bud-E wasn't manually closed
  useEffect(() => {
    if (answered && !hasManuallyClosedBudE) {
      setHasSeenTooltip(false);
    }
  }, [answered, hasManuallyClosedBudE]);

  if (loading) {
    return (
      <div className="quizpage-background">
        <div className="loading-box">
          <h2 className="loading-title">🌱 Planting some fun questions...</h2>
          <p className="loading-subtext">Please hang tight! 🕐</p>
          <div className="flower-iframe-wrapper">
            <iframe
              src="/flowerloading.html"
              title="Flower-Loading Animation"
              className="loading-flower-frame"
            />
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="quizpage-background error-page">
        <div className="error-container">
          <img src="/warning.png" alt="Warning" className="error-icon" />
          <h2 className="error-message">
            {typeof errorMessage === "string"
              ? errorMessage
              : "Oops! Something went wrong."}
          </h2>
          <p className="error-subtext">Try a simpler or more kid-friendly topic instead! 💡</p>
          <button className="exit-button" onClick={() => navigate("/")}>
            ⬅️ Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleFinishQuiz = () => {
    isNavigatingToResult.current = true;
    navigate("/result");
  };

  if (questions.length === 0) {
    return (
      <div className="quizpage-background no-questions">
        <div className="no-questions-message">
          <h2>No questions available. Please try a different topic.</h2>
          <button className="finish-button" onClick={handleFinishQuiz}>
            Finish Quiz
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const questionText = question?.text || "Question not available";

  const handleOptionClick = (option) => {
    if (!answered) {
      setSelected(option);
      clearInterval(timerRef.current);
      setIsTimerActive(false);

      let isCorrect = false;

      if (questionType === "image") {
        isCorrect = normalize(option.description) === normalize(question.answer || "");
      } else {
        isCorrect = normalize(option) === normalize(question.answer || "");
      }

      if (isCorrect) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        setScore((prev) => prev + 1);
        if (typeof window !== "undefined" && correctAudioRef.current) {
          correctAudioRef.current.play().catch(() => {});
        }
        setShowCorrectPopup(true);
      } else {
        if (typeof window !== "undefined" && incorrectAudioRef.current) {
          incorrectAudioRef.current.play().catch(() => {});
        }
        setShakeEffect(true);
      }

      const answeredData = {
        question: question.text,
        options: question.options,
        correctAnswer: question.answer,
        selectedAnswer: option,
        isCorrect: isCorrect,
        explanation: explanation || null,
      };
      setAnsweredQuestions((prev) => [...prev, answeredData]);

      setIsBudEExpanded(true);
      setAnswered(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelected(null);
      setAnswered(false);
      setShowCorrectPopup(false);
      setExplanation(null);
      setTimeLeft(30);
      setBudEHistory([]);
      setBudEInput("");
      setIsTimerActive(true);
      setJustStarted(true);
      setIsBudEExpanded(false);
      setShakeEffect(false);
      setHasManuallyClosedBudE(false);
    } else {
      isNavigatingToResult.current = true;
      navigate("/result");
    }
  };

  const handleAskBudE = async () => {
    if (!budEInput.trim()) return;

    const tempHistory = [
      ...budEHistory,
      { role: "user", content: budEInput },
      { role: "assistant", content: "🤔 Thinking..." },
    ];
    setBudEHistory(tempHistory);
    setBudEInput("");

    const updatedHistory = await getBudEReply(budEInput, budEHistory);
    setBudEHistory(updatedHistory);
  };

  return (
    <div className="quizpage-background">
      <div className="quiz-main-layout">
      <div className={`quiz-container ${shouldHideQuizContent ? "hide-on-mobile" : ""}`}>
          {/* HEADER */}
          <div className="header">
            <div className={`timer-box ${timeLeft <= 5 ? "timer-box-critical" : ""}`}>
              <div
                className="timer-fill"
                style={{
                  width: `${(timeLeft / 30) * 100}%`,
                  backgroundColor: timeLeft <= 5 ? "#D9534F" : "#9A7E6F",
                }}
              ></div>
              <span
                className={`timer-text ${timeLeft <= 5 ? "timer-critical" : ""} ${
                  timeLeft <= 14 && timeLeft > 5 ? "timer-on-white" : ""
                }`}
              >
                {timeLeft === 0
                  ? "⏳ Time's up!"
                  : justStarted && !answered
                  ? `Timer: ${timeLeft}s`
                  : timeLeft}
              </span>
            </div>
            <div className="score-box">Score: {score}</div>
          </div>

          <div className={`shake-wrapper ${shakeEffect ? "shake" : ""}`}>
            <div className="question-box spacious-box">
              <p className="question-text">
                Q{currentQuestion + 1}: {questionText}
              </p>
              <div className="options-container">
                {questionType === "image" ? (
                  <div className="image-options">
                    {question.options.map((option, index) => {
                      const isCorrect =
                        normalize(option.description) === normalize(question.answer || "");
                      const isSelected = selected === option;

                      return (
                        <div
                          key={index}
                          className={`image-option ${
                            answered
                              ? isCorrect
                                ? "correct-highlight"
                                : isSelected
                                ? "wrong-highlight"
                                : ""
                              : ""
                          }`}
                          onClick={answered ? undefined : () => handleOptionClick(option)}
                        >
                          <img src={option.url} alt={option.description} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-options">
                    {question.options.map((option, index) => {
                      const isCorrect = normalize(option) === normalize(question.answer || "");
                      const isSelected = selected === option;

                      let optionClass = "option";
                      if (answered) {
                        if (isCorrect) optionClass += " correct-highlight";
                        if (isSelected && !isCorrect) optionClass += " wrong-highlight";
                      }

                      return (
                        <button
                          key={index}
                          className={optionClass}
                          onClick={() => handleOptionClick(option)}
                          disabled={answered}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="quiz-buttons">
            <button className="finish-button" onClick={handleFinishQuiz}>
              Finish Quiz
            </button>
            {answered && (
              <button className="next-button" onClick={handleNextQuestion}>
                Next
              </button>
            )}
          </div>
        </div>

        {/* Bud-E Popup (visible only when expanded) */}
        {answered && isBudEExpanded && (
          <div className="bud-e-popup-floating bud-e-bottom-right">
            <img
              src="/crossbtn.png"
              alt="Close Bud-E"
              className="bud-e-close-btn"
              onClick={() => {
                setIsBudEExpanded(false);
                setHasManuallyClosedBudE(true);
              }}
            />
            <div className="popup-box popup-bottom">
              {showCorrectPopup ? (
                <>
                  <h2 style={{ color: "#1B5E20", fontWeight: "bold" }}>Correct!</h2>
                  <div className="explanation-box">
                    <p>{explanation || "Fetching fun fact..."}</p>
                  </div>
                </>
              ) : (
                <>
                  <h2 style={{ color: "#8B0000", fontWeight: "bold" }}>Incorrect!</h2>
                  {questionType === "text" && (
                    <p className="correct-answer" style={{ color: "#1B5E20" }}>
                    Correct Answer: {question.answer}
                  </p>
                  )}
                  <div className="explanation-box">
                    <p>{explanation || "Fetching fun fact..."}</p>
                  </div>
                </>
              )}

              <div className="chatbot-container">
                {budEHistory.length === 0 ? (
                  <img src="/bud-e.png" alt="Bud-E" className="ai-icon" />
                ) : (
                  <div className="budE-chat-history">
                    {budEHistory.map((msg, index) => (
                      <div key={index} className={`budE-message ${msg.role}`}>
                        {msg.role === "user" ? (
                          <p>{msg.content}</p>
                        ) : (
                          <div className="assistant-bubble">
                            <img src="/bud-e.png" alt="Bud-E avatar" className="budE-avatar" />
                            <div>
                              <p>{msg.content}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                )}
                <textarea
                  value={budEInput}
                  onChange={(e) => setBudEInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAskBudE();
                    }
                  }}
                  placeholder="Ask Bud-E to learn more!"
                  rows={3}
                  className="ask-input"
                />
                <div className="budE-actions">
                  <button onClick={handleAskBudE} className="budE-button">
                    Ask Bud-E
                  </button>
                  <button
                    onClick={() => {
                      setIsBudEExpanded(false);
                      handleNextQuestion();
                    }}
                    className="budE-button"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bud-E icon */}
      {answered && (
        <div className="bud-e-icon-wrapper">
          {!hasSeenTooltip && <div className="bud-e-tooltip">👋 Tap to show or hide me!</div>}
          <img
            src="/bud-e.png"
            alt="Bud-E toggle"
            className="bud-e-floating-icon"
            onClick={() => {
              if (!isBudEExpanded) {
                setIsBudEExpanded(true);
              } else {
                setIsBudEExpanded(false);
                setHasManuallyClosedBudE(true);
              }
              setHasSeenTooltip(true);
            }}
          />
        </div>
      )}

      <audio ref={correctAudioRef} src="/correct.mp3" preload="auto" />
      <audio ref={incorrectAudioRef} src="/incorrect.mp3" preload="auto" />
    </div>
  );
};

export default QuizPage;
