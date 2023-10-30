import { Dayjs } from "dayjs";

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
}

export interface NewItem {
  _id: any;
  model: string;
  serialNumber: string;
  installationDate: Dayjs | null;
}

export interface FormData extends ComType {
  extension?: string;
  items: NewItem[];
  agreedToTerms: boolean;
}
