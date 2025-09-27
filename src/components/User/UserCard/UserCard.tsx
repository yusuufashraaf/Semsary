import { Card, ListGroup, ListGroupItem, Badge } from "react-bootstrap";
import { Mail, Phone, User, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getEcho } from "@services/echoManager";

type TUserCardProps = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: "user" | "agent" | "owner" | "admin";
  status: "pending" | "active" | "suspended";
  id_state: "valid" | "rejected" | "pending";
  idUploaded: string | null; // 👀 double-check spelling
  userId: number;
};

const UserCard = ({
  user,
  onVerifyClick,
}: {
  user: TUserCardProps;
  onVerifyClick: (type: "email" | "phone" | "id") => void;
}) => {
  const [userState, setUserState] = useState(user);

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

  useEffect(() => {
    const echo = getEcho();
    if (!echo) {
      console.warn("Echo is not initialized yet");
      return;
    }

    const channel = echo.private(`user.${user.userId}`);

    channel.listen(".user.updated", (event: Partial<TUserCardProps>) => {
      console.log("Realtime Event:", event);
      setUserState((prev) => ({ ...prev, ...event }));
    });

    return () => {
      echo.leave(`user.${user.userId}`);
    };
  }, [user.userId]);

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5" className="d-flex align-items-center">
        <User size={24} className="me-2" />
        User #{userState.userId} Profile
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          {/* First Name */}
          <ListGroupItem className="d-flex align-items-center">
            <User size={18} className="me-2" />
            <strong>First Name:</strong> {userState.firstName}
          </ListGroupItem>

          {/* Last Name */}
          <ListGroupItem className="d-flex align-items-center">
            <User size={18} className="me-2" />
            <strong>Last Name:</strong> {userState.lastName}
          </ListGroupItem>

          {/* Email */}
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Mail size={18} className="me-2" />
              <strong>Email: </strong> {userState.email}
            </div>
            {userState.isEmailVerified ? (
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

          {/* Phone */}
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Phone size={18} className="me-2" />
              <strong>Phone: </strong> {userState.phoneNumber}
            </div>
            {userState.isPhoneVerified ? (
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

          {/* ID */}
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <strong>ID Document:</strong>
            {userState.idUploaded ? (
              <Badge
                bg={
                  userState.id_state === "valid"
                    ? "success"
                    : userState.id_state === "pending"
                    ? "warning"
                    : "danger"
                }
                className="d-flex align-items-center"
              >
                {userState.id_state === "valid" && (
                  <>
                    <CheckCircle size={14} className="me-1" /> Valid
                  </>
                )}
                {userState.id_state === "pending" && "Pending Review"}
                {userState.id_state === "rejected" && (
                  <>
                    <XCircle size={14} className="me-1" /> Rejected
                  </>
                )}
              </Badge>
            ) : userState.id_state === "rejected" ? (
              <Badge
                bg="danger"
                className="d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => onVerifyClick("id")}
                title="Click to upload"
              >
                Upload Now
              </Badge>
            ) : (
              <Badge
                bg={
                  userState.id_state === "valid"
                    ? "success"
                    : userState.id_state === "pending"
                    ? "warning"
                    : "secondary"
                }
                className="d-flex align-items-center"
              >
                {userState.id_state === "valid" && (
                  <>
                    <CheckCircle size={14} className="me-1" /> Valid
                  </>
                )}
                {userState.id_state === "pending" && "Pending Review"}
                {!userState.id_state && "Not Uploaded"}
              </Badge>
            )}
          </ListGroupItem>
                  {/* Role */}
          <ListGroupItem>
            <strong>Role:</strong>{" "}
            {userState.role
              ? userState.role.charAt(0).toUpperCase() + userState.role.slice(1)
              : "N/A"}
          </ListGroupItem>

          {/* Status */}
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <strong>Status:</strong>
            <Badge bg={getStatusVariant(userState.status)}>
              {userState.status}
            </Badge>
          </ListGroupItem>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default UserCard;

  

