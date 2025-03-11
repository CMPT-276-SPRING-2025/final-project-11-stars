import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuizPage = () => {
  const navigate = useNavigate();

  const handleQuizComplete = () => {
    navigate('/result'); // Navigate to result page when quiz is completed
  };

  return (
    <div className="quiz-container">
      <header>Quiz Time!</header>
      <p>Quiz questions will appear here...</p>
      <button onClick={handleQuizComplete}>Complete Quiz</button>
    </div>
  );
};

export default QuizPage;
