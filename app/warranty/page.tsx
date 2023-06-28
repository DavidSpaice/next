"use client"
import React from "react";
import Component from "./Component";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function page() {
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Component />
      </LocalizationProvider>
    </div>
  );
}

export default page;
