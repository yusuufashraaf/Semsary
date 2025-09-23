import api from "@services/axios-global";
import axiosErrorHandle from "@utils/axiosErrorHandler";
import { useState } from "react";


type TStatus = "idle" | "checking" | "available" | "notAvailable" | "failed";

function useCheckPhoneForAvailability() {

    const [phoneAvailabilityStatus, setPhoneAvailabilityStatus] = useState<TStatus>('idle');
    const [enteredPhone, setEnteredPhone] = useState<null | string>(null);


    const checkPhoneAvailability = async (phone: string) => {
        setEnteredPhone(phone);
        setPhoneAvailabilityStatus("checking");

        try {

            const response = await api.get(`/check-availability/phone?phone=${phone}`);
            
            if (response.data.isAvailable === true) {
                setPhoneAvailabilityStatus("available");
            } else {
                setPhoneAvailabilityStatus("notAvailable");
            }

        } catch (error) {
            setPhoneAvailabilityStatus("failed");
            axiosErrorHandle(error); 
        }
    };


    const resetPhoneAvailability = () => {
        setEnteredPhone(null);
        setPhoneAvailabilityStatus("idle");
    };

    return { 
        checkPhoneAvailability, 
        phoneAvailabilityStatus, 
        enteredPhone, 
        resetPhoneAvailability 
    };
}

export default useCheckPhoneForAvailability;