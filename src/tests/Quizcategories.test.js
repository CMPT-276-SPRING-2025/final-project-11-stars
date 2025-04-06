// __tests__/Quizcategories.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";
import QuizCategory from "../pages/Quizcategories";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("QuizCategory", () => {
  const setup = (contextOverrides = {}) => {
    const defaultContext = {
      setSelectedCategory: jest.fn(),
      difficulty: "",
      setDifficulty: jest.fn(),
      questionType: "text",
      setQuestionType: jest.fn(),
      language: "",
      setLanguage: jest.fn(),
    };

    return render(
      <MemoryRouter>
        <QuizContext.Provider value={{ ...defaultContext, ...contextOverrides }}>
          <QuizCategory />
        </QuizContext.Provider>
      </MemoryRouter>
    );
  };

  test("renders title", () => {
    setup();
    expect(screen.getByText("Quiz Categories")).toBeInTheDocument();
  });

  test("renders all category cards", () => {
    setup();
    const categoryBoxes = screen.getAllByRole("img");
    expect(categoryBoxes.length).toBe(11);
  });

  test("opens custom quiz popup on custom category click", () => {
    setup();
    const customBox = screen.getByAltText("Custom category icon");
    fireEvent.click(customBox);
    expect(screen.getByText("Create your own quiz with Bud-E!")).toBeInTheDocument();
  });

  test("opens regular quiz popup on non-custom category click", () => {
    setup();
    const generalBox = screen.getByAltText("General category icon");
    fireEvent.click(generalBox);
    expect(screen.getByText("General Quiz")).toBeInTheDocument();
  });

  test("shows error popup if difficulty/language not selected", () => {
    setup();
    const generalBox = screen.getByAltText("General category icon");
    fireEvent.click(generalBox);
    fireEvent.click(screen.getByText("Start Quiz"));
    expect(screen.getByText(/Please choose your difficulty!/i)).toBeInTheDocument();
  });

  test("toggles between text and image quiz", () => {
    const setQuestionTypeMock = jest.fn();
    setup({ setQuestionType: setQuestionTypeMock, questionType: "text" });
    const toggle = screen.getByRole("checkbox");
    fireEvent.click(toggle);
    expect(setQuestionTypeMock).toHaveBeenCalledWith("image");
  });

  test("custom quiz shows error if fields missing", () => {
    setup();
    const customBox = screen.getByAltText("Custom category icon");
    fireEvent.click(customBox);
    fireEvent.click(screen.getByText("Start Quiz"));
    expect(screen.getByText(/Please choose a topic and a language!/i)).toBeInTheDocument();
  });
});