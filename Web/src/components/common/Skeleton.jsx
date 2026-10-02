import React from "react";

export const SkeletonCard = () => (
  <div className="card" style={{ padding: "16px" }}>
    <div className="skeleton" style={{ width: "100%", height: "180px", borderRadius: "12px", marginBottom: "16px" }} />
    <div className="skeleton" style={{ width: "40%", height: "14px", marginBottom: "8px" }} />
    <div className="skeleton" style={{ width: "80%", height: "20px", marginBottom: "12px" }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div className="skeleton" style={{ width: "35%", height: "18px" }} />
      <div className="skeleton" style={{ width: "25%", height: "28px", borderRadius: "9999px" }} />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px"
  }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
