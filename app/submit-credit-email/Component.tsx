'use client';

import React, { useState } from 'react';

const SubmitCreditEmail: React.FC = () => {
    const [dealerName, setDealerName] = useState<string>('');
    const [credit, setCredit] = useState<string>('');
    const [clientEmail, setClientEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch('https://airtek-warranty.onrender.com/credit/sendCreditEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dealerName, credit, clientEmail }),
        });

        if (response.ok) {
            setMessage('Credit email sent successfully.');
        } else {
            setMessage('Error sending credit email. Please try again.');
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
                        onChange={(e) => setCredit(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-[#182887] rounded-md"
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
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-[#182887] text-white rounded-md hover:bg-blue-800"
                >
                    Send Credit Email
                </button>
            </form>
            {message && <p className="mt-4 text-center text-[#182887]">{message}</p>}
        </div>
    );
};

export default SubmitCreditEmail;
