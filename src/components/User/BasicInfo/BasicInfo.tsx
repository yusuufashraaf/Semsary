import { Container } from 'react-bootstrap';
import UserCard from '../UserCard/UserCard';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hook';
import ActGetUsersData from '@store/Auth/Act/ActGetUsersData';
// Assuming UserCard is in the same directory

const BasicInfo = () => {
    const dispatch = useAppDispatch();
    const { user,loading } = useAppSelector(state => state.Authslice);
    
    useEffect(() => {
    dispatch(ActGetUsersData());
        
    },[dispatch])

    if (loading === "pending") {
    return <div>Loading...</div>; 
  }

  if (!user) {
    return <div>No user data available.</div>;
  }



  const userData = {
    firstName: user?.first_name,
    lastName: user?.last_name,
    email: user?.email,
    phoneNumber: user?.phone_number,
    isEmailVerified: user?.email_verified_at ? true : false,
    isPhoneVerified: user?.phone_verified_at ? true : false,
    role: user?.role
  };


  return (
    <Container>
      <h3>Basic Information</h3>
      <hr />
        {user && <UserCard user={userData} />}
    </Container>
  );
};

export default BasicInfo;