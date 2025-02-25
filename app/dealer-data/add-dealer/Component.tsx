"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

const allowedLocations = [
  "Manitoba",
  "Ontario",
  "Nova Scotia",
  "Quebec",
  "Calgary",
  "Vancouver",
];

const CANADIAN_PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Northwest Territories",
  "Nunavut",
  "Yukon",
];

export default function AddDealerData() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    _id: "",
    dealerName: "",
    dealerEmail: "",
    dealerPhone: "",
    dealerAddress: "",
    street: "",
    city: "",
    province: "",
    postcode: "",
    location: "",
  });

  const [errors, setErrors] = useState({
    dealerEmail: "",
    dealerPhone: "",
  });

  // Update input change handler to filter _id and remove non-alphanumeric characters.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "_id") {
      // Only allow letters and numbers
      processedValue = value.replace(/[^A-Za-z0-9]/g, "");
    }
    // Trim the value and update state
    setFormData((prevData) => ({
      ...prevData,
      [name]: processedValue.trim(),
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle dropdown changes as before
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (!name) return;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.dealerEmail)) {
      setErrors((prev) => ({
        ...prev,
        dealerEmail: "Please enter a valid email address.",
      }));
      return;
    }
    const phoneRegex = /^[0-9]+$/;
    if (formData.dealerPhone && !phoneRegex.test(formData.dealerPhone)) {
      setErrors((prev) => ({
        ...prev,
        dealerPhone: "Please enter numbers only.",
      }));
      return;
    }

    // Combine address fields
    const dealerAddress = [
      formData.street,
      formData.city,
      formData.province,
      formData.postcode,
    ]
      .filter(Boolean)
      .join(", ");

    // Convert _id to uppercase when passing to the server
    const dataToSubmit = {
      ...formData,
      _id: formData._id.toUpperCase(),
      dealerAddress,
    };

    try {
      const response = await fetch(
        "https://airtek-warranty.onrender.com/dealerData/add-new-dealer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (response.ok) {
        alert("Dealer Data added successfully!");
        setFormData({
          _id: "",
          dealerName: "",
          dealerEmail: "",
          dealerPhone: "",
          dealerAddress: "",
          street: "",
          city: "",
          province: "",
          postcode: "",
          location: "",
        });
      } else {
        if (response.status === 400) {
          alert("Dealer ID already exists. Please use a different ID.");
        } else {
          const errorText = await response.text();
          console.error("Error adding dealer data:", errorText);
          alert("Error adding dealer data. Please try again.");
        }
      }
    } catch (error) {
      console.error("Network error or issue preventing request:", error);
      alert("Network error or issue preventing request. Please try again.");
    }
  };

  return (
    <div style={{ margin: "2rem" }}>
      <Paper style={{ padding: "2rem" }} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Add Dealer Data
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Dealer ID */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dealer ID"
                name="_id"
                variant="outlined"
                fullWidth
                required
                value={formData._id}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Dealer Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dealer Name"
                name="dealerName"
                variant="outlined"
                fullWidth
                required
                value={formData.dealerName}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Dealer Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dealer Email"
                name="dealerEmail"
                variant="outlined"
                type="email"
                fullWidth
                required
                value={formData.dealerEmail}
                onChange={handleInputChange}
                error={!!errors.dealerEmail}
                helperText={errors.dealerEmail}
              />
            </Grid>

            {/* Dealer Phone */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dealer Phone"
                name="dealerPhone"
                variant="outlined"
                fullWidth
                required
                value={formData.dealerPhone}
                onChange={handleInputChange}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                error={!!errors.dealerPhone}
                helperText={errors.dealerPhone}
              />
            </Grid>

            {/* Street */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Street"
                name="street"
                variant="outlined"
                fullWidth
                value={formData.street}
                onChange={handleInputChange}
              />
            </Grid>

            {/* City */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                name="city"
                variant="outlined"
                fullWidth
                value={formData.city}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Province Dropdown */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="province-label">Province</InputLabel>
                <Select
                  labelId="province-label"
                  label="Province"
                  name="province"
                  value={formData.province}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="">
                    <em>Select a province</em>
                  </MenuItem>
                  {CANADIAN_PROVINCES.map((prov) => (
                    <MenuItem key={prov} value={prov}>
                      {prov}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Postcode */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Postcode"
                name="postcode"
                variant="outlined"
                fullWidth
                value={formData.postcode}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Location Dropdown */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="location-label">Branch Location *</InputLabel>
                <Select
                  labelId="location-label"
                  label="Branch Location *"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="">
                    <em>Select a location</em>
                  </MenuItem>
                  {allowedLocations.map((loc) => (
                    <MenuItem key={loc} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Submit button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                style={{ backgroundColor: "rgb(37, 48, 110)", color: "#fff" }}
              >
                Add Dealer Data
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Back Link */}
        <div style={{ marginTop: "1rem" }}>
          <Link href="/dealer-data/dealer-info" passHref>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#888",
                color: "white",
              }}
            >
              Back
            </Button>
          </Link>
        </div>
      </Paper>
    </div>
  );
}
