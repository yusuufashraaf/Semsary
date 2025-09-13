import { Button, Form, Spinner } from "react-bootstrap"
import Input from "../input/Input"
import { useAppDispatch, useAppSelector } from "@store/hook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ActSendOTP from "@store/Auth/Act/ActSendOTP";
import { otpSchema, OtpType } from "@validations/otpSchema";
import ActReSendOTP from "@store/Auth/Act/ActReSendOTP";
import { useEffect, useState } from "react";


interface IEmailVerificationProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<number >>;
}

const EmailVerification = ({ setCurrentStep }: IEmailVerificationProps) => {
  const [timer, setTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.Authslice);
  const formData = useAppSelector(state => state.form); // Get form data from store

   useEffect(() => {
    let interval:number;
    if (timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<OtpType>({
    mode: "onBlur",
    resolver: zodResolver(otpSchema),
  });
const otpValue = watch("emailOTP"); 
    const handleNext = (data: OtpType) => {
     dispatch(ActSendOTP(data)).unwrap().then(()=>{
      setCurrentStep((prev) => prev + 1);
    })
  };


 const handleClickOnResend = () => {
    setResendLoading(true);
    dispatch(ActReSendOTP())
      .unwrap()
      .then(() => {
        setTimer(60); 
      })
      .finally(() => setResendLoading(false));
  };

  return (
    <Form onSubmit={handleSubmit(handleNext)}>
      <p className="text-muted mb-3">
        We've sent a verification code to <strong>{formData.email}</strong>
      </p>
      
      <Input 
        label="Verification Code"
        name="emailOTP"
        register={register}
        error={errors.emailOTP?.message}
        placeholder="Enter 6-digit code"
      />
      
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button 
          variant="outline-secondary" 
          onClick={() => {
            handleClickOnResend();
          }}
          disabled={loading === "pending" || timer > 0}
        >
         {resendLoading
            ? <Spinner animation="border" size="sm" />
            : timer > 0
              ? `Resend Code (${timer})`
              : "Resend Code"}
        </Button>
        
        <Button 
          variant="info" 
          type="submit" 
          className='text-light'
          disabled={loading === "pending"}
        >
          {loading === "pending" && otpValue  ? (
            <>
              <Spinner animation="border" size="sm" />
              Verifying...
            </>
          ) : (
            'Verify Email'
          )}
        </Button>
      </div>
      
      {error && (
        <p style={{ color: "#DC3545", marginTop: "10px" }}>{error}</p>
      )}
    </Form>
  );
};

export default EmailVerification;