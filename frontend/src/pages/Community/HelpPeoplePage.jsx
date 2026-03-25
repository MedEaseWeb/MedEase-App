import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommunityLayout from "../../components/community/CommunityLayout";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";

const { colors, fontMain, radii } = SURVEY_TOKENS;

const MOCK_DONATIONS = [
  { id: "1", item: "Knee brace", condition: "Like new", location: "Atlanta, GA" },
  { id: "2", item: "Crutches", condition: "Good", location: "Emory area" },
  { id: "3", item: "Ice pack wrap", condition: "Gently used", location: "Decatur, GA" },
  { id: "4", item: "Ankle support", condition: "New", location: "Atlanta, GA" },
];

const CONDITION_OPTIONS = ["New", "Like new", "Good", "Gently used", "Used"];

export default function HelpPeoplePage() {
  const [donateModal, setDonateModal] = useState(false);
  const [posted, setPosted] = useState(false);
  const [form, setForm] = useState({
    item: "",
    condition: "Good",
    notes: "",
    location: "",
    photo: null,
  });

  const handlePost = () => {
    setPosted(true);
    setTimeout(() => {
      setPosted(false);
      setDonateModal(false);
      setForm({ item: "", condition: "Good", notes: "", location: "", photo: null });
    }, 2500);
  };

  return (
    <CommunityLayout
      title="Help People Like Me"
      subtitle="Pass the umbrella forward."
    >
      <Box
        sx={{
          p: 3,
          borderRadius: radii.cardInner,
          border: `1px solid ${colors.border}`,
          bgcolor: "rgba(166, 93, 55, 0.06)",
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontFamily: fontMain,
            fontWeight: 600,
            color: colors.textMain,
            fontSize: "1rem",
            mb: 1,
          }}
        >
          The resources you no longer need could help someone going through the rain.
        </Typography>
        <Typography
          sx={{
            fontFamily: fontMain,
            color: colors.textSec,
            fontSize: "0.9rem",
            lineHeight: 1.5,
          }}
        >
          Donate braces, crutches, ice packs, or other recovery items so another student can focus on healing.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {MOCK_DONATIONS.map((d) => (
          <Grid item xs={12} sm={6} md={3} key={d.id}>
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
                {d.item}
              </Typography>
              <Typography sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "0.85rem", mt: 0.5 }}>
                {d.condition} · {d.location}
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => setDonateModal(true)}
                sx={{
                  mt: 2,
                  fontFamily: fontMain,
                  textTransform: "none",
                  bgcolor: colors.accent,
                  "&:hover": { bgcolor: colors.deepBrown },
                }}
              >
                I can donate this
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {MOCK_DONATIONS.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            borderRadius: radii.cardInner,
            border: `1px dashed ${colors.border}`,
            bgcolor: colors.beige2,
          }}
        >
          <Typography sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "1rem" }}>
            Be the first to give back.
          </Typography>
          <Typography sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "0.9rem", mt: 1 }}>
            Post an item you no longer need and help another student recover.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setDonateModal(true)}
            sx={{
              mt: 2,
              fontFamily: fontMain,
              textTransform: "none",
              bgcolor: colors.accent,
              "&:hover": { bgcolor: colors.deepBrown },
            }}
          >
            Post a donation
          </Button>
        </Box>
      )}

      <Dialog
        open={donateModal}
        onClose={() => !posted && setDonateModal(false)}
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
        <DialogTitle sx={{ fontFamily: fontMain, fontWeight: 700, color: colors.textMain }}>
          {posted ? "Thank you ❤️" : "Post a donation"}
        </DialogTitle>
        <DialogContent>
          {posted ? (
            <Typography sx={{ fontFamily: fontMain, color: colors.textSec, py: 2 }}>
              YOYO just helped another student — thank you!
            </Typography>
          ) : (
            <>
              <Button
                component="label"
                fullWidth
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{
                  py: 2,
                  mb: 2,
                  fontFamily: fontMain,
                  textTransform: "none",
                  borderStyle: "dashed",
                  borderColor: colors.border,
                  "&:hover": { borderColor: colors.accent, bgcolor: "rgba(166, 93, 55, 0.06)" },
                }}
              >
                Drag & drop or click to upload photo
                <input type="file" hidden accept="image/*" onChange={(e) => setForm((f) => ({ ...f, photo: e.target.files[0] }))} />
              </Button>
              <TextField
                fullWidth
                label="Item name"
                value={form.item}
                onChange={(e) => setForm((f) => ({ ...f, item: e.target.value }))}
                margin="dense"
                sx={{ "& .MuiOutlinedInput-root": { fontFamily: fontMain }, "& .MuiInputLabel-root": { fontFamily: fontMain } }}
              />
              <TextField
                select
                fullWidth
                label="Condition"
                value={form.condition}
                onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
                margin="dense"
                sx={{ "& .MuiOutlinedInput-root": { fontFamily: fontMain } }}
              >
                {CONDITION_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt} sx={{ fontFamily: fontMain }}>{opt}</MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Location (e.g. Atlanta, Emory area)"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                margin="dense"
                sx={{ "& .MuiOutlinedInput-root": { fontFamily: fontMain } }}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notes"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                margin="dense"
                sx={{ "& .MuiOutlinedInput-root": { fontFamily: fontMain } }}
              />
            </>
          )}
        </DialogContent>
        {!posted && (
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDonateModal(false)} sx={{ fontFamily: fontMain, textTransform: "none", color: colors.textSec }}>
              Cancel
            </Button>
            <Button
              onClick={handlePost}
              variant="contained"
              sx={{
                fontFamily: fontMain,
                textTransform: "none",
                bgcolor: colors.deepBrown,
                "&:hover": { bgcolor: colors.deepBrown2 },
              }}
            >
              Post donation
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </CommunityLayout>
  );
}
