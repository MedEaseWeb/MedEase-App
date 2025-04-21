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
  Tooltip,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ShareIcon from "@mui/icons-material/Share";
import DragDropTextField from "./DragDropTextField";
import { motion } from "framer-motion";
import Disclaimer from "./Disclaimer";

const backendBaseUrl = import.meta.env.VITE_API_URL;

const reportSimplificationPage = () => {
  const [originalReport, setOriginalReport] = useState("");
  const [simplifiedReport, setSimplifiedReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await fetch(`${backendBaseUrl}/general/email`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email);
        } else {
          console.error("Failed to fetch email");
        }
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    };

    fetchEmail();
  }, []);

  useEffect(() => {
    const fetchId = async () => {
      try {
        const response = await fetch(
          `${backendBaseUrl}/general/resolve-user-id`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              password: "ignored",
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserId(data.user_id);
        } else {
          console.error("Failed to fetch id");
        }
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    };
    if (userEmail) {
      fetchId();
    }
  }, [userEmail]);

  // useEffect(() => {
  //   console.log(originalReport);
  // }, [originalReport]);

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
        `${backendBaseUrl}/simplify/stream-and-save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: originalReport,
            user_id: userId,
            user_email: userEmail,
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to the simplification service.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

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
            const word = buffer.slice(0, spaceIndex + 1);
            buffer = buffer.slice(spaceIndex + 1);

            await new Promise((resolve) => {
              setSimplifiedReport((prev) => {
                resolve(null);
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

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          `${backendBaseUrl}/simplify/reports/${userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }

        const data = await response.json();
        setReports(data.reports || []);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchReports();
    }
  }, [userId]);

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

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReportIndex, setSelectedReportIndex] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReportSelect = (report, index) => {
    if (index === null) {
      // Add New selected
      setOriginalReport("");
      setSimplifiedReport("");
      setSelectedReportIndex(null);
    } else {
      // Existing report selected
      const simplifiedText = report.simplified_report || "";
      const formattedText = report.formatted_simplified_report || "";

      const fullText = `**Detailed Summary**\n
${simplifiedText}

**Highlight Outlines**
${formattedText}`;

      setOriginalReport(report.original_report || "");
      setSimplifiedReport(fullText);
      setSelectedReportIndex(index);
    }

    handleMenuClose();
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
                <DragDropTextField
                  originalReport={originalReport}
                  setOriginalReport={setOriginalReport}
                />
                <motion.div whileHover={{ scale: 1 }}>
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
                </motion.div>
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
                <Box
                  display="flex"
                  justifyContent="space-between"
                  width={"100%"}
                >
                  <Box width="50%">
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
                  </Box>
                  <Box width="50%" textAlign="right">
                    <Button
                      variant="outlined"
                      onClick={handleMenuOpen}
                      sx={{
                        textTransform: "none",
                        fontFamily: "ECA, sans-serif",
                        fontWeight: "bold",
                        fontSize: 14,
                        color: "#00684A",
                        borderColor: "#00684A",
                        "&:hover": {
                          backgroundColor: "#e0f2f1",
                          borderColor: "#00684A",
                        },
                      }}
                    >
                      {selectedReportIndex !== null
                        ? `${reports[selectedReportIndex]?.name}`
                        : "View Past Reports"}
                    </Button>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      PaperProps={{ sx: { maxHeight: 300 } }}
                    >
                      <MenuItem
                        onClick={() => handleReportSelect({}, null)}
                        sx={{
                          fontFamily: "ECA, sans-serif",
                          fontSize: 14,

                          color: "#00684A",
                        }}
                      >
                        + Add New
                      </MenuItem>
                      {reports.map((report, idx) => (
                        <MenuItem
                          key={idx}
                          onClick={() => handleReportSelect(report, idx)}
                          sx={{
                            fontFamily: "ECA, sans-serif",
                            fontSize: 14,
                            whiteSpace: "normal",
                          }}
                        >
                          {report.name}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Box>

                <Box
                  ref={simplifiedScrollRef}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    p: 2,
                    flexGrow: 1,
                    minHeight: "252px",
                    maxHeight: "252px",
                    overflowY: "auto",
                    fontFamily: "ECA, sans-serif",
                    fontSize: 14,
                    lineHeight: 1.5,
                    whiteSpace: "normal", // important for markdown rendering
                  }}
                >
                  {simplifiedReport ? (
                    <ReactMarkdown>{simplifiedReport}</ReactMarkdown>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: 14,
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

                lineHeight: 1.5,
                whiteSpace: "normal",
              }}
            >
              {simplifiedReport ? (
                <ReactMarkdown>{simplifiedReport}</ReactMarkdown>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ color: "grey", fontSize: 14 }}
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
