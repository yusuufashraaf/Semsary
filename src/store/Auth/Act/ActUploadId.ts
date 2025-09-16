import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import axios from "axios";

const ActUploadId = createAsyncThunk(
  "auth/uploadId",
  async (formData: FormData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.post("/upload-id", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("API Error:", error.response.data);
        

        if (error.response.data.errors) {
 
          const validationErrors = Object.values(error.response.data.errors).flat().join(' ');
          return rejectWithValue(validationErrors);
        }

        return rejectWithValue(error.response.data.message || "Upload failed");
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export default ActUploadId;