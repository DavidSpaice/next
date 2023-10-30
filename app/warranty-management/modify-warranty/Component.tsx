"use client"
import WarrantyForm from './warranty-form';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


function ModifyWarranty() {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='w-screen text-center sm:text-left flex flex-col justify-center items-center'>
        <h1>Modify Warranty</h1>
        <WarrantyForm />
      </div>
    </LocalizationProvider>
  );
}
export default ModifyWarranty