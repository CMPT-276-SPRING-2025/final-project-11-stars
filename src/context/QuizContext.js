import React, { createContext, useState, useContext, useEffect } from 'react';

// Define your mock questions based on difficulty
const mockQuestions = {
  easy: [
    {
      text: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      answer: "Paris",
      explanation: "The capital of France is Paris."
    }
  ],
  medium: [
    {
      text: "Who developed the theory of relativity?",
      options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"],
      answer: "Albert Einstein",
      explanation: "Albert Einstein developed the theory of relativity."
    }
  ],
  hard: [
    {
      text: "What is the name of the mathematical constant defined as the ratio of a circle's circumference to its diameter?",
      options: ["Pi", "Euler's number", "Golden ratio", "Infinity"],
      answer: "Pi",
      explanation: "Pi is the ratio of a circle's circumference to its diameter."
    }
  ]
};

// Create the context
export const QuizContext = createContext();

// Create the provider component
export const QuizProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [difficulty, setDifficulty] = useState("easy"); // Default difficulty
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false); // Track quiz start state
  const [questionType, setQuestionType] = useState("text");

  // Load questions when category or difficulty changes
  useEffect(() => {
    if (selectedCategory && difficulty) {
      setQuestions(mockQuestions[difficulty] || []);
    }
  }, [selectedCategory, difficulty]);

  // Set difficulty and update questions
  const setSelectedDifficulty = (level) => {
    setDifficulty(level);
  };

  // Start quiz only when category is selected
  const startQuiz = () => {
    if (!selectedCategory) return; // Prevent start without category
    setIsQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setQuestions(mockQuestions[difficulty]); // Load the correct questions
  };

  // Reset quiz state
  const resetQuiz = () => {
    setScore(0);
    setCurrentQuestion(0);
    setIsQuizStarted(false);
    setSelectedCategory(null);
    setDifficulty("easy");
    setQuestions([]);
    setQuestionType("text");
  };

  return (
    <QuizContext.Provider value={{
      selectedCategory, setSelectedCategory,
      difficulty, setSelectedDifficulty, questions,
      score, setScore, currentQuestion, setCurrentQuestion,
      isQuizStarted, startQuiz, resetQuiz,
      questionType, setQuestionType // Add setQuestionType here
    }}>
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook to use the QuizContext
export const useQuiz = () => useContext(QuizContext);