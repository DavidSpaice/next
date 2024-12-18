"use client";
import { useState, useEffect, ChangeEvent, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";

import Grid from "@mui/material/Grid";
import model from "./sku";
import city from "./cities";
import province from "./provinces";

import { AutocompleteInputChangeReason } from "@mui/material";

import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Controls from "./Controls";

import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { NewItem, FormData, CustomError } from "@/types";
import { debounce } from "lodash";

const WarrantyForm = () => {
  const [dealerData, setDealerData] = useState<
    {
      _id: string;
      dealerName: string;
      dealerEmail: string;
      dealerPhone: number;
      dealerAddress: string;
      location: string;
    }[]
  >([]);

  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [errors, setErrors] = useState<CustomError>({
    installType: "",
    firstName: "",
    lastName: "",
    email: "",
    streetAddress: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "",
    phone: "",
    dealerId: "",
    dealerName: "",
    dealerEmail: "",
    dealerPhone: "",
    dealerAddress: "",
    location: "",
    model: "",
    serialNumber: "",
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const phoneValidate = /^[0-9]{9,}$/;
  const [stepFourError, setStepFourError] = useState(false);
  const skuFilterOptions = createFilterOptions<{ model: string }>({
    matchFrom: "any",
    limit: 10,
  });

  const cityFilterOptions = createFilterOptions<{ city: string }>({
    matchFrom: "any",
    limit: 10,
  });

  const provinceFilterOptions = createFilterOptions<{ province: string }>({
    matchFrom: "any",
    limit: 13,
  });

  const [newItem, setNewItem] = useState<NewItem>({
    id: "",
    model: "",
    serialNumber: "",
    installationDate: dayjs(),
  });

  const [formData, setFormData] = useState<FormData>({
    installType: "",
    firstName: "",
    lastName: "",
    email: "",
    streetAddress: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "Canada",
    phone: "",
    extension: "",
    dealerId: "",
    dealerName: "",
    dealerEmail: "",
    dealerPhone: "",
    dealerAddress: "",
    location: "",
    items: [],
    agreedToTerms: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const thirdResponse = await fetch(
          "https://airtek-warranty.onrender.com/dealerData"
        );
        const resDealerData = await thirdResponse.json();

        setDealerData(resDealerData);
      } catch (error) {
        console.error("Error fetching serial number data:", error);
      }
    };

    fetchData();
  }, []);

  const modelOnChange = (
    event: React.ChangeEvent<{}>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    if (typeof value === "string") {
      setNewItem((prevData) => ({
        ...prevData,
        model: value,
      }));

      if (value.trim() !== "") {
        validateModel({ model: value });
      }
    }

    setStepFourError(false);
  };

  const validateSerialNumber = async (
    fieldValues: Partial<NewItem> = newItem
  ) => {
    const serialNumber = fieldValues.serialNumber ?? "";
    // const serialNumberExists = serialNumberStrings.some(
    //   (item) => item === serialNumber.toLowerCase()
    // );
    if (!serialNumber) {
      // Set error message if serial number is empty
      setErrors((prevErrors) => ({
        ...prevErrors,
        serialNumber: "Serial number is required.",
      }));
      return false;
    }

    try {
      const response = await fetch(
        "https://airtek-warranty.onrender.com/serial/checkSerialNumber",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ serialNumber }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const serialNumberExists = result.exists;
        setErrors((prevErrors) => ({
          ...prevErrors,
          serialNumber: serialNumberExists
            ? ""
            : "Invalid or Registered Serial Number.",
        }));

        // Return true or false based on the validation
        if (fieldValues === newItem) {
          if (!serialNumberExists) {
            return false; // Validation failed
          }
          return Object.values(errors).every((x) => x === "");
        }
      } else {
        console.error("Server error:", response.status, response.statusText);
        setErrors((prevErrors) => ({
          ...prevErrors,
          serialNumber: "Server error",
        }));
        return false;
      }
    } catch (error) {
      console.error("Error checking serial number");
      setErrors((prevErrors) => ({
        ...prevErrors,
        serialNumber: "Server busy checking later",
      }));
      // Handle error if needed
      return false;
    }
  };

  const debouncedSerialNumberOnChange = useMemo(
    () =>
      debounce((value) => {
        if (value.trim() !== "") {
          // Validate only when the input is not empty
          validateSerialNumber({ serialNumber: value });
        }
      }, 500),
    []
  );

  const SerialNumberOnChange = (
    event: React.ChangeEvent<{}>,
    value: string | { _id: string; serialNumber: string },
    reason: any
  ) => {
    if (typeof value === "string") {
      setNewItem((prevData) => ({
        ...prevData,
        serialNumber: value,
      }));
    }
    debouncedSerialNumberOnChange(value);

    setStepFourError(false);
  };

  const adaptedSerialNumberOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    SerialNumberOnChange(e, e.target.value, "input");
  };

  const validateType = (fieldValues: Partial<FormData> = formData) => {
    if ("installType" in fieldValues)
      errors.installType = fieldValues.installType
        ? ""
        : "This field is required.";
    setErrors({ ...errors, installType: errors.installType });

    return errors.installType ? true : false;
  };
  const validate = (fieldValues: Partial<FormData> = formData) => {
    if ("firstName" in fieldValues)
      errors.firstName = fieldValues.firstName ? "" : "This field is required.";
    if ("lastName" in fieldValues)
      errors.lastName = fieldValues.lastName ? "" : "This field is required.";
    if ("email" in fieldValues)
      errors.email = emailValidate.test(fieldValues.email ?? "")
        ? ""
        : "Email is not valid.";
    if ("phone" in fieldValues)
      errors.phone = phoneValidate.test(fieldValues.phone ?? "")
        ? ""
        : "Minimum 10 numbers required and number only.";
    if ("streetAddress" in fieldValues)
      errors.streetAddress =
        fieldValues.streetAddress ?? "".length != 0
          ? ""
          : "This field is required.";
    if ("city" in fieldValues)
      errors.city =
        fieldValues.city ?? "".length != 0 ? "" : "This field is required.";
    if ("stateProvince" in fieldValues)
      errors.stateProvince =
        fieldValues.stateProvince ?? "".length != 0
          ? ""
          : "This field is required.";
    if ("postalCode" in fieldValues)
      errors.postalCode =
        fieldValues.postalCode ?? "".length != 0
          ? ""
          : "This field is required.";
    if ("country" in fieldValues)
      errors.country =
        fieldValues.country ?? "".length != 0 ? "" : "This field is required.";
    if ("dealerName" in fieldValues)
      errors.dealerName =
        fieldValues.dealerName ?? "".length != 0
          ? ""
          : "This field is required.";
    if ("dealerEmail" in fieldValues)
      errors.dealerEmail = emailValidate.test(fieldValues.dealerEmail ?? "")
        ? ""
        : "Email is not valid.";
    if ("dealerPhone" in fieldValues)
      errors.dealerPhone =
        fieldValues.dealerPhone ?? "".length > 9
          ? ""
          : "Minimum 10 numbers required.";
    if ("dealerAddress" in fieldValues)
      errors.dealerAddress =
        fieldValues.dealerAddress ?? "".length != 0
          ? ""
          : "This field is required.";

    // Check if dealerId is empty and update errors immediately
    if ("dealerId" in fieldValues) {
      if (
        typeof fieldValues.dealerId === "string" &&
        fieldValues.dealerId.trim() === ""
      ) {
        errors.dealerId = "Invalid Dealer Id.";
        // Update the FormData with the dealer details
        setFormData((prevData) => ({
          ...prevData,
          dealerName: "",
          dealerEmail: "",
          dealerPhone: "",
          dealerAddress: "",
          location: "",
        }));
      } else if (typeof fieldValues.dealerId === "string") {
        const dealerExists = dealerData.some(
          (dealer) =>
            dealer?._id &&
            dealer?._id.toLowerCase() === fieldValues.dealerId?.toLowerCase()
        );

        if (dealerExists) {
          const dealerDetails = dealerData.find(
            (dealer) =>
              dealer?._id &&
              dealer?._id.toLowerCase() === fieldValues.dealerId?.toLowerCase()
          );

          // Convert dealerPhone to string before setting it in the FormData
          const dealerPhoneAsString =
            dealerDetails?.dealerPhone?.toString() || "";

          // Update the FormData with the dealer details
          setFormData((prevData) => ({
            ...prevData,
            dealerName: dealerDetails?.dealerName || "",
            dealerEmail: dealerDetails?.dealerEmail || "",
            dealerPhone: dealerPhoneAsString,
            dealerAddress: dealerDetails?.dealerAddress || "",
            location: dealerDetails?.location || "",
          }));
        }

        errors.dealerId = dealerExists ? "" : "Invalid Dealer Id.";
      }
    }

    setErrors({
      ...errors,
    });

    if (fieldValues == formData)
      return Object.values(errors).every((x) => x == "");
  };

  const modelStrings = model.map((item) => item.model.toLowerCase());

  const validateModel = (fieldValues: Partial<NewItem> = newItem) => {
    const model = fieldValues.model ?? "";
    const modelExists = modelStrings.some(
      (item) => item === model.toLowerCase()
    );

    // Set the errors in the state
    setErrors((prevErrors) => ({
      ...prevErrors,
      model: modelExists ? "" : "Invalid model.",
    }));

    // Return true or false based on the validation
    if (fieldValues === newItem) {
      if (!modelExists) {
        return false; // Validation failed
      }
      return Object.values(errors).every((x) => x === "");
    }
  };

  const handleChange = (
    event:
      | React.SyntheticEvent<Element, Event>
      | React.ChangeEvent<HTMLInputElement>,
    value?: string,
    reason?: AutocompleteInputChangeReason
  ) => {
    let name: string;
    let inputValue: string;

    if (value !== undefined && reason) {
      // This means it's being called from Autocomplete
      name = (event.target as HTMLInputElement).name;
      inputValue = value;
    } else {
      // This is a standard input change
      const inputEvent = event as React.ChangeEvent<HTMLInputElement>;
      name = inputEvent.target.name;
      inputValue = inputEvent.target.value;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));

    // Assume validation is always needed
    validateType({ [name]: inputValue });
    validate({ [name]: inputValue });
  };

  const dateOnChange = (date: Dayjs | null) => {
    const dayjsDate = date ? dayjs(date) : null;

    setNewItem((prevData) => ({
      ...prevData,
      installationDate: dayjsDate,
    }));
  };

  const handleAddItem = async () => {
    const serialNumberExists = formData.items.some(
      (item) =>
        item.serialNumber.toLowerCase() === newItem.serialNumber.toLowerCase()
    );

    if (serialNumberExists) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        serialNumber: "Serial number already exists.",
      }));
      return;
    }

    const isModelValid = validateModel();
    const isSerialNumberValid = await validateSerialNumber();

    if (!isModelValid || !isSerialNumberValid) {
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      model: "",
      serialNumber: "",
      installationDate: "",
    }));

    setFormData((prevData) => ({
      ...prevData,
      items: [...prevData.items, { ...newItem, id: Date.now() }],
    }));

    // Empty the input fields
    setNewItem({
      id: null,
      model: "",
      serialNumber: "",
      installationDate: dayjs(),
    });

    setStepFourError(false);

    setErrors((prevErrors) => ({
      ...prevErrors,
      model: "",
      serialNumber: "",
      installationDate: "",
    }));
  };

  const handleDeleteItem = (itemId: string) => {
    setFormData((prevData) => ({
      ...prevData,
      items: prevData.items.filter((item) => item.id !== itemId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch(
      `https://airtek-warranty.onrender.com/warranties/warranty-register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    )
      .then(function (response) {
        if (response.ok) {
          return response.text();
        }
        throw new Error("Error: " + response.status);
      })
      .then(function (responseText) {
        setLoading(true);
        router.push("warranty/thank-you");
        // console.log(responseText);
        setIsDisabled(false);
      })
      .catch(function (error) {
        router.push("warranty/error");
        // console.error(error);
        setIsDisabled(false);
      });
  };

  const handleNext = () => {
    const currentStep = Number(searchParams.get("step")) || 1;

    if (currentStep === 2 && formData.installType.length === 0) {
      validateType();
      // console.log(errors);
      return;
    } else if (currentStep === 3) {
      const isFormValid = validate();

      if (!isFormValid) {
        return;
      }
    } else if (currentStep === 4 && formData.items.length === 0) {
      setStepFourError(true);
      // console.log(errors);
      return;
    }

    // console.log(errors);
    router.push(`/warranty?step=${currentStep + 1}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePrevious = () => {
    const currentStep = Number(searchParams.get("step")) || 1;
    router.push(`/warranty?step=${currentStep - 1}`);
  };

  const renderForm = () => {
    const currentStep = Number(searchParams.get("step")) || 1;

    switch (currentStep) {
      case 1:
        return (
          <div className="w-full flex flex-col justify-center items-center">
            <div className="form-content w-1/2">
              <p className="title">
                Airtek/Gree represents more than just HVAC. It embodies a
                commitment.
              </p>
              <br />
              <p>
                Gree transcends the realm of HVAC and embodies a steadfast
                commitment. We firmly believe that the foundation of a healthy
                and comfortable home lies within the quality of the air we
                breathe. Since our inception, our unwavering dedication to
                perfecting air quality has been the catalyst behind every
                innovation we have introduced.
              </p>

              <p>
                Gree revolutionizes the air, making it cooler, warmer, drier,
                cleaner, and ultimately better through our exceptional systems.
                Our premium, award-winning solutions are renowned for their
                exceptional efficiency and whisper-quiet operation, setting new
                industry standards.
              </p>

              <p>
                For residential applications, we offer a range of coverage
                options, including the opportunity to extend parts and labor
                coverage through our valued partners. By completing the warranty
                registration for your new Gree equipment, you unlock access to
                our industry-leading coverage options exclusively available to
                Gree owners. You can find a list of eligible products on our
                website.
              </p>

              <p>
                To begin the registration process, please gather the following
                information:
              </p>
              <div className="list">
                <ul>
                  <li>
                    Serial number and model number for each piece of equipment
                    you have purchased.
                  </li>
                  <li>
                    For existing locations, the installation date; for new
                    constructions, the closing date.
                  </li>
                  <li>
                    An email address to receive confirmation of your coverage
                    selection.
                  </li>
                  <li>
                    If you are a dealer, kindly provide your customer number.
                  </li>
                  <li>
                    If your equipment qualifies for an extended limited
                    warranty, we may also request details about any additional
                    accessories purchased for your system, including their
                    serial number, model number, and brand.
                  </li>
                </ul>
              </div>

              <br />
              <p>
                Our commitment to your satisfaction and providing comprehensive
                warranty coverage is unwavering. At Gree, we strive to bring you
                peace of mind by ensuring exceptional service and support
                throughout your ownership experience.
              </p>
            </div>
            <div className="form-btn">
              <button type="button" className="next-btn" onClick={handleNext}>
                <span>Next</span>
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col justify-center items-center">
            <div className="w-full form-content">
              <p className="title">Tell Us About The Installation</p>
              <FormControl
                sx={{ m: 3, ".MuiFormControlLabel-label": { fontSize: 14 } }}
                error={errors.installType ? true : false}
                variant="standard"
              >
                <FormLabel
                  id="demo-error-radios"
                  sx={{
                    "&.MuiFormLabel-root.Mui-focused": {
                      color: "#182887",
                    },
                  }}
                >
                  The equipment is installed in a:
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-error-radios"
                  name="installType"
                  value={formData.installType}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Existing Home"
                    control={
                      <Radio
                        sx={{
                          "&.Mui-checked": {
                            color: "#182887",
                          },
                        }}
                      />
                    }
                    label="Existing Home"
                  />
                  <FormControlLabel
                    value="Newly Constructed Home"
                    control={
                      <Radio
                        sx={{
                          "&.Mui-checked": {
                            color: "#182887",
                          },
                        }}
                      />
                    }
                    label="Newly Constructed Home"
                  />
                  <FormControlLabel
                    value="Commercial Existing and New Construction"
                    control={
                      <Radio
                        sx={{
                          "&.Mui-checked": {
                            color: "#182887",
                          },
                        }}
                      />
                    }
                    label="Commercial Existing and New Construction"
                  />
                </RadioGroup>
                <FormHelperText>{errors.installType}</FormHelperText>
              </FormControl>
              <br />
              <br />
            </div>

            <div className="form-btn">
              <button
                type="button"
                className="pre-btn"
                onClick={handlePrevious}
              >
                Back
              </button>
              <button type="button" className="next-btn" onClick={handleNext}>
                <span>Next</span>
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <p className="title">Home Owner Information</p>

            <Box
              component="div"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
              display="flex-col"
              alignItems="center"
            >
              <div className="w-full flex flex-col items-center justify-center  sm:flex-row">
                <Controls
                  error={errors.dealerId}
                  type="text"
                  label="Dealer ID"
                  size="small"
                  name="dealerId"
                  value={formData.dealerId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full flex flex-col items-center justify-center sm:flex-row">
                <Controls
                  error={errors.firstName}
                  type="text"
                  label="First Name"
                  name="firstName"
                  size="small"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />

                <Controls
                  error={errors.lastName}
                  type="text"
                  label="Last Name"
                  name="lastName"
                  size="small"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full flex flex-col items-center justify-center sm:flex-row">
                <Controls
                  error={errors.email}
                  required
                  type="text"
                  name="email"
                  label="Email"
                  size="small"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Controls
                  error={errors.streetAddress}
                  type="text"
                  name="streetAddress"
                  label="Street Address"
                  size="small"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full flex flex-col items-center justify-center sm:flex-row">
                <Autocomplete
                  freeSolo
                  disableClearable
                  filterOptions={cityFilterOptions}
                  options={city}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.city
                  }
                  value={formData.city}
                  onInputChange={(event, newInputValue, reason) => {
                    // This handles the input change directly, regardless of selection
                    if (reason === "input") {
                      setFormData((prevData) => ({
                        ...prevData,
                        city: newInputValue,
                      }));
                    }
                  }}
                  onChange={(event, newValue) => {
                    // This handles the final selection or clear event
                    const value =
                      typeof newValue === "string"
                        ? newValue
                        : newValue?.city || "";
                    setFormData((prevData) => ({
                      ...prevData,
                      city: value,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search or Input City"
                      size="small"
                      error={!!errors.city}
                      helperText={errors.city}
                      name="city"
                      required
                    />
                  )}
                />

                <Autocomplete
                  freeSolo
                  disableClearable
                  filterOptions={provinceFilterOptions}
                  options={province}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.province
                  }
                  value={formData.stateProvince}
                  onInputChange={(event, newInputValue, reason) => {
                    // This handles the input change directly, regardless of selection
                    if (reason === "input") {
                      setFormData((prevData) => ({
                        ...prevData,
                        stateProvince: newInputValue,
                      }));
                    }
                  }}
                  onChange={(event, newValue) => {
                    // This handles the final selection or clear event
                    const value =
                      typeof newValue === "string"
                        ? newValue
                        : newValue?.province || "";
                    setFormData((prevData) => ({
                      ...prevData,
                      stateProvince: value,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Province"
                      size="small"
                      error={!!errors.stateProvince}
                      helperText={errors.stateProvince}
                      name="stateProvince"
                      required
                    />
                  )}
                />
              </div>

              <div className="w-full flex flex-col items-center justify-center sm:flex-row">
                <Controls
                  error={errors.postalCode}
                  type="text"
                  name="postalCode"
                  label="Postal / Zip code"
                  size="small"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />

                <Controls
                  error={errors.country}
                  type="text"
                  name="country"
                  label="Country"
                  size="small"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full flex flex-col items-center justify-center sm:flex-row">
                <Controls
                  error={errors.phone}
                  type="text"
                  name="phone"
                  label="Phone"
                  size="small"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

                <Controls
                  type="text"
                  name="extension"
                  label="Ext"
                  size="small"
                  value={formData.extension || ""}
                  onChange={handleChange}
                  required={false}
                />
              </div>
            </Box>
            <br />
            <br />
            <div className="w-full flex flex-row justify-center items-center">
              <button
                type="button"
                className="pre-btn"
                onClick={handlePrevious}
              >
                Back
              </button>
              <button type="button" className="next-btn" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="w-full sm:w-2/4">
            <div className="w-full flex flex-col justify-center items-center">
              <Grid container className="w-full sm:w-4/5" spacing={3}>
                <Grid item xs={12} md={12} alignItems="center">
                  <p className="title">Tell Us About The Installation</p>
                  <p>
                    If your coils are Aspen, No need to register online; simply
                    bring them to our warehouse.
                  </p>
                  <div style={{ color: "#d32f2f" }}>
                    {stepFourError
                      ? "Please provide the necessary details or information."
                      : ""}
                  </div>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    filterOptions={skuFilterOptions}
                    ListboxProps={{ style: { maxHeight: 150 } }}
                    options={model}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.model
                    }
                    onInputChange={modelOnChange}
                    value={newItem.model}
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option.model}>
                          {option.model}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        type="text"
                        label="Search a Model Number"
                        size="small"
                        error={errors.model ? true : false}
                        helperText={errors.model}
                        name="model"
                        required
                        InputProps={{
                          ...params.InputProps,
                          type: "search",
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={4}
                  className="flex flex-row justify-center items-center"
                >
                  <Controls
                    type="text"
                    label="Serial Number"
                    name="serialNumber"
                    size="small"
                    value={newItem.serialNumber}
                    onChange={adaptedSerialNumberOnChange}
                    error={errors.serialNumber}
                    required
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={2}
                  className="flex flex-row justify-center items-center"
                >
                  <DatePicker
                    label="Installation Date"
                    slotProps={{ textField: { size: "small" } }}
                    value={newItem.installationDate}
                    onChange={dateOnChange}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={2}
                  className="flex flex-row justify-center items-center"
                >
                  <button
                    type="button"
                    className="list-btn"
                    onClick={handleAddItem}
                  >
                    Add Item
                  </button>
                </Grid>
                <Grid item xs={12} md={12} alignItems="center">
                  {formData.items.length > 0 && (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Model</TableCell>
                          <TableCell>Serial Number</TableCell>
                          <TableCell>Installation Date</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.model}</TableCell>
                            <TableCell>{item.serialNumber}</TableCell>
                            <TableCell>
                              {item.installationDate?.format("MM/DD/YYYY")}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Grid>
              </Grid>

              <br />
              <br />
              <Grid item xs={12} md={12}>
                <div className="w-full flex flex-row justify-center items-center">
                  <button
                    type="button"
                    className="pre-btn"
                    onClick={handlePrevious}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="next-btn"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              </Grid>
            </div>

            {/* </Box> */}
          </div>
        );
      case 5:
        return (
          <div className="w-2/4 flex flex-col justify-center items-center">
            <div className="form-content w-4/5">
              <p className="serialNumber">Confirmation</p>
              <p>
                We offer a comprehensive warranty for our products, covering
                failures resulting from defects in materials and workmanship
                during normal use and maintenance. The warranty terms and
                conditions are outlined below, with all warranty periods
                commencing from the date of the original installation, start-up,
                or commissioning of the equipment. Please note that this
                warranty is subject to the provisions, conditions, limitations,
                and exclusions listed:
              </p>
              <div className="list">
                <ul>
                  <li>
                    A warranty period of ten (10) years on the compressor and
                    all parts to the original registered owner.
                  </li>
                  <li>
                    A warranty period of five (5) years on the compressor & all
                    parts for PTAC to the original registered owner.
                  </li>
                  <li>
                    A warranty period of one (1) year on the remote control
                    provided with the original equipment.
                  </li>
                  <li>
                    This warranty only applies to systems that have been
                    professionally installed by a certified & licensed
                    contractor, in accordance with all applicable building codes
                    and permits, and installed via Airtek/Gree installation and
                    operating instructions.
                  </li>
                  <li>
                    This warranty applies to all products remaining in their
                    original installed location.
                  </li>
                  <li>
                    The warranty is void if the product serial identification
                    tag is removed or defaced to a point where the unit cannot
                    be identified.
                  </li>
                  <li>
                    Field installed accessories are only covered for a period of
                    one (1) year from the date of installation.
                  </li>
                  <li>
                    Warranty is not applicable if damage is a result of a flood,
                    lightning, fire, wind, or any other acts of nature.
                  </li>
                  <li>
                    Warranty is not applicable if damage or failure is a result
                    of installation in a chemically corrosive environment.
                  </li>
                  <li>
                    Warranty is not applicable if damage or failure is a result
                    of improper matching of product components.
                  </li>
                  <li>
                    Warranty is not applicable if damage or failure is a result
                    of improper sizing or design of the product.
                  </li>
                  <li>
                    Warranty is not applicable if damage or failure is a result
                    of inadequate air supply.
                  </li>
                  <li>
                    Warranty is not applicable if damage or failure is a result
                    of use of components or accessories not compatible with
                    products.
                  </li>
                  <li>
                    Any cost to replace, refill, or dispose of refrigerant,
                    including the cost of refrigerant, is not covered.
                  </li>
                  <li>
                    Warranty is not applicable if damage or failure is a result
                    of modification of or incorporation of installation into
                    other products.
                  </li>
                  <li>
                    Failure or damage to products during power failures, voltage
                    conditions, interruptions, blown fuses, open circuit
                    breakers, or incorrect/inadequate electrical service.
                  </li>
                  <li>
                    Property damage, personal injury, malfunction, or failure of
                    product as a result of accidents, misuse, abuse, negligence
                    by contractor or consumer.
                  </li>
                  <li>
                    Fault due to leaky, broken, restricted, frozen pipes and/or
                    restricted drain lines not covered under this warranty.
                  </li>
                  <li>
                    Damage as a result of failure to perform routine maintenance
                    as specified in the operator&apos;s manual is not covered
                    under this warranty.
                  </li>
                  <li>
                    Proof of purchase from Airtek/Gree must be provided to claim
                    any parts or labor.
                  </li>
                  <li>
                    Warranty is void if replacement parts are not supplied by
                    Airtek/Gree.
                  </li>
                  <li>
                    Accessories such as condensate pumps, line sets, and others
                    are not covered under this warranty.
                  </li>
                  <li>
                    Electricity or fuel costs, or increases in electricity or
                    fuel costs, including additional or unusual use of
                    supplemental electric heat, are not covered under this
                    warranty.
                  </li>
                  {/* Summarized Extended Warranty Section */}
                  <li>
                    <strong>Extended Warranties:</strong> Depending on your
                    location and purchase details, you may be eligible for
                    extended warranty options. Please refer to your receipt for
                    more information.
                  </li>
                </ul>
              </div>
              <br />
              <div>
                <label htmlFor="agreedToTerms">
                  <input
                    type="checkbox"
                    id="agreedToTerms"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleChange}
                    required
                  />
                  I&apos;ve read and agree with Terms of Service and Privacy
                  Policy.
                </label>
              </div>
              <br />
            </div>
            <div className="form-btn">
              <button
                className="pre-btn"
                type="button"
                onClick={handlePrevious}
              >
                Back
              </button>
              <button type="submit" className="next-btn" disabled={isDisabled}>
                Submit
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form
      className="flex flex-col h-screen items-center"
      onSubmit={handleSubmit}
    >
      {loading ? (
        <div className="loader-container">
          <style jsx>{`
            .loader {
              border: 16px solid #f3f3f3;
              border-top: 16px solid #182887;
              border-radius: 50%;
              width: 120px;
              height: 120px;
              animation: spin 2s linear infinite;
              margin: auto;
            }

            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
          <div className="loader"></div>
        </div>
      ) : (
        renderForm()
      )}
    </form>
  );
};

export default WarrantyForm;
