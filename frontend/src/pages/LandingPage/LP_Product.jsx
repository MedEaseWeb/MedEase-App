import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";

// ─── PALETTE ────────────────────────────────────────────────────────────────
const colors = {
  pageBg: "#EBE5DE",
  cardBg: "#2C2420",
  textMain: "#FFFFFF",
  textSec: "rgba(255, 255, 255, 0.65)",
  accent: "#A65D37",
  pillBg: "rgba(255, 255, 255, 0.08)",
  pillBorder: "rgba(255, 255, 255, 0.1)",
  switcherBg: "#E3DCCA",
  switcherActiveText: "#2C2420",
  switcherInactiveText: "#6B5E55",
  chatBg: "#1A1410",
  agentBubble: "rgba(255, 255, 255, 0.06)",
  agentBorder: "rgba(255, 255, 255, 0.10)",
  userBubble: "rgba(166, 93, 55, 0.20)",
  userBorder: "rgba(166, 93, 55, 0.35)",
  statusRow: "rgba(255, 255, 255, 0.05)",
  actionBg: "rgba(166, 93, 55, 0.14)",
  actionBorder: "rgba(166, 93, 55, 0.30)",
};

const fontMain = "'Plus Jakarta Sans', sans-serif";
const sectionTypes = { rag: "dashboard", chat: "chat" };

// ─── TYPING INDICATOR ────────────────────────────────────────────────────────
const TypingBubble = () => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
    style={{ display: "flex", alignSelf: "flex-start" }}
  >
    <Box
      sx={{
        px: 2,
        py: 1.25,
        borderRadius: "14px 14px 14px 3px",
        bgcolor: colors.agentBubble,
        border: `1px solid ${colors.agentBorder}`,
        display: "flex",
        gap: "5px",
        alignItems: "center",
      }}
    >
      {[0, 0.18, 0.36].map((delay, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 0.9, repeat: Infinity, delay, ease: "easeInOut" }}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.5)",
          }}
        />
      ))}
    </Box>
  </motion.div>
);

