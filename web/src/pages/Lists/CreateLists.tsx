import { type FormEvent, useState } from "react";
import {
    Alert,
    Box,
    Button,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import api from "../../lib/apiClient";

type ListType = "watch_next" | "favorites" | "watching" | "";

type ShowList = {
    id: number;
    name: string;
    list_type: ListType | null;
    created_at: string;
};

type Props = {
    onCreated?: (list: ShowList) => void;
};

export default function CreateListForm({ onCreated }: Props) {
    const [name, setName] = useState("");
    const [listType, setListType] = useState<ListType>("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        const trimmedName = name.trim();
        if (!trimmedName) {
            setError("List name is required.");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                name: trimmedName,
                list_type: listType || null,
            };

            const { data } = await api.post<ShowList>("/lists/", payload);
            setSuccessMsg("List created.");
            setName("");
            setListType("");
            onCreated?.(data);
        } catch (err: any) {
            const detail =
                err?.response?.data?.detail ||
                err?.response?.data?.list_type?.[0] ||
                err?.response?.data?.name?.[0] ||
                "Failed to create list.";
            setError(String(detail));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}
        >
            <Typography variant="h6" sx={{ mb: 2 }}>
                Create a new list
            </Typography>

            <Stack spacing={2}>
                {error && <Alert severity="error">{error}</Alert>}
                {successMsg && <Alert severity="success">{successMsg}</Alert>}

                <TextField
                    label="List name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    size="small"
                    required
                />

                <TextField
                    select
                    label="List type (optional)"
                    value={listType}
                    onChange={(e) => setListType(e.target.value as ListType)}
                    size="small"
                    helperText="Leave empty for a custom list."
                >
                    <MenuItem value="">Custom</MenuItem>
                    <MenuItem value="watch_next">Watch Next</MenuItem>
                    <MenuItem value="favorites">All-Time Favourites</MenuItem>
                    <MenuItem value="watching">Currently Watching</MenuItem>
                </TextField>

                <Button type="submit" variant="contained" disabled={submitting}>
                    {submitting ? "Creating..." : "Create list"}
                </Button>
            </Stack>
        </Box>
    );
}