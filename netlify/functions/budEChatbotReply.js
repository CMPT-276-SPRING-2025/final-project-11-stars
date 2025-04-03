const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  try {
    // Expect a JSON body with the conversation array
    const { conversation } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;

    // Call OpenAI API using secure key on the server
    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        temperature: 0.8,
        max_tokens: 300,
        messages: conversation,
      }),
    });

    const data = await openAiResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Bud-E chat failed." }),
    };
  }
};
