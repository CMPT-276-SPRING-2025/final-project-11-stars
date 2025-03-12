import { createContext, useState } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [questions, setQuestions] = useState([
    { question: "What is 2 + 2?", options: [{ text: "4", isCorrect: true }, { text: "5", isCorrect: false }] },
    { question: "What is the capital of France?", options: [{ text: "Paris", isCorrect: true }, { text: "London", isCorrect: false }] },
  ]);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  return (
    <QuizContext.Provider value={{ questions, currentQuestion, setCurrentQuestion, score, setScore }}>
      {children}
    </QuizContext.Provider>
  );
};
