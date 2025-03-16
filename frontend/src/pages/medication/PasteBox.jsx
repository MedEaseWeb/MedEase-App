import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";
import AIResult from "./AIResult";

// Note we have both Paste box and AIResult in this component
const PasteBox = ({ onNewSubmission = () => {} }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    console.log("Submitted Text:", text);
    setLoading(true);
    setResult(null); // Clear previous results
    try {
      const response = await fetch(
        "http://localhost:8081/medication/extract-medication",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }), // Send the input text from the form
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert("Text submitted successfully!");
        console.log("ai generated data", data);
        setResult(data);
        onNewSubmission(data);
      } else {
        alert("Error submitting text");
        console.log(response);
      }
    } catch (error) {
      console.error("Error submitting text:", error);
      alert("Error submitting text");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Paper
      elevation={6}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 5,
        borderRadius: 3,
        background: "linear-gradient(to right, #f9f9f9, #eef2f3)",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
        border: "1px solid #ccc",
        width: "100%",
        maxWidth: 800, // Adjusted width for better readability
      }}
    >
      {/* Title */}
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#004D40" }}>
        Paste Your Medication Note or Prescription
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Safely and securely receive tailored advice
      </Typography>

      {/* Text Field */}
      <TextField
        multiline
        rows={12}
        variant="outlined"
        placeholder="Paste your text here..."
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 2,
          backgroundColor: "#fff",
          transition: "0.3s",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#ccc",
              transition: "border-color 0.3s ease",
            },
            "&:hover fieldset": {
              borderColor: "#00897B",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#004D40", // Darker green on focus
            },
          },
        }}
      />

      {/* Submit Button */}
      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          mt: 3,
          px: 4,
          py: 1.5,
          fontSize: "1rem",
          fontWeight: "bold",
          textTransform: "none",
          backgroundColor: "#00897B",
          color: "#fff",
          borderRadius: "25px",
          transition: "0.3s",
          "&:hover": {
            backgroundColor: "#00695C",
            transform: "translateY(-2px)", // Slight elevation on hover
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        Submit
      </Button>
      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="textSecondary">
            AI is generating help for you...
          </Typography>
        </Box>
      )}

      {/* Transformed Result Display */}
      {result && <AIResult note={result} />}
    </Paper>
  );
};

export default PasteBox;
