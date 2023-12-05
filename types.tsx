// types.tsx
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
  _id: any;
  defectivePart: string;
  defectDate: Dayjs | null;
  replacDate: Dayjs | null;
}

export interface claimFormDataType extends comDataType {
  items: NewItem[];
}

export interface CustomError extends ComType {
  model: string;
  serialNumber: string;
}

export interface errorType extends comDataType {
  model: string;
  serialNumber: string;
  invoice?: string; // Make the invoice property optional
  defectivePart: string;
  defectDate: Dayjs;
  replacDate: Dayjs;
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