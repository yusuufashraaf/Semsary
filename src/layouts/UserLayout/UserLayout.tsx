import { Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";
import { User, LogOut, Mail, Key, Phone } from 'lucide-react'; 

const UserLayout = () => {
  return (
    <>
      <div style={{ paddingTop: '50px'}}>
        <Row className="flex-nowrap">
          {/* Main Sidebar (Column 1) */}
          <Col 
            md={2}
            className="d-flex flex-column p-3"
            style={{ 
              backgroundColor: "#f8f9fa",
              position: "fixed",  
              top: "58px",        
              bottom: 0,          
              zIndex: 1000,  
            }}
          >
            <nav className="sidebar-nav flex-grow-1">
              <ListGroup>
                <ListGroupItem as={NavLink} to="/profile" >
                  <User size={20} /> Profile
                </ListGroupItem>
              </ListGroup>
            </nav>

            <div className="sidebar-footer mt-auto">
              <ListGroup>
                <ListGroupItem as={NavLink} to="/logout">
                  <LogOut size={20} /> Logout
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>

          {/* Main Content Area (Column 2) */}
          <Col
            md={10} 
            className="p-6"
            style={{ 
              marginLeft: "16.666667%",
              marginTop: "-30px",
              position: "fixed"
            }}
          >
            <main className="flex-grow-1">
              {/* Nested Basic Info Layout */}
              <Row>
                {/* Nested Sidebar */}
                <Col md={2}>
                  <nav className="nested-sidebar">
                    <ListGroup>
                      <ListGroupItem as={NavLink} to="/profile/basicInfo" end>
                        <User size={20} /> Basic Information
                      </ListGroupItem>
                      
                      <ListGroupItem as={NavLink} to="/profile/changeEmail">
                        <Mail size={20} /> Change Email
                      </ListGroupItem>
                        <ListGroupItem as={NavLink} to="/profile/changePhone">
                        <Phone size={20} /> Change Phone
                      </ListGroupItem>
                      <ListGroupItem as={NavLink} to="/profile/changePassword">
                        <Key size={20} /> Change Password
                      </ListGroupItem>
                    </ListGroup>
                  </nav>
                </Col>
                
                {/* Nested Content Area */}
                <Col md={8}>
                  <Outlet />
                </Col>
              </Row>
            </main>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default UserLayout;