import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, maxWidth = "540px" }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px"
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(17, 24, 39, 0.6)",
              backdropFilter: "blur(8px)"
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth,
              maxHeight: "90vh",
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.2)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 1000
            }}
          >
            {/* Modal Header */}
            {title && (
              <div style={{
                padding: "20px 24px",
                borderBottom: "1px solid #F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "none",
                    backgroundColor: "#F3F4F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  <X size={18} color="#6B7280" />
                </button>
              </div>
            )}

            {!title && (
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  zIndex: 10,
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#F3F4F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <X size={18} color="#6B7280" />
              </button>
            )}

            {/* Modal Content */}
            <div style={{ padding: "24px", overflowY: "auto" }}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
