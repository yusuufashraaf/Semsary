import axios from "axios";
import { ChatResponse, ChatsResponse } from "src/types/chats";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const handleError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    console.error("Axios Error:", error.response?.data || error.message);
  } else {
    console.error("Unexpected Error:", error);
  }
  throw error;
};

// ---------------- API Calls ----------------

// Get all chats (paginated)
// export const getChats = async (
//   jwt: string,
//   page = 1,
//   signal?: AbortSignal
// ): Promise<ChatsResponse> => {
//   try {
//     const response = await API.get<ChatsResponse>(`/admin/chats?page=${page}`, {
//       headers: { Authorization: `Bearer ${jwt}` },
//       signal,
//     });
//     return response.data;
//   } catch (error) {
//     return handleError(error);
//   }
// };
export const getChats = async (
  jwt: string,
  page = 1,
  signal?: AbortSignal
): Promise<any> => {
  try {
    const response = await API.get<any>(`/admin/chats?page=${page}`, {
      headers: { Authorization: `Bearer ${jwt}` },
      signal,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get single chat
export const getChat = async (
  chatId: number,
  jwt: string,
  signal?: AbortSignal
): Promise<ChatResponse> => {
  try {
    const response = await API.get<ChatResponse>(`/admin/chats/${chatId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
      signal,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Assign chat
export const assignChat = async (
  chatId: number,
  agentId: number,
  jwt: string,
  signal?: AbortSignal
): Promise<ChatResponse> => {
  try {
    const response = await API.post<ChatResponse>(
      `/admin/chats/${chatId}/assign`,
      { agent_id: agentId },
      {
        headers: { Authorization: `Bearer ${jwt}` },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Unassign chat
export const unassignChat = async (
  chatId: number,
  jwt: string,
  signal?: AbortSignal
): Promise<ChatResponse> => {
  try {
    const response = await API.post<ChatResponse>(
      `/admin/chats/${chatId}/unassign`,
      {},
      {
        headers: { Authorization: `Bearer ${jwt}` },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
