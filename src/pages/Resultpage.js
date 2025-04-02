import React, { useContext, useState } from "react";
import { QuizContext } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";
import "./Resultpage.css";

const ResultPage = () => {
  const navigate = useNavigate();
  const { score, resetQuiz, answeredQuestions } = useContext(QuizContext);
  const [filter, setFilter] = useState("all");

  const getFilteredQuestions = () => {
    if (filter === "correct") {
      return answeredQuestions.filter((q) => q.isCorrect);
    } else if (filter === "incorrect") {
      return answeredQuestions.filter((q) => !q.isCorrect);
    }
    return answeredQuestions;
  };

  const filtered = getFilteredQuestions();

  const parseAnswer = (answer) => {
    // Try to parse stringified objects
    if (typeof answer === "string") {
      try {
        const parsed = JSON.parse(answer);
        return parsed;
      } catch (err) {
        return answer;
      }
    }
    return answer;
  };

  const renderAnswer = (answer) => {
    const parsed = parseAnswer(answer);
    if (parsed && typeof parsed === "object" && parsed.url) {
      return (
        <img
          src={parsed.url}
          alt={parsed.description || "Answer image"}
          className="result-thumbnail"
        />
      );
    }
    return <span>{parsed}</span>;
  };

  return (
    <div className="result-container">
      <h1 className="score-message">Score: {score}/10</h1>
      <p className="result-info">
        {score <= 4
          ? "Great effort! Every mistake is a step towards learning! 😊"
          : score < 8
          ? "You are improving! Keep up the good work! 💪"
          : "Congratulations! You are officially BrainGoated! 😎"}
      </p>

      <div className="filter-buttons">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
        <button onClick={() => setFilter("correct")} className={filter === "correct" ? "active" : ""}>Correct</button>
        <button onClick={() => setFilter("incorrect")} className={filter === "incorrect" ? "active" : ""}>Incorrect</button>
      </div>

      <h2 className="section-title">Questions Answered</h2>

      <div className="review-section">
        {filtered.map((q, index) => (
          <div key={index} className={`review-card ${q.isCorrect ? "correct" : "incorrect"}`}>
            <p><strong>Q{index + 1}:</strong> {q.question}</p>
            <div className="answer-pair">
              <div>
                <strong>Your Answer:</strong><br />
                {renderAnswer(q.selectedAnswer)}
              </div>
              {!q.isCorrect && (
                <div>
                  <strong>Correct Answer:</strong><br />
                  {renderAnswer(q.correctAnswer)}
                </div>
              )}
            </div>
            {q.explanation && (
              <p className="explanation"><em>{q.explanation}</em></p>
            )}
          </div>
        ))}
      </div>

      <div className="result-buttons spaced-bottom">
        <button
          className="go-back-button"
          onClick={() => {
            resetQuiz();
            navigate("/");
          }}
        >
          Go back to Quiz Categories
        </button>
      </div>
    </div>
  );
};

export default ResultPage;