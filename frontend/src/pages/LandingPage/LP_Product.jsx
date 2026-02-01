import React, { useState } from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// --- DARK CONSOLE PALETTE ---
const colors = {
  pageBg: "#EBE5DE",
  cardBg: "#2C2420",
  textMain: "#FFFFFF",
  textSec: "rgba(255, 255, 255, 0.7)",
  accent: "#A65D37",
  pillBg: "rgba(255, 255, 255, 0.08)",
  pillBorder: "rgba(255, 255, 255, 0.1)",
  switcherBg: "#E3DCCA",
  switcherActiveText: "#2C2420",
  switcherInactiveText: "#6B5E55",
};

const fontMain = "'Plus Jakarta Sans', sans-serif";

// --- DATA ---
const sections = [
  {
    id: "rag",
    title: "Agentic Triage Engine",
    subtitle:
      "RAG-powered routing that instantly connects students to the exact right campus resource based on live university data.",
    features: [
      "Context-Aware Retrieval",
      "Automatic Dept. Routing",
      "University Knowledge Base",
      "Zero-Hallucination Guardrails",
    ],
    // "type" determines which skeleton UI to show
    type: "dashboard",
  },
  {
    id: "chat",
    title: "Adaptive Chat Protocol",
    subtitle:
      "A living chat interface that adapts recovery timelines in real-time based on student feedback and natural language updates.",
    features: [
      "Natural Language Updates",
      "Dynamic Timeline Adjustment",
      "Clinician-in-the-Loop",
      "24/7 Crisis Detection",
    ],
    type: "chat",
  },
];

// --- SKELETON UI COMPONENTS ---
const SkeletonBlock = ({ width, height, sx, delay }) => (
  <motion.div
    initial={{ opacity: 0.3 }}
    animate={{ opacity: [0.3, 0.5, 0.3] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay }}
    style={{
      width: width || "100%",
      height: height || 20,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: "8px",
      ...sx,
    }}
  />
);

const WireframeChat = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      width: "100%",
      p: 4,
    }}
  >
    {/* Fake Message Bubbles */}
    <Box sx={{ alignSelf: "flex-start", width: "60%" }}>
      <SkeletonBlock
        height={60}
        delay={0}
        sx={{ borderRadius: "16px 16px 16px 4px" }}
      />
    </Box>
    <Box sx={{ alignSelf: "flex-end", width: "50%", mt: 1 }}>
      <SkeletonBlock
        height={40}
        delay={0.5}
        sx={{
          bgcolor: "rgba(166, 93, 55, 0.3)",
          borderRadius: "16px 16px 4px 16px",
        }}
      />
    </Box>
    <Box sx={{ alignSelf: "flex-start", width: "70%", mt: 1 }}>
      <SkeletonBlock
        height={80}
        delay={1.0}
        sx={{ borderRadius: "16px 16px 16px 4px" }}
      />
    </Box>
    {/* Fake Input Bar */}
    <Box sx={{ mt: "auto", pt: 4 }}>
      <SkeletonBlock height={50} delay={0} sx={{ borderRadius: "25px" }} />
    </Box>
  </Box>
);

const WireframeDashboard = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 3,
      width: "100%",
      p: 4,
    }}
  >
    {/* Header Bars */}
    <Box sx={{ display: "flex", gap: 2 }}>
      <SkeletonBlock
        width="30%"
        height={80}
        delay={0}
        sx={{ borderRadius: "12px" }}
      />
      <SkeletonBlock
        width="70%"
        height={80}
        delay={0.2}
        sx={{ borderRadius: "12px" }}
      />
    </Box>
    {/* List Items */}
    <SkeletonBlock height={40} delay={0.4} />
    <SkeletonBlock height={40} delay={0.5} />
    <SkeletonBlock height={40} delay={0.6} />
    {/* Graph Area */}
    <SkeletonBlock
      height={120}
      delay={0.8}
      sx={{ borderRadius: "12px", mt: 1 }}
    />
  </Box>
);

