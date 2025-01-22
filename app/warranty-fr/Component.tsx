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

    const formDataWithLanguage = {
      ...formData,
      language: "french", // Identifier for the backend
    };

    await fetch(
      `https://airtek-warranty.onrender.com/warranties/warranty-register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithLanguage),
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
        router.push("warranty-fr/thank-you");
        // console.log(responseText);
        setIsDisabled(false);
      })
      .catch(function (error) {
        router.push("warranty-fr/error");
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
    router.push(`/warranty-fr?step=${currentStep + 1}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePrevious = () => {
    const currentStep = Number(searchParams.get("step")) || 1;
    router.push(`/warranty-fr?step=${currentStep - 1}`);
  };

  const renderForm = () => {
    const currentStep = Number(searchParams.get("step")) || 1;

    switch (currentStep) {
      case 1:
        return (
          <div className="w-full flex flex-col justify-center items-center">
            <div className="form-content w-1/2">
              <p className="title">
                Airtek/Gree représente bien plus que du HVAC. Cela incarne un
                engagement.
              </p>
              <br />
              <p>
                Gree transcende le domaine du HVAC et incarne un engagement
                ferme. Nous croyons fermement que le fondement d&apos;une maison
                saine et confortable réside dans la qualité de l&apos;air que
                nous respirons. Depuis notre création, notre dévouement
                inébranlable à la perfection de la qualité de l&apos;air a été
                le catalyseur de chaque innovation que nous avons introduite.
              </p>
              <p>
                Gree révolutionne l&apos;air, le rendant plus frais, plus chaud,
                plus sec, plus propre et, en fin de compte, meilleur grâce à nos
                systèmes exceptionnels. Nos solutions premium, primées, sont
                reconnues pour leur efficacité exceptionnelle et leur
                fonctionnement silencieux, établissant de nouvelles normes dans
                l&apos;industrie.
              </p>
              <p>
                Pour les applications résidentielles, nous offrons une gamme
                d&apos;options de couverture, y compris la possibilité
                d&apos;étendre la couverture des pièces et de la
                main-d&apos;œuvre grâce à nos partenaires de confiance. En
                complétant l&apos;enregistrement de garantie pour votre nouvel
                équipement Gree, vous accédez à nos options de couverture
                leaders dans l&apos;industrie exclusivement disponibles pour les
                propriétaires Gree. Vous pouvez trouver une liste des produits
                éligibles sur notre site web.
              </p>
              <p>
                Pour commencer le processus d&apos;enregistrement, veuillez
                rassembler les informations suivantes :
              </p>
              <div className="list">
                <ul>
                  <li>
                    Numéro de série et numéro de modèle pour chaque pièce
                    d&apos;équipement que vous avez achetée.
                  </li>
                  <li>
                    Pour les emplacements existants, la date d&apos;installation
                    ; pour les nouvelles constructions, la date de clôture.
                  </li>
                  <li>
                    Une adresse e-mail pour recevoir la confirmation de votre
                    choix de couverture.
                  </li>
                  <li>
                    Si vous êtes un revendeur, veuillez fournir votre numéro de
                    client.
                  </li>
                  <li>
                    Si votre équipement est éligible pour une garantie limitée
                    prolongée, nous pourrions également demander des détails sur
                    tout accessoire supplémentaire acheté pour votre système, y
                    compris leur numéro de série, numéro de modèle et marque.
                  </li>
                </ul>
              </div>
              <br />
              <p>
                Notre engagement envers votre satisfaction et la fourniture
                d&apos;une couverture de garantie complète est inébranlable.
                Chez Gree, nous nous efforçons de vous apporter la tranquillité
                d&apos;esprit en garantissant un service et un soutien
                exceptionnels tout au long de votre expérience de propriétaire.
              </p>
            </div>
            <div className="form-btn">
              <button type="button" className="next-btn" onClick={handleNext}>
                <span>Suivant</span>
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col justify-center items-center">
            <div className="w-full form-content">
              <p className="title">
                Dites-nous à propos de l&apos;installation
              </p>
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
                  L&apos;équipement est installé dans un :
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-error-radios"
                  name="installType"
                  value={formData.installType}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Maison existante"
                    control={
                      <Radio
                        sx={{
                          "&.Mui-checked": {
                            color: "#182887",
                          },
                        }}
                      />
                    }
                    label="Maison existante"
                  />
                  <FormControlLabel
                    value="Maison nouvellement construite"
                    control={
                      <Radio
                        sx={{
                          "&.Mui-checked": {
                            color: "#182887",
                          },
                        }}
                      />
                    }
                    label="Maison nouvellement construite"
                  />
                  <FormControlLabel
                    value="Construction commerciale existante et nouvelle"
                    control={
                      <Radio
                        sx={{
                          "&.Mui-checked": {
                            color: "#182887",
                          },
                        }}
                      />
                    }
                    label="Construction commerciale existante et nouvelle"
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
                Retour
              </button>
              <button type="button" className="next-btn" onClick={handleNext}>
                <span>Suivant</span>
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <p className="title">Informations sur le propriétaire</p>
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
                  label="ID du revendeur"
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
                  label="Prénom"
                  name="firstName"
                  size="small"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Controls
                  error={errors.lastName}
                  type="text"
                  label="Nom"
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
                  label="Adresse"
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
                      label="Recherche ou saisie de la ville"
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
                  label="Code postal / Zip"
                  size="small"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
                <Controls
                  error={errors.country}
                  type="text"
                  name="country"
                  label="Pays"
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
                  label="Téléphone"
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
                Retour
              </button>
              <button type="button" className="next-btn" onClick={handleNext}>
                Suivant
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="w-full sm:w-2/4">
            <div className="w-full flex flex-col justify-center items-center">
              <Grid
                container
                spacing={2} // Uniform spacing between grid items
                alignItems="center"
                className="w-full sm:w-4/5"
              >
                {/* Title & Intro */}
                <Grid item xs={12}>
                  <p className="title">
                    Dites-nous à propos de l&apos;installation
                  </p>
                  <p>
                    Si vos bobines sont de marque Aspen, inutile de vous
                    enregistrer en ligne ; apportez-les simplement à notre
                    entrepôt.
                  </p>
                  <div style={{ color: "#d32f2f" }}>
                    {stepFourError
                      ? "Veuillez fournir les détails ou informations nécessaires."
                      : ""}
                  </div>
                </Grid>

                {/* Recherche de Modèle */}
                <Grid item xs={12} md={3}>
                  <Autocomplete
                    freeSolo
                    disableClearable
                    filterOptions={skuFilterOptions}
                    ListboxProps={{ style: { maxHeight: 150 } }}
                    options={model}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.model
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option.model}>
                        {option.model}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Recherchez un numéro de modèle *"
                        size="small"
                        name="model"
                        error={!!errors.model}
                        helperText={errors.model}
                        required
                        sx={{ width: "100%" }}
                        InputProps={{
                          ...params.InputProps,
                          type: "search",
                        }}
                      />
                    )}
                    onInputChange={modelOnChange}
                    value={newItem.model}
                    sx={{ width: "100%" }}
                  />
                </Grid>

                {/* Numéro de série */}
                <Grid item xs={12} md={3}>
                  <Controls
                    type="text"
                    label="Numéro de série *"
                    name="serialNumber"
                    size="small"
                    value={newItem.serialNumber}
                    onChange={adaptedSerialNumberOnChange}
                    error={errors.serialNumber}
                    required={true}
                    sx={{ width: "100%" }}
                  />
                </Grid>

                {/* Date d'installation */}
                <Grid item xs={12} md={3}>
                  <DatePicker
                    label="Date d'installation"
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: { width: "100%" },
                      },
                    }}
                    value={newItem.installationDate}
                    onChange={dateOnChange}
                  />
                </Grid>

                {/* Bouton Ajouter un article */}
                <Grid
                  item
                  xs={12}
                  md={3}
                  display="flex"
                  justifyContent="center"
                >
                  <button
                    type="button"
                    style={{
                      whiteSpace: "nowrap", // Empêche le texte de passer à la ligne
                      minWidth: "120px",
                      padding: "8px 16px",
                    }}
                    className="list-btn"
                    onClick={handleAddItem}
                  >
                    Ajouter un article
                  </button>
                </Grid>

                {/* Tableau des articles ajoutés */}
                <Grid item xs={12}>
                  {formData.items.length > 0 && (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Modèle</TableCell>
                          <TableCell>Numéro de série</TableCell>
                          <TableCell>Date d&apos;installation</TableCell>
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
              <Grid item xs={12} md={12}>
                <div className="w-full flex flex-row justify-center items-center">
                  <button
                    type="button"
                    className="pre-btn"
                    onClick={handlePrevious}
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    className="next-btn"
                    onClick={handleNext}
                  >
                    Suivant
                  </button>
                </div>
              </Grid>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="w-2/4 flex flex-col justify-center items-center">
            <div className="form-content w-4/5">
              <p className="serialNumber">Confirmation</p>
              <p>
                Nous offrons une garantie complète sur nos produits, couvrant
                les pannes résultant de défauts de matériaux et de fabrication
                dans des conditions d&apos;utilisation et d&apos;entretien
                normales. Les modalités et conditions de la garantie sont
                détaillées ci-dessous, toutes les périodes de garantie
                commençant à partir de la date de l&apos;installation, de la
                mise en service ou de la mise en fonctionnement initiale de
                l&apos;équipement. Veuillez noter que cette garantie est soumise
                aux dispositions, conditions, limitations et exclusions
                énumérées :
              </p>
              <div className="list">
                <ul>
                  <li>
                    Une période de garantie de dix (10) ans sur le compresseur
                    et toutes les pièces pour le propriétaire initial
                    enregistré.
                  </li>
                  <li>
                    Une période de garantie de cinq (5) ans sur le compresseur
                    et toutes les pièces du PTAC pour le propriétaire initial
                    enregistré.
                  </li>
                  <li>
                    Une période de garantie d&apos;un (1) an sur la télécommande
                    fournie avec l&apos;équipement d&apos;origine.
                  </li>
                  <li>
                    Cette garantie s&apos;applique uniquement aux systèmes
                    installés de manière professionnelle par un entrepreneur
                    certifié et agréé, conformément à tous les codes du bâtiment
                    et permis applicables, et conformément aux instructions
                    d&apos;installation et d&apos;utilisation Airtek/Gree.
                  </li>
                  <li>
                    Cette garantie s&apos;applique à tous les produits restant à
                    leur emplacement d&apos;installation d&apos;origine.
                  </li>
                  <li>
                    La garantie est annulée si la plaque d&apos;identification
                    du numéro de série du produit est retirée ou altérée au
                    point que l&apos;appareil ne puisse être identifié.
                  </li>
                  <li>
                    Les accessoires installés sur site ne sont couverts que pour
                    une période d&apos;un (1) an à partir de la date
                    d&apos;installation.
                  </li>
                  <li>
                    La garantie ne s&apos;applique pas si les dommages résultent
                    d&apos;une inondation, de la foudre, d&apos;un incendie, du
                    vent ou de tout autre événement naturel.
                  </li>
                  <li>
                    La garantie ne s&apos;applique pas si les dommages ou les
                    pannes résultent d&apos;une installation dans un
                    environnement chimiquement corrosif.
                  </li>
                  <li>
                    La garantie ne s&apos;applique pas si les dommages ou la
                    panne résultent d&apos;une incompatibilité entre les
                    composants du produit.
                  </li>
                  <li>
                    La garantie ne s&apos;applique pas si les dommages ou la
                    panne résultent d&apos;un dimensionnement ou d&apos;une
                    conception incorrecte du produit.
                  </li>
                  <li>
                    La garantie ne s&apos;applique pas si les dommages ou la
                    panne résultent d&apos;un apport d&apos;air inadéquat.
                  </li>
                  <li>
                    La garantie ne s&apos;applique pas si les dommages ou la
                    panne résultent de l&apos;utilisation de composants ou
                    d&apos;accessoires non compatibles avec les produits.
                  </li>
                  <li>
                    Tout coût lié au remplacement, au remplissage ou à
                    l&apos;élimination du réfrigérant, y compris le coût du
                    réfrigérant lui-même, n&apos;est pas couvert.
                  </li>
                  <li>
                    La garantie ne s&apos;applique pas si les dommages ou la
                    panne résultent de modifications ou de l&apos;incorporation
                    de l&apos;installation dans d&apos;autres produits.
                  </li>
                  <li>
                    Les pannes ou dommages survenant lors de coupures de
                    courant, de problèmes de tension, d&apos;interruptions, de
                    fusibles grillés, de disjoncteurs déclenchés ou de services
                    électriques incorrects/inadéquats ne sont pas couverts.
                  </li>
                  <li>
                    Les dommages matériels, les blessures corporelles, les
                    dysfonctionnements ou les pannes du produit résultant
                    d&apos;accidents, de mauvaise utilisation, d&apos;abus ou de
                    négligence de la part de l&apos;entrepreneur ou du
                    consommateur ne sont pas couverts.
                  </li>
                  <li>
                    Les défaillances causées par des canalisations fuies,
                    cassées, obstruées, gelées et/ou des conduites
                    d&apos;évacuation restreintes ne sont pas couvertes par
                    cette garantie.
                  </li>
                  <li>
                    Les dommages résultant du non-respect de l&apos;entretien
                    régulier tel que spécifié dans le manuel de
                    l&apos;utilisateur ne sont pas couverts par cette garantie.
                  </li>
                  <li>
                    Une preuve d&apos;achat auprès d&apos;Airtek/Gree doit être
                    fournie pour réclamer toute pièce ou main-d&apos;œuvre.
                  </li>
                  <li>
                    La garantie est annulée si les pièces de rechange ne sont
                    pas fournies par Airtek/Gree.
                  </li>
                  <li>
                    Les accessoires tels que les pompes à condensat, les
                    liaisons frigorifiques et autres ne sont pas couverts par
                    cette garantie.
                  </li>
                  <li>
                    Les coûts d&apos;électricité ou de carburant, ou
                    l&apos;augmentation de ces coûts, y compris
                    l&apos;utilisation additionnelle ou inhabituelle du
                    chauffage électrique d&apos;appoint, ne sont pas couverts
                    par cette garantie.
                  </li>
                  <li>
                    <strong>Garanties prolongées :</strong> Selon votre
                    emplacement et les détails de votre achat, vous pourriez
                    être admissible à des options de garantie prolongée.
                    Veuillez consulter votre reçu pour plus d&apos;informations.
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
                  J&apos;ai lu et j&apos;accepte les Conditions de Service et la
                  Politique de Confidentialité.
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
                Retour
              </button>
              <button type="submit" className="next-btn" disabled={isDisabled}>
                Soumettre
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
