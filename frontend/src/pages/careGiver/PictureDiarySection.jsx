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
  ImageList,
  ImageListItem,
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";

const backendBaseUrl = import.meta.env.VITE_API_URL;

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
    patientName: `${rawEntry.patient_first_name} ${rawEntry.patient_last_name}`,
    recordedTime: formatTime(rawEntry.date_uploaded),
    dateDetail: formatDate(rawEntry.date_uploaded),
    photoCount: rawEntry.images ? rawEntry.images.length : 0,
    note: rawEntry.caregiver_notes,
    images: rawEntry.images || [],
    id: rawEntry._id || rawEntry.id,
  };
};

const PictureDiarySection = () => {
  const currentUserID = "user_123"; // TODO: adjust this as needed

  const [diaryEntries, setDiaryEntries] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [presignedImageUrls, setPresignedImageUrls] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newDiaryEntry, setNewDiaryEntry] = useState({
    patientFirstName: "",
    patientLastName: "",
    patientEmail: "",
    pictures: null,
    note: "",
  });
  const [picturePreviews, setPicturePreviews] = useState([]);

  useEffect(() => {
    const cacheKey = `diaryEntries_${currentUserID}`;
    const cachedEntries = localStorage.getItem(cacheKey);
    if (cachedEntries) {
      setDiaryEntries(JSON.parse(cachedEntries));
    }
  }, [currentUserID]);

  // Save diaryEntries to localStorage whenever they change. (Will Update to GET endpoint later)
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
                const response = await fetch(
                  `${backendBaseUrl}/caregiver/generate-view-url?object_key=${objectKey}`
                );
                if (!response.ok) {
                  console.error(`Failed to fetch view URL for ${objectKey}`);
                  return objectKey;
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

  const handleItemClick = (diary) => {
    setSelectedDiary(diary);
  };

  const handleClose = () => {
    setSelectedDiary(null);
    setPresignedImageUrls([]);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDiaryEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setNewDiaryEntry((prev) => ({
      ...prev,
      pictures: files,
    }));

    const previews = [];
    for (let i = 0; i < files.length; i++) {
      previews.push(URL.createObjectURL(files[i]));
    }
    setPicturePreviews(previews);
  };

  // Upload pictures to S3 via backend's presigned URL endpoint.
  const uploadPictures = async () => {
    if (!newDiaryEntry.pictures || newDiaryEntry.pictures.length === 0) {
      return [];
    }
    const uploadedUrls = [];
    for (let i = 0; i < newDiaryEntry.pictures.length; i++) {
      const file = newDiaryEntry.pictures[i];
      try {
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
      const uploadedPictureKeys = await uploadPictures();
      console.log("Uploaded Picture Keys:", uploadedPictureKeys);

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
      const rawEntry = responseData.entry;
      if (!rawEntry._id && responseData.id) {
        rawEntry._id = responseData.id;
      }
      const newEntryConverted = convertDiaryEntry(rawEntry);
      setDiaryEntries((prev) => [newEntryConverted, ...prev]);
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error saving new diary entry:", error);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      // // Call the backend DELETE endpoint. (TODO: adjustment in backned needed)
      // const response = await fetch(
      //   `${backendBaseUrl}/caregiver/diary-entry-delete/${entryId}`,
      //   {
      //     method: "DELETE",
      //     credentials: "include",
      //   }
      // );
      // if (!response.ok) {
      //   throw new Error("Failed to delete diary entry");
      // }
      setDiaryEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== entryId)
      );
      console.log("Diary entry deleted successfully");
    } catch (error) {
      console.error("Error deleting diary entry:", error);
    }
  };

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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {entry.patientName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {entry.dateDetail}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {entry.photoCount} photos
                </Typography>

                {/* Delete Button */}
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
        maxWidth="lg"
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
                {selectedDiary.patientName}'s Picture Diary
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                Date: {selectedDiary.dateDetail}{" "}
                <Box component="span" sx={{ ml: 1, color: "text.secondary" }}>
                  ({selectedDiary.recordedTime})
                </Box>
              </Typography>

              {/* 1. Gallery view */}
              <ImageList cols={4} gap={8} sx={{ mb: 2 }}>
                {presignedImageUrls.map((url, idx) => (
                  <ImageListItem key={idx}>
                    <img
                      src={url}
                      alt={`Diary pic ${idx + 1}`}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: 4,
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>

              {/* 2. Diary Notes subtitle */}
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Diary Notes From Caregiver
              </Typography>
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-line", color: "text.primary" }}
              >
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
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#004D40", fontSize: "1.3rem" }}
          >
            Add New Diary Entry
          </Typography>
          <TextField
            label="Patient First Name"
            name="patientFirstName"
            value={newDiaryEntry.patientFirstName}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{
              sx: {
                color: "#757575",
                "&.Mui-focused": {
                  color: "#004D40",
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#004D40",
                },
              },
              mb: 2,
            }}
          />
          <TextField
            label="Patient Last Name"
            name="patientLastName"
            value={newDiaryEntry.patientLastName}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{
              sx: {
                color: "#757575",
                "&.Mui-focused": {
                  color: "#004D40",
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#004D40",
                },
              },
              mb: 2,
            }}
          />
          <TextField
            label="Patient Email"
            name="patientEmail"
            value={newDiaryEntry.patientEmail}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{
              sx: {
                color: "#757575",
                "&.Mui-focused": {
                  color: "#004D40",
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#004D40",
                },
              },
              mb: 2,
            }}
          />
          {/* Upload Pictures Button */}
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
              mb: 2,
              color: "#004D40",
              borderColor: "#004D40",
              fontWeight: "bold",
            }}
          >
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
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#004D40",
                  },
                },
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
            InputLabelProps={{
              sx: {
                color: "#757575",
                "&.Mui-focused": {
                  color: "#004D40",
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#004D40",
                },
              },
              mb: 2,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseAddDialog}
            color="secondary"
            sx={{
              textTransform: "none",
              color: "#004D40",
              fontWeight: "bold",
              borderRadius: 20,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveNewEntry}
            variant="contained"
            color="primary"
            sx={commonButtonStyles}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PictureDiarySection;
