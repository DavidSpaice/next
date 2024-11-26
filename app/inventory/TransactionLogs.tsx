"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Grid, Box, Alert } from "@mui/material";

interface AddInventoryItemFormProps {
  onItemAdded: () => void;
}

const AddInventoryItemForm: React.FC<AddInventoryItemFormProps> = ({
  onItemAdded,
}) => {
  const [formData, setFormData] = useState({
    itemName: "",
    locationName: "",
    quantity: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      // Remove leading zeros
      const sanitizedValue = value.replace(/^0+/, "");
      const numericValue = parseInt(sanitizedValue, 10);

      if (!isNaN(numericValue) && numericValue > 0) {
        setFormData({ ...formData, [name]: sanitizedValue });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else {
        setFormData({ ...formData, [name]: sanitizedValue });
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Quantity must be a positive number",
        }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setServerError("");
    setSuccessMessage("");

    // Validate inputs
    const newErrors: { [key: string]: string } = {};
    if (formData.itemName.trim() === "") {
      newErrors.itemName = "Item name is required";
    }
    if (formData.locationName.trim() === "") {
      newErrors.locationName = "Location name is required";
    }
    const numericQuantity = parseInt(formData.quantity, 10);
    if (isNaN(numericQuantity) || numericQuantity <= 0) {
      newErrors.quantity = "Quantity must be a positive number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Proceed with submission
    try {
      const res = await fetch("http://localhost:8500/inventory/add-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccessMessage("Item added successfully");
        setFormData({
          itemName: "",
          locationName: "",
          quantity: "",
        });
        setErrors({});
        // Notify parent component if needed
        if (onItemAdded) {
          onItemAdded();
        }
      } else {
        const data = await res.json();
        setServerError(data.error || "Error adding item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      setServerError("Error adding item");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Display Server Error */}
        {serverError && (
          <Grid item xs={12}>
            <Alert severity="error">{serverError}</Alert>
          </Grid>
        )}
        {/* Display Success Message */}
        {successMessage && (
          <Grid item xs={12}>
            <Alert severity="success">{successMessage}</Alert>
          </Grid>
        )}
        {/* Item Name Input */}
        <Grid item xs={12}>
          <TextField
            name="itemName"
            label="Item Name"
            value={formData.itemName}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.itemName}
            helperText={errors.itemName}
          />
        </Grid>
        {/* Location Name Input */}
        <Grid item xs={12}>
          <TextField
            name="locationName"
            label="Location Name"
            value={formData.locationName}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.locationName}
            helperText={errors.locationName}
          />
        </Grid>
        {/* Quantity Input */}
        <Grid item xs={12}>
          <TextField
            name="quantity"
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ min: 1 }}
            error={!!errors.quantity}
            helperText={errors.quantity}
          />
        </Grid>
        {/* Submit Button */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#182887" }}
            >
              Add Item
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddInventoryItemForm;
