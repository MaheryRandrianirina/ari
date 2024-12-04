import { createContext } from "react";

export const DashboardContext = createContext((value:string|null)=>console.log("default context value"))