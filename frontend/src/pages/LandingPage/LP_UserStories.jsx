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
  const stories = t("lp.userStories.stories", { returnObjects: true });

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

