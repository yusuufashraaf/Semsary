
import axios from "axios";
       
const axiosErrorHandle =(error:unknown)=>{
        if(axios.isAxiosError(error)){
            console.log(error);
            
            return (error.response?.data || error.response?.data?.message || error.message);     
        }else{
            return ("unExpected error");
        }

}       

export default axiosErrorHandle;