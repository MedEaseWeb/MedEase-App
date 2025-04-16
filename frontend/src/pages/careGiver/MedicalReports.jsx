import React from "react";
import { Paper, Typography, Box } from "@mui/material";

const MedicalReports = ({ reports }) => {
  if (!reports || reports.length === 0) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        mt: 3,
        p: 3,
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Section Title */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Medical Reports
      </Typography>

      {/* Reports List */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          maxHeight: 450,
          overflowY: "auto",
        }}
      >
        {reports.map((report, i) => (
          <Paper
            key={i}
            elevation={1}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#ffffff",
            }}
          >
            {/* Original Report */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Original Report
            </Typography>
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-line", color: "text.secondary", mb: 2 }}
            >
              {report.original_report}
            </Typography>

            {/* Simplified Report */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Simplified Report
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
              {report.simplified_report}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
};

export default MedicalReports;

