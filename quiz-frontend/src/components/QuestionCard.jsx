const LETTERS = ["A", "B", "C", "D"];

/**
 * @param {object} props
 * @param {object} props.question   – ResponseModel from backend
 * @param {number} props.index      – 0-based index
 * @param {string} props.selected   – currently selected answer value
 * @param {function} props.onSelect – callback(questionId, answerValue)
 */
export default function QuestionCard({ question, index, selected, onSelect }) {
  const options = [
    question.op1,
    question.op2,
    question.op3,
    question.op4,
  ];

  return (
    <div className="question-card animate-fade-up" style={{ animationDelay: `${index * 0.06}s` }}>
      <div className="question-meta">
        <span className="badge badge-category">{question.category}</span>
        <span className="badge badge-difficulty">{question.difficultyLevel}</span>
      </div>

      <div className="question-number">Question {index + 1}</div>
      <div className="question-title">{question.questionTitle}</div>

      <div className="options-grid">
        {options.map((opt, i) => (
          <button
            key={i}
            id={`q${question.id}-opt${i}`}
            className={`option-btn${selected === opt ? " selected" : ""}`}
            onClick={() => onSelect(question.id, opt)}
          >
            <span className="option-letter">{LETTERS[i]}</span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
