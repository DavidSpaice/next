"use client";
import React, { useRef, useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import model from "../warranty/sku";
import { AutocompleteInputChangeReason } from "@mui/material";
import {
  Button,
  Box,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  TextField,
  Autocomplete,
  createFilterOptions,
  TextareaAutosize,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CldUploadWidget } from "next-cloudinary";
import { Part, NewItem, claimFormDataType, errorType } from "@/types";
import Controls from "../warranty/Controls";

interface CloudinaryUploadInfo {
  id: string;
  batchId: string;
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
  path: string;
  thumbnail_url: string;
}

interface CloudinaryUploadEvent {
  event?: string;
  info: CloudinaryUploadInfo;
}

const WarrantyClaimForm = () => {
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false);
  const [drainPanelCondition, setDrainPanelCondition] = useState("");

  const defectivePartInputRef = useRef<HTMLInputElement>(null);

  const [part, setPart] = useState<Part>({
    id: `${Date.now()}${Math.floor(Math.random() * 100000)}`,
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
    items: [],
    explanation: "",
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<errorType>({
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
  const skuFilterOptions = createFilterOptions<{ model: string }>({
    matchFrom: "any",
    limit: 10,
  });

  const drainPanelConditionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const condition = event.target.value;
    setDrainPanelCondition(condition);

    let defectivePartValue = "";
    if (condition === "leaking") {
      defectivePartValue = "Drain Panel Leaking";
    } else if (condition === "replacement") {
      defectivePartValue = "Drain Panel Replacement";
    }

    setPart((prevData) => ({
      ...prevData,
      defectivePart: defectivePartValue,
    }));
  };

  useEffect(() => {
    if (drainPanelCondition === "other" && defectivePartInputRef.current) {
      defectivePartInputRef.current.focus();
    }
  }, [drainPanelCondition]);

  const renderDrainPanelCondition = () => {
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">
          Is the drain panel part defective?
        </FormLabel>
        <RadioGroup
          row
          aria-label="drain-panel-condition"
          name="drain-panel-condition"
          value={drainPanelCondition}
          onChange={drainPanelConditionChange}
        >
          <FormControlLabel
            value="leaking"
            control={<Radio />}
            label="Drain Panel Leaking Check"
          />
          <FormControlLabel
            value="replacement"
            control={<Radio />}
            label="Drain Panel Replacement"
          />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </FormControl>
    );
  };

  const renderDefectivePartInput = () => {
    if (drainPanelCondition === "other") {
      return (
        <Controls
          error={errors.defectivePart}
          type="text"
          label="Defective Part"
          name="defectivePart"
          size="small"
          value={part.defectivePart}
          onChange={(event) => defectivePartOnChange(event)}
          required
          inputRef={defectivePartInputRef}
        />
      );
    } else {
      return (
        <TextField
          disabled
          label="Defective Part"
          size="small"
          value={part.defectivePart}
        />
      );
    }
  };

  const handleImageUploadSuccess = (data: CloudinaryUploadEvent) => {
    const imageUrl = data.info.secure_url;
    setImageUrls((prevUrls) => {
      if (prevUrls.length < 3) {
        return [...prevUrls, imageUrl];
      } else {
        console.log("Maximum of three images can be uploaded.");
        return prevUrls;
      }
    });
    setImagePreviews((prevPreviews) => {
      if (prevPreviews.length < 3) {
        return [...prevPreviews, imageUrl];
      } else {
        return prevPreviews;
      }
    });
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
    setPart((prevData) => ({
      ...prevData,
      defectivePart: value,
    }));
    if (value.trim() !== "") {
      validateDefectivePart({ defectivePart: value });
    }
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
    if (value.trim() !== "") {
      setNewItem((prevData) => ({
        ...prevData,
        invoice: value,
      }));
    }
  };

  const handleAddItem = async () => {
    const isModelValid = validateModel();
    const isSerialNumberValid = await validateSerialNumber();
    const isDefectivePart = validateDefectivePart();

    if (!isModelValid || !isSerialNumberValid || !isDefectivePart) {
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
          parts: [part],
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
    if (event.target.value.trim() !== "") {
      setClaimFormData((prevData) => ({
        ...prevData,
        explanation: event.target.value,
      }));
    }
  };

  const SerialNumberOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewItem((prevData) => ({
      ...prevData,
      serialNumber: value,
    }));
    if (value.trim() !== "") {
      validateSerialNumber({ serialNumber: value });
    }
  };

  const modelStrings = model.map((item) => item.model.toLowerCase());

  const validateModel = (fieldValues: Partial<NewItem> = newItem) => {
    const model = fieldValues.model ?? "";
    const modelExists = modelStrings.some(
      (item) => item === model.toLowerCase()
    );

    setErrors((prevErrors) => ({
      ...prevErrors,
      model: modelExists ? "" : "Invalid model.",
    }));

    if (fieldValues === newItem) {
      if (!modelExists) {
        return false;
      }
      return modelExists;
    }
  };

  const validateSerialNumber = async (
    fieldValues: Partial<NewItem> = newItem
  ) => {
    const serialNumber = fieldValues.serialNumber ?? "";
    if (!serialNumber) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        serialNumber: "Serial number is required.",
      }));
      return false;
    }

    try {
      const response = await fetch(
        "https://airtek-warranty.onrender.com/warranty-claim/check-serial-number",
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
            : "Not a Registered or a Claimed Serial Number.",
        }));

        return serialNumberExists;
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
      return false;
    }
  };

  const validateDefectivePart = (fieldValues: Partial<Part> = part) => {
    const defectivePart = fieldValues.defectivePart ?? "";
    if (!defectivePart) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        defectivePart: "Defective Part is required.",
      }));
      return false;
    }
    if (defectivePart.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        defectivePart: "Defective Part cannot be just whitespace.",
      }));
      return false;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      defectivePart: "",
    }));
    return true;
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

    if (imageUrls.length === 0) {
      alert("Please upload an image.");
      setLoading(false);
      return;
    }

    if (claimFormData.items.length === 0) {
      setLoading(false);
      setEmptyUnitInfo(true);
      return;
    }

    try {
      const response = await fetch(
        `https://airtek-warranty.onrender.com/warranty-claim/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...claimFormData,
            imageUrls,
          }),
        }
      );

      if (response.ok) {
        setLoading(false);
        router.push("warranty-claim/thank-you");
        setIsDisabled(false);
      } else {
        throw new Error("Error: " + response.status);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setLoading(false);
      router.push("warranty-claim/error");
      setIsDisabled(false);
    }
  };

  const renderForm = () => {
    return (
      <div className="flex flex-col h-screen items-center">
        <p className="title">Warranty Claim Request</p>

        <Box
          component="div"
          sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
        >
          <p className="title">Units Information</p>
          <div className="flex flex-col md:flex-row justify-center items-center">
            {emptyUnitInfo && (
              <p style={{ color: "#d32f2f" }}>
                Please click the &quot;Add Item&quot; button to add to the list
              </p>
            )}

            <Grid item xs={12} sm={6}>
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
                renderOption={(props, option) => (
                  <li {...props} key={option.model}>
                    {option.model}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    type="text"
                    label="Select a Model Number"
                    size="small"
                    error={!!errors.model}
                    helperText={errors.model}
                    name="model"
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controls
                error={errors.serialNumber}
                type="text"
                label="Serial Number"
                name="serialNumber"
                size="small"
                value={newItem.serialNumber}
                onChange={SerialNumberOnChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Installation Date"
                slotProps={{ textField: { size: "small" } }}
                value={newItem.installationDate}
                onChange={dateOnChange}
              />
            </Grid>
          </div>
        </Box>

        <p className="title">Max 3 Images, Including Serial Number</p>
        <Box>
          <CldUploadWidget
            uploadPreset="h74rzzu1"
            options={{ maxFiles: 3 }}
            onSuccess={(data: any) => handleImageUploadSuccess(data)}
          >
            {({ open }) => {
              return (
                <button
                  className="list-btn"
                  onClick={() => {
                    if (imageUrls.length < 3) {
                      open();
                    } else {
                      alert("You can only upload up to three images.");
                    }
                  }}
                  disabled={imageUrls.length >= 3}
                >
                  Upload an Image
                </button>
              );
            }}
          </CldUploadWidget>
        </Box>

        <Box>
          <div className="flex flex-row justify-center items-center">
            {imagePreviews.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index + 1}`}
                style={{ width: 100, height: 100, marginRight: 10 }}
              />
            ))}
          </div>
        </Box>

        <p className="title mt-2 mb-2">Returned Part Information</p>
        <Box
          component="div"
          sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
        >
          {renderDrainPanelCondition()}
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} sm={6}>
              {renderDefectivePartInput()}
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Defect Date"
                slotProps={{ textField: { size: "small" } }}
                value={part.defectDate}
                onChange={defectDateOnChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Replac. Date"
                slotProps={{ textField: { size: "small" } }}
                value={part.replacDate}
                onChange={replacDateOnChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controls
                error={errors.invoice}
                type="text"
                name="invoice"
                label="Purchase Invoice no."
                size="small"
                value={newItem.invoice || ""}
                onChange={invoiceOnChange}
                required={false}
              />
            </Grid>
          </Grid>

          <div className="form-btn flex flex-row justify-center items-center">
            <button
              className="list-btn"
              color="primary"
              onClick={handleAddItem}
            >
              Add Item
            </button>
          </div>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Model</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Installation Date</TableCell>
              <TableCell>Defective Part</TableCell>
              <TableCell>Defect Date</TableCell>
              <TableCell>Replace Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {claimFormData.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.serialNumber}</TableCell>
                <TableCell>
                  {item.installationDate?.format("MM/DD/YYYY")}
                </TableCell>
                {item.parts?.map((part, index) => (
                  <React.Fragment key={`${item.id}-${index}`}>
                    <TableCell>{part.defectivePart}</TableCell>
                    <TableCell>
                      {part.defectDate?.format("MM/DD/YYYY")}
                    </TableCell>
                    <TableCell>
                      {part.replacDate?.format("MM/DD/YYYY")}
                    </TableCell>
                  </React.Fragment>
                ))}
                <TableCell>
                  <IconButton onClick={() => handleDeleteItem(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box
          component="div"
          sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
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
          <button
            className="list-btn"
            type="submit"
            color="primary"
            disabled={isDisabled}
          >
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
