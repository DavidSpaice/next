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
} from "@mui/material";

/**
 * Transform the user input to uppercase
 * and allow only A-Z, digits 0-9, dash `-`, slash `/`, parentheses `(`, `)`.
 * Disallows everything else by removing it.
 */
function sanitizeSerialInput(input: string) {
  // Force uppercase
  let upper = input.toUpperCase();

  // Regex allows letters (A-Z), digits (0-9), dash, slash, parentheses
  // Any character NOT in that set is removed
  upper = upper.replace(/[^A-Z0-9\-\/()]/g, "");

  return upper;
}

export default function AddSerialNumber() {
  const [serial, setSerial] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(""); // clear success message if user starts typing again
    const cleaned = sanitizeSerialInput(e.target.value);

    if (cleaned !== e.target.value.toUpperCase()) {
      // The user tried to type disallowed chars (we removed them)
      setError("Only A-Z, 0-9, - / ( ) allowed. Invalid characters removed.");
    } else {
      setError("");
    }
    setSerial(cleaned);
  };

  // When user clicks "Add Serial"
  const handleAddClick = () => {
    if (!serial.trim()) {
      setError("Serial number is required");
      return;
    }
    if (error) {
      // If there's a validation error, don't proceed
      return;
    }
    // Open confirmation dialog
    setConfirmOpen(true);
  };

  // User confirms "Yes" in dialog
  const handleConfirmYes = async () => {
    setConfirmOpen(false);
    setMessage("");
    setError("");

    try {
      const res = await fetch("https://airtek-warranty.onrender.com/serial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Force uppercase again for safety
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

      // Success
      setMessage("Serial number added successfully!");
      setSerial("");
    } catch (err) {
      console.error("Add serial number error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  // User cancels in dialog
  const handleConfirmNo = () => {
    setConfirmOpen(false);
  };

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
        maxWidth: 400,
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
          // Optionally, enforce uppercase visually at the field:
          // inputProps={{ style: { textTransform: "uppercase" } }}
        />

        {/* Show any error or success messages using MUI Alerts */}
        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}

        <Button
          onClick={handleAddClick}
          color="primary"
          variant="contained"
          style={{
            backgroundColor: "rgb(37, 48, 110)",
            color: "white",
          }}
        >
          Add Serial
        </Button>
      </Stack>

      {/* Confirmation Dialog */}
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
            style={{
              backgroundColor: "rgb(37, 48, 110)",
              color: "white",
            }}
          >
            Yes, Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
