import { useState, useContext } from "react";
import { QuizContext } from "../context/QuizContext";

function Quiz() {
  const { questions, currentQuestion, setCurrentQuestion, score, setScore } = useContext(QuizContext);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      window.location.href = "/result";
    }
  };

  return (
    <div className="quiz">
      <h2>{questions[currentQuestion].question}</h2>
      {questions[currentQuestion].options.map((option, index) => (
        <button key={index} onClick={() => handleAnswer(option.isCorrect)}>
          {option.text}
        </button>
      ))}
    </div>
  );
}

export default Quiz;
