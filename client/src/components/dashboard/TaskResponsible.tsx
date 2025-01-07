import { Button, Menu, MenuItem, Typography } from "@mui/material";
import axios, { AxiosError } from "axios";
import { memo, MouseEventHandler, useContext, useEffect, useState } from "react";
import { User } from "../../App";
import { DashboardContext } from "./contexts/DashboardContext";
import { get, post } from "../../common/utils/api";
import { handleTokenExpiration } from "../../utils/handleTokenExpiration";
import { TokenContext } from "../../common/contexts/TokenContext";

const ITEM_HEIGHT = 48;

export const TaskResponsible = memo(({taskId, responsibleId, users}:{
    taskId: string,
    responsibleId: string|null,
    users?: User[]
})=>{
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const openMenu = Boolean(anchorEl);

    const [responsible, setResponsible] = useState<string|null>(null);

    const setSnackbarMessage = useContext(DashboardContext);

    const {setToken, token} = useContext(TokenContext);

    const fetchResponsible = async(responsibleId:string)=>{
        try {
            const res = await get(`user/${responsibleId}`, token);

            setResponsible(res.data.username);
        }catch(e) {
            const err = e as AxiosError<{message:string}>;
            if(err.status === 401 && err.response?.data.message.toLowerCase() === "token has expired") {
                handleTokenExpiration(setToken);

                await fetchResponsible(responsibleId);
            }
        }        
    }
    
    useEffect(()=>{
        if(responsibleId) {
            fetchResponsible(responsibleId);
        }
    }, [responsibleId]);

    const handleShowTaskResponsibleMenu: MouseEventHandler<HTMLButtonElement> = e=>{        
        setAnchorEl(e.currentTarget);
    }

    const handleCloseMenu: MouseEventHandler<HTMLElement> = e => {
        setAnchorEl(null);
    }

    const handleAddTaskResponsible = async(task_id:string, user_id:string)=>{
        try {
            await post(`tasks/${task_id}/user`, {user_id}, token);
            await fetchResponsible(user_id);
        }catch(e){
            const err = e as AxiosError<{message:string}>;
            if(err.response?.data.message) setSnackbarMessage(err.response?.data.message);
        }
    }    
    console.log(users)
    return <div>
        {responsible && <Typography>{responsible}</Typography>}
        {!responsible && <Button id="add-responsible-button" color="primary" onClick={handleShowTaskResponsibleMenu}>Add responsible</Button>}
        {(!responsible && users) && <Menu 
            MenuListProps={{
                'aria-labelledby': 'add-responsible-button',
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            slotProps={{
            paper: {
                style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: '20ch',
                },
            },
            }}
        >
            {users.map(user => (<MenuItem key={user.username} onClick={() =>handleAddTaskResponsible(taskId, user._id)} disableRipple>
                {user.username}
            </MenuItem>))}
        </Menu>}
    </div>
});