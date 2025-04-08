import { useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { TextField, Typography, Box, Link } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

export default function DragDropTextField({
  originalReport,
  setOriginalReport,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = async function () {
      try {
        const typedArray = new Uint8Array(this.result);
        const pdf = await getDocument(typedArray).promise;

        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str);
          text += strings.join(" ") + "\n\n";
        }

        setOriginalReport(text);
      } catch (err) {
        console.error("Failed to parse PDF:", err);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    await handleFile(file);
  };

  const handleFilePicker = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      sx={{
        position: "relative",
        border: isDragging ? "2px dashed #00897B" : "none",
        borderRadius: 2,
        p: isDragging ? 1 : 0,
        boxShadow: isDragging ? "0 0 0 4px rgba(0, 137, 123, 0.1)" : "none",
        transition: "all 0.3s ease-in-out",
        backgroundColor: isDragging ? "#F1FDFB" : "transparent",
      }}
    >
      {/* Hint overlay when field is empty */}
      {!originalReport && !isDragging && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            textAlign: "center",
            pointerEvents: "none",
            opacity: 1,
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontFamily: "ECA, sans-serif",
              fontSize: 16,
              color: "#adb5bd",
            }}
          >
            📄 Drag and drop a PDF here, or{" "}
            <Box
              component="span"
              onClick={triggerFileSelect}
              sx={{
                textDecoration: "underline",
                color: "#6c757d",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            >
              click here
            </Box>{" "}
            to upload from your computer.
          </Typography>
        </Box>
      )}

      {/* Hidden file input for "click here" */}
      <input
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFilePicker}
      />

      {/* Textfield */}
      <TextField
        multiline
        rows={11}
        variant="outlined"
        placeholder="Paste your report text here..."
        fullWidth
        value={originalReport}
        onChange={(e) => setOriginalReport(e.target.value)}
        sx={{
          backgroundColor: "#fff",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#ccc",
            },
            "&:hover fieldset": {
              borderColor: "#00897B",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#004D40",
            },
          },
        }}
        inputProps={{
          style: {
            fontFamily: "ECA, sans-serif",
          },
        }}
      />

      {/* Filename preview */}
      {fileName && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1,
            fontFamily: "ECA, sans-serif",
            color: "#757575",
          }}
        >
          📎 Uploaded: {fileName}
        </Typography>
      )}
    </Box>
  );
}
