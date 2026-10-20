import { AppBar, Button, Box, Toolbar, Typography, Stack } from "@mui/material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/authContext";
import { Login } from "@mui/icons-material";
import { NavbarAccountDropDown } from "./NavbarAccountDropDown";
import NavbarSearch from "./NavBarSearch";

export const Navbar = () => {
    const { user } = useAuth();
    return (
        <AppBar
            position="static"
            sx={{ backgroundColor: '#161B22' }}
        >
            <Toolbar sx={{ gap: 2 }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    TVQueue
                </Typography>

                <Box sx={{ display: "flex", gap: 8 }}>
                    <Button color="inherit" component={Link} to="/" >Home</Button>
                    <Button color="inherit">Discover</Button>
                    <NavbarSearch />
                    {user == null ? (
                        <Button color="inherit" component={Link} to="/login" ><Login /></Button>
                    ) : (
                        <Stack>
                            <NavbarAccountDropDown />
                        </Stack>
                    )}
                </Box>

            </Toolbar>
        </AppBar>
    );
}