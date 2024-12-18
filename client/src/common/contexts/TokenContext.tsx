import { createContext, Dispatch, SetStateAction } from "react";

export const TokenContext = createContext<{
    setToken: Dispatch<SetStateAction<string|null>>,
    token: string|null
}>({
    setToken: (value:SetStateAction<string | null>)=>null,
    token: localStorage.getItem("bearer-token")
})