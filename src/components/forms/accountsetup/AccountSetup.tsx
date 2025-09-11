import { Button, Form, Spinner } from "react-bootstrap"
import Input from "../input/Input"
import { useAppSelector } from "@store/hook";
import { useForm } from "react-hook-form";
import { signUpSchema, signUpType } from "@validations/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

interface IAccountSetupProps{
    handleNext:(data:signUpType)=>void;
}

const AccountSetup = ({handleNext}:IAccountSetupProps) => {
        const persistedData=useAppSelector(state=> state.form)

      const {loading,error}=useAppSelector(state=> state.Authslice)
          const {
            register,
            handleSubmit,
            formState: { errors },
            reset
          } = useForm<signUpType>({
            mode:"onBlur",
            resolver:zodResolver(signUpSchema),
            defaultValues: persistedData
          });

        useEffect(() => {

        reset(persistedData);
        }, [persistedData, reset]);
  return (
  <Form onSubmit={handleSubmit(handleNext)}>

              <Input 
              label='First Name'
              name ="first_name"
              register={register}
              error ={errors.first_name?.message}
         
              />

              <Input 
              label='Last Name'
              name ="last_name"
              register={register}
              error ={errors.last_name?.message}
              />
              <Input 
              label='Email Address'
              name ="email"
              register={register}
              error ={errors.email?.message }
              />
              <Input 
              label='Phone Number'
              name ="phone_number"
              register={register}
              error ={errors.phone_number?.message }
              />
              <Input 
              label='Password'
              name ="password"
              type='password'
              register={register}
              error ={errors.password?.message}
              />
              <Input 
              label='Confirm Password'
              name ="password_confirmation"
              type='password'
              register={register}
              error ={errors.password_confirmation?.message}
              />
              <div className="d-flex justify-content-end">
                <Button 
                  variant="info" 
                  type="submit" 
                  className='text-light' // No need for flex classes on the button itself
                >
                  {loading === "pending" ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      Loading...
                    </>
                  ) : (
                    'Next'
                  )}
                </Button>
              </div>
              {error && (
              <p style={{ color: "#DC3545", marginTop: "10px" }}>{error}</p>
            )}
    </Form>
  )
}

export default AccountSetup
