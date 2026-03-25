import React from "react";
import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Accessibility,
  Users,
} from "lucide-react";

// Keep the same visual language as the existing Landing page (LP_Mission cards)
const colors = {
  cardUpperBg: "#352B25",
  textUpper: "#FFFFFF",
  iconBg: "rgba(255, 255, 255, 0.1)",
  iconColor: "#E8B4A2",
  cardLowerBg: "#F3EFE7",
  textLowerMain: "#2C2420",
  textLowerSec: "#594D46",
  cardBorder: "#E6DCCA",
  accent: "#A65D37",
  primary: "#2C2420",
  buttonHover: "#1a1614",
};

const fontMain = "'Plus Jakarta Sans', sans-serif";

function FeatureCard({ title, lines, icon, delay }) {
  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        elevation={0}
        sx={{
          height: "100%",
          borderRadius: "16px",
          overflow: "hidden",
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
            sx={{
              fontFamily: fontMain,
              fontWeight: 700,
              color: colors.textUpper,
              fontSize: "1.25rem",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: colors.cardLowerBg,
            p: 3,
            flexGrow: 1,
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Box component="ul" sx={{ m: 0, pl: 2, color: colors.textLowerSec, fontFamily: fontMain, fontSize: "0.95rem", lineHeight: 1.7 }}>
            {lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
}

export default function LP_ProductDemo() {
  return (
    <Box sx={{ py: 12, px: { xs: 3, md: 8 }, maxWidth: "1280px", mx: "auto", width: "100%" }}>
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
          See MedEase in Action
        </Typography>
        <Typography
          sx={{
            fontFamily: fontMain,
            color: colors.textLowerSec,
            fontSize: "1.1rem",
            maxWidth: "650px",
            lineHeight: 1.5,
          }}
        >
          A gentle, student-centered way to plan next steps — with AI guidance and clear campus routing.
        </Typography>

        <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            href="https://medease.pages.dev/signup"
            target="_blank"
            rel="noreferrer"
            sx={{
              bgcolor: colors.primary,
              color: "#FFF",
              borderRadius: "12px",
              px: 3,
              fontFamily: fontMain,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { bgcolor: colors.buttonHover },
            }}
          >
            Try the demo
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <FeatureCard
          title="Recovery Assistant"
          icon={<MessageCircle size={24} />}
          lines={[
            "AI Chatbot & Guidance",
            "Personalized Plans",
            "Emotional Support",
          ]}
          delay={0}
        />
        <FeatureCard
          title="Campus Accessibility"
          icon={<Accessibility size={24} />}
          lines={[
            "Interactive Map",
            "Wheelchair Routes",
            "Live Updates",
          ]}
          delay={0.1}
        />
        <FeatureCard
          title="Community Hub"
          icon={<Users size={24} />}
          lines={[
            "Share & Connect",
            "Equipment Reuse",
            "Volunteer Support",
          ]}
          delay={0.2}
        />
      </Grid>
    </Box>
  );
}

