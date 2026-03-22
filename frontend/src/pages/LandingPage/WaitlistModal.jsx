import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const colors = {
  textMain: "#2C2420",
  textSec: "#594D46",
  accent: "#A65D37",
  border: "#E6DCCA",
  bg: "#F7F2ED",
  primary: "#2C2420",
};

const fontMain = "'Plus Jakarta Sans', sans-serif";

const API_URL = import.meta.env.VITE_API_URL;

// Emails that skip the API and go straight to success (demos, internal accounts)
const DEMO_EMAILS = new Set(["medease111@gmail.com"]);

export default function WaitlistModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("patient");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async () => {
    if (!name.trim() || !isValidEmail(email) || !role) return;

    setStatus("loading");
    setErrorMsg("");

    if (DEMO_EMAILS.has(email.trim().toLowerCase())) {
      setStatus("success");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/waitlist/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), role }),
      });

      if (res.status === 409) {
        setErrorMsg("This email is already on the waitlist.");
        setStatus("error");
        return;
      }
      if (!res.ok) {
        setErrorMsg("Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Could not connect. Please try again.");
      setStatus("error");
    }
  };

  const handleClose = () => {
    // Reset on close
    setName("");
    setEmail("");
    setRole("patient");
    setStatus("idle");
    setErrorMsg("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      disableScrollLock
      slotProps={{
        backdrop: {
          sx: { backgroundColor: "rgba(44, 36, 32, 0.18)", backdropFilter: "blur(2px)" },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "20px",
          bgcolor: colors.bg,
          p: 1,
          fontFamily: fontMain,
        },
      }}
    >
      <DialogContent sx={{ px: 4, pt: 4, pb: 4 }}>
        {/* Close button */}
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: colors.textSec,
          }}
        >
          <X size={18} />
        </IconButton>

        {status === "success" ? (
          /* --- SUCCESS STATE --- */
          <Box sx={{ py: 2, overflow: "hidden" }}>
            {/* Title — each word rushes in from depth */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.28em", mb: 1.5 }}>
              {"You're on the list.".split(" ").map((word, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 2.4, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ display: "inline-block", originX: "50%", originY: "50%" }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: fontMain,
                      fontWeight: 700,
                      fontSize: "1.3rem",
                      color: colors.textMain,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.3,
                    }}
                  >
                    {word}
                  </Typography>
                </motion.div>
              ))}
            </Box>

            {/* Body + contact — slides up after title lands */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <Typography
                sx={{
                  fontFamily: fontMain,
                  color: colors.textSec,
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  mb: 3,
                }}
              >
                We recorded your spot and will follow up at{" "}
                <Box component="span" sx={{ fontWeight: 600, color: colors.textMain }}>
                  {email}
                </Box>
                . In the meantime, feel free to reach out directly.
              </Typography>

              <Box
                sx={{
                  borderTop: `1px solid ${colors.border}`,
                  pt: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.75,
                }}
              >
                <Typography sx={{ fontFamily: fontMain, fontSize: "0.82rem", fontWeight: 700, color: colors.textSec, textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5 }}>
                  Contact
                </Typography>
                <Typography sx={{ fontFamily: fontMain, fontSize: "0.92rem", color: colors.textMain }}>
                  medease111@gmail.com
                </Typography>
                <Typography sx={{ fontFamily: fontMain, fontSize: "0.92rem", color: colors.textMain }}>
                  Emory University — Atlanta, GA
                </Typography>
              </Box>

              <Button
                onClick={handleClose}
                sx={{
                  mt: 3.5,
                  px: 4,
                  py: 1.2,
                  bgcolor: colors.primary,
                  color: "#FFF",
                  borderRadius: "12px",
                  fontFamily: fontMain,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#1a1614" },
                }}
              >
                Close
              </Button>
            </motion.div>
          </Box>
        ) : (
          /* --- FORM STATE --- */
          <>
            <Typography
              sx={{
                fontFamily: fontMain,
                fontWeight: 800,
                fontSize: "1.4rem",
                color: colors.textMain,
                letterSpacing: "-0.03em",
                mb: 0.5,
              }}
            >
              Join the Waitlist
            </Typography>
            <Typography
              sx={{
                fontFamily: fontMain,
                color: colors.textSec,
                fontSize: "0.9rem",
                mb: 3,
              }}
            >
              Be among the first to access MedEase.
            </Typography>

            {/* Name */}
            <TextField
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
              sx={fieldSx}
            />

            {/* Email */}
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              size="small"
              sx={{ ...fieldSx, mt: 2 }}
            />

            {/* Role */}
            <Typography
              sx={{
                fontFamily: fontMain,
                fontSize: "0.82rem",
                color: colors.textSec,
                fontWeight: 600,
                mt: 2.5,
                mb: 1,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              I am a...
            </Typography>
            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={(_, val) => val && setRole(val)}
              fullWidth
              size="small"
              sx={{ mb: 0.5 }}
            >
              {[
                { value: "patient", label: "Patient / Student" },
                { value: "caregiver", label: "Caregiver" },
                { value: "other", label: "Other" },
              ].map(({ value, label }) => (
                <ToggleButton
                  key={value}
                  value={value}
                  sx={{
                    fontFamily: fontMain,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textTransform: "none",
                    borderColor: colors.border,
                    color: colors.textSec,
                    "&.Mui-selected": {
                      bgcolor: colors.primary,
                      color: "#FFF",
                      borderColor: colors.primary,
                      "&:hover": { bgcolor: "#1a1614" },
                    },
                  }}
                >
                  {label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            {/* Error */}
            {status === "error" && (
              <Typography
                sx={{
                  fontFamily: fontMain,
                  fontSize: "0.85rem",
                  color: "#c0392b",
                  mt: 1.5,
                }}
              >
                {errorMsg}
              </Typography>
            )}

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={
                status === "loading" ||
                !name.trim() ||
                !isValidEmail(email) ||
                !role
              }
              fullWidth
              sx={{
                mt: 3,
                py: 1.4,
                bgcolor: colors.primary,
                color: "#FFF",
                borderRadius: "12px",
                fontFamily: fontMain,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "#1a1614" },
                "&:disabled": { bgcolor: "rgba(44,36,32,0.3)", color: "#FFF" },
              }}
            >
              {status === "loading" ? (
                <CircularProgress size={20} sx={{ color: "#FFF" }} />
              ) : (
                "Request Access"
              )}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    fontFamily: fontMain,
    borderRadius: "10px",
    "& fieldset": { borderColor: "#E6DCCA" },
    "&:hover fieldset": { borderColor: "#A65D37" },
    "&.Mui-focused fieldset": { borderColor: "#2C2420" },
  },
  "& .MuiInputLabel-root": {
    fontFamily: fontMain,
    color: "#594D46",
    "&.Mui-focused": { color: "#2C2420" },
  },
};
