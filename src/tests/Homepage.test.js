import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "../pages/Homepage";

// Mock the RobotViewer component
jest.mock("../RobotViewer.jsx", () => () => (
  <iframe title="Bud-E Animation" />
));

// Mock the QuizCategory component
jest.mock("../pages/Quizcategories", () => () => (
  <div>Mocked QuizCategory</div>
));

describe("HomePage", () => {
  test("renders main heading", () => {
    render(<HomePage />);
    expect(screen.getByText(/BrainGoated/i)).toBeInTheDocument();
  });

  test("renders Bud-E iframe", () => {
    render(<HomePage />);
    expect(screen.getByTitle(/Bud-E Animation/i)).toBeInTheDocument();
  });

  test("renders tagline", () => {
    render(<HomePage />);
    expect(
      screen.getByText(/Water your curiosity, Watch it grow!/i)
    ).toBeInTheDocument();
  });

  test("renders QuizCategory component", () => {
    render(<HomePage />);
    expect(screen.getByText(/Mocked QuizCategory/i)).toBeInTheDocument();
  });
});
