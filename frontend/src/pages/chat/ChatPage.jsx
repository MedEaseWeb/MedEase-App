import React, { useState, useEffect, useRef } from "react";
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
import PipelineGraph from "./PipelineGraph";

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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [pipelineSteps, setPipelineSteps] = useState([]);
  const [pipelineOpen, setPipelineOpen] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.connect();

    const t = setTimeout(() => {
      setMessages([{
        text: "Hi! I'm your MedEase AI assistant. I can help you with Emory DAS services, accommodation requests, medications, and more. What can I help you with today?",
        sender: "bot",
        streaming: false,
      }]);
    }, 400);

    socket.on("bot-pipeline", (step) => {
      setPipelineSteps((prev) => {
        const idx = prev.findIndex((s) => s.id === step.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], ...step };
          return updated;
        }
        return [...prev, step];
      });
    });

    socket.on("bot-message", (message) => {
      setIsThinking(false);
      setIsStreaming(false);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.thinking) {
          return [...prev.slice(0, -1), { text: message, sender: "bot", streaming: false }];
        }
        return [...prev, { text: message, sender: "bot", streaming: false }];
      });
    });

    socket.on("bot-token", (token) => {
      setIsThinking(false);
      setIsStreaming(true);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.thinking) {
          return [...prev.slice(0, -1), { text: token, sender: "bot", streaming: true }];
        }
        if (last?.streaming) {
          return [...prev.slice(0, -1), { ...last, text: last.text + token }];
        }
        return [...prev, { text: token, sender: "bot", streaming: true }];
      });
    });

    socket.on("bot-done", () => {
      setIsStreaming(false);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.streaming) {
          return [...prev.slice(0, -1), { ...last, streaming: false }];
        }
        return prev;
      });
    });

    return () => {
      clearTimeout(t);
      socket.off("bot-pipeline");
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
    if (!input.trim() || isStreaming || isThinking) return;
    const text = input.trim();
    setMessages((prev) => [
      ...prev,
      { text, sender: "user" },
      { sender: "bot", thinking: true },
    ]);
    socket.emit("user_message", text);
    setInput("");
    setIsThinking(true);
    setPipelineSteps([]);
  };

  return (
    <Box sx={{
      display: "flex",
      height: "calc(100vh - 64px)",
      bgcolor: colors.bg,
      overflow: "hidden",
    }}>
      {/* Left Sidebar */}
      <Box sx={{
        width: 260,
        flexShrink: 0,
        bgcolor: colors.sidebarBg,
        borderRight: `1px solid ${colors.border}`,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        p: 3,
        gap: 3,
        overflowY: "auto",
      }}>
        {/* Institution */}
        <Box>
          <Typography sx={{
            fontFamily: fontMain, fontWeight: 600,
            fontSize: "0.7rem", letterSpacing: "0.08em",
            textTransform: "uppercase", color: colors.textSec, mb: 1.5,
          }}>
            Institution
          </Typography>
          <Box sx={{
            p: 2, borderRadius: "14px",
            bgcolor: colors.cardBg, border: `1px solid ${colors.border}`,
            display: "flex", flexDirection: "column", gap: 1,
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{
                width: 8, height: 8, borderRadius: "50%",
                bgcolor: "#00684A", boxShadow: "0 0 6px rgba(0,104,74,0.5)",
                flexShrink: 0,
              }} />
              <Typography sx={{
                fontFamily: fontMain, fontWeight: 700,
                fontSize: "0.9rem", color: colors.textMain,
              }}>
                Emory University
              </Typography>
            </Box>
            <Chip
              label="Active"
              size="small"
              sx={{
                bgcolor: "rgba(0,104,74,0.08)", color: "#00684A",
                fontFamily: fontMain, fontWeight: 600,
                fontSize: "0.72rem", height: 22,
                alignSelf: "flex-start",
                border: "1px solid rgba(0,104,74,0.18)",
              }}
            />
          </Box>
        </Box>

        {/* Pipeline graph — appears after first message */}
        <PipelineGraph
          steps={pipelineSteps}
          open={pipelineOpen}
          onToggle={() => setPipelineOpen((v) => !v)}
        />

        <Box sx={{ flex: 1 }} />

        <Typography sx={{
          fontFamily: fontMain, fontSize: "0.75rem",
          color: colors.textSec, opacity: 0.55, lineHeight: 1.5,
        }}>
          Powered by MedEase AI
        </Typography>
      </Box>

      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Messages */}
        <Box sx={{
          flex: 1, overflowY: "auto",
          px: { xs: 2, md: 4 }, py: 3,
          display: "flex", flexDirection: "column", gap: 2,
        }}>
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
                {msg.thinking ? (
                  /* Thinking bubble — replaced by actual response when it arrives */
                  <Box sx={{
                    px: 2.5, py: 1.75,
                    borderRadius: "18px 18px 18px 4px",
                    bgcolor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    boxShadow: "0 2px 8px rgba(44,36,32,0.06)",
                    display: "flex", flexDirection: "column", gap: 1,
                  }}>
                    <Box sx={{ display: "flex", gap: "5px", alignItems: "center" }}>
                    {[0, 1, 2].map((j) => (
                      <Box key={j} sx={{
                        width: 7, height: 7, borderRadius: "50%",
                        bgcolor: colors.accent, opacity: 0.65,
                        animation: `dotBounce 1.1s ease-in-out ${j * 0.18}s infinite`,
                        "@keyframes dotBounce": {
                          "0%, 80%, 100%": { transform: "translateY(0)" },
                          "40%": { transform: "translateY(-5px)" },
                        },
                      }} />
                    ))}
                    </Box>
                    <Typography
                      onClick={() => setPipelineOpen(true)}
                      sx={{
                        fontFamily: fontMain,
                        fontSize: "0.72rem",
                        color: colors.textSec,
                        opacity: 0.5,
                        cursor: "pointer",
                        "&:hover": { opacity: 0.85 },
                        transition: "opacity 0.15s ease",
                      }}
                    >
                      See pipeline ←
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{
                    maxWidth: { xs: "88%", md: "70%" },
                    px: 2.5, py: 1.5,
                    borderRadius: msg.sender === "user"
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                    bgcolor: msg.sender === "user" ? colors.textMain : colors.cardBg,
                    border: msg.sender === "bot" ? `1px solid ${colors.border}` : "none",
                    color: msg.sender === "user" ? "#FFF" : colors.textMain,
                    fontFamily: fontMain, fontSize: "0.95rem", lineHeight: 1.6,
                    boxShadow: msg.sender === "user"
                      ? "0 4px 12px rgba(44,36,32,0.15)"
                      : "0 2px 8px rgba(44,36,32,0.06)",
                    "& p": { m: 0 },
                    "& p + p": { mt: 1 },
                    "& ul, & ol": { pl: 2.5, my: 0.5 },
                    "& li": { mb: 0.25 },
                    "& strong": { fontWeight: 700 },
                    "& code": {
                      bgcolor: "rgba(44,36,32,0.07)",
                      px: 0.75, py: 0.25, borderRadius: "4px",
                      fontSize: "0.88em", fontFamily: "monospace",
                    },
                  }}>
                    {msg.sender === "bot"
                      ? <ReactMarkdown>{msg.text}</ReactMarkdown>
                      : msg.text
                    }
                    {msg.streaming && (
                      <Box component="span" sx={{
                        display: "inline-block", width: "2px", height: "1em",
                        bgcolor: colors.textSec, ml: 0.5, verticalAlign: "middle",
                        animation: "blink 0.8s steps(1) infinite",
                        "@keyframes blink": {
                          "0%, 100%": { opacity: 1 },
                          "50%": { opacity: 0 },
                        },
                      }} />
                    )}
                  </Box>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Bar */}
        <Box sx={{
          px: { xs: 2, md: 4 }, py: 2.5,
          borderTop: `1px solid ${colors.border}`,
          bgcolor: "rgba(235,229,222,0.9)",
          backdropFilter: "blur(12px)",
        }}>
          <Box sx={{
            display: "flex", gap: 1.5, alignItems: "flex-end",
            maxWidth: 860, mx: "auto",
          }}>
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
                  fontFamily: fontMain, fontSize: "0.95rem",
                  borderRadius: "14px", bgcolor: colors.inputBg,
                  "& fieldset": { borderColor: colors.border },
                  "&:hover fieldset": { borderColor: "#C8B9AF" },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.textMain, borderWidth: "1.5px",
                  },
                },
              }}
            />
            <IconButton
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming || isThinking}
              sx={{
                bgcolor: colors.textMain, color: "#FFF",
                width: 46, height: 46, borderRadius: "12px", flexShrink: 0,
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
