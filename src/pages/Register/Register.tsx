import { Col, Row, Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { SubmitHandler,useForm } from 'react-hook-form';
import { signUpSchema, signUpType } from '@validations/signUpSchema';
import { zodResolver } from "@hookform/resolvers/zod";
import Input from '@components/forms/input/Input';
import { useAppDispatch, useAppSelector } from '@store/hook';
import ActSignUp from '@store/Auth/Act/ActSignUp';
import { useNavigate } from 'react-router-dom';



export default function Register() {
  const dispatch =useAppDispatch();
  const {loading,error}=useAppSelector(state=> state.Authslice)
  const navigate = useNavigate();

      const {
        register,
        handleSubmit,
        formState: { errors },

      } = useForm<signUpType>({
        mode:"onBlur",
        resolver:zodResolver(signUpSchema)
      });

    
const submitForm:SubmitHandler<signUpType> =(data:signUpType) =>{
    dispatch(ActSignUp(data))
    .unwrap()
    .then(()=>{
      navigate("/login?message=account_created");
    });
  
}


  return (
    <>
     <Row>
      <Col md={{span:"6", offset:"3"}}>
         <Form onSubmit={handleSubmit(submitForm)}>

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
              <Button 
                variant="info" 
                type="submit" 
                className='text-light' 
              >
              {loading === "pending" ? (
                <>
                  <Spinner animation="border" size="sm" />
                  Loading...
                </>
              ) : (
                'Submit'
              )}
                
              </Button>
              {error && (
              <p style={{ color: "#DC3545", marginTop: "10px" }}>{error}</p>
            )}
          </Form>
      </Col>
       
      </Row>
    </>
     

  )
}