import React, { useState, useMemo } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";
import NotesDayNote from "./NotesDayNote";
import { useTranslation } from "react-i18next";

const { colors, fontMain, radii } = SURVEY_TOKENS;

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
  const { t } = useTranslation();
  const DAY_LABELS = t("notes.monthView.dayLabels", { returnObjects: true });
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
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Typography sx={{ fontFamily: fontMain, fontWeight: 700, color: colors.textMain, fontSize: "0.95rem" }}>
          {monthLabel}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          <IconButton size="small" onClick={prevMonth} aria-label="Previous month" sx={{ color: colors.textSec, p: 0.5 }}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <Button size="small" onClick={() => setViewDate(new Date())}
            sx={{ fontFamily: fontMain, textTransform: "none", fontSize: "0.78rem", color: colors.accent, fontWeight: 700, minWidth: 0, px: 1 }}>
            {t("notes.monthView.thisMonth")}
          </Button>
          <IconButton size="small" onClick={nextMonth} aria-label="Next month" sx={{ color: colors.textSec, p: 0.5 }}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Day-of-week header */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5, mb: 0.5 }}>
        {DAY_LABELS.map((label) => (
          <Typography
            key={label}
            sx={{ fontFamily: fontMain, fontWeight: 600, fontSize: "0.7rem", color: colors.textSec, textAlign: "center", py: 0.25 }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      {/* Calendar grid — compact cells */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {grid.map((row, ri) => (
          <Box key={ri} sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5 }}>
            {row.map((day, di) => (
              <Box
                key={di}
                onClick={() => handleSelectDay(day)}
                sx={{
                  aspectRatio: "1",
                  maxHeight: 36,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  cursor: day ? "pointer" : "default",
                  bgcolor: day
                    ? hasNote(day) ? "rgba(166, 93, 55, 0.14)" : "transparent"
                    : "transparent",
                  border: day
                    ? `1px solid ${hasNote(day) ? colors.accent : colors.border}`
                    : "none",
                  "&:hover": day
                    ? { bgcolor: hasNote(day) ? "rgba(166, 93, 55, 0.22)" : "rgba(44, 36, 32, 0.05)" }
                    : {},
                }}
              >
                {day != null && (
                  <>
                    <Typography
                      sx={{ fontFamily: fontMain, fontWeight: hasNote(day) ? 700 : 400, fontSize: "0.82rem", color: hasNote(day) ? colors.accent : colors.textMain }}
                    >
                      {day}
                    </Typography>
                    {hasNote(day) && (
                      <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: colors.accent, mt: 0.15 }} aria-hidden />
                    )}
                  </>
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <Typography sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "0.75rem", mt: 1.5 }}>
        {t("notes.monthView.noteExplanation")}
      </Typography>

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
