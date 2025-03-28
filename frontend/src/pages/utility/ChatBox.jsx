import React, { useState, useEffect } from "react";
import { Box, TextField, Button, IconButton } from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import io from "socket.io-client";

// const socket = io("http://localhost:8081", {
//   path: "/ws/socket.io", 
// });

const socket = io("localhost:8080")
const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(true); // Controls whether chat is expanded or collapsed

  useEffect(() => {
    socket.on("bot-message", (message) => {
      setMessages((prev) => [...prev, { text: message, sender: "bot" }]);
    });

    return () => socket.off("bot-message");
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    socket.emit("user-message", input);
    setInput("");
  };

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Box
      sx={{
        // Fix at top-right over the dashboard
        position: "fixed",
        top: "100px",
        right: "20px",
        // Dynamically size based on expanded/collapsed state
        width: expanded ? "500px" : "280px",
        height: expanded ? "600px" : "60px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "20px",
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
        backgroundColor: "#ffffff",
        border: "2px solid #027555",
        zIndex: 9999,
        overflow: "hidden",
        fontFamily: "system-ui, sans-serif",
        transition: "width 0.3s, height 0.3s",
      }}
    >
      {/* Header (clickable to expand/collapse) */}
      <Box
        sx={{
          backgroundColor: "#027555",
          color: "white",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "18px",
          fontWeight: "600",
          letterSpacing: "0.5px",
          cursor: "pointer",
        }}
        onClick={toggleExpanded}
      >
        Caregiver AI Assistant
        {/* Arrow icon to indicate expand/collapse */}
        <IconButton
          size="small"
          sx={{ color: "white" }}
          onClick={(e) => {
            // Prevent triggering toggle twice if clicking icon
            e.stopPropagation();
            toggleExpanded();
          }}
        >
          {expanded ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
        </IconButton>
      </Box>

      {/* Chat content only shown if expanded */}
      {expanded && (
        <>
          {/* Message list */}
          <Box
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
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === "user" ? "#D1E7DD" : "#E2E3E5",
                  color: "#212529",
                  fontSize: "15px",
                  lineHeight: "1.4",
                }}
              >
                {msg.text}
              </Box>
            ))}
          </Box>

          {/* Input area */}
          <Box
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
              sx={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ced4da",
                  },
                  "&:hover fieldset": {
                    borderColor: "#198754",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#198754",
                  },
                },
              }}
            />
            <Button
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
  );
};

export default Chatbox;
