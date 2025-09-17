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
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.Authslice);
  const formData = useAppSelector((state) => state.form);

  useEffect(() => {
    dispatch(ActSendWhatsOTP());
    let interval: number;
    if (timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      dispatch(resetUI());
    };
  }, [timer, dispatch]);

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

  const handleVerification = (data: PhoneOtpType) => {
    dispatch(ActVerifyWhatsOTP(data))
      .unwrap()
      .then(() => {
        setStepStatus("completed");
        setCurrentStep((prev) => prev + 1);
      });
  };
  const handleSkip = () => {
    setStepStatus("skipped");
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <Form onSubmit={handleSubmit(handleVerification)}>
      <p className="text-muted mb-3">
        We've sent a verification code to{" "}
        <strong>{formData.phone_number}</strong>
      </p>

      <Input
        label="Verification Code"
        name="phoneOTP"
        register={register}
        error={errors.phoneOTP?.message}
        placeholder="Enter 6-digit code"
      />

      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button
          variant="outline-secondary"
          onClick={handleSkip}
          disabled={loading === "pending"}
          className={`${styles.skipBtn}`}
        >
          Skip for now
        </Button>

        <Button
          variant="info"
          type="submit"
          className={`${styles.verifyBtn}`}
          disabled={loading === "pending"}
        >
          {loading === "pending" && otpValue ? (
            <>
              <Spinner animation="border" size="sm" />
              Verifying...
            </>
          ) : (
            "Verify Phone"
          )}
        </Button>
      </div>

      {error && <p style={{ color: "#DC3545", marginTop: "10px" }}>{error}</p>}
    </Form>
  );
};

export default PhoneVerification;
