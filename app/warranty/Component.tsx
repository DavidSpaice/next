"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const WarrantyForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  interface FormData {
    installType: string;
    firstName: string;
    lastName: string;
    streetAddress: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    phone: string;
    extension: string;
    dealerName: string;
    dealerEmail: string;
    models: string[];
    serialNumbers: string[];
    installationDates: string[];
    step5: string;
    step6: string;
  }

  const [formData, setFormData] = useState<FormData>({
    installType: "",
    firstName: "",
    lastName: "",
    streetAddress: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "",
    phone: "",
    extension: "",
    dealerName: "",
    dealerEmail: "",
    models: [],
    serialNumbers: [],
    installationDates: [],
    step5: "",
    step6: "",
  });

  const isFormValid = () => {
    const {
      firstName,
      lastName,
      streetAddress,
      city,
      stateProvince,
      postalCode,
      country,
      phone,
      dealerName,
      dealerEmail,
      models: [],
      serialNumbers: [],
      installationDates: [],
    } = formData;

    // Check if any required field is empty
    return (
      firstName &&
      lastName &&
      streetAddress &&
      city &&
      stateProvince &&
      postalCode &&
      country &&
      phone &&
      dealerName &&
      dealerEmail
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddItem = () => {
    const { models, serialNumbers, installationDates } = formData;
    setFormData((prevData) => ({
      ...prevData,
      models: [...models, ""],
      serialNumbers: [...serialNumbers, ""],
      installationDates: [...installationDates, ""],
    }));
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof FormData
  ) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData };
      (newData[field][index] as any) = value;
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);
  };

  const handleNext = () => {
    const currentStep = Number(searchParams.get("step")) || 1;

    if (currentStep === 2 && !formData.installType) {
      console.log("Please select an installation type.");
      return;
    } else if (currentStep === 3 && !isFormValid()) {
      console.log("Please fill out all required fields.");
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
              <button type="button" onClick={handleNext}>
                Next
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
              <label>
                <input
                  type="radio"
                  name="installType"
                  value="Existing Home"
                  checked={formData.installType === "Existing Home"}
                  onChange={handleChange}
                  required
                />
                Existing Home
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name="installType"
                  value="Newly Constructed Home"
                  checked={formData.installType === "Newly Constructed Home"}
                  onChange={handleChange}
                  required
                />
                Newly Constructed Home
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name="installType"
                  value="Commercial Existing and New Construction"
                  checked={
                    formData.installType ===
                    "Commercial Existing and New Construction"
                  }
                  onChange={handleChange}
                  required
                />
                Commercial Existing and New Construction
              </label>
              <br />
              <br />
            </div>

            <div className="form-btn">
              <button type="button" onClick={handlePrevious}>
                Previous
              </button>
              <button type="button" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="container">
            <div className="form-content">
              <h2>Equipment Owner Information</h2>
              <form onSubmit={handleNext}>
                <div>
                  <label>
                    First Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>
                    Last Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>
                    Street Address <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>
                    City <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>
                    State / Province <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="stateProvince"
                    value={formData.stateProvince}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>
                    Postal / Zip code <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>
                    Country <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>
                    Phone <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Ext.</label>
                  <input
                    type="text"
                    name="extension"
                    value={formData.extension}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>
                    Dealer Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="dealerName"
                    value={formData.dealerName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>
                    Dealer Email <span>*</span>
                  </label>
                  <input
                    type="email"
                    name="dealerEmail"
                    value={formData.dealerEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="button" onClick={handlePrevious}>
                  Previous
                </button>
                <button type="button" onClick={handleNext}>
                  Next
                </button>
              </form>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="container">
            <h2>Step 4</h2>
            <div>
              <h3>Add Item</h3>
              <button type="button" onClick={handleAddItem}>
                Add Item
              </button>
              {formData.models.map((model, index) => (
                <div key={index}>
                  <input
                    type="text"
                    name="models"
                    placeholder="Model"
                    value={model}
                    onChange={(e) => handleItemChange(e, index, "models")}
                    required
                  />
                  <input
                    type="text"
                    name="serialNumbers"
                    placeholder="Serial Number"
                    value={formData.serialNumbers[index]}
                    onChange={(e) =>
                      handleItemChange(e, index, "serialNumbers")
                    }
                    required
                  />
                  <input
                    type="date"
                    name="installationDates"
                    placeholder="Installation Date"
                    value={formData.installationDates[index]}
                    onChange={(e) =>
                      handleItemChange(e, index, "installationDates")
                    }
                    required
                  />
                </div>
              ))}
            </div>
            <button type="button" onClick={handlePrevious}>
              Previous
            </button>
            <button type="button" onClick={handleNext}>
              Next
            </button>
          </div>
        );
      case 5:
        return (
          <div>
            <h2>Step 5</h2>
            <input
              type="text"
              name="step5"
              value={formData.step5}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handlePrevious}>
              Previous
            </button>
            <button type="button" onClick={handleNext}>
              Next
            </button>
          </div>
        );
      case 6:
        return (
          <div>
            <h2>Step 6</h2>
            <input
              type="text"
              name="step6"
              value={formData.step6}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handlePrevious}>
              Previous
            </button>
            <button type="submit">Submit</button>
          </div>
        );
      default:
        return null;
    }
  };

  return <form onSubmit={handleSubmit}>{renderForm()}</form>;
};

export default WarrantyForm;
