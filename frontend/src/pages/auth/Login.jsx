import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import InteractiveBackground from "../LandingPage/utils/InteractiveBackground";

const ErrorModal = ({ open, message, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        borderRadius: "16px",
        overflow: "hidden",
        maxWidth: 380,
        width: "100%",
        m: 2,
        boxShadow: "0 24px 60px rgba(44, 36, 32, 0.18)",
      },
    }}
  >
    {/* Dark header */}
    <Box sx={{ bgcolor: "#2C2420", px: 3, pt: 3, pb: 2.5 }}>
      <Typography
        sx={{
          fontFamily: fontMain,
          fontWeight: 700,
          fontSize: "1.05rem",
          color: "#FFF",
          letterSpacing: "-0.01em",
        }}
      >
        Login failed
      </Typography>
    </Box>
    {/* Light body */}
    <Box sx={{ bgcolor: "#F5F0EB", px: 3, pt: 2.5, pb: 3 }}>
      <Typography
        sx={{
          fontFamily: fontMain,
          color: "#594D46",
          fontSize: "0.92rem",
          lineHeight: 1.6,
          mb: 3,
        }}
      >
        {message}
      </Typography>
      <Button
        fullWidth
        onClick={onClose}
        sx={{
          bgcolor: "#2C2420",
          color: "#FFF",
          borderRadius: "10px",
          fontFamily: fontMain,
          fontWeight: 600,
          fontSize: "0.9rem",
          textTransform: "none",
          py: 1.2,
          "&:hover": { bgcolor: "#1a1614" },
        }}
      >
        Got it
      </Button>
    </Box>
  </Dialog>
);

const colors = {
  darkPanel: "#2C2420",
  textMain: "#2C2420",
  textSec: "#594D46",
  accent: "#A65D37",
  cardBg: "rgba(247, 242, 237, 0.88)",
  border: "#E6DCCA",
  pillBg: "rgba(255, 255, 255, 0.07)",
  pillBorder: "rgba(255, 255, 255, 0.12)",
};

const fontMain = "'Plus Jakarta Sans', sans-serif";

const features = [
  "AI-Powered Report Simplification",
  "Smart Medication Tracking",
  "Agentic Triage Engine",
  "24/7 Care Coordination",
];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    fontFamily: fontMain,
    fontSize: "0.95rem",
    borderRadius: "12px",
    backgroundColor: "rgba(255,255,255,0.55)",
    "& fieldset": { borderColor: "#E6DCCA" },
    "&:hover fieldset": { borderColor: "#C8B9AF" },
    "&.Mui-focused fieldset": {
      borderColor: "#2C2420",
      borderWidth: "1.5px",
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: fontMain,
    fontSize: "0.95rem",
    color: "#8B7B72",
    "&.Mui-focused": { color: "#2C2420" },
  },
};

