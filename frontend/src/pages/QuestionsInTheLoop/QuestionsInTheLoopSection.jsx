import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";

const { colors, fontMain, radii, shadows } = SURVEY_TOKENS;

// Landing/survey card style
const cardSx = {
  p: 3,
  borderRadius: radii.cardInner,
  border: `1px solid ${colors.border}`,
  bgcolor: colors.beige,
  boxShadow: "0 10px 30px rgba(44, 36, 32, 0.08)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

const SUGGESTED_BY_STAGE = {
  "Choose Care": [
    "What is urgent care?",
    "How much does urgent care cost?",
    "Do I need insurance?",
    "What should I bring?",
    "How long will it take?",
  ],
  "Get Care": [
    "What is urgent care?",
    "How much does urgent care cost?",
    "Do I need insurance?",
    "What should I bring?",
    "How long will it take?",
  ],
  Recover: [
    "When should I take my medication?",
    "What can I expect during recovery?",
    "When do I need follow-up care?",
    "When should I see a doctor again?",
  ],
  Identify: [
    "What is urgent care?",
    "How much does urgent care cost?",
    "Do I need insurance?",
    "What should I bring?",
  ],
  Assess: [
    "What is urgent care?",
    "How much does urgent care cost?",
    "Do I need insurance?",
    "What should I bring?",
  ],
};

const MOCK_RESPONSES = {
  "what is urgent care": {
    main: "Urgent Care is for medical issues that need attention soon but are not life-threatening.",
    bullets: [
      { label: "Examples:", items: ["minor fractures", "infections", "moderate pain", "flu or fever"] },
      { label: "Benefits:", items: ["shorter wait times than ER", "lower cost", "walk-in availability"] },
    ],
    followUps: ["How much does urgent care cost?", "Should I go to ER instead?"],
  },
  "how much does urgent care cost": {
    main: "Costs vary by location and service. Typically lower than the ER.",
    bullets: [
      { label: "Rough range:", items: ["visit fee often $100–200+ without insurance", "with insurance: copay may apply"] },
    ],
    followUps: ["Do I need insurance?", "What should I bring?"],
  },
  "do i need insurance": {
    main: "You don’t need insurance to be seen at urgent care, but it usually lowers what you pay.",
    bullets: [
      { label: "With insurance:", items: ["bring your card", "copay or coinsurance may apply"] },
      { label: "Without insurance:", items: ["ask for self-pay pricing", "payment is typically due at visit"] },
    ],
    followUps: ["What should I bring?", "How long will it take?"],
  },
  "what should i bring": {
    main: "Bring ID, insurance card (if you have one), and a list of current medications.",
    bullets: [
      { label: "Helpful:", items: ["photo ID", "insurance card", "medication list", "any recent test results"] },
    ],
    followUps: ["How long will it take?", "Do I need insurance?"],
  },
  "how long will it take": {
    main: "Most urgent care visits are 30 minutes to a few hours, depending on how busy they are.",
    bullets: [
      { label: "Typical:", items: ["check-in and wait", "exam and possibly tests", "discharge with instructions"] },
    ],
    followUps: ["What should I bring?", "What is urgent care?"],
  },
  "when should i take my medication": {
    main: "Follow the instructions on the label or from your provider (e.g. with food, time of day).",
    bullets: [{ label: "Tips:", items: ["set a daily reminder", "don’t skip doses without asking your doctor"] }],
    followUps: ["What can I expect during recovery?", "When should I see a doctor again?"],
  },
  "what can i expect during recovery": {
    main: "Recovery depends on your condition. Your provider should give you a timeline and what’s normal.",
    bullets: [{ label: "General:", items: ["rest as advised", "gradual return to activity", "watch for new or worse symptoms"] }],
    followUps: ["When do I need follow-up care?", "When should I see a doctor again?"],
  },
  "when do i need follow-up care": {
    main: "Your discharge instructions usually say when to follow up. If not, call the clinic to ask.",
    bullets: [{ label: "When to call sooner:", items: ["worsening symptoms", "fever", "new pain or swelling"] }],
    followUps: ["When should I see a doctor again?", "What can I expect during recovery?"],
  },
  "when should i see a doctor again": {
    main: "Follow the follow-up date your provider gave you. Call sooner if symptoms worsen or you’re worried.",
    bullets: [{ label: "Reasons to call earlier:", items: ["fever", "increased pain", "signs of infection", "medication side effects"] }],
    followUps: ["When do I need follow-up care?", "What can I expect during recovery?"],
  },
};

function getResponseForQuestion(question) {
  const key = question.trim().toLowerCase().replace(/\?$/, "");
  for (const [responseKey, data] of Object.entries(MOCK_RESPONSES)) {
    if (key.includes(responseKey) || responseKey.includes(key)) return data;
  }
  return {
    main: "I’m here to help with your care journey. Try one of the suggested questions or ask something specific about your current step.",
    bullets: [],
    followUps: [],
  };
}

// Assistant bubble — warm neutral (beige2), Plus Jakarta, accent for labels
function AssistantBubble({ response }) {
  const { main, bullets, followUps } = response;
  return (
    <Box
      sx={{
        padding: "12px 16px",
        borderRadius: "18px",
        maxWidth: "85%",
        alignSelf: "flex-start",
        backgroundColor: colors.beige2,
        border: `1px solid ${colors.border}`,
        fontSize: "15px",
        lineHeight: 1.5,
        fontFamily: fontMain,
      }}
    >
      <Typography sx={{ fontFamily: fontMain, fontSize: "0.95rem", color: colors.textMain, mb: 1 }}>{main}</Typography>
      {bullets.map((b, i) => (
        <Box key={i} sx={{ mb: 0.5 }}>
          <Typography sx={{ fontFamily: fontMain, fontWeight: 600, fontSize: "0.85rem", color: colors.accent }}>{b.label}</Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, fontSize: "0.9rem", color: colors.textSec }}>
            {b.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </Box>
        </Box>
      ))}
      {followUps.length > 0 && (
        <Typography sx={{ fontFamily: fontMain, fontSize: "0.8rem", color: colors.textSec, mt: 1 }}>
          Suggested follow-up: {followUps.join(" • ")}
        </Typography>
      )}
    </Box>
  );
}

