import React from "react";
import { Box, Button, CssBaseline, GlobalStyles, Paper } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import NotesIcon from "@mui/icons-material/Notes";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InteractiveBackground from "../../pages/LandingPage/utils/InteractiveBackground";
import { SURVEY_TOKENS } from "../../pages/UserSurvey/surveyTokens";

const { colors, fontMain, radii, shadows } = SURVEY_TOKENS;

/**
 * Shared shell for Community sub-pages: bone bg, section nav, back to /community, glass card.
 */
export default function CommunityLayout({ title, subtitle, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

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
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: 3,
            pb: 2,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
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
                "&:hover": {
                  color: colors.textMain,
                  backgroundColor: "rgba(44, 36, 32, 0.05)",
                },
              }}
            >
              {item.icon && (
                <Box component="span" sx={{ mr: 0.5, display: "flex", alignItems: "center" }}>
                  {item.icon}
                </Box>
              )}
              {item.label}
            </Button>
          );})}
        </Box>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/community")}
          sx={{
            fontFamily: fontMain,
            textTransform: "none",
            color: colors.textSec,
            mb: 2,
            "&:hover": { color: colors.accent },
          }}
        >
          {t("community.backToCommunity")}
        </Button>

        {title && (
          <Box sx={{ mb: subtitle ? 1 : 2 }}>
            <Box
              component="h1"
              sx={{
                fontFamily: fontMain,
                fontWeight: 800,
                fontSize: { xs: "1.5rem", md: "1.75rem" },
                letterSpacing: "-0.04em",
                color: colors.textMain,
                lineHeight: 1.2,
                m: 0,
              }}
            >
              {title}
            </Box>
            {subtitle && (
              <Box
                sx={{
                  fontFamily: fontMain,
                  color: colors.textSec,
                  fontSize: "0.95rem",
                  mt: 0.5,
                }}
              >
                {subtitle}
              </Box>
            )}
          </Box>
        )}

        {children}
      </Paper>
    </Box>
  );
}
