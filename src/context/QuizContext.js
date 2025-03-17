import { createContext, useState, useEffect } from "react";
import axios from "axios";

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
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedCategory || selectedCategory === 'custom_ai_quiz') return;

      try {
        const randomSeed = Math.random(); // Generate a random number
        const response = await axios.get(`https://the-trivia-api.com/api/questions?categories=${selectedCategory}&difficulty=${difficulty}&limit=10&random=${randomSeed}`);
        const fetchedQuestions = response.data.map((question) => ({
          text: question.question,
          options: [...question.incorrectAnswers, question.correctAnswer].sort(() => Math.random() - 0.5),
          answer: question.correctAnswer,
          explanation: "No explanation available." // Update this with openai api explanation
        }));
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [selectedCategory, difficulty]);

  return (
    <QuizContext.Provider value={{score, setScore, selectedCategory, setSelectedCategory, difficulty, setDifficulty, questions, setQuestions, questionType, setQuestionType, currentQuestion, setCurrentQuestion, resetQuiz}}>
      {children}
    </QuizContext.Provider>
  );
};