import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Chip,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import socket from "../utility/SocketConnection";

const colors = {
  bg: "#EBE5DE",
  sidebarBg: "#E2DCD5",
  cardBg: "#F5F0EB",
  border: "#E6DCCA",
  textMain: "#2C2420",
  textSec: "#594D46",
  accent: "#A65D37",
  inputBg: "rgba(255,255,255,0.7)",
};

const fontMain = "'Plus Jakarta Sans', sans-serif";

export default function ChatPage() {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.connect();

    const t = setTimeout(() => {
      setMessages([
        {
          text: "Hi! I'm your MedEase AI assistant. I can help you with Emory DAS services, accommodation requests, medications, and more. What can I help you with today?",
          sender: "bot",
          streaming: false,
        },
      ]);
    }, 400);

    socket.on("bot-message", (message) => {
      setIsStreaming(false);
      setMessages((prev) => [
        ...prev,
        { text: message, sender: "bot", streaming: false },
      ]);
    });

    socket.on("bot-token", (token) => {
      setIsStreaming(true);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.streaming) {
          return [...prev.slice(0, -1), { ...last, text: last.text + token }];
        }
        return [...prev, { text: token, sender: "bot", streaming: true }];
      });
    });

    socket.on("bot-done", () => {
      setIsStreaming(false);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.streaming) {
          return [...prev.slice(0, -1), { ...last, streaming: false }];
        }
        return prev;
      });
    });

    return () => {
      clearTimeout(t);
      socket.off("bot-message");
      socket.off("bot-token");
      socket.off("bot-done");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || isStreaming) return;
    setMessages((prev) => [...prev, { text: input.trim(), sender: "user" }]);
    socket.emit("user_message", { content: input.trim(), locale: i18n.language });
    setInput("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 64px)",
        bgcolor: colors.bg,
        overflow: "hidden",
      }}
    >
      {/* Left Sidebar */}
      <Box
        sx={{
          width: 260,
          flexShrink: 0,
          bgcolor: colors.sidebarBg,
          borderRight: `1px solid ${colors.border}`,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          p: 3,
          gap: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: fontMain,
              fontWeight: 600,
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: colors.textSec,
              mb: 1.5,
            }}
          >
            Institution
          </Typography>
          <Box
            sx={{
              p: 2,
              borderRadius: "14px",
              bgcolor: colors.cardBg,
              border: `1px solid ${colors.border}`,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#00684A",
                  boxShadow: "0 0 6px rgba(0,104,74,0.5)",
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontFamily: fontMain,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: colors.textMain,
                }}
              >
                Emory University
              </Typography>
            </Box>
            <Chip
              label="Active"
              size="small"
              sx={{
                bgcolor: "rgba(0,104,74,0.08)",
                color: "#00684A",
                fontFamily: fontMain,
                fontWeight: 600,
                fontSize: "0.72rem",
                height: 22,
                alignSelf: "flex-start",
                border: "1px solid rgba(0,104,74,0.18)",
              }}
            />
          </Box>
        </Box>

        <Box sx={{ flex: 1 }} />

        <Typography
          sx={{
            fontFamily: fontMain,
            fontSize: "0.75rem",
            color: colors.textSec,
            opacity: 0.55,
            lineHeight: 1.5,
          }}
        >
          Powered by MedEase AI
        </Typography>
      </Box>

      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: { xs: 2, md: 4 },
            py: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    maxWidth: { xs: "88%", md: "70%" },
                    px: 2.5,
                    py: 1.5,
                    borderRadius:
                      msg.sender === "user"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    bgcolor:
                      msg.sender === "user" ? colors.textMain : colors.cardBg,
                    border:
                      msg.sender === "bot" ? `1px solid ${colors.border}` : "none",
                    color: msg.sender === "user" ? "#FFF" : colors.textMain,
                    fontFamily: fontMain,
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    boxShadow:
                      msg.sender === "user"
                        ? "0 4px 12px rgba(44,36,32,0.15)"
                        : "0 2px 8px rgba(44,36,32,0.06)",
                    "& p": { m: 0 },
                    "& p + p": { mt: 1 },
                    "& ul, & ol": { pl: 2.5, my: 0.5 },
                    "& li": { mb: 0.25 },
                    "& strong": { fontWeight: 700 },
                    "& code": {
                      bgcolor: "rgba(44,36,32,0.07)",
                      px: 0.75,
                      py: 0.25,
                      borderRadius: "4px",
                      fontSize: "0.88em",
                      fontFamily: "monospace",
                    },
                  }}
                >
                  {msg.sender === "bot" ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                  {msg.streaming && (
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        width: "2px",
                        height: "1em",
                        bgcolor: colors.textSec,
                        ml: 0.5,
                        verticalAlign: "middle",
                        animation: "blink 0.8s steps(1) infinite",
                        "@keyframes blink": {
                          "0%, 100%": { opacity: 1 },
                          "50%": { opacity: 0 },
                        },
                      }}
                    />
                  )}
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Bar */}
        <Box
          sx={{
            px: { xs: 2, md: 4 },
            py: 2.5,
            borderTop: `1px solid ${colors.border}`,
            bgcolor: "rgba(235,229,222,0.9)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "flex-end",
              maxWidth: 860,
              mx: "auto",
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Ask about DAS services, accommodations, medications…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: fontMain,
                  fontSize: "0.95rem",
                  borderRadius: "14px",
                  bgcolor: colors.inputBg,
                  "& fieldset": { borderColor: colors.border },
                  "&:hover fieldset": { borderColor: "#C8B9AF" },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.textMain,
                    borderWidth: "1.5px",
                  },
                },
              }}
            />
            <IconButton
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
              sx={{
                bgcolor: colors.textMain,
                color: "#FFF",
                width: 46,
                height: 46,
                borderRadius: "12px",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(44,36,32,0.18)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#1a1614",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 16px rgba(44,36,32,0.24)",
                },
                "&:disabled": {
                  bgcolor: "rgba(44,36,32,0.12)",
                  color: "rgba(44,36,32,0.3)",
                },
              }}
            >
              <SendIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
