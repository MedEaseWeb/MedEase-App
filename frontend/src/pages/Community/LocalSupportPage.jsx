import React, { useState } from "react";
import { Box, Paper, Typography, Button, Chip, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import CommunityLayout from "../../components/community/CommunityLayout";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";

const { colors, fontMain, radii } = SURVEY_TOKENS;

const FILTERS = [
  { id: "all", label: "All" },
  { id: "free", label: "Free" },
  { id: "emory", label: "Emory" },
  { id: "atlanta", label: "Atlanta" },
  { id: "paid", label: "Paid" },
];

const MOCK_RESOURCES = [
  { id: "1", name: "Emory Student Government", desc: "Student advocacy and resources.", location: "Emory University", type: "emory", contact: "Contact via campus portal" },
  { id: "2", name: "Student Health Center", desc: "Medical and mental health services for students.", location: "Emory University", type: "emory", contact: "404-727-7551" },
  { id: "3", name: "Disability Support Office", desc: "Academic accommodations and support.", location: "Emory University", type: "emory", contact: "disability@emory.edu" },
  { id: "4", name: "Atlanta Community Food Bank", desc: "Food assistance and nutrition programs.", location: "Atlanta, GA", type: "free", contact: "Visit site" },
  { id: "5", name: "Grady Health System", desc: "Public hospital system; financial assistance available.", location: "Atlanta, GA", type: "atlanta", contact: "Visit site" },
  { id: "6", name: "Crisis Line", desc: "24/7 mental health and crisis support.", location: "National", type: "free", contact: "988" },
];

export default function LocalSupportPage() {
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);

  const filtered =
    filter === "all"
      ? MOCK_RESOURCES
      : MOCK_RESOURCES.filter((r) => r.type === filter);

  return (
    <CommunityLayout
      title="Local Support"
      subtitle="Discover Emory and local Atlanta resources that can help you."
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
        {FILTERS.map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            onClick={() => setFilter(f.id)}
            sx={{
              fontFamily: fontMain,
              bgcolor: filter === f.id ? "rgba(166, 93, 55, 0.14)" : colors.beige2,
              border: `1px solid ${filter === f.id ? colors.accent : colors.border}`,
              "&:hover": { bgcolor: "rgba(166, 93, 55, 0.08)" },
            }}
          />
        ))}
      </Box>

      <Grid container spacing={2}>
        {filtered.map((r) => (
          <Grid item xs={12} sm={6} md={4} key={r.id}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: radii.cardInner,
                border: `1px solid ${colors.border}`,
                bgcolor: colors.beige,
                boxShadow: "0 10px 30px rgba(44, 36, 32, 0.08)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Typography
                sx={{
                  fontFamily: fontMain,
                  fontWeight: 700,
                  color: colors.textMain,
                  fontSize: "1rem",
                }}
              >
                {r.name}
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontMain,
                  color: colors.textSec,
                  fontSize: "0.85rem",
                  mt: 0.5,
                  lineHeight: 1.4,
                  flex: 1,
                }}
              >
                {r.desc}
              </Typography>
              <Typography sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "0.8rem", mt: 1 }}>
                {r.location}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setDetail(r)}
                sx={{
                  mt: 2,
                  fontFamily: fontMain,
                  textTransform: "none",
                  borderColor: colors.accent,
                  color: colors.accent,
                  "&:hover": { borderColor: colors.deepBrown, bgcolor: "rgba(44, 36, 32, 0.05)" },
                }}
              >
                Contact
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: radii.card,
            border: `1px solid ${colors.border}`,
            fontFamily: fontMain,
          },
        }}
      >
        {detail && (
          <>
            <DialogTitle sx={{ fontFamily: fontMain, fontWeight: 700, color: colors.textMain }}>
              {detail.name}
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "0.9rem", mb: 1 }}>
                {detail.desc}
              </Typography>
              <Typography sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "0.9rem" }}>
                {detail.location}
              </Typography>
              <Typography sx={{ fontFamily: fontMain, fontWeight: 600, color: colors.textMain, mt: 2 }}>
                Contact
              </Typography>
              <Typography sx={{ fontFamily: fontMain, color: colors.textSec }}>
                {detail.contact}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={() => setDetail(null)}
                sx={{ fontFamily: fontMain, textTransform: "none", color: colors.textSec }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                sx={{
                  fontFamily: fontMain,
                  textTransform: "none",
                  bgcolor: colors.deepBrown,
                  "&:hover": { bgcolor: colors.deepBrown2 },
                }}
              >
                Visit site
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </CommunityLayout>
  );
}
