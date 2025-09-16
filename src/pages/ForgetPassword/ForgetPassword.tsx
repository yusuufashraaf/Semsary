import  { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, Button, Spinner, Alert, Col, Row } from 'react-bootstrap';
import {  useAppDispatch, useAppSelector } from '@store/hook';
import Input from '@components/forms/input/Input';
// import ActForgotPassword from '@store/Auth/Act/ActForgotPassword'; // You will need to create this Thunk
import { forgotPasswordSchema, ForgotPasswordType } from '@validations/forgotPasswordSchema';
import ActforgetPass from '@store/Auth/Act/ActforgetPass';
import { Navigate } from 'react-router-dom';



const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const { loading, error,jwt } = useAppSelector(state => state.Authslice);
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordType>({
    mode: "onBlur",
    resolver: zodResolver(forgotPasswordSchema),
  });


  if (jwt) {
    return <Navigate to="/" />;
  }

  const submitForm: SubmitHandler<ForgotPasswordType> = (data) => {

    setSuccessMessage(null);
    
    dispatch(ActforgetPass(data))
      .unwrap()
      .then((response) => {
        setSuccessMessage(response.message);
      })
      .catch(() => {
      });
  };

  return (
    <Row>
      <Col md={{ span: "4", offset: "4" }}>
        <h3 className="mb-3">Forgot Your Password?</h3>
        <p className="text-muted">
          No problem. Enter your email address below, and we'll send you a link to reset it.
        </p>

        {successMessage && !error && (
          <Alert variant="success">{successMessage}</Alert>
        )}

        <Form onSubmit={handleSubmit(submitForm)}>
          <Input
            label='Email Address'
            name="email"
            register={register}
            error={errors.email?.message}
            placeholder="you@example.com"
          />

          <Button
            variant="info"
            type="submit"
            className='text-light mt-3'
            style={{ width: "100%" }}
            disabled={loading === 'pending'}
          >
            {loading === "pending" ? (
              <>
                <Spinner animation="border" size="sm" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>

          {/* 5. Display API errors, if any. */}
          {error && (
            <p style={{ color: "#DC3545", marginTop: "10px" }}>{error}</p>
          )}
        </Form>
      </Col>
    </Row>
  );
};

export default ForgotPassword;