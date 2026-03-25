import React from "react";
import { Box, Paper, Typography, Tooltip } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTranslation } from "react-i18next";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";

const { colors, fontMain, radii } = SURVEY_TOKENS;

// Show 7 AM – 10 PM only — 15 hours, much more manageable
const HOUR_START = 7;
const HOUR_END = 22;
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);
const ROW_H = 36; // px per hour slot

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
  const { t } = useTranslation();
  const DAY_LABELS = t("notes.monthView.dayLabels", { returnObjects: true });

  return (
    // Fixed-height scroll container — calendar stays within the page
    <Box sx={{ overflowY: "auto", maxHeight: 420, borderRadius: 2, border: `1px solid ${colors.border}` }}>
      <Box sx={{ display: "flex", minWidth: 520 }}>
        {/* Time column */}
        <Box sx={{ width: 48, flexShrink: 0, pt: "40px" }}>
          {HOURS.map((h) => (
            <Box
              key={h}
              sx={{
                height: ROW_H,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                pr: 1,
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              {h === 7 && (
                <WbSunnyIcon
                  sx={{ position: "absolute", left: 2, fontSize: 11, color: "rgba(89, 77, 70, 0.45)", mt: "2px" }}
                  aria-hidden
                />
              )}
              {h === 18 && (
                <DarkModeIcon
                  sx={{ position: "absolute", left: 2, fontSize: 11, color: "rgba(89, 77, 70, 0.45)", mt: "2px" }}
                  aria-hidden
                />
              )}
              <Typography
                variant="caption"
                sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "0.65rem", lineHeight: 1 }}
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
              minWidth: 60,
              display: "flex",
              flexDirection: "column",
              borderLeft: `1px solid ${colors.border}`,
            }}
          >
            {/* Day header */}
            <Box
              sx={{
                height: 40,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: isToday(date) ? "rgba(166, 93, 55, 0.10)" : "transparent",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <Typography
                sx={{
                  fontFamily: fontMain,
                  fontWeight: isToday(date) ? 700 : 500,
                  fontSize: "0.78rem",
                  color: isToday(date) ? colors.accent : colors.textMain,
                  lineHeight: 1.2,
                }}
              >
                {DAY_LABELS[dayIndex]}
              </Typography>
              <Typography sx={{ fontFamily: fontMain, fontSize: "0.7rem", color: colors.textSec, lineHeight: 1.2 }}>
                {date.getDate()}
              </Typography>
            </Box>

            {/* Hour slots */}
            <Box sx={{ position: "relative", flex: 1 }}>
              {HOURS.map((hour) => (
                <Box
                  key={hour}
                  onClick={() => onSlotClick(dayIndex, hour)}
                  sx={{
                    height: ROW_H,
                    borderTop: `1px solid ${colors.border}`,
                    cursor: "pointer",
                    position: "relative",
                    bgcolor: hour >= 8 && hour < 18 ? "rgba(255,255,255,0.25)" : "rgba(44,36,32,0.015)",
                    "&:hover": { bgcolor: "rgba(166, 93, 55, 0.06)" },
                  }}
                  aria-label={`Add event ${DAY_LABELS[dayIndex]} ${hour}:00`}
                />
              ))}

              {/* Events — only render those in visible range */}
              {(eventsByDay[dayIndex] || [])
                .filter((ev) => ev.startHour < HOUR_END && ev.endHour > HOUR_START)
                .map((ev) => {
                  const typeConfig = eventTypes.find((t) => t.value === ev.type) || eventTypes[0];
                  const clampedStart = Math.max(ev.startHour, HOUR_START);
                  const clampedEnd = Math.min(ev.endHour, HOUR_END);
                  const top = (clampedStart - HOUR_START) * ROW_H;
                  const height = Math.max((clampedEnd - clampedStart) * ROW_H - 2, 20);
                  return (
                    <Tooltip key={ev.id} title={ev.title} arrow>
                      <Paper
                        elevation={0}
                        onClick={(e) => { e.stopPropagation(); onEventClick(ev); }}
                        sx={{
                          position: "absolute",
                          left: 3,
                          right: 3,
                          top,
                          height,
                          bgcolor: typeConfig.color,
                          border: `1px solid ${typeConfig.border}`,
                          borderRadius: 1,
                          px: 0.75,
                          py: 0.25,
                          cursor: "pointer",
                          overflow: "hidden",
                          "&:hover": { boxShadow: "0 2px 8px rgba(44,36,32,0.1)" },
                        }}
                      >
                        <Typography
                          noWrap
                          sx={{ fontFamily: fontMain, fontSize: "0.7rem", fontWeight: 600, color: colors.textMain }}
                        >
                          {ev.title}
                        </Typography>
                        <Typography sx={{ fontFamily: fontMain, fontSize: "0.6rem", color: colors.textSec }}>
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
    </Box>
  );
}
