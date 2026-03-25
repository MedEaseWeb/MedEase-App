import React from "react";
import { Box, CssBaseline, GlobalStyles, Paper, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Group from "@mui/icons-material/Group";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import PlaceIcon from "@mui/icons-material/Place";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InteractiveBackground from "../LandingPage/utils/InteractiveBackground";
import DemoSectionNav from "../utility/DemoSectionNav";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";

const { colors, fontMain, radii, shadows } = SURVEY_TOKENS;

export default function CommunityPage() {
  const { t } = useTranslation();

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

        <Typography
          sx={{
            fontFamily: fontMain,
            fontWeight: 800,
            fontSize: { xs: "1.35rem", md: "1.6rem" },
            letterSpacing: "-0.03em",
            color: colors.textMain,
            lineHeight: 1.15,
            mb: 0.5,
          }}
        >
          {t("community.title")}
        </Typography>
        <Typography sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "0.88rem", mb: 2 }}>
          {t("community.description")}
        </Typography>

        {/* 2×2 grid — tighter spacing and padding */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1.5,
          }}
        >
          {hubCards.map((card) => (
            <Paper
              key={card.href}
              component={RouterLink}
              to={card.href}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: radii.cardInner,
                border: `1px solid ${colors.border}`,
                bgcolor: colors.beige,
                display: "flex",
                alignItems: "center",
                gap: 2,
                textDecoration: "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: shadows.lift,
                  transform: "translateY(-2px)",
                  borderColor: colors.accent,
                },
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: radii.button,
                  bgcolor: "rgba(166, 93, 55, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <card.icon sx={{ fontSize: 22, color: colors.accent }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: fontMain,
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: colors.textMain,
                    mb: 0.25,
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fontMain,
                    color: colors.textSec,
                    fontSize: "0.82rem",
                    lineHeight: 1.4,
                  }}
                >
                  {card.description}
                </Typography>
              </Box>
              <ArrowForwardIcon sx={{ fontSize: 18, color: colors.textSec, flexShrink: 0 }} />
            </Paper>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
