import React, { useState } from "react";
import { Box, Typography, Button, Dialog, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";
import { useTranslation } from "react-i18next";

const { colors, fontMain, radii, shadows } = SURVEY_TOKENS;

/** Mock consultation summary for demo. Replace with real data when wired to chat. */
const MOCK_SUMMARY = {
  summary:
    "You discussed knee pain after a recent run. We reviewed RICE (rest, ice, compression, elevation) and when to consider seeing a provider if pain persists or swelling increases.",
  symptoms: [
    "Knee pain",
    "Mild swelling",
    "Discomfort when bending",
  ],
  nextSteps: [
    "Continue ice 15–20 min, 3x/day for the next 2–3 days",
    "Avoid high-impact activity until pain improves",
    "Consider OTC anti-inflammatory if no contraindications",
    "Return to chat or see a provider if pain worsens or doesn't improve in a week",
  ],
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontFamily: fontMain,
    borderRadius: radii.button,
    bgcolor: "rgba(255,255,255,0.6)",
    "& fieldset": { borderColor: colors.border },
    "&:hover fieldset": { borderColor: "#C8B9AF" },
    "&.Mui-focused fieldset": {
      borderColor: colors.deepBrown,
      borderWidth: "1.5px",
    },
  },
};

export default function NotesDayNote({ date, onClose, hasContent }) {
  const { t } = useTranslation();
  const [personalNote, setPersonalNote] = useState("");

  const dateStr = date
    ? new Date(date.year, date.month, date.day).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Dialog
      open={Boolean(date)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: radii.card,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.card,
          bgcolor: colors.beige2,
          fontFamily: fontMain,
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            pb: 2,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <Typography
            sx={{
              fontFamily: fontMain,
              fontWeight: 700,
              fontSize: "1.1rem",
              color: colors.textMain,
            }}
          >
            {dateStr}
          </Typography>
          <Button
            size="small"
            onClick={onClose}
            startIcon={<CloseIcon />}
            sx={{
              fontFamily: fontMain,
              textTransform: "none",
              color: colors.textSec,
            }}
          >
            {t("notes.dayNote.close")}
          </Button>
        </Box>

        {hasContent ? (
          <>
            <Typography
              sx={{
                fontFamily: fontMain,
                fontWeight: 600,
                color: colors.accent,
                fontSize: "0.9rem",
                mb: 1,
              }}
            >
              {t("notes.dayNote.consultationSummary")}
            </Typography>
            <Typography
              sx={{
                fontFamily: fontMain,
                color: colors.textMain,
                fontSize: "0.95rem",
                lineHeight: 1.6,
                mb: 2,
              }}
            >
              {MOCK_SUMMARY.summary}
            </Typography>

            <Typography
              sx={{
                fontFamily: fontMain,
                fontWeight: 600,
                color: colors.textMain,
                fontSize: "0.9rem",
                mb: 0.5,
              }}
            >
              {t("notes.dayNote.symptomsDiscussed")}
            </Typography>
            <Box
              component="ul"
              sx={{
                m: 0,
                pl: 2.5,
                mb: 2,
                color: colors.textSec,
                fontFamily: fontMain,
                fontSize: "0.9rem",
              }}
            >
              {MOCK_SUMMARY.symptoms.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </Box>

            <Typography
              sx={{
                fontFamily: fontMain,
                fontWeight: 600,
                color: colors.textMain,
                fontSize: "0.9rem",
                mb: 0.5,
              }}
            >
              {t("notes.dayNote.suggestedNextSteps")}
            </Typography>
            <Box
              component="ul"
              sx={{
                m: 0,
                pl: 2.5,
                mb: 2,
                color: colors.textSec,
                fontFamily: fontMain,
                fontSize: "0.9rem",
              }}
            >
              {MOCK_SUMMARY.nextSteps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </Box>

            <Typography
              sx={{
                fontFamily: fontMain,
                fontWeight: 600,
                color: colors.textMain,
                fontSize: "0.9rem",
                mb: 1,
              }}
            >
              {t("notes.dayNote.yourNotes")}
            </Typography>
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder={t("notes.dayNote.notesPlaceholder")}
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              variant="outlined"
              sx={inputSx}
            />
          </>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography
              sx={{
                fontFamily: fontMain,
                color: colors.textSec,
                fontSize: "0.95rem",
              }}
            >
              {t("notes.dayNote.noSummary")}
            </Typography>
            <Typography
              sx={{
                fontFamily: fontMain,
                color: colors.textSec,
                fontSize: "0.85rem",
                mt: 1,
              }}
            >
              {t("notes.dayNote.noSummaryNote")}
            </Typography>
            <Typography
              sx={{
                fontFamily: fontMain,
                fontWeight: 600,
                color: colors.textMain,
                fontSize: "0.9rem",
                mt: 2,
              }}
            >
              {t("notes.dayNote.yourNotes")}
            </Typography>
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder={t("notes.dayNote.notesPlaceholder")}
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              variant="outlined"
              sx={{ mt: 1, ...inputSx }}
            />
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
