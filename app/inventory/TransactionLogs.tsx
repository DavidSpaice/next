"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Box,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { Transaction } from "@/types";

const TransactionLogs: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0); // Zero-based page index
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]); // <-- Added rowsPerPage to dependency array

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://airtek-warranty.onrender.com/inventory/transactions?page=${
          page + 1
        }&limit=${rowsPerPage}` // <-- Uses rowsPerPage for limit
      );
      const data = await res.json();
      setTransactions(data.data || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
    setLoading(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // <-- Added handleChangeRowsPerPage function
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  return (
    <Paper elevation={2} style={{ padding: "16px", marginTop: "16px" }}>
      <TableContainer component={Box} style={{ overflowX: "auto" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" padding={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>From Location</TableCell>
                <TableCell>To Location</TableCell>
                <TableCell>Reset Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => {
                const itemName = tx.itemId ? tx.itemId.name : "Unknown Item";
                const fromLocationName = tx.fromLocation
                  ? tx.fromLocation.name
                  : "-";
                const toLocationName = tx.toLocation ? tx.toLocation.name : "-";
                const userName = tx.userName || "Unknown User";
                return (
                  <TableRow key={tx._id}>
                    <TableCell>
                      {new Date(tx.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{itemName}</TableCell>
                    <TableCell>{tx.action}</TableCell>
                    <TableCell>{tx.quantity}</TableCell>
                    <TableCell>{fromLocationName}</TableCell>
                    <TableCell>{toLocationName}</TableCell>
                    <TableCell>{userName}</TableCell>
                    <TableCell>{tx.isReset ? "Reset" : "Active"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      {/* Pagination Controls */}
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[30, 50, 100]} // <-- Updated options
        onRowsPerPageChange={handleChangeRowsPerPage} // <-- Updated handler
      />
    </Paper>
  );
};

export default TransactionLogs;
