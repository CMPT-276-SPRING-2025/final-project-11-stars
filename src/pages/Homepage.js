import React from 'react';
import QuizCategory from './Quizcategories';
import './Homepage.css';
import RobotViewer from "../RobotViewer.jsx";

const HomePage = () => {
  return (
    <div className="landing-page">
      <h1 className="main-heading">BrainGoated</h1>

      <div className="robot-3d-wrapper">
        <RobotViewer />
      </div>

      <p className="tagline">Water your curiosity, Watch it grow!</p>
      <div className="quiz-category-space"></div>

      <QuizCategory />
    </div>
  );
};

export default HomePage;
