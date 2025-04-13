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
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      key: "KEY-JANE",
      lastUpdate: "April 10, 2025",
      notes: "Has chronic migraines, logs symptoms weekly.",
    },
    {
      name: "David Johnson",
      email: "david.johnson@example.com",
      key: "KEY-DAVID",
      lastUpdate: "April 9, 2025",
      notes: "Recently diagnosed with diabetes, on insulin.",
    },
  ]);
    const [formData, setFormData] = useState({
    email: "",
    key: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedPatient, setSelectedPatient] = useState(null);

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

    if (!formData.key.trim()) newErrors.key = "Key is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPatient = () => {
    if (!validateForm()) return;

    const newPatient = {
      name: "Unknown Patient",
      email: formData.email,
      key: formData.key,
      lastUpdate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      notes: formData.notes,
    };

    setPatients((prev) => [...prev, newPatient]);
    setFormData({ email: "", key: "", notes: "" });
    setErrors({});
    setOpen(false);
  };

  return (
    <>
      {/* Header */}
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
            onClick={() => setSelectedPatient(patient)}
            sx={{ backgroundColor: "#fff", mb: 1, borderRadius: 2, "&:hover": { backgroundColor: "#e0f2f1" } }}
          >
            <ListItemIcon>
              <MedicationIcon sx={{ color: "#004D40" }} />
            </ListItemIcon>
            <ListItemText primary={patient.name} secondary={`Last update: ${patient.lastUpdate}`} />
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
            minHeight: "400px",
            backgroundColor: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
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
            pb: 1,
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
            mt: 1,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
            <TextField
              fullWidth
              label={<span>Patient's Email<span style={{ color: "red" }}>*</span></span>}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label={<span>Generated Key<span style={{ color: "red" }}>*</span></span>}
              name="key"
              value={formData.key}
              onChange={handleInputChange}
              error={!!errors.key}
              helperText={errors.key}
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Caregiver Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
          />
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
          {selectedPatient?.name || "Patient Info"}
        </DialogTitle>

        <DialogContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Contact Info</Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1"><strong>Email:</strong> {selectedPatient?.email}</Typography>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Patient Files</Typography>
          <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
            <Box sx={{ flex: 1, minWidth: "300px", p: 2, border: "1px solid #ccc", borderRadius: 3, backgroundColor: "#f0f0f0" }}>
              <Typography fontWeight={600}>Report Simplifier</Typography>
              <Typography variant="body2" color="text.secondary">[Placeholder for report simplifier data]</Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: "300px", p: 2, border: "1px solid #ccc", borderRadius: 3, backgroundColor: "#f0f0f0" }}>
              <Typography fontWeight={600}>Medication Help</Typography>
              <Typography variant="body2" color="text.secondary">[Placeholder for medication data]</Typography>
            </Box>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Caregiver's Notes</Typography>
          <Box sx={{
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 3,
            backgroundColor: "#f0f0f0",
            maxHeight: "150px",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
          }}>
            <Typography variant="body2">{selectedPatient?.notes || "No notes provided."}</Typography>
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
