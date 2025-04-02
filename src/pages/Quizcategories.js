import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from "../context/QuizContext";
import './Quizcategories.css';

const categories = [
  { name: 'General', categoryName: 'general_knowledge', image: '/general_knowledge.svg', alt_text: 'General category icon' },
  { name: 'Culture', categoryName: 'society_and_culture', image: '/culture.svg', alt_text: 'Culture category icon' },
  { name: 'Geography', categoryName: 'geography', image: '/geography.svg', alt_text: 'Geography category icon' },
  { name: 'Literature', categoryName: 'arts_and_literature', image: '/literature.svg', alt_text: 'Literature category icon' },
  { name: 'Food', categoryName: 'food_and_drink', image: '/food.svg', alt_text: 'Food category icon ' },
  { name: 'Film & TV', categoryName: 'film_and_tv', image: '/film_and_tv.svg', alt_text: 'Film and TV category ' },
  { name: 'Music', categoryName: 'music', image: '/music.svg', alt_text: 'Music category icon' },
  { name: 'Sports', categoryName: 'sport_and_leisure', image: '/sports.svg', alt_text: 'Sports category icon' },
  { name: 'Science', categoryName: 'science', image: '/science.svg', alt_text: 'Science category icon' },
  { name: 'History', categoryName: 'history', image: '/history.svg', alt_text: 'History category icon' },
  { name: 'Custom', categoryName: 'custom_ai_quiz', image: '/custom.svg', alt_text: 'Custom category icon' }
];

const triviaApiLanguages = [
  { code: "en", label: "🇺🇸 English" },
  { code: "fr", label: "🇫🇷 French" },
  { code: "es", label: "🇪🇸 Spanish" },
  { code: "nl", label: "🇳🇱 Dutch" },
  { code: "hi", label: "🇮🇳 Hindi" },
  { code: "tr", label: "🇹🇷 Turkish" },
  { code: "de", label: "🇩🇪 German" },
];

const customLanguages = [
  { code: "en", label: "🇺🇸 English" },
  { code: "ar", label: "🇸🇦 Arabic" },
  { code: "bn", label: "🇧🇩 Bengali" },
  { code: "zh", label: "🇨🇳 Chinese" },
  { code: "nl", label: "🇳🇱 Dutch" },
  { code: "fa", label: "🇮🇷 Persian" },
  { code: "fr", label: "🇫🇷 French" },
  { code: "de", label: "🇩🇪 German" },
  { code: "hi", label: "🇮🇳 Hindi" },
  { code: "id", label: "🇮🇩 Indonesian" },
  { code: "it", label: "🇮🇹 Italian" },
  { code: "ja", label: "🇯🇵 Japanese" },
  { code: "ko", label: "🇰🇷 Korean" },
  { code: "pl", label: "🇵🇱 Polish" },
  { code: "pt", label: "🇵🇹 Portuguese" },
  { code: "ro", label: "🇷🇴 Romanian" },
  { code: "ru", label: "🇷🇺 Russian" },
  { code: "es", label: "🇪🇸 Spanish" },
  { code: "tr", label: "🇹🇷 Turkish" },
  { code: "uk", label: "🇺🇦 Ukrainian" },
  { code: "vi", label: "🇻🇳 Vietnamese" },
];

