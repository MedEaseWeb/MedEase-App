import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  CssBaseline,
  GlobalStyles,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { styled } from "@mui/material/styles";
import { motion, useScroll, useSpring } from "framer-motion";
import { useTranslation } from "react-i18next";
import Logo from "../utility/Logo";
import LP_Hero from "./LP_Hero";
import LP_Mission from "./LP_Mission";
import LP_Product from "./LP_Product";
import LP_About from "./LP_About";
import LP_Team from "./LP_Team";
import LP_UserStories from "./LP_UserStories";
import LP_Footer from "./LP_Footer";
import InteractiveBackground from "./utils/InteractiveBackground";
import WaitlistModal from "./WaitlistModal";

const colors = {
  textMain: "#2C2420",
  primary: "#2C2420",
};

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "zh-CN", label: "中文" },
  { code: "ko", label: "한국어" },
  { code: "es", label: "Español" },
];

const fontMain = "'Plus Jakarta Sans', sans-serif";

const NavButton = styled(Button)(() => ({
  borderRadius: "8px",
  padding: "8px 16px",
  fontSize: "0.9rem",
  fontWeight: 600,
  textTransform: "none",
  fontFamily: fontMain,
  color: colors.textMain,
  backgroundColor: "transparent",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(44, 36, 32, 0.05)",
  },
}));

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [langAnchor, setLangAnchor] = useState(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { backgroundColor: "transparent" },
          body: { backgroundColor: "transparent", overscrollBehavior: "none" },
          "#root": { backgroundColor: "transparent" },
        }}
      />

      {/* === BACKGROUND COMPONENT === */}
      <InteractiveBackground />

      {/* === NAVBAR === */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: 1200,
          background: "rgba(247, 242, 237, 0.7)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(44, 36, 32, 0.05)",
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
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Logo imgSize={36} fontSize={26} />
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {["mission", "product", "about", "user-stories", "team"].map((id) => (
              <NavButton key={id} onClick={() => handleScrollTo(id)}>
                {t(`lp.nav.${id}`)}
              </NavButton>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              onClick={(e) => setLangAnchor(e.currentTarget)}
              sx={{ minWidth: 0, p: 0.5, color: colors.textMain }}
            >
              <LanguageIcon sx={{ fontSize: 26 }} />
            </Button>
            <Menu
              anchorEl={langAnchor}
              open={Boolean(langAnchor)}
              onClose={() => setLangAnchor(null)}
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
                  onClick={() => {
                    i18n.changeLanguage(code);
                    setLangAnchor(null);
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

            <Button
              variant="contained"
              onClick={() => navigate("/survey")}
              sx={{
                bgcolor: colors.primary,
                color: "#FFF",
                borderRadius: "10px",
                px: 2,
                fontFamily: fontMain,
                fontSize: "0.85rem",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "#1a1614" },
              }}
            >
              View Demo
            </Button>
          </Box>
        </Toolbar>
        <motion.div
          style={{
            scaleX,
            transformOrigin: "0%",
            height: "2px",
            background: colors.primary,
          }}
        />
      </AppBar>

      {/* === CONTENT === */}
      {/* FIX 2: Explicit Z-Index 1 to ensure it floats ABOVE the p5 canvas */}
      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />

      <Box sx={{ position: "relative", zIndex: 1, pt: 12 }}>
        <LP_Hero onOpenWaitlist={() => setWaitlistOpen(true)} />
        <Box id="mission">
          <LP_Mission />
        </Box>
        <Box id="product">
          <LP_Product />
        </Box>
        <Box id="about">
          <LP_About />
        </Box>
        <Box id="team">
          <LP_Team />
        </Box>
        <Box id="user-stories">
          <LP_UserStories />
        </Box>
        <Box id="contact">
          <LP_Footer />
        </Box>
      </Box>
    </Box>
  );
}
