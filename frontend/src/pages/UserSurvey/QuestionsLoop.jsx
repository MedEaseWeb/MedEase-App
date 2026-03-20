import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SurveyShell from "./SurveyShell";
import { SURVEY_TOKENS } from "./surveyTokens";
import { useNavigate } from "react-router-dom";

/**
 * QuestionsLoop
 * Intentionally separate from the main survey flow.
 * This is a placeholder page where you can mount an ongoing Q&A/chat loop later.
 */
export default function QuestionsLoop() {
  const navigate = useNavigate();
  const { colors, fontMain, radii } = SURVEY_TOKENS;

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
            Questions Loop
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
            This section is separate from the initial survey. Think of it as
            your ongoing check-in space — ask follow-up questions, track
            symptoms, and get guidance whenever you need it.
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
            Next step: we can plug in a structured Q&A loop here (or your
            existing chat component) while keeping the same landing-page visual
            language.
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
            Back to Survey
          </Button>
        </Box>
      </Box>
    </SurveyShell>
  );
}

