import React from "react";

const Shames: React.FC<{ team?: number | null; data?: any }> = ({
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
      <strong>Shames</strong>
      <div>
        {team ? `Team ${team} is not implemented` : "Shames is not implemented"}
      </div>
    </div>
  );
};

export default Shames;
