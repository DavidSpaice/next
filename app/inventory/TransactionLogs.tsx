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

const DEBOUNCE_DELAY = 500;

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

  // Fetch function
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", (page + 1).toString());
      params.set("limit", rowsPerPage.toString());

      if (itemSearch.trim() !== "") {
        params.set("itemSearch", itemSearch.trim());
      }
      if (userSearch.trim() !== "") {
        params.set("userSearch", userSearch.trim());
      }
      if (startDate.trim() !== "") {
        params.set("startDate", startDate.trim());
      }
      if (endDate.trim() !== "") {
        params.set("endDate", endDate.trim());
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

  // useEffect for fetching data
  useEffect(() => {
    // We'll debounce the fetch when searching by item, user, date range
    // but immediate fetch for page/rowsPerPage is okay
    // Actually, since we rely on these states too, we apply debounce universally for simplicity.

    const handler = setTimeout(() => {
      fetchTransactions();
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [page, rowsPerPage, itemSearch, userSearch, startDate, endDate]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const handleSearch = () => {
    // Just reset page to 0 and let useEffect handle refetch with debounce
    setPage(0);
  };

  const handleReset = () => {
    // Clear all search fields and reset pagination
    setItemSearch("");
    setUserSearch("");
    setStartDate("");
    setEndDate("");
    setPage(0);
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
              onChange={(e) => {
                setItemSearch(e.target.value);
                // no fetch call here, debounce will handle it
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="User Name"
              fullWidth
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
                // debounce will handle fetching
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                // debounce will handle fetching
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                // debounce will handle fetching
              }}
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
