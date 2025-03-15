import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext"; //import global state
import "./Quizpage.css";



//NOTE: YOU NEED TO RESET STATE FOR QUESTIONS AFTER CLICKING GO BACK TO QUIZ CATEGORIES AND SEE IF IT ALSO NEEDS TO BE THERE AFTRE DISPLAYING FINAL SCORE

const QuizPage = () => {
  const navigate = useNavigate();
  // Global states: need to persist across multiple questions
  const {score,setScore, selectedCategory, 
     difficulty, questions,questionType, 
     currentQuestion, setCurrentQuestion, resetQuiz
  } = useContext(QuizContext);
  
  // Keep separate in local state as these don't have to persist across multiple questions
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showIncorrectPopup, setShowIncorrectPopup] = useState(false);
  const [showCorrectPopup, setShowCorrectPopup] = useState(false);
  
  //For debugging
  if(questions.length === 0)
  {
    return <h2>Loading Questions...</h2>;
  }

  const question = questions[currentQuestion];

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

  return (
    <div className="quiz-container">
      <div className="header">
        <div className="timer-box">Timer:</div>
        <div className="score-box">Score: {score}</div>
      </div>
      <div className="question-box">
        <p className="question-text">Q{currentQuestion + 1}: {question.text}</p>
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
      <button className="exit-button" onClick={() => 
        {
          resetQuiz(); // reset global state variables
          navigate("/")
        }}>Exit

      </button>
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
            <div className = "feedback-popup-buttons">
              <button className="complete-button" onClick={() => navigate("/result")}>Complete Quiz</button>
              <button className = "next-button" onClick={() => {
                if(currentQuestion < questions.length-1)
                {
                  setCurrentQuestion(currentQuestion + 1); // move to next question
                  //Reset question state
                  //testing **************
                  console.log("current quiz category type: ", selectedCategory);
                  console.log("current difficulty: ", difficulty);
                  console.log("current question: ", currentQuestion);
                  console.log("current question type: ", questionType);
                  //********************/
                  setSelected(null);
                  setAnswered(false);
                  setShowCorrectPopup(false); //close popup
                  setShowIncorrectPopup(false);
                }
                else{
                  navigate("/result");
                }
              }}>Next
              </button>
              </div>
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
            <div className = "feedback-popup-buttons">
              <button className="complete-button" onClick={() => navigate("/result")}>Complete Quiz</button>
              <button className="next-button" onClick={() => {
                if(currentQuestion < questions.length-1)
                {
                  setCurrentQuestion(currentQuestion + 1); // move to next question
                  //Reset question state
                  //testing ****************
                  console.log("current quiz category type: ", selectedCategory);
                  console.log("current difficulty: ", difficulty);
                  console.log("current question: ", currentQuestion);
                  console.log("current question type: ", questionType);
                  //****************/
                  setSelected(null);
                  setAnswered(false);
                  setShowCorrectPopup(false); //close popup
                  setShowIncorrectPopup(false);
                }
                else{
                  navigate("/result");
                }
              }}>Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default QuizPage;
