import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";
import "./Quizpage.css";

const QuizPage = () => {
  const navigate = useNavigate();

  const {
    score, setScore,
    questions,
    currentQuestion, setCurrentQuestion,
    resetQuiz, getExplanation,
    loading, questionType,
    errorMessage, getBudEReply,
  } = useContext(QuizContext);

  const [timeLeft, setTimeLeft] = useState(30);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showIncorrectPopup, setShowIncorrectPopup] = useState(false);
  const [showCorrectPopup, setShowCorrectPopup] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const timerRef = useRef(null);
  const [budEInput, setBudEInput] = useState("");
  const [budEHistory, setBudEHistory] = useState([]);
  const chatEndRef = useRef(null);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [justStarted, setJustStarted] = useState(true);
  const [isBudEExpanded, setIsBudEExpanded] = useState(true);

  const normalize = (str) => str?.trim().toLowerCase();

  const handleTimeout = useCallback(() => {
    if (!answered) {
      setIsTimerActive(false);
      clearInterval(timerRef.current);
      setAnswered(true);
      setShowIncorrectPopup(true);
    }
  }, [answered]);

  useEffect(() => {
    setJustStarted(true);
    const timer = setTimeout(() => setJustStarted(false), 1000);

    if (!isTimerActive) return;

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
      clearTimeout(timer);
    };
  }, [currentQuestion, isTimerActive, handleTimeout]);

  useEffect(() => {
    if (answered && questions[currentQuestion]?.explanation === null) {
      getExplanation(currentQuestion).then((fact) => setExplanation(fact));
    } else {
      setExplanation(questions[currentQuestion]?.explanation);
    }
  }, [answered, currentQuestion, questions, getExplanation]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [budEHistory]);

  if (loading) {
    return (
      <div className="loading-message">
        <h1>Generating your quiz... Please wait 😊</h1>
        <div className="flower-iframe-wrapper">
          <iframe
            src="/flowerloading.html"
            title="Flower-Loading Animation"
            className="loading-flower-frame"
          />
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="quiz-container" style={{ textAlign: "center", marginTop: "100px" }}>
        <h2 style={{ color: "#7B0323" }}>{errorMessage}</h2>
        <button className="exit-button" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container" style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>No questions available. Please try a different topic.</h2>
        <button className="exit-button" onClick={() => navigate("/")}>
          Go Back
        </button>
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
        setScore((prev) => prev + 1);
        setShowCorrectPopup(true);
      } else {
        setShowIncorrectPopup(true);
      }

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
      setShowIncorrectPopup(false);
      setExplanation(null);
      setTimeLeft(30);
      setBudEHistory([]);
      setBudEInput("");
      setIsTimerActive(true);
      setJustStarted(true);
    } else {
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
    <div className="quiz-container">
      <div className="header">
        <div className={`timer-box ${timeLeft <= 5 ? 'timer-box-critical' : ''}`}>
          <div
            className="timer-fill"
            style={{
              width: `${(timeLeft / 30) * 100}%`,
              backgroundColor: timeLeft <= 5 ? '#D9534F' : '#9A7E6F',
            }}
          ></div>
          <span className={`timer-text ${timeLeft <= 5 ? "timer-critical" : ""} ${timeLeft <= 14 && timeLeft > 5 ? "timer-on-white" : ""}`}>
            {timeLeft === 0
              ? "⏳ Time's up!"
              : justStarted && !answered
              ? `Timer: ${timeLeft}s`
              : timeLeft}
          </span>
        </div>
        <div className="score-box">Score: {score}</div>
      </div>

      <div className="question-box">
        <p className="question-text">Q{currentQuestion + 1}: {questionText}</p>
        <div className="options-container">
        {questionType === "image" ? (
          <div className="image-options">
            {question.options.map((option, index) => {
              const isCorrect = normalize(option.description) === normalize(question.answer || "");
              const isSelected = selected === option;

              let optionClass = "option";
              if (answered) {
                if (isCorrect) {
                  optionClass += " correct-highlight";
                }
                if (isSelected && !isCorrect) {
                  optionClass += " wrong-highlight";
                }
              }

              return (
                <img
                  key={index}
                  src={option.url}
                  alt={option.description}
                  className={optionClass}
                  onClick={answered ? undefined : () => handleOptionClick(option)}
                />
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
                if (isCorrect) {
                  optionClass += " correct-highlight";
                }
                if (isSelected && !isCorrect) {
                  optionClass += " wrong-highlight";
                }
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

      <button className="exit-button" onClick={() => {
        resetQuiz();
        navigate("/");
      }}>Exit</button>

      {(showIncorrectPopup || showCorrectPopup) && (
        <>
          <img
            src="/bud-e.png"
            alt="Bud-E toggle"
            className="bud-e-floating-icon"
            onClick={() => setIsBudEExpanded((prev) => !prev)}
          />
          {isBudEExpanded && (
            <div className="bud-e-popup-floating bud-e-bottom-right">
              <div className="popup-box popup-bottom">
                {showCorrectPopup ? (
                  <>
                    <h2 className="correct">Correct!</h2>
                    <div className="explanation-box">
                      <p>{explanation || "Fetching fun fact..."}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="incorrect">Incorrect!</h2>
                    {questionType === "text" && (
                      <p className="correct-answer">Correct Answer: {question.answer}</p>
                    )}
                    <div className="explanation-box">
                      <p>{explanation || "Fetching fun fact..."}</p>
                    </div>
                  </>
                )}
                <div className="chatbot-container">
                  <p>Learn more with Bud-E!</p>
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
                              <img
                                src="/bud-e.png"
                                alt="Bud-E avatar"
                                className="budE-avatar"
                              />
                              <div><p>{msg.content}</p></div>
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
                  <button onClick={handleAskBudE} className="budE-button">
                    Ask Bud-E
                  </button>
                </div>
                <div className="feedback-popup-buttons">
                  <button className="complete-button" onClick={() => navigate("/result")}>
                    Complete Quiz
                  </button>
                  <button className="next-button" onClick={handleNextQuestion}>
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizPage;
