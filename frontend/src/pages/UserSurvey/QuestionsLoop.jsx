import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SurveyShell from "./SurveyShell";
import { SURVEY_TOKENS } from "./surveyTokens";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * QuestionsLoop
 * Intentionally separate from the main survey flow.
 * This is a placeholder page where you can mount an ongoing Q&A/chat loop later.
 */
export default function QuestionsLoop() {
  const navigate = useNavigate();
  const { colors, fontMain, radii } = SURVEY_TOKENS;
  const { t } = useTranslation();

  return (
    <SurveyShell>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Box sx={{ maxWidth: 860 }}>
          <Typography
            sx={{
              fontFamily: fontMain,
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "2.6rem" },
              letterSpacing: "-0.04em",
              color: colors.textMain,
              lineHeight: 1.1,
              mb: 1.5,
            }}
          >
            {t("survey.questionsLoop.title")}
          </Typography>
          <Typography
            sx={{
              fontFamily: fontMain,
              color: colors.textSec,
              fontSize: "1.05rem",
              lineHeight: 1.75,
              maxWidth: 760,
            }}
          >
            {t("survey.questionsLoop.description")}
          </Typography>
        </Box>

        <Box
          sx={{
            borderRadius: radii.cardInner,
            border: `1px solid ${colors.border}`,
            bgcolor: colors.beige,
            p: { xs: 3, md: 4 },
          }}
        >
          <Typography
            sx={{
              fontFamily: fontMain,
              color: colors.textSec,
              fontSize: "0.98rem",
              lineHeight: 1.7,
            }}
          >
            {t("survey.questionsLoop.note")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/survey/intro")}
            sx={{
              fontFamily: fontMain,
              fontWeight: 600,
              textTransform: "none",
              color: colors.textSec,
              "&:hover": { color: colors.textMain, bgcolor: "transparent" },
            }}
          >
            {t("survey.questionsLoop.backButton")}
          </Button>
        </Box>
      </Box>
    </SurveyShell>
  );
}

