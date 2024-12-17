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
        formData.postalCode ?? "".length != 0 ? "" : "This field is required.";

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
        router.push("gree-customer-care-fr/thank-you");
        // console.log(responseText);
        setIsDisabled(false);
      })
      .catch(function (error) {
        router.push("gree-customer-care-fr/error");
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
        <div className="container">
          <div className="form-content">
            <br />
            <div className="">
              <img src="customer_service.png" alt="service_client" />
              <br />
              <div>
                <h1 className="title">Programme de concession de pièces</h1>
                <br />
                <h2 className="title">1. Concession de pièces</h2>
                <br />
                <p>
                  L&rsquo;un des points forts de choisir le Partenariat Prestige
                  de Gree est notre programme de concession de pièces, alimenté
                  par Airtek. Ce programme permet à nos concessionnaires de
                  concessionner un Composant Principal Majeur dans des périodes
                  spécifiques, que nous appelons la &laquo; Période de
                  concession &raquo;. Sous ce programme, Airtek prend en charge
                  la Pièce, tandis que nos concessionnaires sont responsables de
                  la concession de 100 % de la main-d&apos;œuvre nécessaire au
                  remplacement.
                </p>
                <br />
                <h2 className="title">1.1. Composants Majeurs Éligibles</h2>
                <br />
                <p>
                  Notre programme de concession s&rsquo;applique exclusivement
                  aux composants majeurs suivants : Compresseur, Bobine
                  extérieure et Bobine intérieure - collectivement connus sous
                  le nom de &laquo; Composants Principaux Majeurs &raquo; ou
                  simplement &laquo; Pièces &raquo;.
                </p>
                <br />
                <h2 className="title">1.2. Périodes de concession</h2>
                <br />
                <p>
                  La Période de concession est déterminée par la durée de la
                  garantie limitée enregistrée. Pour vous donner une idée de son
                  fonctionnement :
                </p>
                <br />
                <ul className="pl-4">
                  <li className="list-disc font-bold">
                    Pour une période de garantie limitée enregistrée de 10 ans,
                    la Période de concession s&apos;étend à 12 mois au-delà de
                    l&apos;expiration de la garantie.
                  </li>

                  <li className="list-disc font-bold">
                    Avec une garantie limitée enregistrée de 5 ans, la Période
                    de concession est de 18 mois après l&apos;expiration.
                  </li>

                  <li className="list-disc font-bold">
                    Pour une garantie limitée enregistrée d&apos;un an, la
                    Période de concession s&apos;étend sur 24 mois après
                    l&apos;expiration de la garantie.
                  </li>
                </ul>
              </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <div className="title text-xl">
              <h1>Contactez un concessionnaire local</h1>
            </div>

            <br />
            <div className="w-full h-[120%] sm:h-96 flex flex-row justify-center items-center border-2 border-gray-200 rounded-3xl shadow-md">
              <div className="w-1/4 h-[700px] sm:h-full flex flex-col pt-20 px-4 items-center rounded-s-3xl bg-[#182778]">
                <div className="text-white text-center text-xl">
                  <h1>Nous sommes là pour vous aider</h1>
                </div>
                <br />

                <div className="text-white text-center text-sm md:text-md">
                  <p>
                    Contactez le Service Clientèle pour toute question sur les
                    produits, la garantie et les concessionnaires.
                  </p>
                </div>
                <br />
                <br />
                <div className="text-white text-center text-xs">
                  <i aria-labelledby="phone-icon">
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
                  <div>
                    <Controls
                      error={errors.email}
                      required
                      type="text"
                      name="email"
                      label="Courriel"
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
                  <div>
                    <Controls
                      error={errors.city}
                      type="text"
                      name="city"
                      label="Ville"
                      size="small"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />

                    <Controls
                      error={errors.stateProvince}
                      type="text"
                      name="stateProvince"
                      label="État / Province"
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
                      label="Code Postal / Zip"
                      size="small"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                    />

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
                  </div>
                </Box>
                <div className="w-full form-btn flex flex-col items-center">
                  <div className="w-2/3 text-center text-xs">
                    <p>
                      &quot;En cliquant sur &lsquo;Soumettre,&rsquo;
                      j&apos;accepte de recevoir des informations sur les
                      produits et services d&apos;un concessionnaire Airtek.
                      proche en utilisant les coordonnées fournies.
                    </p>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="next-btn"
                      disabled={isDisabled}
                    >
                      Soumettre
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
