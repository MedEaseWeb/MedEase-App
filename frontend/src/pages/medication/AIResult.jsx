import React from "react";
import { Paper, Typography, Box } from "@mui/material";

const AIResult = ({ note }) => {
  // If there's no note, don't render anything
  if (!note) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        mt: 3,
        p: 2,
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
        maxHeight: 510,
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", mb: 2, fontFamily: "ECA, sans-serif" }}
      >
        AI-Generated Medication Note
      </Typography>

      {/* Medication Information */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", fontFamily: "ECA, sans-serif" }}
        >
          Medication Information
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Medication Name: </strong>
          {note.medication_name || "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Common Name: </strong>
          {note.common_name || "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Purpose: </strong>
          {note.purpose || "N/A"}
        </Typography>
      </Box>

      {/* Schedule */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", fontFamily: "ECA, sans-serif" }}
        >
          Schedule
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Dosage: </strong>
          {note.schedule?.dosage || "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Instructions: </strong>
          {Array.isArray(note.schedule?.instructions)
            ? note.schedule.instructions.join(", ")
            : "N/A"}
        </Typography>
      </Box>

      {/* Prescription Details */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", fontFamily: "ECA, sans-serif" }}
        >
          Prescription Details
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Start Date: </strong>
          {note.prescription_details?.start_date
            ? new Date(
                note.prescription_details.start_date
              ).toLocaleDateString()
            : "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>End Date: </strong>
          {note.prescription_details?.end_date
            ? new Date(note.prescription_details.end_date).toLocaleDateString()
            : "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Prescribed By: </strong>
          {note.prescription_details?.prescribed_by || "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Quantity: </strong>
          {note.prescription_details?.quantity || "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Duration: </strong>
          {note.prescription_details?.duration || "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Action If Run Out: </strong>
          {Array.isArray(note.prescription_details?.action_if_run_out)
            ? note.prescription_details.action_if_run_out.join(", ")
            : "N/A"}
        </Typography>
      </Box>

      {/* Pharmacy */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", fontFamily: "ECA, sans-serif" }}
        >
          Pharmacy
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Name: </strong>
          {note.pharmacy?.name || "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Location: </strong>
          {note.pharmacy?.location || "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Number: </strong>
          {note.pharmacy?.number || "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Pharmacy Tip: </strong>
          {Array.isArray(note.pharmacy?.pharmacy_tip)
            ? note.pharmacy.pharmacy_tip.join(", ")
            : "N/A"}
        </Typography>
      </Box>

      {/* Safety Info */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", fontFamily: "ECA, sans-serif" }}
        >
          Safety Information
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Addiction Risk: </strong>
          {Array.isArray(note.safety_info?.addiction_risk)
            ? note.safety_info.addiction_risk.join(", ")
            : "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Side Effects: </strong>
          {Array.isArray(note.safety_info?.side_effects)
            ? note.safety_info.side_effects.join(", ")
            : "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Overdose Symptoms: </strong>
          {Array.isArray(note.safety_info?.overdose_symptoms)
            ? note.safety_info.overdose_symptoms.join(", ")
            : "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Disposal Instructions: </strong>
          {Array.isArray(note.safety_info?.disposal_instructions)
            ? note.safety_info.disposal_instructions.join(", ")
            : "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "ECA, sans-serif" }}>
          <strong>Storage Instructions: </strong>
          {Array.isArray(note.safety_info?.storage_instructions)
            ? note.safety_info.storage_instructions.join(", ")
            : "N/A"}
        </Typography>
      </Box>
    </Paper>
  );
};

export default AIResult;
