"use client"
import React, { useState } from 'react';
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
            errors.phone =
                phoneValidate.test(formData.phone ?? "")
                    ? ""
                    : "Minimum 10 numbers required and number only.";
        if ("streetAddress" in formData)
            errors.streetAddress =
                formData.streetAddress ?? "".length != 0
                    ? ""
                    : "This field is required.";
        if ("city" in formData)
            errors.city =
                formData.city ?? "".length != 0 ? "" : "This field is required.";
        if ("stateProvince" in formData)
            errors.stateProvince =
                formData.stateProvince ?? "".length != 0
                    ? ""
                    : "This field is required.";
        if ("postalCode" in formData)
            errors.postalCode =
                formData.postalCode ?? "".length != 0
                    ? ""
                    : "This field is required.";

        setErrors({
            ...errors,
        });

        if (formData == formData)
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
                // console.log(responseText);
                setIsDisabled(false);
            })
            .catch(function (error) {
                router.push("gree-customer-care/error");
                // console.error(error);
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
                <div className='container'>
                    <div className='form-content'>
                        <div>
                            <h1 className="title">
                                Gree Prestige Partnership Dealers!
                            </h1>
                        </div>
                        <br />
                        <div className='text-center sm:text-left'>
                            <p>
                                For the Gree Prestige Partnership Program, we choose to partner with dealers who share our commitment to providing the best customer experience and offer special program benefits designed to accelerate Gree&apos;s leading dealers&apos; growth and overall success.
                            </p>
                        </div>
                        <br />
                        <p className="title">Contact a local dealer</p>

                        <div className='w-full flex flex-col justify-center items-center'>
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
                        </div>
                        <div className="form-btn">
                            <button type="submit" className="next-btn" disabled={isDisabled}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
};

export default CustomerCare