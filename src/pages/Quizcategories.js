import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from "../context/QuizContext";
import './Quizcategories.css';

const categories = [
  { name: 'General', categoryName: 'general_knowledge', image: '/general.png', alt_text: 'General category icon' },
  { name: 'Culture', categoryName: 'society_and_culture', image: '/culture.png', alt_text: 'Culture category icon' },
  { name: 'Geography', categoryName: 'geography', image: '/geography.png', alt_text: 'Geography category icon' },
  { name: 'Literature', categoryName: 'arts_and_literature', image: '/literature.png', alt_text: 'Literature category icon' },
  { name: 'Food', categoryName: 'food_and_drink', image: '/food.png', alt_text: 'Food category icon ' },
  { name: 'Film & TV', categoryName: 'film_and_tv', image: '/film_and_tv.png', alt_text: 'Film and TV category ' },
  { name: 'Music', categoryName: 'music', image: '/music.png', alt_text: 'Music category icon' },
  { name: 'Sports', categoryName: 'sport_and_leisure', image: '/sports.png', alt_text: 'Sports category icon' },
  { name: 'Science', categoryName: 'science', image: '/science.png', alt_text: 'Science category icon' },
  { name: 'History', categoryName: 'history', image: '/history.png', alt_text: 'History category icon' },
  { name: 'Custom', categoryName: 'custom_ai_quiz', image: '/custom_quiz.png', alt_text: 'Custom category icon' }
];

const QuizCategory = () => {
  const { setSelectedCategory, difficulty, setDifficulty, questionType, setQuestionType } = useContext(QuizContext); // Ensure correct state and setter
  const [quizDisplayName, setQuizDisplayName] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  
  const navigate = useNavigate();

  const handleDifficultyChange = (level) => {
    setDifficulty(level); // Use setDifficulty to update the state
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category); // Set the selected category
    setQuizDisplayName(category.name);  // Set the display name to show in popup
    setShowPopup(true);
  };

  const handleStartQuiz = () => {
    navigate("/quiz");
  };
  
  const handleToggle = () => {
    setQuestionType(questionType === "text" ? "image" : "text");
  };

  return (
    <div className="quiz-category-container">
      <h1 className="quiz-category-title">Quiz Categories</h1>
      <div className="toggle-difficulty-container">
        {/* Quiz Type Toggle */}
        <div className="toggle-quiz-option">
          <div className="quiz-toggle">
            <span className={`quiz-option ${questionType === "text" ? 'active' : ''}`} onClick={() => setQuestionType("text")}>Text Quiz</span>
            <label className="switch">
              <input type="checkbox" checked={questionType === "image"} onChange={handleToggle} />
              <span className="slider"></span>
            </label>
            <span className={`quiz-option ${questionType === "image" ? 'active' : ''}`} onClick={() => setQuestionType("image")}>Image Quiz</span>
          </div>
        </div>
        
        {/* Difficulty Selection Dropdown */}
        <div className="difficulty-dropdown">
          <select 
            className="difficulty-select" 
            value={difficulty} 
            onChange={(e) => handleDifficultyChange(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
      
      {/* Quiz Categories Grid */}
      <div className="quiz-category-grid">
        {categories.map((category, index) => (
          <div
            key={index}
            className="quiz-category-box"
            onClick={() => handleCategoryClick(category)}  // Pass the entire category object
          >
            <img src={category.image} alt={category.alt_text} className="category-image" />
            <p className="category-name">{category.name}</p>
          </div>
        ))}
      </div>

      {/* Popup for Selected Category */}
      {showPopup && (
        <div className="start-popup">
          <div className="start-popup-content">
            <img className="start-popup-close-btn" src="/crossbtn.png" alt="Close" onClick={() => {
              setSelectedCategory(null);
              setQuizDisplayName(null);
              setShowPopup(false);
            }} />
            <h2>{quizDisplayName} Quiz</h2> {/* Display the name of the quiz */}
            <button className="start-quiz-btn" onClick={handleStartQuiz}>Start Quiz</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCategory;