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

const patientFlowSteps = [
  { field: "firstName", prompt: "Please enter patient's first name here:" },
  { field: "lastName", prompt: "Please enter patient's last name here:" },
  { field: "email", prompt: "Please enter patient's email here:" },
  {
    field: "phone",
    prompt:
      "If you would love to, please enter patient's phone number here (optional):",
  },
  {
    field: "notes",
    prompt:
      "Do you have any summary or notes about the patient to share? (optional):",
  },
];

const Chatbox = () => {
  // Main chat state.
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(true);
  const nodeRef = useRef(null);

  // Patient info flow state.
  const [patientFlowActive, setPatientFlowActive] = useState(false);
  const [patientFlowStep, setPatientFlowStep] = useState(0);
  const [patientInfo, setPatientInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

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

    socket.on("connect", () => {
      console.log("Connected to backend via Socket.IO");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from backend");
    });
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

  // Submit patient info to backend.
  // const handleSubmitPatientInfo = async (patientData) => {
  //   try {
  //     // POST to /api/patients using the fields from patientData.
  //     const res = await axios.post(`${backendBaseUrl}/api/patients`, patientData);
  //     console.log("Patient record created:", res.data);
  //     setMessages((prev) => [
  //       ...prev,
  //       { text: "Thank you. Your patient info has been recorded.", sender: "bot" }
  //     ]);
  //   } catch (error) {
  //     console.error("Error submitting patient info:", error);
  //     setMessages((prev) => [
  //       ...prev,
  //       { text: "There was an error recording your patient info. Please try again.", sender: "bot" }
  //     ]);
  //   }
  // };

  // Send message handler.
  const sendMessage = () => {
    if (input.trim() === "") return;

    // If we're in a patient info flow, process the sequential prompts.
    if (patientFlowActive) {
      const currentStep = patientFlowSteps[patientFlowStep];
      // Save the user's response for the current field.
      setPatientInfo((prev) => ({
        ...prev,
        [currentStep.field]: input.trim(),
      }));
      setMessages((prev) => [...prev, { text: input.trim(), sender: "user" }]);
      setInput("");

      if (patientFlowStep < patientFlowSteps.length - 1) {
        const nextStep = patientFlowStep + 1;
        setPatientFlowStep(nextStep);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { text: patientFlowSteps[nextStep].prompt, sender: "bot" },
          ]);
        }, 300);
      } else {
        // All prompts completed; finalize the flow.
        setPatientFlowActive(false);
        setPatientFlowStep(0);
        // Optionally, combine firstName and lastName to form patient_name.
        const patientData = {
          user_id: "current_user_id", // Replace with actual user id from context if needed.
          firstName: patientInfo.firstName,
          lastName: patientInfo.lastName,
          email: patientInfo.email,
          phone: patientInfo.phone,
          notes: patientInfo.notes,
        };
        setMessages((prev) => [
          ...prev,
          { text: "Submitting your patient info...", sender: "bot" },
        ]);
        handleSubmitPatientInfo(patientData);
      }
    } else {
      // Normal chat flow.
      setMessages((prev) => [...prev, { text: input.trim(), sender: "user" }]);
      socket.emit("user_message", input.trim());
      setInput("");
    }
  };

  // Handle selection button clicks.
  const handleSelection = (option) => {
    if (option === "patients") {
      // Start the patient info flow.
      setPatientFlowActive(true);
      setPatientFlowStep(0);
      setPatientInfo({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        notes: "",
      });
      // Push the first prompt into the messages.
      setMessages((prev) => [
        ...prev,
        { text: patientFlowSteps[0].prompt, sender: "bot" },
      ]);
    } else {
      let message = "";
      switch (option) {
        case "reminders":
          message = "Navigate to: Reminders & Tasks";
          break;
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
          position: "absolute",
          top: "150px", // Adjust as needed
          left: "1100px", // Adjust as needed
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
                      "& fieldset": { borderColor: "#ced4da" },
                      "&:hover fieldset": { borderColor: "#198754" },
                      "&.Mui-focused fieldset": { borderColor: "#198754" },
                    },
                  }}
                />
                <Button
                  className="chatbox-non-drag"
                  onClick={sendMessage}
                  sx={{
                    ml: 1,
                    backgroundColor: "#027555",
                    color: "white",
                    borderRadius: "10px",
                    padding: "6px 16px",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": { backgroundColor: "#00684A" },
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
