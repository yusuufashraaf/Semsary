import { useState } from "react";
import { changePropertyStatus } from "@services/PropertiesFetch";
import axiosErrorHandle from "@utils/axiosErrorHandler";

function useChangePropertyStatus(jwt: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (
    propertyId: number,
    newStatus: "Valid" | "Invalid" | "Pending" | "Rented" | "Sold"
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await changePropertyStatus(propertyId, newStatus, jwt);
      return response; // return API response to caller
    } catch (err) {
      axiosErrorHandle(err);
      setError("Failed to update status");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading, error };
}

export default useChangePropertyStatus;
