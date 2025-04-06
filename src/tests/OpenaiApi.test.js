import { getExplanation } from '../utils/openaiApi';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('returns explanation from OpenAI endpoint', async () => {
  fetch.mockResolvedValueOnce({
    json: async () => ({ explanation: "Paris is the capital of France." }),
  });

  const questions = [
    { text: "What is the capital of France?", answer: "Paris" },
  ];
  const result = await getExplanation(0, questions);
  expect(fetch).toHaveBeenCalledWith("/api/explanation", expect.anything());
  expect(result).toBe("Paris is the capital of France.");
});

test('handles error response gracefully', async () => {
  fetch.mockResolvedValueOnce({
    json: async () => ({}),
  });

  const questions = [
    { text: "What is the capital of France?", answer: "Paris" },
  ];
  const result = await getExplanation(0, questions);
  expect(result).toBe(undefined); // depends on your fallback
});