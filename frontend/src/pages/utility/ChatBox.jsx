import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

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

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "400px",
        height: "500px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "15px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#ffffff",
        border: "1px solid #ccc",
        zIndex: 1000, // Ensures it stays on top of everything
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          backgroundColor: "#2c7be5",
          color: "white",
          padding: "15px",
          fontWeight: "bold",
          textAlign: "center",
          fontSize: "16px",
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
        }}
      >
        Caregiver Assistant
      </Box>

      {/* Chat Messages */}
      <Box
        sx={{
          flex: 1,
          padding: "10px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              padding: "10px",
              margin: "5px",
              borderRadius: "10px",
              maxWidth: "80%",
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#E4E6EB",
            }}
          >
            {msg.text}
          </Box>
        ))}
      </Box>

      {/* Chat Input */}
      <Box sx={{ display: "flex", padding: "10px", borderTop: "1px solid #ddd", background: "#fff" }}>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          sx={{ flex: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={sendMessage}
          sx={{ marginLeft: "10px" }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chatbox;
