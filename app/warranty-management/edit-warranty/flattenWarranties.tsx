import dayjs from "dayjs";
import { WarrantyType, FlattenedWarrantyRow } from "@/types";

export function flattenWarranties(
  warranties: WarrantyType[]
): FlattenedWarrantyRow[] {
  return warranties.flatMap((w) => {
    if (!w.items || w.items.length === 0) {
      // No items => single row with blank item fields
      return [
        {
          _id: w._id,
          installType: w.installType,
          firstName: w.firstName,
          lastName: w.lastName,
          email: w.email,
          streetAddress: w.streetAddress,
          city: w.city,
          stateProvince: w.stateProvince,
          postalCode: w.postalCode,
          country: w.country,
          phone: w.phone,
          extension: w.extension,
          dealerName: w.dealerName,
          dealerEmail: w.dealerEmail,
          dealerPhone: w.dealerPhone,
          dealerAddress: w.dealerAddress,

          // item fields empty
          model: "",
          serialNumber: "",
          // Force a string or null
          installationDate: null,
        },
      ];
    }

    // For each item, produce a flattened row
    return w.items.map((item) => {
      // If item.installationDate might be a Dayjs, convert it to a string
      // e.g., "YYYY-MM-DD" or any desired format
      let dateString: string | null = null;
      if (item.installationDate) {
        // If item.installationDate is a dayjs object
        // or a string that can be parsed by dayjs
        const dateObj = dayjs(item.installationDate);
        if (dateObj.isValid()) {
          dateString = dateObj.format("YYYY-MM-DD");
        }
      }

      return {
        _id: w._id,
        installType: w.installType,
        firstName: w.firstName,
        lastName: w.lastName,
        email: w.email,
        streetAddress: w.streetAddress,
        city: w.city,
        stateProvince: w.stateProvince,
        postalCode: w.postalCode,
        country: w.country,
        phone: w.phone,
        extension: w.extension,
        dealerName: w.dealerName,
        dealerEmail: w.dealerEmail,
        dealerPhone: w.dealerPhone,
        dealerAddress: w.dealerAddress,

        // Flattened item fields
        model: item.model,
        serialNumber: item.serialNumber,
        installationDate: dateString,
      };
    });
  });
}
