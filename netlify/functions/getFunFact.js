const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  try {
    // Parse the incoming POST body
    const { questionText, correctAnswer, language } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;

    // Call OpenAI API
    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 60,
        messages: [
          {
            role: "system",
            content:
              "You are a multilingual trivia fact explainer for kids and teens (ages 8–15). Respond with fun, short facts in the user's selected language. Include 1 relevant emoji.",
          },
          {
            role: "user",
            content: `Give a short, fun, and non-repetitive fact in **${language}** that is related to this trivia question and answer. It should not repeat the question or the answer but provide something new or surprising. Keep it light and fun (max 1 sentence) with a relevant emoji. Trivia Question: ${questionText} Correct Answer: ${correctAnswer}`,
          },
        ],
      }),
    });

    const data = await openAiResponse.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error generating explanation." }),
    };
  }
};