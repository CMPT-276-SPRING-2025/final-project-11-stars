// Quizpage.test.js
// This test suite checks how the quiz page behaves from a user's point of view.
// It makes sure questions show up, answers trigger the right feedback, and navigation works smoothly.
// We also mock things like sound effects, confetti, and API calls to focus just on user interaction.


import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import QuizPage from "../pages/Quizpage";
import { QuizContext } from "../context/QuizContext";
import { MemoryRouter } from "react-router-dom";

jest.mock("canvas-confetti", () => jest.fn());

jest.mock("react-router-dom", () => {
  const mockNavigate = jest.fn();
  const originalModule = jest.requireActual("react-router-dom");

  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: "/quiz",
      search: "",
      hash: "",
      state: null,
      key: "default",
    }),
  };
});

const mockNavigate = require("react-router-dom").useNavigate();

describe("Quizpage", () => {
  const setup = (customProps = {}) => {
    const defaultContext = {
      score: 0,
      setScore: jest.fn(),
      questions: [
        {
          text: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          answer: "4",
          explanation: null,
        },
      ],
      currentQuestion: 0,
      setCurrentQuestion: jest.fn(),
      getExplanation: jest.fn().mockResolvedValue("Test Explanation"),
      loading: false,
      questionType: "text",
      errorMessage: null,
      getBudEReply: jest.fn().mockResolvedValue([
        { role: "user", content: "What is gravity?" },
        { role: "assistant", content: "Gravity is the force that pulls..." },
      ]),
      setAnsweredQuestions: jest.fn(),
      resetQuiz: jest.fn(),
    };

    return render(
      <MemoryRouter initialEntries={["/quiz"]}>
        <QuizContext.Provider value={{ ...defaultContext, ...customProps }}>
          <QuizPage />
        </QuizContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    global.performance.getEntriesByType = jest.fn(() => [{ type: "navigate" }]);

    const mockAudioElement = {
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn(),
      load: jest.fn(),
    };

    const originalUseRef = React.useRef;
    jest.spyOn(React, "useRef").mockImplementation((initialValue) => {
      if (initialValue === null) {
        return { current: mockAudioElement };
      }
      return originalUseRef(initialValue);
    });

    window.HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("displays loading screen when loading is true", () => {
    setup({ loading: true });
    expect(
      screen.getByText(/planting some fun questions/i)
    ).toBeInTheDocument();
  });

  test("shows error message when errorMessage is present", () => {
    setup({ errorMessage: "Something broke!" });
    expect(screen.getByText("Something broke!")).toBeInTheDocument();
    fireEvent.click(screen.getByText(/back to home/i));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("handles correct answer and shows explanation", async () => {
    const mockSetScore = jest.fn();
    const mockSetAnsweredQuestions = jest.fn();

    setup({
      setScore: mockSetScore,
      setAnsweredQuestions: mockSetAnsweredQuestions,
    });

    expect(screen.getByText(/what is 2 \+ 2/i)).toBeInTheDocument();
    const correctOption = screen.getByText("4");

    fireEvent.click(correctOption);

    await waitFor(() => {
      expect(mockSetScore).toHaveBeenCalledWith(expect.any(Function));
      expect(screen.getByText("Correct!")).toBeInTheDocument();
    });

    expect(mockSetAnsweredQuestions).toHaveBeenCalled();
  });

  test("handles incorrect answer", async () => {
    setup();
    const incorrectOption = screen.getByText("3");
    fireEvent.click(incorrectOption);

    expect(await screen.findByText("Incorrect!")).toBeInTheDocument();
  });

  test("navigates to result when Finish Quiz is clicked", () => {
    setup();
    fireEvent.click(screen.getByText("Finish Quiz"));
    expect(mockNavigate).toHaveBeenCalledWith("/result");
  });
});