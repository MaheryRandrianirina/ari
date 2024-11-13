import { Button, ButtonTypeMap, Checkbox, Color, ExtendButtonBase, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import Grid from '@mui/system/Grid';
import Box from '@mui/system/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import { MouseEventHandler, useEffect, useState } from "react";
import { User } from "../../App";
import axios, { AxiosError, AxiosResponse } from "axios";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useExpand } from "../../hooks/useExpand";

export function AdminDashboardContent (){
    const [users, setUsers] = useState<{
        to_check: User[],
        checked: User[]
    }>({
        to_check: [],
        checked: []
    });

    useEffect(()=>{
        const fetchUsers = async()=>{
            try {
                const response: AxiosResponse<{
                    users: User[]
                }> = await axios.get("http://localhost:3000/users", {
                    withCredentials: true,
                    headers: {
                        authorization: localStorage.getItem("bearer-token")
                    }
                });
                
                const {users} = response.data;
                let checkedUsers: User[] = [];
                let toCheckUsers: User[] = [];
                users.forEach(user => {
                    if(user.role === undefined){
                        toCheckUsers.push(user);
                    }else  if(user.role === "user"){
                        checkedUsers.push(user);
                    }
                    
                });
                
                setUsers({to_check: toCheckUsers, checked: checkedUsers});
            }catch(e: unknown){
                const error = e as AxiosError
                if(error.status === 500){
                    console.log("handle connexion expired error");
                }else {
                    console.error("error while fetching users : ", e);
                }
                
            }
        }

        fetchUsers();
    }, []);

    const boxBg: string = "#E3EFEF";

    return <>
        <Typography variant="h5" gutterBottom align="left" sx={{mt: 3}}>Users</Typography>
        <Grid container spacing={4}>
            <Grid size={3}>
                <NotCheckedUsers bg={boxBg} users={users.to_check}/>
            </Grid>
            <Grid size={3}>
                <CheckedUsers bg={boxBg} users={users.checked}/>
                </Grid> 
        </Grid>
    </>
}

function NotCheckedUsers({bg, users}: {readonly bg: string, readonly users: User[]}){
    const [checked, setChecked] = useState(null);
    const [handleExpand, handleExpandLess, usersTodisplay, expandNumber] = useExpand(10, users);

    const handleToggle = (value: string) => () => {
        // send request to check the user
    };

    console.log(expandNumber, users.length)
    return <Box component="section" sx={{ p: 2, borderRadius:1, bgcolor: bg }}>
        <Typography variant="h6" gutterBottom align="left">To check</Typography>
        <List sx={{ width: '100%', maxWidth: 360 }}>
            {usersTodisplay.map((value, idx) => {
            const labelId = `checkbox-list-label-${idx}`;

            return (
                <ListItem
                key={value.username}
                secondaryAction={
                    <IconButton edge="end" aria-label="comments">
                    <DeleteIcon />
                    </IconButton>
                }
                disablePadding
                >
                <ListItemButton role={undefined} onClick={handleToggle(value.username)} dense>
                    <ListItemIcon>
                    <Checkbox
                        edge="start"
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                    />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${value.username}`} />
                </ListItemButton>
                </ListItem>
            );
            })}
        </List>
        {expandNumber > 10 && <Button onClick={handleExpandLess}><ExpandLessIcon sx={{":hover": {fill: "gray"}}}/></Button>}
        {expandNumber < users.length && <Button onClick={handleExpand}><ExpandMoreIcon sx={{":hover": {fill: "gray"}}}/></Button>}
  </Box>
}

function CheckedUsers({bg, users}: {readonly bg: string, readonly users: User[]}){
    const [expandNumber, setExpandNumber] = useState<number>(10);

    return <Box component="section" sx={{ p: 2, borderRadius:1, bgcolor: bg }}>
    <Typography variant="h6" gutterBottom align="left" color="success">Checked</Typography>
  </Box>
}
