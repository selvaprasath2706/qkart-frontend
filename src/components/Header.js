import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import "./Products.css";
import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  if(hasHiddenAuthButtons){
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={()=>{
              history.push("/",{from:"Header"})
            // history.goBack();
          }}
        >
          Back to explore
        </Button>
      </Box>
    );

  }
  else{
    if(localStorage.getItem("username")){
      return (
        <Box className="header">
          <Box className="header-title">
              <img src="logo_light.svg" alt="QKart-icon"></img>
          </Box>
          <Stack  >
          {children}
        
          </Stack>
          {/* <TextField  sx={{ ml: 1, flex: 1 }} className="search-desktop"   size="small" placeholder="Search "  variant="outlined" ><SearchIcon/></TextField> */}
         
         <Stack direction="row" spacing={2}>
         
         <Avatar  src="/public/avatar.png" alt={localStorage.getItem("username")}/>
         <Button className="explore-button" variant="text"  onClick={(e)=>{
                    e.preventDefault();
               
                  }}>{localStorage.getItem("username")} </Button>
        <Button variant="contained" color="success" onClick={(e)=>{
                    e.preventDefault();
                    localStorage.removeItem("username")
                    localStorage.removeItem("token")
                    localStorage.removeItem("balance")
                    window.location.reload()
                  }}>Logout
                  </Button>
          </Stack>
      </Box>
      )
    }
    else{
      return (
        <Box className="header">
          <Box className="header-title">
              <img src="logo_light.svg" alt="QKart-icon"></img>
          </Box>
         
          {children}
          <Stack direction="row" spacing={2}>
        
         <Button className="explore-button" variant="text" color="success" onClick={(e)=>{
                    e.preventDefault();
                    history.push("/login",{from:"Header"})
                  }}>LOGIN </Button>
         <Button  variant="contained" color="success" onClick={(e)=>{
                    e.preventDefault();
                    history.push("/register",{from:"Header"})
                  }}>Register
                  </Button>
          </Stack>
        </Box>
      )
    }
   }
};

export default Header;
