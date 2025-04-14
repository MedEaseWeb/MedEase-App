import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Drawer,
  Grid2,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import medicalBackground from "../../assets/pics/medical.webp";
import Logo from "../utility/Logo";
import useWindowSize from "../../hooks/useWindowSize";
import { motion } from "framer-motion";
import Blob from "../utility/Blob";
import { useAuth } from "../../context/AuthContext";

const backendBaseUrl = import.meta.env.VITE_API_URL;

const Sidebar = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { login } = useAuth();

  const validateEmail = (email) => ({
    isValid: email.trim().length != 0,
  });

  const validatePassword = (password) => ({
    isValid: password.trim().length != 0,
  });

  const validation_password = validatePassword(password);
  const validation_email = validateEmail(email);

  const validateAll = () => {
    return {
      allValid: validation_email.isValid && validation_password.isValid,
    };
  };

  const handleLogin = async () => {
    const validation = validateAll();
    if (!validation.allValid) {
      console.log("Validation failed:", validation);
      return;
    }
    try {
      await login(email, password);
      navigate("/reportsimplifier"); // <-- redirect AFTER context is updated
      console.log("Logged in and redirected.");
    } catch (error) {
      console.error("Login error:", error);
    }
  };


  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 400,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 400,
          boxSizing: "border-box",
        },
      }}
    >
      <Box p={4}>
        {/* Logo */}
        <Box>
          <Logo />
        </Box>
        {/* create account prompt */}
        <Box pt={5}>
          <Typography
            sx={{
              fontFamily: "ECA, sans-serif",
              fontWeight: "Regular",
              color: "#00684A",
              fontSize: 28,
            }}
          >
            Log In
          </Typography>
          <Typography
            sx={{
              fontFamily: "ECA, sans-serif",
              fontWeight: "Regular",
              fontSize: 18,
              mt: 2,
            }}
          >
            Don't have an account?{" "}
            <motion.span
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                navigate("/signup");
              }}
              style={{ cursor: "pointer", display: "inline-block" }}
            >
              <span
                style={{
                  color: "#0077b6",
                  fontFamily: "ECA, sans-serif",
                  textDecoration: "underline",
                }}
              >
                Sign Up
              </span>
            </motion.span>
          </Typography>
        </Box>
        {/* input boxes */}
        <Box pt={10}>
          {/* email */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <TextField
              id="email-field"
              label="Email"
              variant="outlined"
              size="small"
              color="balck"
              onChange={(e) => setEmail(e.target.value)}
              sx={{ width: "100%" }}
              slotProps={{
                inputLabel: {
                  sx: {
                    fontFamily: "ECA, sans-serif",
                    fontWeight: "Regular",
                    fontSize: "14px",
                  },
                },
                input: {
                  sx: {
                    fontFamily: "ECA, sans-serif",
                    fontWeight: "Regular",
                    fontSize: "14px",
                  },
                },
              }}
            />
          </Box>

          {/* password  */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 2,
              pb: 1,
            }}
          >
            <TextField
              id="password-field"
              label="Password"
              variant="outlined"
              color="black"
              size="small"
              type={showPassword ? "text" : "password"} // Toggles between *** and text
              sx={{ width: "100%" }}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                inputLabel: {
                  sx: {
                    fontFamily: "ECA, sans-serif",
                    fontWeight: "Regular",
                    fontSize: "14px",
                  },
                },
                input: {
                  sx: {
                    fontFamily: "ECA, sans-serif",
                    fontWeight: "Regular",
                    fontSize: "14px",
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ fontSize: "18px" }} />
                        ) : (
                          <Visibility sx={{ fontSize: "18px" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </Box>

        {/* submit button */}
        <Box pt={5}>
          <motion.div
            whileHover={
              validateAll().allValid ? { scale: 1.1, originX: 0 } : {}
            }
            style={{
              width: "fit-content",
              display: "inline-block",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={!validateAll().allValid}
              onClick={handleLogin}
              sx={{
                fontFamily: "ECA, sans-serif",
                fontWeight: "Regular",
                fontSize: "14px",
                minWidth: "100px",
                maxWidth: "100px",
                maxHeight: "30px",
                backgroundColor: "#00684A",
              }}
            >
              Log in
            </Button>
          </motion.div>
        </Box>
      </Box>
    </Drawer>
  );
};

export default function Login() {
  const { width, height } = useWindowSize();

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#081D2A",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <Blob></Blob>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          zIndex: 2,
        }}
      >
        {/* Background Image Section */}
        {/* Foreground Text Section */}
        {width > 768 ? (
          <Grid2 container sx={{ textAlign: "center", maxWidth: "60%" }}>
            <Grid2
              sx={{
                backdropFilter: "blur(1px)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)", // Softer shadow
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 20,
                  fontFamily: "ECA, sans-serif",
                  fontWeight: "Regular",
                  color: "#F5F5F5",
                }}
              >
                An AI-powered tool that simplifies medical reports, explains
                medications, and enables interactive feedback to enhance patient
                understanding and health literacy.
              </Typography>
              <Typography
                sx={{
                  fontSize: 20,
                  fontFamily: "ECA, sans-serif",
                  fontWeight: "Regular",
                  color: "#F5F5F5",
                  textDecoration: "underline",
                }}
              >
                <br />
                Learn more about us
              </Typography>
            </Grid2>
          </Grid2>
        ) : (
          <></>
        )}
        {width > 1024 ? (
          <Box
            sx={{
              width: "60%",
              height: "60%",
              backgroundImage: `url(${medicalBackground})`,
              backgroundSize: "</Logo>cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
}
