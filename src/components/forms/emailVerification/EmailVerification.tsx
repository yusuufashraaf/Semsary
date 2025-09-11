import { Button, Form, Spinner } from "react-bootstrap"
import Input from "../input/Input"
import { useAppSelector } from "@store/hook";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const otpSchema = z.object({
  emailOTP: z.string().min(6, "OTP must be 6 characters").max(6, "OTP must be 6 characters")
});

type OtpType = z.infer<typeof otpSchema>;

interface IEmailVerificationProps {
  handleNext: (data: OtpType) => void;
}

const EmailVerification = ({ handleNext }: IEmailVerificationProps) => {
  const { loading, error } = useAppSelector(state => state.Authslice);
  const formData = useAppSelector(state => state.form); // Get form data from store

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpType>({
    mode: "onBlur",
    resolver: zodResolver(otpSchema),
  });

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
            //TODO resend Logic here
            //  implement resend logic here
            handleNext({ emailOTP: "" });
          }}
          disabled={loading === "pending"}
        >
          Resend Code
        </Button>
        
        <Button 
          variant="info" 
          type="submit" 
          className='text-light'
          disabled={loading === "pending"}
        >
          {loading === "pending" ? (
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