import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { AlertTriangle, Compass, ShieldCheck, Zap } from "lucide-react";

// --- TWO-TONE PALETTE ---
const colors = {
  // Page Background (Solid Sand)
  pageBg: "#EBE5DE",

  // --- CARD UPPER SECTION (Dark) ---
  cardUpperBg: "#352B25",
  textUpper: "#FFFFFF",
  iconBg: "rgba(255, 255, 255, 0.1)", // Glassy white on dark
  iconColor: "#E8B4A2", // Warm Clay

  // --- CARD LOWER SECTION (Light) ---
  cardLowerBg: "#F3EFE7",
  textLowerMain: "#2C2420",
  textLowerSec: "#594D46",

  cardBorder: "#E6DCCA",
};

const fontMain = "'Plus Jakarta Sans', sans-serif";

const BentoCard = ({ title, text, icon, delay, large = false }) => (
  <Grid item xs={12} md={large ? 8 : 4}>
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay, duration: 0.5 }}
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: "16px",
        overflow: "hidden", // Ensures content respects the rounded corners
        border: `1px solid ${colors.cardBorder}`,
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 40px rgba(44, 36, 32, 0.08)",
          borderColor: "#C8B9AF",
        },
      }}
    >
      {/* --- UPPER STRATUM (Dark Header) --- */}
      <Box
        sx={{
          bgcolor: colors.cardUpperBg,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignSelf: "flex-start",
            p: 1.2,
            borderRadius: "10px",
            bgcolor: colors.iconBg,
            color: colors.iconColor,
            backdropFilter: "blur(4px)",
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontFamily: fontMain,
            fontWeight: 700,
            color: colors.textUpper,
            fontSize: large ? "1.5rem" : "1.25rem",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* --- LOWER STRATUM (Light Body) --- */}
      <Box
        sx={{
          bgcolor: colors.cardLowerBg,
          p: 3,
          flexGrow: 1, // Fills remaining height
          display: "flex",
          alignItems: "center", // Vertically center text if brief
        }}
      >
        <Typography
          sx={{
            fontFamily: fontMain,
            color: colors.textLowerSec,
            fontSize: "0.95rem",
            lineHeight: 1.6,
          }}
        >
          {text.split("**").map((part, i) =>
            i % 2 === 1 ? (
              <span
                key={i}
                style={{ fontWeight: 700, color: colors.textLowerMain }}
              >
                {part}
              </span>
            ) : (
              part
            ),
          )}
        </Typography>
      </Box>
    </Paper>
  </Grid>
);

export default function LP_Why() {
  return (
    <Box
      sx={{
        py: 12,
        px: { xs: 3, md: 8 },
        maxWidth: "1280px",
        mx: "auto",
        width: "100%",
      }}
    >
      {/* HEADER: Clean Dark Text on Page BG */}
      <Box sx={{ mb: 8, textAlign: "left" }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: fontMain,
            fontWeight: 800,
            color: colors.textLowerMain,
            fontSize: { xs: "2rem", md: "3rem" },
            letterSpacing: "-0.04em",
            mb: 1,
          }}
        >
          Our Mission
        </Typography>
        <Typography
          sx={{
            fontFamily: fontMain,
            color: colors.textLowerSec,
            fontSize: "1.1rem",
            maxWidth: "600px",
            lineHeight: 1.5,
          }}
        >
          Infrastructure that transforms complex medical condition into a
          navigable path.
        </Typography>
      </Box>

      {/* GRID */}
      <Grid container spacing={3}>
        {/* THE FOUNDATION */}
        <BentoCard
          large
          title="Closing the Information Gap"
          text="The American medical system is a void for international students. MedEase acts as the bridge. We eliminate the critical asymmetry between injury and care, providing the infrastructure to navigate complex protocols with the safety and certainty of a local."
          // icon={<Compass size={24} />}
          delay={0}
        />

        {/* PILLAR 1 */}
        <BentoCard
          title="Instant Clarity"
          text="Stabilizing the student mindset by instantly shifting them from **Panic** to **Precision**."
          // icon={<Zap size={22} />}
          delay={0.1}
        />

        {/* PILLAR 2 */}
        <BentoCard
          title="Preventing Harm"
          text="Removing the fear of cost to shift students from **Hesitation** to immediate medical **Action**."
          // icon={<AlertTriangle size={22} />}
          delay={0.2}
        />

        {/* PILLAR 3 */}
        <BentoCard
          title="Institutional Safety"
          text="Shielding the university by shifting the risk profile from **Liability** to proactive **Compliance**."
          // icon={<ShieldCheck size={22} />}
          delay={0.3}
        />
      </Grid>
    </Box>
  );
}
