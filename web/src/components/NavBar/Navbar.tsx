import React from "react";
import { AppBar, Button, Box, Toolbar, Typography } from "@mui/material";

export const Navbar = () => {
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
                    <Button color="inherit">My List</Button>
                </Box>

            </Toolbar>
        </AppBar>
    );
}