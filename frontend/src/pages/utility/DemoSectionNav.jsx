import React from "react";
import { Box, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import NotesIcon from "@mui/icons-material/Notes";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";

const { colors, fontMain, radii } = SURVEY_TOKENS;

const HOME_PATHS = ["/home", "/questions-in-the-loop"];

export default function DemoSectionNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const items = [
    { labelKey: "survey.nav.userSurvey", path: "/survey", icon: <AssignmentIcon fontSize="small" /> },
    { labelKey: "survey.nav.home", path: "/home", icon: <HomeIcon fontSize="small" /> },
    { labelKey: "survey.nav.community", path: "/community", icon: <GroupIcon fontSize="small" /> },
    { labelKey: "survey.nav.notes", path: "/notes", icon: <NotesIcon fontSize="small" /> },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 0.5,
        mb: 2,
        pb: 2,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      {items.map(({ labelKey, path, icon }) => {
        const isActive =
          path === "/home" ? HOME_PATHS.includes(pathname) : pathname === path || pathname.startsWith(path + "/");
        return (
          <Button
            key={path}
            onClick={() => navigate(path)}
            startIcon={icon}
            sx={{
              fontFamily: fontMain,
              fontWeight: isActive ? 700 : 500,
              textTransform: "none",
              fontSize: "0.88rem",
              color: isActive ? colors.accent : colors.textSec,
              borderRadius: radii.button,
              px: 1.5,
              py: 0.6,
              minWidth: 0,
              "& .MuiButton-startIcon": { mr: 0.5 },
              "&:hover": {
                color: colors.textMain,
                backgroundColor: "rgba(44, 36, 32, 0.05)",
              },
            }}
          >
            {t(labelKey)}
          </Button>
        );
      })}
    </Box>
  );
}
