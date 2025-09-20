import { useForm } from 'react-hook-form';
import { Card, Button, Alert, Form, Row, Col } from 'react-bootstrap';
import { Phone, XCircle } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@store/hook';

import { zodResolver } from '@hookform/resolvers/zod';
import { changePhoneSchema, ChangePhoneSchemaType } from '@validations/changePhoneSchema'; 


import Input from '@components/forms/input/Input';
import ActChangePhone from '@store/Auth/Act/ActChangePhone'; 


const ChangePhone = () => {
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector(state => state.Authslice);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePhoneSchemaType>({
    resolver: zodResolver(changePhoneSchema),
    defaultValues: {
      phone_number: '',
      password: '',
    },
  });

  const onSubmit = (data: ChangePhoneSchemaType) => {
    dispatch(ActChangePhone(data))
      .unwrap() 
      .then(() => {
        reset(); 
      })
      .catch((err) => {
        console.error("Failed to change phone number:", err);
      });
  };

  return (
    <Row className="mx-5">
      <Col md={8}>
        <Card className="shadow-sm">
          <Card.Header as="h5" className="d-flex align-items-center">
            <Phone size={24} className="me-2" />
            Change Your Phone Number
          </Card.Header>
          <Card.Body>
            {error && (
              <Alert variant="danger" className="d-flex align-items-center">
                <XCircle size={18} className="me-2" /> {error}
              </Alert>
            )}
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label>Current Phone Number</Form.Label>
                <Form.Control type="tel" value={user?.phone_number || 'Not set'} readOnly disabled />
              </Form.Group>
              <Input
                label="New Phone Number"
                name="phone_number"
                type="tel"
                register={register}
                error={errors.phone_number?.message}
                placeholder="New Phone Number"
                disabled={loading === "pending"}

              />
              <Input
                label="Password"
                name="password"
                type="password"
                register={register}
                error={errors.password?.message}
                placeholder="Enter your password to confirm"
                disabled={loading === "pending"}
              />
              <Button
                variant="primary"
                type="submit"
                className="w-100 d-flex justify-content-center"
                disabled={loading === "pending"}
              >
                {loading === "pending" ? 'Updating...' : 'Update Phone Number'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ChangePhone;