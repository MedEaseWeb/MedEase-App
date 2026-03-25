import React from "react";
import { Box, Grid, Paper, Typography, Divider } from "@mui/material";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useTranslation } from "react-i18next";

const colors = {
  pageBg: "#EBE5DE",
  cardBg: "#F3EFE7",
  textMain: "#2C2420",
  textSec: "#594D46",
  accent: "#A65D37",
  border: "#E6DCCA",
};

const fontMain = "'Plus Jakarta Sans', sans-serif";

function StoryCard({ tag, quote, author, role, delay }) {
  return (
    <Grid item xs={12} md={6}>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        elevation={0}
        sx={{
          height: "100%",
          borderRadius: "16px",
          border: `1px solid ${colors.border}`,
          bgcolor: colors.cardBg,
          p: 3,
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 20px 40px rgba(44, 36, 32, 0.08)",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 14,
            right: 14,
            opacity: 0.18,
            pointerEvents: "none",
          }}
          aria-hidden
        >
          <Quote size={52} color={colors.accent} />
        </Box>

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 2,
            py: 0.6,
            borderRadius: "999px",
            border: `1px solid rgba(166, 93, 55, 0.22)`,
            bgcolor: "rgba(166, 93, 55, 0.10)",
            mb: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: fontMain,
              fontWeight: 800,
              color: colors.accent,
              fontSize: "0.85rem",
              letterSpacing: "0.01em",
            }}
          >
            {tag}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontFamily: fontMain,
            color: colors.textSec,
            fontSize: "1.05rem",
            lineHeight: 1.75,
            position: "relative",
            zIndex: 1,
            mb: 3,
          }}
        >
          {quote}
        </Typography>

        <Divider sx={{ borderColor: "rgba(44, 36, 32, 0.12)", mb: 2 }} />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            sx={{
              fontFamily: fontMain,
              fontWeight: 800,
              color: colors.textMain,
              fontSize: "0.95rem",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
            }}
          >
            {author}
          </Typography>
          <Typography
            sx={{
              fontFamily: fontMain,
              color: "rgba(44, 36, 32, 0.65)",
              fontSize: "0.85rem",
              lineHeight: 1.4,
              mt: 0.5,
            }}
          >
            {role}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
}

export default function LP_UserStories() {
  const { t } = useTranslation();
  const stories = [
    {
      tag: "The Wait That Cost Everything",
      quote:
        "I fell off my scooter in the freezing cold. I was terrified of going to the ER because I thought it would be too expensive. So I waited overnight. By the time I went in, the damage to my skin became permanent. I regret waiting every single day.",
      author: "Emory PhD Student",
      role: "Recovery journey",
    },
    {
      tag: "Lost in Week One",
      quote:
        "I fractured myself in the first week of freshman year. I didn't even know where my classes were yet. There are a lot of resources, but every single one requires some kind of application or process that I just didn't know how to navigate.",
      author: "Emory Freshman",
      role: "Student navigation",
    },
    {
      tag: "When Life Stops",
      quote:
        "I had to take medical leave because of a major injury. Suddenly I had to find someone to sublease my apartment while dealing with a bone fracture, stress, and zero experience managing a medical emergency alone. The cost of treatment? It still feels terrifying.",
      author: "Emory Student, Medical Leave",
      role: "Care continuity",
    },
    {
      tag: "Alone in the ER",
      quote:
        "I had intense stomach pain that turned out to be appendicitis. As an international student, it was my first time ever going to the ER — I even drove myself there. All I could think was: what about the bills? I was terrified of both the surgery and the recovery.",
      author: "Emory Senior, International Student",
      role: "Emergency support",
    },
  ];

  return (
    <Box sx={{ py: 12, px: { xs: 3, md: 8 }, maxWidth: "1280px", mx: "auto", width: "100%" }}>
      <Box sx={{ mb: 8, textAlign: "left", maxWidth: "850px" }}>
        <Typography
          sx={{
            fontFamily: fontMain,
            fontWeight: 800,
            color: colors.accent,
            fontSize: "0.95rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            mb: 2,
          }}
        >
          {t("lp.userStories.eyebrow")}
        </Typography>

        <Typography
          sx={{
            fontFamily: fontMain,
            fontWeight: 800,
            color: colors.textMain,
            fontSize: { xs: "2rem", md: "3rem" },
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            mb: 3,
          }}
        >
          {t("lp.userStories.heading")}
        </Typography>

        <Typography
          sx={{
            fontFamily: fontMain,
            color: colors.textSec,
            fontSize: "1.1rem",
            lineHeight: 1.65,
          }}
        >
          {t("lp.userStories.subtitle")}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stories.map((s, idx) => (
          <StoryCard
            key={s.tag}
            tag={s.tag}
            quote={s.quote}
            author={s.author}
            role={s.role}
            delay={0.05 * idx}
          />
        ))}
      </Grid>
    </Box>
  );
}

