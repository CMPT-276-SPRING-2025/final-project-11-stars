const fetch = require("node-fetch");

exports.handler = async(event, context) =>{
    try{
        const apiKey = process.env.OPENAI_API_KEY
        const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
            model: "gpt-3.5-turbo",
            temperature: 0.9,
            messages: [
                {
                role: "system",
                content: `You are a trivia quiz generator for a school-friendly quiz app for teenagers (ages 10–16). Only reject if the topic is clearly inappropriate (e.g., porn, drugs, violence).`,
                },
                {
                role: "user",
                content: `Please generate ${remaining} unique trivia questions for teenagers on the topic: "${selectedCategory.topic}". Use the difficulty: "${difficulty}" and language: "${language}". Format: { "question": "...", "options": ["..."], "correctAnswer": "..." }. Return only { "questions": [...] } or { "status": "REJECTED" }.`,
                },
            ],
            max_tokens: 2500,
            }),
        });
        const data = await openAiResponse.json();

        return {
        statusCode: 200,
        body: JSON.stringify(data),
        };
    }catch (error){
        return {
        statusCode: 500,
        body: JSON.stringify({ error: "Error generating AI questions" }),
        };
    }
};
