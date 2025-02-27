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
      errors.firstName = formData.firstName ? "" : "Ce champ est obligatoire.";
    if ("lastName" in formData)
      errors.lastName = formData.lastName ? "" : "Ce champ est obligatoire.";
    if ("email" in formData)
      errors.email = emailValidate.test(formData.email ?? "")
        ? ""
        : "Le courriel n'est pas valide.";
    if ("phone" in formData)
      errors.phone = phoneValidate.test(formData.phone ?? "")
        ? ""
        : "Minimum 10 chiffres requis et uniquement des chiffres.";
    if ("streetAddress" in formData)
      errors.streetAddress =
        formData.streetAddress ?? "".length !== 0
          ? ""
          : "Ce champ est obligatoire.";
    if ("city" in formData)
      errors.city =
        formData.city ?? "".length !== 0 ? "" : "Ce champ est obligatoire.";
    if ("stateProvince" in formData)
      errors.stateProvince =
        formData.stateProvince ?? "".length !== 0
          ? ""
          : "Ce champ est obligatoire.";
    if ("postalCode" in formData)
      errors.postalCode =
        formData.postalCode ?? "".length !== 0
          ? ""
          : "Ce champ est obligatoire.";

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
        throw new Error("Erreur : " + response.status);
      })
      .then(function (responseText) {
        setLoading(true);
        router.push("gree-customer-care-fr/thank-you");
        setIsDisabled(false);
      })
      .catch(function (error) {
        router.push("gree-customer-care-fr/error");
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
            {/* New Main Content in French */}
            <div className="">
              <img src="customer_service.png" alt="service_client" />

              <h1 className="title">
                PROGRAMME DE CONCESSIONNAIRES PRESTIGE AIRTEK 2025
              </h1>
              <p className="text-sm">26 février 2025</p>
              <h2 className="title">
                Programme de Concessionnaires Prestige Airtek
              </h2>
              <p className="text-sm mt-2">
                Le programme de concessionnaires Prestige Airtek regroupe un
                groupe restreint de concessionnaires dédiés à offrir des
                solutions de confort supérieures, à optimiser l&quot;efficacité
                et à fournir un service client exceptionnel aux consommateurs
                résidentiels.
              </p>
              <p className="text-sm mt-2">
                En tant que concessionnaire Prestige, vous avez accès à un outil
                puissant pour promouvoir les produits Airtek sur le marché
                résidentiel - jusqu&quot;à une garantie limitée de 12 ans sur
                les produits éligibles. Les concessionnaires Prestige Airtek
                peuvent offrir à leurs clients résidentiels une garantie limitée
                supplémentaire de 2 ans, en plus de la garantie limitée standard
                de 10 ans pour les produits admissibles, à condition que toutes
                les conditions suivantes soient remplies :
              </p>
              <ol className="list-decimal ml-4 text-sm mt-2">
                <li>
                  Les concessionnaires doivent maintenir un accord de concession
                  signé, valide et actif avec Airtek et être en règle, tel que
                  déterminé exclusivement par Airtek.
                </li>
                <li>
                  Toutes les installations doivent être effectuées au Canada par
                  des techniciens qualifiés et agréés, conformément aux lois,
                  règlements et normes locaux.
                </li>
                <li>
                  Chaque installation doit inclure un parasurtenseur approprié
                  et compatible, pré-approuvé par Airtek pour chaque produit
                  spécifique.
                </li>
                <li>
                  Les produits doivent être achetés auprès d&quot;Airtek et
                  comporter des numéros de série vérifiables.
                </li>
                <li>
                  Les produits doivent être enregistrés au nom du propriétaire
                  d&quot;origine conformément au calendrier et aux directives
                  d&quot;enregistrement de garantie d&quot;Airtek.
                </li>
              </ol>
              <h3 className="title mt-2">Exclusions</h3>
              <ul className="list-disc ml-4 text-sm mt-2">
                <li>
                  Les produits vendus aux constructeurs sans un accord
                  d&quot;achat direct avec le propriétaire au moment de la vente
                  ne sont pas éligibles.
                </li>
                <li>
                  Les produits et installations commerciaux sont exclus de ce
                  programme.
                </li>
                <li>
                  Les pièces de rechange ou composants non pré-approuvés par
                  Airtek ne sont pas autorisés et peuvent annuler
                  l&quot;éligibilité à la garantie.
                </li>
              </ul>
              <h3 className="title mt-2">Processus de réclamations</h3>
              <ul className="list-disc ml-4 text-sm mt-2">
                <li>
                  Les concessionnaires doivent soumettre toutes les réclamations
                  via le Programme de Concessionnaires Prestige Airtek.
                </li>
                <li>
                  Les concessionnaires doivent fournir le numéro de série du
                  produit, les informations du propriétaire et une preuve
                  d&quot;enregistrement.
                </li>
                <li>
                  Airtek se réserve le droit d&quot;approuver ou de refuser les
                  réclamations à sa seule discrétion.
                </li>
              </ul>
              <h3 className="title mt-2">Exigences légales</h3>
              <p className="text-sm mt-2">
                Ce document contient des informations confidentielles,
                propriétaires et des secrets commerciaux appartenant à Airtek.
                La distribution non autorisée est strictement interdite.
              </p>
              <h3 className="title mt-2">Dispositions générales</h3>
              <ul className="list-disc ml-4 text-sm mt-2">
                <li>
                  Les concessionnaires doivent conserver la documentation des
                  réclamations de garantie pendant au moins 24 mois après
                  remboursement. Les réclamations sont sujettes à vérification
                  et les concessionnaires doivent coopérer avec le processus. Si
                  une réclamation est jugée non éligible, Airtek pourra débiter
                  ou facturer le concessionnaire du montant du remboursement
                  ainsi que les frais d&quot;audit associés.
                </li>
                <li>
                  Toutes les réclamations et paiements des concessionnaires
                  doivent respecter les directives légales et financières
                  d&quot;Airtek.
                </li>
                <li>
                  La violation de toute condition peut entraîner la résiliation
                  des accords et la révocation du droit du concessionnaire à
                  utiliser la marque Airtek.
                </li>
                <li>
                  Airtek se réserve le droit de modifier, ajuster ou annuler le
                  programme à tout moment.
                </li>
                <li>
                  Airtek n&quot;assume aucune responsabilité légale quant à
                  l&quot;exécution locale du programme.
                </li>
                <li>
                  Airtek peut contacter directement les propriétaires sur la
                  base des enregistrements et soumissions des concessionnaires.
                  Les informations des propriétaires sont recueillies pour la
                  qualité du service et à des fins de recherche, conformément à
                  la politique de confidentialité d&quot;Airtek.
                </li>
              </ul>
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
                      produits et services d&apos;un concessionnaire Airtek
                      proche en utilisant les coordonnées fournies.&quot;
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
