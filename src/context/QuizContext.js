import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [language, setLanguage] = useState("en");
  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState("text");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  const TRIVIA_API_KEY = process.env.REACT_APP_TRIVIA_API_KEY;

  const resetQuiz = () => {
    setScore(0);
    setSelectedCategory(null);
    setDifficulty("easy");
    setQuestions([]);
    setQuestionType("text");
    setCurrentQuestion(0);
    setErrorMessage(null);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedCategory) return;
      setLoading(true);
      setErrorMessage(null);

      try {
        if (selectedCategory.id === "custom_ai_quiz") {
          const topic = selectedCategory.topic.toLowerCase();

          const blocklist = [
            "sex", "sexual", "porn", "porno", "pornography", "nude", "nudity", "naked", "strip", "fetish",
            "erotic", "kamasutra", "condom", "intercourse", "masturbate", "masturbation", "orgasm", "ejaculation",
            "dildo", "vibrator", "anal", "vaginal", "genital", "genitals", "penis", "vagina", "boobs", "breasts",
            "nipples", "hentai", "bdsm", "xxx", "blowjob", "handjob", "threesome", "incest", "pedophile", "pedophilia",
            "rape", "molest", "molestation", "abuse", "assault", "kill", "murder", "suicide", "torture", "violence",
            "drug", "drugs", "cocaine", "heroin", "meth", "weed", "marijuana", "lsd", "ecstasy", "overdose",
            "alcohol", "beer", "vodka", "whiskey", "gin", "champagne", "rum", "intoxicated", "hangover", "cigarette", "smoking",
            "fuck", "shit", "bitch", "bastard", "slut", "whore", "asshole", "dick", "pussy", "cock", "cunt",
            "goddamn", "damn", "hell", "retard", "racist", "nazism", "terrorist", "terrorism", "bomb", "gun", "shoot",
          ];
          const hasBadWord = blocklist.some((word) => topic.includes(word));
          if (hasBadWord) {
            console.warn(`🚫 Blocked topic due to blocklist: "${topic}"`);
            setErrorMessage("⚠️ This topic isn't suitable for a trivia quiz. Please choose another.");
            setQuestions([]);
            setLoading(false);
            return;
          }

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
                    "You are a trivia quiz generator for a school-friendly quiz app. 'Easy', 'Medium', and 'Hard' describe the academic difficulty — not the content’s safety. Only reject the topic if it's clearly inappropriate (e.g. adult content, drugs, violence). Topics like biology, math, or history are always appropriate.",
                },

                {
                  role: "user",
                  content: `Create 10 unique trivia questions for teenagers on the topic "${selectedCategory.topic}" with "${difficulty}" difficulty in the language "${language}".
                Each question must be written in "${language}" and returned as an object in this format:
                {
                  "question": "What is the capital of France?",
                  "options": ["Berlin", "Paris", "London", "Rome"],
                  "correctAnswer": "Paris"
                }
                Return only: { "questions": [ ... ] } or { "status": "REJECTED" }`,
                },
                
              ],
              max_tokens: 1000,
            }),
          });

          const data = await response.json();
          let rawContent = data.choices?.[0]?.message?.content?.trim();
          if (rawContent.startsWith("```")) {
            rawContent = rawContent.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, "$1").trim();
          }

          let aiQuestions;
          try {
            const parsed = JSON.parse(rawContent);
            if (parsed.status === "REJECTED") {
              console.warn(`❌ GPT rejected topic as inappropriate: "${topic}"`);
              setErrorMessage("⚠️ This topic isn't available for a quiz. Please try a different one.");
              setQuestions([]);
              setLoading(false);
              return;
            }
            aiQuestions = parsed.questions;
          } catch (err) {
            console.error("Failed to parse AI JSON:", rawContent);
            setQuestions([]);
            setErrorMessage("⚠️ Failed to understand the quiz content. Please try another topic.");
            setLoading(false);
            return;
          }

          const formatted = aiQuestions
            .map((q) => {
              const correct = q.correctAnswer;
              const options = q.options || [];
              if (!correct || !options.includes(correct)) {
                console.warn("⚠️ Skipping question due to invalid format:", q);
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

          setQuestions(formatted);
          console.log(`✅ Topic accepted: "${topic}" — ${formatted.length} questions generated.`);
        } else {
          const params = {
            categories: selectedCategory.categoryName,
            difficulty: difficulty,
            limit: 10,
            types: questionType === "image" ? "image_choice" : "text_choice",
            ...(language !== "en" && { language }), // ✅ Only include language param if NOT English
          };

          const response = await axios.get("https://the-trivia-api.com/v2/questions", {
            headers: {
              "X-API-Key": TRIVIA_API_KEY,
            },
            params,
          });

          const formattedQuestions = response.data.map((question) => {
            if (questionType === "image") {
              const flattenedIncorrect = question.incorrectAnswers.flat();
              const allOptions = [...flattenedIncorrect, ...question.correctAnswer];

              const uniqueOptions = Array.from(
                new Map(allOptions.map((item) => [item.description, item])).values()
              );

              const shuffledOptions = uniqueOptions.sort(() => Math.random() - 0.5);

              return {
                text: question.question.text,
                options: shuffledOptions,
                answer: question.correctAnswer[0].description,
                explanation: null,
              };
            } else {
              return {
                text: question.question.text,
                options: [...question.incorrectAnswers, question.correctAnswer].sort(() => Math.random() - 0.5),
                answer: question.correctAnswer,
                explanation: null,
              };
            }
          });

          setQuestions(formattedQuestions);
        }
      } catch (error) {
        console.error("❌ Error fetching questions:", error);
        setQuestions([]);
        setErrorMessage("⚠️ Something went wrong while fetching quiz questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedCategory, difficulty, questionType, language, OPENAI_API_KEY, TRIVIA_API_KEY]);

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
              content: `You are a multilingual trivia fact explainer for kids and teens (ages 8–16). Respond with fun, short facts in the user's selected language. Include 1 relevant emoji.`,
            },
            {
              role: "user",
              content: `Give a short, kid-friendly fun fact in **${language}** related to this trivia question and answer (max 1 sentence):\n\nQ: ${question.text}\nA: ${question.answer}`,
            },
          ],
          max_tokens: 60,
          temperature: 0.7,
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
      console.error("❌ Error fetching fun fact:", error);
    }
  };

  const getBudEReply = async(userMessage, history = []) =>
  {
    const question = questions[currentQuestion]; 
    // Check if current question exists
    if(!question) return[];
    const baseMessages = [
      {
        role: "system",
        content: `You are Bud-E, a friendly robot who explains quiz topics to kids (ages 8-14) in a fun, short, simple way.`,
      },
      {
        role: "user",
        content: `The quiz question was:"${question.text}"\nThe correct answer was: "${question.answer}"\nThe fun fact fetched for the question was: "${question.explanation}"`,
      },
    ];

    const conversation = [
      ...baseMessages,
      ...history,
      {role: "user", content: userMessage},
    ];

    try{
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            temperature: 0.8,
            messages: conversation,
            max_tokens: 150,
          }),
        });
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "Hmm... I'm not sure! 🤔";

        return[
          ...history,
          
          {role: "user", content: userMessage },
          {role: "assistant", content:reply},
        ];
    }catch(error){
      console.error("Error in Bud-E chat:", error);
      return[
        ...history,
        {role: "user", conten: userMessage },
        {role: "assistant", content:"Oops! Something went wrong. Try again?"},
      ];
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
        errorMessage,
        setErrorMessage,
        language,
        setLanguage,
        getBudEReply,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};