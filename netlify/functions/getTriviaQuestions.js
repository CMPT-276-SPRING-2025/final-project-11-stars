// This serverless function securely fetches 10 trivia questions from The Trivia API based on selected category, difficulty, language, and type (text or image).
// It uses an API key stored in environment variables and returns the questions to the frontend.

const axios = require("axios");

exports.handler = async (event, context) => {
    try {
        const { categoryName, difficulty, questionType, language } = JSON.parse(event.body);

        const params = {
            categories: categoryName,
            difficulty: difficulty,
            limit: 10,
            types: questionType === "image" ? "image_choice" : "text_choice",
            ...(language !== "en" && { language }),
          };
      
          const response = await axios.get("https://the-trivia-api.com/v2/questions", {
            headers: {
              "X-API-Key": process.env.TRIVIA_API_KEY,
            },
            params,
          });
      
          return {
            statusCode: 200,
            body: JSON.stringify(response.data),
          };
        } catch (error) {
          return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error fetching trivia questions" }),
          };
        }
};


