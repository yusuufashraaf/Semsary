import { useState, useLayoutEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Button, Spinner, Alert, Col, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Input from '@components/forms/input/Input';
import { resetPasswordSchema, ResetPasswordType } from '@validations/resetPasswordSchema';
import ActVerifyResetToken from '@store/Auth/Act/ActVerifyResetToken';

import ActResetPass from '@store/Auth/Act/ActResetPass';

const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error } = useAppSelector(state => state.Authslice);

  const [tokenState, setTokenState] = useState<'verifying' | 'valid' | 'invalid'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // This effect verifies the token when the component first loads.
  useLayoutEffect(() => {
    if (!token || !email) {
      setTokenState('invalid');
      setErrorMessage('The reset link is incomplete or invalid.');
      return;
    }

    dispatch(ActVerifyResetToken({ token, email }))
      .unwrap()
      .then(() => {
        setTokenState('valid');
      })
      .catch((message) => {
        setTokenState('invalid');
        setErrorMessage(message || 'This link is invalid or has expired.');
      });
  }, [dispatch, token, email]);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordType>({
    mode: "onBlur",
    resolver: zodResolver(resetPasswordSchema),
  });

  // This function handles the final submission of the new password.
  const submitForm: SubmitHandler<ResetPasswordType> = (data) => {
    if (!token || !email) return; // Safeguard

    const finalData = { ...data, token, email };
    dispatch(ActResetPass(finalData))
      .unwrap()
      .then((response) => {
        setSuccessMessage(response.message + " You will be redirected to login shortly.");
        setTimeout(() => navigate('/login'), 3000);
      });
  };


  if (tokenState === 'verifying') {
    return (
      <Row>
        <Col md={{ span: "6", offset: "3" }} className="text-center mt-5">
          <Spinner animation="border" />
          <p className="mt-2">Verifying your link...</p>
        </Col>
      </Row>
    );
  }

  if (tokenState === 'invalid') {
    return (
      <Row>
        <Col md={{ span: "6", offset: "3" }} className="mt-5">
          <Alert variant="danger">
            <h4>Link Invalid</h4>
            <p>{errorMessage}</p>
          </Alert>
        </Col>
      </Row>
    );
  }

  if (successMessage) {
    return (
      <Row>
        <Col md={{ span: "6", offset: "3" }} className="mt-5">
          <Alert variant="success">
            <h4>Success!</h4>
            <p>{successMessage}</p>
          </Alert>
        </Col>
      </Row>
    );
  }

  // If the token is 'valid' and there's no success message, render the form.
  return (
    <Row>
      <Col md={{ span: "4", offset: "4" }}>
        <h3 className="mb-3">Set a New Password</h3>
        <Form onSubmit={handleSubmit(submitForm)}>
          <Input
            label="New Password"
            name="password"
            type="password"
            register={register}
            error={errors.password?.message}
          />
          <Input
            label="Confirm New Password"
            name="password_confirmation"
            type="password"
            register={register}
            error={errors.password_confirmation?.message}
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
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
          {error && (
            <p style={{ color: "#DC3545", marginTop: "10px" }}>{error}</p>
          )}
        </Form>
      </Col>
    </Row>
  );
};

export default ResetPassword;