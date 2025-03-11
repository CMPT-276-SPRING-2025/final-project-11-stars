import React, { useState } from 'react';
import './Quizcategories.css';

const QuizCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="quiz-categories">
      <h2>Select a Quiz Category</h2>
      <div className="category-selection">
        <button className="category-btn">Text Quiz</button>
        <select 
          value={selectedCategory} 
          onChange={handleCategoryChange}
          className="category-dropdown"
        >
          <option value="">Select a Category</option>
          <option value="general">General Knowledge</option>
          <option value="sports">Sports</option>
          <option value="science">Science</option>
          <option value="history">History</option>
          <option value="culture">Culture</option>
          <option value="geography">Geography</option>
          <option value="literature">Literature</option>
          <option value="food">Food</option>
          <option value="film">Film</option>
          <option value="music">Music</option>
          <option value="custom">Custom Quiz</option>
        </select>
      </div>

      {selectedCategory && (
        <div className="start-quiz-btn">
          <button>Start Quiz</button>
        </div>
      )}
    </div>
  );
};

export default QuizCategories;
