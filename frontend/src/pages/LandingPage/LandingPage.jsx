import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
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
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box sx={{ position: "relative", width: "100%", minHeight: "100vh" }}>
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

      {/* Optional translucent overlay for readability */}
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
        position="sticky"
        elevation={1}
        sx={{
          zIndex: 1200,
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: "1400px",
            mx: "auto",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
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
