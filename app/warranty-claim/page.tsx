"use client"
import React from "react";
import WarrantyClaimForm from "./Component";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function page() {
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <WarrantyClaimForm />
      </LocalizationProvider>
    </div>
  );
}

export default page;