import React, { useState, useEffect } from "react";
import {
  Typography,
  IconButton,
  Divider,
  Button,
  Box,
  Tooltip,
  TextField,
  Modal,
} from "@mui/material";
import { Chat as ChatIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

const backendBaseUrl = import.meta.env.VITE_API_URL;

const emailTemplates = [
  { id: "das", label: "To Accessibility Services (DAS)" },
  { id: "professor", label: "To Professors" },
  { id: "employer", label: "To Employers" },
];

const AccommodationLetterSection = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [isGmailConnected, setIsGmailConnected] = useState(false);

  useEffect(() => {
    const checkGmailStatus = async () => {
      try {
        const res = await fetch(`${backendBaseUrl}/google/is-gmail-connected`, {
          credentials: "include",
        });
        const data = await res.json();
        setIsGmailConnected(data.isConnected);
      } catch (error) {
        console.error("Failed to check Gmail connection:", error);
      }
    };

    checkGmailStatus();
  }, []);

  const [formContent, setFormContent] = useState({
    das: {
      to: "accessibility@emory.edu",
      subject: "Documentation for Disability Accommodations",
      content:
        `Dear Accessibility Services Team,
I am writing to provide documentation for [Student’s Full Name], who is under my care for [disability/condition]. I am a [professional title], licensed in the state of [State], with experience in treating/advising adolescent and adult populations.
Diagnosis & Background
[Student’s Name] has been diagnosed with [condition], confirmed via [clinical assessments, evaluations, diagnostic criteria used]. This condition substantially limits the student’s ability to [specify major life activities such as learning, concentrating, reading, or attending class].
Current Functional Impact
Academic Challenges: [e.g., difficulty sustaining attention, slower reading speed]


Daily Functioning: [e.g., medical fatigue, executive dysfunction]


Stability: The condition is expected to be [chronic/stable/episodic].


Recommendations for Accommodations
To support equitable academic access, I recommend:
Extended testing time (50% or 100%)


Access to note-taking assistance


Flexibility in attendance policies


Breaks during exams or class sessions


Treatment Plan & Medications
The student is currently being treated with [therapy/medication], which may cause [any side effects, if applicable].
All documentation submitted is confidential and intended solely to support reasonable accommodation decisions under ADA/Section 504.
Please contact me if additional clarification is needed.
Sincerely,
 [Name, Credentials]
 Title / License # / State
 Contact Information
`,
    },
    professor: {
      to: "",
      subject: "Accommodation Notification",
      content: `Dear Professor [Last Name],
This letter is to inform you that [Student’s Full Name], a student in your [Course Name] class, has a documented disability that may affect their academic performance and participation. As the student’s treating professional, I am not disclosing specific medical information but confirming the need for academic accommodations, which are essential for equitable access.
The recommended accommodations may include:
Extended time on tests or assignments


A distraction-reduced testing environment


Flexibility with attendance or participation policies


Use of assistive technologies or note-taking support


These accommodations are in line with ADA and Section 504 and have been submitted to Emory’s Department of Accessibility Services. I appreciate your collaboration in creating an inclusive learning environment.
Should you require more detailed guidance, DAS is available to support implementation while preserving student privacy.
Thank you for your understanding and professionalism.
Sincerely,
 [Name, Credentials]
 Licensed [Psychologist/MD/etc.]
`,
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

  const handleConnectGmail = () => {
    // Simply redirect the user to the connect Gmail endpoint.
    window.location.href = `${backendBaseUrl}/google/connect-gmail`;
  };

  const handleSendEmail = async () => {
    const { to, subject, content } = formContent[currentTemplate];
    // Before attempting to send, check if Gmail is connected.
    if (!isGmailConnected) {
      alert("You need to connect your Gmail account first.");
      window.location.href = `${backendBaseUrl}/google/connect-gmail`;
      return;
    }

    try {
      const res = await fetch(`${backendBaseUrl}/google/send-gmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, subject, message: content }),
        credentials: "include",
      });

      // Handle potential redirect if the backend requires re-authorization.
      if (res.status === 302 || res.status === 307) {
        const redirectUrl = res.headers.get("location");
        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }
      }

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
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
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
        - We have pre-inserted templates for several institutions <br />-
        Connect to email service
      </Typography>

      {!isGmailConnected && (
        <Box sx={{ mb: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleConnectGmail}
            sx={{
              textTransform: "none",
              justifyContent: "center",
              backgroundColor: "#fff",
              color: "#00897B",
              borderRadius: 2,
              fontWeight: "bold",
              border: "2px solid #00897B",
              "&:hover": {
                backgroundColor: "#E6F4F1",
              },
            }}
          >
            Connect Gmail Account
          </Button>
        </Box>
      )}

      {emailTemplates.map(({ id, label }) => (
        <Box key={id} sx={{ mb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleOpenModal(id)}
            sx={{
              textTransform: "none",
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {emailTemplates.find((t) => t.id === currentTemplate)?.label}
                </Typography>
                <IconButton onClick={() => setOpenModal(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* "To" Field: Editable only for professor and employer */}
              <TextField
                fullWidth
                label="To"
                value={formContent[currentTemplate].to}
                onChange={(e) =>
                  handleInputChange(currentTemplate, "to", e.target.value)
                }
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "green",
                    },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "green",
                  },
                }}
                disabled={currentTemplate === "das"}
              />

              <TextField
                fullWidth
                label="Subject"
                value={formContent[currentTemplate].subject}
                onChange={(e) =>
                  handleInputChange(currentTemplate, "subject", e.target.value)
                }
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "green",
                    },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "green",
                  },
                }}
              />

              <TextField
                fullWidth
                multiline
                rows={6}
                label="Email Content"
                value={formContent[currentTemplate].content}
                onChange={(e) =>
                  handleInputChange(currentTemplate, "content", e.target.value)
                }
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "green",
                    },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "green",
                  },
                }}
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
                onClick={handleSendEmail}
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
