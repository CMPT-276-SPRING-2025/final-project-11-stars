import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext'; 
import HomePage from './pages/Homepage';
import QuizCategory from './pages/Quizcategories';
import QuizPage from './pages/Quizpage';
import ResultPage from './pages/Resultpage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Footer from './pages/Footer';
import HelpButton from './pages/HelpButton';
import './App.css';

const AppContent = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="App">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/quiz-categories" element={<QuizCategory />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>

      {isHome && <Footer />}
      {isHome && <HelpButton />}
    </div>
  );
};

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <QuizProvider>
      <Router>
        <AppContent darkMode={darkMode} setDarkMode={setDarkMode} />
      </Router>
    </QuizProvider>
  );
};

export default App;
