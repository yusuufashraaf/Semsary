import { Col, Row } from 'react-bootstrap';
import Stepper from '@components/forms/stepper/Stepper';
import { Step } from 'src/types';
import { useLayoutEffect, useState } from 'react';
import AccountSetup from '@components/forms/accountsetup/AccountSetup';
import EmailVerification from '@components/forms/emailVerification/EmailVerification';
import PhoneVerification from '@components/forms/phoneVerification/PhoneVerification';
import ImageWithID from '@components/forms/imageWithId/ImageWithID';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@store/hook';

type StepStatus = 'pending' | 'completed' | 'skipped';

export default function Register() {
  const steps: Step[] = ["Account Setup", "Email Verification", "Phone Verification", "Image With ID"];
  const navigate = useNavigate();
  const { jwt } = useAppSelector(state => state.Authslice);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepStatuses, setStepStatuses] = useState<Record<number, StepStatus>>({
    1: 'pending', 2: 'pending', 3: 'pending', 4: 'pending'
  });


    useLayoutEffect(() => {
    if (currentStep === 5) {
      navigate("/login?message=account_created");
    }
  }, [currentStep, navigate]);

    if (jwt) {
    return <Navigate to="/" />;
  }


  const handleStepStatusChange = (stepIndex: number, status: StepStatus) => {
    setStepStatuses(prev => ({ ...prev, [stepIndex]: status }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <AccountSetup setCurrentStep={setCurrentStep} setStepStatus={(s) => handleStepStatusChange(1, s)} />;
      case 2:
        return <EmailVerification setCurrentStep={setCurrentStep} setStepStatus={(s) => handleStepStatusChange(2, s)} />;
      case 3:
        return <PhoneVerification setCurrentStep={setCurrentStep} setStepStatus={(s) => handleStepStatusChange(3, s)} />;
      case 4:
        return <ImageWithID setCurrentStep={setCurrentStep} setStepStatus={(s) => handleStepStatusChange(4, s)} />;
      default:
        return <AccountSetup setCurrentStep={setCurrentStep} setStepStatus={(s) => handleStepStatusChange(1, s)} />;
    }
  };

  return (
    <Row>
      <Col md={{ span: "4", offset: "4" }}>
        <Stepper currentStep={currentStep} steps={steps} statuses={stepStatuses} />
        {renderCurrentStep()}
      </Col>
    </Row>
  );
}