import { Button, Form, Spinner } from "react-bootstrap";
import Input from "../input/Input";
import { useAppDispatch, useAppSelector } from "@store/hook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";


import { phoneOtpSchema, PhoneOtpType } from "@validations/phoneOtpSchema"; 

// import ActResendPhoneOTP from "@store/Auth/Act/ActResendPhoneOTP"; 
import ActSendWhatsOTP from "@store/Auth/Act/ActSendWhatsOTP";
import ActVerifyWhatsOTP from "@store/Auth/Act/ActVerifyWhatsOTP";

interface IPhoneVerificationProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const PhoneVerification = ({ setCurrentStep }: IPhoneVerificationProps) => {
  const [timer, setTimer] = useState(0);
  // const [resendLoading, setResendLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.Authslice);
  const formData = useAppSelector(state => state.form); 

  useEffect(() => {
    dispatch(ActSendWhatsOTP());
    let interval: number;
    if (timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer,dispatch]);



  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<PhoneOtpType>({ 
    mode: "onBlur",
    resolver: zodResolver(phoneOtpSchema), 
  });

  const otpValue = watch("phoneOTP"); 


  const handleVerification = (data: PhoneOtpType) => {

    dispatch(ActVerifyWhatsOTP(data)).unwrap().then(() => {
      setCurrentStep((prev) => prev + 1);
    });
  };

  // This function handles the "Resend" button click
  // const handleClickOnResend = () => {
  //   setResendLoading(true);
  //   // --- 6. Dispatch the correct action for resending a phone OTP ---
  //   dispatch(ActResendPhoneOTP())
  //     .unwrap()
  //     .then(() => {
  //       setTimer(60); // Reset the timer
  //     })
  //     .finally(() => setResendLoading(false));
  // };

  return (
    // --- 7. The form now calls handleVerification on submit ---
    <Form onSubmit={handleSubmit(handleVerification)}>
      <p className="text-muted mb-3">
        {/* --- 8. Display the phone number from the form state --- */}
        We've sent a verification code to <strong>{formData.phone_number}</strong>
      </p>
      
      <Input 
        label="Verification Code"
        name="phoneOTP" // --- 9. The input field name is now 'phoneOTP' ---
        register={register}
        error={errors.phoneOTP?.message}
        placeholder="Enter 6-digit code"
      />
      
      <div className="d-flex justify-content-between align-items-center mt-3">
        {/* <Button 
          variant="outline-secondary" 
          onClick={handleClickOnResend}
          disabled={loading === "pending" || timer > 0}
        >
         {resendLoading
            ? <Spinner animation="border" size="sm" />
            : timer > 0
              ? `Resend Code (${timer})`
              : "Resend Code"}
        </Button> */}
        
        <Button 
          variant="info" 
          type="submit" 
          className='text-light'
          disabled={loading === "pending"}
        >
          {loading === "pending" && otpValue ? (
            <>
              <Spinner animation="border" size="sm" />
              Verifying...
            </>
          ) : (
            'Verify Phone' 
          )}
        </Button>
      </div>
      
      {error && (
        <p style={{ color: "#DC3545", marginTop: "10px" }}>{error}</p>
      )}
    </Form>
  );
};

export default PhoneVerification;