export default function QuestionsInTheLoopSection({ activeStage = "Choose Care" }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const suggestedQuestions = SUGGESTED_BY_STAGE[activeStage] || SUGGESTED_BY_STAGE["Choose Care"];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text) => {
    const question = (text || input).trim();
    if (!question) return;
    setInput("");
    const response = getResponseForQuestion(question);
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: question },
      { sender: "assistant", payload: response },
    ]);
  };

  return (
    <Grid container spacing={2} sx={{ height: "100%", minHeight: 0 }}>
      {/* Left ~70%: Chat */}
      <Grid item xs={12} md={8.4} sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <Paper
          elevation={0}
          sx={{ ...cardSx, flex: 1, minHeight: 0, height: "100%" }}
        >
          <Typography
            sx={{
              fontFamily: fontMain,
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "-0.01em",
              color: colors.textMain,
              mb: 0.25,
              flexShrink: 0,
            }}
          >
            {t("home.qitl.title")}
          </Typography>
          <Typography sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "0.88rem", mb: 1.5, flexShrink: 0 }}>
            {t("home.qitl.description")}
          </Typography>

          {/* Scrollable message area — fills remaining height */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              px: 1.5,
              py: 1.5,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              backgroundColor: colors.bone2,
              borderRadius: 2,
              border: `1px solid ${colors.border}`,
              mb: 1.5,
            }}
          >
            {messages.length === 0 && (
              <Typography
                sx={{
                  fontFamily: fontMain,
                  color: "rgba(89,77,70,0.45)",
                  fontSize: "0.88rem",
                  textAlign: "center",
                  mt: 2,
                }}
              >
                Ask a question or pick one from the right →
              </Typography>
            )}
            {messages.map((msg, index) =>
              msg.sender === "user" ? (
                <Box
                  key={index}
                  sx={{
                    padding: "9px 13px",
                    borderRadius: "16px",
                    maxWidth: "75%",
                    alignSelf: "flex-end",
                    backgroundColor: "rgba(166, 93, 55, 0.12)",
                    border: `1px solid rgba(166, 93, 55, 0.2)`,
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    fontFamily: fontMain,
                    color: colors.textMain,
                  }}
                >
                  {msg.text}
                </Box>
              ) : (
                <AssistantBubble key={index} response={msg.payload} />
              )
            )}
            <div ref={chatEndRef} />
          </Box>

          {/* Input bar */}
          <Box sx={{ display: "flex", gap: 1, pt: 1, borderTop: `1px solid ${colors.border}`, flexShrink: 0 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("home.qitl.placeholder")}
              size="small"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: fontMain,
                  borderRadius: radii.button,
                  bgcolor: "rgba(255,255,255,0.6)",
                  fontSize: "0.9rem",
                  "& fieldset": { borderColor: colors.border },
                  "&:hover fieldset": { borderColor: "#C8B9AF" },
                  "&.Mui-focused fieldset": { borderColor: colors.deepBrown, borderWidth: "1.5px" },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={() => sendMessage()}
              endIcon={<SendIcon />}
              sx={{
                fontFamily: fontMain,
                fontWeight: 600,
                textTransform: "none",
                borderRadius: radii.button,
                px: 2.5,
                flexShrink: 0,
                bgcolor: colors.deepBrown,
                color: "#FFF",
                "&:hover": {
                  bgcolor: "#1a1614",
                  transform: "translateY(-1px)",
                },
              }}
            >
              {t("home.qitl.send")}
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Right ~30%: Suggested questions */}
      <Grid item xs={12} md={3.6} sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <Paper
          elevation={0}
          sx={{ ...cardSx, flex: 1, minHeight: 0, height: "100%", overflowY: "auto" }}
        >
          <Typography
            sx={{
              fontFamily: fontMain,
              fontWeight: 700,
              color: colors.accent,
              fontSize: "0.88rem",
              mb: 1.5,
              flexShrink: 0,
            }}
          >
            {t("home.qitl.commonQuestions")}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {suggestedQuestions.map((q) => (
              <Button
                key={q}
                variant="outlined"
                fullWidth
                onClick={() => sendMessage(q)}
                sx={{
                  fontFamily: fontMain,
                  fontWeight: 500,
                  textTransform: "none",
                  fontSize: "0.82rem",
                  py: 0.9,
                  textAlign: "left",
                  justifyContent: "flex-start",
                  color: colors.textMain,
                  borderColor: colors.border,
                  borderRadius: radii.button,
                  "&:hover": {
                    borderColor: colors.accent,
                    backgroundColor: "rgba(166, 93, 55, 0.06)",
                    color: colors.textMain,
                  },
                }}
              >
                {q}
              </Button>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
