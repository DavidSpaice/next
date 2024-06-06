"use client"

import React, { useEffect, useState } from 'react';

interface PartInfo {
    defectivePart: string;
    defectDate: string;
    replacDate: string;
}

interface DealerInfo {
    serialNumber: string;
    dealerName: string;
    dealerEmail: string;
    dealerPhone: string;
    dealerAddress: string;
    explanation: string;
    parts: PartInfo[];
}

const ClaimTable: React.FC = () => {
    const [dealerInfo, setDealerInfo] = useState<DealerInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchDealerInfo = async () => {
            try {
                const response = await fetch('http://localhost:8500/claim/claim-info');
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

    const filteredDealerInfo = dealerInfo.filter(dealer =>
        dealer.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Claim Information</h1>
            <input
                type="text"
                placeholder="Search by Serial Number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
            />
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
