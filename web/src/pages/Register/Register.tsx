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

export async function attemptRegister(email: string, password: string, password2: string, first_name: string, last_name: string) {
    const { data } = await api.post("/auth/register/", {
        email,
        password,
        password2,
        first_name,
        last_name,
    });
    return data;
}

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setPasswordErrors([]);
        setLoading(true);

        try {
            await attemptRegister(email, password, password2, firstName, lastName);
            setSuccess("Registration Successful!");
            navigate("/login");

        } catch (err: any) {
            const data = err?.response?.data;
            setPasswordErrors(data?.password ?? []);
            const messages = [];

            if (data?.email) {
                messages.push(Array.isArray(data.email) ? data.email.join(" ") : data.email);
            }
            if (data?.password) messages.push("Invalid password");

            setError(messages.join(" and ") || "Register failed");
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
            <Typography variant="h4" sx={{ mb: 3 }}>Register</Typography>

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

                    {passwordErrors.length > 0 && (
                        <Box component="ul" sx={{ mt: 0, mb: 0, pl: 3 }}>
                            {passwordErrors.map((message, index) => (
                                <li key={index}>{message}</li>
                            ))}
                        </Box>
                    )}

                    <TextField
                        label="confirmPassword"
                        type="password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                        fullWidth
                    />

                    <TextField
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        fullWidth
                    />

                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </Button>

                    <MuiLink component={RouterLink} to="/login" underline="hover" sx={{ textAlign: "center", display: "block", mt: 1 }} >
                        Login Here
                    </MuiLink>
                </Stack>
            </form>
        </Box>
    )
}