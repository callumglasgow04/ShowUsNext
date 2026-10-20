import {
    Alert,
    Box,
    Button,
    Link as MuiLink,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../lib/apiClient";
import { fetchMe } from "../../features/auth/authApi";
import { useAuth } from "../../features/auth/authContext";

export async function attemptLogin(username: string, password: string) {
    const { data } = await api.post("/auth/login/", {
        username,
        password,
    });
    return data;
}

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const { setUser } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const user = await attemptLogin(email, password);
            setSuccess(`Welcome ${user?.email ?? "back"}!`);
            localStorage.setItem("access_token", user.access);
            if (user.refresh) localStorage.setItem("refresh_token", user.refresh);

            const me = await fetchMe();
            setUser(me);
            navigate("/");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box sx={{
            maxWidth: 420,
            mx: "auto",
            mt: 8,
        }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Login</Typography>

            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}

                    <TextField
                        label="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                    />

                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>

                    <MuiLink component={RouterLink} to="/register" underline="hover" sx={{ textAlign: "center", display: "block", mt: 1 }} >
                        Register Here
                    </MuiLink>
                </Stack>
            </form>
        </Box>
    )
}