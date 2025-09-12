import { Col, Row } from 'react-bootstrap';
import Stepper from '@components/forms/stepper/Stepper';
import { Step } from 'src/types';
import { useState } from 'react';
import AccountSetup from '@components/forms/accountsetup/AccountSetup';
// import { signUpType } from '@validations/signUpSchema';

import EmailVerification from '@components/forms/emailVerification/EmailVerification';
import PhoneVerification from '@components/forms/phoneVerification/PhoneVerification';
// import ImageWithID from '@components/forms/imageWithId/ImageWithID';

// Create a union type for all possible form data


export default function Register() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const steps: Step[] = ["Account Setup", "Email Verification", "Phone Verification", "Image With ID"];

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <AccountSetup setCurrentStep={setCurrentStep}  />;
      case 2:
        return <EmailVerification setCurrentStep={setCurrentStep} />;
      case 3:
        return <PhoneVerification setCurrentStep={setCurrentStep} />;
      // case 4:
      //   return <ImageWithID handleNext={handleNext} />;
      default:
        return <AccountSetup setCurrentStep={setCurrentStep} />;
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