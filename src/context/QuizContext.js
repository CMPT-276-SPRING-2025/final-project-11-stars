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

const resetQuiz = () => {
  setScore(0);
  setSelectedCategory(null);
  setDifficulty("medium");
  setQuestions([]);
  setQuestionType("text");
  setCurrentQuestion(0);
}

  //For testing: will be replaced by the Trivia API fetched questions
  //*************
  useEffect(() => {
    //NOTE: BELOW COMMENT IS TO HELP WITH THE TRIVIA API INTEGRATION
    //const fetchQuestions = async () => {
      //if (!selectedCategory || selectedCategory === 'custom_ai_quiz') return;  // if user has not selected a category yet or if they selected custom quiz, return (dont fetch)
    if(!selectedCategory || selectedCategory === 'custom_ai_quiz') return;
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
      },
      {
        text: "Test Question 3?",
        options: ["hello", "hi", "bye", "byebye"],
        answer: "hello",
        explanation: "Another test question."
      }
    ]);
    
    
  }, [selectedCategory]); // runs only when selected category changes, this prevents running on every render, avoiding unnecessary api calls
  //*************

  return (
    // global states
    <QuizContext.Provider value={{score, setScore, selectedCategory, 
    setSelectedCategory, difficulty, setDifficulty, questions, setQuestions,
     questionType, setQuestionType, currentQuestion, setCurrentQuestion, resetQuiz}}>
      {children}
    </QuizContext.Provider>
  );
};
