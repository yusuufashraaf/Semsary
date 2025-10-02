import { Button, Form, Spinner } from "react-bootstrap";
import Input from "../input/Input";
import { useAppDispatch, useAppSelector } from "@store/hook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { phoneOtpSchema, PhoneOtpType } from "@validations/phoneOtpSchema";
import ActSendWhatsOTP from "@store/Auth/Act/ActSendWhatsOTP";
import ActVerifyWhatsOTP from "@store/Auth/Act/ActVerifyWhatsOTP";
import { resetUI } from "@store/Auth/AuthSlice";
import styles from "./PhoneVerification.module.css";
import { toast } from "react-toastify";

type StepStatus = "pending" | "completed" | "skipped";
interface IPhoneVerificationProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setStepStatus: (status: StepStatus) => void;
}

const PhoneVerification = ({
  setCurrentStep,
  setStepStatus,
}: IPhoneVerificationProps) => {
  const [timer, setTimer] = useState(0);
  const [actionType, setActionType] = useState<"send" | "verify" | null>(null);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.Authslice);
  const formData = useAppSelector((state) => state.form);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PhoneOtpType>({
    mode: "onBlur",
    resolver: zodResolver(phoneOtpSchema),
  });

  const otpValue = watch("phoneOTP");

  // Send OTP immediately on mount
  useEffect(() => {
    handleSendAgain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // countdown
  useEffect(() => {
    let interval: number;
    if (timer > 0) {
      interval = window.setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // reset UI on unmount
  useEffect(() => {
    return () => {
      dispatch(resetUI());
    };
  }, [dispatch]);

const handleSendAgain = () => {
  if (timer > 0) return;

  // clear previous errors before resending
  dispatch(resetUI());

  setActionType("send");
  dispatch(ActSendWhatsOTP({ phone_number: formData.phone_number }))
    .unwrap()
    .then((res) => {
      setTimer(60);
      toast.success(res.message || "OTP has been sent successfully ✅");
    })
    .catch(() => {
      toast.error("Failed to resend OTP, please try again.");
    })
    .finally(() => setActionType(null));
};

  const handleVerification = (data: PhoneOtpType) => {
    setActionType("verify");
    dispatch(
      ActVerifyWhatsOTP({ phone_number: formData.phone_number, phoneOTP: data.phoneOTP })
    )
      .unwrap()
      .then(() => {
        setStepStatus("completed");
        setCurrentStep((prev) => prev + 1);
      })
      .finally(() => setActionType(null));
  };

  const handleSkip = () => {
    setStepStatus("skipped");
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <Form onSubmit={handleSubmit(handleVerification)}>
      <p className="text-muted mb-3">
        We've sent a verification code to <strong>{formData.phone_number}</strong>
      </p>

      <Input
        label="Verification Code"
        name="phoneOTP"
        register={register}
        error={errors.phoneOTP?.message}
        placeholder="Enter 6-digit code"
      />

      <div className="d-flex justify-content-between align-items-center mt-3">
        {/* Skip */}
        <Button
          variant="outline-secondary"
          onClick={handleSkip}
          disabled={loading === "pending" && actionType === "verify"}
          className={styles.skipBtn}
        >
          Skip for now
        </Button>

        {/* Verify */}
        <Button
          variant="info"
          type="submit"
          className={styles.verifyBtn}
          disabled={loading === "pending" && actionType === "verify"}
        >
          {loading === "pending" && actionType === "verify" && otpValue ? (
            <>
              <Spinner animation="border" size="sm" /> Verifying...
            </>
          ) : (
            "Verify Phone"
          )}
        </Button>
      </div>

      {/* Resend OTP */}
      <div className="text-end mt-2">
        <Button
          variant="link"
          onClick={handleSendAgain}
          disabled={loading === "pending" && actionType === "send"}
        >
          {loading === "pending" && actionType === "send" ? (
            <>
              <Spinner animation="border" size="sm" /> Sending...
            </>
          ) : timer > 0 ? (
            `Resend in ${timer}s`
          ) : (
            "Resend Code"
          )}
        </Button>
      </div>

      {error && <p style={{ color: "#DC3545", marginTop: "10px" }}>{error}</p>}
    </Form>
  );
};

export default PhoneVerification;