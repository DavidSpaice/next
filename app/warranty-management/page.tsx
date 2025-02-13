import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <Link href="/warranty-management/edit-warranty">
        <button className="bg-[#182887] px-2 text-white hover:text-gray-300">
          Warranty Management
        </button>
      </Link>
    </div>
  );
}

export default page;