// ─── AGENT BUBBLE ────────────────────────────────────────────────────────────
const AgentBubble = ({ text, status, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    style={{ alignSelf: "flex-start", maxWidth: "88%" }}
  >
    {/* Text line */}
    {text && (
      <Box
        sx={{
          px: 2,
          py: 1.25,
          mb: status ? 1 : 0,
          borderRadius: "14px 14px 14px 3px",
          bgcolor: colors.agentBubble,
          border: `1px solid ${colors.agentBorder}`,
        }}
      >
        <Typography sx={{ fontFamily: fontMain, fontSize: "0.85rem", color: colors.textMain, lineHeight: 1.5 }}>
          {text}
        </Typography>
      </Box>
    )}

    {/* Status rows */}
    {status && (
      <Box
        sx={{
          borderRadius: "14px",
          border: `1px solid ${colors.agentBorder}`,
          bgcolor: colors.agentBubble,
          overflow: "hidden",
        }}
      >
        {status.map(({ label, value }, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 2,
              px: 2,
              py: 0.9,
              bgcolor: i % 2 === 0 ? "transparent" : colors.statusRow,
              borderTop: i > 0 ? `1px solid rgba(255,255,255,0.05)` : "none",
            }}
          >
            <Typography sx={{ fontFamily: fontMain, fontSize: "0.72rem", color: colors.textSec, flexShrink: 0 }}>
              {label}
            </Typography>
            <Typography sx={{ fontFamily: fontMain, fontSize: "0.78rem", color: colors.textMain, fontWeight: 600, textAlign: "right" }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
    )}

    {/* Action confirmation card */}
    {action && (
      <Box
        sx={{
          borderRadius: "14px",
          border: `1px solid ${colors.actionBorder}`,
          bgcolor: colors.actionBg,
          px: 2,
          py: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: colors.accent, boxShadow: `0 0 8px ${colors.accent}` }} />
          <Typography sx={{ fontFamily: fontMain, fontWeight: 700, fontSize: "0.82rem", color: colors.accent }}>
            {action.title}
          </Typography>
        </Box>
        {action.items.map((item, i) => (
          <Typography
            key={i}
            sx={{ fontFamily: fontMain, fontSize: "0.77rem", color: colors.textSec, lineHeight: 1.6, pl: 0.5 }}
          >
            · {item}
          </Typography>
        ))}
        <Button
          size="small"
          disableRipple
          sx={{
            mt: 1.25,
            p: 0,
            fontFamily: fontMain,
            fontSize: "0.77rem",
            fontWeight: 700,
            color: colors.accent,
            textTransform: "none",
            minWidth: 0,
            "&:hover": { bgcolor: "transparent", opacity: 0.8 },
          }}
        >
          {action.cta}
        </Button>
      </Box>
    )}
  </motion.div>
);

// ─── USER BUBBLE ─────────────────────────────────────────────────────────────
const UserBubble = ({ text }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    style={{ alignSelf: "flex-end", maxWidth: "80%" }}
  >
    <Box
      sx={{
        px: 2,
        py: 1.25,
        borderRadius: "14px 14px 3px 14px",
        bgcolor: colors.userBubble,
        border: `1px solid ${colors.userBorder}`,
      }}
    >
      <Typography sx={{ fontFamily: fontMain, fontSize: "0.85rem", color: colors.textMain, lineHeight: 1.5 }}>
        {text}
      </Typography>
    </Box>
  </motion.div>
);

// ─── CHAT DEMO ───────────────────────────────────────────────────────────────
// Plays through the scenario automatically, replays every ~10 seconds.
function ChatDemo({ scenarioId, inView }) {
  const { t } = useTranslation();
  const messages = t(`lp.product.demo.${scenarioId}`, { returnObjects: true }) ?? [];
  const [visible, setVisible] = useState([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!inView) return;

    let cancelled = false;
    const ts = [];

    const schedule = (fn, delay) => {
      const id = setTimeout(() => { if (!cancelled) fn(); }, delay);
      ts.push(id);
    };

    setVisible([]);
    setTyping(false);

    let d = 300;

    for (const entry of messages) {
      if (entry.pause) {
        const d1 = d;
        schedule(() => setTyping(true), d1);
        d += entry.pause;
        schedule(() => setTyping(false), d);
      } else {
        const capturedEntry = entry;
        schedule(() => setVisible((v) => [...v, capturedEntry]), d);
        d += entry.gap ?? 800;
      }
    }

    return () => {
      cancelled = true;
      ts.forEach(clearTimeout);
    };
  }, [scenarioId, inView]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visible, typing]);

  return (
    <Box
      ref={scrollRef}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        p: { xs: 2.5, md: 3 },
        overflowY: "auto",
        height: "100%",
      }}
    >
      <AnimatePresence>
        {visible.map((msg, i) =>
          msg.sender === "user" ? (
            <UserBubble key={i} text={msg.text} />
          ) : (
            <AgentBubble key={i} text={msg.text} status={msg.status} action={msg.action} />
          )
        )}
        {typing && <TypingBubble key="typing" />}
      </AnimatePresence>
    </Box>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function LP_Product() {
  const { t } = useTranslation();
  const sections = t("lp.product.sections", { returnObjects: true }).map((s) => ({
    ...s,
    type: sectionTypes[s.id] ?? "dashboard",
  }));
  const [active, setActive] = useState("rag");
  const current = sections.find((s) => s.id === active);

  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-120px" });

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 4, md: 7 },
        px: { xs: 3, md: 8 },
        maxWidth: "1280px",
        mx: "auto",
        fontFamily: fontMain,
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: fontMain,
            fontWeight: 800,
            color: "#2C2420",
            letterSpacing: "-0.04em",
            mb: 2,
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          {t("lp.product.heading")}
        </Typography>
      </Box>

      {/* Tab switcher */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Box
          sx={{
            p: 0.5,
            bgcolor: colors.switcherBg,
            borderRadius: "99px",
            display: "inline-flex",
            position: "relative",
          }}
        >
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <Button
                key={s.id}
                onClick={() => setActive(s.id)}
                disableRipple
                sx={{
                  position: "relative",
                  px: 4,
                  py: 1,
                  borderRadius: "99px",
                  fontSize: "0.95rem",
                  fontFamily: fontMain,
                  fontWeight: 600,
                  textTransform: "none",
                  color: isActive ? colors.switcherActiveText : colors.switcherInactiveText,
                  zIndex: 1,
                  transition: "color 0.2s ease",
                  "&:hover": { color: colors.switcherActiveText },
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeProductTab"
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "#FFF",
                      borderRadius: "99px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      zIndex: -1,
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {s.title}
              </Button>
            );
          })}
        </Box>
      </Box>

      {/* Dark console */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "32px",
          bgcolor: colors.cardBg,
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
          boxShadow: "0 20px 50px rgba(44, 36, 32, 0.15)",
        }}
      >
        {/* LEFT — text + feature pills */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 4, md: 6, lg: 8 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontFamily: fontMain,
                  fontWeight: 700,
                  color: colors.textMain,
                  letterSpacing: "-0.02em",
                  mb: 2,
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                }}
              >
                {current.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontMain,
                  color: colors.textSec,
                  fontSize: "1.1rem",
                  mb: 5,
                  lineHeight: 1.6,
                  maxWidth: "450px",
                }}
              >
                {current.subtitle}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                {current.features.map((item) => (
                  <Box
                    key={item}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: "12px",
                      bgcolor: colors.pillBg,
                      border: `1px solid ${colors.pillBorder}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      transition: "all 0.2s",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: colors.accent,
                        boxShadow: `0 0 10px ${colors.accent}`,
                      }}
                    />
                    <Typography
                      sx={{ fontFamily: fontMain, fontWeight: 500, color: colors.textMain, fontSize: "0.95rem" }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* RIGHT — live chat demo */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            bgcolor: colors.chatBg,
            display: "flex",
            flexDirection: "column",
            height: { xs: "420px", md: "480px" },
          }}
        >
          {/* Top bar — simulated app chrome */}
          <Box
            sx={{
              px: 3,
              py: 1.5,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexShrink: 0,
            }}
          >
            {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
              <Box key={c} sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c, opacity: 0.7 }} />
            ))}
            <Typography
              sx={{
                fontFamily: fontMain,
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.3)",
                ml: 1,
                letterSpacing: "0.05em",
              }}
            >
              MedEase · {t(`lp.product.demo.chrome.${current.id}`)}
            </Typography>
          </Box>

          {/* Chat area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <ChatDemo scenarioId={active} inView={inView} />
            </motion.div>
          </AnimatePresence>

          {/* Bottom input bar — decorative chrome */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                flex: 1,
                height: 36,
                borderRadius: "18px",
                bgcolor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                px: 2,
              }}
            >
              <Typography sx={{ fontFamily: fontMain, fontSize: "0.78rem", color: "rgba(255,255,255,0.2)" }}>
                Type a message…
              </Typography>
            </Box>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: colors.accent,
                opacity: 0.6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ color: "#fff", fontSize: "0.85rem", lineHeight: 1 }}>↑</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
