"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Grid,
} from "@mui/material";
import { debounce } from "lodash";

interface Dealer {
  _id: string;
  dealerName: string;
  dealerEmail: string;
  dealerPhone: number;
  dealerAddress: string;
  location: string;
  __v: number;
}

// Define allowed locations
const allowedLocations = [
  "Manitoba",
  "Ontario",
  "Nova Scotia",
  "Quebec",
  "Calgary",
  "Vancouver",
];

const Dealers: React.FC = () => {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [search, setSearch] = useState("");
  // Edit state
  const [editingDealerId, setEditingDealerId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Partial<Dealer>>({});

  // Pagination states
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(30);
  const [totalDealers, setTotalDealers] = useState<number>(0);

  // Confirmation Dialog states
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [confirmDealerId, setConfirmDealerId] = useState<string | null>(null);
  const [confirmData, setConfirmData] = useState<Partial<Dealer>>({});

  const router = useRouter();

  // Calculate total pages based on total dealers and current limit
  const totalPages = Math.ceil(totalDealers / limit);

  // Debounced fetch function to handle search input
  const debouncedFetch = useCallback(
    debounce(
      async (
        currentPage: number,
        currentLimit: number,
        currentSearch: string
      ) => {
        try {
          const queryParams = new URLSearchParams({
            page: currentPage.toString(),
            limit: currentLimit.toString(),
            search: currentSearch,
          });

          const response = await fetch(
            `https://airtek-warranty.onrender.com/dealerData/dealers?${queryParams.toString()}`
          );
          const json = await response.json();

          const { data, totalDealers } = json;
          setDealers(data);
          setTotalDealers(totalDealers);
        } catch (error) {
          console.error("Error fetching dealer data:", error);
        }
      },
      500
    ), // 500ms debounce
    []
  );

  // Fetch dealers whenever page, limit, or search changes
  useEffect(() => {
    debouncedFetch(page, limit, search);
  }, [page, limit, search, debouncedFetch]);

  // Search handler with debouncing already handled
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1); // Reset to first page on new search
  };

  // Add new dealer
  const handleAddDealer = () => {
    router.push("https://next-nine-pied.vercel.app/dealer-data/add-dealer");
  };

  // Begin editing a dealer
  const handleEdit = (dealer: Dealer) => {
    setEditingDealerId(dealer._id);
    setEditedData(dealer);
  };

  // Open confirmation dialog instead of immediately saving
  const handleSaveClick = (dealerId: string) => {
    setConfirmDealerId(dealerId);
    setConfirmData(editedData);
    setOpenConfirm(true);
  };

  // Confirm and proceed with saving
  const handleConfirmSave = async () => {
    if (!confirmDealerId) return;

    try {
      const response = await fetch(
        `https://airtek-warranty.onrender.com/dealerData/${confirmDealerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(confirmData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedDealer = await response.json();

      // Update the local dealers state
      setDealers((prevDealers) =>
        prevDealers.map((d) => (d._id === confirmDealerId ? updatedDealer : d))
      );

      // Reset editing and confirmation states
      setEditingDealerId(null);
      setEditedData({});
      setConfirmDealerId(null);
      setConfirmData({});
      setOpenConfirm(false);
    } catch (error) {
      console.error("Error updating dealer data:", error);
      // Optionally, you can show an error message to the user here
      setOpenConfirm(false);
    }
  };

  // Cancel saving
  const handleCancelSave = () => {
    setOpenConfirm(false);
    setConfirmDealerId(null);
    setConfirmData({});
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingDealerId(null);
    setEditedData({});
  };

  // Handle change in limit (records per page)
  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    setLimit(Number(event.target.value));
    setPage(1); // Reset to first page whenever limit changes
  };

  // Pagination controls
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="m-10">
      {/* Top bar with search and "Add Dealer" */}
      <div className="w-full flex flex-row justify-around items-center">
        <TextField
          label="Search Dealer by Name"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          style={{ marginBottom: 20, width: "50%" }}
        />
        <Button
          variant="contained"
          className="list-btn"
          onClick={handleAddDealer}
          style={{ marginBottom: 20 }}
        >
          Add New Dealer
        </Button>
      </div>

      {/* Pagination controls (limit & page) */}
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Select
          value={limit}
          onChange={handleLimitChange}
          style={{ width: 150 }}
          size="small"
        >
          <MenuItem value={30}>30 per page</MenuItem>
          <MenuItem value={50}>50 per page</MenuItem>
          <MenuItem value={100}>100 per page</MenuItem>
        </Select>

        <Button
          variant="outlined"
          onClick={handlePrevPage}
          disabled={page <= 1}
        >
          Prev
        </Button>
        <Button
          variant="outlined"
          onClick={handleNextPage}
          disabled={page >= totalPages}
        >
          Next
        </Button>

        <Typography variant="body1">
          Page {page} of {totalPages || 1}
        </Typography>
      </div>

      {/* Dealers Table */}
      <TableContainer component={Paper}>
        <Table aria-label="dealers table">
          <TableHead style={{ backgroundColor: "rgb(37, 48, 110)" }}>
            <TableRow>
              <TableCell style={{ color: "white" }}>Dealer ID</TableCell>
              <TableCell style={{ color: "white" }}>Dealer Name</TableCell>
              <TableCell style={{ color: "white" }}>Email</TableCell>
              <TableCell style={{ color: "white" }}>Phone</TableCell>
              <TableCell style={{ color: "white" }}>Address</TableCell>
              <TableCell style={{ color: "white" }}>Location</TableCell>
              <TableCell style={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dealers.map((dealer) => (
              <TableRow key={dealer._id}>
                {/* Dealer ID (not editable) */}
                <TableCell component="th" scope="row">
                  {dealer._id}
                </TableCell>

                {/* Dealer Name */}
                <TableCell>
                  {editingDealerId === dealer._id ? (
                    <TextField
                      value={editedData.dealerName ?? ""}
                      onChange={(e) =>
                        setEditedData((prev) => ({
                          ...prev,
                          dealerName: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    dealer.dealerName
                  )}
                </TableCell>

                {/* Dealer Email */}
                <TableCell>
                  {editingDealerId === dealer._id ? (
                    <TextField
                      value={editedData.dealerEmail ?? ""}
                      onChange={(e) =>
                        setEditedData((prev) => ({
                          ...prev,
                          dealerEmail: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    dealer.dealerEmail
                  )}
                </TableCell>

                {/* Dealer Phone */}
                <TableCell>
                  {editingDealerId === dealer._id ? (
                    <TextField
                      value={editedData.dealerPhone ?? ""}
                      onChange={(e) =>
                        setEditedData((prev) => ({
                          ...prev,
                          dealerPhone: Number(e.target.value),
                        }))
                      }
                      inputProps={{
                        min: 1,
                        onWheel: (e) => {
                          const inputElement =
                            e.currentTarget as HTMLInputElement;
                          inputElement.blur();
                        },
                      }}
                      variant="outlined"
                      size="small"
                      type="number"
                    />
                  ) : (
                    dealer.dealerPhone
                  )}
                </TableCell>

                {/* Dealer Address */}
                <TableCell>
                  {editingDealerId === dealer._id ? (
                    <TextField
                      value={editedData.dealerAddress ?? ""}
                      onChange={(e) =>
                        setEditedData((prev) => ({
                          ...prev,
                          dealerAddress: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    dealer.dealerAddress
                  )}
                </TableCell>

                {/* Dealer Location */}
                <TableCell>
                  {editingDealerId === dealer._id ? (
                    <Select
                      value={editedData.location ?? ""}
                      onChange={(e: SelectChangeEvent<string>) =>
                        setEditedData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
                      fullWidth
                    >
                      {allowedLocations.map((loc) => (
                        <MenuItem key={loc} value={loc}>
                          {loc}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    dealer.location
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  {editingDealerId === dealer._id ? (
                    <>
                      <Button
                        variant="outlined"
                        onClick={() => handleSaveClick(dealer._id)}
                        style={{
                          marginRight: 8,
                          backgroundColor: "rgb(37, 48, 110)",
                          color: "white",
                        }}
                      >
                        Save
                      </Button>
                      <Button variant="outlined" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => handleEdit(dealer)}
                      style={{
                        backgroundColor: "rgb(37, 48, 110)",
                        color: "white",
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={handleCancelSave}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Changes</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Please review the changes below before saving:
          </DialogContentText>
          <Grid container spacing={2} style={{ marginTop: 10 }}>
            {/* Display each field with new values */}
            {confirmData.dealerName && (
              <>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Dealer Name:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1">
                    {confirmData.dealerName}
                  </Typography>
                </Grid>
              </>
            )}

            {confirmData.dealerEmail && (
              <>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Email:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1">
                    {confirmData.dealerEmail}
                  </Typography>
                </Grid>
              </>
            )}

            {confirmData.dealerPhone !== undefined && (
              <>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Phone:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1">
                    {confirmData.dealerPhone}
                  </Typography>
                </Grid>
              </>
            )}

            {confirmData.dealerAddress && (
              <>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Address:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1">
                    {confirmData.dealerAddress}
                  </Typography>
                </Grid>
              </>
            )}

            {confirmData.location && (
              <>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Location:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1">
                    {confirmData.location}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelSave}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSave}
            color="primary"
            variant="contained"
            style={{
              backgroundColor: "rgb(37, 48, 110)",
              color: "white",
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dealers;
