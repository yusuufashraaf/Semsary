import Input from "@components/forms/input/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import ActSignIn from "@store/Auth/Act/ActSignIn";
import { resetUI } from "@store/Auth/AuthSlice";
import { useAppDispatch, useAppSelector } from "@store/hook";
import { signInSchema, signInType } from "@validations/signInSchema";
import { useEffect } from "react";
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap"
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";

function Login() {
  const [searchParams,setSearchParams]=useSearchParams();
    const dispatch =useAppDispatch();
    const {loading,error,jwt}=useAppSelector(state=> state.Authslice)
    const navigate = useNavigate();

  useEffect(()=>{
    return ()=>{
      dispatch(resetUI())
    }
  },[dispatch])


  const {
      register,
      handleSubmit,
      formState: { errors },

    } = useForm<signInType>({
      mode:"onBlur",
      resolver:zodResolver(signInSchema)
    });
    const submitForm:SubmitHandler<signInType> =(data) =>{  
        if (searchParams.get("message")) {
          setSearchParams("");
        }
        dispatch(ActSignIn(data)).unwrap().then(()=>{
          navigate('/')
        })
        
    }
      if (jwt) {
      return <Navigate to="/" />;
    }


  return (
  <>
     <Row>

      <Col md={{span:"4", offset:"4"}}>
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

              <div className="d-flex justify-content-end mt-2">
              <Link to="/forgot-password">Forgot Password?</Link>
              </div>
              <Button 
                variant="info" 
                type="submit" 
                className='text-light mt-3' 
                style={{width:"100%"}}
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

export default Login
