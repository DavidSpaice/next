"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
} from "@mui/material";
import { Transaction } from "@/types";

const TransactionLogs: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch("/api/transactions");
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
          {transactions.map((tx) => (
            <TableRow key={tx._id}>
              <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
              <TableCell>{tx.itemId.name}</TableCell>
              <TableCell>{tx.action}</TableCell>
              <TableCell>{tx.quantity}</TableCell>
              <TableCell>{tx.fromLocation?.name || "-"}</TableCell>
              <TableCell>{tx.toLocation?.name || "-"}</TableCell>
              <TableCell>{tx.isReset ? "Reset" : "Active"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default TransactionLogs;
