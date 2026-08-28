import { Box, Stack, TextField, Typography, Button, Alert } from "@mui/material";
import api, { setAccessToken } from "../../lib/apiClient";
import { useState } from "react";

export async function attemptLogin(username: string, password: string) {
    const { data } = await api.post("/auth/login/", {
        username,
        password,
    });
    setAccessToken(data.access);
    return data;
}

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const user = await attemptLogin(email, password);
            setSuccess(`Welcome ${user?.email ?? "back"}!`);

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
            <Typography variant="h4" sx={{ mb: 3}}>Login</Typography>

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
                </Stack>
            </form>
        </Box>
    )
}