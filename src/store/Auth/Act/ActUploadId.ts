import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import axios from "axios";

const ActUploadId = createAsyncThunk(
  "auth/uploadId",
  async (formData: FormData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {

      const response = await api.post("/upload-id", formData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "Upload failed");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export default ActUploadId;