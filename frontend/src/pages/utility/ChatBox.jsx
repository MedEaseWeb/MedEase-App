import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Button, IconButton } from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { io } from "socket.io-client";
import Draggable from "react-draggable";
import Paper from "@mui/material/Paper";

const backendBaseUrl = import.meta.env.VITE_API_URL;

// Create a singleton socket connection to your FastAPI backend.
// Adjust the URL as needed for your environment.
const socket = io(backendBaseUrl, {
  path: "/ws/socket.io",
});

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(true);
  const nodeRef = useRef(null);

  // Set up Socket.IO event listeners.
  useEffect(() => {
    // Log connection status
    socket.on("connect", () => {
      console.log("Connected to backend via Socket.IO");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from backend");
    });

    // Listen for messages from the bot
    socket.on("bot-message", (message) => {
      console.log("🤖 GPT says:", message);
      setMessages((prev) => [...prev, { text: message, sender: "bot" }]);
    });

    // Clean up the event listeners on unmount.
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("bot-message");
    };
  }, []);

  // Function to send a message to the backend.
  const sendMessage = () => {
    if (input.trim() === "") return;
    // Append the user's message locally.
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    // Emit the message to the backend.
    socket.emit("user_message", input);
    setInput("");
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
            fontFamily: "system-ui, sans-serif",
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
            {/* Separate Toggle Button */}
            <IconButton
              className="chatbox-non-drag" // see next section for explanation
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

          {/* Conditionally Render the Rest of the Chat Content */}
          {expanded && (
            <>
              {/* Message list */}
              <Box
                className="chatbox-non-drag" // ensure clicks here don’t trigger dragging
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
                      color: "#212529",
                      fontSize: "15px",
                      lineHeight: "1.4",
                    }}
                  >
                    {msg.text}
                  </Box>
                ))}
              </Box>

              {/* Input box */}
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
                    marginLeft: "10px",
                    backgroundColor: "#027555",
                    color: "white",
                    borderRadius: "10px",
                    padding: "6px 16px",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#00684A",
                    },
                  }}
                >
                  Send
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Draggable>
  );
};

export default Chatbox;
