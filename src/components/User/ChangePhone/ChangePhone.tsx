import { useState } from 'react';
import { Form, Button, Card, Alert, FloatingLabel } from 'react-bootstrap';
import { Phone, CheckCircle, XCircle } from 'lucide-react';
import { useAppSelector } from '@store/hook';

const ChangePhone = () => {
    const {phone_number}=useAppSelector(state=> state.Authslice.user);
  const [currentPhone, setCurrentPhone] = useState(phone_number);
  const [newPhone, setNewPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPhone === currentPhone) {
      setError('New phone number cannot be the same as the current one.');
      return;
    }

    // Basic validation for demonstration
    if (!newPhone || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // You would typically validate phone number format here
    // e.g., using a regex: /^\d{3}-\d{3}-\d{4}$/

    // Here you would typically make an API call to update the phone number
    console.log('Attempting to change phone number...');
    
    setTimeout(() => {
      // Simulate API response
      const isSuccess = true; // Set to false to test the error case

      if (isSuccess) {
        setSuccess('Your phone number has been successfully updated.');
        setCurrentPhone(newPhone); // Update state with the new phone number
        setNewPhone('');
        setPassword('');
      } else {
        setError('Failed to update phone number. Please check your credentials.');
      }
    }, 1500); // Simulate network delay
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5" className="d-flex align-items-center">
        <Phone size={24} className="me-2" />
        Change Your Phone Number
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
            <Form.Label>Current Phone Number</Form.Label>
            <Form.Control type="tel" value={currentPhone} readOnly disabled />
          </Form.Group>

          <FloatingLabel controlId="newPhone" label="New Phone Number" className="mb-3">
            <Form.Control
              type="tel"
              placeholder="Enter new phone number"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
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
            Update Phone Number
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ChangePhone;