import React from "react";
import { Box, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const fontMain = "'Plus Jakarta Sans', sans-serif";

export default function Logo({ imgSize = 60, fontSize = 48 }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <FavoriteBorderIcon sx={{ fontSize: imgSize, color: "#2C2420" }} />
      <Typography
        sx={{
          fontFamily: fontMain,
          fontWeight: 800,
          fontSize: fontSize,
          letterSpacing: "-0.03em",
          color: "#2C2420",
          lineHeight: 1,
        }}
      >
        Med
        <Box component="span" sx={{ color: "#A65D37" }}>
          Ease
        </Box>
      </Typography>
    </Box>
  );
}
