import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    Box,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../features/auth/authContext";

export function NavbarAccountDropDown() {
    const { user, logout } = useAuth();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
    };

    return (
        <Box>
            <IconButton onClick={handleOpen} size="small" sx={{ ml: 2 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "background.default", color: "white" }}>
                    {user?.email[0].toUpperCase()}
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                slotProps={{
                    paper: {
                        elevation: 3,
                        sx: { mt: 1.5, minWidth: 160 }
                    }
                }}
            >
                <MenuItem component={RouterLink} to="/account">
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Account
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    );
}