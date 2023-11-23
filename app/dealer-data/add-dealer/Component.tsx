"use client"

import Link from 'next/link';
import { useState } from 'react';

export default function AddDealerData() {
    const [formData, setFormData] = useState({
        _id: '', // Include the _id field
        dealerName: '',
        dealerEmail: '',
        dealerPhone: '',
        dealerAddress: '',
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const response = await fetch('https://airtek-warranty.onrender.com/dealerData/add-new-dealer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Dealer Data added successfully!');
                // Reset the form
                setFormData({
                    _id: '', // Reset _id field
                    dealerName: '',
                    dealerEmail: '',
                    dealerPhone: '',
                    dealerAddress: '',
                });
            } else {
                alert('Error adding dealer data. Please try again.');
            }
        } catch (error) {
            console.error('Error adding dealer data:', error);
            alert('Error adding dealer data. Please try again.');
        }
    };

    return (
        <div className='flex flex-col justify-center items-center'>
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
                    <label>Dealer Address:</label>
                    <textarea
                        name="dealerAddress"
                        value={formData.dealerAddress}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='w-full flex flex-row justify-center items-center'>
                <button type="submit" className='border bg-[#182887] px-2 text-white hover:text-gray-300'>Add Dealer Data</button>

                </div>
            </form>

            <div>
                <Link href="/dealer-data" className='border bg-[#182887] px-2 text-white hover:text-gray-300'>Back</Link>
            </div>
        </div>
    );
}
