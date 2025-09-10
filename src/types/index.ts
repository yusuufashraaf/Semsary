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
export type TLoading ="idle" | "pending" | "succeeded" | "failed";



