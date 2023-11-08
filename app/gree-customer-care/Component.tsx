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
                        <div className=''>
                            <div className='w-full'>
                                <Box className='float-right rounded-lg shadow-2xl ml-4 mb-4' width={350} component="img" src="/customer_service.png" alt="Customer Care" />
                                <div>
                                    <h1 className="title">Parts Concession Program</h1>
                                    <br />
                                    <h2 className="title">1. Parts Concession</h2>
                                    <p>One of the standout features of choosing Gree Prestige Partnership is our Parts Concession program, powered by Airtek. This program empowers our valued dealers to concession a Major Component Part within specific time periods, which we refer to as the &quot;Concession Period.&quot; Under this program, Airtek takes care of the Part, while our dealers are responsible for conceding 100% of the labor required for replacement.</p>
                                    <br />
                                    <h2 className="title">1.1. Eligible Major Components</h2>
                                    <p>Our Concession program applies exclusively to the following major components: Compressor, Outdoor coil, Indoor coil, and Heat Exchanger - collectively known as &quot;Major Component Parts&quot; or simply &quot;Parts.&quot;</p>
                                    <br />
                                    <h2 className="title">1.2. Concession Periods</h2>
                                    <p>The Concession Period is determined by the length of the registered limited warranty period. To give you an idea of how this works:</p>
                                    <ul className='pl-4'>
                                        <li className="title">For a 10-year registered limited warranty period, the Concession Period extends to 12 months beyond the warranty&apos;s expiration.</li>

                                        <li className="title">With a 5-year registered limited warranty, the Concession Period is 18 months post-expiration.</li>

                                        <li className="title">For a 1-year registered limited warranty, the Concession Period spans 24 months after the warranty&apos;s expiration.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <br />
                        <p className="title">Contact a local dealer</p>

                        <div className='w-full h-96 flex flex-row justify-center items-center border-2 border-gray-200 rounded-lg shadow-md'>
                            <div className='w-1/4 h-full flex flex-col pt-12 items-center rounded-s-lg bg-[#182778]'>
                                <div className='text-white text-center text-xl'>
                                    <h1>We&apos;re here to help</h1>
                                </div>
                                <br />

                                <div className='text-white text-center text-xs'>
                                    <p>
                                        Contact Customer Care for product, warranty, and dealer inquiries.
                                    </p>
                                </div>
                                <br />
                                <br />
                                <div className='text-white text-center text-xs'>
                                    <i aira-aria-labelledby="phone-icon"><svg fill="none" viewBox="0 0 24 24" className="stroke-[#323232] inline-block w-4 !stroke-white" data-di-rand="1699453406746"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    </path></svg></i> <a href="tel:+18669691931"> 1-866-969-1931</a>
                                </div>
                            </div>
                            <div className='w-3/4 flex flex-col justify-center items-center'>
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
                                <div className="w-full form-btn flex flex-col">
                                    <div className='w-2/3 text-center text-xs'>
                                        <p>
                                            &quot;By clicking &apos;Submit,&apos; I agree to receive information about products and services from a nearby Airtek Ontario Inc. dealer using the provided contact details.
                                        </p>
                                    </div>
                                    <div>
                                        <button type="submit" className="next-btn" disabled={isDisabled}>
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
};

export default CustomerCare