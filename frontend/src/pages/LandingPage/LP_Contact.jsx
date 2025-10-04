import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { motion } from "framer-motion";

export default function LP_Contact() {
  return (
    <Box
      id="contact"
      component="footer"
      sx={{
        background: "transparent", // fully transparent background
        py: { xs: 8, md: 10 },
        px: 3,
        textAlign: "center",
        fontFamily: "ECA, sans-serif",
        color: "#004d3a",
        borderTop: "1px solid rgba(0,0,0,0.05)",
        backdropFilter: "none", // ensures no blur
      }}
    >
      {/* Contact line */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
          background: "transparent",
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 500,
            color: "#004d3a",
            fontFamily: "ECA, sans-serif",
          }}
        >
          Contact:
        </Typography>
        <Typography
          component={Link}
          href="mailto:medease111@gmail.com"
          underline="none"
          sx={{
            fontSize: 18,
            fontWeight: 500,
            fontFamily: "ECA, sans-serif",
            color: "#00684A",
            "&:hover": { color: "#009262" },
          }}
        >
          medease111@gmail.com
        </Typography>
      </motion.div>

      {/* Copyright */}
      <Typography
        variant="body2"
        sx={{
          mt: 3,
          color: "#5d7369",
          fontSize: 14,
          fontFamily: "ECA, sans-serif",
          background: "transparent",
        }}
      >
        © {new Date().getFullYear()} MedEase — Built with care at Emory
        University
      </Typography>
    </Box>
  );
}
