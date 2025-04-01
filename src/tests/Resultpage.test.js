import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ResultPage from "../pages/Resultpage";
import { QuizContext } from "../context/QuizContext";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock the FloatingRobot component
jest.mock("../FloatingRobot", () => () => (
  <img src="/bud-e.png" alt="Bud-E" />
));

describe("ResultPage", () => {
  const mockResetQuiz = jest.fn();

  const renderWithContext = (score = 8) => {
    return render(
      <QuizContext.Provider value={{ score, resetQuiz: mockResetQuiz }}>
        <MemoryRouter>
          <ResultPage />
        </MemoryRouter>
      </QuizContext.Provider>
    );
  };

  test("displays the correct score", () => {
    renderWithContext(9);
    expect(screen.getByText(/Score: 9\/10/i)).toBeInTheDocument();
  });

  test("displays the congratulatory message", () => {
    renderWithContext();
    expect(
      screen.getByText(/Congratulations! You are officially BrainGoated!/i)
    ).toBeInTheDocument();
  });

  test("displays Bud-E image from FloatingRobot", () => {
    renderWithContext();
    const image = screen.getByAltText(/Bud-E/i);
    expect(image).toBeInTheDocument();
    expect(image.getAttribute("src")).toBe("/bud-e.png");
  });

  test("clicking the go back button resets quiz and navigates home", () => {
    renderWithContext();
    const button = screen.getByText(/Go back to Quiz Categories/i);
    fireEvent.click(button);

    expect(mockResetQuiz).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
