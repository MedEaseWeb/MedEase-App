import React from "react";
import { Box, Button, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GavelIcon from "@mui/icons-material/Gavel";
import SurveyShell from "./SurveyShell";
import { SURVEY_TOKENS } from "./surveyTokens";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "./SurveyContext";
import { useTranslation } from "react-i18next";

export default function SurveyWelcome() {
  const navigate = useNavigate();
  const { set } = useSurvey();
  const { colors, fontMain, radii, shadows } = SURVEY_TOKENS;
  const { t } = useTranslation();

  const points = t("survey.welcome.disclaimers", { returnObjects: true });

  const handleAccept = () => {
    set({ acceptedDisclaimer: true });
    navigate("/survey/intro");
  };

  return (
    <SurveyShell>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Box>
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
            {t("survey.welcome.title")}
          </Typography>
          <Typography
            sx={{
              fontFamily: fontMain,
              color: colors.textSec,
              fontSize: "1.05rem",
              lineHeight: 1.7,
              maxWidth: 720,
            }}
          >
            {t("survey.welcome.description")}
          </Typography>
        </Box>

        <Box
          sx={{
            borderRadius: radii.cardInner,
            border: `1px solid ${colors.border}`,
            bgcolor: colors.beige,
            p: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {points.map((p, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  mt: "2px",
                  width: 34,
                  height: 34,
                  borderRadius: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(166, 93, 55, 0.10)",
                  color: colors.accent,
                  border: "1px solid rgba(166, 93, 55, 0.18)",
                  flexShrink: 0,
                }}
              >
                <GavelIcon fontSize="small" />
              </Box>
              <Typography
                sx={{
                  fontFamily: fontMain,
                  color: colors.textMain,
                  fontSize: "1rem",
                  lineHeight: 1.65,
                }}
              >
                <strong>{p}</strong>
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            autoFocus
            variant="contained"
            onClick={handleAccept}
            startIcon={<CheckCircleOutlineIcon />}
            sx={{
              fontFamily: fontMain,
              textTransform: "none",
              fontWeight: 600,
              px: 4.5,
              py: 1.6,
              borderRadius: radii.button,
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
            {t("survey.welcome.accept")}
          </Button>
        </Box>
      </Box>
    </SurveyShell>
  );
}

