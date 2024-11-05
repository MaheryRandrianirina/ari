import { FC } from "react";
import { ResponsiveAppBar } from "./ResponsiveAppBar";
import { User } from "../App";
import { Button } from "@mui/material";

export const Dashboard: FC<{
    Logout: ()=>void, 
    user: User|null
}> = ({Logout, user})=>{
    return <>
        <ResponsiveAppBar Logout={Logout}/>
        {user?.role === "admin" && <Button type="submit" variant="contained" fullWidth sx={{mt:2}}>Connect</Button>}
    </>
}