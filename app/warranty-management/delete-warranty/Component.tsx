"use client"
import Link from "next/link";
import { useState } from "react";

const DeleteWarranty = () => {
  const [serialNumber, setSerialNumber] = useState("");
  const [message, setMessage] = useState("");

  const handleDeleteWarranty = () => {
    // Ensure the serial number is not empty
    if (serialNumber.trim() === "") {
      setMessage("Please enter a serial number.");
      return;
    }

    // Send a DELETE request to delete the warranty
    fetch(`http://localhost:8500/warranties/delete-warranty/${serialNumber}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Warranty deleted successfully
          setMessage("Warranty deleted successfully.");
        } else if (response.status === 404) {
          // Warranty not found
          setMessage("Warranty not found. It may not have been registered.");
        } else {
          // Handle other errors as needed
          setMessage("Error deleting warranty. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error deleting warranty", error);
        setMessage("Error deleting warranty. Please try again.");
      });
  };

  return (
    <div className='w-screen text-center sm:text-left flex flex-col justify-center items-center'>
      <h1>Delete Warranty</h1>
      <input
        type="text"
        placeholder="Serial Number"
        value={serialNumber}
        onChange={(e) => setSerialNumber(e.target.value)}
      />
      <button className='border bg-[#e13838] px-2  hover:text-gray-300 text-white' onClick={handleDeleteWarranty}>Delete Warranty</button>
      <p>{message}</p>

      <div>
        <Link href="/warranty-management" className='border bg-[#182887] px-2  hover:text-gray-300 text-white'>Back</Link>
      </div>
    </div>
  );
};

export default DeleteWarranty;
