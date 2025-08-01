"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material/Select";

interface Location {
  _id: string;
  name: string;
}

interface AddNewItemWithQuantityFormProps {
  onItemAdded: () => void;
}

const AddNewItemWithQuantityForm: React.FC<AddNewItemWithQuantityFormProps> = ({
  onItemAdded,
}) => {
  const [formData, setFormData] = useState({
    itemName: "",
    locationName: "",
    quantity: "",
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openNewLocationDialog, setOpenNewLocationDialog] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  useEffect(() => {
    // Fetch existing locations from the backend
    const fetchLocations = async () => {
      try {
        const res = await fetch(
          "https://airtek-warranty.onrender.com/inventory/locations"
        );
        const data = await res.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  // Helper function to get the location object based on the name
  const getLocationByName = (name: string): Location | undefined => {
    return locations.find((loc) => loc.name === name);
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const { name, value } = e.target as { name: string; value: string };

    if (name === "quantity") {
      // Remove leading zeros
      const sanitizedValue = value.replace(/^0+/, "") || "0";
      const numericValue = parseInt(sanitizedValue, 10);

      if (
        !isNaN(numericValue) &&
        numericValue >= 0 &&
        Number.isInteger(numericValue)
      ) {
        setFormData({ ...formData, [name]: sanitizedValue });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else {
        setFormData({ ...formData, [name]: sanitizedValue });
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Quantity must be a non-negative integer",
        }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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
    if (
      isNaN(numericQuantity) ||
      numericQuantity < 0 ||
      !Number.isInteger(numericQuantity)
    ) {
      newErrors.quantity = "Quantity must be a non-negative integer";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Open confirmation dialog
    setOpenConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setOpenConfirmDialog(false); // Close the confirmation dialog

    // Proceed with submission
    try {
      const res = await fetch(
        "https://airtek-warranty.onrender.com/inventory/add-item",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

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

  const handleCancelSubmit = () => {
    setOpenConfirmDialog(false);
  };

  // Handle adding new location
  const handleAddNewLocation = async () => {
    if (newLocationName.trim() === "") return;

    try {
      const res = await fetch(
        "https://airtek-warranty.onrender.com/inventory/locations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newLocationName.trim() }),
        }
      );
      if (res.ok) {
        const newLocation = await res.json();
        setLocations([...locations, newLocation]);
        setFormData({ ...formData, locationName: newLocation.name });
        setNewLocationName("");
        setOpenNewLocationDialog(false);
      } else {
        const data = await res.json();
        alert(data.error || "Error adding new location");
      }
    } catch (error) {
      console.error("Error adding new location:", error);
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
          <Box display="flex" alignItems="center">
            <FormControl fullWidth required>
              <InputLabel>Location</InputLabel>
              <Select
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                label="Location"
              >
                {locations.map((loc) => (
                  <MenuItem key={loc._id} value={loc.name}>
                    {loc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <IconButton
              color="primary"
              onClick={() => setOpenNewLocationDialog(true)}
            >
              <AddIcon />
            </IconButton> */}
          </Box>
          {errors.locationName && (
            <p style={{ color: "red", margin: "0.5em 0 0 0" }}>
              {errors.locationName}
            </p>
          )}
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
            inputProps={{
              min: 1,
              onWheel: (e) => {
                const inputElement = e.currentTarget as HTMLInputElement;
                inputElement.blur();
              },
            }}
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

      {/* Dialog for Adding New Location */}
      <Dialog
        open={openNewLocationDialog}
        onClose={() => setOpenNewLocationDialog(false)}
        aria-labelledby="new-location-dialog-title"
      >
        <DialogTitle id="new-location-dialog-title">
          Add New Location
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Location Name"
            fullWidth
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenNewLocationDialog(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleAddNewLocation} color="secondary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelSubmit}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Confirm New Item Addition
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Please confirm the following details before adding the new item:
          </Typography>
          <Box mt={2}>
            <Typography variant="body1">
              <strong>Item Name:</strong> {formData.itemName}
            </Typography>
            <Typography variant="body1">
              <strong>Location:</strong> {formData.locationName}
            </Typography>
            <Typography variant="body1">
              <strong>Quantity:</strong> {formData.quantity}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSubmit} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSubmit} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default AddNewItemWithQuantityForm;
