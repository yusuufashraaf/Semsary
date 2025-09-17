
import { useAppSelector } from "@store/hook";
import { Navigate } from "react-router-dom";

function ProtectedRoute({children}:{children:React.ReactNode}) {
    const {jwt}=useAppSelector(state => state.Authslice)

    if(!jwt){
       return <Navigate to="/login?message=login_required" />
    }
    return <>{children}</>;
}

export default ProtectedRoute