const parseLoginError = (error) => {
  if (!error.response) return "Unable to reach the server. Check your connection and try again.";
  switch (error.response.status) {
    case 401: return "Incorrect email or password. Please try again.";
    case 404: return "No account found with that email address.";
    case 429: return "Too many attempts. Please wait a moment and try again.";
    default:  return "Something went wrong. Please try again.";
  }
};

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();

  const isValid = email.trim().length > 0 && password.trim().length > 0;

  const handleLogin = async () => {
    if (!isValid) return;
    try {
      await login(email, password);
      navigate("/reportsimplifier");
    } catch (error) {
      setErrorMsg(parseLoginError(error));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <Box sx={{ position: "fixed", inset: 0, display: "flex" }}>
      <InteractiveBackground />
      <ErrorModal
        open={!!errorMsg}
        message={errorMsg}
        onClose={() => setErrorMsg("")}
      />

      {/* LEFT: Dark Brand Panel */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: "44%",
          bgcolor: colors.darkPanel,
          flexDirection: "column",
          justifyContent: "space-between",
          p: { md: 5, lg: 7 },
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {/* Wordmark */}
        <Typography
          sx={{
            fontFamily: fontMain,
            fontWeight: 800,
            fontSize: "1.5rem",
            letterSpacing: "-0.03em",
            color: "#FFF",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          MedEase
        </Typography>

        {/* Center block */}
        <Box>
          <Typography
            sx={{
              fontFamily: fontMain,
              fontWeight: 700,
              fontSize: { md: "2.2rem", lg: "2.8rem" },
              letterSpacing: "-0.04em",
              color: "#FFF",
              lineHeight: 1.15,
              mb: 2,
            }}
          >
            Your post-injury
            <br />
            <Box
              component="span"
              sx={{ color: colors.accent, fontStyle: "italic" }}
            >
              journey,
            </Box>{" "}
            simplified.
          </Typography>
          <Typography
            sx={{
              fontFamily: fontMain,
              color: "rgba(255,255,255,0.5)",
              fontSize: "1rem",
              lineHeight: 1.65,
              mb: 5,
              maxWidth: "340px",
            }}
          >
            Agentic AI that triages students to the right campus care —
            instantly.
          </Typography>

          {/* Feature pills */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {features.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.45 }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2,
                    py: 1,
                    borderRadius: "10px",
                    bgcolor: colors.pillBg,
                    border: `1px solid ${colors.pillBorder}`,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: colors.accent,
                      boxShadow: `0 0 8px ${colors.accent}`,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: fontMain,
                      fontWeight: 500,
                      color: "#FFF",
                      fontSize: "0.9rem",
                    }}
                  >
                    {f}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* Footer */}
        <Typography
          sx={{
            fontFamily: fontMain,
            color: "rgba(255,255,255,0.25)",
            fontSize: "0.8rem",
          }}
        >
          © 2025 MedEase. Built for students.
        </Typography>

        {/* Decorative concentric rings */}
        <Box
          sx={{
            position: "absolute",
            bottom: -130,
            right: -130,
            width: 380,
            height: 380,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -70,
            right: -70,
            width: 230,
            height: 230,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }}
        />
      </Box>

      {/* RIGHT: Form Panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          p: 3,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: 440 }}
        >
          <Box
            sx={{
              bgcolor: colors.cardBg,
              backdropFilter: "blur(24px)",
              borderRadius: "24px",
              border: `1px solid ${colors.border}`,
              p: { xs: 4, sm: 5 },
              boxShadow: "0 20px 60px rgba(44, 36, 32, 0.1)",
            }}
          >
            {/* Mobile wordmark */}
            <Typography
              sx={{
                display: { xs: "block", md: "none" },
                fontFamily: fontMain,
                fontWeight: 800,
                fontSize: "1.4rem",
                letterSpacing: "-0.03em",
                color: colors.textMain,
                mb: 3,
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              MedEase
            </Typography>

            <Typography
              sx={{
                fontFamily: fontMain,
                fontWeight: 700,
                fontSize: "1.75rem",
                letterSpacing: "-0.03em",
                color: colors.textMain,
                mb: 0.5,
              }}
            >
              Welcome back
            </Typography>
            <Typography
              sx={{
                fontFamily: fontMain,
                color: colors.textSec,
                fontSize: "0.95rem",
                mb: 4,
              }}
            >
              Don't have an account?{" "}
              <Box
                component="span"
                onClick={() => navigate("/signup")}
                sx={{
                  color: colors.accent,
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Sign up
              </Box>
            </Typography>

            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={fieldSx}
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{ ...fieldSx, mt: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{ fontSize: 18, color: "#8B7B72" }} />
                      ) : (
                        <Visibility sx={{ fontSize: 18, color: "#8B7B72" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit */}
            <Button
              fullWidth
              variant="contained"
              disabled={!isValid}
              onClick={handleLogin}
              sx={{
                mt: 3,
                py: 1.6,
                bgcolor: colors.darkPanel,
                color: "#FFF",
                borderRadius: "12px",
                fontFamily: fontMain,
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0 8px 24px rgba(44, 36, 32, 0.15)",
                transition: "all 0.25s ease",
                "&:hover": {
                  bgcolor: "#1a1614",
                  transform: "translateY(-2px)",
                  boxShadow: "0 14px 32px rgba(44, 36, 32, 0.22)",
                },
                "&:disabled": {
                  bgcolor: "rgba(44, 36, 32, 0.12)",
                  color: "rgba(44, 36, 32, 0.3)",
                },
              }}
            >
              Log in
            </Button>

            {/* Back to home */}
            <Typography
              sx={{
                fontFamily: fontMain,
                color: colors.textSec,
                fontSize: "0.85rem",
                textAlign: "center",
                mt: 3,
                cursor: "pointer",
                transition: "color 0.2s",
                "&:hover": { color: colors.textMain },
              }}
              onClick={() => navigate("/")}
            >
              ← Back to home
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
