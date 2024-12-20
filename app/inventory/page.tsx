"use client";

import React, { useState } from "react";
import InventoryForm from "./components/InventoryForm";
import InventoryList from "./components/InventoryList";
import AddNewItemWithQuantityForm from "./components/AddNewItemForm";
import { Container, Typography, Grid, Paper, Button, Box } from "@mui/material";
import TransactionLogs from "./TransactionLogs";
import { useSession, signOut } from "next-auth/react";
import withAuth from "./components/withAuth";

const Home: React.FC = () => {
  const [refreshInventory, setRefreshInventory] = useState(0);

  const { data: session } = useSession();

  // Function to trigger refresh
  const handleInventoryUpdate = () => {
    setRefreshInventory((prev) => prev + 1);
  };

  const handleItemAdded = () => {
    handleInventoryUpdate();
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "32px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3" component="h1" gutterBottom>
          Inventory Management System
        </Typography>
        <Button variant="outlined" color="secondary" onClick={() => signOut()}>
          Sign Out
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>
        Welcome, {session?.user?.name} ({session?.user?.role})
      </Typography>

      <Grid container spacing={4}>
        {/* Current Inventory - Visible to all */}
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Current Inventory
            </Typography>
            <InventoryList refreshTrigger={refreshInventory} />
          </Paper>
        </Grid>

        {/* Update Inventory - Visible to admin */}
        {(session?.user?.role === "guest" ||
          session?.user?.role === "user" ||
          session?.user?.role === "admin" ||
          session?.user.role == "super") && (
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
        )}

        {/* Add New Items and Transaction Logs - Visible to normal users */}
        {session?.user.role == "super" && (
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: "16px" }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Add New Items
              </Typography>
              <AddNewItemWithQuantityForm onItemAdded={handleItemAdded} />
            </Paper>
          </Grid>
        )}

        {(session?.user?.role === "admin" || session?.user.role == "super") && (
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: "16px" }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Transaction Logs
              </Typography>
              <TransactionLogs />
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default withAuth(Home);
