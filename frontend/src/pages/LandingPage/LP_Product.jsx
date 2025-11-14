import React, { useState } from "react";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  {
    id: "recovery",
    title: "Recovery Assistant (AI-Powered)",
    subtitle: "Simplify, plan, and recover with personalized guidance.",
    image:
      "https://imagedelivery.net/luUTa6EFyOmipDilm9a3Jw/1ba759e3-8f0e-4870-6df8-ea8403edb800/public",
    features: [
      "Medical Jargon Simplification",
      "Dietary & Recovery Journey Planning",
      "Caregiver Coordination Tools",
      "Accommodation Letter Generator",
      "AI Agent Chatbot",
      "Emotional & Peer Support",
    ],
  },
  {
    id: "accessibility",
    title: "Campus Accessibility Toolkit",
    subtitle: "Navigate campus with confidence and inclusivity.",
    image:
      "https://imagedelivery.net/luUTa6EFyOmipDilm9a3Jw/3005e40c-c7de-4a5a-8f7f-3b86dc663b00/public",
    features: [
      "Interactive Campus Map (Emory start)",
      "Wheelchair-friendly Routes",
      "Elevators & Ramps",
      "Disability Parking",
      "Paratransit Integration",
      "Real-time Facility Updates",
    ],
  },
  {
    id: "community",
    title: "MedEase Community Hub",
    subtitle: "Connect, share, and support your recovery journey.",
    image:
      "https://imagedelivery.net/luUTa6EFyOmipDilm9a3Jw/4b73980a-cd2b-4fc1-e290-d676666df500/public",
    features: [
      "Injury Journey Sharing",
      "Social Support & Peer Matching",
      "Medical Equipment Donation/Reuse",
      "Volunteer and Check-In Network",
    ],
  },
];

export default function LP_Product() {
  const [active, setActive] = useState("recovery");
  const current = sections.find((s) => s.id === active);

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: 8 },
        background: "transparent", // let LandingPage background show through
        minHeight: "90vh",
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: "ECA, sans-serif",
            fontWeight: "bold",
            color: "#0f4038",
            mb: 2,
          }}
        >
          What MedEase Offers
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "ECA, sans-serif",
            color: "#4f665f",
            maxWidth: "700px",
            mx: "auto",
          }}
        >
          Explore how MedEase supports your health, accessibility, and recovery
          community.
        </Typography>
      </Box>

      {/* Tabs */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
          mb: 6,
        }}
      >
        {sections.map((s) => (
          <Button
            key={s.id}
            onClick={() => setActive(s.id)}
            sx={{
              textTransform: "none",
              px: 3,
              py: 1.2,
              borderRadius: "999px",
              fontFamily: "ECA, sans-serif",
              fontSize: "1rem",
              fontWeight: "bold",
              color: active === s.id ? "#fff" : "#00684A",
              backgroundColor:
                active === s.id ? "#00684A" : "rgba(0,104,74,0.08)",
              "&:hover": {
                backgroundColor:
                  active === s.id ? "#009262" : "rgba(0,104,74,0.15)",
              },
              transition: "all 0.25s ease",
            }}
          >
            {s.title.split("(")[0].trim()}
          </Button>
        ))}
      </Box>

      {/* Display */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 5, md: 8 },
        }}
      >
        {/* Placeholder image / visual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.6 }}
          >
            <motion.img
              key={current.id}
              src={current.image}
              alt={current.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.6 }}
              style={{
                width: "520px", // mandatory width
                height: "340px", // mandatory height
                objectFit: "cover", // ensures consistent look
                borderRadius: "16px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                backgroundColor: "#e8f5f0",
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Text */}
        <Box sx={{ flex: 1, maxWidth: 520 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + "-text"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "ECA, sans-serif",
                  fontWeight: "bold",
                  color: "#00684A",
                  mb: 1,
                }}
              >
                {current.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "ECA, sans-serif",
                  color: "#333",
                  mb: 3,
                }}
              >
                {current.subtitle}
              </Typography>

              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {current.features.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      listStyle: "none",
                      marginBottom: "10px",
                      fontFamily: "ECA, sans-serif",
                      fontSize: "0.95rem",
                      color: "#222",
                    }}
                  >
                    • {item}
                  </motion.li>
                ))}
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}