const QuizCategory = () => {
  const {
    setSelectedCategory,
    difficulty,
    setDifficulty,
    questionType,
    setQuestionType,
    language,
    setLanguage,
  } = useContext(QuizContext);

  const [quizDisplayName, setQuizDisplayName] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [customDifficulty, setCustomDifficulty] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [customLanguage, setCustomLanguage] = useState(language);
  const [errorMessage, setErrorMessage] = useState("");


  const navigate = useNavigate();

  const handleDifficultyChange = (level) => setDifficulty(level);
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleCustomLanguageChange = (e) => setCustomLanguage(e.target.value);
  const handleToggle = () => setQuestionType(questionType === "text" ? "image" : "text");

  const handleCategoryClick = (category) => {
    if (category.categoryName === "custom_ai_quiz") {
      setShowCustomPopup(true);
      setShowPopup(false);
    } else {
      setSelectedCategory({ id: category.categoryName, categoryName: category.categoryName });
      setQuizDisplayName(category.name);
      setShowPopup(true);
      setShowCustomPopup(false);
    }
  };

  const handleStartQuiz = () => {
    if (!difficulty || !language) {
      setErrorMessage("Please choose your difficulty!");
      return;
    }
    navigate("/quiz");
  };
  

  const handleCustomStartQuiz = () => {
    if (!customDifficulty.trim() || !customTopic.trim() || !customLanguage.trim()) {
      setErrorMessage("Please choose a difficulty and a topic!");
      return;
    }
  
    setSelectedCategory({
      id: "custom_ai_quiz",
      topic: customTopic.trim(),
    });
    setDifficulty(customDifficulty.trim());
    setLanguage(customLanguage);
    setQuestionType("text");
    navigate("/quiz");
  };


  return (
    <div className="quiz-category-container">
      <h1 className="quiz-category-title">Quiz Categories</h1>

      <div className="toggle-difficulty-container">
        <div className="toggle-quiz-option">
          <div className="quiz-toggle">
            <span className={`quiz-option ${questionType === "text" ? 'active' : ''}`} onClick={() => setQuestionType("text")}>Text Quiz</span>
            <label className="switch">
              <input type="checkbox" checked={questionType === "image"} onChange={handleToggle} />
              <span className="slider"></span>
            </label>
            <span className={`quiz-option ${questionType === "image" ? 'active' : ''}`} onClick={() => setQuestionType("image")}>Image Quiz</span>
          </div>
        </div>

        <div className="difficulty-dropdown">
          <select
            className="difficulty-select"
            value={difficulty}
            onChange={(e) => handleDifficultyChange(e.target.value)}
          >
            <option value="" disabled>Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="language-dropdown">
          <select
            className="language-select"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="" disabled>Select Language</option>
            {triviaApiLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="quiz-category-grid">
        {categories.map((category, index) => (
          <div
            key={index}
            className="quiz-category-box"
            onClick={() => handleCategoryClick(category)}
          >
            <img src={category.image} alt={category.alt_text} className="category-image" />
            <p className="category-name">{category.name}</p>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="start-popup">
          <div className="start-popup-content">
            <img
              className="start-popup-close-btn"
              src="/crossbtn.png"
              alt="Close"
              onClick={() => {
                setSelectedCategory(null);
                setQuizDisplayName(null);
                setShowPopup(false);
                setCustomDifficulty("");
                setCustomTopic("");
                setCustomLanguage(language);
              }}
            />
            <h2>{quizDisplayName} Quiz</h2>
            <button className="start-quiz-btn" onClick={handleStartQuiz}>Start Quiz</button>
          </div>
        </div>
      )}

      {showCustomPopup && (
        <div className="custom-quiz-popup">
          <div className="custom-quiz-popup-content">
            <img className="popup-close-btn" src="/crossbtn.png" alt="Close" onClick={() => setShowCustomPopup(false)} />
            <div className="custom-title-block">
              <iframe
                src="/BudE_animation.html"
                title="Bud-E Animation"
                className="bud-e-frame"
              />
              <h2 className="custom-quiz-title">Create your own quiz with Bud-E!</h2>
            </div>


            <div className="custom-quiz-inputs">
              <div className="input-wrapper">
                <label className="input-label">Difficulty</label>
                <div className="difficulty-dropdown">
                  <select
                    value={customDifficulty}
                    onChange={(e) => setCustomDifficulty(e.target.value)}
                  >
                    <option value="" disabled>Select Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="input-wrapper">
                <label id="quiz-topic-label" className="input-label">Topic</label>

                <input
                  id="quiz-topic"
                  type="text"
                  placeholder="Quiz Topic"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                />
              </div>

              <div className="input-wrapper">
                <label className="input-label">Language</label>
                <div className="language-dropdown">
                  <select
                    value={customLanguage}
                    onChange={handleCustomLanguageChange}
                  >
                    <option value="" disabled>Select Language</option>
                    {customLanguages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button className="start-quiz-btn" onClick={handleCustomStartQuiz}>Start Quiz</button>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="error-popup-overlay">
          <div className="error-popup">
            <p>{errorMessage}</p>
            <span
              onClick={() => {
                setErrorMessage("");
                setShowPopup(false);
                setShowCustomPopup(false);
                setQuizDisplayName(null);
              }}
            >
              Back
            </span>
          </div>
        </div>
      )}

    </div>
  );
};

export default QuizCategory;
