import EmailVerification from "@components/forms/emailVerification/EmailVerification";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// adjust import path

const VerifyEmail = () => {
  // stepper state if you want to extend this later (multi-step form)
  const [currentStep, setCurrentStep] = useState(1);
  const [stepStatus, setStepStatus] = useState<"pending" | "completed" | "skipped">("pending");
  const navigate = useNavigate();
  useEffect(() => {
    if (stepStatus === "completed") {
      // delay 2s so user can see success message
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [stepStatus, navigate]);


  return (
    <div className="d-flex justify-content-center align-items-center" >
      <div style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Verify Your Email</h3>

        <EmailVerification
          setCurrentStep={setCurrentStep}
          setStepStatus={setStepStatus}
        />

        {stepStatus === "completed" && (
          <p className="text-success text-center mt-3">
            🎉 Your email has been verified successfully! <br />
            Redirecting to login...
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;