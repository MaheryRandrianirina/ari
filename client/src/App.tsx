import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import './App.css'
import { Dashboard } from './components/Dashboard';
import {SignIn} from './components/SignIn/SignIn';
import { Register } from './components/Register/Register';

export type Page = "home"|"signin"|"register";

function App() {
  const [activePage, setActivePage]: [Page, Dispatch<SetStateAction<Page>>] = useState("home" as Page);
  const [token]:[string|null, Dispatch<SetStateAction<string|null>>] = useState(localStorage.getItem("bearer-token"));
  const [isLoggedIn]:
    [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);

  useEffect(()=>{
    if(token){
      fetch("localhost:3000/user", {
        headers: {
          authorization:  token
        }
      }).then(res => {
        console.log("log in")
      })
    }
    
  }, []);

  return (
    <>
      {isLoggedIn ? <Dashboard/> : (activePage === "home" || activePage === "signin" ? <SignIn setNewActivePage={setActivePage}/> : <Register setNewActivePage={setActivePage}/>)}
    </>
  )
}

export default App
