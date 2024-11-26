"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Grid,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { Item, Location } from "@/types";

interface InventoryFormProps {
  onInventoryUpdate: () => void;
  refreshTrigger: number;
}

const InventoryForm: React.FC<InventoryFormProps> = ({
  onInventoryUpdate,
  refreshTrigger,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState({
    itemId: "",
    action: "",
    quantity: "",
    fromLocation: "",
    toLocation: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState("");
  const [resetInProgress, setResetInProgress] = useState(false);
  const [openConfirmReset, setOpenConfirmReset] = useState(false);
  const [openConfirmSubmit, setOpenConfirmSubmit] = useState(false);

  useEffect(() => {
    // Fetch items and locations from the API
    const fetchItems = async () => {
      const res = await fetch("http://localhost:8500/inventory/items");
      const data = await res.json();
      setItems(data);
    };

    const fetchLocations = async () => {
      const res = await fetch("http://localhost:8500/inventory/locations");
      const data = await res.json();
      setLocations(data);
    };

    fetchItems();
    fetchLocations();
  }, [refreshTrigger]);

  // Helper function to get item name by ID
  const getItemName = (itemId: string) => {
    const item = items.find((item) => item._id === itemId);
    return item ? item.name : "";
  };

  // Helper function to get location name by ID
  const getLocationName = (locationId: string) => {
    const location = locations.find((loc) => loc._id === locationId);
    return location ? location.name : "";
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate quantity before opening confirmation dialog
    const numericQuantity = parseInt(formData.quantity, 10);
    if (isNaN(numericQuantity) || numericQuantity <= 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        quantity: "Quantity must be a positive number",
      }));
      return; // Do not proceed
    }

    // Additional form validations can be added here if needed

    setOpenConfirmSubmit(true); // Open confirmation dialog
  };

  const handleConfirmSubmit = async () => {
    setOpenConfirmSubmit(false); // Close confirmation dialog
    setServerError(""); // Reset server error

    // Proceed with submission
    const res = await fetch(
      "https://airtek-warranty.onrender.com/inventory/transaction",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    if (res.ok) {
      setFormData({
        itemId: "",
        action: "",
        quantity: "",
        fromLocation: "",
        toLocation: "",
      });
      setErrors({});
      // Notify parent to refresh inventory list
      onInventoryUpdate();
    } else {
      const data = await res.json();
      setServerError(data.error || "Error updating inventory");
    }
  };

  const handleCloseConfirmSubmit = () => {
    setOpenConfirmSubmit(false);
  };

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target as HTMLInputElement;

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

  // Function to reset the last inventory update
  const handleResetLastTransaction = async () => {
    setResetInProgress(true);
    setServerError(""); // Reset server error
    try {
      const res = await fetch(
        "https://airtek-warranty.onrender.com/inventory/transaction/reset",
        {
          method: "POST",
        }
      );
      if (res.ok) {
        onInventoryUpdate();
      } else {
        const data = await res.json();
        setServerError(data.error || "Error resetting last transaction");
      }
    } catch (error) {
      console.error("Error resetting last transaction:", error);
      setServerError("Error resetting last transaction");
    }
    setResetInProgress(false);
  };

  // Handle reset confirmation dialog
  const handleOpenConfirmReset = () => {
    setOpenConfirmReset(true);
  };

  const handleCloseConfirmReset = () => {
    setOpenConfirmReset(false);
  };

  const handleConfirmReset = () => {
    setOpenConfirmReset(false);
    handleResetLastTransaction();
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

        {/* Item Selection */}
        <Grid item xs={12}>
          <Autocomplete
            options={items}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) =>
              setFormData({ ...formData, itemId: value ? value._id : "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Item" required fullWidth />
            )}
            value={items.find((item) => item._id === formData.itemId) || null}
          />
        </Grid>

        {/* Action Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Action</InputLabel>
            <Select
              name="action"
              value={formData.action}
              onChange={handleChange}
              label="Action"
            >
              <MenuItem value="in">Item In</MenuItem>
              <MenuItem value="out">Item Out</MenuItem>
              <MenuItem value="transfer">Transfer</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Location Selection */}
        {(formData.action === "in" || formData.action === "out") && (
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Location</InputLabel>
              <Select
                name="toLocation"
                value={formData.toLocation}
                onChange={handleChange}
                label="Location"
              >
                {locations.map((loc) => (
                  <MenuItem key={loc._id} value={loc._id}>
                    {loc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Transfer Locations */}
        {formData.action === "transfer" && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>From Location</InputLabel>
                <Select
                  name="fromLocation"
                  value={formData.fromLocation}
                  onChange={handleChange}
                  label="From Location"
                >
                  {locations.map((loc) => (
                    <MenuItem key={loc._id} value={loc._id}>
                      {loc.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>To Location</InputLabel>
                <Select
                  name="toLocation"
                  value={formData.toLocation}
                  onChange={handleChange}
                  label="To Location"
                >
                  {locations.map((loc) => (
                    <MenuItem key={loc._id} value={loc._id}>
                      {loc.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}

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

        {/* Buttons */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleOpenConfirmReset}
              disabled={resetInProgress}
            >
              Reset Last Inventory Update
            </Button>
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#182887" }}
            >
              Update Inventory
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Confirmation Dialog for Reset */}
      <Dialog
        open={openConfirmReset}
        onClose={handleCloseConfirmReset}
        aria-labelledby="confirm-reset-dialog-title"
      >
        <DialogTitle id="confirm-reset-dialog-title">Confirm Reset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset the last inventory update? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmReset} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmReset} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Submit */}
      <Dialog
        open={openConfirmSubmit}
        onClose={handleCloseConfirmSubmit}
        aria-labelledby="confirm-submit-dialog-title"
      >
        <DialogTitle id="confirm-submit-dialog-title">
          Confirm Inventory Update
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please confirm the following details before updating the inventory:
          </DialogContentText>
          <Box mt={2}>
            <Typography variant="body1">
              <strong>Item:</strong> {getItemName(formData.itemId)}
            </Typography>
            <Typography variant="body1">
              <strong>Action:</strong> {formData.action}
            </Typography>
            <Typography variant="body1">
              <strong>Quantity:</strong> {formData.quantity}
            </Typography>
            {(formData.action === "in" || formData.action === "out") && (
              <Typography variant="body1">
                <strong>Location:</strong>{" "}
                {getLocationName(formData.toLocation)}
              </Typography>
            )}
            {formData.action === "transfer" && (
              <>
                <Typography variant="body1">
                  <strong>From Location:</strong>{" "}
                  {getLocationName(formData.fromLocation)}
                </Typography>
                <Typography variant="body1">
                  <strong>To Location:</strong>{" "}
                  {getLocationName(formData.toLocation)}
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmSubmit} color="primary">
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

export default InventoryForm;
