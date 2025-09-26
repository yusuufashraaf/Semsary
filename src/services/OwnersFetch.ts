import api from "./axios-global";

export async function getOwner(id: number, jwt: string | null) {
  if (!jwt) throw new Error("JWT is required");

  const res = await api.get(`/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });

  
  return res.data.data; // returns the user/owner object
}

export interface Owner {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: string;
}