import { useLocation, useNavigate } from "react-router-dom";

function getGrade(pct) {
  if (pct === 100) return { label: "Perfect Score! 🏆", color: "var(--accent-1)" };
  if (pct >= 80)  return { label: "Excellent! 🌟", color: "#36d975" };
  if (pct >= 60)  return { label: "Good Job! 👍", color: "#5cb8ff" };
  if (pct >= 40)  return { label: "Keep Practicing 💪", color: "var(--warning)" };
  return { label: "Don't Give Up! 🔥", color: "var(--danger)" };
}

export default function ResultPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Fallback if someone navigates here directly
  const score = state?.score ?? 0;
  const total = state?.total ?? 0;
  const pct   = total > 0 ? Math.round((score / total) * 100) : 0;

  const grade = getGrade(pct);

  /* SVG ring values */
  const radius      = 70;
  const circumf     = 2 * Math.PI * radius;
  const strokeDash  = (pct / 100) * circumf;

  return (
    <div className="result-wrapper animate-fade-in">
      {/* Ring */}
      <div className="result-ring">
        <svg width="180" height="180" viewBox="0 0 180 180">
          {/* Track */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="url(#ring-gradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumf}`}
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
          <defs>
            <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c5cff" />
              <stop offset="100%" stopColor="#bf5cff" />
            </linearGradient>
          </defs>
        </svg>

        <div className="result-ring-label">
          <div className="result-score">{score}</div>
          <div className="result-total">/ {total}</div>
        </div>
      </div>

      {/* Grade */}
      <div className="result-message" style={{ color: grade.color }}>
        {grade.label}
      </div>
      <div className="result-sub">
        You scored <strong style={{ color: "var(--text-primary)" }}>{pct}%</strong> on this quiz.
        {pct < 80 && " Review the topics and try again!"}
        {pct >= 80 && " Outstanding performance!"}
      </div>

      {/* Score breakdown */}
      <div
        className="glass"
        style={{
          display: "flex",
          gap: "2rem",
          padding: "1.25rem 2.5rem",
          borderRadius: "var(--radius-lg)",
          marginBottom: "2rem",
        }}
      >
        {[
          { label: "Correct", value: score, color: "var(--success)" },
          { label: "Wrong",   value: total - score, color: "var(--danger)" },
          { label: "Total",   value: total, color: "var(--accent-1)" },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          id="result-retry-btn"
          className="btn btn-outline"
          onClick={() => navigate("/quiz")}
        >
          🔄 Try Another Quiz
        </button>
        <button
          id="result-create-btn"
          className="btn btn-primary"
          onClick={() => navigate("/create")}
        >
          ✨ Create New Quiz
        </button>
        <button
          id="result-home-btn"
          className="btn btn-outline"
          onClick={() => navigate("/")}
        >
          🏠 Home
        </button>
      </div>
    </div>
  );
}
