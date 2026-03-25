import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import CommunityLayout from "../../components/community/CommunityLayout";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";
import { useTranslation } from "react-i18next";

const { colors, fontMain, radii } = SURVEY_TOKENS;

const MOCK_AI_RESPONSES = {
  "accommodation support": {
    text: "Here's a checklist that often helps when requesting accommodations:",
    checklist: [
      "Get documentation from your provider (diagnosis, limitations, recommended accommodations)",
      "Submit to your school's disability or student access office",
      "Request a meeting to discuss your plan",
      "Follow up in writing if anything is unclear",
    ],
    cta: "Generate email",
  },
  "accommodation": {
    text: "Here's a checklist that often helps when requesting accommodations:",
    checklist: [
      "Get documentation from your provider",
      "Submit to your school's disability office",
      "Request a meeting to discuss your plan",
    ],
    cta: "Generate email",
  },
};

export default function AIHealthPage() {
  const { t } = useTranslation();
  const MOCK_EMAIL = {
    subject: t("community.aiHealth.emailSubject"),
    body: t("community.aiHealth.emailBody"),
  };

  const [messages, setMessages] = useState(() => [{ role: "assistant", text: t("community.aiHealth.welcomeMessage") }]);
  const [input, setInput] = useState("");
  const [draftEmail, setDraftEmail] = useState(null);
  const [copied, setCopied] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, draftEmail]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");

    const lower = trimmed.toLowerCase();
    const hasAccommodation = lower.includes("accommodation");
    const ai = hasAccommodation
      ? MOCK_AI_RESPONSES["accommodation support"] || MOCK_AI_RESPONSES["accommodation"]
      : {
          text: "I can help with accommodation requests, insurance follow-ups, or finding campus resources. Try asking: \u201cI need accommodation support\u201d or \u201cHelp me write an email to my insurance.\u201d",
          checklist: null,
          cta: null,
        };

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: ai.text,
          checklist: ai.checklist,
          cta: ai.cta,
        },
      ]);
    }, 600);
  };

  const showDraft = () => setDraftEmail(MOCK_EMAIL);
  const copyToClipboard = () => {
    if (!draftEmail) return;
    const full = `Subject: ${draftEmail.subject}\n\n${draftEmail.body}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CommunityLayout
      title={t("community.aiHealth.title")}
      subtitle={t("community.aiHealth.subtitle")}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: radii.cardInner,
          border: `1px solid ${colors.border}`,
          bgcolor: colors.beige2,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: 420,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "rgba(166, 93, 55, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SmartToyIcon sx={{ color: colors.accent, fontSize: 24 }} />
          </Box>
          <Typography sx={{ fontFamily: fontMain, fontWeight: 700, color: colors.textMain }}>
            {t("community.aiHealth.title")}
          </Typography>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: radii.button,
                  bgcolor: msg.role === "user" ? "rgba(166, 93, 55, 0.12)" : colors.beige,
                  border: `1px solid ${msg.role === "user" ? "rgba(166, 93, 55, 0.2)" : colors.border}`,
                }}
              >
                <Typography sx={{ fontFamily: fontMain, fontSize: "0.95rem", color: colors.textMain, whiteSpace: "pre-wrap" }}>
                  {msg.text}
                </Typography>
                {msg.checklist && (
                  <Box component="ul" sx={{ m: 0, pl: 2.5, mt: 1, fontFamily: fontMain, fontSize: "0.9rem", color: colors.textSec }}>
                    {msg.checklist.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </Box>
                )}
                {msg.cta && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={showDraft}
                    sx={{
                      mt: 2,
                      fontFamily: fontMain,
                      textTransform: "none",
                      bgcolor: colors.deepBrown,
                      "&:hover": { bgcolor: colors.deepBrown2 },
                    }}
                  >
                    {msg.cta}
                  </Button>
                )}
              </Paper>
            </Box>
          ))}
          {draftEmail && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: radii.button,
                border: `1px solid ${colors.accent}`,
                bgcolor: "rgba(166, 93, 55, 0.06)",
              }}
            >
              <Typography sx={{ fontFamily: fontMain, fontWeight: 600, color: colors.textMain, fontSize: "0.9rem" }}>
                Subject: {draftEmail.subject}
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontMain,
                  fontSize: "0.85rem",
                  color: colors.textSec,
                  mt: 1,
                  whiteSpace: "pre-wrap",
                }}
              >
                {draftEmail.body}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={copyToClipboard}
                  sx={{
                    fontFamily: fontMain,
                    textTransform: "none",
                    color: colors.accent,
                    borderColor: colors.accent,
                    "&:hover": { borderColor: colors.deepBrown },
                  }}
                  variant="outlined"
                >
                  {copied ? t("community.aiHealth.copied") : t("community.aiHealth.copy")}
                </Button>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  sx={{ fontFamily: fontMain, textTransform: "none", color: colors.textSec }}
                >
                  {t("community.aiHealth.edit")}
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    fontFamily: fontMain,
                    textTransform: "none",
                    bgcolor: colors.deepBrown,
                    "&:hover": { bgcolor: colors.deepBrown2 },
                  }}
                >
                  {t("community.aiHealth.send")}
                </Button>
              </Box>
            </Paper>
          )}
          <div ref={endRef} />
        </Box>

        {/* Input */}
        <Box sx={{ p: 2, borderTop: `1px solid ${colors.border}` }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              placeholder={t("community.aiHealth.placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              variant="outlined"
              size="small"
              multiline
              maxRows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: fontMain,
                  borderRadius: radii.button,
                  bgcolor: "rgba(255,255,255,0.8)",
                  "& fieldset": { borderColor: colors.border },
                },
              }}
            />
            <IconButton
              onClick={sendMessage}
              sx={{
                bgcolor: colors.deepBrown,
                color: "#fff",
                "&:hover": { bgcolor: colors.deepBrown2 },
              }}
              aria-label="Send message"
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </CommunityLayout>
  );
}
