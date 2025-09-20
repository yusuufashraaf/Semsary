import { useForm } from 'react-hook-form';
import { Card, Button, Alert, Form, Row, Col } from 'react-bootstrap';
import { Mail, XCircle } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@store/hook';
import ActChangeEmail from '@store/Auth/Act/ActChangeEmail';
import { ChangeEmailFormValues } from 'src/types/users/users.types';
import Input from '@components/forms/input/Input';

const ChangeEmail = () => {
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector(state => state.Authslice);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangeEmailFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data:ChangeEmailFormValues) => {

    dispatch(ActChangeEmail(data))
      .then(() => {
        reset();
      })
      .catch((err) => {
        console.error("Error dispatching action: ", err);
      });
  };

  return (

      <Row className="mx-5">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header as="h5" className="d-flex align-items-center">
              <Mail size={24} className="me-2" />
              Change Your Email Address
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" className="d-flex align-items-center">
                  <XCircle size={18} className="me-2" /> {error}
                </Alert>
              )}
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Email Address</Form.Label>
                  <Form.Control type="email" value={user?.email} readOnly disabled />
                </Form.Group>
                <Input
                  label="New Email Address"
                  name="email"
                  type="email"
                  register={register}
                  error={errors.email?.message}
                  placeholder="New Email Address"
                  disabled={loading === "pending"}
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  register={register}
                  error={errors.password?.message}
                  placeholder="Password"
                  disabled={loading === "pending"}
                />
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 d-flex justify-content-center"
                  disabled={loading === "pending"}
                >
                  {loading === "pending" ? 'Updating...' : 'Update Email'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

  );
};

export default ChangeEmail;

