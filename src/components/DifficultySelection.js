import { useNavigate } from "react-router-dom";

function DifficultySelection({ setDifficulty }) {
  const navigate = useNavigate();

  return (
    <div className="difficulty-selection">
      <h2>Select Difficulty</h2>
      <button onClick={() => { setDifficulty("easy"); navigate("/quiz"); }}>Easy</button>
      <button onClick={() => { setDifficulty("hard"); navigate("/quiz"); }}>Hard</button>
      <button onClick={() => { setDifficulty("advanced"); navigate("/quiz"); }}>Advanced</button>
    </div>
  );
}

export default DifficultySelection;
