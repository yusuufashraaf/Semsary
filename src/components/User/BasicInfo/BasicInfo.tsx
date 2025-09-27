import { Container } from 'react-bootstrap';
import UserCard from '../UserCard/UserCard';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hook';
import ActGetUsersData from '@store/Auth/Act/ActGetUsersData';
import Loader from '@components/common/Loader/Loader';
import { useNavigate } from 'react-router-dom';

const BasicInfo = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, loading } = useAppSelector(state => state.Authslice);

    useEffect(() => {
        dispatch(ActGetUsersData());
    }, [dispatch]);

    if (loading === "pending") {
        return <div><Loader message='Loading...' /></div>; 
    }

    if (!user) {
        return <div>No user data available.</div>;
    }

    const handleVerifyClick = (type: "email" | "phone" | "id") => {
    if (type === "email") {
        navigate("/verify-email");
    } else if (type === "phone") {
        navigate("/verify-phone");
    } else if (type === "id") {
        navigate("/upload-id");
    }
    };

    const userData = {
        firstName: user?.first_name,
        lastName: user?.last_name,
        email: user?.email,
        phoneNumber: user?.phone_number,
        isEmailVerified: !!user?.email_verified_at,
        isPhoneVerified: !!user?.phone_verified_at,
        role: user?.role,
        status: user?.status,
        id_state:user.id_state,
        idUpladed: user?.id_image_url ?? null,
        userId:user?.id ||0,
    };

    return (
        <Container>
            <h3>Basic Information</h3>
            <hr />
            <UserCard user={userData} onVerifyClick={handleVerifyClick} />
        </Container>
    );
};

export default BasicInfo;