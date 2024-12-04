import { createContext, SetStateAction } from "react";

export const TokenContext = createContext((value:SetStateAction<string | null>)=>console.log("default token dispatcher"))