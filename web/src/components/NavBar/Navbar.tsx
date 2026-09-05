import React from "react";
import { AppBar, Button, Box, Toolbar, Typography } from "@mui/material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/authContext";

export const Navbar = () => {
    const { logout } = useAuth();
    return (
        <AppBar
            position="static"
            sx={{ backgroundColor: '#161B22'}}
        >
            <Toolbar sx={{ gap: 2 }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    TVQueue
                </Typography>

                <Box sx={{ display: "flex", gap: 8 }}>
                    <Button color="inherit">Home</Button>
                    <Button color="inherit">Discover</Button>
                    <Button onClick={logout} color="inherit">Logout</Button>
                    <Button color="inherit" component={Link} to="/login" ><AccountBoxIcon /></Button>
                </Box>

            </Toolbar>
        </AppBar>
    );
}