import React from "react";
import { Box, Button, CssBaseline, GlobalStyles, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InteractiveBackground from "../../pages/LandingPage/utils/InteractiveBackground";
import DemoSectionNav from "../../pages/utility/DemoSectionNav";
import { SURVEY_TOKENS } from "../../pages/UserSurvey/surveyTokens";

const { colors, fontMain, radii, shadows } = SURVEY_TOKENS;

export default function CommunityLayout({ title, subtitle, children }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          minHeight: 0,
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
        <DemoSectionNav />

        {/* Back + title — fixed header, never scrolls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5, flexShrink: 0 }}>
          <Button
            startIcon={<ArrowBackIcon fontSize="small" />}
            onClick={() => navigate("/community")}
            size="small"
            sx={{
              fontFamily: fontMain,
              textTransform: "none",
              fontSize: "0.82rem",
              color: colors.textSec,
              flexShrink: 0,
              "&:hover": { color: colors.accent },
            }}
          >
            {t("community.backToCommunity")}
          </Button>
          {title && (
            <Typography
              component="h1"
              sx={{
                fontFamily: fontMain,
                fontWeight: 800,
                fontSize: { xs: "1.2rem", md: "1.4rem" },
                letterSpacing: "-0.03em",
                color: colors.textMain,
                lineHeight: 1.2,
              }}
            >
              {title}
              {subtitle && (
                <Box
                  component="span"
                  sx={{
                    fontFamily: fontMain,
                    color: colors.textSec,
                    fontSize: "0.85rem",
                    fontWeight: 400,
                    ml: 1.5,
                  }}
                >
                  {subtitle}
                </Box>
              )}
            </Typography>
          )}
        </Box>

        {/* Scrollable content area */}
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {children}
        </Box>
      </Paper>
    </Box>
  );
}
