import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Quiz Creation",
    desc: "Generate topic-specific quizzes in seconds with configurable difficulty.",
  },
  {
    icon: "🎯",
    title: "Smart Scoring",
    desc: "Automatic result calculation and instant score feedback after submission.",
  },
  {
    icon: "📚",
    title: "Category Based",
    desc: "Browse quizzes by category — Java, Python, DSA, and more.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="page page-wide">
      {/* Hero */}
      <section className="hero animate-fade-up">
        <div className="hero-badge">🚀 Microservice-Powered Quiz Platform</div>
        <h1>
          Test Your Knowledge
          <br />
          <span className="gradient-text">Like Never Before</span>
        </h1>
        <p>
          Create customized quizzes, challenge yourself across topics, and get
          instant results — all powered by a scalable Spring Boot microservice backend.
        </p>
        <div className="hero-actions">
          <button
            id="hero-create-btn"
            className="btn btn-primary"
            onClick={() => navigate("/create")}
          >
            ✨ Create a Quiz
          </button>
          <button
            id="hero-take-btn"
            className="btn btn-outline"
            onClick={() => navigate("/quiz")}
          >
            🎮 Take a Quiz
          </button>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-grid animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {[
          { value: "∞", label: "Questions Available" },
          { value: "4", label: "Options Per Question" },
          { value: "100%", label: "Instant Results" },
          { value: "REST", label: "API Driven" },
        ].map((s) => (
          <div key={s.label} className="stat-card glass">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section style={{ marginTop: "4rem" }}>
        <h2 className="section-heading animate-fade-up" style={{ animationDelay: "0.15s" }}>
          Why QuizMaster?
        </h2>
        <p className="section-subtext animate-fade-up" style={{ animationDelay: "0.18s" }}>
          Built with modern microservice architecture for reliability and speed.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
            marginTop: "1rem",
          }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="card glass animate-fade-up"
              style={{ animationDelay: `${0.2 + i * 0.08}s` }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>{f.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
