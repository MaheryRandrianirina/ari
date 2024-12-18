import { FC, useContext, useEffect } from "react";
import { ResponsiveAppBar } from "./ResponsiveAppBar";
import { User } from "../App";
import { AdminDashboardContent } from "./dashboard/AdminDashboardContent";
import { DashboardContext } from "./dashboard/contexts/DashboardContext";
import { SnackbarContext } from "./dashboard/contexts/SnackbarContext";
import { UserDashboardContent } from "./dashboard/user/UserDashboardContent";


export const Dashboard: FC<{
    Logout: ()=>void, 
    user: User|null
}> = ({Logout, user})=>{
    useEffect(()=>{ document.title = "Dashboard"; });
    
    const setSnackbarMessage = useContext(SnackbarContext);
    
    return <DashboardContext.Provider value={setSnackbarMessage}>
        <ResponsiveAppBar Logout={Logout}/>
        {user?.role === "admin" && <AdminDashboardContent/>}
        {user?.role === "user" && <UserDashboardContent/>}
    </DashboardContext.Provider>
}
