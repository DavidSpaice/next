"use client"
import React, { useState } from 'react'
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Link from 'next/link';

interface NewItem {
    model: string;
    serialNumber: string;
    installationDate: Dayjs | null;
}

interface FormData {
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
    extension?: string;
    items: NewItem[];
    agreedToTerms: boolean;
}

function WarrantyForm() {

    const [serialNumber, setSerialNumber] = useState("");
    const [newItem, setNewItem] = useState<NewItem>({
        model: "",
        serialNumber: "",
        installationDate: dayjs(),
    });
    const [dataToUpdate, setDataToUpdate] = useState<FormData>({
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


    const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        setDataToUpdate((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const dateOnChange = (date: Dayjs | null) => {
        const dayjsDate = date ? dayjs(date) : null;

        setNewItem((prevData) => ({
            ...prevData,
            installationDate: dayjsDate,
        }));
    };

    const handleAddItem = () => {

        // Create a new item with the provided values
        const newItemWithValues: NewItem = {
            model: newItem.model,
            serialNumber: newItem.serialNumber,
            installationDate: newItem.installationDate,
        };

        // Add the new item to the items array
        setDataToUpdate((prevData) => ({
            ...prevData,
            items: [...prevData.items, newItemWithValues],
        }));

        // Empty the input fields
        setNewItem({
            model: "",
            serialNumber: "",
            installationDate: dayjs(),
        });


    };


    const handleSubmit = async () => {
        // Create a new object with only non-empty fields
        const updatedData = { ...dataToUpdate };

        // Filter out empty fields while preserving data types
        const filteredData = Object.entries(updatedData).reduce(
            (acc: { [key: string]: any }, [key, value]) => {
                if (
                    (typeof value === 'string' && value.trim() !== '') ||
                    (Array.isArray(value) && value.length > 0) ||
                    (typeof value === 'boolean')
                ) {
                    acc[key] = value;
                }
                return acc;
            },
            {}
        );

        try {
            const response = await fetch(`https://airtek-warranty.onrender.com/warranties/modify-warranty/${serialNumber}`, {
                method: "PUT",
                body: JSON.stringify(filteredData),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("successfully updated!");
            } else {
                alert("Error Try Again later");
            }
        } catch (error) {
            console.error(error);
        }
    };



    return (

        <form className='w-screen text-center sm:text-left flex flex-col justify-center items-center'>
            <label>
                Serial Number of the Warranty needs be changed:
                <input
                    type="text"
                    name="serialNumber"
                    autoFocus
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                />
            </label>
            <br />
            <label>
                Model:
                <input
                    type="text"
                    name="model"
                    value={newItem.model}
                    onChange={(e) => setNewItem({ ...newItem, model: e.target.value })}
                />
            </label>
            <br />
            <label>
                Serial Number:
                <input
                    type="text"
                    name="serialNumber"
                    value={newItem.serialNumber}
                    onChange={(e) => setNewItem({ ...newItem, serialNumber: e.target.value })}
                />
            </label>
            <br />
            <label>
                Installation Date:
                <DatePicker
                    label="Installation Date"
                    slotProps={{ textField: { size: "small" } }}
                    value={newItem.installationDate}
                    onChange={(date) => setNewItem({ ...newItem, installationDate: date })}
                />
            </label>
            <br />
            <label>
                First Name:
                <input
                    type="text"
                    name="firstName"
                    value={dataToUpdate.firstName}
                    onChange={handleInputChange}
                />
            </label>
            <br />
            <label>
                Last Name:
                <input
                    type="text"
                    name="lastName"
                    value={dataToUpdate.lastName}
                    onChange={handleInputChange}
                />
            </label>
            <br />
            <label>
                Email:
                <input
                    type="text"
                    name="email"
                    value={dataToUpdate.email}
                    onChange={handleInputChange}
                />
            </label>
            <br />
            <label>
                Phone:
                <input
                    type="text"
                    name="phone"
                    value={dataToUpdate.phone}
                    onChange={handleInputChange}
                />
            </label>
            <br />
            <label>
                Extension:
                <input
                    type="text"
                    name="extension"
                    value={dataToUpdate.extension}
                    onChange={handleInputChange}
                />
            </label>
            <br />
            <label>
                Street Address:
                <input
                    type="text"
                    name="streetAddress"
                    value={dataToUpdate.streetAddress}
                    onChange={handleInputChange}
                />
            </label>
            <br />
            <label>
                Postal Code:
                <input
                    type="text"
                    name="postalCode"
                    value={dataToUpdate.postalCode}
                    onChange={handleInputChange}
                />
            </label>
            <br />
            <label>
                Country:
                <input
                    type="text"
                    name="country"
                    value={dataToUpdate.country}
                    onChange={handleInputChange}
                />
            </label>
            <br />
            <button type="button" onClick={handleAddItem} className='border bg-[#182887] px-2  hover:text-gray-300 text-white'>
                Add Item
            </button>

            <button type="button" onClick={handleSubmit} className='border bg-[#182887] px-2  hover:text-gray-300 text-white'>
                Submit
            </button>

            <div>
                <Link href="/warranty-management" className='border bg-[#182887] px-2  hover:text-gray-300 text-white'>Back</Link>
            </div>

        </form>

    );
};

export default WarrantyForm;