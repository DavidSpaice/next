"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  TableContainer,
  CircularProgress,
} from "@mui/material";
import { InventoryItem } from "@/types";

interface InventoryListProps {
  refreshTrigger: number;
}

const InventoryList: React.FC<InventoryListProps> = ({ refreshTrigger }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [page, setPage] = useState(0); // Page index starts from 0
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // State variables for search
  const [itemSearch, setItemSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    rowsPerPage,
    itemSearch,
    locationSearch,
    refreshTrigger, // Refetch when refreshTrigger changes
  ]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8500/inventory?page=${
          page + 1
        }&limit=${rowsPerPage}&itemSearch=${encodeURIComponent(
          itemSearch
        )}&locationSearch=${encodeURIComponent(locationSearch)}`
      );
      const data = await res.json();
      setInventory(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
    setLoading(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handling search inputs
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(0); // Reset to first page on new search
    fetchInventory();
  };

  const handleReset = () => {
    setItemSearch("");
    setLocationSearch("");
    setPage(0);
    fetchInventory();
  };

  return (
    <div>
      {/* Search Form */}
      <Paper elevation={2} style={{ padding: "16px", marginBottom: "16px" }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                label="Item Name"
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Location Name"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: "#182887" }}
                >
                  Search
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outlined"
                  color="secondary"
                  style={{ marginLeft: "10px" }}
                >
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Inventory Table */}
      <Paper elevation={2}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            padding={2}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Location Name</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.map((inv) => (
                    <TableRow key={`${inv.itemId._id}-${inv.locationId._id}`}>
                      <TableCell>{inv.itemId.name}</TableCell>
                      <TableCell>{inv.locationId.name}</TableCell>
                      <TableCell>{inv.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Pagination Controls */}
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>
    </div>
  );
};

export default InventoryList;
