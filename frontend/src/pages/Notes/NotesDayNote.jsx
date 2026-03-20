import React, { useState } from "react";
import { Box, Typography, Button, Dialog, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";

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
            Close
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
              Consultation summary
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
              Symptoms discussed
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
              Suggested next steps
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
              Your notes
            </Typography>
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder="Add personal notes about how you're feeling or follow-up plans…"
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
              No saved consultation summary for this day.
            </Typography>
            <Typography
              sx={{
                fontFamily: fontMain,
                color: colors.textSec,
                fontSize: "0.85rem",
                mt: 1,
              }}
            >
              Summaries appear here when you save a chat from the Home
              assistant.
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
              Your notes
            </Typography>
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder="Add a note for this day…"
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
