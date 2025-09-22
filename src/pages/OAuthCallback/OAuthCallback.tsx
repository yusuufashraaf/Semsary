import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '@services/axios-global';
import { setAccessToken, setUser } from '@store/Auth/AuthSlice';
import ActCheckAuth from '@store/Auth/Act/ActCheckAuth';
import { useAppDispatch } from '@store/hook';
import { useRoleBasedNavigation } from '@hooks/useRoleBasedNavigation';

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { navigateByRole } = useRoleBasedNavigation();

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');
            const error = searchParams.get('error');

            if (error) {
                console.error('OAuth error:', error);
                navigate('/login');
                return;
            }

            if (!token) {
                console.error('No token received');
                navigate('/login');
                return;
            }

            try {
                // Exchange temporary token for actual auth tokens
                const response = await api.post('/auth/google/exchange', { 
                    token 
                });
                
                dispatch(ActCheckAuth()); 
                dispatch(setAccessToken(response.data.access_token)) ;
                dispatch(setUser(response.data.user))   
                // navigate('/');
                navigateByRole(response.data.user);

            } catch (error) {
                console.error('Token exchange failed:', error);
                navigate('/login');
            }
        };

        handleCallback();
    }, [searchParams, navigate, dispatch, navigateByRole]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Completing sign in...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    );
};

export default OAuthCallback;