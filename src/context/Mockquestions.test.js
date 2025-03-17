import { QuizContext } from "../context/QuizContext"; //import global state

test('mock data should contain questions with correct structure', () => {
  expect(Array.isArray(mockQuestions)).toBe(true); // Ensure it's an array

  mockQuestions.forEach(question => {
    expect(question).toHaveProperty('category');
    expect(question).toHaveProperty('difficulty');
    expect(question).toHaveProperty('question');
    expect(question).toHaveProperty('options');
    expect(question).toHaveProperty('correctAnswer');
    expect(question).toHaveProperty('funFact');
  });
});

test('mock data should have at least one question', () => {
  expect(mockQuestions.length).toBeGreaterThan(0);
});

test('first question should be about water', () => {
  expect(mockQuestions[0].question).toBe("What is the chemical symbol for water?");
  expect(mockQuestions[0].correctAnswer).toBe("H2O");
});