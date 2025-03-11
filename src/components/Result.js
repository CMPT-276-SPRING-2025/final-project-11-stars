import { useContext } from "react";
import { QuizContext } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";

function Result() {
  const { score, questions } = useContext(QuizContext);
  const navigate = useNavigate();

  return (
    <div className="result">
      <h2>Your Score: {score} / {questions.length}</h2>
      <button onClick={() => navigate("/")}>Play Again</button>
    </div>
  );
}

export default Result;
