"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Controls from "@/app/warranty/Controls";

interface ComType {
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  phone: string;
}

function CustomerCare() {
  const [formData, setFormData] = useState<ComType>({
    firstName: "",
    lastName: "",
    email: "",
    streetAddress: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    phone: "",
  });

  const [errors, setErrors] = useState<ComType>({
    firstName: "",
    lastName: "",
    email: "",
    streetAddress: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false);
  const emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const phoneValidate = /^[0-9]{9,}$/;

  const validate = (formData: ComType) => {
    if ("firstName" in formData)
      errors.firstName = formData.firstName ? "" : "This field is required.";
    if ("lastName" in formData)
      errors.lastName = formData.lastName ? "" : "This field is required.";
    if ("email" in formData)
      errors.email = emailValidate.test(formData.email ?? "")
        ? ""
        : "Email is not valid.";
    if ("phone" in formData)
      errors.phone = phoneValidate.test(formData.phone ?? "")
        ? ""
        : "Minimum 10 numbers required and number only.";
    if ("streetAddress" in formData)
      errors.streetAddress =
        formData.streetAddress ?? "".length !== 0
          ? ""
          : "This field is required.";
    if ("city" in formData)
      errors.city =
        formData.city ?? "".length !== 0 ? "" : "This field is required.";
    if ("stateProvince" in formData)
      errors.stateProvince =
        formData.stateProvince ?? "".length !== 0
          ? ""
          : "This field is required.";
    if ("postalCode" in formData)
      errors.postalCode =
        formData.postalCode ?? "".length !== 0 ? "" : "This field is required.";

    setErrors({
      ...errors,
    });

    return Object.values(errors).every((x) => x === "");
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
      const updatedData: ComType = { ...formData };
      updatedData[name as keyof ComType] = value;
      validate(updatedData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`https://airtek-warranty.onrender.com/customer-care/register`, {
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
        router.push("gree-customer-care/thank-you");
        setIsDisabled(false);
      })
      .catch(function (error) {
        router.push("gree-customer-care/error");
        setIsDisabled(false);
      });
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
        <div className="container">
          <div className="form-content">
            <br />
            {/* New Main Content */}
            <div className="">
              <img src="customer_service.png" alt="customer_service" />

              <h1 className="title">2025 AIRTEK PRESTIGE DEALER PROGRAM</h1>
              <p className="text-sm">February 26, 2025</p>
              <h2 className="title">Airtek Prestige Dealer Program</h2>
              <p className="text-sm mt-2">
                The Airtek Prestige Dealer Program comprises a select group of
                dealers dedicated to delivering superior comfort solutions,
                optimizing efficiency, and providing exceptional customer
                service to residential consumers.
              </p>
              <p className="text-sm mt-2">
                As a Prestige Dealer, you have access to a powerful tool for
                promoting Airtek&quot;s products in the residential market - up
                to a 12-year limited warranty on eligible products. Airtek
                Prestige Dealers may offer their residential customers an
                additional 2-year limited warranty on top of the standard
                10-year limited warranty for qualifying products, provided all
                of the following conditions are met:
              </p>
              <ol className="list-decimal ml-4 text-sm mt-2">
                <li>
                  Dealers must maintain a signed, valid, and active Dealer
                  Agreement with Airtek and be in good standing as determined
                  solely by Airtek.
                </li>
                <li>
                  All installations must be performed in Canada by qualified and
                  licensed technicians in compliance with local laws,
                  regulations, and codes.
                </li>
                <li>
                  Each installation must include an appropriate and compatible
                  surge protector, pre-approved by Airtek for each specific
                  product.
                </li>
                <li>
                  Products must be purchased from Airtek and have verifiable
                  serial numbers.
                </li>
                <li>
                  Products must be registered to the original owner according to
                  Airtek&quot;s warranty registration timeline and guidelines.
                </li>
              </ol>
              <h3 className="title mt-2">Exclusions</h3>
              <ul className="list-disc ml-4 text-sm mt-2">
                <li>
                  Products sold to builders without a direct homeowner purchase
                  agreement with the Dealer at the time of sale does not
                  qualify.
                </li>
                <li>
                  Commercial products and installations are excluded from this
                  Program.
                </li>
                <li>
                  Replacement parts or components not pre-approved by Airtek are
                  not permitted and may void warranty eligibility.
                </li>
              </ul>
              <h3 className="title mt-2">Claims Process</h3>
              <ul className="list-disc ml-4 text-sm mt-2">
                <li>
                  Dealers must submit all claims through the Airtek Prestige
                  Dealer Program.
                </li>
                <li>
                  Dealers must provide the product&quot;s serial number, the
                  homeowner&quot;s information, and proof of registration.
                </li>
                <li>
                  Airtek reserves the right to approve or decline claims at its
                  sole discretion.
                </li>
              </ul>
              <h3 className="title mt-2">Legal Requirements</h3>
              <p className="text-sm mt-2">
                This document contains confidential, proprietary, and trade
                secret information belonging to Airtek. Unauthorized
                distribution is strictly prohibited.
              </p>
              <h3 className="title mt-2">General Provisions</h3>
              <ul className="list-disc ml-4 text-sm mt-2">
                <li>
                  Dealers must retain warranty claim documentation for at least
                  24 months after reimbursement. Claims are subject to audit,
                  and Dealers must cooperate with the process. If a claim is
                  deemed ineligible, Airtek may debit or invoice the Dealer for
                  the reimbursement amount plus associated audit costs.
                </li>
                <li>
                  All Dealer claims and payments must adhere to Airtek&quot;s
                  legal and financial guidelines.
                </li>
                <li>
                  Breach of any terms or conditions may result in termination of
                  agreements and revocation of the Dealer&quot;s right to use
                  Airtek branding.
                </li>
                <li>
                  Airtek reserves the right to amend, modify, or cancel the
                  program at any time.
                </li>
                <li>
                  Airtek assumes no legal responsibility for local program
                  execution.
                </li>
                <li>
                  Airtek may directly contact homeowners based on Dealer
                  registrations and submissions. Homeowner information is
                  collected for service quality and research purposes in
                  compliance with Airtek&quot;s privacy policy.
                </li>
              </ul>
            </div>
            <br />
            <br />
            <br />
            <br />
            <div className="title text-xl">
              <h1>Contact a local dealer</h1>
            </div>
            <br />
            <div className="w-full h-[120%] sm:h-96 flex flex-row justify-center items-center border-2 border-gray-200 rounded-3xl shadow-md">
              <div className="w-1/4 h-[700px] sm:h-full flex flex-col pt-20 px-4 items-center rounded-s-3xl bg-[#182778]">
                <div className="text-white text-center text-xl">
                  <h1>We&apos;re here to help</h1>
                </div>
                <br />
                <div className="text-white text-center text-md">
                  <p>
                    Contact Customer Care for product, warranty, and dealer
                    inquiries.
                  </p>
                </div>
                <br />
                <br />
                <div className="text-white text-center text-xs">
                  <i aira-aria-labelledby="phone-icon">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-[#323232] inline-block w-4 !stroke-white"
                      data-di-rand="1699453406746"
                    >
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </i>{" "}
                  <a href="tel:+18669691931"> 1-866-969-1931</a>
                </div>
              </div>
              <div className="w-3/4 flex flex-col justify-center items-center">
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
                      error={errors.phone}
                      type="text"
                      name="phone"
                      label="Phone"
                      size="small"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </Box>
                <div className="w-full form-btn flex flex-col items-center">
                  <div className="w-2/3 text-center text-xs">
                    <p>
                      By clicking &quot;Submit,&quot; I agree to receive
                      information about products and services from a nearby
                      Airtek dealer using the provided contact details.
                    </p>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="next-btn"
                      disabled={isDisabled}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export default CustomerCare;
