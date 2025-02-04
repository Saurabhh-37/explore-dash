import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Explore Dashboard
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Leaderboard
        </Button>
        <Button color="inherit" component={Link} to="/influencer">
          Details
        </Button>
        <Button color="inherit" component={Link} to="/research">
          Research Config
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
