import axios from "axios";
import { Dispatch, SetStateAction } from "react";

export const handleTokenExpiration = (setToken:Dispatch<SetStateAction<string|null>>, token:string|null)=>{
  
    axios.get("http://localhost:3000/user/token",{
        withCredentials: true,
        headers: {
          authorization: token
        }
      }).then(res => {
        localStorage.setItem("bearer-token", res.data.bearer_token);
        
        setToken(res.data.bearer_token);
      }).catch(err => setToken(null));
}