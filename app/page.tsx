import React from "react";
import Link from "next/link";

// async function getData() {
//   const firstResponse = await fetch(
//     "https://airtek-warranty.onrender.com/warranties"
//   );

//   if (!firstResponse.ok) {
//     throw new Error("Failed to fetch data");
//   }
//   return firstResponse.json();
// }

export default async function Home() {
  // const data = await getData();

  return (
    <main className="flex flex-col h-screen items-center">
      {/* <p className="font-semibold text-lg">Explore Our Warranty Services</p> */}
      <br />
      <div>
        <div className="font-semibold text-sm">
          <Link href="/warranty" className="hover:bg-gray-200">
            Warranty Registration
          </Link>
        </div>
        <div className="font-semibold text-sm">
          <Link
            href={{
              pathname: "/warranty-claim",
            }}
            className="hover:bg-gray-200"
          >
            Warranty Claim
          </Link>
        </div>
      </div>
      {/* <div className="font-semibold text-sm">
        <Link href="/labor-warranty" className="hover:bg-gray-200">Labor Warranty</Link>
      </div> */}
    </main>
  );
}
