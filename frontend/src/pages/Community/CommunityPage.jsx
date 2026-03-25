import React from "react";
import {
  Box,
  Button,
  CssBaseline,
  GlobalStyles,
  Paper,
  Typography,
  Grid,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import NotesIcon from "@mui/icons-material/Notes";
import Group from "@mui/icons-material/Group";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import PlaceIcon from "@mui/icons-material/Place";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InteractiveBackground from "../LandingPage/utils/InteractiveBackground";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";

const { colors, fontMain, radii, shadows } = SURVEY_TOKENS;

export default function CommunityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  /** Section nav: User Survey | Home | Community | Notes — matches Home & Notes */
  const sectionNavItems = [
    { label: t("survey.nav.userSurvey"), path: "/survey", icon: <AssignmentIcon /> },
    { label: t("survey.nav.home"), path: "/home", icon: <HomeIcon /> },
    { label: t("survey.nav.community"), path: "/community", icon: <GroupIcon /> },
    { label: t("survey.nav.notes"), path: "/notes", icon: <NotesIcon /> },
  ];

  const hubs = t("community.hubs", { returnObjects: true });
  const hubCards = [
    { title: hubs[0].title, description: hubs[0].description, icon: Group, href: "/community/find-people" },
    { title: hubs[1].title, description: hubs[1].description, icon: VolunteerActivismIcon, href: "/community/help-people" },
    { title: hubs[2].title, description: hubs[2].description, icon: PlaceIcon, href: "/community/local-support" },
    { title: hubs[3].title, description: hubs[3].description, icon: SmartToyIcon, href: "/community/ai-health" },
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
        {/* Section nav — Community active */}
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
                <Box
                  component="span"
                  sx={{ mr: 0.5, display: "flex", alignItems: "center" }}
                >
                  {item.icon}
                </Box>
              )}
              {item.label}
            </Button>
          );})}
        </Box>

        {/* Hero */}
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
          {t("community.title")}
        </Typography>
        <Typography
          sx={{
            fontFamily: fontMain,
            color: colors.textSec,
            fontSize: "0.95rem",
            mb: 3,
          }}
        >
          {t("community.description")}
        </Typography>

        {/* 2×2 grid (desktop) / stack (mobile) */}
        <Grid container spacing={3}>
          {hubCards.map((card, idx) => (
            <Grid item xs={12} sm={6} key={card.href}>
              <Paper
                component={RouterLink}
                to={card.href}
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: radii.cardInner,
                  border: `1px solid ${colors.border}`,
                  bgcolor: colors.beige,
                  boxShadow: "0 10px 30px rgba(44, 36, 32, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: shadows.lift,
                    transform: "translateY(-2px)",
                    borderColor: colors.accent,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: radii.button,
                    bgcolor: "rgba(166, 93, 55, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <card.icon sx={{ fontSize: 28, color: colors.accent }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: fontMain,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: colors.textMain,
                    mb: 1,
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fontMain,
                    color: colors.textSec,
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    mb: 2,
                    flex: 1,
                  }}
                >
                  {card.description}
                </Typography>
                <Button
                  component="span"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    fontFamily: fontMain,
                    textTransform: "none",
                    fontWeight: 600,
                    color: colors.accent,
                    "&:hover": { bgcolor: "rgba(166, 93, 55, 0.08)" },
                  }}
                >
                  {t("community.explore")}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
