import LoadingScreen from "@components/common/LoaderScreen/LoadingScreen";
import ActLogout from "@store/Auth/Act/ActLogout";
import { useAppDispatch } from "@store/hook";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Logout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

useEffect(() => {
    dispatch(ActLogout()).unwrap().then(()=>{
       navigate('/login');
   })
}, [dispatch, navigate]);

  return (
    <div>
      <LoadingScreen/>
    </div>
  )
}

export default Logout
