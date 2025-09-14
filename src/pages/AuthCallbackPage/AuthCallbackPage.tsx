import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@store/hook';
import { setAccessToken } from '@store/Auth/AuthSlice';
import ActGetUsersData from '@store/Auth/Act/ActGetUsersData';
// Assuming you have actions to set the token and user data

const AuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');

    if (accessToken) {
      dispatch(setAccessToken(accessToken));
      dispatch(ActGetUsersData()).then(() => {
        navigate('/');
      });

    } else {
      navigate('/login?error=auth_failed');
    }

  }, [location, navigate, dispatch]);

  return <div>Loading, please wait...</div>;
};

export default AuthCallbackPage;