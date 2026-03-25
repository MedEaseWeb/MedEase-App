import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

// Reuse the landing page’s established card look (borders, radius, typography).
const colors = {
  cardUpperBg: "#352B25",
  textUpper: "#FFFFFF",
  iconBg: "rgba(255, 255, 255, 0.1)",
  iconColor: "#E8B4A2",
  cardLowerBg: "#F3EFE7",
  textLowerMain: "#2C2420",
  textLowerSec: "#594D46",
  cardBorder: "#E6DCCA",
};

const fontMain = "'Plus Jakarta Sans', sans-serif";

function TeamCard({ name, role, detail, delay, compact = false }) {
  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        border: `1px solid ${colors.cardBorder}`,
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 40px rgba(44, 36, 32, 0.08)",
          borderColor: "#C8B9AF",
        },
      }}
    >
      <Box sx={{ bgcolor: colors.cardUpperBg, p: compact ? 2.2 : 3 }}>
        <Typography
          sx={{
            fontFamily: fontMain,
            fontWeight: 700,
            color: colors.textUpper,
            fontSize: compact ? "1.1rem" : "1.25rem",
            lineHeight: 1.2,
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            fontFamily: fontMain,
            color: "rgba(255,255,255,0.75)",
            fontSize: compact ? "0.85rem" : "0.95rem",
            mt: 0.5,
            lineHeight: 1.4,
          }}
        >
          {role}
        </Typography>
      </Box>

      <Box sx={{ bgcolor: colors.cardLowerBg, p: compact ? 2.2 : 3, flexGrow: 1 }}>
        <Typography
          sx={{
            fontFamily: fontMain,
            color: colors.textLowerSec,
            fontSize: compact ? "0.9rem" : "0.95rem",
            lineHeight: 1.6,
          }}
        >
          {detail}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function LP_Team() {
  return (
    <Box
      sx={{
        py: 12,
        px: { xs: 3, md: 8 },
        maxWidth: "1280px",
        mx: "auto",
        width: "100%",
      }}
    >
      <Box sx={{ mb: 8, maxWidth: "800px" }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: fontMain,
            fontWeight: 800,
            color: colors.textLowerMain,
            fontSize: { xs: "2rem", md: "3rem" },
            letterSpacing: "-0.04em",
            mb: 2,
          }}
        >
          Built by Students, For Students
        </Typography>
        <Typography
          sx={{
            fontFamily: fontMain,
            color: colors.textLowerSec,
            fontSize: "1.1rem",
            lineHeight: 1.6,
          }}
        >
          MedEase is shaped by healthcare researchers, builders, and mentors — focused on safety, clarity, and student recovery.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TeamCard
            name="Annie He"
            role="Product & Business Co-founder"
            detail="Healthcare Researcher and Software Engineer, Emory '25"
            delay={0}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TeamCard
            name="Rolf Shi"
            role="Technical Co-founder"
            detail="AI and Machine Learning Software Engineer in Healthcare, Emory '25 & UPenn '27"
            delay={0.15}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 4 }}>
        {[
          { name: "Dr. Phil Wolff", role: "Language Biomarker Lab", detail: "Mentor" },
          { name: "Dr. JinHo Choi", role: "Emory NLP Lab", detail: "Mentor" },
          { name: "Sig Mosley", role: "Venture Capitalist", detail: "Mosley Ventures" },
          { name: "Dr. Stuart Zola", role: "Founder & Clinical Scientist", detail: "Mentor" },
        ].map((m, idx) => (
          <Grid item xs={6} md={3} key={m.name}>
            <TeamCard
              name={m.name}
              role={m.role}
              detail={m.detail}
              delay={0.15 + idx * 0.1}
              compact
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

