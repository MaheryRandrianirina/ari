import { createContext } from "react";

export const SnackbarContext = createContext((value:string|null)=>console.log("default context value"))