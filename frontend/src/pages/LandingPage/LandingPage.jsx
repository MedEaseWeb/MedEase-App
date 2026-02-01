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
import LP_Product from "./LP_Product";
import LP_About from "./LP_About";
import LP_Footer from "./LP_Footer";
import InteractiveBackground from "./utils/InteractiveBackground";

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
      {/* FIX 1: Force body and html to be transparent so the 
         fixed background behind them is actually visible.
      */}
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
          <Typography
            variant="h5"
            sx={{
              fontFamily: fontMain,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: colors.textMain,
              cursor: "pointer",
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            MedEase
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {["mission", "product", "about", "docs"].map((id) => (
              <NavButton key={id} onClick={() => handleScrollTo(id)}>
                {id.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </NavButton>
            ))}
          </Box>

          <Button
            variant="contained"
            onClick={() => handleScrollTo("contact")}
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
            Join Waitlist
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
        <Box id="mission">
          <LP_Mission />
        </Box>
        <Box id="product">
          <LP_Product />
        </Box>
        <Box id="about">
          <LP_About />
        </Box>
        <Box id="contact">
          <LP_Footer />
        </Box>
      </Box>
    </Box>
  );
}
