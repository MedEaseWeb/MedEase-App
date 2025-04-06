import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
  Divider,
} from "@mui/material";
import React, { useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ShareIcon from "@mui/icons-material/Share";
import axios from "axios";

const backendBaseUrl = import.meta.env.VITE_API_URL;

const Disclaimer = () => (
  <Paper sx={{ p: 2, mt: 3, backgroundColor: "#FFF3CD", borderRadius: 2 }}>
    <Typography
      sx={{
        fontFamily: "ECA, sans-serif",
        fontWeight: "bold",
        color: "#D39E00",
      }}
    >
      ⚠ Disclaimer
    </Typography>
    <Typography sx={{ fontFamily: "ECA, sans-serif", fontSize: 14 }}>
      The generated reports are for informational purposes only and{" "}
      <strong>do not</strong> guarantee accuracy or completeness. Always consult
      a qualified healthcare professional for medical advice.
    </Typography>
  </Paper>
);

const reportSimplificationPage = () => {
  const [originalReport, setOriginalReport] = useState("");
  const [simplifiedReport, setSimplifiedReport] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSimplify = async () => {
    setLoading(true);
    setSimplifiedReport("");
    try {
      // Adjust the endpoint to your actual backend
      const response = await axios.post(
        "http://localhost:8081/report/simplify",
        { text: originalReport },
        { withCredentials: true }
      );
      setSimplifiedReport(
        response.data.simplifiedText || "No simplified text returned."
      );
    } catch (error) {
      console.error("Error simplifying report:", error);
      alert("Error simplifying report");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([simplifiedReport], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "SimplifiedReport.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleShare = () => {
    alert("Share feature coming soon!");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* How to Use at the Top. @TODO: to be filled with more docs */}
      <Box m={3}>
        <Accordion
          elevation={0}
          sx={{
            backgroundColor: "#E0F2F1",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="how-to-use-content"
            id="how-to-use-header"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: 20,
                fontFamily: "ECA, sans-serif",
                fontWeight: "bold",
                color: "#00684A",
              }}
            >
              How to Use
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              display: "block", // Ensures content expands only downward
            }}
          >
            <Divider sx={{ my: 1 }} />
            <Typography
              sx={{
                fontSize: 16,
                fontFamily: "ECA, sans-serif",
                fontWeight: "regular",
                color: "#222222",
                mb: 1,
              }}
            >
              1. Paste your original medical report in the left box.
            </Typography>
            <Typography
              sx={{
                fontSize: 16,
                fontFamily: "ECA, sans-serif",
                fontWeight: "regular",
                color: "#222222",
                mb: 1,
              }}
            >
              2. Click <strong>Simplify</strong> to generate an
              easy-to-understand version.
            </Typography>
            <Typography
              sx={{
                fontSize: 16,
                fontFamily: "ECA, sans-serif",
                fontWeight: "regular",
                color: "#222222",
                mb: 1,
              }}
            >
              3. Download or share the simplified report as needed.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ px: 3, pb: 3, flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Original Report Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(to right, #f9f9f9, #eef2f3)",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                // border: "1px solid #ccc",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  fontSize: 20,
                  fontFamily: "ECA, sans-serif",
                  fontWeight: "Bold",
                  color: "#00684A",
                  mb: 2,
                }}
              >
                Original Report
              </Typography>
              <TextField
                multiline
                rows={11}
                variant="outlined"
                placeholder="Paste your original medical report here..."
                fullWidth
                value={originalReport}
                onChange={(e) => setOriginalReport(e.target.value)}
                sx={{
                  backgroundColor: "#fff",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ccc",
                      transition: "border-color 0.3s ease",
                    },
                    "&:hover fieldset": {
                      borderColor: "#00897B",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#004D40",
                    },
                  },
                }}
                slotProps={{
                  inputLabel: {
                    sx: {
                      fontFamily: "ECA, sans-serif",
                      fontWeight: "Regular",
                    },
                  },
                  input: {
                    sx: {
                      fontFamily: "ECA, sans-serif",
                      fontWeight: "Regular",
                    },
                  },
                }}
              />
              <Box sx={{ textAlign: "right", mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSimplify}
                  sx={{
                    backgroundColor: "#00897B",
                    color: "#fff",
                    borderRadius: "25px",
                    fontWeight: "bold",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#00695C",
                      transform: "translateY(-2px)",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <Typography sx={{ fontFamily: "ECA, sans-serif" }}>
                    Simplify
                  </Typography>
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Simplified Report Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(to right, #f9f9f9, #eef2f3)",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                // border: "1px solid #ccc",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#004D40", mb: 2 }}
              >
                Simplified Report
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" color="textSecondary">
                      Simplifying report...
                    </Typography>
                  </Box>
                ) : simplifiedReport ? (
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {simplifiedReport}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Your simplified report will appear here after clicking
                    "Simplify".
                  </Typography>
                )}
              </Box>

              {/* Action Buttons: Download, Share, Help */}
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                }}
              >
                <Tooltip title="Download Simplified Report">
                  <IconButton
                    onClick={handleDownload}
                    disabled={!simplifiedReport}
                    sx={{
                      color: "#004D40",
                      "&:disabled": { opacity: 0.4 },
                    }}
                  >
                    <FileDownloadIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Share Simplified Report">
                  <IconButton
                    onClick={handleShare}
                    disabled={!simplifiedReport}
                    sx={{
                      color: "#004D40",
                      "&:disabled": { opacity: 0.4 },
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Help">
                  <IconButton
                    onClick={() =>
                      alert(
                        "This feature helps you simplify complex medical reports."
                      )
                    }
                    sx={{ color: "#004D40" }}
                  >
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Disclaimer at the Bottom */}
        <Box sx={{ p: 3, mt: 3 }}>
          <Disclaimer />
        </Box>
      </Box>
    </Box>
  );
};

export default reportSimplificationPage;
