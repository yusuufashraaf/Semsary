import { Col, Row } from 'react-bootstrap';
import Stepper from '@components/forms/stepper/Stepper';
import { Step } from 'src/types';
import { useState } from 'react';
import AccountSetup from '@components/forms/accountsetup/AccountSetup';
import { signUpType } from '@validations/signUpSchema';
import { useAppDispatch } from '@store/hook';
import { updateFormData } from '@store/FormConfirm/FormSlice';
import EmailVerification from '@components/forms/emailVerification/EmailVerification';
// import PhoneVerification from '@components/forms/phoneVerification/PhoneVerification';
// import ImageWithID from '@components/forms/imageWithId/ImageWithID';

// Create a union type for all possible form data
type AllFormData = signUpType | { emailOTP: string } 

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const steps: Step[] = ["Account Setup", "Email Verification", "Phone Verification", "Image With ID"];
  const dispatch = useAppDispatch();

  // Create a more flexible handleNext function
  const handleNext = (data: AllFormData) => {
    dispatch(updateFormData(data));
    setCurrentStep((prev) => prev + 1);
  };

  // Render the appropriate component based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <AccountSetup handleNext={handleNext as (data: signUpType) => void} />;
      case 2:
        return <EmailVerification handleNext={handleNext as (data: { emailOTP: string }) => void} />;
      // case 3:
      //   return <PhoneVerification handleNext={handleNext} />;
      // case 4:
      //   return <ImageWithID handleNext={handleNext} />;
      default:
        return <AccountSetup handleNext={handleNext as (data: signUpType) => void} />;
    }
  };

  return (
    <>
      <Row>
        <Col md={{ span: "4", offset: "4" }}>
          <Stepper currentStep={currentStep} steps={steps} />
          {renderCurrentStep()}
        </Col>
      </Row>
    </>
  );
}