import { Dispatch, FC, SetStateAction } from "react";
import { ResponsiveAppBar } from "./ResponsiveAppBar";
import { User } from "../App";
import { AdminDashboardContent } from "./dashboard/AdminDashboardContent";

export const Dashboard: FC<{
    Logout: ()=>void, 
    user: User|null,
    setToken:Dispatch<SetStateAction<string|null>>, 
    token:string|null
}> = ({Logout, user, setToken, token})=>{
    
    return <>
        <ResponsiveAppBar Logout={Logout}/>
        {user?.role === "admin" && <AdminDashboardContent token={{set: setToken, value: token}}/>}
    </>
}
