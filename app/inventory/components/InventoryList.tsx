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

// Import necessary SheetJS utils
import * as XLSX from "xlsx";

interface InventoryListProps {
  refreshTrigger: number;
}

// 1. Define priority items in a Set
const PRIORITY_ITEMS = new Set<string>(["GUD36W/A-D(U)", "GUD60W/A-D(U)"]);

const InventoryList: React.FC<InventoryListProps> = ({ refreshTrigger }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [page, setPage] = useState(0); // Page index starts from 0
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // State variables for search
  const [itemSearch, setItemSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, itemSearch, locationSearch, refreshTrigger]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://airtek-warranty.onrender.com/inventory?page=${
          page + 1
        }&limit=${rowsPerPage}&itemSearch=${encodeURIComponent(
          itemSearch
        )}&locationSearch=${encodeURIComponent(locationSearch)}`
      );
      const data = await res.json();

      let fetchedData: InventoryItem[] = data.data || [];
      setTotal(data.total || 0);

      // 2. Priority sorting: items in PRIORITY_ITEMS come first
      fetchedData.sort((a, b) => {
        const aName = a.itemId?.name || "";
        const bName = b.itemId?.name || "";
        const aIsPriority = PRIORITY_ITEMS.has(aName);
        const bIsPriority = PRIORITY_ITEMS.has(bName);

        // If a is priority and b is not => a first
        if (aIsPriority && !bIsPriority) return -1;
        // If b is priority and a is not => b first
        if (!aIsPriority && bIsPriority) return 1;
        // Otherwise keep their original relative order
        return 0;
      });

      setInventory(fetchedData);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventory([]); // On error, set inventory to empty array
      setTotal(0);
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

  /**
   * Export ALL inventory records to Excel (ignores current pagination).
   * This function refetches the inventory data with a high limit so we can
   * download everything, or you can add a custom "export" endpoint if you prefer.
   */
  const handleExportToExcel = async () => {
    try {
      // 1. Fetch all inventory data ignoring pagination
      const response = await fetch(
        `https://airtek-warranty.onrender.com/inventory?page=1&limit=999999&itemSearch=${encodeURIComponent(
          itemSearch
        )}&locationSearch=${encodeURIComponent(locationSearch)}`
      );
      const result = await response.json();
      const allData: InventoryItem[] = result.data || [];

      // 2. Transform data into a simple array of objects for Excel
      // (We'll flatten item/location info into strings)
      const exportData = allData.map((inv) => ({
        Item: inv.itemId?.name || "Unknown Item",
        Location: inv.locationId?.name || "Unknown Location",
        Quantity: inv.quantity,
      }));

      // 3. Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // 4. Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

      // 5. Trigger the download
      XLSX.writeFile(workbook, "Inventory.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
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

      {/* Export Button */}
      <Box display="flex" justifyContent="flex-end" marginBottom={2}>
        <Button
          variant="contained"
          style={{ backgroundColor: "#182887" }}
          onClick={handleExportToExcel}
        >
          Export All Inventory to Excel
        </Button>
      </Box>

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
                  {inventory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No inventory data available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    inventory.map((inv) => {
                      const itemName = inv.itemId
                        ? inv.itemId.name
                        : "Unknown Item";
                      const locationName = inv.locationId
                        ? inv.locationId.name
                        : "Unknown Location";
                      const key = `${inv.itemId?._id || inv._id}-${
                        inv.locationId?._id || inv._id
                      }`;
                      return (
                        <TableRow key={key}>
                          <TableCell>{itemName}</TableCell>
                          <TableCell>{locationName}</TableCell>
                          <TableCell>{inv.quantity}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
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
