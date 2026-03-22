import React from "react";
import { Box, Typography, Chip, Divider, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const colors = {
  bg: "#EBE5DE",
  cardBg: "rgba(245, 240, 235, 0.92)",
  border: "#E6DCCA",
  textMain: "#2C2420",
  textSec: "#594D46",
  accent: "#A65D37",
};

const fontMain = "'Plus Jakarta Sans', sans-serif";

function SettingsSection({ title, children }) {
  return (
    <Box sx={{ mb: 3 }}>
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
        {title}
      </Typography>
      <Box
        sx={{
          bgcolor: colors.cardBg,
          backdropFilter: "blur(16px)",
          border: `1px solid ${colors.border}`,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(44,36,32,0.06)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function SettingsRow({ label, value, action, divider = true }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2.5,
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: fontMain,
              fontWeight: 500,
              fontSize: "0.9rem",
              color: colors.textMain,
            }}
          >
            {label}
          </Typography>
          {value && (
            <Typography
              sx={{
                fontFamily: fontMain,
                fontSize: "0.85rem",
                color: colors.textSec,
                mt: 0.25,
                wordBreak: "break-all",
              }}
            >
              {value}
            </Typography>
          )}
        </Box>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>
      {divider && <Divider sx={{ borderColor: colors.border, mx: 3 }} />}
    </>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 96px)",
        bgcolor: colors.bg,
        py: 5,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Box sx={{ maxWidth: 640, mx: "auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Typography
            sx={{
              fontFamily: fontMain,
              fontWeight: 800,
              fontSize: { xs: "1.8rem", md: "2.2rem" },
              letterSpacing: "-0.04em",
              color: colors.textMain,
              mb: 0.75,
            }}
          >
            Settings
          </Typography>
          <Typography
            sx={{
              fontFamily: fontMain,
              color: colors.textSec,
              fontSize: "0.95rem",
              mb: 4,
            }}
          >
            Manage your account and institution preferences.
          </Typography>

          {/* Profile */}
          <SettingsSection title="Profile">
            <SettingsRow
              label="Email address"
              value={user?.email ?? "—"}
              action={
                <Chip
                  label="Verified"
                  size="small"
                  sx={{
                    bgcolor: "rgba(0,104,74,0.08)",
                    color: "#00684A",
                    fontFamily: fontMain,
                    fontWeight: 600,
                    fontSize: "0.72rem",
                    border: "1px solid rgba(0,104,74,0.18)",
                  }}
                />
              }
            />
            <SettingsRow
              label="Member since"
              value={createdAt}
              divider={false}
            />
          </SettingsSection>

          {/* Institution */}
          <SettingsSection title="Institution">
            <SettingsRow
              label="Emory University"
              value="Disability Access Services (DAS)"
              action={
                <Chip
                  label="Active"
                  size="small"
                  sx={{
                    bgcolor: "rgba(0,104,74,0.08)",
                    color: "#00684A",
                    fontFamily: fontMain,
                    fontWeight: 600,
                    fontSize: "0.72rem",
                    border: "1px solid rgba(0,104,74,0.18)",
                  }}
                />
              }
              divider={false}
            />
          </SettingsSection>

          {/* Account */}
          <SettingsSection title="Account">
            <Box sx={{ px: 3, py: 2.5 }}>
              <Button
                fullWidth
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  bgcolor: colors.textMain,
                  color: "#FFF",
                  borderRadius: "12px",
                  fontFamily: fontMain,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  boxShadow: "0 4px 16px rgba(44,36,32,0.12)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "#1a1614",
                    transform: "translateY(-1px)",
                    boxShadow: "0 8px 20px rgba(44,36,32,0.2)",
                  },
                }}
              >
                Sign out
              </Button>
            </Box>
          </SettingsSection>
        </motion.div>
      </Box>
    </Box>
  );
}
