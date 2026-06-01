"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
  Divider,
} from "@mui/material";

const SERIAL_API = "https://airtek-warranty.onrender.com/soreno-serial";

/**
 * Force uppercase and allow only A-Z, digits 0-9, dash `-`, slash `/`,
 * parentheses `(`, `)`. Disallowed chars are removed.
 */
function sanitizeSerialInput(input: string) {
  let upper = input.toUpperCase();
  upper = upper.replace(/[^A-Z0-9\-\/()]/g, "");
  return upper;
}

export default function AddSorenoSerialNumber() {
  const [serial, setSerial] = useState("");
  const [batchSerials, setBatchSerials] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [batchError, setBatchError] = useState("");
  const [batchMessage, setBatchMessage] = useState("");
  const [batchResult, setBatchResult] = useState<{
    inserted: string[];
    duplicates: string[];
    invalid: string[];
  } | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage("");
    const cleaned = sanitizeSerialInput(e.target.value);

    if (cleaned !== e.target.value.toUpperCase()) {
      setError("Only A-Z, 0-9, - / ( ) allowed. Invalid characters removed.");
    } else {
      setError("");
    }
    setSerial(cleaned);
  };

  const handleAddClick = () => {
    if (!serial.trim()) {
      setError("Serial number is required");
      return;
    }
    if (error) return;
    setConfirmOpen(true);
  };

  const handleConfirmYes = async () => {
    setConfirmOpen(false);
    setMessage("");
    setError("");

    try {
      const res = await fetch(SERIAL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serialNumber: serial.toUpperCase() }),
      });

      if (res.status === 409) {
        setError("Serial number already exists in the database.");
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add serial number.");
        return;
      }

      setMessage("Serial number added successfully!");
      setSerial("");
    } catch (err) {
      console.error("Add serial number error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleConfirmNo = () => setConfirmOpen(false);

  const handleBatchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBatchSerials(e.target.value);
    setBatchError("");
    setBatchMessage("");
    setBatchResult(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    setBatchError("");
    setBatchMessage("");
    setBatchResult(null);
  };

  const handleBatchUpload = async () => {
    const hasBatchText = batchSerials.trim().length > 0;
    const hasFile = !!selectedFile;

    setBatchError("");
    setBatchMessage("");
    setBatchResult(null);

    if (!hasBatchText && !hasFile) {
      setBatchError("Enter serial numbers or choose a CSV/XLSX file.");
      return;
    }

    setBatchLoading(true);

    try {
      const formData = new FormData();
      if (hasBatchText) formData.append("serialNumbers", batchSerials);
      if (selectedFile) formData.append("file", selectedFile);

      const res = await fetch(SERIAL_API, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok && res.status !== 409) {
        setBatchError(data.error || "Failed to add serial numbers.");
        return;
      }

      const result = {
        inserted: data.inserted || [],
        duplicates: data.duplicates || [],
        invalid: data.invalid || [],
      };
      setBatchResult(result);
      setBatchMessage(
        `${result.inserted.length} added, ${result.duplicates.length} duplicates skipped.`
      );

      if (result.inserted.length > 0) {
        setBatchSerials("");
        setSelectedFile(null);
      }
    } catch (err) {
      console.error("Batch serial upload error:", err);
      setBatchError("Something went wrong. Please try again.");
    } finally {
      setBatchLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Add a New Serial Number
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Serial Number"
          variant="outlined"
          size="small"
          value={serial}
          onChange={handleChange}
        />

        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}

        <Button
          onClick={handleAddClick}
          color="primary"
          variant="contained"
          style={{ backgroundColor: "#111111", color: "white" }}
        >
          Add Serial
        </Button>

        <Divider />

        <Typography variant="h6">Batch Add Serial Numbers</Typography>

        <TextField
          label="Multiple Serial Numbers"
          variant="outlined"
          size="small"
          multiline
          minRows={4}
          value={batchSerials}
          onChange={handleBatchTextChange}
          placeholder="SN001, SN002, SN003"
          helperText="Separate serial numbers with commas, semicolons, tabs, or new lines."
        />

        <Button variant="outlined" component="label">
          Choose CSV or XLSX File
          <input
            hidden
            type="file"
            accept=".csv,.txt,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileChange}
          />
        </Button>

        {selectedFile && (
          <Typography variant="body2">
            Selected file: {selectedFile.name}
          </Typography>
        )}

        {batchError && <Alert severity="error">{batchError}</Alert>}
        {batchMessage && <Alert severity="success">{batchMessage}</Alert>}

        {batchResult && (
          <Stack spacing={1}>
            {batchResult.inserted.length > 0 && (
              <Alert severity="success">
                Added: {batchResult.inserted.join(", ")}
              </Alert>
            )}
            {batchResult.duplicates.length > 0 && (
              <Alert severity="warning">
                Duplicates skipped: {batchResult.duplicates.join(", ")}
              </Alert>
            )}
            {batchResult.invalid.length > 0 && (
              <Alert severity="info">
                Invalid skipped: {batchResult.invalid.join(", ")}
              </Alert>
            )}
          </Stack>
        )}

        <Button
          onClick={handleBatchUpload}
          disabled={batchLoading}
          color="primary"
          variant="contained"
          style={{
            backgroundColor: batchLoading ? "#888" : "#111111",
            color: "white",
          }}
        >
          {batchLoading ? "Processing..." : "Add Batch Serials"}
        </Button>
      </Stack>

      <Dialog open={confirmOpen} onClose={handleConfirmNo}>
        <DialogTitle>Confirm Add</DialogTitle>
        <DialogContent>
          Are you sure you want to add serial number <strong>{serial}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmNo}>Cancel</Button>
          <Button
            onClick={handleConfirmYes}
            color="primary"
            variant="contained"
            style={{ backgroundColor: "#111111", color: "white" }}
          >
            Yes, Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
