import React from "react";
import { Box, Paper, Typography, Tooltip } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";

const { colors, fontMain, radii } = SURVEY_TOKENS;

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatHour(h) {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

export default function NotesWeekView({
  weekDates,
  eventsByDay,
  eventTypes,
  onSlotClick,
  onEventClick,
  isToday,
}) {
  return (
    <Box sx={{ display: "flex", overflow: "auto", minHeight: 520 }}>
      {/* Time column */}
      <Box sx={{ width: 52, flexShrink: 0, pt: 5 }}>
        {HOURS.map((h) => (
          <Box
            key={h}
            sx={{
              height: 48,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-end",
              pr: 1,
              borderTop: h > 0 ? `1px solid ${colors.border}` : "none",
              position: "relative",
            }}
          >
            {h === 6 && (
              <WbSunnyIcon
                sx={{ position: "absolute", left: 2, top: 4, fontSize: 14, color: "rgba(89, 77, 70, 0.5)" }}
                aria-hidden
              />
            )}
            {h === 18 && (
              <DarkModeIcon
                sx={{ position: "absolute", left: 2, top: 4, fontSize: 14, color: "rgba(89, 77, 70, 0.5)" }}
                aria-hidden
              />
            )}
            <Typography
              variant="caption"
              sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "0.7rem" }}
            >
              {formatHour(h)}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Day columns */}
      {weekDates.map((date, dayIndex) => (
        <Box
          key={dayIndex}
          sx={{
            flex: 1,
            minWidth: 100,
            display: "flex",
            flexDirection: "column",
            borderLeft: `1px solid ${colors.border}`,
          }}
        >
          <Box
            sx={{
              height: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: isToday(date) ? "rgba(166, 93, 55, 0.12)" : "transparent",
              borderRadius: radii.button,
              mx: 0.5,
              mb: 0.5,
            }}
          >
            <Typography
              sx={{
                fontFamily: fontMain,
                fontWeight: isToday(date) ? 700 : 500,
                fontSize: "0.85rem",
                color: isToday(date) ? colors.accent : colors.textMain,
              }}
            >
              {DAY_LABELS[dayIndex]}
            </Typography>
            <Typography sx={{ fontFamily: fontMain, fontSize: "0.75rem", color: colors.textSec }}>
              {date.getDate()}
            </Typography>
          </Box>
          <Box sx={{ position: "relative", flex: 1 }}>
            {HOURS.map((hour) => (
              <Box
                key={hour}
                onClick={() => onSlotClick(dayIndex, hour)}
                sx={{
                  height: 48,
                  borderTop: `1px solid ${colors.border}`,
                  "&:hover": { bgcolor: "rgba(166, 93, 55, 0.06)" },
                  cursor: "pointer",
                  position: "relative",
                  bgcolor:
                    hour >= 6 && hour < 18 ? "rgba(255,255,255,0.3)" : "rgba(44,36,32,0.02)",
                }}
                aria-label={`Add event ${DAY_LABELS[dayIndex]} ${hour}:00`}
              />
            ))}
            {(eventsByDay[dayIndex] || []).map((ev) => {
              const typeConfig = eventTypes.find((t) => t.value === ev.type) || eventTypes[0];
              const top = ev.startHour * 48;
              const height = Math.max((ev.endHour - ev.startHour) * 48, 32);
              return (
                <Tooltip key={ev.id} title={ev.title} arrow>
                  <Paper
                    elevation={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(ev);
                    }}
                    sx={{
                      position: "absolute",
                      left: 4,
                      right: 4,
                      top,
                      height: height - 4,
                      bgcolor: typeConfig.color,
                      border: `1px solid ${typeConfig.border}`,
                      borderRadius: 1,
                      p: 0.75,
                      cursor: "pointer",
                      "&:hover": { boxShadow: "0 2px 8px rgba(44,36,32,0.1)" },
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      noWrap
                      sx={{
                        fontFamily: fontMain,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: colors.textMain,
                      }}
                    >
                      {ev.title}
                    </Typography>
                    <Typography
                      sx={{ fontFamily: fontMain, fontSize: "0.65rem", color: colors.textSec }}
                    >
                      {formatHour(ev.startHour)}
                    </Typography>
                  </Paper>
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
