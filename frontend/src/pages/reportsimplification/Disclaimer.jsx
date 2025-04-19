import { Paper, Typography } from "@mui/material";
import React from "react";

export default function Disclaimer() {
  return (
    <Paper elevation={0} sx={{ p: 2, backgroundColor: "#FFF3CD" }}>
      <Typography
        sx={{
          fontFamily: "ECA, sans-serif",
          fontSize: 20,
          fontWeight: "bold",
          color: "#D39E00",
        }}
      >
        ⚠ Disclaimer
      </Typography>
      <Typography sx={{ fontFamily: "ECA, sans-serif", fontSize: 16 }}>
        The generated reports are for informational purposes only and{" "}
        <strong>do not</strong> guarantee accuracy or completeness. Always
        consult a qualified healthcare professional for medical advice.
      </Typography>
    </Paper>
  );
}
