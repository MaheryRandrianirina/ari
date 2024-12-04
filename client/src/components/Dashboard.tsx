import { Dispatch, FC, SetStateAction, useState } from "react";
import { ResponsiveAppBar } from "./ResponsiveAppBar";
import { User } from "../App";
import { AdminDashboardContent } from "./dashboard/AdminDashboardContent";
import { IconButton, Snackbar, SnackbarCloseReason } from "@mui/material";
import { DashboardContext } from "./dashboard/contexts/DashboardContext";
import CloseIcon from '@mui/icons-material/Close';

export const Dashboard: FC<{
    Logout: ()=>void, 
    user: User|null,
    setToken:Dispatch<SetStateAction<string|null>>, 
    token:string|null
}> = ({Logout, user, setToken, token})=>{
    const [snackbarMessage, setSnackbarMessage] = useState<string|null>(null);

    const handleCloseSnackbar = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
      ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSnackbarMessage(null);
    };

    const action = (
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
        </IconButton>
    );
    
    return <>
        <DashboardContext.Provider value={setSnackbarMessage}>
            <ResponsiveAppBar Logout={Logout}/>
            {user?.role === "admin" && <AdminDashboardContent token={{set: setToken, value: token}}/>}
        </DashboardContext.Provider>
        <Snackbar
            open={snackbarMessage!==null}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={snackbarMessage}
            action={action}
        />
    </>
}
