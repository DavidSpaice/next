"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

const SERIAL_API = "https://airtek-warranty.onrender.com/serial";

interface SerialNumberRow {
  _id: string;
  serialNumber: string;
}

export default function SerialNumberInventory() {
  const [serialNumbers, setSerialNumbers] = useState<SerialNumberRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SerialNumberRow | null>(
    null
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const fetchSerialNumbers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page + 1),
        limit: String(rowsPerPage),
      });

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      }

      const res = await fetch(`${SERIAL_API}?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Failed to fetch serial numbers");
      }

      const data = await res.json();
      setSerialNumbers(data.serialNumbers || []);
      setTotalCount(data.totalCount || 0);
      setSelectedIds([]);
    } catch (err) {
      console.error("Fetch serial numbers error:", err);
      setSerialNumbers([]);
      setTotalCount(0);
      setError("Could not load serial numbers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchSerialNumbers();
  }, [fetchSerialNumbers]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toUpperCase());
    setPage(0);
    setMessage("");
    setSelectedIds([]);
  };

  const selectedRows = serialNumbers.filter((row) =>
    selectedIds.includes(row._id)
  );
  const allVisibleSelected =
    serialNumbers.length > 0 && selectedIds.length === serialNumbers.length;
  const someVisibleSelected =
    selectedIds.length > 0 && selectedIds.length < serialNumbers.length;

  const toggleSelectAllVisible = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setSelectedIds(serialNumbers.map((row) => row._id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectedRow = (id: string) => {
    setSelectedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id]
    );
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;

    setError("");
    setMessage("");

    try {
      const params = new URLSearchParams({
        serialNumber: deleteTarget.serialNumber,
      });
      const res = await fetch(`${SERIAL_API}?${params.toString()}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to delete serial number.");
        return;
      }

      setMessage(`${deleteTarget.serialNumber} deleted.`);
      setDeleteTarget(null);

      const lastItemOnPage = serialNumbers.length === 1 && page > 0;
      if (lastItemOnPage) {
        setPage((currentPage) => currentPage - 1);
      } else {
        fetchSerialNumbers();
      }
    } catch (err) {
      console.error("Delete serial number error:", err);
      setError("Something went wrong while deleting the serial number.");
    }
  };

  const handleBulkDeleteConfirmed = async () => {
    if (selectedRows.length === 0) return;

    setError("");
    setMessage("");

    const failed: string[] = [];

    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          const params = new URLSearchParams({
            serialNumber: row.serialNumber,
          });
          const res = await fetch(`${SERIAL_API}?${params.toString()}`, {
            method: "DELETE",
          });

          if (!res.ok) {
            failed.push(row.serialNumber);
          }
        })
      );

      setBulkDeleteOpen(false);
      setSelectedIds([]);

      if (failed.length > 0) {
        setError(`Could not delete: ${failed.join(", ")}`);
      } else {
        setMessage(`${selectedRows.length} serial numbers deleted.`);
      }

      const deletingWholePage =
        selectedRows.length === serialNumbers.length && page > 0;
      if (deletingWholePage) {
        setPage((currentPage) => currentPage - 1);
      } else {
        fetchSerialNumbers();
      }
    } catch (err) {
      console.error("Bulk delete serial numbers error:", err);
      setError("Something went wrong while deleting selected serial numbers.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f5f2", px: 2, py: 4 }}>
      <Box sx={{ maxWidth: 1000, mx: "auto" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="overline" sx={{ color: "#111111" }}>
              Warranty Management
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Ready Serial Numbers
            </Typography>
            <Typography variant="body2" sx={{ color: "#4b5563", mt: 1 }}>
              Check serial numbers available for registration and remove wrong
              entries before customers use them.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              component={Link}
              href="/warranty-management/add-serial-number"
              variant="contained"
              sx={{ bgcolor: "#111111", "&:hover": { bgcolor: "#f04423" } }}
            >
              Add Serial
            </Button>
            <Button
              component={Link}
              href="/warranty-management"
              variant="outlined"
            >
              Back
            </Button>
          </Stack>
        </Stack>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <TextField
              label="Search serial number"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
            />
            <Button
              onClick={fetchSerialNumbers}
              disabled={loading}
              variant="contained"
              sx={{
                minWidth: 120,
                bgcolor: "#111111",
                "&:hover": { bgcolor: "#f04423" },
              }}
            >
              {loading ? "Loading" : "Refresh"}
            </Button>
            <Button
              onClick={() => setBulkDeleteOpen(true)}
              disabled={selectedRows.length === 0}
              color="error"
              variant="outlined"
              sx={{ minWidth: 140 }}
            >
              Delete Selected
            </Button>
          </Stack>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table size="small" aria-label="ready serial numbers">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={allVisibleSelected}
                    indeterminate={someVisibleSelected}
                    onChange={toggleSelectAllVisible}
                    inputProps={{ "aria-label": "select all serial numbers" }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Serial Number</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {serialNumbers.map((row) => (
                <TableRow
                  key={row._id}
                  selected={selectedIds.includes(row._id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(row._id)}
                      onChange={() => toggleSelectedRow(row._id)}
                      inputProps={{
                        "aria-label": `select ${row.serialNumber}`,
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.serialNumber}</TableCell>
                  <TableCell align="right">
                    <Button
                      color="error"
                      variant="outlined"
                      size="small"
                      onClick={() => setDeleteTarget(row)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {!loading && serialNumbers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    No serial numbers found.
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    Loading serial numbers...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </TableContainer>
      </Box>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle>Delete Serial Number</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          <strong>{deleteTarget?.serialNumber}</strong> from the ready serial
          number database?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirmed}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)}>
        <DialogTitle>Delete Selected Serial Numbers</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedRows.length} selected serial
          number{selectedRows.length === 1 ? "" : "s"} from the ready serial
          number database?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteOpen(false)}>Cancel</Button>
          <Button
            onClick={handleBulkDeleteConfirmed}
            color="error"
            variant="contained"
          >
            Delete Selected
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
