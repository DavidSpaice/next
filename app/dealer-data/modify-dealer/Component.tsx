"use client"
import Link from 'next/link';
import React, { useState } from 'react'

function ModifyDealerData() {
    const [dealerId, setDealerId] = useState('');
    const [updatedData, setUpdatedData] = useState({
        dealerName: '',
        dealerEmail: '',
        dealerPhone: '',
        dealerAddress: '',
    });
    const [updatedDealer, setUpdatedDealer] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8500/dealerData/${dealerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const data = await response.json();
                setUpdatedDealer(data);
            } else {
                console.error('Error updating dealer data');
            }
        } catch (error) {
            console.error('Error updating dealer data:', error);
        }
    };

    return (
        <div className='flex flex-col justify-center items-center'>
            <h1>Search and Update Dealer Data</h1>
            <label>
                Dealer ID:
                <input
                    type="text"
                    value={dealerId}
                    onChange={(e) => setDealerId(e.target.value)}
                />
            </label>
            <br />
            <label>
                Dealer Name:
                <input
                    type="text"
                    value={updatedData.dealerName}
                    onChange={(e) =>
                        setUpdatedData({ ...updatedData, dealerName: e.target.value })
                    }
                />
            </label>
            <br />
            <label>
                Dealer Email:
                <input
                    type="text"
                    value={updatedData.dealerEmail}
                    onChange={(e) =>
                        setUpdatedData({ ...updatedData, dealerEmail: e.target.value })
                    }
                />
            </label>
            <br />
            <label>
                Dealer Phone:
                <input
                    type="text"
                    value={updatedData.dealerPhone}
                    onChange={(e) =>
                        setUpdatedData({ ...updatedData, dealerPhone: e.target.value })
                    }
                />
            </label>
            <br />
            <label>
                Dealer Address:
                <input
                    type="text"
                    value={updatedData.dealerAddress}
                    onChange={(e) =>
                        setUpdatedData({ ...updatedData, dealerAddress: e.target.value })
                    }
                />
            </label>
            <br />
            <button className='border bg-[#182887] px-2 text-white hover:text-gray-300' onClick={handleSearch}>Search and Update</button>
            {updatedDealer && (
                <div>
                    <h2>Updated Dealer Data:</h2>
                    <pre>{JSON.stringify(updatedDealer, null, 2)}</pre>
                </div>
            )}

            <div>
                <Link href="/dealer-data" className='border bg-[#182887] px-2  hover:text-gray-300 text-white'>Back</Link>
            </div>
        </div>
    );
};


export default ModifyDealerData