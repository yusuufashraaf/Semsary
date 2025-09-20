import '../../styles/themes.css';
import { TFullUser } from 'src/types/users/users.types';
//import './profile-components.css';


const ProfileHeader = ({ section, user }: { section: string|undefined, user: TFullUser })=> {
  return (
    
    <div className="card">
      <div>
        <h6 className="text-center text-capitalize">Welcome {user.first_name}</h6>
      </div>
      <div>
        <h2 className="heading-secondary text-capitalize">{section} page</h2>
      </div>
      
      <div className="sidebar-nav">
        <div className="nav-section">
          <h4 className="heading-tertiary">Navigation</h4>
          <a href='home' className="btn btn-secondary">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a href='properties' className="btn btn-secondary">
            <i className="fas fa-shopping-bag"></i>
            <span>Properties</span>
          </a>
          <a href='reviews' className="btn btn-secondary">
            <i className="fas fa-key"></i>
            <span>Reviews</span>
          </a>
          <a href='purchases' className="btn btn-secondary">
            <i className="fas fa-house-user"></i>
            <span>Purchases</span>
          </a>
          <a href='wishlist' className="btn btn-secondary">
            <i className="fas fa-house-user"></i>
            <span>Wishlist</span>
          </a>
        </div>

        <div className="nav-section">
          <h4 className="heading-tertiary">Account</h4>
          <a href='#' className="btn btn-secondary">
            <i className="fas fa-envelope"></i>
            <span>Messages</span>
            <span className="notification-badge">3</span>
          </a>
          <a href='notifications' className="btn btn-secondary">
            <i className="fas fa-bell"></i>
            <span>Notifications</span>
            <span className="notification-badge">12</span>
          </a>
          {/* <a href='basicInfo' className="btn btn-secondary">
            <i className="fas fa-user"></i>
            <span>Basic Info</span>
          </a> */}
          <a href='changePhone' className="btn btn-secondary">
            <i className="fas fa-user"></i>
            <span>Change Phone</span>
          </a>
          <a href='changeEmail' className="btn btn-secondary">
            <i className="fas fa-user"></i>
            <span>Change Email</span>
          </a>
          <a href='changePassword' className="btn btn-secondary">
            <i className="fas fa-user"></i>
            <span>Change Password</span>
          </a>
        </div>

        

        {/* <div className="nav-section">
          <h4 className="heading-tertiary">Account</h4>
                    <ListGroup>
                      <ListGroupItem className="btn btn-secondary" as={NavLink} to="/profile/basicInfo" end>
                        <User size={20} /> Basic Information
                      </ListGroupItem>
                      
                      <ListGroupItem className="btn btn-secondary" as={NavLink} to="/profile/changeEmail">
                        <Mail size={20} /> Change Email
                      </ListGroupItem>
                        <ListGroupItem className="btn btn-secondary" as={NavLink} to="/profile/changePhone">
                        <Phone size={20} /> Change Phone
                      </ListGroupItem>
                      <ListGroupItem className="btn btn-secondary" as={NavLink} to="/profile/changePassword">
                        <Key size={20} /> Change Password
                      </ListGroupItem>
                    </ListGroup>
          </div> */}
      </div>
    </div>
  );
};


export default ProfileHeader;