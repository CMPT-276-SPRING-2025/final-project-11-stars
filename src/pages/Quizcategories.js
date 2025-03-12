import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quizcategories.css';

const categories = [
  { name: 'General', image: '/general.png' },
  { name: 'Culture', image: '/culture.png' },
  { name: 'Geography', image: '/geography.png' },
  { name: 'Literature', image: '/literature.png' },
  { name: 'Food', image: '/food.png' },
  { name: 'Film & TV', image: '/film_and_tv.png' },
  { name: 'Music', image: '/music.png' },
  { name: 'Sports', image: '/sports.png' },
  { name: 'Science', image: '/science.png' },
  { name: 'History', image: '/history.png' },
  { name: 'Custom', image: '/custom_quiz.png' }
];

const QuizCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isImageQuiz, setIsImageQuiz] = useState(false); // Toggle between text and image quiz
  const [difficulty, setDifficulty] = useState("Easy"); // Difficulty level state
  
  const handleToggle = () => {
    setIsImageQuiz(!isImageQuiz); // Toggle the isToggled state
  };
  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const navigate = useNavigate();

  const handleStartQuiz = () => {
    // Once the quiz category is selected, navigate to the quiz page
    navigate('/quiz');
  };

  return (
    <div className="quiz-category-container">
      <h1 className="quiz-category-title">Quiz Categories</h1>
      <div className="toggle-quiz-option">
        <div className="quiz-toggle">
          {/* Text Quiz option on left */}
          <span className={`quiz-option ${!isImageQuiz ? 'active' : ''}`} onClick={() => setIsImageQuiz(false)}>
            Text Quiz
          </span>

          {/* Toggle Switch */}
          <label className="switch">
            <input type="checkbox" checked={isImageQuiz} onChange={handleToggle} />
            <span className="slider"></span>
          </label>

          {/* Image Quiz option on right */}
          <span className={`quiz-option ${isImageQuiz ? 'active' : ''}`} onClick={() => setIsImageQuiz(true)}>
            Image Quiz
          </span>
        </div>
      </div>

      {/* Quiz Categories Grid */}
      <div className="quiz-category-grid">
        {categories.map((category, index) => (
          <div 
            key={index} 
            className="quiz-category-box" 
            onClick={() => setSelectedCategory(category)}
          >
            <img src={category.image} alt={category.name} className="category-image" />
            <p className="category-name">{category.name}</p>
          </div>
        ))}
        {/* Difficulty Dropdown on the right */}
        <select className="difficulty-dropdown" value={difficulty} onChange={handleDifficultyChange}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Popup for Selected Category */}
      {selectedCategory && (
        <div className="popup">
          <div className="popup-content">
            {/* Close Button */}
            <img 
              className="close-btn" 
              src="/crossbtn.png" 
              alt="Close" 
              onClick={() => setSelectedCategory(null)}
            />
            <h2>{selectedCategory.name} Quiz</h2>
             <button className="start-quiz-btn" onClick={handleStartQuiz}>Start Quiz</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCategory;
