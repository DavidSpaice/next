"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import dayjs from "dayjs";
import { WarrantyType, FlattenedWarrantyRow } from "@/types";
import { flattenWarranties } from "./flattenWarranties";

export default function WarrantyTableFlattened() {
  const [warranties, setWarranties] = useState<WarrantyType[]>([]);
  const [flattenedRows, setFlattenedRows] = useState<FlattenedWarrantyRow[]>(
    []
  );
  const [totalCount, setTotalCount] = useState<number>(0);

  // Searching & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Editing
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<FlattenedWarrantyRow>>({});

  // Dialog states
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isSearching) {
      fetchWarranties(page, rowsPerPage);
    }
  }, [page, rowsPerPage, isSearching]);

  async function fetchWarranties(pageNum: number, limit: number) {
    try {
      const serverPage = pageNum + 1;
      const res = await fetch(
        `https://airtek-warranty.onrender.com/warranties?page=${serverPage}&limit=${limit}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await res.json();
      setWarranties(data.warranties);
      setTotalCount(data.totalCount);
      // Flatten
      const flattened = flattenWarranties(data.warranties);
      setFlattenedRows(flattened);
    } catch (err) {
      console.error(err);
    }
  }

  // Search by serial
  async function handleSearch() {
    if (!searchTerm) {
      // revert
      setIsSearching(false);
      setPage(0);
      fetchWarranties(0, rowsPerPage);
      return;
    }
    try {
      const res = await fetch(
        "https://airtek-warranty.onrender.com/warranties/search-warranty",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serialNumber: searchTerm }),
        }
      );
      if (!res.ok) {
        setWarranties([]);
        setFlattenedRows([]);
        setTotalCount(0);
        setIsSearching(true);
        return;
      }
      const data = await res.json();
      // flatten just that one warranty
      const singleArr = [data];
      const flattened = flattenWarranties(singleArr);
      setWarranties(singleArr);
      setFlattenedRows(flattened);
      setTotalCount(flattened.length);
      setIsSearching(true);
    } catch (err) {
      console.error(err);
      setWarranties([]);
      setFlattenedRows([]);
      setTotalCount(0);
      setIsSearching(true);
    }
  }

  // Delete
  function confirmDelete(key: string) {
    setDeleteKey(key);
  }
  async function handleDeleteConfirmed() {
    if (!deleteKey) return;
    try {
      // Here we assume the backend route uses the serialNumber or some ID
      const res = await fetch(
        `https://airtek-warranty.onrender.com/warranties/delete-warranty/${deleteKey}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        throw new Error("Delete failed");
      }
      setSuccessMessage("Deleted successfully!");
      setSuccessDialogOpen(true);

      if (isSearching) {
        handleSearch();
      } else {
        fetchWarranties(page, rowsPerPage);
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleteKey(null);
    }
  }
  function handleDeleteCancelled() {
    setDeleteKey(null);
  }

  // Edit
  function startEditing(row: FlattenedWarrantyRow) {
    // Could use serialNumber or _id
    setEditingKey(row.serialNumber || row._id || "");
    setEditData({ ...row });
  }
  function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  }
  function confirmSave() {
    setConfirmSaveOpen(true);
  }
  async function handleSaveConfirmed() {
    if (!editingKey) return;
    try {
      const res = await fetch(
        `https://airtek-warranty.onrender.com/warranties/modify-warranty/${editingKey}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editData),
        }
      );
      if (!res.ok) throw new Error("Update failed");

      setSuccessMessage("Updated successfully!");
      setSuccessDialogOpen(true);

      if (isSearching) {
        handleSearch();
      } else {
        fetchWarranties(page, rowsPerPage);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setEditingKey(null);
      setEditData({});
      setConfirmSaveOpen(false);
    }
  }
  function handleSaveCancelled() {
    setConfirmSaveOpen(false);
  }
  function cancelEdit() {
    setEditingKey(null);
    setEditData({});
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#182887" }}>
        Warranty Management
      </Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="Search by Serial Number"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          color="primary"
          variant="contained"
          style={{
            backgroundColor: "rgb(37, 48, 110)",
            color: "white",
          }}
          onClick={handleSearch}
        >
          Search
        </Button>

        <Link
          href="/warranty-management/add-serial-number"
          style={{
            textDecoration: "none",
            backgroundColor: "#fff",
            padding: "8px 16px",
            borderRadius: 4,
            border: "1px solid rgb(37, 48, 110)",
            color: "rgb(37, 48, 110)",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
          }}
        >
          Add Serial Number
        </Link>
      </Stack>

      <TableContainer
        component={Paper}
        sx={{ maxHeight: 600, overflowX: "auto" }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#182887" }}>
              {/*        <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                Install Type
              </TableCell> */}
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                First Name
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                Last Name
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                Address
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                City
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                State
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                Postal
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                Country
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                Phone
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                Ext
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                Dealer Name
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                Dealer Email
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                Dealer Phone
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                Dealer Address
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                Item Model
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                Item Serial
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                Install Date
              </TableCell>
              <TableCell sx={{ color: "#111111", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flattenedRows.map((row, idx) => {
              const rowKey = row.serialNumber || row._id || String(idx);
              const isEditing = editingKey === rowKey;

              return (
                <TableRow key={rowKey}>
                  {/* installType */}
                  {/*            <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="installType"
                        value={editData.installType ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.installType
                    )}
                  </TableCell> */}

                  {/* firstName */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="firstName"
                        value={editData.firstName ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.firstName
                    )}
                  </TableCell>

                  {/* lastName */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="lastName"
                        value={editData.lastName ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.lastName
                    )}
                  </TableCell>

                  {/* email */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="email"
                        value={editData.email ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.email
                    )}
                  </TableCell>

                  {/* streetAddress */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="streetAddress"
                        value={editData.streetAddress ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.streetAddress
                    )}
                  </TableCell>

                  {/* city */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="city"
                        value={editData.city ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.city
                    )}
                  </TableCell>

                  {/* stateProvince */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="stateProvince"
                        value={editData.stateProvince ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.stateProvince
                    )}
                  </TableCell>

                  {/* postalCode */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="postalCode"
                        value={editData.postalCode ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.postalCode
                    )}
                  </TableCell>

                  {/* country */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="country"
                        value={editData.country ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.country
                    )}
                  </TableCell>

                  {/* phone */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="phone"
                        value={editData.phone ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.phone
                    )}
                  </TableCell>

                  {/* extension */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="extension"
                        value={editData.extension ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.extension
                    )}
                  </TableCell>

                  {/* dealerName */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="dealerName"
                        value={editData.dealerName ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.dealerName
                    )}
                  </TableCell>

                  {/* dealerEmail */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="dealerEmail"
                        value={editData.dealerEmail ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.dealerEmail
                    )}
                  </TableCell>

                  {/* dealerPhone */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="dealerPhone"
                        value={editData.dealerPhone ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.dealerPhone
                    )}
                  </TableCell>

                  {/* dealerAddress */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="dealerAddress"
                        value={editData.dealerAddress ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.dealerAddress
                    )}
                  </TableCell>

                  {/* model */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="model"
                        value={editData.model ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.model
                    )}
                  </TableCell>

                  {/* serialNumber */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="serialNumber"
                        value={editData.serialNumber ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      row.serialNumber
                    )}
                  </TableCell>

                  {/* installationDate = string | null */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        name="installationDate"
                        value={editData.installationDate ?? ""}
                        onChange={handleEditChange}
                      />
                    ) : row.installationDate ? (
                      dayjs(row.installationDate).format("MM-DD-YYYY")
                    ) : (
                      "N/A"
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    {isEditing ? (
                      <>
                        <Button
                          variant="outlined"
                          color="success"
                          sx={{ mr: 1 }}
                          onClick={confirmSave}
                        >
                          Save
                        </Button>
                        <Button variant="outlined" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        {/*  <Button
                          color="primary"
                          variant="contained"
                          style={{
                            backgroundColor: "rgb(37, 48, 110)",
                            color: "white",
                          }}
                          onClick={() => startEditing(row)}
                        >
                          Edit
                        </Button> */}
                        <Button
                          color="secondary"
                          variant="outlined"
                          onClick={() =>
                            confirmDelete(row.serialNumber || row._id || "")
                          }
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}

            {isSearching && flattenedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={19} align="center">
                  No warranty found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination if not searching */}
      {!isSearching && (
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(_evt, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            const newLimit = parseInt(e.target.value, 10);
            setRowsPerPage(newLimit);
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      )}

      {/* Dialog: Delete */}
      <Dialog open={!!deleteKey} onClose={handleDeleteCancelled}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancelled}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Save Confirm */}
      <Dialog open={confirmSaveOpen} onClose={handleSaveCancelled}>
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>Save these changes?</DialogContent>
        <DialogActions>
          <Button onClick={handleSaveCancelled}>Cancel</Button>
          <Button color="primary" onClick={handleSaveConfirmed}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
      >
        <DialogTitle>Success</DialogTitle>
        <DialogContent>{successMessage}</DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
