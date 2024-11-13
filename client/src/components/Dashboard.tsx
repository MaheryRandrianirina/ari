import { FC } from "react";
import { ResponsiveAppBar } from "./ResponsiveAppBar";
import { User } from "../App";
import { AdminDashboardContent } from "./dashboard/AdminDashboardContent";

export const Dashboard: FC<{
    Logout: ()=>void, 
    user: User|null
}> = ({Logout, user})=>{
    return <>
        <ResponsiveAppBar Logout={Logout}/>
        {user?.role === "admin" && <AdminDashboardContent/>}
    </>
}
