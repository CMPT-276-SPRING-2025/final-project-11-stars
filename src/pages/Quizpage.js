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

  const normalize = (str) => str?.trim().toLowerCase();

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

  useEffect(() => {
    if (answered && questions[currentQuestion]?.explanation === null) {
      getExplanation(currentQuestion).then((fact) => setExplanation(fact));
    } else {
      setExplanation(questions[currentQuestion]?.explanation);
    }
  }, [answered, currentQuestion, questions, getExplanation]);

  useEffect(()=>{
    if(chatEndRef.current)
    {
      chatEndRef.current.scrollIntoView({behaviour: "smooth"});
    }
  }, [budEHistory]);

  // ✅ Error handling and loading screen
  if (loading) {
    return(
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
    )
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

      // Debug logs
      console.log("Selected Option:", option);
      console.log("Correct Answer:", question.answer);
      console.log("All Options:", question.options);

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
    } else {
      navigate("/result");
    }
  };

  const handleAskBudE = async() => {
    if (!budEInput.trim()) return; //prevent empty messages

    //Temporary thinking message
    const tempHistory = [
      ...budEHistory, {role:"user", content: budEInput},
      {role: "assistant", content: "🤔 Thinking..."},
    ];
    setBudEHistory(tempHistory);
    setBudEInput("");
    
    const updatedHistory = await getBudEReply(budEInput, budEHistory);

    setBudEHistory(updatedHistory);
    
  }

  return (
    <div className="quiz-container">
      <div className="header">
        <div className="timer-box">Timer: {timeLeft}s</div>
        <div className="score-box">Score: {score}</div>
      </div>

      <div className="question-box">
        <p className="question-text">Q{currentQuestion + 1}: {questionText}</p>
        <div className="options-container">
          {questionType === "image" ? (
            <div className="image-options">
              {question.options.map((option, index) => (
                <img
                  key={index}
                  src={option.url}
                  alt={option.description}
                  className={`option ${
                    selected === option
                      ? normalize(option.description) === normalize(question.answer || "")
                        ? "correct"
                        : "wrong"
                      : ""
                  }`}
                  onClick={answered ? undefined : () => handleOptionClick(option)}
                />
              ))}
            </div>
          ) : (
            <div className="text-options">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  className={`option ${
                    selected === option
                      ? normalize(option) === normalize(question.answer || "")
                        ? "correct"
                        : "wrong"
                      : ""
                  }`}
                  onClick={() => handleOptionClick(option)}
                  disabled={answered}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="exit-button" onClick={() => {
        resetQuiz();
        navigate("/");
      }}>Exit</button>

      {showIncorrectPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2 className="incorrect">Incorrect!</h2>
            {questionType === "text" && (
              <p className="correct-answer">Correct Answer: {question.answer}</p>
            )}
            <div className="explanation-box">
              <p>{explanation || "Fetching fun fact..."}</p>
            </div>
            <div className="chatbot-container">
              <p>Learn more with Bud-E!</p>
              {budEHistory.length === 0 && 
              (<img src="/bud-e.png" alt="Bud-E" className="ai-icon" />)
              } 
              {budEHistory.length > 0 && (
                <div className="budE-chat-history">
                {
                  budEHistory.map((msg, index) =>(
                    <div key ={index} className = {`budE-message ${msg.role}`}>
                      {msg.role === "user"? (
                        <>
                          <strong>🌱CuriousSeed</strong>
                          <p>{msg.content}</p>
                        </>
                      ):(
                        <div className ="assistant-bubble">
                          <img src ="/bud-e.png" alt ="Bud-E: a cute robot icon with a plant on its head" 
                            className="budE-avatar"/>
                            <div>
                              <p>{msg.content}</p>
                            </div>
                        </div>
                      )}
                    </div>
                  ))
                }
                {/**Scroll down */}
                <div ref = {chatEndRef}/>
              </div>
              )}
              <textarea
                value ={budEInput}
                onChange={(e) => setBudEInput(e.target.value)}
                placeholder="Ask Bud-E to learn more!"
                rows={3}
                className="ask-input"
              />
              <button onClick={handleAskBudE} className="budE-button">
                Ask Bud-E
              </button>
            </div>
            <div className="feedback-popup-buttons">
              <button className="complete-button" onClick={() => navigate("/result")}>Complete Quiz</button>
              <button className="next-button" onClick={handleNextQuestion}>Next</button>
            </div>
          </div>
        </div>
      )}

      {showCorrectPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2 className="correct">Correct!</h2>
            <div className="explanation-box">
              <p>{explanation || "Fetching fun fact..."}</p>
            </div>
            <div className="chatbot-container">
              <p>Learn more with Bud-E!</p>
              {budEHistory.length === 0 && 
              (<img src="/bud-e.png" alt="Bud-E" className="ai-icon" />)
              } 
              {budEHistory.length > 0 && (
                <div className="budE-chat-history">
                {
                  budEHistory.map((msg, index) =>(
                    <div key ={index} className = {`budE-message ${msg.role}`}>
                      {msg.role === "user"? (
                        <>
                          <strong>🌱CuriousSeed</strong>
                          <p>{msg.content}</p>
                        </>
                      ):(
                        <div className ="assistant-bubble">
                          <img src ="/bud-e.png" alt ="Bud-E: a cute robot icon with a plant on its head" 
                            className="budE-avatar"/>
                            <div>
                              <p>{msg.content}</p>
                            </div>
                        </div>
                      )}
                    </div>
                  ))
                }
                {/**Scroll down */}
                <div ref = {chatEndRef}/>
              </div>
              )}
              <textarea
                value ={budEInput}
                onChange={(e) => setBudEInput(e.target.value)}
                placeholder="Ask Bud-E to learn more!"
                rows={3}
                className="ask-input"
              />
              <button onClick={handleAskBudE} className="budE-button">
                Ask Bud-E
              </button>
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
