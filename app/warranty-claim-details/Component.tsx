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

  // ---------------------
  // Fetch Data
  // ---------------------
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

  // ---------------------
  // Handle Status Change
  // ---------------------
  const handleStatusChange = async (
    combinedId: string,
    statusType: string,
    newStatus: string
  ) => {
    // Robustly parse combinedId: "<claimId>-<itemId>" while tolerating additional dashes
    const dashIndex = combinedId.indexOf("-");
    const claimId = dashIndex > -1 ? combinedId.slice(0, dashIndex) : combinedId;
    const itemId = dashIndex > -1 ? combinedId.slice(dashIndex + 1) : "";

    // Optimistic UI update
    setDealerInfo((prev) =>
      prev.map((dealer) => {
        if (dealer._id === claimId || dealer._id.startsWith(claimId)) {
          const updated = { ...dealer };
          if (statusType === "replacementStatus") {
            updated.replacementStatus = newStatus;
          } else if (statusType === "creditIssueStatus") {
            updated.creditIssueStatus = newStatus;
          }
          return updated;
        }
        return dealer;
      })
    );

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
    } catch (error) {
      console.error("Error updating status:", error);
      // Roll back optimistic update on error
      setDealerInfo((prev) =>
        prev.map((dealer) => {
          if (dealer._id === claimId || dealer._id.startsWith(claimId)) {
            const reverted = { ...dealer };
            if (statusType === "replacementStatus") {
              // Flip back to the opposite of newStatus if it's one of the two known values
              reverted.replacementStatus = newStatus === "Received" ? "Not Received" : "Received";
            } else if (statusType === "creditIssueStatus") {
              reverted.creditIssueStatus = newStatus === "Issued" ? "Not Issued" : "Issued";
            }
            return reverted;
          }
          return dealer;
        })
      );
    }
  };

  // ---------------------
  // Filter & Flatten
  // ---------------------
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
          _id: `${dealer._id}-${part._id}`,
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

  // ---------------------
  // Export
  // ---------------------
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
      const largeLimit = 1000000; // fetch all
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
            _id: `${dealer._id}-${part._id}`,
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

  // ---------------------
  // Pagination
  // ---------------------
  const totalPages = Math.ceil(total / limit);
  const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

  // ---------------------
  // Render
  // ---------------------
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Claim Information</h1>

      {/* Top Controls: Search + Export */}
      <div style={topControlsStyle}>
        <input
          type="text"
          placeholder="Search by Serial Number or Dealer Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
        <button onClick={handleExportToExcel} style={buttonStyle}>
          Export Current Page to Excel
        </button>
        <button onClick={handleExportAllToExcel} style={buttonStyle}>
          Export All Claims to Excel
        </button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Total Results: {flattenedData.length}</strong> (showing {limit}{" "}
        per page)
      </div>

      <div style={itemsPerPageStyle}>
        <span>Items per page:</span>
        <select
          value={limit}
          onChange={(e) => {
            setPage(1);
            setLimit(parseInt(e.target.value));
          }}
          style={selectStyle}
        >
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      {/* Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={tableHeaderCellStyle}>Serial Number</th>
            <th style={tableHeaderCellStyle}>Dealer Name</th>
            <th style={tableHeaderCellStyle}>Dealer Email</th>
            <th style={tableHeaderCellStyle}>Dealer Phone</th>
            <th style={tableHeaderCellStyle}>Dealer Address</th>
            <th style={tableHeaderCellStyle}>Explanation</th>
            <th style={tableHeaderCellStyle}>Defective Part</th>
            <th style={tableHeaderCellStyle}>Defect Date</th>
            <th style={tableHeaderCellStyle}>Replacement Date</th>
            <th style={tableHeaderCellStyle}>Replacement Status</th>
            <th style={tableHeaderCellStyle}>Credit Issue Status</th>
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
                  style={dropdownStyle}
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
                  style={dropdownStyle}
                >
                  <option value="Issued">Issued</option>
                  <option value="Not Issued">Not Issued</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={paginationStyle}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          style={buttonStyle}
        >
          Previous
        </button>

        <span style={{ padding: "10px" }}>
          Page{" "}
          <select
            value={page}
            onChange={(e) => setPage(parseInt(e.target.value))}
            style={{ ...selectStyle, padding: "5px" }}
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
          style={buttonStyle}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClaimTable;

/* ---------------------------
   Inline Styles
------------------------------ */
const containerStyle: React.CSSProperties = {
  margin: "2rem", // more spacious margin
  fontFamily: "Arial, sans-serif",
};

const headingStyle: React.CSSProperties = {
  marginBottom: "1rem",
  color: "rgb(37, 48, 110)", // dark bluish color for heading
};

const topControlsStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const searchInputStyle: React.CSSProperties = {
  padding: "10px",
  flexGrow: 1,
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "rgb(37, 48, 110)",
  color: "white",
  padding: "10px 15px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const itemsPerPageStyle: React.CSSProperties = {
  marginBottom: "20px",
  display: "flex",
  gap: "10px",
  alignItems: "center",
};

const selectStyle: React.CSSProperties = {
  padding: "5px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  cursor: "pointer",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "14px",
};

const tableHeaderCellStyle: React.CSSProperties = {
  padding: "10px",
  textAlign: "left",
  backgroundColor: "rgb(37, 48, 110)",
  color: "white",
  fontWeight: "bold",
  border: "1px solid #ddd",
};

const tableCellStyle: React.CSSProperties = {
  borderBottom: "1px solid #ddd",
  padding: "10px",
  verticalAlign: "top",
};

const dropdownStyle: React.CSSProperties = {
  padding: "5px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  cursor: "pointer",
};

const paginationStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  marginTop: "20px",
};
