import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { Task } from "../../App";
import { handleTokenExpiration } from "../../utils/handleTokenExpiration";
import { get } from "../../common/utils/api";

export const UserTasks = ({userid, setToken, token}: {
    userid:string, 
    token:string|null, 
    setToken:Dispatch<SetStateAction<string|null>>
})=>{
    const [userTasks, setUserTasks] = useState<Task[]>([]);
    
    useEffect(()=>{
        let ignore = false;
        
        const fetchUserTasks = async()=>{
            try {
                const res = await get(`${userid}`);
                
                if(!ignore){
                    setUserTasks(res.data.tasks);
                }
            }catch(e){
                handleTokenExpiration(setToken);
                fetchUserTasks();
            }
        }
        
        fetchUserTasks();

        return ()=>{
            ignore = true
        };
    }, [userid]);

    return <List component="div" disablePadding>
    {userTasks.map(task => {
        return <ListItemButton key={task.name} sx={{ pl: 4 }}>
            <ListItemIcon>
                {task.status === "done" ? <CheckIcon color="success" /> : <CloseIcon color="warning" />}
            </ListItemIcon>
            <ListItemText primary={task.name} />
        </ListItemButton>
    })}
</List>
}