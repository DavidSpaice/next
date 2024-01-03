import React from "react";
import Link from "next/link";
import Image from "next/image";

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
      <div className="flex flex-col sm:flex-row w-full justify-center sm:justify-evenly items-center">
        <div className="font-semibold text-sm m-4 sm:m-0">
          <div className="bg-[#182887] w-96 mb-2 text-center text-white p-2 rounded uppercase text-xs tracking-wide">
            Activate Your Warranty, Embrace Assurance!
          </div>
          <div className="bg-[#f2f2f2] w-96 text-center text-black p-2 rounded uppercase text-xs tracking-wide">
            <Link href={{
              pathname: "/warranty",
            }} className="bg-[#f2f2f2]">
              <div className="flex flex-col justify-center items-center hover:bg-gray-200">
                <Image src="/application.png" width={"50"} height={"50"} alt="Application Image" />
                Warranty Registration
              </div>
            </Link>
          </div>
        </div>
        <div className="font-semibold text-sm">
          <div className="bg-[#182887] w-96 mb-2 text-center text-white p-2 rounded uppercase text-xs tracking-wide">
            Claim with Confidence
          </div>
          <div className="bg-[#f2f2f2] w-96 text-center text-black p-2 rounded uppercase text-xs tracking-wide">
            <Link
              href={{
                pathname: "/warranty-claim",
              }}
              className="hover:bg-gray-200"
            >
              <div className="flex flex-col justify-center items-center hover:bg-gray-200">
                <Image src="/claim.png" width={"50"} height={"50"} alt="Application Image" />
                Warranty Claim
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* <div className="font-semibold text-sm">
        <Link href="/labor-warranty" className="hover:bg-gray-200">Labor Warranty</Link>
      </div> */}
    </main>
  );
}
