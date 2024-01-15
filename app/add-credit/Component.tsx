"use client"
import React, { useState, useEffect } from 'react';

interface Credit {
    _id: string;
    userId: number;
    userName: string;
    defaultCredit: { $numberDecimal: string };
    currentCredit: { $numberDecimal: string };
}

const CustomerCredits = () => {
    const [credits, setCredits] = useState<Credit[]>([]);
    const [amountToAdd, setAmountToAdd] = useState<string>('0.00');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://airtek-warranty.onrender.com/user-credits/');
                const data = await response.json();
                setCredits(data.credits);
            } catch (error) {
                console.error('Error fetching credits:', error);
            }
        };

        fetchData();
    }, []);

    const handleAddCredit = async (userId: number) => {
        try {
            const parsedAmountToAdd = parseFloat(amountToAdd);
            if (isNaN(parsedAmountToAdd) || parsedAmountToAdd < 0) {
                alert('Invalid amount input');
                return;
            }

            setCredits((prevCredits) =>
                prevCredits.map((credit) => {
                    if (credit.userId === userId) {
                        const updatedCurrentCredit = parseFloat(credit.currentCredit.$numberDecimal) + parsedAmountToAdd;
                        return {
                            ...credit,
                            currentCredit: { $numberDecimal: updatedCurrentCredit.toString() },
                        };
                    }
                    return credit;
                })
            );

            await fetch('https://airtek-warranty.onrender.com/user-credits/add-credit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, amountToAdd: parsedAmountToAdd }),
            });

            setAmountToAdd('0.00');
        } catch (error) {
            console.error('Error adding credit:', error);
            setCredits((prevCredits) => [...prevCredits]);
        }
    };

    const filteredCredits = credits.filter(
        (credit) =>
            credit.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            credit.userId.toString().includes(searchTerm)
    );

    return (
        <div>
            <h1>User Credits</h1>
            <input
                className="w-56"
                type="text"
                placeholder="Search by user name or ID"
                value={searchTerm}
                autoFocus
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table className="border border-collapse border-black">
                <thead>
                    <tr className="border">
                        <th className="border">User ID</th>
                        <th className="border">User Name</th>
                        <th className="border">Default Credit</th>
                        <th className="border">Current Credit</th>
                        <th className="border">Add Credit</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCredits.map((credit) => (
                        <tr className="border" key={credit._id}>
                            <td className="border">{credit.userId}</td>
                            <td className="border">{credit.userName}</td>
                            <td className="border">{credit.defaultCredit.$numberDecimal}</td>
                            <td className="border">
                                {parseFloat(credit.currentCredit.$numberDecimal) <= parseFloat(credit.defaultCredit.$numberDecimal) ? (
                                    credit.currentCredit.$numberDecimal
                                ) : (
                                    credit.defaultCredit.$numberDecimal
                                )}
                            </td>
                            <td className="border">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amountToAdd}
                                    onChange={(e) => setAmountToAdd(e.target.value)}
                                    className="border"
                                />
                                <button className="bg-[#182887] hover:bg-[#96a0da] text-white font-bold text-xs py-2 px-4 rounded" onClick={() => handleAddCredit(credit.userId)}>
                                    Add Credit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
};

export default CustomerCredits;
