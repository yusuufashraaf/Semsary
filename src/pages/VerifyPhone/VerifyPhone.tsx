import { Button, Form, Spinner, Card, Alert } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@store/hook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import { phoneOtpSchema, PhoneOtpType } from "@validations/phoneOtpSchema";
import ActSendWhatsOTP from "@store/Auth/Act/ActSendWhatsOTP";
import ActVerifyWhatsOTP from "@store/Auth/Act/ActVerifyWhatsOTP";
import { resetUI } from "@store/Auth/AuthSlice";
import Input from "@components/forms/input/Input";
import { toast } from "react-toastify";

const VerifyPhone = () => {
  const [timer, setTimer] = useState(0);
  const [phone, setPhone] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.Authslice);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<PhoneOtpType>({
    mode: "onBlur",
    resolver: zodResolver(phoneOtpSchema),
  });

  const otpValue = watch("phoneOTP");

  const sendOTP = async (phoneNumber: string) => {
    try {
      await dispatch(ActSendWhatsOTP({ phone_number: phoneNumber })).unwrap();
      setTimer(60);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let interval: number;
    if (timer > 0) {
      interval = window.setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    return () => {
      dispatch(resetUI());
    };
  }, [dispatch]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && timer === 0) sendOTP(phone);
  };

  const handleVerification = (data: PhoneOtpType) => {
    dispatch(ActVerifyWhatsOTP({ phone_number: phone, phoneOTP: data.phoneOTP }))
      .unwrap()
      .then(() => {
        toast("Phone Verified Succssfully");
        navigate("/profile/home");
      })
      .catch((err) => console.error(err));
  };

  return (
    <Card className="mx-auto mt-5 p-4" style={{ maxWidth: "400px" }}>
      <Card.Body>
        <Card.Title className="mb-3">Verify Your Phone</Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handlePhoneSubmit} className="mb-3">
          <Form.Group className="mb-2">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="info"
            type="submit"
            disabled={!phone || loading === "pending" || timer > 0}
            className="w-100"
          >
            {loading === "pending" && timer === 0 ? (
              <>
                <Spinner animation="border" size="sm" /> Sending OTP...
              </>
            ) : timer > 0 ? (
              `Resend OTP in ${timer}s`
            ) : (
              "Send OTP"
            )}
          </Button>
        </Form>

        {timer > 0 && (
          <Form onSubmit={handleSubmit(handleVerification)}>
            <p className="text-muted mb-2">
              We've sent a verification code to <strong>{phone}</strong>
            </p>

            <Input
              label="Verification Code"
              name="phoneOTP"
              register={register}
              error={errors.phoneOTP?.message}
              placeholder="Enter 6-digit code"
            />

            <div className="d-flex justify-content-between">
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/basic-info")}
                disabled={loading === "pending"}
              >
                <FaArrowLeft className="me-1" /> Back
              </Button>

              <Button variant="info" type="submit" disabled={loading === "pending"}>
                {loading === "pending" && otpValue ? (
                  <>
                    <Spinner animation="border" size="sm" /> Verifying...
                  </>
                ) : (
                  "Verify Phone"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

export default VerifyPhone;
