import { Button, Form } from "react-bootstrap";
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
import useCheckPhoneForAvailability from "@hooks/useCheckPhoneForAvailability";
import { toast } from "react-toastify";
import Loader from "@components/common/Loader/Loader";

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
    const {phoneAvailabilityStatus, enteredPhone, checkPhoneAvailability, resetPhoneAvailability} = useCheckPhoneForAvailability();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getFieldState,
    trigger,
    reset,
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
        toast.success("Account setup completed successfully. And you can log In");
        setCurrentStep((prev) => prev + 1);
      });
  };

  useEffect(() => {
    reset(persistedData);
    return () => {
      dispatch(resetUI());
    };
  }, [persistedData, reset, dispatch]);




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
const phoneOnBlurHandler = async (e: React.FocusEvent<HTMLInputElement>) => {
  await trigger('phone_number'); // Trigger validation for the phone field
  const { invalid, isDirty } = getFieldState('phone_number');
  const value = e.target.value;

  if (!invalid && isDirty && value !== enteredPhone) {
    checkPhoneAvailability(value);
  }

  if (enteredPhone && isDirty && invalid) {
    resetPhoneAvailability();
  }
};



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
            onBlur={phoneOnBlurHandler} 
            error={
              errors.phone_number?.message ? errors.phone_number.message :
              phoneAvailabilityStatus === "notAvailable" ? "This phone number is already in use." :
              phoneAvailabilityStatus === "failed" ? "Error from the server." : ""
            }
            success={phoneAvailabilityStatus === "available" ? "This phone number is available." : ""}
            formText={phoneAvailabilityStatus === "checking" ? "Checking phone number availability..." : ""}
            disabled={phoneAvailabilityStatus === "checking"}
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
      <Form.Group className="mb-3" controlId="role">
        <Form.Label>Role</Form.Label>
        <Form.Select
          {...register("role")}
          isInvalid={!!errors.role}
          aria-label="Select your role"
        >
          <option value="">Select a role...</option>
          <option value="user">User</option>
          <option value="agent">Agent</option>
          <option value="owner">Owner</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.role?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <div className="d-flex justify-content-end">
        <Button
          variant="info"
          type="submit"
          className={` ${styles.registerBtn}`}
          style={{ minWidth: "100%" }}
        >
          {loading === "pending" ? (
            <>
<Loader message="Loading" />
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
