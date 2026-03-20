import {
  Cancel,
  CheckCircle,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import InteractiveBackground from "../LandingPage/utils/InteractiveBackground";

const ErrorModal = ({ open, title, message, onClose }) => (
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
        {title}
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

const backendBaseUrl = import.meta.env.VITE_API_URL;

const colors = {
  darkPanel: "#2C2420",
  textMain: "#2C2420",
  textSec: "#594D46",
  accent: "#A65D37",
  cardBg: "rgba(247, 242, 237, 0.88)",
  border: "#E6DCCA",
  pillBg: "rgba(255, 255, 255, 0.07)",
  pillBorder: "rgba(255, 255, 255, 0.12)",
  validColor: "#2C2420",
  warnColor: "#A65D37",
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

const ValidationHint = ({ valid, dirty, label }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 0.75,
      mt: 0.75,
      ml: 0.5,
    }}
  >
    {valid ? (
      <CheckCircle sx={{ fontSize: 13, color: colors.validColor }} />
    ) : (
      <Cancel
        sx={{
          fontSize: 13,
          color: dirty ? colors.warnColor : "rgba(44,36,32,0.25)",
        }}
      />
    )}
    <Typography
      variant="caption"
      sx={{
        fontFamily: fontMain,
        color: dirty
          ? valid
            ? colors.validColor
            : colors.warnColor
          : "rgba(44,36,32,0.35)",
        fontWeight: 500,
        fontSize: "0.78rem",
      }}
    >
      {label}
    </Typography>
  </Box>
);

const parseSignupError = (error) => {
  if (!error.response) return { title: "Connection error", message: "Unable to reach the server. Check your connection and try again." };
  switch (error.response.status) {
    case 409: return { title: "Account already exists", message: "An account with this email address already exists. Try logging in instead." };
    case 422: return { title: "Invalid details", message: "Please double-check your email and password format." };
    case 429: return { title: "Too many attempts", message: "Please wait a moment before trying again." };
    default:  return { title: "Sign up failed", message: "Something went wrong. Please try again." };
  }
};

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [checkTerms, setCheckTerms] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorModal, setErrorModal] = useState(null);

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePassword = (v) => ({
    length: v.length >= 8,
    hasNumber: /\d/.test(v),
  });

  const emailValid = validateEmail(email);
  const pwChecks = validatePassword(password);
  const allValid =
    emailValid && pwChecks.length && pwChecks.hasNumber && checkTerms;

  const handleSignup = async () => {
    if (!allValid) return;
    try {
      await axios.post(`${backendBaseUrl}/auth/register`, { email, password });
      navigate("/login");
    } catch (error) {
      setErrorModal(parseSignupError(error));
    }
  };

  return (
    <Box sx={{ position: "fixed", inset: 0, display: "flex" }}>
      <InteractiveBackground />
      <ErrorModal
        open={!!errorModal}
        title={errorModal?.title ?? ""}
        message={errorModal?.message ?? ""}
        onClose={() => setErrorModal(null)}
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

        {/* Decorative rings */}
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
              Create your account
            </Typography>
            <Typography
              sx={{
                fontFamily: fontMain,
                color: colors.textSec,
                fontSize: "0.95rem",
                mb: 4,
              }}
            >
              Already have an account?{" "}
              <Box
                component="span"
                onClick={() => navigate("/login")}
                sx={{
                  color: colors.accent,
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Log in
              </Box>
            </Typography>

            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={fieldSx}
            />
            <ValidationHint
              valid={emailValid}
              dirty={email.length > 0}
              label="Valid email address"
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ ...fieldSx, mt: 2.5 }}
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
            <ValidationHint
              valid={pwChecks.length}
              dirty={password.length > 0}
              label="At least 8 characters"
            />
            <ValidationHint
              valid={pwChecks.hasNumber}
              dirty={password.length > 0}
              label="Contains at least 1 number"
            />

            {/* Terms checkbox */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 2.5,
              }}
            >
              <Checkbox
                checked={checkTerms}
                onChange={(e) => setCheckTerms(e.target.checked)}
                size="small"
                sx={{
                  p: 0.5,
                  color: "#C8B9AF",
                  "&.Mui-checked": { color: colors.darkPanel },
                }}
              />
              <Typography
                sx={{
                  fontFamily: fontMain,
                  color: colors.textSec,
                  fontSize: "0.85rem",
                  lineHeight: 1.4,
                }}
              >
                I accept the{" "}
                <Box
                  component="span"
                  onClick={() => navigate("/terms")}
                  sx={{
                    color: colors.accent,
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Terms of Service
                </Box>{" "}
                &{" "}
                <Box
                  component="span"
                  onClick={() => navigate("/privacy")}
                  sx={{
                    color: colors.accent,
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Privacy Policy
                </Box>
              </Typography>
            </Box>

            {/* Submit */}
            <Button
              fullWidth
              variant="contained"
              disabled={!allValid}
              onClick={handleSignup}
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
              Create account
            </Button>

            {/* Go to Home (Questions in the Loop) */}
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
              onClick={() => navigate("/home")}
            >
              Click here to go to Home Page
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
