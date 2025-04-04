import {
  Cancel,
  CheckCircle,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  Grid2,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import medicalBackground from "../../assets/pics/medical.webp";
import useWindowSize from "../../hooks/useWindowSize";
import Logo from "../utility/Logo";
import { motion } from "framer-motion";
import Blob from "../utility/Blob";
import axios from "axios";

const backendBaseUrl = import.meta.env.VITE_API_URL;

const Sidebar = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [checkTerms, setCheckTerms] = useState(false);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const validateEmail = (email) => ({
    isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  });

  const validatePassword = (password) => ({
    length: password.length >= 8,
    hasNumber: /\d/.test(password),
  });

  const validation_password = validatePassword(password);
  const validation_email = validateEmail(email);

  const validateAll = () => {
    return {
      emailValid: validation_email.isValid,
      passwordValid:
        validation_password.length && validation_password.hasNumber,
      termsChecked: checkTerms,
      allValid:
        validation_email.isValid &&
        validation_password.length &&
        validation_password.hasNumber &&
        checkTerms,
    };
  };

  // @TODO: send logic

  const handleSignup = async () => {
    const validation = validateAll();
    if (!validation.allValid) {
      console.log("Validation failed:", validation);
      return;
    }

    console.log("Submitting signup request");

    try {
      const response = await axios.post(
       `${backendBaseUrl}/auth/register`,{
        email: email,
        password: password,
      });

      console.log("Signup successful:", response.data);
      navigate("/login"); // Redirect after successful signup
    } catch (error) {
      console.error(
        "Signup error:",
        error.response ? error.response.data : error
      );
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
            Create your account
          </Typography>
          <Typography
            sx={{
              fontFamily: "ECA, sans-serif",
              fontWeight: "Regular",
              fontSize: 18,
              mt: 2,
            }}
          >
            Have an account?{" "}
            <motion.span
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                navigate("/login");
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
                Log In
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
          {/* checklines: email address */}
          <Grid2 container direction={"column"} pt={1}>
            <Grid2 item="true" xs={12} ml={7}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "ECA, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    color: email
                      ? validation_email.isValid
                        ? "#00684A"
                        : "#F4A261"
                      : "grey",
                  }}
                >
                  {validation_email.isValid ? (
                    <CheckCircle sx={{ fontSize: 14 }} />
                  ) : (
                    <Cancel sx={{ fontSize: 14 }} />
                  )}
                  Valid Email Address
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
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
          {/* check lines */}
          <Grid2 container direction={"column"}>
            <Grid2 item="true" xs={12} ml={7}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "ECA, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    color: password
                      ? validation_password.length
                        ? "#00684A"
                        : "#F4A261"
                      : "grey",
                  }}
                >
                  {validation_password.length ? (
                    <CheckCircle sx={{ fontSize: 14 }} />
                  ) : (
                    <Cancel sx={{ fontSize: 14 }} />
                  )}
                  Should be at least 8 characters
                </Typography>
              </Box>
            </Grid2>
            <Grid2 item="true" xs={12} ml={7}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "ECA, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    color: password
                      ? validation_password.hasNumber
                        ? "#00684A"
                        : "#F4A261"
                      : "grey",
                  }}
                >
                  {validation_password.hasNumber ? (
                    <CheckCircle sx={{ fontSize: 14 }} />
                  ) : (
                    <Cancel sx={{ fontSize: 14 }} />
                  )}
                  Should contain at least 1 number
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </Box>
        {/* check policy and terms */}
        <Box
          pt={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <Checkbox
              checked={checkTerms}
              onChange={(e) => setCheckTerms(e.target.checked)}
              color="black"
            />
          </Box>
          <Typography
            sx={{
              fontFamily: "ECA, sans-serif",
              fontWeight: "regular",
              fontSize: 13,
            }}
          >
            I accept the Terms of Service & Privacy Policy
          </Typography>
        </Box>
        {/* submit button */}
        <Box pt={3}>
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
              onClick={() => {
                console.log("Sign Up button clicked");
                handleSignup();
              }}
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
              Sign Up
            </Button>
          </motion.div>
        </Box>
      </Box>
    </Drawer>
  );
};

export default function SignUp() {
  const { width, height } = useWindowSize();
  console.log(width);
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
              item="true"
              xs={12}
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
              backgroundSize: "cover",
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
