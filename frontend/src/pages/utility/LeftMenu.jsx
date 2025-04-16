import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Typography,
  Divider,
  Button,
  Tooltip,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DescriptionIcon from "@mui/icons-material/Description";
import GavelIcon from "@mui/icons-material/Gavel";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import useWindowSize from "../../hooks/useWindowSize";
import SummarizeIcon from "@mui/icons-material/Summarize";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";

const backendBaseUrl = import.meta.env.VITE_API_URL;
const EXPIRATION_TIME_MS = 60 * 60 * 1000; // 1 hour

const generateRandomKey = () => {
  return (
    Math.random().toString(36).substring(2, 10).toUpperCase() +
    "-" +
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );
};

const LeftMenu = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [generatedKeys, setGeneratedKeys] = useState([]);
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleGenerateKey = async () => {
    const keyValue = generateRandomKey();

    const newKey = {
      value: keyValue,
      createdAt: Date.now(),
      copied: false,
    };
    try {
      const response = await fetch(`${backendBaseUrl}/general/generate-key`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ generated_key: keyValue }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to generate key");
      }

      const data = await response.json();
      setGeneratedKeys((prev) => [newKey, ...prev]);
    } catch (error) {
      console.error("Error generating key:", error);
    }
  };

  const handleCopy = async (keyValue) => {
    await navigator.clipboard.writeText(keyValue);
    setGeneratedKeys((prev) =>
      prev.map((key) =>
        key.value === keyValue ? { ...key, copied: true } : key
      )
    );
  };

  // Remove expired keys automatically (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      setGeneratedKeys((prev) =>
        prev.filter(
          (key) => Date.now() - key.createdAt < EXPIRATION_TIME_MS * 2
        )
      );
    }, 10000); // Clean every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const drawerItems = [
    {
      text: "Documentation",
      icon: <DescriptionIcon />,
      path: "/documentation",
      key: "documentation",
    },
    {
      text: "Terms of Service",
      icon: <GavelIcon />,
      path: "/terms",
      key: "termsofservice",
    },
    {
      text: "Privacy Policy",
      icon: <PrivacyTipIcon />,
      path: "/privacy",
      key: "privacy",
    },
  ];

  const navDrawerItems = [
    {
      text: "Report Simplifier",
      icon: <SummarizeIcon />,
      path: "/reportsimplifier",
      key: "reportsimplifier",
    },
    {
      text: "Medication Help",
      icon: <MedicalInformationIcon />,
      path: "/medication",
      key: "medication",
    },
    {
      text: "CareGiver Mode",
      icon: <EscalatorWarningIcon />,
      path: "/caregiver",
      key: "caregiver",
    },
  ];

  const drawerContent = (
    <Box
      sx={{
        width: 260,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fefefe",
        justifyContent: "space-between",
      }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <Box>
        {/* Top Bar with Title and Close Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: "ECA, sans-serif",
              fontSize: 20,
              fontWeight: "bold",
              color: "#00684A",
            }}
          >
            MedEase Menu
          </Typography>
          <IconButton
            onClick={toggleDrawer(false)}
            sx={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              backgroundColor: "#f2f2f2",
              "&:hover": {
                backgroundColor: "#E6F4F1",
              },
              transition: "all 0.2s ease-in-out",
            }}
            aria-label="close drawer"
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
        </Box>
        {width < 800 ? (
          <Box>
            <Divider />
            <List onClick={toggleDrawer(false)}>
              {navDrawerItems.map((item) => (
                <ListItemButton
                  key={item.key}
                  onClick={() => navigate(item.path)}
                  sx={{
                    "&:hover": {
                      bgcolor: "#E6F4F1",
                      color: "#00684A",
                    },
                    px: 3,
                    py: 1.5,
                  }}
                >
                  <ListItemIcon sx={{ color: "#00684A" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontFamily: "ECA, sans-serif",
                      color: "black",
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        ) : (
          <></>
        )}

        <Divider />
        <List onClick={toggleDrawer(false)}>
          {drawerItems.map((item) => (
            <ListItemButton
              key={item.key}
              onClick={() => navigate(item.path)}
              sx={{
                "&:hover": {
                  bgcolor: "#E6F4F1",
                  color: "#00684A",
                },
                px: 3,
                py: 1.5,
              }}
            >
              <ListItemIcon sx={{ color: "#00684A" }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontFamily: "ECA, sans-serif",
                  color: "black",
                }}
              />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Generate Key */}
        <Box sx={{ px: 3 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<VpnKeyIcon />}
            onClick={handleGenerateKey}
            sx={{
              color: "#00684A",
              borderColor: "#00684A",
              fontWeight: "bold",
              mb: 2,
              "&:hover": {
                bgcolor: "#E6F4F1",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "ECA, sans-serif",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              Generate Key
            </Typography>
          </Button>

          {generatedKeys.map((key, index) => {
            const isExpired = Date.now() - key.createdAt > EXPIRATION_TIME_MS;
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: "#f5f5f5",
                  px: 2,
                  py: 1,
                  mb: 1,
                  borderRadius: "6px",
                  opacity: isExpired || key.copied ? 0.4 : 1,
                  pointerEvents: isExpired ? "none" : "auto",
                  position: "relative",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "140px",
                  }}
                >
                  {key.value}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {!key.copied && !isExpired && (
                    <Tooltip title="Copy to clipboard">
                      <IconButton
                        onClick={() => handleCopy(key.value)}
                        size="small"
                      >
                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {isExpired && (
                    <Typography variant="caption" color="error">
                      Expired
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        onClick={toggleDrawer(true)}
        sx={{
          ml: -3,
          "& svg": { fontSize: 27 },
          "&:hover": { color: "#00684A" },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default LeftMenu;
