// Relative path — Vite dev proxy forwards /quiz/* → http://localhost:8081/quiz/*
const BASE_URL = "/quiz";

/**
 * Create a new quiz
 * POST /quiz/create
 * Body: { title, noOfQuestion, category }
 */
export async function createQuiz(data) {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.text(); // returns a plain string message
}

/**
 * Get questions for a quiz by quiz id
 * GET /quiz/questions?id={id}
 */
export async function getQuestions(quizId) {
  const res = await fetch(`${BASE_URL}/questions?id=${quizId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // returns List<ResponseModel>
}

/**
 * Submit answers and get score
 * GET /quiz/result
 * Body: List<{ id, ansSub }>
 */
export async function submitQuiz(answers) {
  const res = await fetch(`${BASE_URL}/result`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // returns Integer (score)
}
