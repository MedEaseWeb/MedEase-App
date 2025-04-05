import React, { useState } from "react";
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
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

const MyPatientsSection = () => {
  const [open, setOpen] = useState(false);
  const [patients, setPatients] = useState([
    { name: "John Doe", lastUpdate: "March 28, 2025" },
    { name: "Jane Smith", lastUpdate: "March 25, 2025" },
  ]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^\d{10,15}$/;

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number (10–15 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPatient = () => {
    if (!validateForm()) return;

    const { firstName, lastName } = formData;
    const fullName = `${firstName} ${lastName}`;
    const newPatient = {
      name: fullName,
      lastUpdate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };

    setPatients((prev) => [...prev, newPatient]);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
    });
    setErrors({});
    setOpen(false);
  };

  return (
    <>
      {/* Header with Add Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
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
            sx={{
              backgroundColor: "#fff",
              mb: 1,
              borderRadius: 2,
              "&:hover": { backgroundColor: "#e0f2f1" },
            }}
          >
            <ListItemIcon>
              <MedicationIcon sx={{ color: "#004D40" }} />
            </ListItemIcon>
            <ListItemText
              primary={patient.name}
              secondary={`Last update: ${patient.lastUpdate}`}
            />
            <IconButton edge="end" sx={{ color: "#004D40" }}>
              <ArrowForwardIcon />
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
            borderRadius: 5,
            minHeight: "600px",
            backgroundColor: "#f9f9f9",
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#004D40",
            fontSize: "1.6rem",
            px: 4,
            pt: 3,
            pb: 2,
            borderBottom: "1px solid #ddd",
            backgroundColor: "#f0f0f0",
          }}
        >
          Add Patient
        </DialogTitle>

        {/* Main content */}
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            px: 4,
            py: 5,
          }}
        >
          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
            <TextField
              fullWidth
              label={
                <span>
                  First Name<span style={{ color: "red" }}>*</span>
                </span>
              }
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
            <TextField
              fullWidth
              label={
                <span>
                  Last Name<span style={{ color: "red" }}>*</span>
                </span>
              }
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Contact Information
          </Typography>

          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
            <TextField
              fullWidth
              label={
                <span>
                  Patient's Email<span style={{ color: "red" }}>*</span>
                </span>
              }
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="Patient's Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Summary or Notes About the Patient"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
          />
        </DialogContent>

        {/* Footer */}
        <DialogActions
          sx={{
            backgroundColor: "#f0f0f0",
            px: 4,
            py: 3,
            borderTop: "1px solid #ddd",
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
              "&:hover": {
                backgroundColor: "#004D40",
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyPatientsSection;
