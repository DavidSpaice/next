"use client"
import React, { useState } from 'react';
import { Dayjs } from "dayjs";

function MidDesk() {

    interface NewItem {
        id: any;
        model: string;
        serialNumber: string;
        installationDate: Dayjs | null;
    }

    interface WarrantyType {
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
        dealerId: string;
        extension?: string;
        items: NewItem[];
        agreedToTerms: boolean;
    }

    const [serialNumber, setSerialNumber] = useState('');
    const [warrantyData, setWarrantyData] = useState<WarrantyType>();
    const [error, setError] = useState("");

    const handleSearch = async () => {
        try {
            const response = await fetch('https://airtek-warranty.onrender.com/warranties/search-warranty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ serialNumber }),
            });

            if (!response.ok) {
                console.log(serialNumber);
                setError('Warranty not found');
                return;
            }

            const data = await response.json();
            setWarrantyData(data);
            setError("");
        } catch (error) {
            console.error('Error searching for warranty:', error);
            setError('An error occurred while searching for warranty');
        }
    };


    return (
        <div>
            <h1>Search Warranty</h1>
            <div>
                <label>
                    Serial Number:
                    <input
                        type="text"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                    />
                </label>
                <button onClick={handleSearch}>Search</button>
            </div>
            {error && <p>{error}</p>}
            {warrantyData && (
                <div>
                    <h2>Warranty Information:</h2>
                    <br />
                    <h2>Owner Name:</h2>
                    <p>{warrantyData.firstName} {warrantyData.lastName}</p>
                    <h2>Owner Address:</h2>
                    <p>{warrantyData.streetAddress}</p>
                    <p>{warrantyData.city}, {warrantyData.stateProvince}</p>
                    <p>{warrantyData.country}, {warrantyData.postalCode}</p>
                    <h2>Owner Phone:</h2>
                    <p>{warrantyData.phone}</p>
                    <h2>Owner Email:</h2>
                    <p>{warrantyData.email}</p>
                    <br />
                    <p>Dealer Information:</p>
                    <p>{warrantyData.dealerName}</p>
                    <p>{warrantyData.dealerEmail}</p>
                    <p>{warrantyData.dealerPhone}</p>
                    <p>{warrantyData.dealerAddress}</p>
                </div>
            )}
        </div>
    );
}

export default MidDesk