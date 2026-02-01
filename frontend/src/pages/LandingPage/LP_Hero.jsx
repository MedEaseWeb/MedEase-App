import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const colors = {
  textMain: "#2C2420",
  textSec: "#594D46",
  primary: "#2C2420",
};

const fontMain = "'Plus Jakarta Sans', sans-serif";

// --- SCRAMBLE COMPONENT ---
const CHARS = "-_~`+=!@#$";

const ScrambleText = ({ text, sx }) => {
  const [display, setDisplay] = useState(text);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let interval;
    let iteration = 0;

    interval = setInterval(() => {
      setDisplay((prev) =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(""),
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [trigger, text]);

  return (
    <Box
      component="span"
      onMouseEnter={() => setTrigger((t) => t + 1)}
      sx={{
        ...sx,
        display: "inline-block",
        cursor: "default",
      }}
    >
      {display}
    </Box>
  );
};

export default function LP_Hero() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 3,
        pt: 4,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "3rem", md: "5rem" },
            fontFamily: fontMain,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: colors.textMain,
            lineHeight: 1.1,
            mb: 3,
            maxWidth: "1100px",
          }}
        >
          Agentic AI for your <br />
          {/* PART 1: SCRAMBLED "post-injury" */}
          <ScrambleText
            text="post-injury"
            sx={{
              opacity: 0.8,
              fontStyle: "italic",
            }}
          />
          {/* PART 2: STATIC " journey" */}
          <Box component="span" sx={{ opacity: 0.8, fontStyle: "italic" }}>
            {" "}
            journey
          </Box>
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <Typography
          sx={{
            fontSize: { xs: 18, md: 22 },
            fontFamily: fontMain,
            color: colors.textSec,
            maxWidth: "750px",
            lineHeight: 1.6,
            mb: 5,
          }}
        >
          MedEase replaces post-injury panic with precision by intelligently
          triaging you to the correct care and campus services based on your
          university’s specific data.
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Button
          onClick={() => navigate("/signup")}
          sx={{
            px: 5,
            py: 1.8,
            bgcolor: colors.primary,
            color: "#FFF",
            borderRadius: "12px",
            fontFamily: fontMain,
            fontSize: "1.1rem",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0 10px 30px rgba(44, 36, 32, 0.15)",
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: "#1a1614",
              transform: "translateY(-2px)",
              boxShadow: "0 15px 35px rgba(44, 36, 32, 0.25)",
            },
          }}
        >
          Join Waitlist
        </Button>
      </motion.div>
    </Box>
  );
}
