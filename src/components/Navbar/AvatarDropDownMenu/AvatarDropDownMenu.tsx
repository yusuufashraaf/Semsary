import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { TUser } from 'src/types/users/users.types';
import { LogIn, User } from 'lucide-react';
import { useAppSelector } from '@store/hook';

const AvatarDropdown = ({ user }: { user: TUser | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const {jwt} = useAppSelector(state=> state.Authslice)
  const dropdownRef = useRef<HTMLDivElement>(null);

  //   if the user clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async() => {
    setIsOpen(false);
    navigate('/logout');
   
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (!user || !jwt) {
    return (
      <Link to="/login" title="Log in">
      <button className={styles.signInBtn} aria-label="Log in">
        <LogIn size={20} strokeWidth={2.5} /> 
      </button>
    </Link>
    );
  }

  
  const avatarContent =  <div
      className={`${styles.avatar} ${styles.iconPlaceholder} rounded-circle`}
      onClick={toggleDropdown}
    >
      <User size={24} />
    </div>



  return (
    <div className={styles.avatarContainer} ref={dropdownRef}>
      
      {avatarContent}

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <ul>
            <li>
              <Link to={`/profile/home`} onClick={() => setIsOpen(false)}>
                Show Profile
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;