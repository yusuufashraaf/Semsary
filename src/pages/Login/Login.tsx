import Input from "@components/forms/input/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, signInType } from "@validations/signInSchema";
import { Alert, Button, Col, Form, Row } from "react-bootstrap"
import { SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";


function Login() {
  const [searchParams,setSearchParams]=useSearchParams();
    const {
        register,
        handleSubmit,
        formState: { errors },

      } = useForm<signInType>({
        mode:"onBlur",
        resolver:zodResolver(signInSchema)
      });
      const submitForm:SubmitHandler<signInType> =(data) =>{  
          console.log(data);
          
      }

  return (
  <>
     <Row>

      <Col md={{span:"6", offset:"3"}}>
          {searchParams.get('message') === "account_created" &&
          (
            <Alert variant="success">
              Your account successfully created, please login
            </Alert>
          )}

         <Form onSubmit={handleSubmit(submitForm)}>

              <Input 
              label='Email Address'
              name ="email"
              register={register}
              error ={errors.email?.message}
              />
              <Input 
              label='Password'
              name ="password"
              register={register}
              error ={errors.password?.message}
              type='password'
              />
              
              
              <Button variant="info" type="submit" className='text-light'>
                Submit
              </Button>
          </Form>
      </Col>
       
      </Row>
    </>
  )
}

export default Login
