import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Homepage.js';
import QuizCategories from './pages/Quizcategories.js';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz-categories" element={<QuizCategories />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
