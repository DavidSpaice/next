"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(30);

  const fetchData = async (p: number = page, l: number = limit) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://airtek-warranty.onrender.com/claim/claim-info?page=${p}&limit=${l}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDealerInfo(data.results);
      setTotal(data.total);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dealer info:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleStatusChange = async (
    combinedId: string,
    statusType: string,
    newStatus: string
  ) => {
    const [claimId, itemId] = combinedId.split("-");
    try {
      const response = await fetch(
        "https://airtek-warranty.onrender.com/claim/update-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            claimId,
            itemId,
            statusType,
            newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the status in the state
      setDealerInfo((prevDealerInfo) =>
        prevDealerInfo.map((dealer) => {
          if (dealer._id === combinedId) {
            const updatedDealer = { ...dealer };
            if (statusType === "replacementStatus") {
              updatedDealer.replacementStatus = newStatus;
            } else if (statusType === "creditIssueStatus") {
              updatedDealer.creditIssueStatus = newStatus;
            }
            return updatedDealer;
          }
          return dealer;
        })
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredDealerInfo = dealerInfo.filter(
    (dealer) =>
      dealer.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dealer.dealerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportToExcel = () => {
    // Flatten data for export
    const exportData = filteredDealerInfo.map((dealer) => {
      return {
        SerialNumber: dealer.serialNumber,
        DealerName: dealer.dealerName,
        DealerEmail: dealer.dealerEmail,
        DealerPhone: dealer.dealerPhone,
        DealerAddress: dealer.dealerAddress,
        Explanation: dealer.explanation,
        ReplacementStatus: dealer.replacementStatus,
        CreditIssueStatus: dealer.creditIssueStatus,
        Parts: dealer.parts
          .map(
            (p) =>
              `${p.defectivePart} (Defect Date: ${p.defectDate}, Replacement Date: ${p.replacDate})`
          )
          .join("; "),
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Claims");
    XLSX.writeFile(wb, `claims_page_${page}.xlsx`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Claim Information</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by Serial Number or Dealer Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "10px", flexGrow: 1 }}
        />
        <button onClick={handleExportToExcel} style={{ padding: "10px" }}>
          Export to Excel
        </button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Total Results: {filteredDealerInfo.length}</strong> (showing{" "}
        {limit} per page)
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <span>Items per page:</span>
        <select
          value={limit}
          onChange={(e) => {
            setPage(1);
            setLimit(parseInt(e.target.value));
          }}
        >
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}
      >
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
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={nestedTableHeaderStyle}>Defective Part</th>
                      <th style={nestedTableHeaderStyle}>Defect Date</th>
                      <th style={nestedTableHeaderStyle}>Replacement Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dealer.parts.map((part, partIndex) => (
                      <tr key={partIndex}>
                        <td style={nestedTableCellStyle}>
                          {part.defectivePart}
                        </td>
                        <td style={nestedTableCellStyle}>{part.defectDate}</td>
                        <td style={nestedTableCellStyle}>{part.replacDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
              <td style={tableCellStyle}>
                <select
                  value={dealer.replacementStatus}
                  onChange={(e) =>
                    handleStatusChange(
                      dealer._id,
                      "replacementStatus",
                      e.target.value
                    )
                  }
                >
                  <option value="Received">Received</option>
                  <option value="Not Received">Not Received</option>
                </select>
              </td>
              <td style={tableCellStyle}>
                <select
                  value={dealer.creditIssueStatus}
                  onChange={(e) =>
                    handleStatusChange(
                      dealer._id,
                      "creditIssueStatus",
                      e.target.value
                    )
                  }
                >
                  <option value="Issued">Issued</option>
                  <option value="Not Issued">Not Issued</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          style={{ padding: "10px" }}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() =>
            setPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          disabled={page === totalPages}
          style={{ padding: "10px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const tableHeaderStyle: React.CSSProperties = {
  borderBottom: "2px solid #ddd",
  padding: "10px",
  textAlign: "left",
  backgroundColor: "#f2f2f2",
  fontWeight: "bold",
};

const tableCellStyle: React.CSSProperties = {
  borderBottom: "1px solid #ddd",
  padding: "10px",
  verticalAlign: "top",
};

const nestedTableHeaderStyle: React.CSSProperties = {
  borderBottom: "1px solid #ddd",
  backgroundColor: "#e6e6e6",
  padding: "5px",
  fontWeight: "bold",
};

const nestedTableCellStyle: React.CSSProperties = {
  borderBottom: "1px solid #ddd",
  padding: "5px",
};

export default ClaimTable;
