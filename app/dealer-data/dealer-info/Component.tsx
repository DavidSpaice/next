"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";

interface Dealer {
  _id: string;
  dealerName: string;
  dealerEmail: string;
  dealerPhone: number;
  dealerAddress: string;
  location: string;
  __v: number;
}

const Dealers: React.FC = () => {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://airtek-warranty.onrender.com/dealerData"
      );
      const data: Dealer[] = await response.json();
      setDealers(data);
    };

    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <TextField
        label="Search Dealer by Name"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        style={{ margin: 20 }}
      />
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead style={{ backgroundColor: "rgb(37, 48, 110)" }}>
            <TableRow>
              <TableCell style={{ color: "white" }}>Dealer Name</TableCell>
              <TableCell style={{ color: "white" }}>Email</TableCell>
              <TableCell style={{ color: "white" }}>Phone</TableCell>
              <TableCell style={{ color: "white" }}>Address</TableCell>
              <TableCell style={{ color: "white" }}>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dealers
              .filter((dealer) =>
                dealer.dealerName.toLowerCase().includes(search.toLowerCase())
              )
              .map((dealer) => (
                <TableRow key={dealer._id}>
                  <TableCell component="th" scope="row">
                    {dealer.dealerName}
                  </TableCell>
                  <TableCell>{dealer.dealerEmail}</TableCell>
                  <TableCell>{dealer.dealerPhone}</TableCell>
                  <TableCell>{dealer.dealerAddress}</TableCell>
                  <TableCell>{dealer.location}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dealers;
