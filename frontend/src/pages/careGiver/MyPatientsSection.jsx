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
  Edit as EditIcon,
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
  const [editMode, setEditMode] = useState({
    name: false,
    phone: false,
    notes: false,
  });
  const [patientEdits, setPatientEdits] = useState({
    name: "",
    phone: "",
    notes: "",
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Load patients from localStorage (Update to GET in backend later)
  useEffect(() => {
    const storedPatients = localStorage.getItem("patients");
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    }
  }, []);

  // Set up edit form data when a patient is selected
  useEffect(() => {
    if (selectedPatient) {
      setPatientEdits({
        name: selectedPatient.name || "",
        phone: selectedPatient.phone || "",
        notes: selectedPatient.notes || "",
      });
      setHasChanges(false);
    }
  }, [selectedPatient]);

  const updatePatients = (newPatientsList) => {
    setPatients(newPatientsList);
    localStorage.setItem("patients", JSON.stringify(newPatientsList));
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditChange = (field, value) => {
    setPatientEdits((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const toggleEditMode = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
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

      const result = response.data;

      const newPatient = {
        name: result.patient_name || "",
        email: result.patient_email,
        phone: result.patient_phone || "",
        key: formData.key,
        lastUpdate: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        notes: result.caregiver_note || "",
        medical_reports: result.medical_reports || [],
        medication_notes: result.medication_note || [],
        patient_id: result.patient_id,
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
      if (selectedPatient && selectedPatient.email === patientEmail) {
        setSelectedPatient(null);
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      window.alert("Error deleting patient. Please try again.");
    }
  };

  // Common button styles
  const commonButtonStyles = {
    backgroundColor: "#00897B",
    color: "#fff",
    borderRadius: "25px",
    fontWeight: "bold",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#00695C",
      transform: "translateY(-2px)",
      boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
    },
  };

  // Update patient information
  const handleUpdatePatient = async () => {
    if (!selectedPatient) return;

    try {
      const data = {
        patient_id: selectedPatient.patient_id,
        name: patientEdits.name,
        phone: patientEdits.phone,
        caregiver_note: patientEdits.notes,
      };

      const response = await axios.put(
        `${backendBaseUrl}/caregiver/update-patient-info`,
        data,
        { withCredentials: true }
      );

      const updatedPatients = patients.map((p) => {
        if (p.email === selectedPatient.email) {
          return {
            ...p,
            name: patientEdits.name,
            phone: patientEdits.phone,
            notes: patientEdits.notes,
            lastUpdate: new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
          };
        }
        return p;
      });

      updatePatients(updatedPatients);
      setSelectedPatient({
        ...selectedPatient,
        name: patientEdits.name,
        phone: patientEdits.phone,
        notes: patientEdits.notes,
        lastUpdate: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      });

      setEditMode({ name: false, phone: false, notes: false });
      setHasChanges(false);
    } catch (error) {
      console.error("Error updating patient:", error);
      window.alert(
        error.response?.data?.detail ||
          "Error updating patient. Please try again."
      );
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
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#004D40",
            fontFamily: "ECA, sans-serif",
          }}
        >
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
              primary={patient.name || patient.email}
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
                  fontFamily: "ECA, sans-serif",
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
            sx={commonButtonStyles}
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{selectedPatient?.name || selectedPatient?.email || ""}</span>
          <IconButton
            onClick={() => setSelectedPatient(null)}
            sx={{ color: "#004D40" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* Contact Info */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Contact Info
          </Typography>
          <Box sx={{ mb: 3 }}>
            {/* Name Field - Editable */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
                p: 1,
                borderRadius: 1,
                border: "1px solid #e0e0e0",
                backgroundColor: editMode.name ? "#f5f5f5" : "transparent",
              }}
            >
              {editMode.name ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Name"
                  value={patientEdits.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  size="small"
                  sx={{ mr: 1, fontFamily: "ECA, sans-serif" }}
                />
              ) : (
                <Typography
                  variant="body1"
                  sx={{ fontFamily: "ECA, sans-serif" }}
                >
                  <strong>Name:</strong> {patientEdits.name || "Not provided"}
                </Typography>
              )}
              <IconButton
                onClick={() => toggleEditMode("name")}
                sx={{ color: "#004D40" }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Email Field - Read Only */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
                p: 1,
                borderRadius: 1,
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontFamily: "ECA, sans-serif" }}
              >
                <strong>Email:</strong> {selectedPatient?.email || ""}
              </Typography>
            </Box>

            {/* Phone Field - Editable */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
                p: 1,
                borderRadius: 1,
                border: "1px solid #e0e0e0",
                backgroundColor: editMode.phone ? "#f5f5f5" : "transparent",
              }}
            >
              {editMode.phone ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Phone"
                  value={patientEdits.phone}
                  onChange={(e) => handleEditChange("phone", e.target.value)}
                  size="small"
                  sx={{ mr: 1, fontFamily: "ECA, sans-serif" }}
                />
              ) : (
                <Typography variant="body1">
                  <strong>Phone:</strong> {patientEdits.phone || "Not provided"}
                </Typography>
              )}
              <IconButton
                onClick={() => toggleEditMode("phone")}
                sx={{ color: "#004D40" }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Patient Files */}
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 1, fontFamily: "ECA, sans-serif" }}
          >
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
              <Typography
                fontWeight={600}
                sx={{ mb: 1, fontFamily: "ECA, sans-serif" }}
              >
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
              <Typography
                fontWeight={600}
                sx={{ mb: 1, fontFamily: "ECA, sans-serif" }}
              >
                Medication Help
              </Typography>
              {selectedPatient?.medication_notes?.length ? (
                selectedPatient.medication_notes.map((note, i) => (
                  <Typography key={i} variant="body2" color="text.secondary">
                    <AIResult key={i} note={note} />
                  </Typography>
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontFamily: "ECA, sans-serif" }}
                >
                  No medication notes found.
                </Typography>
              )}
            </Box>
          </Box>

          {/* Caregiver's Notes - Editable */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, fontFamily: "ECA, sans-serif" }}
              >
                Caregiver's Notes
              </Typography>
              <IconButton
                onClick={() => toggleEditMode("notes")}
                sx={{ color: "#004D40" }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box
              sx={{
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 3,
                backgroundColor: editMode.notes ? "#f5f5f5" : "#f0f0f0",
                maxHeight: editMode.notes ? "none" : "150px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              {editMode.notes ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={patientEdits.notes}
                  onChange={(e) => handleEditChange("notes", e.target.value)}
                  sx={{ fontFamily: "ECA, sans-serif" }}
                />
              ) : (
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "ECA, sans-serif" }}
                >
                  {patientEdits.notes || "No notes available."}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ pt: 3 }}>
          {hasChanges ? (
            <Button
              onClick={handleUpdatePatient}
              sx={{
                backgroundColor: "#00684A",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "20px",
                px: 4,
                "&:hover": { backgroundColor: "#004D40" },
                fontFamily: "ECA, sans-serif",
              }}
            >
              Update
            </Button>
          ) : (
            <Button
              onClick={() => setSelectedPatient(null)}
              sx={{
                backgroundColor: "#00684A",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "20px",
                px: 4,
                "&:hover": { backgroundColor: "#004D40" },
                fontFamily: "ECA, sans-serif",
              }}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyPatientsSection;
