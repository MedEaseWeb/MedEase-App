import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  CssBaseline,
  GlobalStyles, // <--- Import GlobalStyles
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, useScroll, useSpring } from "framer-motion";
import Logo from "../utility/Logo";
import LP_Why from "./LP_Why";
import LP_Product from "./LP_Product";
import LP_About from "./LP_About";
import LP_Contact from "./LP_Contact";

const NavButton = styled(Button)(() => ({
  borderRadius: "10px",
  padding: "6px 18px",
  fontSize: "1.1rem",
  fontWeight: "bold",
  textTransform: "none",
  color: "#333",
  backgroundColor: "transparent",
  "&:hover": { color: "#00684A" },
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
      // Offset the scroll calculation by ~70px so the header doesn't cover the title
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <Box sx={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      <CssBaseline />

      {/* 1. GlobalStyles: This stops the "elastic" rubber-banding on the whole page 
            (works on most modern browsers).
      */}
      <GlobalStyles styles={{ body: { overscrollBehavior: "none" } }} />

      {/* === BACKGROUND LAYER === */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
          background: `
            radial-gradient(80% 100% at 30% 10%, #d9f3ea 0%, transparent 55%),
            radial-gradient(70% 100% at 70% 90%, #e0f5ee 0%, transparent 65%),
            radial-gradient(100% 120% at 50% 50%, #ffffff 0%, #f9fbf9 100%)
          `,
        }}
      />

      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 0.5,
          background: "rgba(255,255,255,0.15)",
          pointerEvents: "none",
        }}
      />

      {/* === TOP BAR === */}
      <AppBar
        // 2. Changed to 'fixed'. This pins it to the viewport glass, not the page flow.
        position="fixed"
        elevation={0}
        sx={{
          zIndex: 1200,
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          width: "100%",
          top: 0,
          left: 0,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
            px: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Logo imgSize={40} fontSize={28} />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            {["why-medease", "product", "about", "contact"].map((id, idx) => (
              <motion.div key={idx} whileHover={{ scale: 1.1 }}>
                <NavButton onClick={() => handleScrollTo(id)}>
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontFamily: "ECA, sans-serif",
                      color: "#222222",
                    }}
                  >
                    {id
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Typography>
                </NavButton>
              </motion.div>
            ))}
          </Box>
        </Toolbar>

        <motion.div
          style={{
            scaleX,
            transformOrigin: "0%",
            height: "4px",
            background: "#00684A",
          }}
        />
      </AppBar>

      {/* === CONTENT === */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          overflowX: "hidden",
        }}
      >
        {/* 3. The Spacer: Because AppBar is now 'fixed', it floats *over* the content.
              This empty Toolbar pushes the content down exactly by the header's height. 
        */}
        <Toolbar sx={{ py: 1 }} />

        <Box id="why-medease">
          <LP_Why />
        </Box>

        <Box id="product">
          <LP_Product />
        </Box>

        <Box id="about">
          <LP_About />
        </Box>

        <Box id="contact">
          <LP_Contact />
        </Box>
      </Box>
    </Box>
  );
}
