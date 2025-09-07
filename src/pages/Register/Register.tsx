import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { SubmitHandler,useForm } from 'react-hook-form';
import { signUpSchema, signUpType } from '@validations/signUpSchema';
import { zodResolver } from "@hookform/resolvers/zod";
import Input from '@components/forms/input/Input';

// import { useNavigate } from 'react-router-dom';



export default function Register() {

  // const navigate = useNavigate();

      const {
        register,
        handleSubmit,
        formState: { errors },

      } = useForm<signUpType>({
        mode:"onBlur",
        resolver:zodResolver(signUpSchema)
      });

    
const submitForm:SubmitHandler<signUpType> =(data) =>{
  console.log(data);
  
}


  return (
    <>
     <Row>
      <Col md={{span:"6", offset:"3"}}>
         <Form onSubmit={handleSubmit(submitForm)}>

              <Input 
              label='First Name'
              name ="firstName"
              register={register}
              error ={errors.firstName?.message}
              />

              <Input 
              label='Last Name'
              name ="lastName"
              register={register}
              error ={errors.lastName?.message}
              />
              <Input 
              label='Email Address'
              name ="email"
              register={register}
              error ={errors.email?.message }
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
              name ="confirmPassword"
              type='password'
              register={register}
              error ={errors.confirmPassword?.message}
              />

               <Button 
                variant="info" 
                type="submit" 
                className='text-light' 
            
              >
              Submit
                
              </Button>
          </Form>
      </Col>
       
      </Row>
    </>
     

  )
}