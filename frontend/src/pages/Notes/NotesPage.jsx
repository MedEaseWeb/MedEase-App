import React, { useState } from "react";
import { Box, CssBaseline, GlobalStyles, Paper, Tabs, Tab } from "@mui/material";
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

const cardSx = {
  p: 2,
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

        {/* Tabs — textColor="inherit" prevents MUI default blue */}
        <Tabs
          value={notesTab}
          onChange={(_, v) => setNotesTab(v)}
          textColor="inherit"
          sx={{
            mb: 1.5,
            flexShrink: 0,
            minHeight: 36,
            "& .MuiTab-root": {
              fontFamily: fontMain,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.88rem",
              minHeight: 36,
              py: 0.5,
              color: colors.textSec,
            },
            "& .Mui-selected": { color: colors.accent },
            "& .MuiTabs-indicator": { backgroundColor: colors.accent },
          }}
        >
          <Tab icon={<CalendarMonthIcon fontSize="small" />} iconPosition="start" label={notesTabs[0]} />
          <Tab icon={<ChatIcon fontSize="small" />} iconPosition="start" label={notesTabs[1]} />
        </Tabs>

        {/* Scrollable tab content */}
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {notesTab === 0 && <NotesCalendar cardSx={cardSx} />}
          {notesTab === 1 && <NotesMonthView cardSx={cardSx} />}
        </Box>
      </Paper>
    </Box>
  );
}
