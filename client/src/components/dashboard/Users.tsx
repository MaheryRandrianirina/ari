import Grid from '@mui/system/Grid';
import { Button, Checkbox, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import Box from '@mui/system/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dispatch, SetStateAction, useState } from "react";
import { User } from "../../App";
import axios, { AxiosError } from "axios";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useExpand } from "../../hooks/useExpand";
import { handleTokenExpiration } from "../../utils/handleTokenExpiration";
import Collapse from '@mui/material/Collapse';
import { KeyboardArrowDown } from "@mui/icons-material";
import { UsersWithStatus } from './AdminDashboardContent';
import { UserTasks } from './UserTasks';
import { Delete, put } from '../../common/utils/api';

export function Users({users, token, setUsers}:{
    readonly users: UsersWithStatus,
    readonly token:{set:Dispatch<SetStateAction<string|null>>, value:string|null},
    readonly setUsers: Dispatch<SetStateAction<UsersWithStatus>>
}){

    return <>
        <Typography variant="h5" gutterBottom align="left" sx={{mt: 3}}>Users</Typography>
        <Grid container spacing={4}>
            <Grid size={3}>
                <NotCheckedUsers token={token} users={users.to_check} setUsers={setUsers}/>
            </Grid>
            <Grid size={3}>
                <CheckedUsers users={users.checked} token={token}/>
            </Grid> 
        </Grid>
    </>
}

function NotCheckedUsers({
    users, setUsers, token
}: Readonly<{
    readonly users: User[], 
    setUsers: Dispatch<SetStateAction<{
        to_check: User[],
        checked: User[]
}>>, token: {set:Dispatch<SetStateAction<string|null>>, value:string|null}}>){
    const [handleExpand, handleExpandLess, usersTodisplay, expandNumber] = useExpand(10, users);

    const handleCheckUser = async(value: string) => {
        try {
            await put(`${value}/check`, {username: value});
            
            // add current checked user in the list of checked users
            setUsers(users => {
                const checked_users = users.checked;
                const new_checked_user = users.to_check.filter(user => user.username === value)[0];
                return {
                    to_check: users.to_check.filter(user => user.username !== value),
                    checked: [...checked_users, new_checked_user]
                }
            });
        }catch(e){
            const err = e as AxiosError<{error:string,message:string,statusCode: number}>;
            // handle token expiration
            if(err.response?.data.statusCode === 401) {
                handleTokenExpiration(token.set)
                handleCheckUser(value);
            }else {
                console.error(err)
            }
        }
    };

    const handleDeleteUser = async(value: string)=>{
        try {
            await Delete(`${value}/delete`);

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
                handleTokenExpiration(token.set);
                handleDeleteUser(value);
            }else {
                console.error(err)
            }
        }
    }

    return <Box component="section" sx={{ p: 2, borderRadius:1, boxShadow: "0 0 10px #ccc", mb: 1 }}>
        <Typography variant="h6" gutterBottom align="left">To check</Typography>
        <List sx={{ width: '100%', maxWidth: 360 }}>
            {usersTodisplay.map((value, idx) => {
            const labelId = `checkbox-list-label-${idx}`;

            return (
                <ListItem
                    key={value.username}
                    secondaryAction={
                        <IconButton edge="end" aria-label="comments" onClick={()=> handleDeleteUser(value.username)}>
                        <DeleteIcon  color='error'/>
                        </IconButton>
                    }
                    disablePadding
                >
                <ListItemButton role={undefined} dense>
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                            onClick={()=> handleCheckUser(value.username)}
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

function CheckedUsers({users, token}: { 
    readonly users: User[], 
    readonly token:{set:Dispatch<SetStateAction<string|null>>, value:string|null}
}){
    const [handleExpand, handleExpandLess, usersTodisplay, expandNumber] = useExpand(10, users);
    const [usersWithExpandedTasks, setUsersWithExpandedTasks] = useState<string[]>([]);

    const handleExpandUserTasks = (value: string) => () => {
        setUsersWithExpandedTasks(users => users.includes(value) 
            ? users.filter(user => user !== value) 
            : [...users, value]);
    };
    
    return <Box component="section" sx={{ p: 2, borderRadius:1, boxShadow: "0 0 10px #ccc", mb: 1 }}>
    <Typography variant="h6" gutterBottom align="left" color="success">Checked</Typography>
    <List sx={{ width: '100%', maxWidth: 360 }}>
            {usersTodisplay.map((value, idx) => {
            const labelId = `checkbox-list-label-${idx}`;

            return (
                <div key={value.username}>
                    <ListItem
                        disablePadding
                        secondaryAction={
                            <IconButton edge="end" aria-label="comments" sx={{":hover": {bgcolor: "transparent"}}}>
                            {usersWithExpandedTasks.includes(value.username) ? <KeyboardArrowDown/> : <KeyboardArrowRightIcon />}
                            </IconButton>
                        }
                        >
                            <ListItemButton role={undefined} onClick={handleExpandUserTasks(value.username)} dense>
                                <ListItemText id={labelId} primary={`${value.username}`} />
                            </ListItemButton>
                    </ListItem>
                    <Collapse in={usersWithExpandedTasks.includes(value.username)} timeout="auto" unmountOnExit>
                        <UserTasks token={token.value} setToken={token.set} userid={users.filter(user => user._id === value._id)[0]._id} />
                    </Collapse>
                </div>
            );
            })}
    </List>
        {expandNumber > 10 && <Button onClick={handleExpandLess}><ExpandLessIcon sx={{":hover": {fill: "gray"}}}/></Button>}
        {expandNumber < users.length && <Button onClick={handleExpand}><ExpandMoreIcon sx={{":hover": {fill: "gray"}}}/></Button>}
  </Box>
}