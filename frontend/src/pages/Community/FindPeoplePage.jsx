import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommunityLayout from "../../components/community/CommunityLayout";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";

const { colors, fontMain, radii } = SURVEY_TOKENS;

const cardSx = {
  p: 2,
  borderRadius: radii.cardInner,
  border: `1px solid ${colors.border}`,
  bgcolor: colors.beige,
  boxShadow: "0 10px 30px rgba(44, 36, 32, 0.08)",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: colors.accent,
    boxShadow: "0 12px 36px rgba(44, 36, 32, 0.12)",
  },
};

const SUGGESTED_GROUPS = [
  { id: "1", name: "Concussion 101", desc: "Support and tips for concussion recovery." },
  { id: "2", name: "Swimmers Recovery", desc: "For athletes managing shoulder or overuse injuries." },
  { id: "3", name: "Runners Injuries", desc: "Knee, IT band, and running-related support." },
  { id: "4", name: "How to Pay Medical Bills", desc: "Navigating costs and financial options." },
  { id: "5", name: "Negotiating Insurance", desc: "Tips and shared experiences with insurance." },
  { id: "6", name: "Accommodation Letters", desc: "Getting and using academic accommodations." },
];

const MOCK_DISCUSSIONS = [
  { id: "d1", author: "Alex", text: "Has anyone had success with PT for runner's knee? Looking for Emory-area recommendations.", hearts: 4 },
  { id: "d2", author: "Jordan", text: "Yes! I went to the student health PT and they were great. Took about 3 weeks to feel better.", hearts: 8 },
  { id: "d3", author: "Sam", text: "Seconding student health — and they can help with accommodation letters if you need reduced activity.", hearts: 5 },
];

export default function FindPeoplePage() {
  const [search, setSearch] = useState("");
  const [groupModal, setGroupModal] = useState(null);
  const [tab, setTab] = useState(0);
  const [newPost, setNewPost] = useState("");
  const [hearts, setHearts] = useState({ d1: 4, d2: 8, d3: 5 });

  const handleHeart = (id) => {
    setHearts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <CommunityLayout
      title="Find People Like Me"
      subtitle="Connect with others experiencing similar injuries or challenges."
    >
      <TextField
        fullWidth
        placeholder="Search people, injuries, or topics"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: colors.textSec }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            fontFamily: fontMain,
            borderRadius: radii.button,
            bgcolor: "rgba(255,255,255,0.6)",
            "& fieldset": { borderColor: colors.border },
          },
        }}
      />

      <Typography
        sx={{
          fontFamily: fontMain,
          fontWeight: 700,
          color: colors.textMain,
          fontSize: "1rem",
          mb: 2,
        }}
      >
        Suggested Groups
      </Typography>
      <Grid container spacing={2}>
        {SUGGESTED_GROUPS.map((g) => (
          <Grid item xs={12} sm={6} md={4} key={g.id}>
            <Paper
              elevation={0}
              sx={cardSx}
              onClick={() => setGroupModal(g)}
            >
              <Typography
                sx={{
                  fontFamily: fontMain,
                  fontWeight: 700,
                  color: colors.textMain,
                  fontSize: "1rem",
                  mb: 0.5,
                }}
              >
                {g.name}
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontMain,
                  color: colors.textSec,
                  fontSize: "0.85rem",
                  lineHeight: 1.4,
                }}
              >
                {g.desc}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={Boolean(groupModal)}
        onClose={() => setGroupModal(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: radii.card,
            border: `1px solid ${colors.border}`,
            fontFamily: fontMain,
          },
        }}
      >
        {groupModal && (
          <>
            <DialogTitle
              sx={{
                fontFamily: fontMain,
                fontWeight: 700,
                color: colors.textMain,
                pb: 1,
              }}
            >
              {groupModal.name}
            </DialogTitle>
            <DialogContent>
              <Typography
                sx={{
                  fontFamily: fontMain,
                  color: colors.textSec,
                  fontSize: "0.9rem",
                  mb: 2,
                }}
              >
                {groupModal.desc}
              </Typography>
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{
                  "& .MuiTab-root": { fontFamily: fontMain, textTransform: "none" },
                  "& .Mui-selected": { color: colors.accent },
                  "& .MuiTabs-indicator": { backgroundColor: colors.accent },
                }}
              >
                <Tab label="Discussions" />
                <Tab label="Resources" />
                <Tab label="Members" />
              </Tabs>
              {tab === 0 && (
                <Box sx={{ pt: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Share something with the group…"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": { fontFamily: fontMain, borderRadius: radii.button },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => setNewPost("")}
                    sx={{
                      fontFamily: fontMain,
                      textTransform: "none",
                      bgcolor: colors.deepBrown,
                      "&:hover": { bgcolor: colors.deepBrown2 },
                      mb: 2,
                    }}
                  >
                    Post
                  </Button>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {MOCK_DISCUSSIONS.map((d) => (
                      <Paper
                        key={d.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: radii.button,
                          border: `1px solid ${colors.border}`,
                          bgcolor: colors.beige2,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: fontMain,
                            fontWeight: 600,
                            color: colors.textMain,
                            fontSize: "0.9rem",
                          }}
                        >
                          {d.author}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: fontMain,
                            color: colors.textSec,
                            fontSize: "0.9rem",
                            mt: 0.5,
                          }}
                        >
                          {d.text}
                        </Typography>
                        <Button
                          size="small"
                          startIcon={
                            hearts[d.id] > (MOCK_DISCUSSIONS.find((x) => x.id === d.id)?.hearts ?? 0) ? (
                              <FavoriteIcon sx={{ color: colors.accent }} />
                            ) : (
                              <FavoriteBorderIcon />
                            )
                          }
                          onClick={() => handleHeart(d.id)}
                          sx={{
                            fontFamily: fontMain,
                            textTransform: "none",
                            color: colors.textSec,
                            mt: 1,
                            "&:hover": { color: colors.accent },
                          }}
                        >
                          {hearts[d.id]} hearts
                        </Button>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              )}
              {tab === 1 && (
                <Typography sx={{ fontFamily: fontMain, color: colors.textSec, pt: 2 }}>
                  Resources and links will appear here.
                </Typography>
              )}
              {tab === 2 && (
                <Typography sx={{ fontFamily: fontMain, color: colors.textSec, pt: 2 }}>
                  Member list will appear here.
                </Typography>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={() => setGroupModal(null)}
                sx={{ fontFamily: fontMain, textTransform: "none", color: colors.textSec }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </CommunityLayout>
  );
}
