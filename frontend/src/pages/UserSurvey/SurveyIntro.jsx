import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import SurveyShell from "./SurveyShell";
import { SURVEY_TOKENS } from "./surveyTokens";
import { useNavigate } from "react-router-dom";

export default function SurveyIntro() {
  const navigate = useNavigate();
  const { colors, fontMain, radii } = SURVEY_TOKENS;

  return (
    <SurveyShell>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Box sx={{ maxWidth: 820 }}>
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
            Welcome to your personalized recovery journey!
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
            We’ll ask a few optional questions so we can personalize
            recommendations, help you track your progress, and surface relevant
            campus resources.
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
            Everything is optional — you can skip anything that doesn’t feel
            comfortable right now. We’ll still support you.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            gap: 2,
            mt: 1,
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate("/survey/questions")}
            endIcon={<ArrowForwardIcon />}
            sx={{
              fontFamily: fontMain,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: radii.button,
              px: 4.5,
              py: 1.6,
              bgcolor: colors.deepBrown,
              color: "#FFF",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#1a1614",
                transform: "translateY(-2px)",
              },
            }}
          >
            Start Survey
          </Button>

          <Button
            variant="text"
            onClick={() => navigate("/home")}
            endIcon={<ArrowRightAltIcon />}
            sx={{
              fontFamily: fontMain,
              fontWeight: 600,
              textTransform: "none",
              color: colors.textSec,
              px: 2,
              "&:hover": { color: colors.textMain, bgcolor: "transparent" },
            }}
          >
            Skip
          </Button>
        </Box>
      </Box>
    </SurveyShell>
  );
}

