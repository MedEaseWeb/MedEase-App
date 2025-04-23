import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Paper,
  CircularProgress,
  Grid,
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import Draggable from "react-draggable";
import socket from "../../pages/utility/SocketConnection";

const Chatbox = () => {
  // Main chat state.
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(true);
  const nodeRef = useRef(null);
  useEffect(() => {
    console.log(nodeRef);
  }, [nodeRef]);

  // Mode flags.
  const [reminderMode, setReminderMode] = useState(false);
  const [patientDataMode, setPatientDataMode] = useState(false);

  // On mount, add a welcome message after a 500ms delay.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Hello, welcome to MedEase, how can I help you?",
          sender: "bot",
        },
      ]);
    }, 500);

    socket.on("connect", () =>
      console.log("Connected to backend via Socket.IO")
    );
    socket.on("disconnect", () => console.log("Disconnected from backend"));
    socket.on("bot-message", (message) => {
      setMessages((prev) => [...prev, { text: message, sender: "bot" }]);
    });

    return () => {
      clearTimeout(timeoutId);
      socket.off("connect");
      socket.off("disconnect");
      socket.off("bot-message");
    };
  }, []);

  // Send message handler.
  const sendMessage = () => {
    if (!input.trim()) return;

    // Reminder flow
    if (reminderMode) {
      setMessages((m) => [...m, { text: input.trim(), sender: "user" }]);
      socket.emit("user_message", { mode: "reminder", content: input.trim() });
      setReminderMode(false);
      setInput("");
      return;
    }

    // Patient data flow
    if (patientDataMode) {
      setMessages((m) => [...m, { text: input.trim(), sender: "user" }]);
      socket.emit("user_message", {
        mode: "patient_data",
        content: input.trim(),
      });
      setPatientDataMode(false);
      setInput("");
      return;
    }

    // Normal chat flow
    setMessages((prev) => [...prev, { text: input.trim(), sender: "user" }]);
    socket.emit("user_message", input.trim());
    setInput("");
  };

  // Handle selection button clicks.
  const handleSelection = (option) => {
    if (option === "patients") {
      // Enter patient data mode
      setPatientDataMode(true);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sure! To retrieve a patient's data, please provide the patient's email and generated key in one message. For example: 'jane.doe@example.com KEY12345'",
          sender: "bot",
        },
      ]);
    } else if (option === "reminders") {
      // Enter reminder mode
      setReminderMode(true);
      setMessages((prev) => [
        ...prev,
        {
          text: `Sure! What would you like to be reminded about,\nand when? (e.g. “Take meds at 9 AM for 5 days”)`,
          sender: "bot",
        },
      ]);
    } else {
      let message = "";
      switch (option) {
        case "diary":
          message = "Navigate to: Picture Diary Upload";
          break;
        case "accommodation":
          message = "Navigate to: Accommodation Letter";
          break;
        default:
          message = "Unknown option selected";
      }
      setMessages((prev) => [...prev, { text: message, sender: "user" }]);
      socket.emit("user_message", message);
    }
  };

  const toggleExpanded = () => setExpanded(!expanded);
  return (
    <Draggable nodeRef={nodeRef} handle=".chatbox-drag-handle" bounds="parent">
      <Paper
        ref={nodeRef}
        elevation={6}
        style={{
          zIndex: 9999,
          position: "fixed",
          top: "100px", // Adjust as needed
          right: "10px", // Adjust as neededm
          width: expanded ? "500px" : "280px",
          height: expanded ? "600px" : "60px",
          overflow: "hidden",
          borderRadius: "20px",
          border: "2px solid #027555",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor: "#ffffff",
            transition: "width 0.3s, height 0.3s",
          }}
        >
          {/* Draggable Header */}
          <Box
            className="chatbox-drag-handle"
            sx={{
              backgroundColor: "#027555",
              color: "white",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Caregiver AI Assistant
            <IconButton
              className="chatbox-non-drag"
              size="small"
              sx={{ color: "white" }}
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded();
              }}
            >
              {expanded ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            </IconButton>
          </Box>

          {expanded && (
            <>
              {/* Chat Message List */}
              <Box
                className="chatbox-non-drag"
                sx={{
                  flex: 1,
                  padding: "12px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  backgroundColor: "#f8f9fa",
                }}
              >
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      padding: "10px 14px",
                      borderRadius: "18px",
                      maxWidth: "75%",
                      alignSelf:
                        msg.sender === "user" ? "flex-end" : "flex-start",
                      backgroundColor:
                        msg.sender === "user" ? "#D1E7DD" : "#E2E3E5",
                      fontSize: "15px",
                      lineHeight: "1.4",
                    }}
                  >
                    {msg.text}
                  </Box>
                ))}
              </Box>

              {/* Input Area */}
              <Box
                className="chatbox-non-drag"
                sx={{
                  display: "flex",
                  padding: "12px",
                  borderTop: "1px solid #dee2e6",
                  backgroundColor: "#ffffff",
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  size="small"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      fontFamily: "ECA, sans-serif",
                      "& fieldset": { borderColor: "#ced4da" },
                      "&:hover fieldset": { borderColor: "#198754" },
                      "&.Mui-focused fieldset": { borderColor: "#198754" },
                    },
                  }}
                />
                <Button
                  className="chatbox-non-drag"
                  onClick={sendMessage}
                  placeholder={
                    reminderMode
                      ? "e.g. Take meds at 9 AM for 5 days"
                      : "Type a message…"
                  }
                  sx={{
                    ml: 1,
                    backgroundColor: "#027555",
                    color: "white",
                    borderRadius: "10px",
                    padding: "6px 16px",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": { backgroundColor: "#00684A" },
                    fontFamily: "ECA, sans-serif",
                  }}
                >
                  Send
                </Button>
              </Box>

              {/* Four Selection Buttons */}
              <Box
                className="chatbox-non-drag"
                sx={{
                  p: 2,
                  borderTop: "1px solid #dee2e6",
                  backgroundColor: "#ffffff",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#00897B",
                        color: "white",
                        borderRadius: 2,
                        fontWeight: "bold",
                        textTransform: "none",
                        fontFamily: "ECA, sans-serif",
                      }}
                      onClick={() => handleSelection("patients")}
                    >
                      My Patients Info Upload
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#00897B",
                        color: "white",
                        borderRadius: 2,
                        fontWeight: "bold",
                        textTransform: "none",
                        fontFamily: "ECA, sans-serif",
                      }}
                      onClick={() => handleSelection("reminders")}
                    >
                      Reminders & Tasks
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#00897B",
                        color: "white",
                        borderRadius: 2,
                        fontWeight: "bold",
                        textTransform: "none",
                        fontFamily: "ECA, sans-serif",
                      }}
                      onClick={() => handleSelection("diary")}
                    >
                      Picture Diary Upload
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#00897B",
                        color: "white",
                        borderRadius: 2,
                        fontWeight: "bold",
                        textTransform: "none",
                        fontFamily: "ECA, sans-serif",
                      }}
                      onClick={() => handleSelection("accommodation")}
                    >
                      Accommodation Letter
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Draggable>
  );
};

export default Chatbox;
