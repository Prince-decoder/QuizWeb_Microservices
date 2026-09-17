import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../api";

const CATEGORIES = [
  "Java", "Python", "JavaScript", "DSA", "Database",
  "Operating Systems", "Networking", "Machine Learning",
];

const DIFFICULTY_TIPS = {
  Easy: "Good for beginners — straightforward conceptual questions.",
  Medium: "Balanced challenge for intermediate learners.",
  Hard: "Advanced topics — brace yourself!",
};

export default function CreateQuizPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    noOfQuestion: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "noOfQuestion" ? Number(value) : value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Quiz title is required.");
    if (!form.category) return setError("Please select a category.");
    if (form.noOfQuestion < 1 || form.noOfQuestion > 50)
      return setError("Number of questions must be between 1 and 50.");

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const msg = await createQuiz(form);
      setSuccess(`✅ ${msg || "Quiz created successfully!"}`);
      setForm({ title: "", category: "", noOfQuestion: 5 });
    } catch (err) {
      setError(err.message || "Failed to create quiz. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="animate-fade-up">
        <h1 className="section-heading">Create a New Quiz</h1>
        <p className="section-subtext">
          Configure your quiz parameters and let the backend generate it instantly.
        </p>
      </div>

      <div className="card glass animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && (
          <div className="alert alert-success">
            {success}
            <button
              className="btn btn-outline"
              style={{ marginLeft: "auto", padding: "4px 12px", fontSize: "0.82rem" }}
              onClick={() => navigate("/quiz")}
            >
              Take a Quiz →
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} id="create-quiz-form">
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="quiz-title">Quiz Title</label>
            <input
              id="quiz-title"
              name="title"
              type="text"
              className="form-input"
              placeholder="e.g. Java Fundamentals Challenge"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="quiz-category">Category</label>
            <select
              id="quiz-category"
              name="category"
              className="form-select"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">— Select a category —</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Number of Questions */}
          <div className="form-group">
            <label className="form-label" htmlFor="quiz-num-questions">
              Number of Questions
              <span style={{ color: "var(--accent-1)", marginLeft: 6 }}>{form.noOfQuestion}</span>
            </label>
            <input
              id="quiz-num-questions"
              name="noOfQuestion"
              type="range"
              min={1}
              max={50}
              value={form.noOfQuestion}
              onChange={handleChange}
              style={{
                width: "100%",
                accentColor: "var(--accent-1)",
                cursor: "pointer",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <span>1</span><span>50</span>
            </div>
          </div>

          <button
            id="create-quiz-submit"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: "0.5rem" }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                Creating...
              </>
            ) : (
              "✨ Create Quiz"
            )}
          </button>
        </form>
      </div>

      {/* Info cards */}
      <div
        className="animate-fade-up"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginTop: "1.5rem",
        }}
      >
        <div className="card glass" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>💡</div>
          <div style={{ fontWeight: 600, marginBottom: "0.3rem" }}>How it works</div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            The backend randomly picks questions from the Question Service matching
            your category and count, then stores the quiz with a unique ID.
          </p>
        </div>
        <div className="card glass" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📋</div>
          <div style={{ fontWeight: 600, marginBottom: "0.3rem" }}>After creation</div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Use the quiz ID returned by the backend to open and take your quiz on the
            "Take Quiz" page.
          </p>
        </div>
      </div>
    </main>
  );
}
