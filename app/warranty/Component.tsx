"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";

import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import Controls from "./Controls";

import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
const url = process.env.SUB_URL;

const WarrantyForm = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [errors, setErrors] = useState<Temp>({
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
    dealerName: "",
    dealerEmail: "",
    dealerPhone: "",
    dealerAddress: "",
    model: "",
    serialNumber: "",
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const [stepFourError, setStepFourError] = useState(false);

  interface ComType {
    installType: string;
    firstName: string;
    lastName: string;
    email: string;
    streetAddress: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    phone: string;
    dealerName: string;
    dealerEmail: string;
    dealerPhone: string;
    dealerAddress: string;
  }

  interface Temp extends ComType {
    model: string;
    serialNumber: string;
  }

  interface NewItem {
    id: any;
    model: string;
    serialNumber: string;
    installationDate: Dayjs | null;
  }

  interface FormData extends ComType {
    extension?: string;
    items: NewItem[];
    agreedToTerms: boolean;
  }

  const [newItem, setNewItem] = useState<NewItem>({
    id: "",
    model: "",
    serialNumber: "",
    installationDate: dayjs("2023-05-17"),
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
    country: "",
    phone: "",
    extension: "",
    dealerName: "",
    dealerEmail: "",
    dealerPhone: "",
    dealerAddress: "",
    items: [],
    agreedToTerms: false,
  });

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

    setErrors({
      ...errors,
    });

    if (fieldValues == formData)
      return Object.values(errors).every((x) => x == "");
  };

  const validateItems = (fieldValues: Partial<NewItem> = newItem) => {
    if ("model" in fieldValues)
      errors.model = fieldValues.model ? "" : "This field is required.";
    if ("serialNumber" in fieldValues)
      errors.serialNumber = fieldValues.serialNumber
        ? ""
        : "This field is required.";

    setErrors({
      ...errors,
      model: errors.model,
      serialNumber: errors.serialNumber,
    });
    if (fieldValues == newItem)
      return Object.values(errors).every((x) => x == "");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    validateChange: boolean | string = false
  ) => {
    validateChange = true;

    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (validateChange) {
      validateType({ [name]: value });
      validate({ [name]: value });
    }
  };

  const itemsOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    validateChange: boolean | string = false
  ) => {
    validateChange = true;
    const { name, value } = e.target;

    setNewItem((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (validateChange) {
      validateItems({ [name]: value });
      setStepFourError(false);
    }
  };

  const dateOnChange = (date: Dayjs | null) => {
    const dayjsDate = date ? dayjs(date) : null;

    setNewItem((prevData) => ({
      ...prevData,
      installationDate: dayjsDate,
    }));
  };

  const handleAddItem = () => {
    if (!validateItems()) {
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

    setNewItem({
      id: null,
      model: "",
      serialNumber: "",
      installationDate: dayjs("2023-05-17"),
    });
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
    await fetch(`https://warranty-server.onrender.com/warranty-register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(function (response) {
        if (response.ok) {
          return response.text();
        }
        throw new Error("Error: " + response.status);
      })
      .then(function (responseText) {
        setLoading(true);
        router.push("warranty/thank-you");
        console.log(responseText);
        setIsDisabled(false);
      })
      .catch(function (error) {
        router.push("warranty/error");
        console.error(error);
        setIsDisabled(false);
      });
  };

  const handleNext = () => {
    const currentStep = Number(searchParams.get("step")) || 1;

    if (currentStep === 2 && formData.installType.length == 0) {
      validateType();
      console.log(errors);
      return;
    } else if (currentStep === 3 && !validate()) {
      console.log(errors);
      return;
    } else if (currentStep === 4 && formData.items.length == 0) {
      setStepFourError(true);
      console.log(errors);
      return;
    }

    console.log(errors);
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
          <div className="container">
            <div className="form-content">
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
          <div className="container">
            <div className="form-content">
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
          <div className="container">
            <p className="title">Equipment Owner Information</p>

            <Box
              component="div"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
            >
              <div>
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
              <div>
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
              <div>
                <Controls
                  error={errors.city}
                  type="text"
                  name="city"
                  label="City"
                  size="small"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />

                <Controls
                  error={errors.stateProvince}
                  type="text"
                  name="stateProvince"
                  label="State / Province"
                  size="small"
                  value={formData.stateProvince}
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
              <div>
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
              <div>
                <Controls
                  error={errors.dealerName}
                  type="text"
                  name="dealerName"
                  label="Dealer Name"
                  size="small"
                  value={formData.dealerName}
                  onChange={handleChange}
                  required
                />

                <Controls
                  error={errors.dealerEmail}
                  type="email"
                  name="dealerEmail"
                  label="Dealer Email"
                  size="small"
                  value={formData.dealerEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Controls
                  error={errors.dealerPhone}
                  type="text"
                  name="dealerPhone"
                  label="Dealer Phone"
                  size="small"
                  value={formData.dealerPhone}
                  onChange={handleChange}
                  required
                />

                <Controls
                  error={errors.dealerAddress}
                  type="text"
                  name="dealerAddress"
                  label="Dealer Address"
                  size="small"
                  value={formData.dealerAddress}
                  onChange={handleChange}
                  required
                />
              </div>
            </Box>
            <br />
            <br />
            <div className="form-btn">
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
          <div className="container">
            <div className="form-content">
              <p className="title">Tell Us About The Installation</p>
              <div style={{ color: "#d32f2f" }}>
                {stepFourError
                  ? "Please provide the necessary details or information."
                  : ""}
              </div>
              <Box
                component="div"
                sx={{
                  "& .MuiTextField-root": { m: 1, width: "20ch" },
                }}
              >
                <div>
                  <Controls
                    type="text"
                    name="model"
                    label="Model"
                    size="small"
                    value={newItem.model}
                    onChange={itemsOnChange}
                    error={errors.model}
                    required
                  />
                  <Controls
                    type="text"
                    label="Serial Number"
                    name="serialNumber"
                    size="small"
                    value={newItem.serialNumber}
                    onChange={itemsOnChange}
                    error={errors.serialNumber}
                    required
                  />

                  {/* <DemoContainer components={["DatePicker", "DatePicker"]}> */}
                  <DatePicker
                    label="Installation Date"
                    slotProps={{ textField: { size: "small" } }}
                    value={newItem.installationDate}
                    onChange={dateOnChange}
                  />
                  {/* </DemoContainer> */}
                  <button
                    type="button"
                    className="list-btn"
                    onClick={handleAddItem}
                  >
                    Add Item
                  </button>
                </div>
              </Box>
              {formData.items.length > 0 && (
                <div>
                  {formData.items.map((item) => (
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
            </div>
            <br />
            <br />
            <div className=".form-btn">
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
      case 5:
        return (
          <div className="container">
            <div className="form-content">
              <p className="title">Confirmation</p>
              <p>
                We offer a comprehensive warranty for their products, covering
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
                    A warranty period of ten (10) years on compressor to the
                    original registered owner.
                  </li>
                  <li>
                    A warranty period of five (5) years on compressor & all
                    parts for PTAC to the original registered owner.
                  </li>
                  <li>
                    A warranty period of one (1) year on the remote control
                    provided with original equipment.
                  </li>
                  <li>
                    This warranty only applies to systems that have been
                    professionally installed by a certified & licensed
                    contractor. In accordance with all applicable building codes
                    and permits, installed via Airtek/Gree installation and
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
                    one (1) year from date of installation.
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
                    of Improper matching of Product components.
                  </li>
                  <li>
                    Warranty is not applicable if damage or failure is a result
                    of Improper sizing or design of product.
                  </li>
                  <li>
                    Warranty is not applicable if damage or failure is a result
                    of Inadequate Air Supply.
                  </li>
                  <li>
                    Warranty is not applicable if damage or failure is a result
                    of use of components or accessories not compatible with
                    products.
                  </li>
                  <li>
                    Any cost to replace, refill or dispose of refrigerant,
                    including the cost of refrigerant is not covered.
                  </li>
                  <li>
                    Warranty is not applicable if damage or failure is a result
                    of Modification of or incorporation of installation into
                    other products.
                  </li>
                  <li>
                    Failure or damage to products during power failures, voltage
                    conditions, interruptions, blown fuses, open circuit
                    breakers, or incorrect/inadequate electrical service.
                  </li>
                  <li>
                    Property damage, personal injury, malfunction, or failure of
                    product by a result of accidents, misuse, abuse, negligence
                    by contractor or consumer.
                  </li>
                  <li>
                    Fault due to leaky, broken, restricted, frozen pipes and or
                    restricted drain lines not covered under this warranty.
                  </li>
                  <li>
                    Damage as a result from failure to perform routine
                    maintenance as specified in the operator’s manual is not
                    covered under this warranty.
                  </li>
                  <li>
                    Proof of purchase from Airtek/Gree must be provided to claim
                    for any parts or labour.
                  </li>
                  <li>
                    Warranty void if replacement parts are not supplied by
                    Airtek/Gree.
                  </li>
                  <li>
                    Accessories such as condensate pumps, line sets and others
                    are not covered under this warranty.
                  </li>
                  <li>
                    Electricity or fuel costs, or increases in electricity or
                    fuel costs, including additional or unusual use of
                    supplemental electric heat is not covered under this
                    warranty.
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
            <div className=".form-btn">
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
    <form onSubmit={handleSubmit}>
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
