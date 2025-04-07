import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ShareIcon from "@mui/icons-material/Share";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import CloseIcon from "@mui/icons-material/Close";

const backendBaseUrl = import.meta.env.VITE_API_URL;

const Disclaimer = () => (
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
      <strong>do not</strong> guarantee accuracy or completeness. Always consult
      a qualified healthcare professional for medical advice.
    </Typography>
  </Paper>
);

const reportSimplificationPage = () => {
  const [originalReport, setOriginalReport] = useState("");
  const [simplifiedReport, setSimplifiedReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);

  // for auto scrolling on simplified report
  const simplifiedScrollRef = useRef(null);
  useEffect(() => {
    if (simplifiedReport && simplifiedScrollRef.current) {
      setTimeout(() => {
        if (simplifiedScrollRef.current) {
          simplifiedScrollRef.current.scrollTop =
            simplifiedScrollRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [simplifiedReport]);

  const handleSimplify = async () => {
    setLoading(true);
    setSimplifiedReport("");

    try {
      const response = await fetch(
        `${backendBaseUrl}/simplify/dummy-stream`,
        // `${backendBaseUrl}/simplify/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: originalReport }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to the simplification service.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      // We're going to do a streaming loop outside React batching
      const streamLoop = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            if (buffer) {
              setSimplifiedReport((prev) => prev + buffer);
            }
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          let spaceIndex;
          while ((spaceIndex = buffer.indexOf(" ")) !== -1) {
            const word = buffer.slice(0, spaceIndex + 1); // include the space
            buffer = buffer.slice(spaceIndex + 1);

            // use a microtask to force render
            await new Promise((resolve) => {
              setSimplifiedReport((prev) => {
                resolve(null); // wait before next iteration
                return prev + word;
              });
            });
          }
        }
      };

      await streamLoop();
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 110px)",
      }}
    >
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
            <Box sx={{ maxHeight: "100%", minHeight: "100%" }}>
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
                    }}
                  >
                    <Typography sx={{ fontFamily: "ECA, sans-serif" }}>
                      Simplify
                    </Typography>
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Grid>

          {/* Simplified Report Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ maxHeight: "100%", minHeight: "100%", height: "100%" }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: "linear-gradient(to right, #f9f9f9, #eef2f3)",
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                  height: "100%", // ✅ fill parent exactly
                  display: "flex",
                  flexDirection: "column",
                  boxSizing: "border-box", // ✅ respect padding in 100% height
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
                  Simplified Report
                </Typography>

                <Box
                  ref={simplifiedScrollRef}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    p: 2,
                    flexGrow: 1,
                    minHeight: "252px", // ✅ matches rows={11}
                    maxHeight: "252px",
                    overflowY: "auto",
                    fontFamily: "ECA, sans-serif",
                    fontSize: 14,
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.5,
                  }}
                >
                  {simplifiedReport || (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: 16,
                        fontFamily: "ECA, sans-serif",
                        fontWeight: "regular",
                        color: "#9e9e9e",
                        mb: 2,
                      }}
                    >
                      Your simplified report will appear here...
                    </Typography>
                  )}
                </Box>

                {/* Action Buttons: Download, Share, Help */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    marginTop: "auto",
                  }}
                >
                  <Tooltip title="View Full Screen">
                    <span>
                      <IconButton
                        onClick={() => setFullScreenOpen(true)}
                        sx={{
                          color: "#004D40",
                        }}
                      >
                        <AspectRatioIcon />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="Download Simplified Report">
                    <span>
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
                    </span>
                  </Tooltip>

                  <Tooltip title="Share Simplified Report">
                    <span>
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
                    </span>
                  </Tooltip>

                  <Tooltip title="Help">
                    <span>
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
                    </span>
                  </Tooltip>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Disclaimer at the Bottom */}
        <Box sx={{ mt: 3 }}>
          <Disclaimer />
        </Box>
      </Box>
      {/* fullscreen mode */}
      {fullScreenOpen && (
        <>
          {/* Blurred backdrop */}
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(6px)",
              zIndex: 1299, // below the modal content
            }}
          />

          {/* Centered modal */}
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80vw",
              height: "80vh",
              backgroundColor: "white",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              borderRadius: 3,
              zIndex: 1300,
              p: 4,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography
                variant="h6"
                sx={{ fontFamily: "ECA, sans-serif", color: "#00684A" }}
              >
                Simplified Report (Full Screen)
              </Typography>
              <IconButton onClick={() => setFullScreenOpen(false)}>
                <CloseIcon sx={{ color: "#004D40" }} />
              </IconButton>
            </Box>

            <Box
              ref={simplifiedScrollRef}
              sx={{
                flexGrow: 1,
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: 2,
                padding: 2,
                overflowY: "auto",
                fontFamily: "ECA, sans-serif",
                fontSize: 16,
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
              }}
            >
              {simplifiedReport || (
                <Typography
                  variant="body2"
                  sx={{ fontStyle: "italic", color: "grey" }}
                >
                  Your simplified report will appear here...
                </Typography>
              )}
            </Box>
          </Box>
        </>
      )}
      {/* end fukl screen mode */}
    </Box>
  );
};

export default reportSimplificationPage;
