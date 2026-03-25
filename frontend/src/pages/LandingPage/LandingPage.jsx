import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  CssBaseline,
  GlobalStyles,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, useScroll, useSpring } from "framer-motion";
import LP_Hero from "./LP_Hero";
import LP_Mission from "./LP_Mission";
import LP_ProductDemo from "./LP_ProductDemo";
import LP_Product from "./LP_Product";
import LP_About from "./LP_About";
import LP_Team from "./LP_Team";
import LP_UserStories from "./LP_UserStories";
import LP_Footer from "./LP_Footer";
import InteractiveBackground from "./utils/InteractiveBackground";
import { useNavigate } from "react-router-dom";
import logoGreen from "../../assets/pics/logo-green.svg";

const colors = {
  textMain: "#2C2420",
  primary: "#2C2420",
};

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
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const navigate = useNavigate();

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
            justifyContent: "space-between",
            py: 1.5,
            maxWidth: "1400px",
            width: "100%",
            mx: "auto",
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.25, cursor: "pointer" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Box
              component="img"
              src={logoGreen}
              alt="MedEase logo"
              sx={{ width: 34, height: 34, display: "block" }}
            />
            <Typography
              variant="h5"
              sx={{
                fontFamily: fontMain,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: colors.textMain,
                cursor: "pointer",
              }}
            >
              MedEase
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {[
              { id: "our-mission", label: "Our Mission" },
              { id: "product-demo", label: "Product Demo" },
              { id: "team", label: "Team" },
              { id: "user-stories", label: "User Stories" },
            ].map((item) => (
              <NavButton key={item.id} onClick={() => handleScrollTo(item.id)}>
                {item.label}
              </NavButton>
            ))}
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{
              bgcolor: colors.primary,
              color: "#FFF",
              borderRadius: "12px",
              px: 3,
              fontFamily: fontMain,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { bgcolor: "#1a1614" },
            }}
          >
            Try Demo / Login
          </Button>
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
      <Box sx={{ position: "relative", zIndex: 1, pt: 12 }}>
        <LP_Hero />
        <Box id="our-mission">
          <LP_Mission />
        </Box>
        <Box id="product-demo">
          <LP_ProductDemo />
          <Box sx={{ mt: 6 }}>
            <LP_Product />
          </Box>
        </Box>
        <Box id="team">
          <LP_Team />
          <Box sx={{ mt: 6 }}>
            <LP_About />
          </Box>
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
