import  { useState } from 'react';
import { Form, Button, Card, Alert, FloatingLabel } from 'react-bootstrap';
import { Mail, CheckCircle, XCircle } from 'lucide-react';
import { useAppSelector } from '@store/hook';

const ChangeEmail = () => {
const {email}=useAppSelector(state=> state.Authslice.user);
  const [currentEmail, setCurrentEmail] = useState(email);
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newEmail === currentEmail) {
      setError('New email cannot be the same as the current email.');
      return;
    }

    // Basic validation for demonstration
    if (!newEmail || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // Here you would typically make an API call to update the email
    console.log('Attempting to change email...');
    
    setTimeout(() => {
      // Simulate API response
      const isSuccess = true; // Set to false to test the error case

      if (isSuccess) {
        setSuccess('Your email has been successfully updated.');
        setCurrentEmail(newEmail); // Update state with the new email
        setNewEmail('');
        setPassword('');
      } else {
        setError('Failed to update email. Please check your credentials.');
      }
    }, 1500); // Simulate network delay
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5" className="d-flex align-items-center">
        <Mail size={24} className="me-2" />
        Change Your Email Address
      </Card.Header>
      <Card.Body>
        {success && (
          <Alert variant="success" className="d-flex align-items-center">
            <CheckCircle size={18} className="me-2" /> {success}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <XCircle size={18} className="me-2" /> {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Current Email Address</Form.Label>
            <Form.Control type="email" value={currentEmail} readOnly disabled />
          </Form.Group>

          <FloatingLabel controlId="newEmail" label="New Email Address" className="mb-3">
            <Form.Control
              type="email"
              placeholder="name@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </FloatingLabel>
          
          <FloatingLabel controlId="password" label="Password" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FloatingLabel>

          <Button variant="primary" type="submit" className="w-100">
            Update Email
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ChangeEmail;
