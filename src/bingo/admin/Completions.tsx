import React from "react";

const Completions: React.FC<{ team?: number | null; data?: any }> = ({
  team = null,
  data,
}) => {
  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        flex: 1,
        width: "100%",
        overflow: "auto",
        minHeight: 0,
      }}
    >
      <strong>Completions</strong>
      <div>
        {team
          ? `Team ${team} is not implemented`
          : "Completions is not implemented"}
      </div>
    </div>
  );
};

export default Completions;
