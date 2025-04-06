// utils/triviaApi.js
export const getTriviaQuestions = async (category, difficulty, language) => {
    const url = `https://the-trivia-api.com/api/questions?categories=${category}&difficulty=${difficulty}&limit=5&region=IN&language=${language}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch trivia questions");
    return res.json();
  };