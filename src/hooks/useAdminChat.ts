import { useState, useCallback } from "react";
import { useAppSelector } from "@store/hook";
import { Chat, ChatUser, ChatResponse, ChatsResponse } from "src/types/chats";

interface UseChatsOptions {
  getChats: (jwt: string, page?: number, signal?: AbortSignal) => Promise<ChatsResponse>;
  getChat: (chatId: number, jwt: string, signal?: AbortSignal) => Promise<ChatResponse>;
  assignChat: (chatId: number, agentId: number, jwt: string, signal?: AbortSignal) => Promise<ChatResponse>;
  unassignChat: (chatId: number, jwt: string, signal?: AbortSignal) => Promise<ChatResponse>;
}

interface UseChatsReturn {
  chats: Chat[];
  agents: ChatUser[];
  selectedChat: Chat | null;
  loading: boolean;
  error: string | null;
  pagination: { page: number; total: number; perPage: number };

  fetchChats: (page?: number) => Promise<void>;
  fetchChat: (chatId: number) => Promise<Chat | null>;
  assign: (chatId: number, agentId: number) => Promise<ChatResponse | null>;
  unassign: (chatId: number) => Promise<ChatResponse | null>;
  clearError: () => void;
  resetState: () => void;
}

export const useChats = ({
  getChats,
  getChat,
  assignChat,
  unassignChat,
}: UseChatsOptions): UseChatsReturn => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [agents, setAgents] = useState<ChatUser[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, perPage: 10 });

  const { jwt } = useAppSelector((state) => state.Authslice);

  const validateAuth = useCallback((): boolean => {
    if (!jwt) {
      setError("Authorization token missing. Please log in again.");
      return false;
    }
    return true;
  }, [jwt]);

  const handleError = useCallback((err: any, defaultMsg: string) => {
    console.error(defaultMsg, err);
    const msg = err?.response?.data?.message || err?.message || defaultMsg;
    setError(msg);
  }, []);

  const fetchChats = useCallback(
    async (page = 1) => {
      if (!validateAuth()) return;
      setLoading(true);
      setError(null);

      try {
        const result = await getChats(jwt!, page);
        if (result.success) {
          setChats(result.data.data);
          setAgents(result.data.agents || []);
          setPagination({
            page: result.data.current_page,
            total: result.data.total,
            perPage: result.data.per_page,
          });
        } else {
          setChats([]);
          setAgents([]);
        }
      } catch (err) {
        handleError(err, "Error fetching chats.");
        setChats([]);
        setAgents([]);
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError, getChats]
  );

  const fetchChat = useCallback(
    async (chatId: number): Promise<Chat | null> => {
      if (!validateAuth()) return null;
      setLoading(true);
      setError(null);

      try {
        const result = await getChat(chatId, jwt!);
        if (result.success) {
          setSelectedChat(result.data);
          return result.data;
        }
        return null;
      } catch (err) {
        handleError(err, "Error fetching chat details.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError, getChat]
  );

  const assign = useCallback(
    async (chatId: number, agentId: number): Promise<ChatResponse | null> => {
      if (!validateAuth()) return null;
      setLoading(true);
      setError(null);

      try {
        const result = await assignChat(chatId, agentId, jwt!);
        if (result?.success) {
          setChats((prev) => prev.map((c) => (c.id === chatId ? result.data : c)));
          if (selectedChat?.id === chatId) {
            setSelectedChat(result.data);
          }
        }
        return result;
      } catch (err) {
        handleError(err, "Error assigning chat.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError, assignChat, selectedChat]
  );

  const unassign = useCallback(
    async (chatId: number): Promise<ChatResponse | null> => {
      if (!validateAuth()) return null;
      setLoading(true);
      setError(null);

      try {
        const result = await unassignChat(chatId, jwt!);
        if (result?.success) {
          setChats((prev) => prev.map((c) => (c.id === chatId ? result.data : c)));
          if (selectedChat?.id === chatId) {
            setSelectedChat(result.data);
          }
        }
        return result;
      } catch (err) {
        handleError(err, "Error unassigning chat.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError, unassignChat, selectedChat]
  );

  const clearError = useCallback(() => setError(null), []);
  const resetState = useCallback(() => {
    setChats([]);
    setAgents([]);
    setSelectedChat(null);
    setError(null);
    setPagination({ page: 1, total: 0, perPage: 10 });
  }, []);

  return {
    chats,
    agents,
    selectedChat,
    loading,
    error,
    pagination,
    fetchChats,
    fetchChat,
    assign,
    unassign,
    clearError,
    resetState,
  };
};
