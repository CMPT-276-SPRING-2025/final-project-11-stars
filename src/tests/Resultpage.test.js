import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ResultPage from "../pages/Resultpage";
import { QuizContext } from "../context/QuizContext";
import { MemoryRouter } from "react-router-dom";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

beforeAll(() => {
  window.HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue();
});

const renderWithContext = (contextValue) => {
  return render(
    <QuizContext.Provider value={contextValue}>
      <MemoryRouter>
        <ResultPage />
      </MemoryRouter>
    </QuizContext.Provider>
  );
};

describe("ResultPage", () => {
  it("displays score and default messages", () => {
    const contextValue = {
      score: 2,
      resetQuiz: jest.fn(),
      questions: [{}, {}, {}],
      answeredQuestions: [
        {
          question: "What is 2 + 2?",
          selectedAnswer: "4",
          correctAnswer: "4",
          isCorrect: true,
        },
        {
          question: "Capital of India?",
          selectedAnswer: "Mumbai",
          correctAnswer: "New Delhi",
          isCorrect: false,
        },
        {
          question: "Largest planet?",
          selectedAnswer: "Jupiter",
          correctAnswer: "Jupiter",
          isCorrect: true,
        },
      ],
    };

    renderWithContext(contextValue);

    expect(screen.getByText("Score: 2/3")).toBeInTheDocument();
    expect(screen.getByText(/You are improving/i)).toBeInTheDocument();
  });

  it("shows 'BrainGoated' message for high score", () => {
    const contextValue = {
      score: 4,
      resetQuiz: jest.fn(),
      questions: [{}, {}, {}, {}, {}],
      answeredQuestions: [
        { isCorrect: true }, { isCorrect: true }, { isCorrect: true }, { isCorrect: true }, { isCorrect: false },
      ],
    };

    renderWithContext(contextValue);

    expect(screen.getByText(/BrainGoated/i)).toBeInTheDocument();
  });

  it("renders no answers placeholder if none answered", () => {
    const contextValue = {
      score: 0,
      resetQuiz: jest.fn(),
      questions: [{}, {}, {}],
      answeredQuestions: [],
    };

    renderWithContext(contextValue);

    expect(
      screen.getByText(/You didn't answer any questions/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Back to Categories/i })).toBeInTheDocument();
  });

  it("renders answered questions and filters", () => {
    const contextValue = {
      score: 2,
      resetQuiz: jest.fn(),
      questions: [{}, {}, {}],
      answeredQuestions: [
        {
          question: "What is 2 + 2?",
          selectedAnswer: "4",
          correctAnswer: "4",
          isCorrect: true,
          explanation: "Simple addition.",
        },
        {
          question: "What is the capital of France?",
          selectedAnswer: "Berlin",
          correctAnswer: "Paris",
          isCorrect: false,
          explanation: "Paris is the capital of France.",
        },
      ],
    };

    renderWithContext(contextValue);

    expect(screen.getByText("Questions Answered")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Correct"));
    expect(screen.getByText(/What is 2 \+ 2/i)).toBeInTheDocument();
    expect(screen.queryByText(/capital of France/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Incorrect"));
    expect(screen.queryByText(/2 \+ 2/)).not.toBeInTheDocument();
    expect(screen.getAllByText(/capital of France/i).length).toBeGreaterThan(0);
  });

  it("calls resetQuiz and navigate on 'Go back' click", () => {
    const mockReset = jest.fn();
    const contextValue = {
      score: 1,
      resetQuiz: mockReset,
      questions: [{}, {}, {}],
      answeredQuestions: [
        {
          question: "Test Q?",
          selectedAnswer: "A",
          correctAnswer: "B",
          isCorrect: false,
        },
      ],
    };

    renderWithContext(contextValue);

    fireEvent.click(screen.getByText(/Go back to Quiz Categories/i));
    expect(mockReset).toHaveBeenCalled();
    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });
});
