import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DescriptionIcon from "@mui/icons-material/Description";
import GavelIcon from "@mui/icons-material/Gavel";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

const EXPIRATION_TIME_MS = 2 * 60 * 1000; // 2 minutes

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

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleGenerateKey = () => {
    const newKey = {
      value: generateRandomKey(),
      createdAt: Date.now(),
      copied: false,
    };
    setGeneratedKeys((prev) => [newKey, ...prev]);
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
    },
    { text: "Terms of Service", icon: <GavelIcon />, path: "/terms" },
    { text: "Privacy Policy", icon: <PrivacyTipIcon />, path: "/privacy" },
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
          <Typography variant="h6" color="#00684A" fontWeight="bold">
            MedEase Menu
          </Typography>
          <IconButton
            onClick={toggleDrawer(false)}
            sx={{
              width: 30,
              height: 30,
              borderRadius: "20px",
              backgroundColor: "#f2f2f2",
              "&:hover": {
                backgroundColor: "#E6F4F1",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              ✕
            </Typography>
          </IconButton>
        </Box>
        <Divider />
        <List onClick={toggleDrawer(false)}>
          {drawerItems.map((item) => (
            <ListItem
              button
              key={item.text}
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
                primaryTypographyProps={{ fontSize: "1rem" }}
              />
            </ListItem>
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
            Generate Key
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
