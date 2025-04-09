// QuizContext.js
//
// This file defines a React Context and Provider for managing global quiz state 
// across the BrainGoated app. It handles quiz settings (category, difficulty, language), 
// fetches questions from either the Trivia API or OpenAI (custom AI mode), and 
// manages quiz features like the chatbot and fun-facts
//
// Functions and state are exposed via context so they can be accessed from 
// any component within the provider.

import { createContext, useState, useEffect } from "react";

// Create a global context for quiz-related data and logic
export const QuizContext = createContext();

// State variables to track quiz settings and progress
export const QuizProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [difficulty, setDifficulty] = useState("");
  const [language, setLanguage] = useState("en");
  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState("text");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);


  // Resets all quiz state variables to initial values
  const resetQuiz = () => {
    setScore(0);
    setSelectedCategory(null);
    setDifficulty("");
    setLanguage("en");
    setQuestions([]);
    setQuestionType("text");
    setCurrentQuestion(0);
    setErrorMessage(null);
    setAnsweredQuestions([]);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedCategory) return;
      setLoading(true);
      setErrorMessage(null);

      const topic = selectedCategory?.topic?.toLowerCase?.() || "";

      const isCustomAIQuiz = selectedCategory.id === "custom_ai_quiz";

      if (isCustomAIQuiz) {
        // Block unsafe/inappropriate AI quiz topics
        const inappropriateCategories = ["violence", "hate speech", "adult content"];
        if (inappropriateCategories.includes(topic)) {
          setErrorMessage("This topic isn't suitable for a trivia quiz. Please choose another.");
          setQuestions([]);
          setLoading(false);
          return;
        }

        // Retry loop to generate 10 valid AI questions
        const generateValidQuestions = async () => {
          const maxRetries = 5;
          let validQuestions = [];

          for (let attempt = 0; attempt < maxRetries && validQuestions.length < 10; attempt++) {
            const remaining = 10 - validQuestions.length;

            const response = await fetch("/.netlify/functions/generateQuestions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                topic: selectedCategory.topic,
                difficulty,
                language,
                remaining,
              }),
            });

            const data = await response.json();
            let rawContent = data.choices?.[0]?.message?.content?.trim();

            // Remove markdown backticks if present
            if (rawContent?.startsWith("```")) {
              rawContent = rawContent.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, "$1").trim();
            }

            let aiQuestions;
            try {
              const parsed = JSON.parse(rawContent);
              if (parsed.status === "REJECTED") {
                setErrorMessage("This topic isn't available for a quiz. Please try a different one.");
                setQuestions([]);
                setLoading(false);
                return;
              }
              aiQuestions = parsed.questions;
            } catch (err) {
              continue; // Try again on invalid JSON
            }

            const formatted = aiQuestions
              .map((q) => {
                const correct = q.correctAnswer;
                const options = q.options || [];
            
                // Validate: exactly 4 options, all unique, non-empty, correct answer included
                const allValid = options.length === 4 &&
                                options.every(opt => typeof opt === "string" && opt.trim() !== "") &&
                                new Set(options).size === 4 &&
                                options.includes(correct);
            
                if (!correct || !allValid) {
                  return null;
                }
            
                return {
                  text: q.question,
                  options: options.sort(() => Math.random() - 0.5),
                  answer: correct,
                  explanation: null,
                };
              })
              .filter(Boolean);
          

            validQuestions = [...validQuestions, ...formatted];
          }

          // Final check for success
          if (validQuestions.length === 10) {
            setQuestions(validQuestions);
          } else {
            setErrorMessage("Not enough valid questions generated. Try rewording the topic.");
            setQuestions([]);
          }

          setLoading(false);
        };

        await generateValidQuestions();
      } else {
        try {
          // Request for non-AI (Trivia API) questions
          const params = {
            categoryName: selectedCategory.categoryName,
            difficulty:difficulty||"easy",
            questionType,
            language,
          };

          const response = await fetch("/.netlify/functions/getTriviaQuestions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
          });

          const data = await response.json();

          const formattedQuestions = data.map((question) => {
            if (questionType === "image") {
               // Remove duplicates images and shuffle image options
              const flattenedIncorrect = question.incorrectAnswers.flat();
              const allOptions = [...flattenedIncorrect, ...question.correctAnswer];

              const uniqueOptions = Array.from(
                new Map(allOptions.map((item) => [item.description, item])).values()
              );

              const shuffledOptions = uniqueOptions.sort(() => Math.random() - 0.5);

              return {
                text: question.question.text,
                options: shuffledOptions,
                answer: question.correctAnswer[0], // <--- STORE FULL OBJECT, not just .description
                explanation: null,
              };
            } 
            else {
               // Standard text-based questions
              return {
                text: question.question.text,
                options: [...question.incorrectAnswers, question.correctAnswer].sort(() => Math.random() - 0.5),
                answer: question.correctAnswer,
                explanation: null,
              };
            }
          });

          setQuestions(formattedQuestions);
        } catch (error) {
          setQuestions([]);
          setErrorMessage("Something went wrong while fetching quiz questions.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuestions();
  }, [selectedCategory, difficulty, questionType, language]);

  // Calls OpenAI to generate a fun explanation/fact for the current question
  const getExplanation = async (questionIndex) => {
    if (!questions[questionIndex] || questions[questionIndex].explanation) return;

    try {
      const question = questions[questionIndex];

      const response = await fetch("/.netlify/functions/getFunFact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionText: question.text,
          correctAnswer: question.answer,
          language, 
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
    }
  };

  // Sends a conversation to OpenAI to get a chatbot response (Bud-E)
  const getBudEReply = async (userMessage, history = []) => {
    const question = questions[currentQuestion];
    if (!question) return [];

    // Define rules and personality for Bud-E
    const baseMessages = [
      {
        role: "system",
        content: `You are Bud-E, a cheerful quiz buddy chatbot for kids (8–15).
                  Always respond in the selected **language**.
                  
                  Answer follow-up questions that are about: 
                  - Anything mentioned in the current **quiz topic**, **question**, or **fun fact**.
                  - Reasonable extensions of the current topic that children might be **curious** about.
      
                  Be **short**, **fun**, **non-repetitive**, and educational.
      
                  If the user says something friendly like "hi", "hello", or "hey", "what's your name" cheerfully answer any friendly questions and greet them back, then guide them back to the quiz. 
                  For example: "Hi there! So glad you’re here. Let’s keep going with our quiz! 🌟"
      
                  If the user says something like "how are you?", respond warmly and personally, then bring the focus back to the quiz. 
                  For example: "I'm doing great, thanks for asking! Now, let’s explore more from our quiz. 😊"
      
                  If the message is completely **unrelated** to the quiz topic, reply:
                  "Hmm, that question’s a bit off-track. Let’s keep exploring our quiz topic instead! 😊"
      
                  **Never answer anything inappropriate (e.g. violence, sexual content, inappropriate language, swear words, or politics).**
                  If you are unsure or cannot verify the answer, say "I'm not totally sure about that—maybe we can learn more together!😁" Do not guess or make up facts.`
      },      
      {
        role: "user",
        content: `The quiz category was: "${selectedCategory}"\nThe quiz question was:"${question.text}"\nThe correct answer was: "${question.answer}"\nThe fun fact fetched was: "${question.explanation}"
        \nThe language selected by the user was: "${language}"`,
      },
    ];

    //Trim max history to most recent 6 messages (3 turns)
    const MAX_HISTORY = 6;
    const trimmedHistory = history.slice(-MAX_HISTORY);
    const conversation = [...baseMessages, ...trimmedHistory, { role: "user", content: userMessage }];

    try {
      const response = await fetch("/.netlify/functions/budEChatbotReply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Hmm... I'm not sure! 🤔";

      return [...history, { role: "user", content: userMessage }, { role: "assistant", content: reply }];
    } catch (error) {
      return [
        ...history,
        { role: "user", content: userMessage },
        { role: "assistant", content: "Oops! Something went wrong. Try again?" },
      ];
    }
  };

  // Provide state and functions to all children components
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
        errorMessage,
        setErrorMessage,
        language,
        setLanguage,
        getBudEReply,
        answeredQuestions,
        setAnsweredQuestions,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
