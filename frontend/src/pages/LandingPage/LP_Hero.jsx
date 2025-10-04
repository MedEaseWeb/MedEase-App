import { Box, Typography, Button } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";

const BLUE = "#081D2A";
const EDGE = 10;

export default function LP_Hero() {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: BLUE,
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          fontSize: "3rem",
          fontFamily: "ECA, sans-serif",
          fontWeight: "bold",
          color: "#F5F5F5",
          maxWidth: "800px",
        }}
      >
        MedEase: Your AI-Powered Health Companion
      </motion.h1>
      <Typography
        sx={{
          mt: 3,
          fontSize: 18,
          fontFamily: "ECA, sans-serif",
          color: "#B0BEC5",
          maxWidth: "600px",
        }}
      >
        Simplify reports. Understand medications. Support caregivers.
        <br />
        All in one seamless platform.
      </Typography>
      <Button
        variant="contained"
        sx={{
          mt: 5,
          px: 4,
          py: 1.2,
          bgcolor: "#00684A",
          "&:hover": { bgcolor: "#009262" },
          fontFamily: "ECA, sans-serif",
          fontSize: 16,
        }}
        onClick={() => navigate("/signup")}
      >
        Get Started
      </Button>
    </Box>
  );
}
