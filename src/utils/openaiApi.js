export const getExplanation = async (questionIndex, questions) => {
    const prompt = `Explain why "${questions[questionIndex].answer}" is the correct answer to: "${questions[questionIndex].text}"`;
    const res = await fetch("/api/explanation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
  
    const data = await res.json();
    return data.explanation;
  };