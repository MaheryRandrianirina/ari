import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import './App.css'
import { Dashboard } from './components/Dashboard';
import {SignIn} from './components/SignIn/SignIn';
import { Register } from './components/Register/Register';
import axios from 'axios';

export type User = {
  username: string
}

export type Page = "home"|"signin"|"register";

function App() {
  const [activePage, setActivePage]: [Page, Dispatch<SetStateAction<Page>>] = useState("home" as Page);
  const [token, setToken]:[string|null, Dispatch<SetStateAction<string|null>>] = useState(localStorage.getItem("bearer-token"));
  
  const [user, setUser]: [User|null, Dispatch<SetStateAction<User|null>>] = useState(null as User|null)
  const isLoggedIn = user !== null;

  const fetchUser = ()=>{
    if(token){
      axios.get("http://localhost:3000/user", {
        headers: {
          authorization:  token
        },
        withCredentials:true
      }).then(res => {
        setUser(res.data.user)
      }).catch(err => {
        axios.get("http://localhost:3000/user/token",{withCredentials: true}).then(res => {
          localStorage.setItem("bearer-token", res.data.bearer_token);
          
          setToken(res.data.bearer_token);
        });
      });
    }
  }

  const fetchLoggedInUser = useCallback(fetchUser, [token])
  fetchLoggedInUser();
  
  return (
    <>
      {isLoggedIn ? <Dashboard/> : (
        activePage === "home" || activePage === "signin" ? 
        <SignIn setNewActivePage={setActivePage}/> : <Register setNewActivePage={setActivePage}/>
        )
      }
    </>
  )
}

export default App
