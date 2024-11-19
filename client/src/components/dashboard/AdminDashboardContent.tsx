import { Button, Checkbox, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import Grid from '@mui/system/Grid';
import Box from '@mui/system/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { User } from "../../App";
import axios, { AxiosError, AxiosResponse } from "axios";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useExpand } from "../../hooks/useExpand";
import { handleTokenExpiration } from "../../utils/handleTokenExpiration";

export function AdminDashboardContent ({token}: {token: {set:Dispatch<SetStateAction<string|null>>, value:string|null}}){
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
                    if(user.role === ""){
                        toCheckUsers.push(user);
                    }else if(user.role === "user"){
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
                <NotCheckedUsers token={token} bg={boxBg} users={users.to_check} setUsers={setUsers}/>
            </Grid>
            <Grid size={3}>
                <CheckedUsers bg={boxBg} users={users.checked}/>
                </Grid> 
        </Grid>
    </>
}

function NotCheckedUsers({
    bg, users, setUsers, token
}: Readonly<{
    readonly bg: string, 
    readonly users: User[], 
    setUsers: Dispatch<SetStateAction<{
        to_check: User[],
        checked: User[]
}>>, token: {set:Dispatch<SetStateAction<string|null>>, value:string|null}}>){
    const [handleExpand, handleExpandLess, usersTodisplay, expandNumber] = useExpand(10, users);

    const handleCheckUser = async(value: string) => {
        try {
            await axios.put(`http://localhost:3000/user/${value}/check`, {username: value}, {
                withCredentials: true,
                headers: {
                    authorization: localStorage.getItem("bearer-token")
                }
            });
            
            // add current checked user in the list of checked users
            setUsers(users => {
                const checked_users = users.checked;
                const new_checked_user = users.to_check.filter(user => user.username === value)[0];
                return {
                    to_check: users.to_check.filter(user => user.username !== value),
                    checked: [...checked_users, new_checked_user]
                }
            })
        }catch(e){
            const err = e as AxiosError<{error:string,message:string,statusCode: number}>;
            // handle token expiration
            if(err.response?.data.statusCode === 401) {
                handleTokenExpiration(token.set, token.value)
                handleCheckUser(value);
            }else {
                console.error(err)
            }
        }
    };

    const handleDeleteUser = async(value: string)=>{
        try {
            await axios.delete(`http://localhost:3000/user/${value}/delete`, {
                withCredentials: true,
                headers: {
                    authorization: localStorage.getItem("bearer-token")
                }
            });

            setUsers((users:{
                to_check: User[],
                checked: User[]
        }) => {
                return {
                    to_check: users.to_check.filter(user => user.username !== value),
                    checked: users.checked.filter(user => user.username !== value)
                }
            });
        }catch(e){
            const err = e as AxiosError<{error:string,message:string,statusCode: number}>;
            if(err.response?.data.statusCode === 401) {
                handleTokenExpiration(token.set, token.value);
                handleDeleteUser(value);
            }else {
                console.error(err)
            }
        }
    }

    return <Box component="section" sx={{ p: 2, borderRadius:1, bgcolor: bg }}>
        <Typography variant="h6" gutterBottom align="left">To check</Typography>
        <List sx={{ width: '100%', maxWidth: 360 }}>
            {usersTodisplay.map((value, idx) => {
            const labelId = `checkbox-list-label-${idx}`;

            return (
                <ListItem
                key={value.username}
                secondaryAction={
                    <IconButton edge="end" aria-label="comments" onClick={()=> handleDeleteUser(value.username)}>
                    <DeleteIcon />
                    </IconButton>
                }
                disablePadding
                >
                <ListItemButton role={undefined} onClick={()=> handleCheckUser(value.username)} dense>
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
    const [handleExpand, handleExpandLess, usersTodisplay, expandNumber] = useExpand(10, users);

    const handleCheckUser = (value: string) => () => {
        // send request to check the user
    };

    return <Box component="section" sx={{ p: 2, borderRadius:1, bgcolor: bg }}>
    <Typography variant="h6" gutterBottom align="left" color="success">Checked</Typography>
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
                <ListItemButton role={undefined} onClick={handleCheckUser(value.username)} dense>
                    
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
