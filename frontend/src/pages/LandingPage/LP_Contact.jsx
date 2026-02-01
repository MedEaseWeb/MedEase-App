import React from "react";
import { Box, Typography, Link, Divider } from "@mui/material";
import { motion } from "framer-motion";

const colors = {
  textMain: "#2C2420",
  textSec: "rgba(44, 36, 32, 0.6)",
  border: "rgba(44, 36, 32, 0.1)",
};

const fontMain = "'Plus Jakarta Sans', sans-serif";

export default function LP_Contact() {
  return (
    <Box
      component="footer"
      sx={{
        px: 3,
        pt: 10,
        pb: 4,
        fontFamily: fontMain,
      }}
    >
      <Divider sx={{ borderColor: colors.border, mb: 10 }} />

      <Box sx={{ textAlign: "center", mb: 12 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            sx={{
              fontFamily: fontMain,
              fontWeight: 600,
              fontSize: "1rem",
              color: colors.textSec,
              mb: 2,
              letterSpacing: "0.05em",
            }}
          >
            READY TO START?
          </Typography>

          <Link
            href="mailto:medease111@gmail.com"
            underline="none"
            sx={{
              fontFamily: fontMain,
              fontWeight: 800,
              // FIXED: Reduced size significantly
              fontSize: { xs: "1.5rem", md: "3rem" },
              color: colors.textMain,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              transition: "opacity 0.2s",
              "&:hover": { opacity: 0.7 },
            }}
          >
            medease111@gmail.com
          </Link>
        </motion.div>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: fontMain,
            fontSize: "0.875rem",
            color: colors.textSec,
            fontWeight: 500,
          }}
        >
          © {new Date().getFullYear()} MedEase. All rights reserved.
        </Typography>

        <Typography
          sx={{
            fontFamily: fontMain,
            fontSize: "0.875rem",
            color: colors.textSec,
            fontWeight: 500,
          }}
        >
          Built at Emory University
        </Typography>
      </Box>
    </Box>
  );
}
