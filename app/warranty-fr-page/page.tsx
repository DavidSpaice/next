import React from "react";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  // const data = await getData();

  return (
    <div className="flex flex-col h-screen items-center">
      {/* <p className="font-semibold text-lg">Découvrez nos services de garantie</p> */}
      <br />
      <div className="flex flex-col sm:flex-row w-full justify-center sm:justify-evenly items-center">
        <div className="font-semibold text-sm m-4 sm:m-0">
          <div className="bg-[#182887] w-96 mb-2 text-center text-white p-2 rounded uppercase text-xs tracking-wide">
            Activez votre garantie, adoptez l&lsquo;assurance !
          </div>
          <div className="bg-[#f2f2f2] w-96 text-center text-black p-2 rounded uppercase text-xs tracking-wide">
            <Link
              href={{
                pathname: "/warranty-fr",
              }}
              className="bg-[#f2f2f2]"
            >
              <div className="flex flex-col justify-center items-center hover:bg-gray-200">
                <Image
                  src="/application.png"
                  width={"50"}
                  height={"50"}
                  alt="Image de l'application"
                />
                Enregistrement de garantie
              </div>
            </Link>
          </div>
        </div>
        <div className="font-semibold text-sm">
          <div className="bg-[#182887] w-96 mb-2 text-center text-white p-2 rounded uppercase text-xs tracking-wide">
            Réclamez avec confiance
          </div>
          <div className="bg-[#f2f2f2] w-96 text-center text-black p-2 rounded uppercase text-xs tracking-wide">
            <Link
              href={{
                pathname: "/warranty-claim-fr",
              }}
              className="hover:bg-gray-200"
            >
              <div className="flex flex-col justify-center items-center hover:bg-gray-200">
                <Image
                  src="/claim.png"
                  width={"50"}
                  height={"50"}
                  alt="Image de l'application"
                />
                Réclamation de garantie
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
