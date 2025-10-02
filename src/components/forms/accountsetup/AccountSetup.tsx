import { Button, Form, Spinner } from "react-bootstrap";
import Input from "../input/Input";
import { useAppDispatch, useAppSelector } from "@store/hook";
import { useForm } from "react-hook-form";
import { signUpSchema, signUpType } from "@validations/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { updateFormData } from "@store/FormConfirm/FormSlice";
import ActSignUp from "@store/Auth/Act/ActSignUp";
import { resetUI } from "@store/Auth/AuthSlice";
import styles from "./AccountSetup.module.css";
import useCheckEmailForAvailability from "@hooks/useCheckEmailForAvailability";

type StepStatus = "pending" | "completed" | "skipped";
interface IAccountSetupProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setStepStatus: (status: StepStatus) => void;
}

const AccountSetup = ({
  setCurrentStep,
  setStepStatus,
}: IAccountSetupProps) => {
  const dispatch = useAppDispatch();
  const persistedData = useAppSelector((state) => state.form);
  const { loading, error } = useAppSelector((state) => state.Authslice);
  const {emailAvailabilityStatus,enteredEmail,checkEmailAvailability,resetEmailAvailability} =useCheckEmailForAvailability();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getFieldState,
    trigger,
    reset,
    watch
  } = useForm<signUpType>({
    mode: "onBlur",
    resolver: zodResolver(signUpSchema),
    defaultValues: persistedData,
  });

  const handleNext = (data: signUpType) => {
    dispatch(ActSignUp(data))
      .unwrap()
      .then(() => {
        dispatch(updateFormData(data));
        setStepStatus("completed");
        setCurrentStep((prev) => prev + 1);
      });
  };

  useEffect(() => {
    reset(persistedData);
    return () => {
      dispatch(resetUI());
    };
  }, [persistedData, reset, dispatch]);


const emailValue = watch("email");

useEffect(() => {
  if (!emailValue) {
    resetEmailAvailability();
  }
}, [emailValue, resetEmailAvailability]);


const emailOnBlurHandler =async (e:React.FocusEvent<HTMLInputElement>)=>{
  await trigger('email');
  const {invalid,isDirty}=getFieldState('email');
  const value = e.target.value;
  if(!invalid && isDirty && value !== enteredEmail){
    checkEmailAvailability(value)
  }
  if(enteredEmail && isDirty && invalid){
    resetEmailAvailability();
  }
  
}



  return (
    <Form onSubmit={handleSubmit(handleNext)}>
      <Input
        label="First Name"
        name="first_name"
        register={register}
        error={errors.first_name?.message}
      />

      <Input
        label="Last Name"
        name="last_name"
        register={register}
        error={errors.last_name?.message}
      />
      <Input 
          label='Email Address'
          name ="email"
          register={register}
          error ={errors.email?.message ? errors.email?.message : 
          emailAvailabilityStatus==="notAvailable" ? "This email is already in use." :
          emailAvailabilityStatus === "failed" ? "Error from the server." : ""}
          onBlur= {emailOnBlurHandler}
          success={emailAvailabilityStatus === "available" ? "This email is available for use." : "" }
          formText={emailAvailabilityStatus ==="checking" ? "We're currently checking the availability of this email address. Please wait a moment." : ""}
          disabled={emailAvailabilityStatus=== "checking" ? true: false}    
          />
          <Input
            label="Phone Number"
            name="phone_number"
            register={register}
            error={errors.phone_number?.message}
          />
      <Input
        label="Password"
        name="password"
        type="password"
        register={register}
        error={errors.password?.message}
      />
      <Input
        label="Confirm Password"
        name="password_confirmation"
        type="password"
        register={register}
        error={errors.password_confirmation?.message}
      />
      <div className="d-flex justify-content-end">
        <Button
          variant="info"
          type="submit"
          className={` ${styles.registerBtn}`}
          style={{ minWidth: "100%" }}
        >
           {loading === "pending"  ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      loading...
                    </>
                  ) : (
                    "Next"
                  )}
       
        </Button>
      </div>
      {error && <p style={{ color: "#DC3545", marginTop: "10px" }}>{error}</p>}
    </Form>
  );
};

export default AccountSetup;
