import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState("text");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);

  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  const TRIVIA_API_KEY = process.env.REACT_APP_TRIVIA_API_KEY;

  const resetQuiz = () => {
    setScore(0);
    setSelectedCategory(null);
    setDifficulty("easy");
    setQuestions([]);
    setQuestionType("text");
    setCurrentQuestion(0);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedCategory) return;
      setLoading(true);

      try {
        if (selectedCategory.id === "custom_ai_quiz") {
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              temperature: 0.9,
              messages: [
                {
                  role: "system",
                  content:
                    "You are a trivia quiz generator. Generate 10 trivia questions, each with 4 options. Return only raw JSON with no markdown.",
                },
                {
                  role: "user",
                  content: `Create 10 unique trivia questions for teenagers on the topic "${selectedCategory.topic}" with "${difficulty}" difficulty.
Each question must be an object in this format:
{
  "question": "What is the capital of France?",
  "options": ["Berlin", "Paris", "London", "Rome"],
  "correctAnswer": "Paris"
}
Return only: { "questions": [ ... ] }`,
                },
              ],
              max_tokens: 1000,
            }),
          });

          const data = await response.json();
          let rawContent = data.choices[0].message.content.trim();

          // Remove code block formatting if GPT includes it
          if (rawContent.startsWith("```")) {
            rawContent = rawContent.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, "$1").trim();
          }

          let aiQuestions;
          try {
            const parsed = JSON.parse(rawContent);
            aiQuestions = parsed.questions;
          } catch (err) {
            console.error("Failed to parse AI JSON:", rawContent);
            setQuestions([]);
            setLoading(false);
            return;
          }

          const formatted = aiQuestions.map((q) => {
            const correct = q.correctAnswer;
            const options = q.options || [];

            if (!correct || !options.includes(correct)) {
              console.warn("Skipping question due to invalid format:", q);
              return null;
            }

            return {
              text: q.question,
              options: options.sort(() => Math.random() - 0.5),
              answer: correct,
              explanation: null,
            };
          }).filter(Boolean); // Remove any nulls

          setQuestions(formatted);
        }else if(questionType ==="image"){
          const response = await axios.get("https://the-trivia-api.com/v2/questions",{
            headers:{
              "X-API-Key": TRIVIA_API_KEY,
            },
            params:{
              categories: selectedCategory.categoryName,
              difficulty: difficulty,
              limit: 10,
              types: "image_choice"
            },
          });
          console.log("Image question API response:", response.data);
          console.log("Question type:", questionType);
          const formattedQuestions = response.data.map((question) => {
            const flattenedIncorrect = question.incorrectAnswers.flat();
            return{
            text: question.question.text,
            options:[...flattenedIncorrect, question.correctAnswer[0]].sort(
              () => Math.random() - 0.5
            ),
            answer : question.correctAnswer[0].description,
            explanation: null,
            };
          })

          setQuestions(formattedQuestions);

        }else {
          const response = await axios.get("https://the-trivia-api.com/api/questions", {
            params: {
              categories: selectedCategory.categoryName,
              difficulty: difficulty,
              limit: 10,
            },
          });

          const formattedQuestions = response.data.map((question) => ({
            text: question.question,
            options: [...question.incorrectAnswers, question.correctAnswer].sort(
              () => Math.random() - 0.5
            ),
            answer: question.correctAnswer,
            explanation: null,
          }));

          setQuestions(formattedQuestions);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedCategory, difficulty,questionType, OPENAI_API_KEY, TRIVIA_API_KEY]);

  const getExplanation = async (questionIndex) => {
    if (!questions[questionIndex] || questions[questionIndex].explanation) return;

    try {
      const question = questions[questionIndex];

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You explain trivia answers in a fun, kid-friendly way with emojis.",
            },
            {
              role: "user",
              content: `Give a short fun fact related to this trivia question and answer within 40 tokens:\n\nQ: ${question.text}\nA: ${question.answer}`,
            },
          ],
          max_tokens: 40,
        }),
      });

      const data = await response.json();
      const newExplanation = data.choices?.[0]?.message?.content?.trim() || "No fun fact available.";

      setQuestions((prevQuestions) => {
        const updated = [...prevQuestions];
        updated[questionIndex] = {
          ...updated[questionIndex],
          explanation: newExplanation,
        };
        return updated;
      });
    } catch (error) {
      console.error("Error fetching fun fact:", error);
    }
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
