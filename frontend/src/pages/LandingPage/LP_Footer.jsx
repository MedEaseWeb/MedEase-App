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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const productLinks = t("lp.footer.product.links", { returnObjects: true });
  const companyLinks = t("lp.footer.company.links", { returnObjects: true });
  const legalLinks = t("lp.footer.legal.links", { returnObjects: true });
  const getAppLinks = t("lp.footer.getApp.links", { returnObjects: true });

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
                fontFamily: fontMain,
                color: colors.textSec,
                lineHeight: 1.6,
                mb: 4,
                maxWidth: "300px",
              }}
            >
              {t("lp.footer.tagline")}
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
            <FooterHeader>{t("lp.footer.product.heading")}</FooterHeader>
            {productLinks.map((link) => (
              <FooterLink key={link}>{link}</FooterLink>
            ))}
          </Grid>

          {/* --- COLUMN 3: COMPANY --- */}
          <Grid item xs={6} md={2}>
            <FooterHeader>{t("lp.footer.company.heading")}</FooterHeader>
            {companyLinks.map((link) => (
              <FooterLink key={link}>{link}</FooterLink>
            ))}
          </Grid>

          {/* --- COLUMN 4: LEGAL --- */}
          <Grid item xs={6} md={2}>
            <FooterHeader>{t("lp.footer.legal.heading")}</FooterHeader>
            {legalLinks.map((link) => (
              <FooterLink key={link}>{link}</FooterLink>
            ))}
          </Grid>

          {/* --- COLUMN 5: DOWNLOAD (Optional) --- */}
          <Grid item xs={6} md={2}>
            <FooterHeader>{t("lp.footer.getApp.heading")}</FooterHeader>
            {getAppLinks.map((link) => (
              <FooterLink key={link}>{link}</FooterLink>
            ))}
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
            {t("lp.footer.copyright", { year: new Date().getFullYear() })}
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
              {t("lp.footer.designedAt")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
