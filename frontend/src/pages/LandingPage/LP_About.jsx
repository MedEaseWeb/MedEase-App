import React from "react";
import { Box, Grid, Typography, Paper, Divider } from "@mui/material";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

// --- DUAL NARRATIVE PALETTE ---
const colors = {
  bg: "#EBE5DE", // Matches global page BG

  // LEFT CARD (The Pain/Origin) - Deep & Personal
  darkCardBg: "#2C2420",
  darkTextMain: "#F7F2ED",
  darkTextSec: "rgba(247, 242, 237, 0.6)",
  darkAccent: "#A65D37", // Burnt Sienna

  // RIGHT CARD (The Solution/Vision) - Clear & Structural
  lightCardBg: "#F5F0EB",
  lightTextMain: "#2C2420",
  lightTextSec: "#594D46",
  lightBorder: "#DBCeb0",
};

const fontMain = "'Plus Jakarta Sans', sans-serif";

// A reusable "Chapter" component for the text blocks
const NarrativeCard = ({
  label,
  title,
  body,
  highlight,
  theme = "light",
  delay,
}) => {
  const isDark = theme === "dark";
  const bg = isDark ? colors.darkCardBg : colors.lightCardBg;
  const textMain = isDark ? colors.darkTextMain : colors.lightTextMain;
  const textSec = isDark ? colors.darkTextSec : colors.lightTextSec;
  const border = isDark ? "none" : `1px solid ${colors.lightBorder}`;

  return (
    <Grid item xs={12} md={6}>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        elevation={0}
        sx={{
          height: "100%",
          p: { xs: 4, md: 6 },
          bgcolor: bg,
          borderRadius: "16px",
          border: border,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box>
          {/* Label (e.g., "01 — THE ORIGIN") */}
          <Typography
            sx={{
              fontFamily: fontMain,
              color: isDark ? colors.darkAccent : colors.lightTextSec,
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              mb: 3,
            }}
          >
            {label}
          </Typography>

          {/* Headline */}
          <Typography
            variant="h3"
            sx={{
              fontFamily: fontMain,
              fontWeight: 700,
              color: textMain,
              fontSize: { xs: "2rem", md: "2.5rem" },
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              mb: 4,
            }}
          >
            {title}
          </Typography>

          {/* Main Body Text */}
          <Typography
            sx={{
              fontFamily: fontMain,
              color: textSec,
              fontSize: "1.05rem",
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            {body}
          </Typography>
        </Box>

        {/* Highlight / Pull Quote */}
        <Box
          sx={{
            mt: "auto",
            pt: 4,
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
          }}
        >
          <Quote
            size={20}
            color={isDark ? colors.darkAccent : colors.lightTextSec}
            style={{ marginBottom: "16px", opacity: 0.8 }}
          />
          <Typography
            sx={{
              fontFamily: fontMain,
              color: textMain,
              fontSize: "1.15rem",
              fontWeight: 600,
              fontStyle: "italic",
              lineHeight: 1.5,
            }}
          >
            "{highlight}"
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
};

export default function LP_About() {
  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 10, md: 16 }, // Tighter padding
        px: { xs: 3, md: 8 },
        maxWidth: "1280px",
        mx: "auto",
        fontFamily: fontMain,
      }}
    >
      {/* HEADER: Minimal and Clean */}
      <Box sx={{ mb: 8, maxWidth: "600px" }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: fontMain,
            fontWeight: 800,
            color: colors.lightTextMain,
            fontSize: { xs: "2rem", md: "3rem" },
            letterSpacing: "-0.04em",
            mb: 2,
          }}
        >
          Built from Experience
        </Typography>
        <Typography
          sx={{
            fontFamily: fontMain,
            color: colors.lightTextSec,
            fontSize: "1.1rem",
          }}
        >
          We didn't just find a market gap. We lived it.
        </Typography>
      </Box>

      {/* THE DUAL GRID */}
      <Grid container spacing={3}>
        {" "}
        {/* Tight spacing (3 = 24px) */}
        {/* CARD 1: THE SPARK (Dark) */}
        <NarrativeCard
          theme="dark"
          delay={0}
          label="01 — The Spark"
          title="The Moment Everything Broke"
          body="During one of the most demanding seasons of college—juggling internships and classes—I suffered a Muay Thai injury that left me unable to walk. Like many students, I didn’t take medical leave. I navigated stairs, long walks, and deadlines, all while recovering alone."
          highlight="I navigated one of the most complex systems in the world while I couldn't even walk."
        />
        {/* CARD 2: THE VISION (Light) */}
        <NarrativeCard
          theme="light"
          delay={0.2}
          label="02 — The Vision"
          title="From Chaos to Infrastructure"
          body="Recovery shouldn’t be a solo mission. We built MedEase to replace that isolation with infrastructure. Our mission is simple: help every student heal with clarity, dignity, and compassion—turning a fragmented system into a seamless journey."
          highlight="We are building the digital safety net that I wish I had."
        />
      </Grid>
    </Box>
  );
}
