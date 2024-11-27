import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  TableContainer,
  Box,
} from "@mui/material";
import { Transaction } from "@/types";

const TransactionLogs: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch(
        "https://airtek-warranty.onrender.com/inventory/transactions"
      );
      const data = await res.json();
      setTransactions(data);
    };
    fetchTransactions();
  }, []);

  return (
    <Paper elevation={2} style={{ padding: "16px", marginTop: "16px" }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Transaction Logs
      </Typography>
      <TableContainer component={Box} style={{ overflowX: "auto" }}>
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
                  <TableCell>{tx.isReset ? "Reset" : "Active"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TransactionLogs;
