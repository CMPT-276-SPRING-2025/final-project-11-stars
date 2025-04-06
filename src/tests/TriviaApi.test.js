import { getTriviaQuestions } from '../utils/triviaApi.js';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('fetches trivia questions successfully', async () => {
  const mockData = [{ question: "What's 2+2?", answer: "4" }];
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockData,
  });

  const data = await getTriviaQuestions('general_knowledge', 'easy', 'en');
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining('general_knowledge'));
  expect(data).toEqual(mockData);
});

test('throws error on failed trivia API call', async () => {
  fetch.mockResolvedValueOnce({ ok: false });

  await expect(
    getTriviaQuestions('science', 'hard', 'en')
  ).rejects.toThrow('Failed to fetch trivia questions');
});