import api from "@services/axios-global";

export type WithdrawalRequest = {
  id: number;
  user_id: number;
  amount: string;
  gateway: "paymob" | "paypal";
  account_details: Record<string, any>;
  status: "processing" | "completed" | "failed";
  transaction_ref: string;
  requested_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type WithdrawalHistoryResponse = {
  withdrawals: {
    current_page: number;
    data: WithdrawalRequest[];
    per_page: number;
    total: number;
    last_page: number;
  };
  rate_limit: {
    used: number;
    limit: number;
    remaining: number;
    reset_date: string;
  };
};

export type WithdrawalRequestData = {
  amount: number;
  gateway: "paymob" | "paypal";
  account_details: Record<string, any>;
};

// Get withdrawal info (limits, balance, etc.)
export const getWithdrawalInfo = async (signal?: AbortSignal) => {
  const response = await api.get(`/withdrawals/info`, { signal });
  return response.data;
};

// Request a withdrawal
export const requestWithdrawal = async (
  data: WithdrawalRequestData,
  signal?: AbortSignal
): Promise<WithdrawalRequest> => {
  const response = await api.post(`/withdrawals/request`, data, { signal });
  return response.data.withdrawal;
};

// Get withdrawal history (paginated)
export const getWithdrawalHistory = async (
  page = 1,
  signal?: AbortSignal
): Promise<WithdrawalHistoryResponse> => {
  const response = await api.get(`/withdrawals/history`, {
    params: { page },
    signal,
  });
  return response.data.data;
};
