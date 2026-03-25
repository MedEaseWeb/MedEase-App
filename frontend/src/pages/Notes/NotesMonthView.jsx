import React, { useState, useMemo } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";
import NotesDayNote from "./NotesDayNote";

const { colors, fontMain, radii } = SURVEY_TOKENS;

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Mock: days that have saved chat summaries (from MedEase Home assistant). */
const MOCK_DAYS_WITH_NOTES = [3, 7, 14, 18, 21, 25];

function getMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const daysInMonth = last.getDate();
  const total = startPad + daysInMonth;
  const rows = Math.ceil(total / 7);
  const grid = [];
  let day = 1;
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < 7; c++) {
      const cellIndex = r * 7 + c;
      if (cellIndex < startPad || day > daysInMonth) {
        row.push(null);
      } else {
        row.push(day++);
      }
    }
    grid.push(row);
  }
  return grid;
}

export default function NotesMonthView({ cardSx }) {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);

  const hasNote = (day) => MOCK_DAYS_WITH_NOTES.includes(day);

  const prevMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1));
  const nextMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1));

  const handleSelectDay = (day) => {
    if (!day) return;
    setSelectedDate({ year, month, day });
  };

  return (
    <Box sx={{ ...cardSx }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: fontMain,
            fontWeight: 700,
            color: colors.textMain,
            fontSize: "1.1rem",
          }}
        >
          {monthLabel}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={prevMonth}
            aria-label="Previous month"
            sx={{ color: colors.textSec }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Button
            size="small"
            onClick={() => setViewDate(new Date())}
            sx={{
              fontFamily: fontMain,
              textTransform: "none",
              color: colors.accent,
              fontWeight: 600,
            }}
          >
            This month
          </Button>
          <IconButton
            size="small"
            onClick={nextMonth}
            aria-label="Next month"
            sx={{ color: colors.textSec }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      <Typography
        sx={{
          fontFamily: fontMain,
          color: colors.textSec,
          fontSize: "0.85rem",
          mb: 2,
        }}
      >
        Days with a dot have a saved consultation summary. Click a date to open
        that day&apos;s note.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0.5,
          mb: 0.5,
        }}
      >
        {DAY_LABELS.map((label) => (
          <Typography
            key={label}
            sx={{
              fontFamily: fontMain,
              fontWeight: 600,
              fontSize: "0.75rem",
              color: colors.textSec,
              textAlign: "center",
              py: 0.5,
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {grid.map((row, ri) => (
          <Box
            key={ri}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 0.5,
            }}
          >
            {row.map((day, di) => (
              <Box
                key={di}
                onClick={() => handleSelectDay(day)}
                sx={{
                  aspectRatio: "1",
                  maxHeight: 44,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: radii.button,
                  cursor: day ? "pointer" : "default",
                  bgcolor: day
                    ? hasNote(day)
                      ? "rgba(166, 93, 55, 0.14)"
                      : "transparent"
                    : "transparent",
                  border: day
                    ? `1px solid ${hasNote(day) ? colors.accent : colors.border}`
                    : "none",
                  "&:hover": day
                    ? {
                        bgcolor: hasNote(day)
                          ? "rgba(166, 93, 55, 0.2)"
                          : "rgba(44, 36, 32, 0.05)",
                      }
                    : {},
                }}
              >
                {day != null && (
                  <>
                    <Typography
                      sx={{
                        fontFamily: fontMain,
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        color: colors.textMain,
                      }}
                    >
                      {day}
                    </Typography>
                    {hasNote(day) && (
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: colors.accent,
                          mt: 0.25,
                        }}
                        aria-hidden
                      />
                    )}
                  </>
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {selectedDate && (
        <NotesDayNote
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
          hasContent={hasNote(selectedDate.day)}
        />
      )}
    </Box>
  );
}
