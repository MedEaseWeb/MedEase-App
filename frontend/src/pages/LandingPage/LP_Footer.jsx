import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import { Twitter, Instagram, Linkedin } from "lucide-react";

// --- TRANSPARENT PALETTE ---
const colors = {
  // Transparent to show the InteractiveBackground
  bg: "transparent",

  // High contrast text against the light background blobs
  textMain: "#2C2420",
  textSec: "#594D46",

  // Subtle dividers
  border: "rgba(44, 36, 32, 0.1)",

  // Icons
  iconBg: "rgba(44, 36, 32, 0.05)",
  iconHover: "rgba(44, 36, 32, 0.15)",
};

const fontMain = "'Plus Jakarta Sans', sans-serif";

const FooterLink = ({ children }) => (
  <Link
    href="#"
    underline="none"
    sx={{
      fontFamily: fontMain,
      color: colors.textSec,
      fontSize: "0.95rem",
      display: "block",
      mb: 1.5,
      transition: "color 0.2s",
      "&:hover": { color: colors.textMain },
    }}
  >
    {children}
  </Link>
);

const FooterHeader = ({ children }) => (
  <Typography
    variant="h6"
    sx={{
      fontFamily: fontMain,
      fontWeight: 700,
      color: colors.textMain,
      fontSize: "1rem",
      mb: 3,
      letterSpacing: "-0.01em",
    }}
  >
    {children}
  </Typography>
);

export default function LP_Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: colors.bg,
        pt: 10,
        pb: 6,
        px: { xs: 3, md: 8 },
        fontFamily: fontMain,
        borderTop: `1px solid ${colors.border}`,
        // Optional: Adds a tiny bit of frost to ensure text legibility over blobs
        backdropFilter: "blur(5px)",
      }}
    >
      <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
        <Grid container spacing={8}>
          {/* --- COLUMN 1: BRAND --- */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: fontMain,
                fontWeight: 800,
                color: colors.textMain,
                mb: 2,
                letterSpacing: "-0.03em",
              }}
            >
              MedEase
            </Typography>
            <Typography
              sx={{
                color: colors.textSec,
                lineHeight: 1.6,
                mb: 4,
                maxWidth: "300px",
              }}
            >
              The missing infrastructure for student health. Simplifying
              recovery, connecting caregivers, and reducing risk.
            </Typography>

            {/* Social Icons */}
            <Stack direction="row" spacing={2}>
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <IconButton
                  key={i}
                  size="small"
                  sx={{
                    color: colors.textMain,
                    bgcolor: colors.iconBg,
                    "&:hover": { bgcolor: colors.iconHover },
                  }}
                >
                  <Icon size={20} />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* --- COLUMN 2: PRODUCT --- */}
          <Grid item xs={6} md={2}>
            <FooterHeader>Product</FooterHeader>
            <FooterLink>Features</FooterLink>
            <FooterLink>For Universities</FooterLink>
            <FooterLink>For Students</FooterLink>
            <FooterLink>Security</FooterLink>
          </Grid>

          {/* --- COLUMN 3: COMPANY --- */}
          <Grid item xs={6} md={2}>
            <FooterHeader>Company</FooterHeader>
            <FooterLink>About Us</FooterLink>
            <FooterLink>Careers</FooterLink>
            <FooterLink>Blog</FooterLink>
            <FooterLink>Contact Support</FooterLink>
          </Grid>

          {/* --- COLUMN 4: LEGAL --- */}
          <Grid item xs={6} md={2}>
            <FooterHeader>Legal</FooterHeader>
            <FooterLink>Privacy Policy</FooterLink>
            <FooterLink>Terms of Service</FooterLink>
            <FooterLink>Cookie Policy</FooterLink>
            <FooterLink>Accessibility</FooterLink>
          </Grid>

          {/* --- COLUMN 5: DOWNLOAD (Optional) --- */}
          <Grid item xs={6} md={2}>
            <FooterHeader>Get the App</FooterHeader>
            <FooterLink>iOS App Store</FooterLink>
            <FooterLink>Google Play</FooterLink>
          </Grid>
        </Grid>

        {/* --- BOTTOM BAR --- */}
        <Divider sx={{ my: 6, borderColor: colors.border }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: colors.textSec,
              fontSize: "0.875rem",
              fontFamily: fontMain,
            }}
          >
            © {new Date().getFullYear()} MedEase Inc. All rights reserved.
          </Typography>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Typography
              sx={{
                color: colors.textSec,
                fontSize: "0.875rem",
                fontWeight: 500,
                fontFamily: fontMain,
              }}
            >
              Designed at Emory
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
