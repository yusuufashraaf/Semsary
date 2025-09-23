import api from "@services/axios-global";
import axiosErrorHandle from "@utils/axiosErrorHandler";
import { useState } from "react"

type TStatus = "idle" | "checking" | "available" | "notAvailable" | "failed";

function useCheckEmailForAvailability() {
    
    const [emailAvailabilityStatus,setEmailAvailabilityStatus]=useState<TStatus>('idle');
    const [enteredEmail, setEnteredEmail] = useState<null | string>(null);

    const checkEmailAvailability =async(email:string)=>{
        setEnteredEmail(email);
        setEmailAvailabilityStatus("checking");

        try {
            
            const response =await api.get(`/check-availability/email?email=${email}`);
            
            if(response.data.isAvailable === true){

                setEmailAvailabilityStatus("available");
            }else{
                setEmailAvailabilityStatus("notAvailable");
            }

        } catch (error) {
            setEmailAvailabilityStatus("failed");
            axiosErrorHandle(error);
        }
    }
    const resetEmailAvailability =()=>{
        setEnteredEmail(null);
        setEmailAvailabilityStatus("idle");
    }

  return {checkEmailAvailability,emailAvailabilityStatus,enteredEmail,resetEmailAvailability}
}

export default useCheckEmailForAvailability