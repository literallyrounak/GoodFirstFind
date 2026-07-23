export default function IssueCard({ issue, onSave, saved }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: "1rem",
        marginBottom: "0.75rem",
      }}
    >
      <a href={issue.url} target="_blank" rel="noreferrer">
        <strong>{issue.title}</strong>
      </a>
      <p style={{ margin: "0.25rem 0", color: "#666" }}>{issue.repoName}</p>
      <p style={{ margin: "0.25rem 0", fontSize: "0.85rem" }}>
        {issue.labels?.join(", ")}
      </p>
      {onSave && (
        <button onClick={() => onSave(issue)} disabled={saved}>
          {saved ? "Saved" : "Save as Quest"}
        </button>
      )}
    </div>
  );
}
