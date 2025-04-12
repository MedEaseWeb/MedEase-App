import React, { useState, useEffect } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Menu as MenuIcon, Logout as LogoutIcon } from "@mui/icons-material";
import Logo from "./Logo";
import { styled } from "@mui/material/styles";
import LeftMenu from "./LeftMenu";
import { motion } from "framer-motion";
import useWindowSize from "../../hooks/useWindowSize";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const backendBaseUrl = import.meta.env.VITE_API_URL;

const NavButton = styled(Button)(({ theme }) => ({
  borderRadius: "10px",
  padding: "9px 25px", // Adjust size
  fontSize: "1.2rem",
  fontWeight: "bold",
  textTransform: "none", // Keep original lowercase
  color: "#333", // Default text color
  backgroundColor: "transparent",
  "&:hover": {
    color: "#00684A",
  },
  "&.active": {
    color: "#00684A",
  },
}));

const TopBar = ({ onMenuClick }) => {
  const { width, height } = useWindowSize();

  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

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
  }, []); // Runs only on component mount

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendBaseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Logout successful");
        navigate("/login"); // Redirect to login page
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AppBar position="fixed" color="inherit" elevation={1} sx={{ px: 2 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          rowGap: 1,
          py: 1,
        }}
      >
        {/* Left Section: Menu Icon + Logo */}
        {width > 1140 ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LeftMenu drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
            <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
              <Logo imgSize={40} fontSize={30} />
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LeftMenu drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
          </Box>
        )}

        {/* Center Section: Navigation Buttons */}
        {width < 800 ? (
          // placeholder
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <Logo imgSize={40} fontSize={30} />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
              flex: 1,
              mx: 1,
              flexShrink: 0,
              minWidth: 0,
              ml: -5,
            }}
          >
            <motion.div whileHover={{ scale: 1.1 }}>
              <NavButton component={NavLink} to="/reportsimplifier">
                <Typography
                  sx={{
                    fontSize: 20,
                    fontFamily: "ECA, sans-serif",
                    fontWeight:
                      location.pathname === "/reportsimplifier"
                        ? "Bold"
                        : "Regular",
                    color:
                      location.pathname === "/reportsimplifier"
                        ? "#00684A"
                        : "#222222",
                  }}
                >
                  Report Simplifier
                </Typography>
              </NavButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <NavButton component={NavLink} to="/medication">
                <Typography
                  sx={{
                    fontSize: 20,
                    fontFamily: "ECA, sans-serif",
                    fontWeight:
                      location.pathname === "/medication" ? "Bold" : "Regular",
                    color:
                      location.pathname === "/medication"
                        ? "#00684A"
                        : "#222222",
                  }}
                >
                  Medication Help
                </Typography>
              </NavButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <NavButton component={NavLink} to="/caregiver">
                <Typography
                  sx={{
                    fontSize: 20,
                    fontFamily: "ECA, sans-serif",
                    fontWeight:
                      location.pathname === "/caregiver" ? "Bold" : "Regular",
                    color:
                      location.pathname === "/caregiver"
                        ? "#00684A"
                        : "#222222",
                  }}
                >
                  CareGiver Mode
                </Typography>
              </NavButton>
            </motion.div>
          </Box>
        )}

        {/* Right Section: User Email + Logout Button */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0, // Adds spacing between email and button
            mr: -1,
          }}
        >
          <Profile handleLogout={handleLogout} userEmail={userEmail} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

function Profile({ handleLogout, userEmail }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="black"
      >
        <AccountCircleIcon sx={{ fontSize: 30 }} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem>
          <Typography sx={{ fontFamily: "ECA, sans-serif" }}>
            {userEmail}
          </Typography>
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <Typography sx={{ fontFamily: "ECA, sans-serif" }}>Logout</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}
