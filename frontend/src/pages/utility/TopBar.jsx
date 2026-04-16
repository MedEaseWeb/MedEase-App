import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LanguageIcon from "@mui/icons-material/Language";
import Logo from "./Logo";
import { useTranslation } from "react-i18next";

const backendBaseUrl = import.meta.env.VITE_API_URL;
const fontMain = "'Plus Jakarta Sans', sans-serif";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "zh-CN", label: "中文" },
  { code: "ko", label: "한국어" },
  { code: "es", label: "Español" },
  { code: "ja", label: "日本語" },
];

const DEMO_PATHS = ["/survey", "/questions-loop", "/home", "/community", "/notes"];

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [userEmail, setUserEmail] = useState("");

  const isDemo = DEMO_PATHS.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await fetch(`${backendBaseUrl}/general/email`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email);
        }
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    };
    fetchEmail();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: "1px solid #E6DCCA",
        bgcolor: "rgba(245,240,235,0.92)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 4 },
          py: 1,
        }}
      >
        {/* Left: Logo */}
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          <Logo imgSize={36} fontSize={26} />
        </Box>

        {/* Right: Demo toggle + Language / Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isDemo ? (
            <>
              <DemoLanguageMenu />
              <Button
                onClick={() => navigate("/")}
                variant="outlined"
                sx={{
                  fontFamily: fontMain,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "10px",
                  borderColor: "#E6DCCA",
                  color: "#2C2420",
                  px: 2,
                  "&:hover": { borderColor: "#A65D37", color: "#A65D37", bgcolor: "transparent" },
                }}
              >
                {t("nav.quitDemo")}
              </Button>
            </>
          ) : (
            <ProfileMenu
              userEmail={userEmail}
              onSettings={() => navigate("/settings")}
              onLogout={handleLogout}
            />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

function DemoLanguageMenu() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ minWidth: 0, p: 0.5, color: "#2C2420" }}
      >
        <LanguageIcon sx={{ fontSize: 26 }} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            minWidth: 160,
            bgcolor: "rgba(245,240,235,0.97)",
            backdropFilter: "blur(16px)",
            border: "1px solid #E6DCCA",
            borderRadius: "14px",
            boxShadow: "0 8px 32px rgba(44,36,32,0.12)",
            overflow: "hidden",
          },
        }}
      >
        {LANGUAGES.map(({ code, label }) => (
          <MenuItem
            key={code}
            selected={i18n.language === code}
            onClick={() => { i18n.changeLanguage(code); setAnchorEl(null); }}
            sx={{
              fontFamily: fontMain,
              fontSize: "0.9rem",
              fontWeight: 500,
              color: "#2C2420",
              px: 2.5,
              py: 1,
              "&:hover": { bgcolor: "rgba(44,36,32,0.05)" },
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function ProfileMenu({ userEmail, onSettings, onLogout }) {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-controls={open ? "profile-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{ minWidth: 0, p: 0.5, color: "#2C2420" }}
      >
        <AccountCircleIcon sx={{ fontSize: 30 }} />
      </Button>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            minWidth: 200,
            bgcolor: "rgba(245,240,235,0.97)",
            backdropFilter: "blur(16px)",
            border: "1px solid #E6DCCA",
            borderRadius: "14px",
            boxShadow: "0 8px 32px rgba(44,36,32,0.12)",
            overflow: "hidden",
          },
        }}
      >
        {/* Email display */}
        <Box sx={{ px: 2.5, py: 1.75 }}>
          <Typography
            sx={{
              fontFamily: fontMain,
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#8B7B72",
              mb: 0.25,
            }}
          >
            {t("nav.signedInAs")}
          </Typography>
          <Typography
            sx={{
              fontFamily: fontMain,
              fontSize: "0.88rem",
              fontWeight: 500,
              color: "#2C2420",
              wordBreak: "break-all",
            }}
          >
            {userEmail || "—"}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "#E6DCCA" }} />

        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onSettings();
          }}
          sx={{
            fontFamily: fontMain,
            fontSize: "0.9rem",
            fontWeight: 500,
            color: "#2C2420",
            px: 2.5,
            py: 1.25,
            "&:hover": { bgcolor: "rgba(44,36,32,0.05)" },
          }}
        >
          {t("nav.settings")}
        </MenuItem>

        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onLogout();
          }}
          sx={{
            fontFamily: fontMain,
            fontSize: "0.9rem",
            fontWeight: 500,
            color: "#A65D37",
            px: 2.5,
            py: 1.25,
            mb: 0.5,
            "&:hover": { bgcolor: "rgba(166,93,55,0.06)" },
          }}
        >
          {t("nav.logout")}
        </MenuItem>

        <Divider sx={{ borderColor: "#E6DCCA" }} />

        <MenuItem disabled sx={{ px: 2.5, py: 0.75 }}>
          <Typography
            sx={{ fontFamily: fontMain, fontSize: "0.72rem", fontWeight: 600,
              letterSpacing: "0.06em", textTransform: "uppercase", color: "#8B7B72" }}
          >
            {t("nav.language")}
          </Typography>
        </MenuItem>

        {LANGUAGES.map(({ code, label }) => (
          <MenuItem
            key={code}
            selected={i18n.language === code}
            onClick={() => {
              i18n.changeLanguage(code);
              setAnchorEl(null);
            }}
            sx={{
              fontFamily: fontMain,
              fontSize: "0.9rem",
              fontWeight: 500,
              color: "#2C2420",
              px: 2.5,
              py: 1,
              "&:hover": { bgcolor: "rgba(44,36,32,0.05)" },
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
