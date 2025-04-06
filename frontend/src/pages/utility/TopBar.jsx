import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Menu as MenuIcon, Logout as LogoutIcon } from "@mui/icons-material";
import Logo from "./Logo";
import { styled } from "@mui/material/styles";
import LeftMenu from "./LeftMenu";

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
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LeftMenu drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <Logo imgSize={40} fontSize={31} />
          </Box>
        </Box>

        {/* Center Section: Navigation Buttons */}
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
          }}
        >
          <NavButton component={NavLink} to="/reportsimplifier">
            <Typography
              sx={{
                fontSize: 20,
                fontFamily: "ECA, sans-serif",
                fontWeight: "Bold",
                color: "#00684A",
              }}
            >
              Report Simplifier
            </Typography>
          </NavButton>
          <NavButton component={NavLink} to="/medication">
            <Typography
              sx={{
                fontSize: 20,
                fontFamily: "ECA, sans-serif",
                fontWeight: "Bold",
                color: "#00684A",
              }}
            >
              Medication Help
            </Typography>
          </NavButton>
          <NavButton component={NavLink} to="/caregiver">
            <Typography
              sx={{
                fontSize: 20,
                fontFamily: "ECA, sans-serif",
                fontWeight: "Bold",
                color: "#00684A",
              }}
            >
              CareGiver Mode
            </Typography>
          </NavButton>
        </Box>
        {/* Right Section: User Email + Logout Button */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0, // Adds spacing between email and button
            mr: -1,
          }}
        >
          {userEmail && (
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: "bold",
                color: "#00684A",
                whiteSpace: "nowrap",
              }}
            >
              {userEmail}
            </Typography>
          )}
          {/* Logout Button */}
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              "&:hover": { color: "#00684A" },
            }}
          >
            <Typography
              sx={{
                fontSize: 18,
                fontFamily: "ECA, sans-serif",
                fontWeight: "Regular",
                color: "#222222",
              }}
            >
              Logout
            </Typography>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
