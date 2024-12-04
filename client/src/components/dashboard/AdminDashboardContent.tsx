import { Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { User } from "../../App";
import axios, { AxiosError, AxiosResponse } from "axios";
import { handleTokenExpiration } from "../../utils/handleTokenExpiration";
import { Users } from "./Users";
import { Tasks } from "./Tasks";
import { get } from "../../common/utils/api";

export type UsersWithStatus = {
    to_check: User[],
    checked: User[]
}

export function AdminDashboardContent ({token}: {readonly token: {set:Dispatch<SetStateAction<string|null>>, value:string|null}}){
    const [users, setUsers] = useState<UsersWithStatus>({
        to_check: [],
        checked: []
    });
    
    useEffect(()=>{
        const fetchUsers = async()=>{
            try {
                const response: AxiosResponse<{
                    users: User[]
                }> = await get("users");
                
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
                }else if(error.status === 401) {
                    handleTokenExpiration(token.set);
                    fetchUsers();
                }else {
                    console.error("error while fetching users : ", e);
                }
                
            }
        }

        fetchUsers();
    }, []);
    
    return <>
        <Users users={users} setUsers={setUsers} token={token}/>
        <Tasks token={token.value} setToken={token.set} users={users.to_check}/>
    </>
}


