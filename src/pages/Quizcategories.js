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
  const { setSelectedCategory, difficulty, setDifficulty, questionType, setQuestionType } = useContext(QuizContext);
  const [quizDisplayName, setQuizDisplayName] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [customTopic, setCustomTopic] = useState("");

  const navigate = useNavigate();

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    if (category.categoryName === "custom_ai_quiz") {
      setShowCustomPopup(true);
      setShowPopup(false);
    } else {
      setQuizDisplayName(category.name);
      setShowPopup(true);
      setShowCustomPopup(false);
    }
  };

  const handleStartQuiz = () => {
    navigate("/quiz");
  };

  const handleCustomStartQuiz = () => {
    if (customCategory.trim() && customTopic.trim()) {
      console.log("Starting custom quiz with:", customCategory, customTopic);
      navigate("/quiz");
    } else {
      alert("Please enter both category and topic!");
    }
  };

  const handleToggle = () => {
    setQuestionType(questionType === "text" ? "image" : "text");
  };

  return (
    <div className="quiz-category-container">
      <h1 className="quiz-category-title">Quiz Categories</h1>
      <div className="toggle-difficulty-container">
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

      <div className="quiz-category-grid">
        {categories.map((category, index) => (
          <div
            key={index}
            className="quiz-category-box"
            onClick={() => handleCategoryClick(category)}
          >
            <img src={category.image} alt={category.alt_text} className="category-image" />
            <p className="category-name">{category.name}</p>
          </div>
        ))}
      </div>

      {/* Popup for Normal Categories */}
      {showPopup && (
        <div className="start-popup">
          <div className="start-popup-content">
            <img className="start-popup-close-btn" src="/crossbtn.png" alt="Close" onClick={() => {
              setSelectedCategory(null);
              setQuizDisplayName(null);
              setShowPopup(false);
            }} />
            <h2>{quizDisplayName} Quiz</h2>
            <button className="start-quiz-btn" onClick={handleStartQuiz}>Start Quiz</button>
          </div>
        </div>
      )}

      {showCustomPopup && (
        <div className="custom-quiz-popup">
          <div className="custom-quiz-popup-content">
            <img className="popup-close-btn" src="/crossbtn.png" alt="Close" onClick={() => setShowCustomPopup(false)} />
            
            {/* Image and Title Wrapper */}
            <div className="popup-icon-wrapper">
              <img src="/bud-e.png" alt="Custom Quiz Icon" className="popup-icon" />
              <h2 className="custom-quiz-title">Create your own quiz with Bud-E!</h2>
            </div>

            <div className="custom-quiz-inputs">
            {/* Category Label and Input */}
            <div className="input-wrapper">
              <label htmlFor="category" className="input-label">Category</label>
              <input 
                id="category"
                type="text" 
                placeholder="Quiz Category" 
                value={customCategory} 
                onChange={(e) => setCustomCategory(e.target.value)} 
              />
            </div>
            
            {/* Topic Label and Input */}
            <div className="input-wrapper">
              <label htmlFor="topic" className="input-label">Topic</label>
              <input 
                id="topic"
                type="text" 
                placeholder="Quiz Topic" 
                value={customTopic} 
                onChange={(e) => setCustomTopic(e.target.value)} 
              />
            </div>
            </div>
            <button className="start-quiz-btn" onClick={handleCustomStartQuiz}>Start Quiz</button>
          </div>
        </div>
      )}



    </div>
  );
};

export default QuizCategory;
