import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Heart, School, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const MotionPaper = motion(Paper);

export default function LP_Why() {
  const phrases = [
    "Simplify complex medical language.",
    "Empower students to make informed decisions.",
    "Guide recovery with clarity and compassion.",
  ];

  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % phrases.length),
      2500
    );
    return () => clearInterval(timer);
  }, [phrases.length]);

  const items = [
    {
      icon: <Lightbulb size={28} />,
      title: "Simplify",
      text: "We translate medical jargon into clear, accessible language.",
    },
    {
      icon: <School size={28} />,
      title: "Educate",
      text: "We help students understand their health journey with confidence.",
    },
    {
      icon: <Heart size={28} />,
      title: "Empower",
      text: "We encourage meaningful recovery through understanding and action.",
    },
    {
      icon: <Globe size={28} />,
      title: "Connect",
      text: "We bridge students, caregivers, and campus resources.",
    },
  ];

  const GREEN = "#00684A";

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        position: "relative",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          minHeight: { xs: "60vh", md: "90vh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: { xs: 3, md: 5 },
          py: { xs: 6, md: 0 },
          zIndex: 1,
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "2.4rem",
            fontFamily: "ECA, sans-serif",
            fontWeight: "bold",
            color: "#0f4038",
            maxWidth: "600px",
            lineHeight: 1.15,
          }}
        >
          Why MedEase Exists
        </motion.h1>

        <Typography
          sx={{
            mt: 2,
            fontSize: 16,
            fontFamily: "ECA, sans-serif",
            color: "#333",
            maxWidth: "460px",
            lineHeight: 1.5,
          }}
        >
          Simplify reports. Understand medications. Support caregivers.
          <br /> All in one seamless platform.
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to="/signup"
          sx={{
            mt: 4,
            px: 3.5,
            py: 1,
            bgcolor: GREEN,
            "&:hover": { bgcolor: "#009262" },
            fontFamily: "ECA, sans-serif",
            fontSize: 15,
            borderRadius: "10px",
          }}
        >
          Get Started
        </Button>
      </Box>

      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: 3,
          py: { xs: 4, md: 5 },
          background: "transparent",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          sx={{
            color: "#004d3a",
            fontFamily: "ECA, sans-serif",
            mb: 3,
          }}
        >
          What We Stand For
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {items.map((item, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <MotionPaper
                elevation={2}
                sx={{
                  p: 2.5,
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(6px)",
                  textAlign: "center",
                }}
              >
                <Box color={GREEN} mb={1}>
                  {item.icon}
                </Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ fontFamily: "ECA, sans-serif" }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "ECA, sans-serif",
                    color: "#333",
                  }}
                >
                  {item.text}
                </Typography>
              </MotionPaper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
