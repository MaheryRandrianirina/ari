import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useContext, useEffect, useState } from "react";
import { Task } from "../../App";
import { handleTokenExpiration } from "../../utils/handleTokenExpiration";
import { get } from "../../common/utils/api";
import { TokenContext } from "../../common/contexts/TokenContext";
import { AxiosError } from "axios";

export const UserTasks = ({userid}: {
    userid:string
})=>{
    const [userTasks, setUserTasks] = useState<Task[]>([]);
    
    const {setToken,token} = useContext(TokenContext);

    useEffect(()=>{
        let ignore = false;
        
        const fetchUserTasks = async()=>{
            try {
                const res = await get(`tasks/user/${userid}`, token);
                
                if(!ignore){
                    setUserTasks(res.data.tasks);
                }
            }catch(e){
                const err = e as AxiosError<{message:string}>;
                if(err.status === 401 && err.response?.data.message.toLowerCase() === "token has expired") handleTokenExpiration(setToken);
                
                fetchUserTasks();
            }
        }
        
        fetchUserTasks();

        return ()=>{
            ignore = true
        };
    }, []);

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