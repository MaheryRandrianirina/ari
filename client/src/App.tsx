import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import './App.css'
import { Dashboard } from './components/Dashboard';
import {SignIn} from './components/SignIn/SignIn';
import { Register } from './components/Register/Register';
import axios from 'axios';
import { handleTokenExpiration } from './utils/handleTokenExpiration';
import { get } from './common/utils/api';
import { TokenContext } from './common/contexts/TokenContext';

export type Task = {
  _id: string,
  name: string,
  status: "done"|"in progress"|"not done",
  user_id: string|null
}

export type User = {
  username: string,
  role: string,
  _id: string
}

export type Page = "home"|"signin"|"register";

function App() {
  const [activePage, setActivePage]: [Page, Dispatch<SetStateAction<Page>>] = useState("home" as Page);
  const [token, setToken]:[string|null, Dispatch<SetStateAction<string|null>>] = useState(localStorage.getItem("bearer-token"));
  
  const [user, setUser]: [User|null, Dispatch<SetStateAction<User|null>>] = useState(null as User|null)
  const isLoggedIn = token !== null;

  const Logout = useCallback(()=>{
    localStorage.removeItem("bearer-token");
    setToken(null);
  }, [])
  
  useEffect(()=>{
    
    const fetchUser = ()=>{
      if(token && !user){
        get("auth/user").then(res => {
          setUser(res.data)
        }).catch(err => {
          handleTokenExpiration(setToken);
        });
      }
    }

    fetchUser();
    
    setActivePage(page => {
      if(isLoggedIn) return "home";
      else if(!isLoggedIn && activePage !== "register") return "signin";
      else if(!isLoggedIn && activePage !== "signin") return "register";
    });

  }, [activePage, token])
  
  return (
    <TokenContext.Provider value={setToken}>
      {activePage === "home" && <Dashboard Logout={Logout} user={user}/>}
      {activePage === "signin" && <SignIn setNewActivePage={setActivePage}/>} 
      {activePage === "register" && <Register setNewActivePage={setActivePage}/>}
    </TokenContext.Provider>
  )
}

export default App
