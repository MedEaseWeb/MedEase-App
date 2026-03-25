import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { useTranslation } from "react-i18next";

const colors = {
  textMain: "#2C2420",
  textSec: "#594D46",
  border: "rgba(44, 36, 32, 0.1)",
};

const fontMain = "'Plus Jakarta Sans', sans-serif";

export default function LP_Footer() {
  const { t } = useTranslation();
  const legalLinks = t("lp.footer.legal.links", { returnObjects: true });

  return (
    <Box
      component="footer"
      sx={{
        pt: 6,
        pb: 4,
        px: { xs: 3, md: 8 },
        fontFamily: fontMain,
        borderTop: `1px solid ${colors.border}`,
        backdropFilter: "blur(5px)",
      }}
    >
      <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
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
            sx={{ color: colors.textSec, fontSize: "0.875rem", fontFamily: fontMain }}
          >
            {t("lp.footer.copyright", { year: new Date().getFullYear() })}
          </Typography>

          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            {legalLinks.map((link, i) => (
              <Link
                key={i}
                href={i === 0 ? "/privacy" : "/terms"}
                underline="hover"
                sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "0.875rem", "&:hover": { color: colors.textMain } }}
              >
                {link}
              </Link>
            ))}
            <Link
              href="https://github.com/MedEaseWeb"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "0.875rem", "&:hover": { color: colors.textMain } }}
            >
              GitHub
            </Link>
            <Link
              href="https://www.linkedin.com/company/111048526"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ fontFamily: fontMain, color: colors.textSec, fontSize: "0.875rem", "&:hover": { color: colors.textMain } }}
            >
              LinkedIn
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
