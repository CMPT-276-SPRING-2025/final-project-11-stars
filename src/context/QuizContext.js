import { createContext, useState, useEffect } from "react";
import axios from "axios";
//import OpenAI from "openai";

// Context
export const QuizContext = createContext();

// Provider
export const QuizProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState("text");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);

  // Reset Quiz Function
  const resetQuiz = () => {
    setScore(0);
    setSelectedCategory(null);
    setDifficulty("easy");
    setQuestions([]);
    setQuestionType("text");
    setCurrentQuestion(0);
  };

  // Fetch questions from The Trivia API
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedCategory || selectedCategory === "custom_ai_quiz") return;

      setLoading(true);

      try {
        const response = await axios.get(
          `https://the-trivia-api.com/v2/questions`,
          {
            params: {
              categories: selectedCategory,
              difficulty: difficulty,
              limit: 10,
            },
          }
        );

        if (!response.data || response.data.length === 0) {
          setQuestions([]);
          setLoading(false);
          return;
        }

        const formattedQuestions = response.data.map((question) => ({
          text: question.question.text,
          options: [...question.incorrectAnswers, question.correctAnswer].sort(
            () => Math.random() - 0.5
          ),
          answer: question.correctAnswer,
          explanation: null,
        }));

        setQuestions(formattedQuestions);
      } catch (error) {
        console.error("Error fetching trivia questions:", error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedCategory, difficulty]);

  // Fetch fun fact from OpenAI
  const getExplanation = async (questionIndex) => {
    if (!questions[questionIndex] || questions[questionIndex].explanation) return;

    // Temporarily commented out due to OpenAI API key requirement

    /*
    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      const question = questions[questionIndex];

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You explain fun trivia facts in a simple, exciting, and kid-friendly way (ages 8-16)."
          },
          {
            role: "user",
            content: `Give a **1 sentence** fun fact related to this trivia question and answer.
            Make it short, engaging, and easy for kids to understand. Include a relevant emoji. Answer within 40 tokens.\n\nQuestion: ${question.text}\nAnswer: ${question.answer}`
          }
        ],
        max_tokens: 40,
      });

      const newExplanation = response.choices?.[0]?.message?.content?.trim() || "No fun fact available.";

      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          explanation: newExplanation,
        };
        return updatedQuestions;
      });

    } catch (error) {
      console.error("Error fetching fun fact:", error);
    }
      */
  };

  return (
    <QuizContext.Provider
      value={{
        score,
        setScore,
        selectedCategory,
        setSelectedCategory,
        difficulty,
        setDifficulty,
        questions,
        setQuestions,
        questionType,
        setQuestionType,
        currentQuestion,
        setCurrentQuestion,
        loading,
        getExplanation,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};