export default function LP_Product() {
  const [active, setActive] = useState("rag");
  const current = sections.find((s) => s.id === active);

  return (
    <Box
      sx={{
        py: { xs: 10, md: 16 },
        px: { xs: 3, md: 8 },
        maxWidth: "1280px",
        mx: "auto",
        fontFamily: fontMain,
      }}
    >
      {/* --- HEADER --- */}
      <Box textAlign="center" mb={8}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: fontMain,
            fontWeight: 800,
            color: "#2C2420",
            letterSpacing: "-0.04em",
            mb: 2,
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          Intelligent Health Management
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontFamily: fontMain,
            color: "#594D46",
            fontWeight: 500,
            maxWidth: "600px",
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          Agentic infrastructure designed to navigate the chaos of fragmented
          campus systems.
        </Typography>
      </Box>

      {/* --- TAB SWITCHER --- */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
        <Box
          sx={{
            p: 0.5,
            bgcolor: colors.switcherBg,
            borderRadius: "99px",
            display: "inline-flex",
            position: "relative",
          }}
        >
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <Button
                key={s.id}
                onClick={() => setActive(s.id)}
                disableRipple
                sx={{
                  position: "relative",
                  px: 4,
                  py: 1,
                  borderRadius: "99px",
                  fontSize: "0.95rem",
                  fontFamily: fontMain,
                  fontWeight: 600,
                  textTransform: "none",
                  color: isActive
                    ? colors.switcherActiveText
                    : colors.switcherInactiveText,
                  zIndex: 1,
                  transition: "color 0.2s ease",
                  "&:hover": { color: colors.switcherActiveText },
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeProductTab"
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "#FFF",
                      borderRadius: "99px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      zIndex: -1,
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {s.title}
              </Button>
            );
          })}
        </Box>
      </Box>

      {/* --- THE DARK CONSOLE --- */}
      <Paper
        elevation={0}
        component={motion.div}
        layout
        sx={{
          borderRadius: "32px",
          bgcolor: colors.cardBg, // THE DARK ENGINE
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          position: "relative",
          boxShadow: "0 20px 50px rgba(44, 36, 32, 0.15)",
        }}
      >
        {/* LEFT: TEXT CONTENT */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 4, md: 6, lg: 8 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontFamily: fontMain,
                  fontWeight: 700,
                  color: colors.textMain,
                  letterSpacing: "-0.02em",
                  mb: 2,
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                }}
              >
                {current.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontMain,
                  color: colors.textSec,
                  fontSize: "1.1rem",
                  mb: 5,
                  lineHeight: 1.6,
                  maxWidth: "450px",
                }}
              >
                {current.subtitle}
              </Typography>

              {/* Feature Pills */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {current.features.map((item) => (
                  <Box
                    key={item}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: "12px",
                      bgcolor: colors.pillBg,
                      border: `1px solid ${colors.pillBorder}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      transition: "all 0.2s",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: colors.accent,
                        boxShadow: `0 0 10px ${colors.accent}`,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: fontMain,
                        fontWeight: 500,
                        color: colors.textMain,
                        fontSize: "0.9rem",
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* RIGHT: THE WIREFRAME SKELETON */}
        <Box
          sx={{
            flex: 1.2,
            position: "relative",
            minHeight: { xs: "350px", md: "auto" },
            bgcolor: "#1E1815", // Darker background for the "Screen"
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id} // Re-renders skeleton on switch
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "450px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* GLASS DEVICE CONTAINER */}
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  bgcolor: "rgba(255,255,255,0.02)", // Very subtle fill
                  position: "relative",
                }}
              >
                {/* Render the specific wireframe based on type */}
                {current.type === "chat" ? (
                  <WireframeChat />
                ) : (
                  <WireframeDashboard />
                )}

                {/* Overlay Gradient for depth */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(44,36,32,0) 0%, rgba(44,36,32,0.2) 100%)",
                    pointerEvents: "none",
                  }}
                />
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Paper>
    </Box>
  );
}
