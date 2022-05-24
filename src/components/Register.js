import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { Link, useHistory} from "react-router-dom";



const Register = () => {
  const history = useHistory();
  const [form,setForm]=useState({
    email:"",
    username:"",
    password:"",
    confirmPassword:""
  })  
  const [isloading,setIsloading]=useState(true)
  
  
  const { enqueueSnackbar} = useSnackbar();


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  // eslint-disable-next-line 
  const register = async (formData) => {
    setIsloading(!isloading)
    const val=validateInput(formData)
    if(val){
      // "http://3.108.74.105:8082/api/v1/auth/register"
      try{
     
        console.log({name:formData.username,email:formData.email,password:formData.password})
        await axios.post(`${config.endpoint}/auth/register`,{name:formData.username,email:formData.email,password:formData.password}).then((res)=>{
          setIsloading(true)
          enqueueSnackbar('Registered successfully', {
               variant: "success"
             }); 
             history.push("/login", { from: "Register" })
            
        })
       }catch(error){
          if (error.response) {
            console.log(error.response)
           enqueueSnackbar("Username is already taken", {
                    variant: "error"
                  }); 
          } else if (error.request) {
            enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {
                      variant: "error"
                    }); 
          } else {
            console.log('Error', error.message);
            enqueueSnackbar("error", {
                      variant: "error"
                    }); 
                    console.log("else")
                  }
                  setIsloading(true)
        }
 }
      else{
        setIsloading(true)
      }
     
    
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  
  const validateInput = (data) => {
    if(data.username ){
      if(data.username.length>6){
        if(data.password){
          if(data.password.length>6){
            if(data.password===data.confirmPassword){
              return true
            }else{
              enqueueSnackbar('Passwords do not match', {
                variant: "warning"
              });
            }
          }else{
            enqueueSnackbar('Password must be at least 6 characters', {
              variant: "warning"
            });
  
          }
        }else{
          enqueueSnackbar('Password is a required field', {
            variant: "warning"
          });
        }
      }else{
        enqueueSnackbar('Username must be at least 6 characters', {
          variant: "warning"
        });
      }
    }else{
      enqueueSnackbar('Username is a required field', {
        variant: "warning"
      });
    }
   
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            // // value={form.username}
            onChange={(event)=>{
              setForm({...form,username:event.target.value})
            }}
          />

            <TextField
            id="email"
            label="Email"
            variant="outlined"
            title="Email"
            name="email"
            placeholder="Enter Email address"
            fullWidth
            // // value={form.username}
            onChange={(event)=>{
              setForm({...form,email:event.target.value})
            }}
          />


          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={form.password}
            onChange={(event)=>{
              setForm({...form,password:event.target.value})
            }}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={form.confirmPassword}
            onChange={(event)=>{
              setForm({...form,confirmPassword:event.target.value})
            }}
          />
          <Button className="button" variant="contained" onClick={()=>{register(form)
          }}>
           {isloading && "Register Now"}
           {!isloading && <CircularProgress/>}
           </Button>
           
           
          <p className="secondary-action">
            Already have an account?{" "}
            
            <Link to="/login">
              Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
