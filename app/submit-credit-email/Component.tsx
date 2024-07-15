'use client';

import React, { useState } from 'react';

const SubmitCreditEmail: React.FC = () => {
    const [dealerName, setDealerName] = useState<string>('');
    const [credit, setCredit] = useState<string>('');
    const [clientEmail, setClientEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string>('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Trim spaces from the beginning and end of the inputs
        const trimmedDealerName = dealerName.trim();
        const trimmedCredit = credit.trim();
        const trimmedClientEmail = clientEmail.trim();

        // Verify email format
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(trimmedClientEmail)) {
            setEmailError('Invalid email format');
            return;
        } else {
            setEmailError('');
        }

        // Show confirmation modal
        setShowConfirmation(true);
        setDealerName(trimmedDealerName);
        setCredit(trimmedCredit);
        setClientEmail(trimmedClientEmail);
    };

    const handleConfirmSubmit = async () => {
        const response = await fetch('https://airtek-warranty.onrender.com/credit/sendCreditEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dealerName, credit, clientEmail }),
        });

        setShowConfirmation(false);

        if (response.ok) {
            setMessage('Credit email sent successfully.');
        } else {
            setMessage('Error sending credit email. Please try again.');
        }
    };

    const handleCancelSubmit = () => {
        setShowConfirmation(false);
    };

    const handleCreditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and decimal points
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setCredit(value);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-8 border border-[#182887] rounded-lg bg-gray-100">
            <h1 className="text-center text-[#182887] text-2xl font-semibold mb-6">Submit Credit Email</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-[#182887] mb-2">Dealer Name</label>
                    <input
                        type="text"
                        value={dealerName}
                        onChange={(e) => setDealerName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-[#182887] rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-[#182887] mb-2">Credit Amount</label>
                    <input
                        type="text"
                        value={credit}
                        onChange={handleCreditChange}
                        required
                        className="w-full px-4 py-2 border border-[#182887] rounded-md"
                        pattern="^\d*(\.\d{0,2})?$"
                        title="Please enter a valid amount"
                    />
                </div>
                <div>
                    <label className="block text-[#182887] mb-2">Client Email</label>
                    <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-[#182887] rounded-md"
                    />
                    {emailError && <p className="text-red-600">{emailError}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-[#182887] text-white rounded-md hover:bg-blue-800"
                >
                    Submit
                </button>
            </form>
            {message && <p className="mt-4 text-center text-[#182887]">{message}</p>}

            {showConfirmation && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Confirm Details</h2>
                        <p><strong>Dealer Name:</strong> {dealerName}</p>
                        <p><strong>Credit Amount:</strong> {credit}</p>
                        <p><strong>Client Email:</strong> {clientEmail}</p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={handleCancelSubmit}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmSubmit}
                                className="px-4 py-2 bg-[#182887] text-white rounded-md hover:bg-blue-800"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmitCreditEmail;
