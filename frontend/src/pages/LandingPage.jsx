import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "./utility/Logo";

const BLUE = "#081D2A";
const EDGE = 10; // feather width in px

// Apple-style rounded card with 10px feather-to-transparent edges
function AppleCard({ children, bg = BLUE }) {
  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 28,
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.06)",
        // card background is painted by the ::before layer (so we can mask it)
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          backgroundColor: bg,
          // Feather the outer 10px on all sides to transparent
          WebkitMaskImage: `
            linear-gradient(to right, transparent, #000 ${EDGE}px, #000 calc(100% - ${EDGE}px), transparent),
            linear-gradient(to bottom, transparent, #000 ${EDGE}px, #000 calc(100% - ${EDGE}px), transparent)
          `,
          maskImage: `
            linear-gradient(to right, transparent, #000 ${EDGE}px, #000 calc(100% - ${EDGE}px), transparent),
            linear-gradient(to bottom, transparent, #000 ${EDGE}px, #000 calc(100% - ${EDGE}px), transparent)
          `,
          // no composite needed in modern Chrome; layers multiply to intersect
          zIndex: 0,
        },
      }}
    >
      {/* content layer */}
      <Box sx={{ position: "relative", zIndex: 1, p: { xs: 3, md: 6 } }}>
        {children}
      </Box>
    </Box>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Report Simplifier",
      desc: "Upload or paste your clinical report. Our AI simplifies complex medical language into plain words and summarizes key findings into actionable bullet points.",
      bullets: [
        "Drag & drop reports or paste text directly",
        "Get simplified language instantly",
        "See concise summaries with the most important details",
      ],
      img: "https://imagedelivery.net/luUTa6EFyOmipDilm9a3Jw/dea6fb43-a5b6-451f-a59a-def005af2c00/public",
      sectionBg: "#FFFFFF",
      textColor: "#081D2A",
      reverse: false,
      route: "/reportsimplifier",
      useBlueCard: false,
    },
    {
      title: "Medication Help",
      desc: "Get explanations for your prescriptions in simple terms. Learn how to take your medication safely, understand side effects, and discover interactions to avoid.",
      bullets: [
        "Ask questions about your prescription",
        "Understand dosage, timing, and precautions",
        "Stay informed about side effects and interactions",
      ],
      img: "https://imagedelivery.net/luUTa6EFyOmipDilm9a3Jw/9508867e-d88b-450a-c56c-58c5311b2e00/public",
      sectionBg: BLUE, // section stays blue
      textColor: "#F5F5F5",
      reverse: true,
      route: "/medication",
      useBlueCard: true, // <-- render blue card with feathered edges
    },
    {
      title: "Caregiver Mode",
      desc: "Support those you care for with an all-in-one toolkit. Manage documents, set reminders, sync calendars, and even generate accommodation letters automatically.",
      bullets: [
        "Centralize and manage patient documents",
        "Set reminders & sync with Google Calendar",
        "Use our caregiver AI assistant for any task",
      ],
      img: "https://imagedelivery.net/luUTa6EFyOmipDilm9a3Jw/4dc15438-9d34-4c8f-5ae0-d3630e881800/public",
      sectionBg: "#FFFFFF",
      textColor: "#081D2A",
      reverse: false,
      route: "/caregiver",
      useBlueCard: false,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#FFFFFF",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 6 },
          py: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Logo />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="text"
            sx={{ color: "#081D2A", fontFamily: "ECA, sans-serif" }}
            onClick={() => navigate("/login")}
          >
            Log In
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#00684A",
              "&:hover": { bgcolor: "#009262" },
              fontFamily: "ECA, sans-serif",
            }}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
        </Box>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          width: "100%",
          bgcolor: BLUE,
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 3,
          boxSizing: "border-box",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "3rem",
            fontFamily: "ECA, sans-serif",
            fontWeight: "bold",
            color: "#F5F5F5",
            maxWidth: "800px",
            margin: 0,
          }}
        >
          MedEase: Your AI-Powered Health Companion
        </motion.h1>
        <Typography
          sx={{
            mt: 3,
            fontSize: 18,
            fontFamily: "ECA, sans-serif",
            color: "#B0BEC5",
            maxWidth: "600px",
          }}
        >
          Simplify reports. Understand medications. Support caregivers.
          <br />
          All in one seamless platform.
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 5,
            px: 4,
            py: 1.2,
            bgcolor: "#00684A",
            "&:hover": { bgcolor: "#009262" },
            fontFamily: "ECA, sans-serif",
            fontSize: 16,
          }}
          onClick={() => navigate("/signup")}
        >
          Get Started
        </Button>
      </Box>

      {/* Feature Sections */}
      {features.map((f, idx) => (
        <Box
          key={idx}
          sx={{
            width: "100%",
            bgcolor: f.sectionBg,
            color: f.textColor,
            py: { xs: 6, md: 10 },
          }}
        >
          <Box
            sx={{
              maxWidth: "1200px",
              mx: "auto",
              px: { xs: 3, md: 6 },
              boxSizing: "border-box",
            }}
          >
            {f.useBlueCard ? (
              <AppleCard bg={BLUE}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    alignItems: "center",
                    gap: { xs: 3, md: 6 },
                    direction: f.reverse ? "rtl" : "ltr",
                  }}
                >
                  <Box sx={{ direction: "ltr" }}>
                    <motion.img
                      src={f.img}
                      alt={f.title}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        borderRadius: 12,
                        boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                      }}
                      initial={{ opacity: 0, x: f.reverse ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.8 }}
                    />
                  </Box>
                  <Box sx={{ direction: "ltr" }}>
                    <Typography
                      sx={{
                        fontSize: 28,
                        fontFamily: "ECA, sans-serif",
                        fontWeight: "bold",
                        mb: 2,
                      }}
                    >
                      {f.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontFamily: "ECA, sans-serif",
                        mb: 2,
                        maxWidth: 600,
                      }}
                    >
                      {f.desc}
                    </Typography>
                    <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                      {f.bullets.map((b, i) => (
                        <Box
                          component="li"
                          key={i}
                          sx={{
                            mb: 1,
                            fontFamily: "ECA, sans-serif",
                            fontSize: 15,
                          }}
                        >
                          {b}
                        </Box>
                      ))}
                    </Box>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "#00684A",
                        "&:hover": { bgcolor: "#009262" },
                        fontFamily: "ECA, sans-serif",
                      }}
                      onClick={() => navigate(f.route)}
                    >
                      Explore {f.title}
                    </Button>
                  </Box>
                </Box>
              </AppleCard>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  alignItems: "center",
                  gap: { xs: 3, md: 6 },
                  direction: f.reverse ? "rtl" : "ltr",
                }}
              >
                <Box sx={{ direction: "ltr" }}>
                  <motion.img
                    src={f.img}
                    alt={f.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      borderRadius: 12,
                      boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                    }}
                    initial={{ opacity: 0, x: f.reverse ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                  />
                </Box>
                <Box sx={{ direction: "ltr" }}>
                  <Typography
                    sx={{
                      fontSize: 28,
                      fontFamily: "ECA, sans-serif",
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    {f.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontFamily: "ECA, sans-serif",
                      mb: 2,
                      maxWidth: 600,
                    }}
                  >
                    {f.desc}
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                    {f.bullets.map((b, i) => (
                      <Box
                        component="li"
                        key={i}
                        sx={{
                          mb: 1,
                          fontFamily: "ECA, sans-serif",
                          fontSize: 15,
                        }}
                      >
                        {b}
                      </Box>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#00684A",
                      "&:hover": { bgcolor: "#009262" },
                      fontFamily: "ECA, sans-serif",
                    }}
                    onClick={() => navigate(f.route)}
                  >
                    Explore {f.title}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
