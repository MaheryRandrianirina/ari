import { useContext, useEffect, useState } from "react";
import { User } from "../../App";
import { AxiosError, AxiosResponse } from "axios";
import { handleTokenExpiration } from "../../utils/handleTokenExpiration";
import { Users } from "./Users";
import { Tasks } from "./Tasks";
import { get } from "../../common/utils/api";
import { TokenContext } from "../../common/contexts/TokenContext";

export type UsersWithStatus = {
    to_check: User[],
    checked: User[]
}

export function AdminDashboardContent (){
    const [users, setUsers] = useState<UsersWithStatus>({
        to_check: [],
        checked: []
    });

    const {setToken, token} = useContext(TokenContext);

    useEffect(()=>{
        const fetchUsers = async()=>{
            try {
                const response: AxiosResponse<{
                    users: User[]
                }> = await get("users", token);
                
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
                const error = e as AxiosError<{message:string}>
                if(error.status === 500){
                    console.log("handle connexion expired error");
                }else if(error.status === 401 && error.response?.data.message.toLowerCase() === "token has expired") {
                    handleTokenExpiration(setToken);
                    fetchUsers();
                }else {
                    console.error("error while fetching users : ", e);
                }
                
            }
        }

        fetchUsers();
    }, []);
    
    return <>
        <Users users={users} setUsers={setUsers}/>
        <Tasks users={users.checked}/>
    </>
}


