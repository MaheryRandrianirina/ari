import { Dispatch, SetStateAction } from "react";
import { BEARER_TOKEN_INDEX } from "./consts";
import { get } from "../common/utils/api";

export const handleTokenExpiration = (setToken:Dispatch<SetStateAction<string|null>>)=>{
    get("user/token").then(res => {
      localStorage.setItem(BEARER_TOKEN_INDEX, res.data.bearer_token);
        
      setToken(res.data.bearer_token);
    }).catch(err => setToken(null));
}