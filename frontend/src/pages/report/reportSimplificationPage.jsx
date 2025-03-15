import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Paper,
  TextField,
  IconButton,
  Grid,
} from "@mui/material";
import {
  Medication as MedicationIcon,
  Restaurant,
  FitnessCenter,
  Event,
  LocalPharmacy,
} from "@mui/icons-material";
import axios from "axios";
import TopBar from "../utility/TopBar";
import { useNavigate } from "react-router-dom";

const reportSimplificationPage = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">report simplification Page</Typography>
      </Box>
    </Box>
  );
};

export default reportSimplificationPage;
