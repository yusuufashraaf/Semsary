import api from "@services/axios-global";

export type Balances = {
  wallet: {
    balance: number;
  };
  escrow: {
    locked: number;
    released: number;
  };
};

//  Get user balances (wallet + escrow)
export const getBalances = async (signal?: AbortSignal): Promise<Balances> => {
  const response = await api.get(`/balances`, { signal });
  return response.data.balances;
};
