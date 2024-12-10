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
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { Transaction } from "@/types";

const TransactionLogs: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Search states
  const [itemSearch, setItemSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch function that accepts all search parameters
  const fetchTransactions = async (
    currentPage: number,
    currentRowsPerPage: number,
    currentItemSearch: string,
    currentUserSearch: string,
    currentStartDate: string,
    currentEndDate: string
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", (currentPage + 1).toString());
      params.set("limit", currentRowsPerPage.toString());

      if (currentItemSearch.trim() !== "") {
        params.set("itemSearch", currentItemSearch.trim());
      }
      if (currentUserSearch.trim() !== "") {
        params.set("userSearch", currentUserSearch.trim());
      }
      if (currentStartDate.trim() !== "") {
        params.set("startDate", currentStartDate.trim());
      }
      if (currentEndDate.trim() !== "") {
        params.set("endDate", currentEndDate.trim());
      }

      const res = await fetch(
        `https://airtek-warranty.onrender.com/inventory/transactions?${params.toString()}`
      );
      const data = await res.json();
      setTransactions(data.data || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
    setLoading(false);
  };

  // Initial load (component mount): fetch default results with no filters
  useEffect(() => {
    fetchTransactions(
      page,
      rowsPerPage,
      itemSearch,
      userSearch,
      startDate,
      endDate
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    // Fetch with the current search state
    fetchTransactions(
      newPage,
      rowsPerPage,
      itemSearch,
      userSearch,
      startDate,
      endDate
    );
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    // Fetch with updated rowsPerPage and reset to page 0
    fetchTransactions(
      0,
      newRowsPerPage,
      itemSearch,
      userSearch,
      startDate,
      endDate
    );
  };

  const handleSearch = () => {
    // When user clicks search, reset to page 0 and fetch with current states
    setPage(0);
    fetchTransactions(
      0,
      rowsPerPage,
      itemSearch,
      userSearch,
      startDate,
      endDate
    );
  };

  const handleReset = () => {
    // Clear all search fields
    const clearedItemSearch = "";
    const clearedUserSearch = "";
    const clearedStartDate = "";
    const clearedEndDate = "";

    setItemSearch(clearedItemSearch);
    setUserSearch(clearedUserSearch);
    setStartDate(clearedStartDate);
    setEndDate(clearedEndDate);

    // Reset to first page and fetch default results with no filters
    setPage(0);
    fetchTransactions(
      0,
      rowsPerPage,
      clearedItemSearch,
      clearedUserSearch,
      clearedStartDate,
      clearedEndDate
    );
  };

  return (
    <Paper elevation={2} style={{ padding: "16px", marginTop: "16px" }}>
      {/* Search Fields */}
      <Box marginBottom={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label="Item Name"
              fullWidth
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="User Name"
              fullWidth
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button
              variant="contained"
              style={{ backgroundColor: "#182887" }}
              onClick={handleSearch}
              fullWidth
            >
              Search
            </Button>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              fullWidth
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Box>

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
                <TableCell>Users</TableCell>
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
        rowsPerPageOptions={[30, 50, 100]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TransactionLogs;
