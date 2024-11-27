"use client";
import React, { useState } from "react";
import InventoryForm from "./components/InventoryForm";
import InventoryList from "./components/InventoryList";
import AddNewItemWithQuantityForm from "./components/AddNewItemForm";
import { Container, Typography, Grid, Paper } from "@mui/material";
import TransactionLogs from "./TransactionLogs";

const Home: React.FC = () => {
  const [refreshInventory, setRefreshInventory] = useState(0);

  // Function to trigger refresh
  const handleInventoryUpdate = () => {
    setRefreshInventory((prev) => prev + 1);
  };

  const handleItemAdded = () => {
    handleInventoryUpdate();
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "32px" }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Inventory Management System
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Current Inventory
            </Typography>
            <InventoryList refreshTrigger={refreshInventory} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Update Inventory
            </Typography>
            <InventoryForm
              onInventoryUpdate={handleInventoryUpdate}
              refreshTrigger={refreshInventory}
            />
          </Paper>
        </Grid>

        {/* <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Add New Items
            </Typography>
            <AddNewItemWithQuantityForm onItemAdded={handleItemAdded} />
          </Paper>
        </Grid> */}
{/* 
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Transaction Logs
            </Typography>
            <TransactionLogs />
          </Paper>
        </Grid> */}

      </Grid>
    </Container>
  );
};

export default Home;
