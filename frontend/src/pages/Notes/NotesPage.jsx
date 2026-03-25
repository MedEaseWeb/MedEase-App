import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  GlobalStyles,
  Paper,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChatIcon from "@mui/icons-material/Chat";
import InteractiveBackground from "../LandingPage/utils/InteractiveBackground";
import DemoSectionNav from "../utility/DemoSectionNav";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";
import NotesCalendar from "./NotesCalendar";
import NotesMonthView from "./NotesMonthView";

const { colors, fontMain, radii, shadows } = SURVEY_TOKENS;

/** Card style aligned with QuestionsInTheLoop and SurveyShell. */
const cardSx = {
  p: 3,
  borderRadius: radii.cardInner,
  border: `1px solid ${colors.border}`,
  bgcolor: colors.beige,
  boxShadow: "0 10px 30px rgba(44, 36, 32, 0.08)",
  display: "flex",
  flexDirection: "column",
};

export default function NotesPage() {
  const { t } = useTranslation();
  const [notesTab, setNotesTab] = useState(0);

  const notesTabs = t("notes.tabs", { returnObjects: true });

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
        <DemoSectionNav />

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
          {t("notes.title")}
        </Typography>

        <Typography
          sx={{
            fontFamily: fontMain,
            color: colors.textSec,
            fontSize: "0.95rem",
            mb: 3,
          }}
        >
          {t("notes.description")}
        </Typography>

        <Tabs
          value={notesTab}
          onChange={(_, v) => setNotesTab(v)}
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              fontFamily: fontMain,
              textTransform: "none",
              fontWeight: 600,
            },
            "& .Mui-selected": { color: colors.accent },
            "& .MuiTabs-indicator": { backgroundColor: colors.accent },
          }}
        >
          <Tab
            icon={<CalendarMonthIcon />}
            iconPosition="start"
            label={notesTabs[0]}
          />
          <Tab icon={<ChatIcon />} iconPosition="start" label={notesTabs[1]} />
        </Tabs>

        {notesTab === 0 && <NotesCalendar cardSx={cardSx} />}
        {notesTab === 1 && <NotesMonthView cardSx={cardSx} />}
      </Paper>
    </Box>
  );
}
