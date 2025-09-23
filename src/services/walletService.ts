import api from "./axios-global";

// Single function to get full wallet info
export const fetchWallet = async () => {
  const response = await api.get("/balance");
  return response;
  // Example response:
  // {
  //   "available_now": 200,
  //   "in_wallet": 200,
  //   "in_escrow_locked": 0,
  //   "in_escrow_refundable": 0,
  //   "total_money": 200
  // }
};
