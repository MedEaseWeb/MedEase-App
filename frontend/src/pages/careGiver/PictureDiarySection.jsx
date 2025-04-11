import React, { useState, useEffect } from "react";
import {
  Typography,
  IconButton,
  Divider,
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";

const backendBaseUrl = import.meta.env.VITE_API_URL;

// Helper to format dates (you can adjust formatting as desired)
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString();
};

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Conversion function: Convert raw diary entry data from backend
// into the diary card format.
const convertDiaryEntry = (rawEntry) => {
  return {
    // Combine first and last names
    patientName: `${rawEntry.patient_first_name} ${rawEntry.patient_last_name}`,
    // Format date and time – adjust according to your needs
    recordedTime: formatTime(rawEntry.date_uploaded),
    dateDetail: formatDate(rawEntry.date_uploaded),
    // Count photos from the images array
    photoCount: rawEntry.images ? rawEntry.images.length : 0,
    note: rawEntry.caregiver_notes,
    // Here we assume rawEntry.images contains the S3 object keys, not the full URL.
    images: rawEntry.images || [],
    // Optionally include the _id for keys etc.
    id: rawEntry._id || rawEntry.id,
  };
};


const PictureDiarySection = () => {
  // You might get the currentUserID from your auth context or similar.
  // For this example, we hardcode it.
  const currentUserID = "user_123"; // adjust this as needed

  // Manage diary list state.
  const [diaryEntries, setDiaryEntries] = useState([]);
  // For viewing an existing diary entry.
  const [selectedDiary, setSelectedDiary] = useState(null);
  // New state for storing the presigned view URLs for images.
  const [presignedImageUrls, setPresignedImageUrls] = useState([]);
  // For opening the add new diary entry dialog.
  const [openAddDialog, setOpenAddDialog] = useState(false);
  // For holding new diary entry form data.
  const [newDiaryEntry, setNewDiaryEntry] = useState({
    patientFirstName: "",
    patientLastName: "",
    patientEmail: "",
    pictures: null,
    note: "",
  });
  // For previewing uploaded pictures in the Add Dialog.
  const [picturePreviews, setPicturePreviews] = useState([]);

  // On mount, load any cached diary entries for the current user.
  useEffect(() => {
    const cacheKey = `diaryEntries_${currentUserID}`;
    const cachedEntries = localStorage.getItem(cacheKey);
    if (cachedEntries) {
      setDiaryEntries(JSON.parse(cachedEntries));
    }
  }, [currentUserID]);

  // Save diaryEntries to localStorage whenever they change.
  useEffect(() => {
    const cacheKey = `diaryEntries_${currentUserID}`;
    localStorage.setItem(cacheKey, JSON.stringify(diaryEntries));
  }, [diaryEntries, currentUserID]);

  // When a diary entry is selected, fetch presigned GET URLs for each image.
  useEffect(() => {
    const fetchPresignedUrls = async () => {
      if (selectedDiary && selectedDiary.images.length > 0) {
        try {
          const urls = await Promise.all(
            selectedDiary.images.map(async (objectKey) => {
              try {
                // Call your backend endpoint that generates a presigned GET URL.
                const response = await fetch(
                  `${backendBaseUrl}/caregiver/generate-view-url?object_key=${objectKey}`
                );
                if (!response.ok) {
                  console.error(`Failed to fetch view URL for ${objectKey}`);
                  return objectKey; // Fallback if desired.
                }
                const data = await response.json();
                return data.view_url;
              } catch (err) {
                console.error("Error fetching view URL for", objectKey, err);
                return objectKey;
              }
            })
          );
          setPresignedImageUrls(urls);
        } catch (err) {
          console.error("Error fetching presigned URLs:", err);
        }
      } else {
        setPresignedImageUrls([]);
      }
    };
    fetchPresignedUrls();
  }, [selectedDiary]);

  // Handle click for each diary entry card.
  const handleItemClick = (diary) => {
    setSelectedDiary(diary);
  };

  // Handle closing the detailed diary view.
  const handleClose = () => {
    setSelectedDiary(null);
    setPresignedImageUrls([]);
  };

  // Open Add Dialog.
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  // Close Add Dialog and clear form data.
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewDiaryEntry({
      patientFirstName: "",
      patientLastName: "",
      patientEmail: "",
      pictures: null,
      note: "",
    });
    setPicturePreviews([]);
  };

  // Handle text input changes.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDiaryEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input changes.
  const handleFileChange = (e) => {
    const files = e.target.files;
    setNewDiaryEntry((prev) => ({
      ...prev,
      pictures: files,
    }));

    // Generate previews for the selected files.
    const previews = [];
    for (let i = 0; i < files.length; i++) {
      previews.push(URL.createObjectURL(files[i]));
    }
    setPicturePreviews(previews);
  };

  // Function to upload pictures to S3 via backend's presigned URL endpoint.
  const uploadPictures = async () => {
    if (!newDiaryEntry.pictures || newDiaryEntry.pictures.length === 0) {
      return [];
    }
    const uploadedUrls = [];
    for (let i = 0; i < newDiaryEntry.pictures.length; i++) {
      const file = newDiaryEntry.pictures[i];
      try {
        // Construct query parameters to call the backend endpoint.
        const queryParams = new URLSearchParams({
          filename: file.name,
          content_type: file.type,
        });
        const presignedResponse = await fetch(
          `${backendBaseUrl}/caregiver/generate-upload-url?${queryParams}`
        );
        if (!presignedResponse.ok) {
          throw new Error(`Failed to get presigned URL for ${file.name}`);
        }
        const presignedData = await presignedResponse.json();
        // Upload the file using the presigned URL.
        const uploadResponse = await fetch(presignedData.upload_url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });
        if (!uploadResponse.ok) {
          throw new Error(`Upload failed for file ${file.name}`);
        }
        // Instead of constructing a public URL, store the object key for later use.
        uploadedUrls.push(presignedData.object_key);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    return uploadedUrls;
  };

  // Handle saving the new diary entry (POST to backend).
  const handleSaveNewEntry = async () => {
    try {
      // Upload pictures and get their object keys.
      const uploadedPictureKeys = await uploadPictures();
      console.log("Uploaded Picture Keys:", uploadedPictureKeys);

      // Build the payload.
      const diaryEntryPayload = {
        patient_first_name: newDiaryEntry.patientFirstName,
        patient_last_name: newDiaryEntry.patientLastName,
        patient_email: newDiaryEntry.patientEmail,
        caregiver_notes: newDiaryEntry.note,
        images: uploadedPictureKeys,
      };

      console.log("Diary Entry Payload:", diaryEntryPayload);

      // POST the diary entry payload.
      const response = await fetch(
        `${backendBaseUrl}/caregiver/diary-entry-upload`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(diaryEntryPayload),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save diary entry");
      }

      const responseData = await response.json();
      console.log("Diary Entry Saved:", responseData);
      // Assume your backend returns the raw diary entry data.
      const rawEntry = responseData.entry;
      // For example, add _id to the raw data if needed.
      if (!rawEntry._id && responseData.id) {
        rawEntry._id = responseData.id;
      }
      // Convert raw data into the displayed format.
      const newEntryConverted = convertDiaryEntry(rawEntry);
      // Update the diary list (prepend new entry).
      setDiaryEntries((prev) => [newEntryConverted, ...prev]);
      // Close the Add Dialog.
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error saving new diary entry:", error);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      // Call the backend DELETE endpoint.
      const response = await fetch(
        `${backendBaseUrl}/caregiver/diary-entry-delete/${entryId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete diary entry");
      }
      // If deletion is successful, filter out the entry from state.
      setDiaryEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== entryId)
      );
      console.log("Diary entry deleted successfully");
    } catch (error) {
      console.error("Error deleting diary entry:", error);
    }
  };
  

  return (
    <>
      {/* Header and Add Icon */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004D40" }}>
          Picture Diary
        </Typography>
        <Tooltip title="Add New Diary Entry">
          <IconButton
            sx={{
              width: 48,
              height: 48,
              backgroundColor: "#00897B",
              color: "#fff",
              borderRadius: "50%",
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
              "&:hover": { backgroundColor: "#00695C" },
            }}
            onClick={handleOpenAddDialog}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        - Able to upload pictures recording patients' health condition <br />
        - Shareable <br />- Caregiver can upload pictures and add text in a
        formatted way
      </Typography>

      {/* Diary Entries List */}
      <Box sx={{ maxHeight: 210, overflowY: "auto", pr: 1 }}>
        {diaryEntries.map((entry, index) => (
          <Card
            key={entry.id || index}
            sx={{
              cursor: "pointer",
              mb: 1,
              p: 1,
              borderRadius: 2,
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
              },
              position: "relative", // To position the delete button absolutely
            }}
            onClick={() => handleItemClick(entry)}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {entry.patientName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ textAlign: "center" }}
                  >
                    {entry.dateDetail}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ textAlign: "right" }}
                  >
                    {entry.photoCount} photos
                  </Typography>
                </Box>
                {/* Delete Button */}
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 20,
                    height: 20,
                    backgroundColor: "#004D40", // red background for delete
                    color: "#fff",
                    "&:hover": { backgroundColor: "#d32f2f" },
                  }}
                  onClick={(e) => {
                    // Stop propagation so that clicking the delete button
                    // doesn't trigger the card's onClick for viewing details.
                    e.stopPropagation();
                    handleDeleteEntry(entry.id);
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Detailed Diary View Modal */}
      <Dialog
        open={Boolean(selectedDiary)}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        {/* Close Button */}
        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          {selectedDiary && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                {selectedDiary.patientName}'s Diary Entry
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Date: {selectedDiary.dateDetail}{" "}
                <span style={{ marginLeft: 8 }}>
                  ({selectedDiary.recordedTime})
                </span>
              </Typography>
              {/* Display pictures using the presigned GET URLs */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 2,
                }}
              >
                {presignedImageUrls.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Diary pic ${idx}`}
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                ))}
              </Box>
              {/* Note Text */}
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {selectedDiary.note}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for Adding a New Diary Entry */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <IconButton onClick={handleCloseAddDialog}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Add New Diary Entry
          </Typography>
          <TextField
            label="Patient First Name"
            name="patientFirstName"
            value={newDiaryEntry.patientFirstName}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Patient Last Name"
            name="patientLastName"
            value={newDiaryEntry.patientLastName}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Patient Email"
            name="patientEmail"
            value={newDiaryEntry.patientEmail}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          {/* Upload Pictures Button */}
          <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
            Upload Pictures
            <input type="file" hidden multiple onChange={handleFileChange} />
          </Button>
          {/* Show picture previews if available */}
          {picturePreviews.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mb: 2,
              }}
            >
              {picturePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Preview ${idx}`}
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                />
              ))}
            </Box>
          )}
          <TextField
            label="Notes"
            name="note"
            value={newDiaryEntry.note}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAddDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveNewEntry}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PictureDiarySection;
