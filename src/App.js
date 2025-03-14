// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext'; 
import HomePage from './pages/Homepage';
import QuizCategory from './pages/Quizcategories';
import QuizPage from './pages/Quizpage';
import ResultPage from './pages/Resultpage';
import './App.css';

const App = () => {
  return (
    <QuizProvider> {/* Wraps the entire app inside the provider so all components inside can access the quiz context */}
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz-categories" element={<QuizCategory />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </div>
      </Router>
      </QuizProvider>
  );
};

export default App;
