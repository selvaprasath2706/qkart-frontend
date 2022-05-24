import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const[isLoading,setisLoading]=useState(true)
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [formData,setFormdata]=useState({
    username:"",
    password:""
  })
  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    
   if(validateInput(formData)){
    try{
     
      await axios.post(`${config.endpoint}/auth/login`,{email:formData.username,password:formData.password}).then((res)=>{
      console.log(res)
        persistLogin(res.data.tokens.access.token,res.data.user.name,res.data.user.walletMoney,res.data.user._id)
         // setIsloading(true)
      history.push("/", { from: "Login" })
      enqueueSnackbar('Logged in successfully', {
           variant: "success"
         }); 
      })
     
    }catch(error){
      setisLoading(true)
        if (error.response) {
          console.log(error.response)
         enqueueSnackbar(error.response.data.message, {
                  variant: "error"
                }); 
        } else if (error.request) {
          enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {
                    variant: "error"
                  }); 
        } else {
          enqueueSnackbar("error", {
                    variant: "error"
                  }); 
              
                }
                // setIsloading(true)
      }
   }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    if(data.username){
      if(data.password){
        return true
      }
      else{
        enqueueSnackbar("Password is a required field",{variant:"error"})
      }
    }
    else{
      enqueueSnackbar("Username is a required field",{variant:"error"})
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance,userId) => {
    localStorage.setItem("token",token);
    localStorage.setItem("username",username);
    localStorage.setItem("balance",balance);
    localStorage.setItem("userId",userId
    );
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField fullWidth id="username" name="Username" label="Username" variant="outlined"
           onChange={(e)=>{
            setFormdata({...formData,username:e.target.value})
          }}
          />
          <TextField fullWidth type="password" id="password" name="Password" label="Password" variant="outlined"
           onChange={(e)=>{
            setFormdata({...formData,password:e.target.value})
          }}/>

          <Button className="button" variant="contained" color="success" onClick={(e)=>{
            e.preventDefault();
            setisLoading(false)
            login(formData)
          }}>
              {isLoading && "LOGIN TO QKART"}
           {!isLoading && <CircularProgress/>}
          
            </Button>
          <p className="secondary-action">
            Dont't have an account?{" "}
            
            <Link to="/register">
              Register now
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
