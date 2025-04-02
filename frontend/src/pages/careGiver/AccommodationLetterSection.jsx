import React, { useState } from "react";
import {
  Typography,
  IconButton,
  Divider,
  Button,
  Box,
  Tooltip,
  TextField,
  Modal,
  Paper,
} from "@mui/material";
import { Chat as ChatIcon } from "@mui/icons-material";

const backendBaseUrl = import.meta.env.VITE_API_URL;

const emailTemplates = [
  { id: "das", label: "To Accessibility Services (DAS)" },
  { id: "professor", label: "To Professors" },
  { id: "employer", label: "To Employers" },
];

const AccommodationLetterSection = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);

  const [formContent, setFormContent] = useState({
    das: {
      to: "accessibility@emory.edu",
      subject: "Documentation for Disability Accommodations",
      content: "Dear Accessibility Services Team,\n\n[Insert student name and details...]",
    },
    professor: {
      to: "",
      subject: "Accommodation Notification",
      content: "Dear Professor [Last Name],\n\n[Insert message content...]",
    },
    employer: {
      to: "",
      subject: "Workplace Accommodation Verification",
      content: "Dear [HR/Team Name],\n\n[Insert message content...]",
    },
  });

  const handleOpenModal = (id) => {
    setCurrentTemplate(id);
    setOpenModal(true);
  };

  const handleInputChange = (id, field, value) => {
    setFormContent((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004D40" }}>
          Accommodation Letter
        </Typography>
        <Tooltip title="Open Chat">
          <IconButton
            sx={{
              width: 48,
              height: 48,
              backgroundColor: "#00897B",
              color: "#fff",
              borderRadius: "50%",
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
              "&:hover": { backgroundColor: "#00695C" },
            }}
          >
            <ChatIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        - We have pre-inserted templates for several institutions <br />
        - Connect to email service
      </Typography>

      {emailTemplates.map(({ id, label }) => (
        <Box key={id} sx={{ mb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleOpenModal(id)}
            sx={{
              textTransform: "none",
              justifyContent: "flex-start",
              backgroundColor: "#00897B",
              color: "#fff",
              borderRadius: 2,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#00695C",
              },
            }}
          >
            {label}
          </Button>
        </Box>
      ))}

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 600,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
          }}
        >
          {currentTemplate && (
            <>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                {emailTemplates.find((t) => t.id === currentTemplate)?.label}
              </Typography>
              <TextField
                fullWidth
                label="To"
                value={formContent[currentTemplate].to}
                onChange={(e) => handleInputChange(currentTemplate, "to", e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Subject"
                value={formContent[currentTemplate].subject}
                onChange={(e) => handleInputChange(currentTemplate, "subject", e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Email Content"
                value={formContent[currentTemplate].content}
                onChange={(e) => handleInputChange(currentTemplate, "content", e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
  variant="contained"
  sx={{
    backgroundColor: "#00897B",
    color: "#fff",
    textTransform: "none",
    borderRadius: 2,
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#00695C",
      transform: "translateY(-2px)",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    },
  }}
  onClick={async () => {
    const { to, subject, content } = formContent[currentTemplate];

    try {
      const res = await fetch(`${backendBaseUrl}/google/send-gmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${yourAuthToken}`, // replace with your actual token or auth logic
        },
        body: JSON.stringify({ to, subject, message: content }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Email sent successfully!");
        setOpenModal(false);
      } else {
        alert("Failed to send email: " + data.detail);
      }
    } catch (error) {
      console.error("Email send error:", error);
      alert("An error occurred while sending the email.");
    }
  }}
>
  Send Email
</Button>

            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AccommodationLetterSection;
