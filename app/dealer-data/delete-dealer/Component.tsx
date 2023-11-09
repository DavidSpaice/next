"use client"
import Link from 'next/link';
import React, { useState } from 'react';

const DeleteDealer = () => {
    const [dealerId, setDealerId] = useState('');
    const [deletedDealerId, setDeletedDealerId] = useState("");

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8500/dealerData/${dealerId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // Handle the response data as needed
                console.log('Deleted dealer with ID:', dealerId);
                setDeletedDealerId(dealerId);
            } else {
                console.error('Error deleting dealer:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting dealer:', error);
        }
    };

    return (
        <div className='flex flex-col justify-center items-center'>
            <h1>Search and Delete Dealer</h1>
            <label>
                Dealer ID:
                <input
                    type="text"
                    value={dealerId}
                    onChange={(e) => setDealerId(e.target.value)}
                />
            </label>
            <button className='border bg-[#182887] px-2  hover:text-gray-300 text-white' onClick={handleDelete}>Delete</button>
            {deletedDealerId && (
                <p>Dealer with ID {deletedDealerId} has been deleted.</p>
            )}


            <div>
                <Link href="/dealer-data" className='border bg-[#182887] px-2  hover:text-gray-300 text-white'>Back</Link>
            </div>
        </div>
    );
};

export default DeleteDealer;