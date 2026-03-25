import React, { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  CssBaseline,
  GlobalStyles,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import InteractiveBackground from "../LandingPage/utils/InteractiveBackground";
import QuestionsInTheLoopSection from "./QuestionsInTheLoopSection";
import DemoSectionNav from "../utility/DemoSectionNav";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";

const { colors, fontMain, radii, shadows } = SURVEY_TOKENS;

export default function QuestionsInTheLoopPage() {
  const [activeStageIndex, setActiveStageIndex] = useState(2);
  const [recommendationOpen, setRecommendationOpen] = useState(false);
  const { t } = useTranslation();

  const CARE_STAGES = t("home.careJourney.stages", { returnObjects: true });
  const activeStage = CARE_STAGES[activeStageIndex];

  return (
    <Box
      sx={{
        position: "relative",
        height: "calc(100vh - 64px)",
        overflow: "hidden",
        bgcolor: colors.bone,
        display: "flex",
        flexDirection: "column",
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
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 1000,
          mx: "auto",
          mt: { xs: 1.5, md: 2.5 },
          mb: { xs: 1.5, md: 2.5 },
          px: { xs: 2, md: 4 },
          pt: 3,
          pb: 2,
          borderRadius: radii.card,
          bgcolor: "rgba(245, 240, 235, 0.82)",
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.card,
          backdropFilter: "blur(14px)",
        }}
      >
        {/* Section nav */}
        <DemoSectionNav />

        {/* Title row */}
        <Typography
          sx={{
            fontFamily: fontMain,
            fontWeight: 800,
            fontSize: { xs: "1.35rem", md: "1.6rem" },
            letterSpacing: "-0.03em",
            color: colors.textMain,
            lineHeight: 1.15,
            mb: 1.5,
          }}
        >
          {t("home.careJourney.title")}
        </Typography>

        {/* Care stage pill selector */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.75,
            mb: 1.5,
          }}
        >
          {CARE_STAGES.map((stage, idx) => {
            const isActive = idx === activeStageIndex;
            return (
              <Button
                key={stage}
                onClick={() => setActiveStageIndex(idx)}
                size="small"
                sx={{
                  fontFamily: fontMain,
                  fontWeight: isActive ? 700 : 500,
                  textTransform: "none",
                  fontSize: "0.82rem",
                  borderRadius: radii.pill,
                  px: 1.75,
                  py: 0.4,
                  color: isActive ? "#fff" : colors.textSec,
                  bgcolor: isActive ? colors.accent : "rgba(44,36,32,0.06)",
                  border: `1px solid ${isActive ? colors.accent : colors.border}`,
                  "&:hover": {
                    bgcolor: isActive ? colors.accent : "rgba(44,36,32,0.10)",
                    color: isActive ? "#fff" : colors.textMain,
                  },
                }}
              >
                {stage}
              </Button>
            );
          })}
        </Box>

        {/* Collapsible recommendation */}
        <Box
          sx={{
            mb: 1.5,
            borderRadius: radii.cardInner,
            border: `1px solid ${colors.border}`,
            bgcolor: colors.beige,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2.5,
              py: 1.25,
              cursor: "pointer",
              "&:hover": { bgcolor: "rgba(44,36,32,0.03)" },
            }}
            onClick={() => setRecommendationOpen((v) => !v)}
          >
            <Typography
              sx={{
                fontFamily: fontMain,
                fontWeight: 700,
                color: colors.accent,
                fontSize: "0.9rem",
              }}
            >
              {`${t("home.recommendation.label")}: ${activeStage}`}
            </Typography>
            <IconButton size="small" sx={{ color: colors.textSec, p: 0.25 }} tabIndex={-1}>
              {recommendationOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
          </Box>

          <Collapse in={recommendationOpen}>
            <Box sx={{ px: 2.5, pb: 2 }}>
              <Typography
                sx={{ fontFamily: fontMain, color: colors.textMain, fontSize: "0.95rem", mb: 1.5 }}
              >
                {t("home.recommendation.suggestion")}
              </Typography>
              <Typography
                sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "0.88rem", mb: 0.5, fontWeight: 600 }}
              >
                {t("home.recommendation.whyLabel")}
              </Typography>
              <Box
                component="ul"
                sx={{ m: 0, pl: 2.5, color: colors.textSec, fontFamily: fontMain, fontSize: "0.88rem" }}
              >
                {t("home.recommendation.whyReasons", { returnObjects: true }).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </Box>
            </Box>
          </Collapse>
        </Box>

        {/* Chat — fills remaining height; height: 100% lets the section inherit a real px value */}
        <Box sx={{ flex: 1, minHeight: 0, height: "100%", display: "flex", flexDirection: "column" }}>
          <QuestionsInTheLoopSection activeStageIndex={activeStageIndex} />
        </Box>
      </Paper>
    </Box>
  );
}
