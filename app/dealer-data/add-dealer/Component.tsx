"use client";

import Link from "next/link";
import { useState } from "react";

export default function AddDealerData() {
  const [formData, setFormData] = useState({
    _id: "",
    dealerName: "",
    dealerEmail: "",
    dealerPhone: "",
    dealerAddress: "",
    street: "",
    city: "",
    province: "",
    postcode: "",
    location: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setFormData((prevData) => ({
      ...prevData,
      [name]: trimmedValue,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Combine the address fields into a single dealerAddress string, ignoring empty fields
    const dealerAddress = [
      formData.street,
      formData.city,
      formData.province,
      formData.postcode,
    ]
      .filter((field) => field) // Only keep non-empty fields
      .join(", ");

    // Update formData with the combined dealerAddress
    const dataToSubmit = { ...formData, dealerAddress };

    try {
      const response = await fetch(
        "https://airtek-warranty.onrender.com/dealerData/add-new-dealer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (response.ok) {
        alert("Dealer Data added successfully!");

        setFormData({
          _id: "",
          dealerName: "",
          dealerEmail: "",
          dealerPhone: "",
          dealerAddress: "",
          street: "",
          city: "",
          province: "",
          postcode: "",
          location: "",
        });
      } else {
        if (response.status === 400) {
          alert("Dealer ID existing. Please use a different ID.");
        } else {
          const errorText = await response.text();
          console.error("Error adding dealer data:", errorText);
          alert("Error adding dealer data. Please try again.");
        }
      }
    } catch (error) {
      console.error("Network error or issue preventing request:", error);
      alert("Network error or issue preventing request. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Add Dealer Data</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="_id">ID:</label>
          <input
            type="text"
            id="_id"
            name="_id"
            value={formData._id}
            onChange={handleChange}
          />
        </div>
        <br />
        <div>
          <label>Dealer Name:</label>
          <input
            type="text"
            name="dealerName"
            value={formData.dealerName}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label>Dealer Email:</label>
          <input
            type="email"
            name="dealerEmail"
            value={formData.dealerEmail}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label>Dealer Phone:</label>
          <input
            type="text"
            name="dealerPhone"
            value={formData.dealerPhone}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label>Street:</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
          />
        </div>
        <br />
        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <br />
        <div>
          <label>Province:</label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
          />
        </div>
        <br />
        <div>
          <label>Postcode:</label>
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
          />
        </div>
        <br />
        <div>
          <label>Company Location:</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          >
            <option value="">Select a location</option>
            <option value="Manitoba">Manitoba</option>
            <option value="Ontario">Ontario</option>
            <option value="Halifax">Halifax</option>
            <option value="Calgary">Calgary</option>
            <option value="Vancouver">Vancouver</option>
          </select>
        </div>
        <br />
        <div className="w-full flex flex-row justify-center items-center">
          <button
            type="submit"
            className="border bg-[#182887] px-2 text-white hover:text-gray-300"
          >
            Add Dealer Data
          </button>
        </div>
      </form>

      <div>
        <Link
          href="/dealer-data/dealer-info"
          className="border bg-[#182887] px-2 text-white hover:text-gray-300"
        >
          Back
        </Link>
      </div>
    </div>
  );
}
