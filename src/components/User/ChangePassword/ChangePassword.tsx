import { useForm } from 'react-hook-form';
import { Card, Button, Alert, Form, Row, Col } from 'react-bootstrap';
import { Key, XCircle } from 'lucide-react';
import Input from '@components/forms/input/Input';
import { useAppDispatch, useAppSelector } from '@store/hook';
import ActChangePassword from '@store/Auth/Act/ActChangePassword';
import { ChangePasswordFormValues } from 'src/types/users/users.types';
import { Link } from 'react-router-dom';


const ChangePassword = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.Authslice);


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    dispatch(ActChangePassword(data)).unwrap()
      .then(() => {
        // reset form fields
        reset();

      });
  };

  return (
    <Row className="mx-5">
    <Col md={8}>
    <Card className="shadow-sm">
      <Card.Header as="h5" className="d-flex align-items-center">
        <Key size={24} className="me-2" />
        Change Your Password
      </Card.Header>
      <Card.Body>

        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <XCircle size={18} className="me-2" /> {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Current Password"
            name="current_password"
            type="password"
            register={register}
            error={errors.current_password?.message}
            placeholder="Current Password"
            disabled={loading === "pending"}
          />
          <div 
  style={{ color: 'var(--primary-color)' }} 
  className="d-flex justify-content-between mt-2"
>
  <Link to="/forgot-password" className="text-decoration-none">
    Forgot Password?
  </Link>
  <Link to="/register" className="text-decoration-none">
    Register Here
  </Link>
</div>
          <Input
            label="New Password"
            name="new_password"
            type="password"
            register={register}
            error={errors.new_password?.message}
            placeholder="New Password"
            disabled={loading === "pending"}
          />
          <Input
            label="Confirm New Password"
            name="new_password_confirmation"
            type="password"
            register={register}
            error={errors.new_password_confirmation?.message}
            placeholder="Confirm New Password"
            disabled={loading === "pending"}
          />
          <Button variant="primary" type="submit"
           className="w-100 d-flex justify-content-center" disabled={loading === "pending"}

           >
            {loading === "pending" ? 'Updating...' : 'Update Password'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
    </Col>
    </Row>
  );
};

export default ChangePassword;