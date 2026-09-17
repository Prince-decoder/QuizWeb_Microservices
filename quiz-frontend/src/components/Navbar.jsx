import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const links = [
    { label: "Home", path: "/" },
    { label: "Create Quiz", path: "/create" },
    { label: "Take Quiz", path: "/quiz" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <span className="dot" />
        <span className="gradient-text">QuizMaster</span>
      </div>

      <div className="navbar-links">
        {links.map(({ label, path }) => (
          <span
            key={path}
            id={`nav-${label.toLowerCase().replace(" ", "-")}`}
            className={`nav-link${pathname === path ? " active" : ""}`}
            onClick={() => navigate(path)}
          >
            {label}
          </span>
        ))}
      </div>
    </nav>
  );
}
