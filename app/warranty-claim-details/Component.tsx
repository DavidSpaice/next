"use client";
import React, { useEffect, useState, useMemo } from "react";
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

interface FlattenedRow {
  _id: string; // claim-item combined ID
  serialNumber: string;
  dealerName: string;
  dealerEmail: string;
  dealerPhone: string;
  dealerAddress: string;
  explanation: string;
  defectivePart: string;
  defectDate: string;
  replacDate: string;
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

      setDealerInfo((prevDealerInfo) =>
        prevDealerInfo.map((dealer) => {
          if (dealer._id.startsWith(claimId)) {
            const updatedDealer = { ...dealer };
            updatedDealer.parts = updatedDealer.parts.map((part) => {
              if (part._id === itemId) {
                if (statusType === "replacementStatus") {
                  updatedDealer.replacementStatus = newStatus;
                } else if (statusType === "creditIssueStatus") {
                  updatedDealer.creditIssueStatus = newStatus;
                }
              }
              return part;
            });
            return updatedDealer;
          }
          return dealer;
        })
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredDealerInfo = useMemo(() => {
    return dealerInfo.filter(
      (dealer) =>
        dealer.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.dealerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [dealerInfo, searchTerm]);

  const flattenedData: FlattenedRow[] = useMemo(() => {
    const rows: FlattenedRow[] = [];
    filteredDealerInfo.forEach((dealer) => {
      dealer.parts.forEach((part) => {
        rows.push({
          _id: dealer._id,
          serialNumber: dealer.serialNumber,
          dealerName: dealer.dealerName,
          dealerEmail: dealer.dealerEmail,
          dealerPhone: dealer.dealerPhone,
          dealerAddress: dealer.dealerAddress,
          explanation: dealer.explanation,
          defectivePart: part.defectivePart,
          defectDate: part.defectDate,
          replacDate: part.replacDate,
          replacementStatus: dealer.replacementStatus,
          creditIssueStatus: dealer.creditIssueStatus,
        });
      });
    });
    return rows;
  }, [filteredDealerInfo]);

  const handleExportToExcel = () => {
    const exportData = flattenedData.map((row) => ({
      SerialNumber: row.serialNumber,
      DealerName: row.dealerName,
      DealerEmail: row.dealerEmail,
      DealerPhone: row.dealerPhone,
      DealerAddress: row.dealerAddress,
      Explanation: row.explanation,
      ReplacementStatus: row.replacementStatus,
      CreditIssueStatus: row.creditIssueStatus,
      DefectivePart: row.defectivePart,
      DefectDate: row.defectDate,
      ReplacementDate: row.replacDate,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Claims_Current_Page");
    XLSX.writeFile(wb, `claims_page_${page}.xlsx`);
  };

  const handleExportAllToExcel = async () => {
    try {
      const largeLimit = 1000000; // Fetch all
      const response = await fetch(
        `https://airtek-warranty.onrender.com/claim/claim-info?page=1&limit=${largeLimit}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const allDealerInfo: DealerInfo[] = data.results || [];

      const allFlattenedData: FlattenedRow[] = [];
      allDealerInfo.forEach((dealer) => {
        dealer.parts.forEach((part) => {
          allFlattenedData.push({
            _id: dealer._id,
            serialNumber: dealer.serialNumber,
            dealerName: dealer.dealerName,
            dealerEmail: dealer.dealerEmail,
            dealerPhone: dealer.dealerPhone,
            dealerAddress: dealer.dealerAddress,
            explanation: dealer.explanation,
            defectivePart: part.defectivePart,
            defectDate: part.defectDate,
            replacDate: part.replacDate,
            replacementStatus: dealer.replacementStatus,
            creditIssueStatus: dealer.creditIssueStatus,
          });
        });
      });

      const exportData = allFlattenedData.map((row) => ({
        SerialNumber: row.serialNumber,
        DealerName: row.dealerName,
        DealerEmail: row.dealerEmail,
        DealerPhone: row.dealerPhone,
        DealerAddress: row.dealerAddress,
        Explanation: row.explanation,
        ReplacementStatus: row.replacementStatus,
        CreditIssueStatus: row.creditIssueStatus,
        DefectivePart: row.defectivePart,
        DefectDate: row.defectDate,
        ReplacementDate: row.replacDate,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "All_Claims");
      XLSX.writeFile(wb, `all_claims.xlsx`);
    } catch (error) {
      console.error("Error exporting all claims:", error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  // Generate page options
  const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

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
          Export Current Page to Excel
        </button>
        <button onClick={handleExportAllToExcel} style={{ padding: "10px" }}>
          Export All Claims to Excel
        </button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Total Results: {flattenedData.length}</strong> (showing {limit}{" "}
        per page)
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
            <th style={tableHeaderStyle}>Defective Part</th>
            <th style={tableHeaderStyle}>Defect Date</th>
            <th style={tableHeaderStyle}>Replacement Date</th>
            <th style={tableHeaderStyle}>Replacement Status</th>
            <th style={tableHeaderStyle}>Credit Issue Status</th>
          </tr>
        </thead>
        <tbody>
          {flattenedData.map((row, index) => (
            <tr key={index}>
              <td style={tableCellStyle}>{row.serialNumber}</td>
              <td style={tableCellStyle}>{row.dealerName}</td>
              <td style={tableCellStyle}>{row.dealerEmail}</td>
              <td style={tableCellStyle}>{row.dealerPhone}</td>
              <td style={tableCellStyle}>{row.dealerAddress}</td>
              <td style={tableCellStyle}>{row.explanation}</td>
              <td style={tableCellStyle}>{row.defectivePart}</td>
              <td style={tableCellStyle}>{row.defectDate}</td>
              <td style={tableCellStyle}>{row.replacDate}</td>
              <td style={tableCellStyle}>
                <select
                  value={row.replacementStatus}
                  onChange={(e) =>
                    handleStatusChange(
                      row._id,
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
                  value={row.creditIssueStatus}
                  onChange={(e) =>
                    handleStatusChange(
                      row._id,
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

      {/* Unified Pagination Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
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

        {/* Combine the "Page {page} of {totalPages}" with the dropdown */}
        <span style={{ padding: "10px" }}>
          Page{" "}
          <select
            value={page}
            onChange={(e) => setPage(parseInt(e.target.value))}
            style={{ padding: "5px" }}
          >
            {pageOptions.map((pageNum) => (
              <option value={pageNum} key={pageNum}>
                {pageNum}
              </option>
            ))}
          </select>{" "}
          of {totalPages}
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

export default ClaimTable;
