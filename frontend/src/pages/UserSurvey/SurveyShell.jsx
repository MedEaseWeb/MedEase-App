import React from "react";
import { Box, CssBaseline, GlobalStyles, Paper } from "@mui/material";
import { motion } from "framer-motion";
import InteractiveBackground from "../LandingPage/utils/InteractiveBackground";
import { SURVEY_TOKENS } from "./surveyTokens";

/**
 * SurveyShell
 * Landing-page-consistent frame:
 * - Warm bone background + InteractiveBackground blobs (behind, blurred/grain)
 * - Wide desktop card with generous padding, subtle shadow, thin beige border
 * - Optional gentle fade/slide in
 */
export default function SurveyShell({ children, animate = true }) {
  const { colors, radii, shadows } = SURVEY_TOKENS;

  const Card = animate ? motion.div : "div";
  const cardMotionProps = animate
    ? {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: "easeOut" },
      }
    : {};

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: colors.bone,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 3, md: 6 },
        py: { xs: 7, md: 10 },
      }}
    >
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { backgroundColor: colors.bone },
          body: { backgroundColor: colors.bone, overscrollBehavior: "none" },
          "#root": { backgroundColor: colors.bone },
        }}
      />

      {/* Landing background (always behind) */}
      <InteractiveBackground />

      <Paper
        component={Card}
        elevation={0}
        {...cardMotionProps}
        style={{ width: "100%" }}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 980,
          borderRadius: radii.card,
          p: { xs: 4, md: 7 },
          bgcolor: "rgba(245, 240, 235, 0.78)",
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.card,
          backdropFilter: "blur(14px)",
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}

