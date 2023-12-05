"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormData } from "@/types";
import model from "../warranty/sku";
import Box from "@mui/material/Box";

import { AutocompleteInputChangeReason } from "@mui/material";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import Controls from "../warranty/Controls";

import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Part, NewItem, claimFormDataType, errorType } from "@/types";

const WarrantyClaimForm = () => {
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false);
  const emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const [registeredSerialNumber, setRegisteredSerialNumber] = useState<
    { _id: string; serialNumber: string }[]
  >([]);

  const [part, setPart] = useState<Part>({
    _id: "",
    defectivePart: "",
    defectDate: dayjs(),
    replacDate: dayjs(),
  });

  const [newItem, setNewItem] = useState<NewItem>({
    id: "",
    model: "",
    serialNumber: "",
    installationDate: dayjs(),
    invoice: "",
    parts: [part],
  });

  const [claimFormData, setClaimFormData] = useState<claimFormDataType>({
    contractor: "",
    contactPerson: "",
    email: "",
    streetAddress: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    phone: "",
    ownerExtension: "",
    shipment: "",
    extension: "",
    owner: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerAddress: "",
    ownerCity: "",
    ownerProvince: "",
    ownerPone: "",
    ownerPostalCode: "",
    items: [],
    explanation: "",
  });

  const [errors, setErrors] = useState<errorType>({
    contractor: "",
    contactPerson: "",
    email: "",
    streetAddress: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    phone: "",
    shipment: "",
    extension: "",
    owner: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerExtension: "",
    ownerAddress: "",
    ownerCity: "",
    ownerProvince: "",
    ownerPone: "",
    ownerPostalCode: "",
    model: "",
    serialNumber: "",
    invoice: "",
    explanation: "",
    defectivePart: "",
    defectDate: dayjs(),
    replacDate: dayjs(),
  });

  const [loading, setLoading] = useState(false);
  const [emptyUnitInfo, setEmptyUnitInfo] = useState(false);

  const filterSerialNumbers = (
    inputArray: FormData[]
  ): { _id: string; serialNumber: string }[] => {
    const resultArray: { _id: string; serialNumber: string }[] = [];

    inputArray.forEach((obj: FormData) => {
      const items = obj.items;
      items.forEach(({ id, serialNumber }) =>
        resultArray.push({
          _id: id,
          serialNumber,
        })
      );
    });

    return resultArray;
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const firstResponse = await fetch(
          "https://airtek-warranty.onrender.com/warranties"
        );
        const WarrantyRegistered = await firstResponse.json();
        const serialNumbers = filterSerialNumbers(WarrantyRegistered);
        // console.log(serialNumbers);

        setRegisteredSerialNumber(serialNumbers);
      } catch (error) {
        console.error("Error fetching serial number data:", error);
      }
    };

    fetchData();
  }, []);

  const skuFilterOptions = createFilterOptions<{ model: string }>({
    matchFrom: "any",
    limit: 10,
  });

  const filterOptions = createFilterOptions<{
    _id: string;
    serialNumber: string;
  }>({
    matchFrom: "any",
    limit: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    validateChange: boolean | string = false
  ) => {
    validateChange = true;

    const { name, value } = e.target;

    setClaimFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (validateChange) {
      validate({ [name]: value });
    }
  };

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
  };

  const dateOnChange = (date: Dayjs | null) => {
    const dayjsDate = date ? dayjs(date) : null;

    setNewItem((prevData) => ({
      ...prevData,
      installationDate: dayjsDate,
    }));
  };

  const defectivePartOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    console.log(value);

    setPart((prevData) => ({
      ...prevData,
      defectivePart: value,
    }));

    console.log(part);
  };

  const defectDateOnChange = (date: Dayjs | null) => {
    const dayjsDate = date ? dayjs(date) : null;

    setPart((prevData) => ({
      ...prevData,
      defectDate: dayjsDate,
    }));
  };

  const replacDateOnChange = (date: Dayjs | null) => {
    const dayjsDate = date ? dayjs(date) : null;

    setPart((prevData) => ({
      ...prevData,
      replacDate: dayjsDate,
    }));
  };

  const invoiceOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setNewItem((prevData) => ({
      ...prevData,
      invoice: value,
    }));
  };

  const handleAddItem = () => {
    const serialNumberExists = claimFormData.items.some(
      (item) =>
        item.serialNumber.toLowerCase() === newItem.serialNumber.toLowerCase()
    );

    if (!validateModel() || !validateSerialNumber()) {
      return;
    }

    setEmptyUnitInfo(false);

    setErrors((prevErrors) => ({
      ...prevErrors,
      model: "",
      serialNumber: "",
      installationDate: "",
    }));

    setClaimFormData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        {
          ...newItem,
          id: Date.now(),
          parts: [part], // Add a new part array for the new item
        },
      ],
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      model: "",
      serialNumber: "",
      installationDate: "",
    }));
  };

  const textAreaOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setClaimFormData((prevData) => ({
      ...prevData,
      explanation: event.target.value,
    }));
  };

  const SerialNumberOnChange = (
    event: React.ChangeEvent<{}>,
    value: string | { _id: string; serialNumber: string },
    reason: AutocompleteInputChangeReason
  ) => {
    if (typeof value === "string") {
      setNewItem((prevData) => ({
        ...prevData,
        serialNumber: value,
      }));
      if (value.trim() !== "") {
        // Validate only when the input is not empty
        validateSerialNumber({ serialNumber: value });
      }
    }
  };

  const validate = (
    fieldValues: Partial<claimFormDataType> = claimFormData
  ) => {
    if ("firstName" in fieldValues)
      errors.contractor = fieldValues.contractor
        ? ""
        : "This field is required.";
    if ("lastName" in fieldValues)
      errors.contactPerson = fieldValues.contactPerson
        ? ""
        : "This field is required.";
    if ("email" in fieldValues)
      errors.email = emailValidate.test(fieldValues.email ?? "")
        ? ""
        : "Email is not valid.";
    if ("phone" in fieldValues)
      errors.phone =
        fieldValues.phone ?? "".length > 9
          ? ""
          : "Minimum 10 numbers required.";
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
    if ("owner" in fieldValues)
      errors.owner =
        fieldValues.owner ?? "".length != 0 ? "" : "This field is required.";
    if ("ownerEmail" in fieldValues)
      errors.ownerEmail = emailValidate.test(fieldValues.ownerEmail ?? "")
        ? ""
        : "Email is not valid.";
    if ("ownerPhone" in fieldValues)
      errors.ownerPhone =
        fieldValues.ownerPhone ?? "".length > 9
          ? ""
          : "Minimum 10 numbers required.";
    if ("ownerAddress" in fieldValues)
      errors.ownerAddress =
        fieldValues.ownerAddress ?? "".length != 0
          ? ""
          : "This field is required.";
    if ("ownerCity" in fieldValues)
      errors.ownerCity =
        fieldValues.ownerCity ?? "".length != 0
          ? ""
          : "This field is required.";
    if ("ownerProvince" in fieldValues)
      errors.ownerProvince =
        fieldValues.ownerProvince ?? "".length != 0
          ? ""
          : "This field is required.";

    if ("ownerPone" in fieldValues)
      errors.ownerPone =
        fieldValues.ownerPone ?? "".length > 9 ? "" : "This field is required.";

    if ("ownerPostalCode" in fieldValues)
      errors.ownerPostalCode =
        fieldValues.ownerPostalCode ?? "".length != 0
          ? ""
          : "This field is required.";

    setErrors({
      ...errors,
    });
  };

  const modelStrings = model.map((item) => item.model.toLowerCase()); //same with serialNumber

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
      return modelExists;
    }
  };

  const validateSerialNumber = (fieldValues: Partial<NewItem> = newItem) => {
    const serialNumber = fieldValues.serialNumber ?? "";
    const registeredSerialNumberOnly = registeredSerialNumber.map(
      (item) => item.serialNumber
    );
    const serialNumberExists =
      registeredSerialNumberOnly.includes(serialNumber);

    // Set the errors in the state
    setErrors((prevErrors) => ({
      ...prevErrors,
      serialNumber: serialNumberExists ? "" : "Unregistered Serial Number.",
    }));

    // Return true or false based on the validation
    if (fieldValues === newItem) {
      if (!serialNumberExists) {
        return false; // Validation failed
      }
      return serialNumberExists;
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setClaimFormData((prevData) => ({
      ...prevData,
      items: prevData.items.filter((item) => item.id !== itemId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (claimFormData.items.length === 0) {
      setLoading(false);
      setEmptyUnitInfo(true);
      return;
    }

    try {
      const response = await fetch(
        `https://airtek-warranty.onrender.com/warranty-claim`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(claimFormData),
        }
      );

      if (response.ok) {
        const responseText = await response.text();
        setLoading(false);
        console.log(claimFormData);

        router.push("warranty-claim/thank-you");
        // console.log(responseText);
        setIsDisabled(false);
      } else {
        throw new Error("Error: " + response.status);
      }
    } catch (error) {
      router.push("warranty-claim/error");
      // console.error(error);
      setIsDisabled(false);
    }
  };

  const renderForm = () => {
    return (
      <div className="flex flex-col h-screen items-center">
        <p className="title">Warranty Claim Request</p>

        <Box
          component="div"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
        >
          <div>
            <p className="title">Contractor Information</p>
            <Controls
              error={errors.contractor}
              type="text"
              label="Contractor"
              name="contractor"
              size="small"
              value={claimFormData.contractor}
              onChange={handleChange}
              required
            />

            <Controls
              error={errors.contactPerson}
              type="text"
              label="Contact Person"
              name="contactPerson"
              size="small"
              value={claimFormData.contactPerson}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Controls
              error={errors.email}
              required
              type="text"
              name="email"
              label="Email"
              size="small"
              value={claimFormData.email}
              onChange={handleChange}
            />

            <Controls
              error={errors.streetAddress}
              type="text"
              name="streetAddress"
              label="Street Address"
              size="small"
              value={claimFormData.streetAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Controls
              error={errors.city}
              type="text"
              name="city"
              label="City"
              size="small"
              value={claimFormData.city}
              onChange={handleChange}
              required
            />

            <Controls
              error={errors.stateProvince}
              type="text"
              name="stateProvince"
              label="State / Province"
              size="small"
              value={claimFormData.stateProvince}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Controls
              error={errors.postalCode}
              type="text"
              name="postalCode"
              label="Postal / Zip code"
              size="small"
              value={claimFormData.postalCode}
              onChange={handleChange}
              required
            />

            <Controls
              error={errors.phone}
              type="text"
              name="phone"
              label="Office Phone"
              size="small"
              value={claimFormData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Controls
              type="text"
              name="extension"
              label="Ext"
              size="small"
              value={claimFormData.extension || ""}
              onChange={handleChange}
              required={false}
            />
            {/* <Controls
              error={errors.shipment}
              type="text"
              name="shipment"
              label="Return shipped to"
              size="small"
              value={claimFormData.shipment}
              onChange={handleChange}
              required={false}
            /> */}
          </div>
          <div>
            <p className="title">Owner Information</p>
            <Controls
              error={errors.owner}
              type="text"
              name="owner"
              label="Owner"
              size="small"
              value={claimFormData.owner}
              onChange={handleChange}
              required
            />

            <Controls
              error={errors.ownerEmail}
              type="email"
              name="ownerEmail"
              label="Owner Email"
              size="small"
              value={claimFormData.ownerEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Controls
              error={errors.ownerPhone}
              type="text"
              name="ownerPhone"
              label="Owner Phone"
              size="small"
              value={claimFormData.ownerPhone}
              onChange={handleChange}
              required
            />

            <Controls
              type="text"
              name="ownerExtension"
              label="Ext"
              size="small"
              value={claimFormData.ownerExtension || ""}
              onChange={handleChange}
              required={false}
            />
          </div>
          <div>
            <Controls
              error={errors.ownerAddress}
              type="text"
              name="ownerAddress"
              label="Owner Address"
              size="small"
              value={claimFormData.ownerAddress}
              onChange={handleChange}
              required
            />

            <Controls
              error={errors.ownerCity}
              type="text"
              name="ownerCity"
              label="Owner City"
              size="small"
              value={claimFormData.ownerCity}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Controls
              error={errors.ownerProvince}
              type="text"
              name="ownerProvince"
              label="Owner Province"
              size="small"
              value={claimFormData.ownerProvince}
              onChange={handleChange}
              required
            />

            <Controls
              error={errors.ownerPostalCode}
              type="text"
              name="ownerPostalCode"
              label="Owner PostalCode"
              size="small"
              value={claimFormData.ownerPostalCode}
              onChange={handleChange}
              required
            />
          </div>
          <p className="title">Units Information</p>
        </Box>

        {emptyUnitInfo ? (
          <p style={{ color: "#d32f2f" }}>Please enter Unit Information</p>
        ) : (
          ""
        )}
        {/* <Grid container spacing={3}>
          <Grid item xs={6} md={3}> */}
        <Box
          component="div"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
                  label="Model Number"
                  size="small"
                  error={errors.model ? true : false}
                  helperText={errors.model}
                  name="model"
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
              )}
            />
            {/* </Grid>
          <Grid item xs={6} md={3}> */}
            <Autocomplete
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              filterOptions={filterOptions}
              options={registeredSerialNumber}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.serialNumber
              }
              onInputChange={SerialNumberOnChange}
              value={newItem.serialNumber}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option._id}>
                    {option.serialNumber}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  type="text"
                  label="Serial Number"
                  size="small"
                  error={errors.serialNumber ? true : false}
                  name="serialNumber"
                  helperText={errors.serialNumber}
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
              )}
            />
          </div>
          {/* </Grid>
          <Grid item xs={12} md={3}> */}
          <DatePicker
            label="Installation Date"
            slotProps={{ textField: { size: "small" } }}
            value={newItem.installationDate}
            onChange={dateOnChange}
          />
        </Box>
        <p className="title">Returned Part Information</p>
        <Box
          component="div"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
        >
          <div>
            <Controls
              error={errors.defectivePart}
              type="text"
              label="Defective Part"
              name="defectivePart"
              size="small"
              value={part.defectivePart}
              onChange={defectivePartOnChange}
              required
            />

            <DatePicker
              label="Defect Date"
              slotProps={{ textField: { size: "small" } }}
              value={part.defectDate}
              onChange={defectDateOnChange}
            />
          </div>
          <div>
            <DatePicker
              label="Replac. Date"
              slotProps={{ textField: { size: "small" } }}
              value={part.replacDate}
              onChange={replacDateOnChange}
            />

            <Controls
              error={errors.invoice}
              type="text"
              name="invoice"
              label="Purchase Invoice no."
              size="small"
              value={newItem.invoice || ''}
              onChange={invoiceOnChange}
              required={false}
            />
          </div>
          {/* </Grid> */}

          {/* <Grid item xs={12} md={3}> */}
          <div className="form-btn">
            <button type="button" className="list-btn" onClick={handleAddItem}>
              Add Item
            </button>
          </div>
        </Box>
        {/* </Grid> */}
        {/* <Grid item xs={12} md={12} alignItems="center"> */}
        {claimFormData.items.length > 0 && (
          <div>
            {claimFormData.items.map((item) => (
              <List
                dense
                sx={{ width: "100%", border: "solid 1px #e9e9e9" }}
                key={item.id}
              >
                <ListItem>
                  <ListItemText primary={`Model: ${item.model}`} />
                  <ListItemText
                    primary={`Serial Number: ${item.serialNumber}`}
                  />
                  <ListItemText
                    primary={`Installation Date: ${item.installationDate?.format(
                      "MM/DD/YYYY"
                    )}`}
                  />
                  {item.parts?.map((part) => (
                    <List
                      dense
                      sx={{ width: "100%", border: "solid 1px #e9e9e9" }}
                      key={part._id}
                    >
                      <ListItem>
                        <ListItemText
                          primary={`Defective Part: ${part.defectivePart}`}
                        />
                        <ListItemText
                          primary={`Defect Date: ${part.defectDate?.format(
                            "MM/DD/YYYY"
                          )}`}
                        />
                        <ListItemText
                          primary={`Replace Date: ${part.replacDate?.format(
                            "MM/DD/YYYY"
                          )}`}
                        />
                      </ListItem>
                    </List>
                  ))}

                  <ListItemIcon>
                    <DeleteIcon
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                    ></DeleteIcon>
                  </ListItemIcon>
                </ListItem>
              </List>
            ))}
          </div>
        )}
        {/* </Grid> */}
        {/* </Grid> */}

        <Box
          component="div"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
        >
          <div>
            <TextareaAutosize
              minRows={3}
              name="explanation"
              placeholder="Explanation of Defect..."
              value={claimFormData.explanation}
              onChange={textAreaOnChange}
              style={{
                width: "27rem",
                minHeight: "3rem",
                padding: "8px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>
        </Box>
        <div className="form-btn">
          <button type="submit" className="next-btn" disabled={isDisabled}>
            Submit
          </button>
        </div>
      </div>
    );
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

export default WarrantyClaimForm;
