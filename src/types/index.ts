export type Listing = {
  id: number;
  image: string;
  title: string;
  beds: number;
  baths: number;
  sqft: string;
  price: string;
};

export type CategoryCardProps = {
  name: string;
  image: string;
  link: string;
};

export interface Property {
  id: number;
  address: string;
  price: string;
  saved: boolean;
  image: string;
}

export interface SavedSearch {
  id: number;
  title: string;
  location: string;
  checked: boolean;
}

export interface UserData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export type AccountTab = 'personal' | 'kyc' | 'security' | 'actions';