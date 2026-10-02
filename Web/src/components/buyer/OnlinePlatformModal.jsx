import React from "react";
import Modal from "../common/Modal";
import { Globe, ExternalLink, CheckCircle2, DollarSign, Users, Target, HelpCircle, Lightbulb } from "lucide-react";

const OnlinePlatformModal = ({ isOpen, onClose, platform }) => {
  if (!platform) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="880px">
      <div style={{ padding: "8px 4px" }}>
        {/* Header Banner */}
        <div style={{
          position: "relative",
          borderRadius: "20px",
          overflow: "hidden",
          marginBottom: "24px",
          minHeight: "180px",
          display: "flex",
          alignItems: "flex-end",
          padding: "24px",
          backgroundImage: `linear-gradient(180deg, rgba(17, 24, 39, 0.3) 0%, rgba(17, 24, 39, 0.92) 100%), url('${platform.coverImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#FFFFFF"
        }}>
          <div>
            <span style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "9999px",
              backgroundColor: platform.iconColor || "#2563EB",
              color: "#FFFFFF",
              fontSize: "12px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "8px"
            }}>
              {platform.category} ADVERTISING
            </span>
            <h2 style={{ fontSize: "28px", fontWeight: "900", letterSpacing: "-0.5px", lineHeight: "1.2" }}>
              {platform.name}
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", marginTop: "4px" }}>
              {platform.subtitle}
            </p>
          </div>
        </div>

        {/* Overview */}
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>
            Overview
          </h3>
          <p style={{ fontSize: "14px", color: "#4B5563", lineHeight: "1.6" }}>
            {platform.whatIsIt || platform.shortOverview}
          </p>
          {platform.howItWorks && (
            <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "8px", lineHeight: "1.5", backgroundColor: "#F9FAFB", padding: "12px 16px", borderRadius: "12px", borderLeft: "4px solid #2563EB" }}>
              <strong>How it Works:</strong> {platform.howItWorks}
            </p>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          {platform.audienceReach && (
            <div style={{ backgroundColor: "#F0F7FF", border: "1px solid #DBEAFE", borderRadius: "16px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#2563EB", fontWeight: "700", fontSize: "13px", marginBottom: "6px" }}>
                <Users size={18} />
                <span>Audience Reach</span>
              </div>
              <p style={{ fontSize: "18px", fontWeight: "900", color: "#111827" }}>
                {platform.audienceReach.activeUsers || platform.audienceReach.globalUsers}
              </p>
              <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>
                {platform.audienceReach.keyDemographics || "Active Users Targetable"}
              </p>
            </div>
          )}

          {platform.pricingModel && (
            <div style={{ backgroundColor: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: "16px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#7C3AED", fontWeight: "700", fontSize: "13px", marginBottom: "6px" }}>
                <DollarSign size={18} />
                <span>Pricing Model</span>
              </div>
              <p style={{ fontSize: "16px", fontWeight: "800", color: "#111827" }}>
                {platform.pricingModel.cpc || platform.pricingModel.cpm}
              </p>
              <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>
                Est. Daily Budget: {platform.pricingModel.dailyBudget || "Flexible"}
              </p>
            </div>
          )}
        </div>

        {/* Ad Formats */}
        {platform.adTypes && platform.adTypes.length > 0 && (
          <div style={{ marginBottom: "28px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#111827", marginBottom: "12px" }}>
              Available Ad Formats & Specs
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
              {platform.adTypes.map((ad, idx) => (
                <div key={idx} style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "14px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "700", color: "#111827" }}>{ad.name}</p>
                  <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 8px 0" }}>{ad.description}</p>
                  {ad.specs && (
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "#2563EB", backgroundColor: "#EFF6FF", padding: "2px 8px", borderRadius: "6px" }}>
                      Specs: {ad.specs}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Use Cases & Targeting */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }} className="responsive-modal-grid">
          {platform.bestUseCases && (
            <div style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "18px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#111827", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Lightbulb size={16} color="#D97706" />
                <span>Best Use Cases</span>
              </h4>
              <ul style={{ paddingLeft: "18px", margin: 0, fontSize: "13px", color: "#4B5563", lineHeight: "1.6" }}>
                {platform.bestUseCases.map((useCase, idx) => (
                  <li key={idx}>{useCase}</li>
                ))}
              </ul>
            </div>
          )}

          {platform.targetingOptions && (
            <div style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "18px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#111827", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Target size={16} color="#059669" />
                <span>Targeting Capabilities</span>
              </h4>
              <ul style={{ paddingLeft: "18px", margin: 0, fontSize: "13px", color: "#4B5563", lineHeight: "1.6" }}>
                {platform.targetingOptions.map((opt, idx) => (
                  <li key={idx}>{opt}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E5E7EB", paddingTop: "16px" }}>
          {platform.officialWebsite?.url ? (
            <a
              href={platform.officialWebsite.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#2563EB", fontWeight: "700", fontSize: "14px", textDecoration: "none" }}
            >
              <span>Visit Official Platform ({platform.officialWebsite.name || "Learn More"})</span>
              <ExternalLink size={16} />
            </a>
          ) : <div />}

          <button onClick={onClose} className="btn btn-primary btn-md">
            Close Guide
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OnlinePlatformModal;
