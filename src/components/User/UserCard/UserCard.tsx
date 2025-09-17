
import { Card, ListGroup, ListGroupItem, Badge } from 'react-bootstrap';
import { Mail, Phone, User, CheckCircle, XCircle } from 'lucide-react';

 type TUserCardProps={
    firstName:string,
    lastName:string,
    email:string,
    phoneNumber:string,
    isEmailVerified:boolean,
    isPhoneVerified:boolean
}

const UserCard = ({ user }:{user : TUserCardProps}) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    isEmailVerified,
    isPhoneVerified
  } = user;

  
  return (
    <Card className="shadow-sm">
      <Card.Header as="h5" className="d-flex align-items-center">
        <User size={24} className="me-2" />
        User Profile
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          <ListGroupItem>
            <strong>First Name:</strong> {firstName}
          </ListGroupItem>
          <ListGroupItem>
            <strong>Last Name:</strong> {lastName}
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <div>
              <Mail size={18} className="me-2" />
              <strong>Email:</strong> {email}
            </div>
            {isEmailVerified ? (
              <Badge bg="success" className="d-flex align-items-center">
                <CheckCircle size={14} className="me-1" /> Verified
              </Badge>
            ) : (
              <Badge bg="danger" className="d-flex align-items-center">
                <XCircle size={14} className="me-1" /> Not Verified
              </Badge>
            )}
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <div>
              <Phone size={18} className="me-2" />
              <strong>Phone Number:</strong> {phoneNumber}
            </div>
            {isPhoneVerified ? (
              <Badge bg="success" className="d-flex align-items-center">
                <CheckCircle size={14} className="me-1" /> Verified
              </Badge>
            ) : (
              <Badge bg="danger" className="d-flex align-items-center">
                <XCircle size={14} className="me-1" /> Not Verified
              </Badge>
            )}
          </ListGroupItem>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default UserCard;