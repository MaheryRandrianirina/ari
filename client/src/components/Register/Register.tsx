import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import { ChangeEventHandler, Dispatch, FC, FormEvent, FormEventHandler, SetStateAction, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { Credentials, FormValidation } from "../SignIn/SignIn";
import { Page } from "../../App";
import axios from "axios";

type Flash = {
  type: "error"|"success",
  message: string|null
};

export const Register: FC<{
  setNewActivePage: Dispatch<SetStateAction<Page>>,
  setToken:Dispatch<SetStateAction<string|null>>
}> = ({setNewActivePage, setToken})=>{
    const [credentials, setCredentials]: [
      credentials: Credentials & {password_confirmation: string|null}, 
      setCredentials:Dispatch<SetStateAction<Credentials & {password_confirmation: string|null}>>] = useState({
        username: null,
        password: null,
        password_confirmation: null
    } as Credentials & {password_confirmation: string|null});
    const [submit, setSubmit]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(true);
    const [showLoader, setShowLoader]:[boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
    const [flash, setFlash]: [
      Flash, Dispatch<SetStateAction<Flash>>] = useState({
        type: "success",
        message:null
    } as Flash);
    
    const formValidation: FormValidation & {password_confirmation: boolean} = {
        username: credentials.username !== null && credentials.username.length >= 3, 
        password:credentials.password !== null && credentials.password.length >= 8,
        password_confirmation: credentials.password_confirmation !== null && credentials.password_confirmation.length >= 8 && credentials.password === credentials.password_confirmation
    };

    const handleSubmit: FormEventHandler = (e: FormEvent) => {
      e.preventDefault();
      
      if(!formValidation.username || !formValidation.password || !formValidation.password_confirmation){
        setSubmit(false);
  
        return;
      }
  
      axios.post("http://localhost:3000/register", credentials, {
        onUploadProgress: (event) => {
            setShowLoader(true);
        },
        withCredentials: true
      }).then(res => {
        localStorage.setItem("bearer-token", res.data.bearer_token);
        setToken(res.data.bearer_token);
      }).catch(err => {
        setShowLoader(false);

        const data = JSON.parse(err.response.data.message);
        setFlash({type: "error", message: data.message});
      });    
      
    }

    const handleChangeUsername: ChangeEventHandler<HTMLInputElement> = (e)=>{
      setCredentials(state => ({...state, username: e.target.value}));
    }
  
    const handleChangePassword: ChangeEventHandler<HTMLInputElement> = (e)=>{
      setCredentials(state => ({...state, password: e.target.value}));
    }

    const handleChangePasswordConfirmation: ChangeEventHandler<HTMLInputElement> = (e)=>{
      setCredentials(state => ({...state, password_confirmation: e.target.value}));
    }

    return <div>
    <Container maxWidth="sm">
      <Box
      sx={{ mt:5, mx:"auto", width:"40ch" }}
      noValidate
      autoComplete="off">
        <form onSubmit={handleSubmit}>
          <Typography variant="h3" gutterBottom color="primary">
            Register for the access
          </Typography>

          {flash.message && <Alert severity={flash.type}>{flash.message}</Alert>}

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
          <TextField
              error={!submit && formValidation.password_confirmation !== true} 
              id="outlined"
              label="Password confirmation"
              placeholder="repeat your password"
              type="password"
              margin="normal"
              fullWidth
              helperText={!submit && !formValidation.password_confirmation ? "Please, enter valid value & same as password field" : undefined}
              onChange={handleChangePasswordConfirmation}
          />
          <Button type="submit" variant="contained" fullWidth sx={{mt:2}}>Register</Button>
        </form>
        <div>
          <Typography variant="subtitle1" gutterBottom color="dark" sx={{ mt: 4, display: "inline-block" }}>
            Already have an account ? 
          </Typography>
          <Typography onClick={()=> setNewActivePage("signin")} variant="subtitle1" gutterBottom color="primary" sx={{ ml: 1, display: "inline-block", cursor: "pointer" }}>
            Login
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