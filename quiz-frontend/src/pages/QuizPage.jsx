import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestions, submitQuiz } from "../api";
import QuestionCard from "../components/QuestionCard";

export default function QuizPage() {
  const navigate = useNavigate();

  /* Quiz ID entry */
  const [quizId, setQuizId] = useState("");
  const [idError, setIdError] = useState("");

  /* Quiz state */
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});      // { questionId: selectedOption }
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");

  /* ── Load questions ── */
  const handleLoad = async (e) => {
    e.preventDefault();
    const id = parseInt(quizId, 10);
    if (!quizId.trim() || isNaN(id)) {
      setIdError("Please enter a valid numeric quiz ID.");
      return;
    }
    setLoading(true);
    setFetchError("");
    setQuestions([]);
    setAnswers({});

    try {
      const data = await getQuestions(id);
      if (!data || data.length === 0) {
        setFetchError("No questions found for this quiz ID.");
      } else {
        setQuestions(data);
      }
    } catch (err) {
      setFetchError(err.message || "Could not fetch questions. Check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Select answer ── */
  const handleSelect = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  /* ── Submit quiz ── */
  const handleSubmit = async () => {
    const payload = questions.map((q) => ({
      id: q.id,
      ansSub: answers[q.id] || "",
    }));

    setSubmitting(true);
    try {
      const score = await submitQuiz(payload);
      navigate("/result", { state: { score, total: questions.length } });
    } catch (err) {
      setFetchError(err.message || "Submission failed. Please try again.");
      setSubmitting(false);
    }
  };

  const answered = Object.keys(answers).length;
  const progress = questions.length ? (answered / questions.length) * 100 : 0;
  const allAnswered = questions.length > 0 && answered === questions.length;

  return (
    <main className="page">
      {/* Header */}
      <div className="animate-fade-up">
        <h1 className="section-heading">Take a Quiz</h1>
        <p className="section-subtext">Enter your quiz ID to load questions and start answering.</p>
      </div>

      {/* Quiz ID Input */}
      <div className="card glass animate-fade-up" style={{ animationDelay: "0.08s", padding: "1.5rem" }}>
        <form onSubmit={handleLoad} id="load-quiz-form">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="quiz-id-input">Quiz ID</label>
            <div className="quiz-id-section">
              <input
                id="quiz-id-input"
                type="number"
                className="form-input"
                placeholder="e.g. 1"
                value={quizId}
                onChange={(e) => { setQuizId(e.target.value); setIdError(""); }}
                style={{ flex: 1 }}
                min={1}
              />
              <button id="load-quiz-btn" type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                ) : "Load Quiz"}
              </button>
            </div>
            {idError && <p style={{ color: "var(--danger)", fontSize: "0.82rem", marginTop: "0.4rem" }}>{idError}</p>}
          </div>
        </form>
      </div>

      {/* Fetch error */}
      {fetchError && (
        <div className="alert alert-error animate-fade-in" style={{ marginTop: "1rem" }}>
          ⚠️ {fetchError}
        </div>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="spinner-wrap animate-fade-in">
          <div className="spinner" />
          <span>Loading questions...</span>
        </div>
      )}

      {/* Questions */}
      {questions.length > 0 && (
        <>
          {/* Progress */}
          <div className="animate-fade-up" style={{ margin: "1.5rem 0 1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {answered} of {questions.length} answered
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--accent-1)", fontWeight: 600 }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Cards */}
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i}
              selected={answers[q.id]}
              onSelect={handleSelect}
            />
          ))}

          {/* Submit */}
          <div className="animate-fade-up" style={{ marginTop: "1.5rem" }}>
            {!allAnswered && (
              <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
                ⚠️ Please answer all {questions.length} questions before submitting.
              </div>
            )}
            <button
              id="submit-quiz-btn"
              className="btn btn-success btn-full"
              onClick={handleSubmit}
              disabled={submitting || !allAnswered}
            >
              {submitting ? (
                <>
                  <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                  Submitting...
                </>
              ) : (
                `🏁 Submit Quiz (${answered}/${questions.length})`
              )}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
