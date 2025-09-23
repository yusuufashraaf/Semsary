import { Card, ListGroup, ListGroupItem, Badge, Button, } from "react-bootstrap";
import { Mail, Phone, User, CheckCircle, XCircle } from "lucide-react";


type TUserCardProps = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: "user" | "agent" | "owner" | "admin";
  status: "pending" | "active" | "suspended";
  idUpladed:string | null
};

const UserCard = ({
  user,
  onVerifyClick,
}: {
  user: TUserCardProps;
  onVerifyClick: (type: "email" | "phone"| "id") => void;
}) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    isEmailVerified,
    isPhoneVerified,
    role,
    status,
    idUpladed
  } = user;

  const getStatusVariant = (status: TUserCardProps["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "suspended":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5" className="d-flex align-items-center">
        <User size={24} className="me-2" />
        User Profile
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          <ListGroupItem className="d-flex align-items-center">
            <User size={18} className="me-2" />
            <strong>First Name:</strong> {firstName}
          </ListGroupItem>

          <ListGroupItem className="d-flex align-items-center">
            <User size={18} className="me-2" />
            <strong>Last Name:</strong> {lastName}
          </ListGroupItem>

          {/* Email Row */}
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Mail size={18} className="me-2" />
              <strong>Email: </strong> {email}
            </div>
            {isEmailVerified ? (
              <Badge bg="success" className="d-flex align-items-center">
                <CheckCircle size={14} className="me-1" /> Verified
              </Badge>
            ) : (
              <Badge
                bg="danger"
                className="d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => onVerifyClick("email")}
                title="Click to verify"
              >
                <XCircle size={14} className="me-1" /> Verify Now
              </Badge>
            )}
          </ListGroupItem>

          {/* Phone Row */}
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Phone size={18} className="me-2" />
              <strong>Phone: </strong> {phoneNumber}
            </div>
            {isPhoneVerified ? (
              <Badge bg="success" className="d-flex align-items-center">
                <CheckCircle size={14} className="me-1" /> Verified
              </Badge>
            ) : (
              <Badge
                bg="danger"
                className="d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => onVerifyClick("phone")}
                title="Click to verify"
              >
                <XCircle size={14} className="me-1" /> Verify Now
              </Badge>
            )}
          </ListGroupItem>


          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <strong>ID Document:</strong>
            {idUpladed ? (
              <Badge bg="success" className="d-flex align-items-center">
                Uploaded
              </Badge>
            ) : (
              <Badge
                bg="danger"
                className="d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => onVerifyClick("id")}
                title="Click to upload"
              >
                Upload Now
              </Badge>
            )}
          </ListGroupItem>
                    {/* Role */}
          <ListGroupItem>
            <strong>Role:</strong>{" "}
            {role ? role.charAt(0).toUpperCase() + role.slice(1) : "N/A"}
          </ListGroupItem>

          {/* Status */}
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <strong>Status:</strong>
            <Badge bg={getStatusVariant(status)}>{status}</Badge>
          </ListGroupItem>

        </ListGroup>
      </Card.Body>
    </Card>
  );
};


export default UserCard;