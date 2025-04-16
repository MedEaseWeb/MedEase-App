import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Medication as MedicationIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import AIResult from "../medication/AIResult";
import MedicalReports from "./MedicalReports";

const backendBaseUrl = import.meta.env.VITE_API_URL;

const MyPatientsSection = () => {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ email: "", key: "" });
  const [errors, setErrors] = useState({});
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Load patients from localStorage (Update to GET in backend later)
  useEffect(() => {
    const storedPatients = localStorage.getItem("patients");
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    }
  }, []);

  const updatePatients = (newPatientsList) => {
    setPatients(newPatientsList);
    localStorage.setItem("patients", JSON.stringify(newPatientsList));
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.key.trim()) {
      newErrors.key = "Key is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPatient = async () => {
    if (!validateForm()) return;

    // Prepare payload that matches your PatientDataRequest model.
    const data = {
      patient_email: formData.email,
      generated_key: formData.key,
    };

    try {
      const response = await axios.post(
        `${backendBaseUrl}/caregiver/patient-data`,
        data,
        { withCredentials: true }
      );

      // The API returns a PatientData object with additional fields.
      const result = response.data;

      // Build a new patient object for the UI and localStorage.
      // Convert null arrays to empty arrays so you can map them later.
      const newPatient = {
        name: result.patient_name || "",
        email: result.patient_email,
        key: formData.key,
        lastUpdate: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        notes: result.caregiver_note || "",
        medical_reports: result.medical_reports || [],
        medication_notes: result.medication_note || [],
      };

      updatePatients([...patients, newPatient]);
      setFormData({ email: "", key: "" });
      setErrors({});
      setOpen(false);
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail || "Please reenter correct email or key.";
      window.alert(errorMsg);
      console.error("Error adding patient:", errorMsg);
    }
  };

  // Delete patient by email from backend and update state/localStorage.
  const handleDeletePatient = async (patientEmail) => {
    try {
      const updatedPatients = patients.filter((p) => p.email !== patientEmail);
      updatePatients(updatedPatients);
      // If the selected patient is the one deleted, remove it from state.
      if (selectedPatient && selectedPatient.email === patientEmail) {
        setSelectedPatient(null);
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      window.alert("Error deleting patient. Please try again.");
    }
  };

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004D40" }}>
          My Patients
        </Typography>
        <Tooltip title="Add Patient">
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: "#00897B",
              color: "#fff",
              borderRadius: "50%",
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
              "&:hover": { backgroundColor: "#00695C" },
            }}
          >
            <PersonAddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Patient List */}
      <List sx={{ flexGrow: 1, overflowY: "auto" }}>
        {patients.map((patient, idx) => (
          <ListItem
            key={idx}
            button
            onClick={() => setSelectedPatient(patient)}
            sx={{
              position: "relative",
              backgroundColor: "#fff",
              mb: 1,
              borderRadius: 2,
              p: 2,
              minHeight: 72,
              "&:hover": { backgroundColor: "#e0f2f1" },
            }}
          >
            <ListItemIcon>
              <MedicationIcon sx={{ color: "#004D40" }} />
            </ListItemIcon>
            <ListItemText
              primary={patient.email}
              secondary={`Last update: ${patient.lastUpdate}`}
            />
            <IconButton
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 20,
                height: 20,
                backgroundColor: "#004D40",
                color: "#fff",
                "&:hover": { backgroundColor: "#d32f2f" },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePatient(patient.email);
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Add Patient Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundColor: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
            p: 1,
            width: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#004D40",
            fontSize: "1.6rem",
            px: 4,
            pt: 2,
            pb: 2,
            borderBottom: "1px solid #ddd",
            backgroundColor: "#f0f0f0",
          }}
        >
          Add Patient
        </DialogTitle>

        <DialogContent
          sx={{
            px: 4,
            py: 3,
            mt: 3,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Patient's Email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#004D40",
                  },
                },
                "& .MuiInputLabel-asterisk": {
                  color: "red",
                },
                "& .MuiFormLabel-root": {
                  color: "#004D40",
                },
                "& .MuiFormLabel-root.Mui-focused": {
                  color: "#004D40",
                },
              }}
            />

            <TextField
              fullWidth
              label="Generated Key"
              name="key"
              required
              value={formData.key}
              onChange={handleInputChange}
              error={!!errors.key}
              helperText={errors.key}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#004D40",
                  },
                },
                "& .MuiInputLabel-asterisk": {
                  color: "red",
                },
                "& .MuiFormLabel-root": {
                  color: "#004D40",
                },
                "& .MuiFormLabel-root.Mui-focused": {
                  color: "#004D40",
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            backgroundColor: "#f0f0f0",
            px: 4,
            py: 2,
            borderTop: "1px solid #ddd",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            onClick={handleAddPatient}
            sx={{
              backgroundColor: "#00684A",
              color: "#fff",
              borderRadius: "25px",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1rem",
              px: 4,
              py: 1,
              "&:hover": { backgroundColor: "#004D40" },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Patient Detail Modal */}
      <Dialog
        open={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: 5,
            minHeight: "600px",
            backgroundColor: "#f9f9f9",
            px: 4,
            py: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.7rem",
            color: "#004D40",
            borderBottom: "1px solid #ddd",
            mb: 2,
          }}
        >
          {selectedPatient?.name || ""}
        </DialogTitle>

        <DialogContent>
          {/* Contact Info */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Contact Info
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1">
              <strong>Email:</strong> {selectedPatient?.email || ""}
            </Typography>
          </Box>

          {/* Patient Files */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Patient Files
          </Typography>

          <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
            {/* Medical Reports */}
            <Box
              sx={{
                flex: 1,
                minWidth: "300px",
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 3,
                backgroundColor: "#f0f0f0",
              }}
            >
              <Typography fontWeight={600} sx={{ mb: 1 }}>
                Report Simplifier
              </Typography>

              {selectedPatient?.medical_reports?.length ? (
                <MedicalReports reports={selectedPatient.medical_reports} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No medical reports found.
                </Typography>
              )}
            </Box>

            {/* Medication Notes */}
            <Box
              sx={{
                flex: 1,
                minWidth: "300px",
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 3,
                backgroundColor: "#f0f0f0",
              }}
            >
              <Typography fontWeight={600} sx={{ mb: 1 }}>
                Medication Help
              </Typography>
              {selectedPatient?.medication_notes?.length ? (
                selectedPatient.medication_notes.map((note, i) => (
                  <Typography key={i} variant="body2" color="text.secondary">
                    <AIResult key={i} note={note} />
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No medication notes found.
                </Typography>
              )}
            </Box>
          </Box>

          {/* Caregiver's Notes */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Caregiver's Notes
          </Typography>
          <Box
            sx={{
              p: 2,
              border: "1px solid #ccc",
              borderRadius: 3,
              backgroundColor: "#f0f0f0",
              maxHeight: "150px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            <Typography variant="body2">
              {selectedPatient?.notes || ""}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ pt: 3 }}>
          <Button
            onClick={() => setSelectedPatient(null)}
            sx={{
              backgroundColor: "#00684A",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "20px",
              px: 4,
              "&:hover": { backgroundColor: "#004D40" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyPatientsSection;
