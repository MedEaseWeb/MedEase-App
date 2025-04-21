import React, { useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";

const HistoryTab = ({ history }) => {
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const handleOpen = (note) => {
    setSelectedNote(note);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedNote(null);
    setOpen(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 2,
        display: "flex",
        flexDirection: "column",
        // Fixed height so it doesn't grow indefinitely
        maxHeight: 400,
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", mb: 2, fontFamily: "ECA, sans-serif" }}
      >
        <HistoryIcon sx={{ mr: 1 }} /> History
      </Typography>

      {history.length === 0 ? (
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          No history available.
        </Typography>
      ) : (
        history.map((note, index) => (
          <Paper
            key={index}
            elevation={2}
            sx={{
              p: 2,
              mb: 1,
              backgroundColor: "#f1f8e9",
              cursor: "pointer", // Make it look clickable
              "&:hover": {
                backgroundColor: "#e3f2dd",
              },
            }}
            onClick={() => handleOpen(note)}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", fontFamily: "ECA, sans-serif" }}
            >
              {note.medication_name}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
              {note.purpose}
            </Typography>
          </Paper>
        ))
      )}

      {/* Dialog (Modal) to display full note details on top of the current page */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md" // Adjust if you want a smaller or larger dialog
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontFamily: "ECA, sans-serif" }}>
            Medication Note Details
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {selectedNote && (
            <>
              {/* If you have a dedicated AIResultBox/MedicationNoteDisplay, render it here:
                  <AIResultBox note={selectedNote} />
                 Otherwise, display the note fields inline as below.
              */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", fontFamily: "ECA, sans-serif" }}
                >
                  Medication Name
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "ECA, sans-serif" }}
                >
                  {selectedNote.medication_name}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", fontFamily: "ECA, sans-serif" }}
                >
                  Purpose
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "ECA, sans-serif" }}
                >
                  {selectedNote.purpose}
                </Typography>
              </Box>

              {/* Add more fields as needed (common_name, schedule, pharmacy, etc.) */}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default HistoryTab;
