import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "@services/axios-global";

// Define payment status type
type PaymentStatus = "success" | "failed" | null;

// Define payment details type
interface PaymentDetails {
  transaction_id?: string;
  amount?: number | string;
  currency?: string;
  status?: string;
  completed_at?: string;
  order_id?: string;
  raw_response?: {
    message?: string;
  };
  [key: string]: any; // fallback for unexpected fields
}

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );

  useEffect(() => {
    const handlePaymentCallback = async () => {
      // Check for direct success/failed parameters first (from PaymentController redirects)
      const orderId = searchParams.get("order_id");
      const transactionId = searchParams.get("transaction_id");
      const amount = searchParams.get("amount");
      const currency = searchParams.get("currency");
      const status = searchParams.get("status");
      const error = searchParams.get("error");
      const message = searchParams.get("message");

      // Handle direct success parameters (from PaymentController redirect)
      if (orderId && transactionId && amount && status === "completed") {
        setPaymentStatus("success");
        setPaymentDetails({
          transaction_id: transactionId,
          amount: parseFloat(amount),
          currency: currency || "EGP",
          status: status,
          order_id: orderId,
          completed_at: new Date().toISOString(),
        });
        setLoading(false);
        return;
      }

      // Handle direct error parameters (from PaymentController redirect)
      if (error || message) {
        setPaymentStatus("failed");
        setPaymentDetails({
          raw_response: { message: message || error || "Payment failed" },
        });
        setLoading(false);
        return;
      }

      // Fallback to token-based flow (for backward compatibility)
      const token = searchParams.get("token");

      if (!token) {
        setPaymentStatus("failed");
        setPaymentDetails({ raw_response: { message: "No payment information found." } });
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/exchange-payment-token?token=${token}`);
        const data = response.data;
        console.log(data);

        if (data.success && data.payment) {
          setPaymentStatus("success");
          setPaymentDetails(data.payment);
        } else {
          setPaymentStatus("failed");
          setPaymentDetails({
            raw_response: {
              message:
                data.payment?.raw_response?.message ||
                "The transaction was not successful.",
            },
            transaction_id: data.payment?.transaction_id,
          });
        }
      } catch (err) {
        console.error("Token exchange failed:", err);
        setPaymentStatus("failed");
        setPaymentDetails({
          raw_response: {
            message:
              "Could not verify payment status. Please try again or contact support.",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    handlePaymentCallback();
  }, [searchParams]);

  const handleGoHome = () => {
    navigate("/property");
  };

  const statusColors = {
    success: {
      bg: "bg-green-100",
      icon: "text-green-500",
      text: "text-green-700",
      border: "border-green-200",
      button: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    },
    failed: {
      bg: "bg-red-100",
      icon: "text-red-500",
      text: "text-red-700",
      border: "border-red-200",
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <h1 className="text-2xl font-bold text-gray-700">
            Checking Payment Status...
          </h1>
          <p className="text-gray-500">
            Please wait while we confirm your transaction.
          </p>
        </div>
      );
    }

    if (paymentStatus === "success" && paymentDetails) {
      const colors = statusColors.success;
      return (
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className={`p-4 rounded-full ${colors.bg}`}>
            <i className={`fas fa-check-circle text-6xl ${colors.icon}`}></i>
          </div>
          <h1 className={`text-3xl font-extrabold ${colors.text}`}>
            Payment Successful!
          </h1>
          <p className="text-gray-600 max-w-md">
            Thank you for your purchase. Your payment has been confirmed and the
            order is being processed.
          </p>

          <div
            className={`${colors.bg} p-6 rounded-xl border ${colors.border} w-full text-left space-y-4`}
          >
            <h2 className={`text-xl font-bold ${colors.text}`}>
              Transaction Details
            </h2>
            <div className="space-y-2 text-gray-700">
              {paymentDetails.order_id && (
                <p>
                  <strong>Order ID:</strong> {paymentDetails.order_id}
                </p>
              )}
              <p>
                <strong>Transaction ID:</strong>{" "}
                {paymentDetails.transaction_id || "No transaction ID"}
              </p>
              <p>
                <strong>Amount:</strong>{" "}
                {paymentDetails.amount
                  ? `${parseFloat(paymentDetails.amount.toString()).toFixed(
                      2
                    )} ${paymentDetails.currency || ""}`
                  : "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {paymentDetails.status || "N/A"}
              </p>
              <p>
                <strong>Completed At:</strong>{" "}
                {paymentDetails.completed_at
                  ? new Date(paymentDetails.completed_at).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <button
            onClick={handleGoHome}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white transition duration-150 ease-in-out ${colors.button}`}
          >
            Go to Home
          </button>
        </div>
      );
    }

    if (paymentStatus === "failed" && paymentDetails) {
      const colors = statusColors.failed;
      return (
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className={`p-4 rounded-full ${colors.bg}`}>
            <i className={`fas fa-times-circle text-6xl ${colors.icon}`}></i>
          </div>
          <h1 className={`text-3xl font-extrabold ${colors.text}`}>
            Payment Failed
          </h1>
          <p className="text-gray-600 max-w-md">
            There was an issue processing your payment. Please try again or
            contact support.
          </p>

          <div
            className={`${colors.bg} p-6 rounded-xl border ${colors.border} w-full text-left space-y-4`}
          >
            <h2 className={`text-xl font-bold ${colors.text}`}>
              Transaction Details
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Status:</strong> failed
              </p>
              <p>
                <strong>Reason:</strong>{" "}
                {paymentDetails.raw_response?.message || "Unknown"}
              </p>
              {paymentDetails.order_id && (
                <p>
                  <strong>Order ID:</strong> {paymentDetails.order_id}
                </p>
              )}
              <p>
                <strong>Transaction ID:</strong>{" "}
                {paymentDetails.transaction_id || "N/A"}
              </p>
            </div>
          </div>

          <button
            onClick={handleGoHome}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white transition duration-150 ease-in-out ${colors.button}`}
          >
            Go Back
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl">
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentCallback;