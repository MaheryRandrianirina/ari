import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { Dashboard } from './components/Dashboard';
import {SignIn} from './components/SignIn/SignIn';
import { Register } from './components/Register/Register';
import { handleTokenExpiration } from './utils/handleTokenExpiration';
import { get } from './common/utils/api';
import { TokenContext } from './common/contexts/TokenContext';
import { SnackbarContext } from './components/dashboard/contexts/SnackbarContext';
import { IconButton, Snackbar, SnackbarCloseReason } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AxiosError } from 'axios';
import { ConnectedUserContext } from './common/contexts/ConnectedUserContext';

export type Task = {
  _id: string,
  name: string,
  status: "done"|"in progress"|"not done",
  user_id: string|null,
  progress: number
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
  
  const [snackbarMessage, setSnackbarMessage] = useState<string|null>(null);

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarMessage(null);
  };

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleCloseSnackbar}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  useEffect(()=>{
    const fetchUser = ()=>{
      if(token && !user){
        get("auth/user", token).then(res => {
          setUser(res.data)
        }).catch(err => {
          const error = err as AxiosError<{message:string}>;
          if(error.status === 401 && error.response?.data.message.toLowerCase() === "token has expired") handleTokenExpiration(setToken);
         
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
    <TokenContext.Provider value={useMemo(()=>({setToken: setToken, token: token}), [token])}>
      <ConnectedUserContext.Provider value={user}>
        <SnackbarContext.Provider value={setSnackbarMessage}>
          {activePage === "home" && <Dashboard Logout={Logout} user={user}/>}
          {activePage === "signin" && <SignIn setNewActivePage={setActivePage}/>} 
          {activePage === "register" && <Register setNewActivePage={setActivePage}/>}
        </SnackbarContext.Provider>
      </ConnectedUserContext.Provider>
      
      <Snackbar
            open={snackbarMessage!==null}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={snackbarMessage}
            action={action}
        />
    </TokenContext.Provider>
  )
}

export default App
