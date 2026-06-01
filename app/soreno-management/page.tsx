import Link from "next/link";
import React from "react";

function page() {
  return (
    <main className="min-h-screen bg-[#f7f5f2] px-4 py-8 text-[#111827]">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 border-b border-[#ded8cf] pb-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#111111]">
            Soreno Management
          </p>
          <h1 className="mt-2 text-3xl font-bold">Soreno Serial Tools</h1>
        </header>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/soreno-management/serial-numbers"
            className="rounded border border-[#ded8cf] bg-white p-5 font-semibold text-[#111111] shadow-sm hover:border-[#111111] hover:bg-[#fff3ed]"
          >
            Serial Number List
          </Link>
          <Link
            href="/soreno-management/add-serial-number"
            className="rounded border border-[#ded8cf] bg-white p-5 font-semibold text-[#111111] shadow-sm hover:border-[#111111] hover:bg-[#fff3ed]"
          >
            Add Serial Number
          </Link>
        </div>
      </div>
    </main>
  );
}

export default page;
