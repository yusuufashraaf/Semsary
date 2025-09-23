import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@store/hook";
import submitPayment from "@store/payment/Actions/submitPayment";
import { PaymentFormData, paymentSchema } from "@validations/paymentSchema";
import { Button, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";


export default function PaymentForm() {
  const dispatch =useAppDispatch();
  const {loading,error}=useAppSelector(state => state.paymentSlice)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount_cents: "",
      currency: "EGP",
      shipping_data: {
        first_name: "",
        last_name: "",
        phone_number: "",
        email: ""
      }
    }
  });

  const onSubmit = async (data: PaymentFormData) => {

      dispatch(submitPayment(data))
      reset();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Payment Form</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Amount */}
        <div>
          <label htmlFor="amount_cents" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (in cents)
          </label>
          <input
            {...register("amount_cents")}
            type="text"
            id="amount_cents"
            placeholder="4000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.amount_cents && (
            <p className="text-red-500 text-sm mt-1">{errors.amount_cents.message}</p>
          )}
        </div>

        {/* Currency */}
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            {...register("currency")}
            id="currency"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="EGP">EGP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          {errors.currency && (
            <p className="text-red-500 text-sm mt-1">{errors.currency.message}</p>
          )}
        </div>

        {/* Shipping Data Section */}
        <div className="border-t pt-4 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Information</h3>
          
          {/* First Name */}
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              {...register("shipping_data.first_name")}
              type="text"
              id="first_name"
              placeholder="Mahmoud"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.shipping_data?.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.shipping_data.first_name.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              {...register("shipping_data.last_name")}
              type="text"
              id="last_name"
              placeholder="Test"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.shipping_data?.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.shipping_data.last_name.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              {...register("shipping_data.phone_number")}
              type="text"
              id="phone_number"
              placeholder="01010101010"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.shipping_data?.phone_number && (
              <p className="text-red-500 text-sm mt-1">{errors.shipping_data.phone_number.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("shipping_data.email")}
              type="email"
              id="email"
              placeholder="mahmoud@test.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.shipping_data?.email && (
              <p className="text-red-500 text-sm mt-1">{errors.shipping_data.email.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="d-flex justify-content-center">
          <Button
            type="submit"
            variant="info"
            className="text-center"
            style={{ marginTop: "5px" }}
          >
            {loading === "pending" ? (
              <>
                <Spinner animation="border" size="sm" />
                Loading...
              </>
            ) : (
              "Payment"
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}