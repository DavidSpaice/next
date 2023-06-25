"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DeleteIcon from "@mui/icons-material/Delete";
import Controls from "./Controls";
import { TextField } from "@mui/material";
const url = process.env.SUB_URL;

const WarrantyForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [errors, setErrors] = useState<any>({});
  const [modelValidate, setModelValidate] = useState(false);
  const [radioValidate, setRadioValidate] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  interface ComType {
    firstName: string;
    lastName: string;
    email: string;
    streetAddress: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    phone: string;
    extension: string;
    dealerName: string;
    dealerEmail: string;
    dealerPhone: string;
    dealerAddress: string;
  }

  interface Temp extends ComType {}

  interface FormData extends ComType {
    installType: string;
    items: {
      id: any;
      model: string;
      serialNumber: string;
      installationDate: string;
    }[];
    agreedToTerms: boolean;
  }

  const [newItem, setNewItem] = useState({
    id: "",
    model: "",
    serialNumber: "",
    installationDate: "",
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

  let temp: Temp = {
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
  };

  const validate = (fieldValues = formData) => {
    temp = { ...errors };
    if ("firstName" in fieldValues)
      temp.firstName = fieldValues.firstName ? "" : "This field is required.";
    if ("lastName" in fieldValues)
      temp.lastName = fieldValues.lastName ? "" : "This field is required.";
    if ("email" in fieldValues)
      temp.email = emailValidate.test(fieldValues.email)
        ? ""
        : "Email is not valid.";
    if ("phone" in fieldValues)
      temp.phone =
        fieldValues.phone.length > 9 ? "" : "Minimum 10 numbers required.";
    if ("streetAddress" in fieldValues)
      temp.streetAddress =
        fieldValues.streetAddress.length != 0 ? "" : "This field is required.";
    if ("city" in fieldValues)
      temp.city = fieldValues.city.length != 0 ? "" : "This field is required.";
    if ("stateProvince" in fieldValues)
      temp.stateProvince =
        fieldValues.stateProvince.length != 0 ? "" : "This field is required.";
    if ("postalCode" in fieldValues)
      temp.postalCode =
        fieldValues.postalCode.length != 0 ? "" : "This field is required.";
    if ("country" in fieldValues)
      temp.country =
        fieldValues.country.length != 0 ? "" : "This field is required.";
    if ("dealerName" in fieldValues)
      temp.dealerName =
        fieldValues.dealerName.length != 0 ? "" : "This field is required.";
    if ("dealerEmail" in fieldValues)
      temp.dealerEmail = emailValidate.test(fieldValues.dealerEmail)
        ? ""
        : "Email is not valid.";
    if ("dealerPhone" in fieldValues)
      temp.dealerPhone =
        fieldValues.dealerPhone.length > 9
          ? ""
          : "Minimum 10 numbers required.";
    if ("dealerAddress" in fieldValues)
      temp.dealerAddress =
        fieldValues.dealerAddress.length != 0 ? "" : "This field is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues == formData)
      return Object.values(temp).every((x) => x == "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));
  };

  const handleAddItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      items: [...prevData.items, { ...newItem, id: Date.now() }],
    }));
    setNewItem({
      id: "",
      model: "",
      serialNumber: "",
      installationDate: "",
    });
  };

  const handleDeleteItem = (itemId: string) => {
    setFormData((prevData) => ({
      ...prevData,
      items: prevData.items.filter((item) => item.id !== itemId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsDisabled(true);
    e.preventDefault();
    await fetch(`${url}`, {
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

    if (currentStep === 2 && !formData.installType) {
      console.log("Please select an installation type.");
      setRadioValidate(true);
      return;
    } else if (currentStep === 3 && !validate()) {
      setRadioValidate(false);
      console.log(errors);
      return;
    } else if (
      currentStep === 4 &&
      formData.items.every((item) => item.model.length === 0 && item.serialNumber.length == 0 && item.installationDate.length == 0)
    ) {
      setModelValidate(true);
      return;
    }

    router.push(`/warranty?step=${currentStep + 1}`);
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
              <h2>
                Airtek/Gree represents more than just HVAC. It embodies a
                commitment.
              </h2>
              <br />
              <p>
                Gree transcends the realm of HVAC and embodies a steadfast
                commitment. We firmly believe that the foundation of a healthy
                and comfortable home lies within the quality of the air we
                breathe. Since our inception, our unwavering dedication to
                perfecting air quality has been the catalyst behind every
                innovation we have introduced.
              </p>
              <br />
              <p>
                Gree revolutionizes the air, making it cooler, warmer, drier,
                cleaner, and ultimately better through our exceptional systems.
                Our premium, award-winning solutions are renowned for their
                exceptional efficiency and whisper-quiet operation, setting new
                industry standards.
              </p>
              <br />
              <p>
                For residential applications, we offer a range of coverage
                options, including the opportunity to extend parts and labor
                coverage through our valued partners. By completing the warranty
                registration for your new Gree equipment, you unlock access to
                our industry-leading coverage options exclusively available to
                Gree owners. You can find a list of eligible products on our
                website.
              </p>
              <br />
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
              <h2>Tell Us About The Installation</h2>
              <h3>The equipment is installed in a:</h3>
              <p className="radio-text">{radioValidate ? "This field is required." : ""}</p>
              <label>
                
                <Radio
                  name="installType"
                  value="Existing Home"
                  checked={formData.installType === "Existing Home"}
                  onChange={handleChange}
                  required={true}
                />
                Existing Home
              </label>
              <br />
              <label>
                <Radio
                  name="installType"
                  value="Newly Constructed Home"
                  checked={formData.installType === "Newly Constructed Home"}
                  onChange={handleChange}
                  required={true}
                />
                Newly Constructed Home
              </label>
              <br />
              <label>
                <Radio
                  name="installType"
                  value="Commercial Existing and New Construction"
                  checked={
                    formData.installType ===
                    "Commercial Existing and New Construction"
                  }
                  onChange={handleChange}
                  required={true}
                />
                Commercial Existing and New Construction
              </label>
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
            <div className="form-content">
              <h2>Equipment Owner Information</h2>

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
                    autoFocus
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
                    value={formData.extension}
                    onChange={handleChange}
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
            </div>
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
              <h2>Tell Us About The Installation</h2>

              <Box
                component="div"
                sx={{
                  "& .MuiTextField-root": { m: 1, width: "25ch" },
                }}
              >
                <div>
                  <TextField
                    type="text"
                    name="model"
                    label="model"
                    size="small"
                    value={newItem.model}
                    onChange={(e) =>
                      setNewItem((prevItem) => ({
                        ...prevItem,
                        model: e.target.value,
                      }))
                    }
                    placeholder="Model"
                    error={modelValidate}
                    helperText={ modelValidate ? "This field is required." : ""}
                    required
                  />
                  <TextField
                    type="text"
                    label="Serial Number"
                    name="serialNumber"
                    size="small"
                    value={newItem.serialNumber}
                    onChange={(e) =>
                      setNewItem((prevItem) => ({
                        ...prevItem,
                        serialNumber: e.target.value,
                      }))
                    }
                    error={modelValidate}
                    helperText={ modelValidate ? "This field is required." : ""}
                    required
                  />

                  <input
                    type="date"
                    value={newItem.installationDate}
                    onChange={(e) =>
                      setNewItem((prevItem) => ({
                        ...prevItem,
                        installationDate: e.target.value,
                      }))
                    }
                  />

                  <button
                    type="button"
                    className="next-btn"
                    onClick={handleAddItem}
                  >
                    Add Item
                  </button>
                </div>
              </Box>
              {formData.items.length > 0 && (
                <ul>
                  {formData.items.map((item) => (
                    <List
                      dense
                      sx={{ width: "100%", border: "solid 1px #e9e9e9" }}
                      key={item.id}
                    >
                      <ListItem>
                        Model: {item.model}, Serial Number: {item.serialNumber},
                        Installation Date: {item.installationDate}
                        <DeleteIcon
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                        ></DeleteIcon>
                      </ListItem>
                    </List>
                  ))}
                </ul>
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
              <h2>Confirmation</h2>
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

  return <form onSubmit={handleSubmit}>{renderForm()}</form>;
};

export default WarrantyForm;
