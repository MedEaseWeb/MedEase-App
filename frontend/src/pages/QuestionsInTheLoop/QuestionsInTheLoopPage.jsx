import React, { useState } from "react";
import { Box, Button, CssBaseline, GlobalStyles, Paper, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import NotesIcon from "@mui/icons-material/Notes";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InteractiveBackground from "../LandingPage/utils/InteractiveBackground";
import QuestionsInTheLoopSection from "./QuestionsInTheLoopSection";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";

const { colors, fontMain, radii, shadows } = SURVEY_TOKENS;

// Landing/survey card style: same as SurveyShell + survey cards
const cardSx = {
  p: 3,
  borderRadius: radii.cardInner,
  border: `1px solid ${colors.border}`,
  bgcolor: colors.beige,
  boxShadow: "0 10px 30px rgba(44, 36, 32, 0.08)",
  display: "flex",
  flexDirection: "column",
};

export default function QuestionsInTheLoopPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStageIndex, setActiveStageIndex] = useState(2);
  const { t } = useTranslation();

  const CARE_STAGES = t("home.careJourney.stages", { returnObjects: true });

  const activeStage = CARE_STAGES[activeStageIndex];

  const sectionNavItems = [
    { label: t("survey.nav.userSurvey"), path: "/survey", icon: <AssignmentIcon /> },
    { label: t("survey.nav.home"), path: "/home", icon: <HomeIcon /> },
    { label: t("survey.nav.community"), path: "/community", icon: <GroupIcon /> },
    { label: t("survey.nav.notes"), path: "/notes", icon: <NotesIcon /> },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: colors.bone,
        display: "flex",
        flexDirection: "column",
        pb: 4,
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
      <InteractiveBackground />

      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1000,
          mx: "auto",
          mt: { xs: 2, md: 4 },
          mb: 4,
          px: { xs: 2, md: 4 },
          py: 4,
          borderRadius: radii.card,
          bgcolor: "rgba(245, 240, 235, 0.82)",
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.card,
          backdropFilter: "blur(14px)",
        }}
      >
        {/* Section nav: User Survey | Home | Community | Notes — landing/survey style */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3, pb: 2, borderBottom: `1px solid ${colors.border}` }}>
          {sectionNavItems.map((item) => {
            const isActive = item.path === "/home" ? (location.pathname === "/home" || location.pathname === "/questions-in-the-loop") : location.pathname === item.path;
            return (
            <Button
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                fontFamily: fontMain,
                fontWeight: isActive ? 700 : 500,
                textTransform: "none",
                color: isActive ? colors.accent : colors.textSec,
                borderRadius: radii.button,
                px: 2,
                "&:hover": { color: colors.textMain, backgroundColor: "rgba(44, 36, 32, 0.05)" },
              }}
            >
              {item.icon && <Box component="span" sx={{ mr: 0.5, display: "flex", alignItems: "center" }}>{item.icon}</Box>}
              {item.label}
            </Button>
          );})}
        </Box>

        {/* Your Care Journey — big typographic header like survey/landing */}
        <Typography
          sx={{
            fontFamily: fontMain,
            fontWeight: 800,
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            letterSpacing: "-0.04em",
            color: colors.textMain,
            lineHeight: 1.1,
            mb: 2,
          }}
        >
          {t("home.careJourney.title")}
        </Typography>

        {/* Horizontal care path — active uses accent */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {CARE_STAGES.map((stage, idx) => {
            const isActive = idx === activeStageIndex;
            return (
              <Box key={stage} sx={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "1 1 0", minWidth: 80 }}>
                <Button
                  onClick={() => setActiveStageIndex(idx)}
                  sx={{
                    fontFamily: fontMain,
                    fontWeight: isActive ? 700 : 500,
                    textTransform: "none",
                    color: isActive ? colors.accent : colors.textSec,
                    fontSize: "0.9rem",
                    "&:hover": { color: colors.textMain, backgroundColor: "transparent" },
                  }}
                >
                  {stage}
                </Button>
                {isActive && (
                  <Box
                    sx={{
                      mt: 0.5,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: colors.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-hidden
                  >
                    <FavoriteIcon sx={{ fontSize: 14 }} />
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>

        {/* Recommendation Card — two-tone / survey card style */}
        <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
          <Typography sx={{ fontFamily: fontMain, fontWeight: 700, color: colors.accent, fontSize: "1rem", mb: 1 }}>
            {`${t("home.recommendation.label")}: ${activeStage}`}
          </Typography>
          <Typography sx={{ fontFamily: fontMain, color: colors.textMain, fontSize: "1rem", mb: 2 }}>
            {t("home.recommendation.suggestion")}
          </Typography>
          <Typography sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "0.95rem", mb: 0.5 }}>
            {t("home.recommendation.whyLabel")}
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5, color: colors.textSec, fontFamily: fontMain, fontSize: "0.95rem" }}>
            {t("home.recommendation.whyReasons", { returnObjects: true }).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </Box>
        </Paper>

        <QuestionsInTheLoopSection activeStage={activeStage} />
      </Paper>
    </Box>
  );
}
