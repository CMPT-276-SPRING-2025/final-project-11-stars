import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from "../context/QuizContext"; //import global state
import './Quizcategories.css';

const categories = [
  { name: 'General', categoryName: 'general_knowledge', image: '/general.png', alt_text: 'General category icon: an owl wearing a graduation cap, symbolizing wisdom'},
  { name: 'Culture', categoryName: 'society_and_culture', image: '/culture.png', alt_text: 'Culture category icon - illustration of the Taj Mahal in orange and blue colors'},
  { name: 'Geography', categoryName: 'geography', image: '/geography.png', alt_text: 'Geography category icon - a blue globe with a red paper airplane flying around it'},
  { name: 'Literature', categoryName: 'arts_and_literature', image: '/literature.png', alt_text: 'Literature category icon - colorful books standing upright on a shelf'},
  { name: 'Food', categoryName: 'food_and_drink', image: '/food.png', alt_text: 'Food category icon - noodle dish in a bowl'},
  { name: 'Film & TV', categoryName: 'film_and_tv', image: '/film_and_tv.png', alt_text: 'Film and TV category icon - orange television with antenna'},
  { name: 'Music', categoryName: 'music', image: '/music.png', alt_text: 'Music category icon - headphones with music notes in the middle'},
  { name: 'Sports', categoryName: 'sport_and_leisure', image: '/sports.png', alt_text: 'Sports category icon - soccer ball and tennis rocket'},
  { name: 'Science', categoryName: 'science', image: '/science.png', alt_text: 'Science category icon - laboratory glassware with colorful liquids and bubbles'},
  { name: 'History', categoryName: 'history', image: '/history.png', alt_text: 'History category icon - an ancient scroll with unreadable script and a quill pen'},
  { name: 'Custom', categoryName: 'custom_ai_quiz', image: '/custom_quiz.png', alt_text: 'Custom category icon - a stylized human head with a digital brain, symbolizing AI-generated quizzes'}
];

const QuizCategory = () => {
  const{selectedCategory, setSelectedCategory, difficulty, setDifficulty, questionType, setQuestionType} = useContext(QuizContext);
  //const [isImageQuiz, setIsImageQuiz] = useState(false); // Toggle between text and image quiz
  
  //locat state variables:
  const [quizDisplayName, setQuizDisplayName] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleToggle = () => {
    setQuestionType(questionType==="text"?"image":"text");// Toggle between text and image quiz
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
          <span className={`quiz-option ${questionType === "text" ? 'active' : ''}`} onClick={() => setQuestionType("text")}>
            Text Quiz
          </span>

          {/* Toggle Switch */}
          <label className="switch">
            <input type="checkbox" checked={questionType === "image"} onChange={handleToggle} />
            <span className="slider"></span>
          </label>

          {/* Image Quiz option on right */}
          <span className={`quiz-option ${questionType === "image" ? 'active' : ''}`} onClick={() => setQuestionType("image")}>
            Image Quiz
          </span>
        </div>
        {/* Difficulty Dropdown on the right */}
        <div>
        <select className="difficulty-dropdown" value={difficulty} onChange={handleDifficultyChange}>
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
            onClick={() => {setSelectedCategory(category.categoryName); setQuizDisplayName(category.name); setShowPopup(true)}}
          >
            <img src={category.image} alt= {category.alt_text} className="category-image" />
            <p className="category-name">{category.name}</p>
          </div>
        ))}
      </div>

      {/* Popup for Selected Category */}
      {showPopup && (
        <div className="start-popup">
          <div className="start-popup-content">
            {/* Close Button */}
            <img 
              className="start-popup-close-btn" 
              src="/crossbtn.png" 
              alt="Close" 
              onClick={() => {setSelectedCategory(null); setQuizDisplayName(null); setShowPopup(false)}}
            />
            <h2>{quizDisplayName} Quiz</h2>
             <button className="start-quiz-btn" onClick={handleStartQuiz}>Start Quiz</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCategory;
