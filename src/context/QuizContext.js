import { createContext, useState, useEffect } from "react";

//Context
export const QuizContext = createContext();

//Provider
export const QuizProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState("text");
  const [currentQuestion, setCurrentQuestion] = useState(0);

  //For testing: will be replaced by the Trivia API fetched questions
  //*************
  useEffect(() => {
    setQuestions([
      {
        text: "Test Question?",
        options: ["A", "B", "C", "D"],
        answer: "B",
        explanation: "This is just a test question."
      },
      {
        text: "Test Question 2?",
        options: ["X", "Y", "Z", "W"],
        answer: "Z",
        explanation: "Another test question."
      }
    ]);
  }, []);
  //*************

  return (
    // global states
    <QuizContext.Provider value={{score, setScore, selectedCategory, 
    setSelectedCategory, difficulty, setDifficulty, questions, setQuestions,
     questionType, setQuestionType, currentQuestion, setCurrentQuestion}}>
      {children}
    </QuizContext.Provider>
  );
};
