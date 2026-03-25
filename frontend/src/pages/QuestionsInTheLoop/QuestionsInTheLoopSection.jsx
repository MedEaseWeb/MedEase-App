import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";

const { colors, fontMain, radii, shadows } = SURVEY_TOKENS;

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

// stage index → question indices (0-based, matches home.qitl.questions array)
const SUGGESTED_BY_STAGE_INDICES = {
  0: [0, 1, 2, 3],       // Identify
  1: [0, 1, 2, 3],       // Assess
  2: [0, 1, 2, 3, 4],    // Choose Care
  3: [0, 1, 2, 3, 4],    // Get Care
  4: [5, 6, 7, 8],       // Recover
};

// follow-up question indices per response (same across all locales)
const FOLLOW_UP_INDICES = [
  [1],      // 0: what is urgent care
  [2, 3],   // 1: how much does it cost
  [3, 4],   // 2: do i need insurance
  [4, 2],   // 3: what should i bring
  [3, 0],   // 4: how long will it take
  [6, 8],   // 5: when should i take medication
  [7, 8],   // 6: what can i expect during recovery
  [8, 6],   // 7: when do i need follow-up care
  [7, 6],   // 8: when should i see a doctor again
];

function AssistantBubble({ response, followUpLabels, suggestedFollowUpLabel }) {
  const { main, bullets } = response;
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
      {followUpLabels && followUpLabels.length > 0 && (
        <Typography sx={{ fontFamily: fontMain, fontSize: "0.8rem", color: colors.textSec, mt: 1 }}>
          {suggestedFollowUpLabel} {followUpLabels.join(" • ")}
        </Typography>
      )}
    </Box>
  );
}

export default function QuestionsInTheLoopSection({ activeStageIndex = 2 }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const allQuestions = t("home.qitl.questions", { returnObjects: true });
  const mockResponses = t("home.qitl.mockResponses", { returnObjects: true });
  const fallback = { main: t("home.qitl.fallback"), bullets: [] };

  const questionIndices = SUGGESTED_BY_STAGE_INDICES[activeStageIndex] ?? SUGGESTED_BY_STAGE_INDICES[2];
  const suggestedQuestions = questionIndices.map((i) => ({ index: i, label: allQuestions[i] }));

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = (textOrIndex) => {
    if (typeof textOrIndex === "number") {
      const label = allQuestions[textOrIndex];
      const response = mockResponses[textOrIndex] ?? fallback;
      const followUpLabels = (FOLLOW_UP_INDICES[textOrIndex] ?? []).map((i) => allQuestions[i]);
      setMessages((prev) => [...prev, { sender: "user", text: label }, { sender: "assistant", payload: response, followUpLabels }]);
    } else {
      const text = (textOrIndex || input).trim();
      if (!text) return;
      setInput("");
      const matchIndex = allQuestions.findIndex(
        (q) => q.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(q.toLowerCase().replace(/\?/g, ""))
      );
      const response = matchIndex >= 0 ? mockResponses[matchIndex] : fallback;
      const followUpLabels = matchIndex >= 0 ? (FOLLOW_UP_INDICES[matchIndex] ?? []).map((i) => allQuestions[i]) : [];
      setMessages((prev) => [...prev, { sender: "user", text }, { sender: "assistant", payload: response, followUpLabels }]);
    }
  };

  return (
    // Plain flex row — avoids Grid's negative-margin height-inheritance bug
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        height: "100%",
        minHeight: 0,
      }}
    >
      {/* Left: Chat panel — fills available height */}
      <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            flex: 1,
            minHeight: 0,
          }}
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
          <Typography
            sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "0.88rem", mb: 1.5, flexShrink: 0 }}
          >
            {t("home.qitl.description")}
          </Typography>

          {/* Scrollable message area */}
          <Box
            ref={scrollRef}
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
                {t("home.qitl.emptyState")}
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
                <AssistantBubble
                  key={index}
                  response={msg.payload}
                  followUpLabels={msg.followUpLabels}
                  suggestedFollowUpLabel={t("home.qitl.suggestedFollowUp")}
                />
              )
            )}
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
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
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
              onClick={() => sendMessage(input)}
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
                "&:hover": { bgcolor: "#1a1614" },
              }}
            >
              {t("home.qitl.send")}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Right: Suggested questions — fixed width, scrolls independently */}
      <Box
        sx={{
          width: { xs: "100%", md: 220 },
          flexShrink: 0,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
          }}
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
            {suggestedQuestions.map(({ index, label }) => (
              <Button
                key={index}
                variant="outlined"
                fullWidth
                onClick={() => sendMessage(index)}
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
                {label}
              </Button>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
