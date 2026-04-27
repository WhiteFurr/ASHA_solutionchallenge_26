import React from "react";

const mockPlan = [
  {
    name: "Ravi Sharma",
    urgency: "CRITICAL",
    reason: "TB patient, last visit 15 days ago, flagged by ANM",
  },
  {
    name: "Sita Patil",
    urgency: "HIGH",
    reason: "Postpartum case, missed last follow-up",
  },
  {
    name: "Aman Singh",
    urgency: "LOW",
    reason: "Routine check, recently visited",
  },
];

const badgeColor = (u) => {
  if (u === "CRITICAL") return "#E24B4A";
  if (u === "HIGH") return "#EF9F27";
  return "#639922";
};

export default function AIPlan() {
  return (
    <div style={{
      marginTop: "24px",
      padding: "16px",
      border: "1px solid #eee",
      borderRadius: "12px",
      background: "#fafafa"
    }}>
      <h3 style={{ marginBottom: "12px" }}>
        🧠 Today's AI Visit Plan
      </h3>

      {mockPlan.map((p, i) => (
        <div key={i} style={{
          padding: "10px",
          marginBottom: "8px",
          background: "white",
          borderRadius: "8px",
          border: "1px solid #eee"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between"
          }}>
            <strong>{p.name}</strong>
            <span style={{
              background: badgeColor(p.urgency),
              color: "white",
              padding: "2px 8px",
              borderRadius: "6px",
              fontSize: "12px"
            }}>
              {p.urgency}
            </span>
          </div>

          <p style={{
            marginTop: "4px",
            fontSize: "13px",
            color: "#666"
          }}>
            {p.reason}
          </p>
        </div>
      ))}
    </div>
  );
}