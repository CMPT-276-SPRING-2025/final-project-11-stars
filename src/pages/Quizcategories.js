import React, { useState } from 'react';
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
  

  return (
    <div className="quiz-category-container">
      <h1 className="quiz-category-title">Quiz Categories</h1>
      

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
            <button className="start-quiz-btn">Start Quiz</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCategory;
