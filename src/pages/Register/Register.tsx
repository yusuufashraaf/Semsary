import { Col, Row } from 'react-bootstrap';
import Stepper from '@components/forms/stepper/Stepper';
import { Step } from 'src/types';
import { useLayoutEffect, useState } from 'react';
import AccountSetup from '@components/forms/accountsetup/AccountSetup';
import EmailVerification from '@components/forms/emailVerification/EmailVerification';
import PhoneVerification from '@components/forms/phoneVerification/PhoneVerification';
import ImageWithID from '@components/forms/imageWithId/ImageWithID';
import { useNavigate } from 'react-router-dom';


type StepStatus = 'pending' | 'completed' | 'skipped';
export default function Register() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const steps: Step[] = ["Account Setup", "Email Verification", "Phone Verification", "Image With ID"];
  const navigate = useNavigate();
    const [stepStatuses, setStepStatuses] = useState<Record<number, StepStatus>>({
    1: 'pending',
    2: 'pending',
    3: 'pending',
    4: 'pending',
  });

  useLayoutEffect(()=>{
  if(currentStep==5){
    navigate("/login?message=account_created");
    //TODO remove from local storage
  }

},[currentStep,navigate])

  const handleStepStatusChange = (stepIndex: number, status: StepStatus) => {
    setStepStatuses(prev => ({
      ...prev,
      [stepIndex]: status,
    }));
  };


  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <AccountSetup 
        setCurrentStep={setCurrentStep}
        setStepStatus={(status) => handleStepStatusChange(1, status)}
          />;
      case 2:
        return <EmailVerification 
        setCurrentStep={setCurrentStep}
        setStepStatus={(status) => handleStepStatusChange(2, status)}
        />;
      case 3:
        return <PhoneVerification  
        setCurrentStep={setCurrentStep} 
        setStepStatus={(status) => handleStepStatusChange(3, status)}
        />;
      case 4:
        return <ImageWithID
         setCurrentStep={setCurrentStep}
         setStepStatus={(status) => handleStepStatusChange(4, status)}
         />;
      default:
        return <AccountSetup 
        setCurrentStep={setCurrentStep} 
        setStepStatus={(status) => handleStepStatusChange(1, status)}
        />;
    }
  };

  return (
    <>
      <Row>
        <Col md={{ span: "4", offset: "4" }}>
          <Stepper currentStep={currentStep} 
          steps={steps} 
          statuses={stepStatuses} 
          />
          {renderCurrentStep()}
        </Col>
      </Row>
    </>
  );
}