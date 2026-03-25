import React from "react";
import { Box, Button, Typography } from "@mui/material";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SurveyShell from "./SurveyShell";
import { SURVEY_TOKENS } from "./surveyTokens";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SurveyEnd() {
  const navigate = useNavigate();
  const { colors, fontMain, radii, shadows } = SURVEY_TOKENS;
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
            {t("survey.end.title")}
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
            {t("survey.end.description")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Button
            autoFocus
            variant="contained"
            startIcon={<QuestionAnswerIcon />}
            onClick={() => navigate("/home")}
            sx={{
              fontFamily: fontMain,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: radii.button,
              px: 4.5,
              py: 1.6,
              bgcolor: colors.deepBrown,
              color: "#FFF",
              boxShadow: shadows.button,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#1a1614",
                transform: "translateY(-2px)",
                boxShadow: "0 15px 35px rgba(44, 36, 32, 0.25)",
              },
            }}
          >
            {t("survey.end.button")}
          </Button>
        </Box>
      </Box>
    </SurveyShell>
  );
}

