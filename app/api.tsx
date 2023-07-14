// const filterSerialNumbers = (sn: { items: { serialNumber: string }[] }[]) => {
//   let serialNumbers: string[] = [];
//   for (const item of sn) {
//     for (const subItem of item.items) {
//       serialNumbers.push(subItem.serialNumber);
//     }
//   }
//   console.log(serialNumbers);

//   return serialNumbers;
// };

export async function fetchData() {
  try {
    const firstResponse = await fetch(
      "https://airtek-warranty.onrender.com/warranties"
    );
    const WarrantyRegistered = await firstResponse.json();
    // const serialNumbers = filterSerialNumbers(WarrantyRegistered);

    const secondResponse = await fetch(
      "https://airtek-warranty.onrender.com/serial"
    );
    const allSerialNumbers: { _id: string; serialNumber: string }[] =
      await secondResponse.json();
    const uniqueData = Array.from(
      new Set(allSerialNumbers.map((item) => item.serialNumber))
    )
      .map((serialNumber) =>
        allSerialNumbers.find((item) => item.serialNumber === serialNumber)
      )
      .filter(
        (item): item is { _id: string; serialNumber: string } =>
          item !== undefined
      );

    return { WarrantyRegistered, uniqueData };
  } catch (error) {
    console.error("Error fetching serial number data:", error);
  }
}
