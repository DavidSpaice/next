import React from "react";
import { Dayjs } from "dayjs";

export interface DealerId {
  dealerId: string;
}

export interface SerialNumberData {
  _id: string;
  serialNumber: string;
}

export interface DealerData {
  _id: string;
  dealerName: string;
  dealerEmail: string;
  dealerPhone: number;
  dealerAddress: string;
  location: string;
}

export interface ComType {
  installType: string;
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  phone: string;
  dealerName: string;
  dealerEmail: string;
  dealerPhone: string;
  dealerAddress: string;
  dealerId: string;
}

export interface NewItem {
  id: any;
  model: string;
  serialNumber: string;
  installationDate: Dayjs | null;
  invoice?: string; // Make the invoice property optional
  parts?: Part[];
}

export interface FormData extends ComType {
  extension?: string;
  items: NewItem[];
  agreedToTerms: boolean;
  location: string;
}

export interface WarrantyType extends ComType {
  extension?: string;
  items: NewItem[];
  agreedToTerms: boolean;
}

export interface comDataType {
  contractor: string;
  contactPerson: string;
  email: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  phone: string;
  shipment: string;
  extension?: string;
  owner: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerExtension: string;
  ownerAddress: string;
  ownerCity: string;
  ownerProvince: string;
  ownerPone: string;
  ownerPostalCode: string;
  explanation: string;
}

export interface Part {
  id?: any;
  defectivePart: string;
  defectDate: Dayjs | null;
  replacDate: Dayjs | null;
}

export interface claimFormDataType {
  items: NewItem[];
  explanation: string;
}

export interface CustomError extends ComType {
  model: string;
  serialNumber: string;
  location: string;
}

export interface errorType {
  model: string;
  serialNumber: string;
  invoice?: string; // Make the invoice property optional
  defectivePart: string;
  defectDate: Dayjs;
  replacDate: Dayjs;
  explanation: string;
}

export interface InputProps {
  type: string;
  name: string;
  label: string;
  value: string;
  size: "small" | "medium";
  required: boolean;
  error?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// types.ts
export interface Item {
  _id: string;
  name: string;
}

export interface Location {
  _id: string;
  name: string;
}

export interface InventoryItem {
  _id: string;
  itemId: Item;
  locationId: Location;
  quantity: number;
}

export interface Transaction {
  _id: string;
  itemId: Item;
  action: string;
  quantity: number;
  fromLocation?: Location;
  toLocation?: Location;
  timestamp: string;
  deviceInfo?: string;
  isReset: boolean;
}
