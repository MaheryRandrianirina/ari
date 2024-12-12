import { ChangeEventHandler, Dispatch, FC, FormEvent, FormEventHandler, SetStateAction, useContext, useEffect, useState } from "react"
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import axios from "axios"
import { Page } from "../../App";
import { InfinitySpin } from "react-loader-spinner";
import { post } from "../../common/utils/api";
import { TokenContext } from "../../common/contexts/TokenContext";

export type Credentials = {
  username: string|null,
  password: string|null
}

export type FormValidation = {
  username: boolean,
  password: boolean
}

export const SignIn: FC<{
  setNewActivePage: Dispatch<SetStateAction<Page>>
}> = ({setNewActivePage})=>{

  const [credentials, setCredentials]: [credentials: Credentials, setCredentials:Dispatch<SetStateAction<Credentials>>] = useState({
    username: null,
    password: null
  } as Credentials);
  const [submit, setSubmit]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(true);
  const [showLoader, setShowLoader]:[boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
  
  const setToken = useContext(TokenContext);

  const formValidation: FormValidation = {
    username: credentials.username !== null && credentials.username.length >= 3, 
    password:credentials.password !== null && credentials.password.length >= 8
  };
  
  useEffect(()=>{
    document.title = "Login";
  }, [credentials]);

  

  const handleSubmit: FormEventHandler = (e: FormEvent) => {
    e.preventDefault();
    
    if(!formValidation.username || !formValidation.password){
      setSubmit(false);

      return;
    }
    
    post("login", credentials).then(res => {
      localStorage.setItem("bearer-token", res.data.bearer_token);
      setToken(res.data.bearer_token);
    }).catch(() => {
      setShowLoader(false);
    }); 
  }

  const handleChangeUsername: ChangeEventHandler<HTMLInputElement> = (e)=>{
    setCredentials(state => ({...state, username: e.target.value}));
  }

  const handleChangePassword: ChangeEventHandler<HTMLInputElement> = (e)=>{
    setCredentials(state => ({...state, password: e.target.value}));
  }

  return <div>
    <Container maxWidth="sm">
      <Box
      sx={{ mt:5, mx:"auto", width:"40ch" }}
      noValidate
      autoComplete="off">
        <form onSubmit={handleSubmit}>
          <Typography variant="h3" gutterBottom color="primary">
            Login to your account
          </Typography>
          <TextField
              error={!submit && formValidation.username !== true}
              id="outlined"
              label="Username"
              placeholder="your username"
              margin="normal"
              fullWidth
              helperText={!submit && !formValidation.username ? "Please, enter valid value" : undefined}
              onChange={handleChangeUsername}
          />
          <TextField
              error={!submit && formValidation.password !== true} 
              id="outlined"
              label="Password"
              placeholder="your password"
              type="password"
              margin="normal"
              fullWidth
              helperText={!submit && !formValidation.password ? "Please, enter valid value" : undefined}
              onChange={handleChangePassword}
          />
          <Button type="submit" variant="contained" fullWidth sx={{mt:2}}>Connect</Button>
        </form>
        <div>
          <Typography variant="subtitle1" gutterBottom color="dark" sx={{ mt: 4, display: "inline-block" }}>
            Don't have account ? 
          </Typography>
          <Typography onClick={()=> setNewActivePage("register")} variant="subtitle1" gutterBottom color="primary" sx={{ ml: 1, display: "inline-block", cursor: "pointer" }}>
            Register
          </Typography>
        </div>
      </Box>
    </Container>
    {showLoader && <InfinitySpin
      visible={true}
      width="200"
      color="#4fa94d"
      ariaLabel="infinity-spin-loading"
    />}
  </div>
}