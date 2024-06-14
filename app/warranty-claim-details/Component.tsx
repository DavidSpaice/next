"use client"

import React, { useEffect, useState } from 'react';

interface PartInfo {
    _id: string;
    defectivePart: string;
    defectDate: string;
    replacDate: string;
}

interface DealerInfo {
    _id: string;
    serialNumber: string;
    dealerName: string;
    dealerEmail: string;
    dealerPhone: string;
    dealerAddress: string;
    explanation: string;
    parts: PartInfo[];
    replacementStatus: string;
    creditIssueStatus: string;
}

const ClaimTable: React.FC = () => {
    const [dealerInfo, setDealerInfo] = useState<DealerInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchDealerInfo = async () => {
            try {
                const response = await fetch('https://airtek-warranty.onrender.com/claim/claim-info');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setDealerInfo(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dealer info:', error);
                setLoading(false);
            }
        };

        fetchDealerInfo();
    }, []);

    const handleStatusChange = async (combinedId: string, statusType: string, newStatus: string) => {
        const [claimId, itemId] = combinedId.split('-');
        try {
            const response = await fetch('https://airtek-warranty.onrender.com/claim/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    claimId,
                    itemId,
                    statusType,
                    newStatus,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Update the status in the state
            setDealerInfo((prevDealerInfo) =>
                prevDealerInfo.map((dealer) => {
                    if (dealer._id === combinedId) {
                        const updatedParts = dealer.parts.map((part) => {
                            if (part._id === itemId) {
                                return {
                                    ...part,
                                    [statusType]: newStatus,
                                };
                            }
                            return part;
                        });

                        return {
                            ...dealer,
                            parts: updatedParts,
                            [statusType]: newStatus,
                        };
                    }
                    return dealer;
                })
            );
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const filteredDealerInfo = dealerInfo.filter(dealer =>
        dealer.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.dealerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Claim Information</h1>
            <input
                type="text"
                placeholder="Search by Serial Number or Dealer Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
            />
            <div style={{ marginBottom: '20px' }}>
                <strong>Total Results: {filteredDealerInfo.length}</strong>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Serial Number</th>
                        <th style={tableHeaderStyle}>Dealer Name</th>
                        <th style={tableHeaderStyle}>Dealer Email</th>
                        <th style={tableHeaderStyle}>Dealer Phone</th>
                        <th style={tableHeaderStyle}>Dealer Address</th>
                        <th style={tableHeaderStyle}>Explanation</th>
                        <th style={tableHeaderStyle}>Defective Parts</th>
                        <th style={tableHeaderStyle}>Replacement Status</th>
                        <th style={tableHeaderStyle}>Credit Issue Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDealerInfo.map((dealer, index) => (
                        <tr key={index}>
                            <td style={tableCellStyle}>{dealer.serialNumber}</td>
                            <td style={tableCellStyle}>{dealer.dealerName}</td>
                            <td style={tableCellStyle}>{dealer.dealerEmail}</td>
                            <td style={tableCellStyle}>{dealer.dealerPhone}</td>
                            <td style={tableCellStyle}>{dealer.dealerAddress}</td>
                            <td style={tableCellStyle}>{dealer.explanation}</td>
                            <td style={tableCellStyle}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={tableHeaderStyle}>Defective Part</th>
                                            <th style={tableHeaderStyle}>Defect Date</th>
                                            <th style={tableHeaderStyle}>Replacement Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dealer.parts.map((part, partIndex) => (
                                            <tr key={partIndex}>
                                                <td style={tableCellStyle}>{part.defectivePart}</td>
                                                <td style={tableCellStyle}>{part.defectDate}</td>
                                                <td style={tableCellStyle}>{part.replacDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </td>
                            <td style={tableCellStyle}>
                                <select
                                    value={dealer.replacementStatus}
                                    onChange={(e) => handleStatusChange(dealer._id, 'replacementStatus', e.target.value)}
                                >
                                    <option value="Received">Received</option>
                                    <option value="Not Received">Not Received</option>
                                </select>
                            </td>
                            <td style={tableCellStyle}>
                                <select
                                    value={dealer.creditIssueStatus}
                                    onChange={(e) => handleStatusChange(dealer._id, 'creditIssueStatus', e.target.value)}
                                >
                                    <option value="Issued">Issued</option>
                                    <option value="Not Issued">Not Issued</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const tableHeaderStyle: React.CSSProperties = {
    borderBottom: '2px solid #ddd',
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
};

const tableCellStyle: React.CSSProperties = {
    borderBottom: '1px solid #ddd',
    padding: '10px',
};

export default ClaimTable;
