import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Autocomplete,
    Avatar,
    Box,
    CircularProgress,
    TextField,
    Typography,
} from "@mui/material";
import api from "../../lib/apiClient";

type ShowResult = {
    tvmaze_id: number;
    name: string;
    year: string | null;
    image: string | null;
};

const MIN_CHARS = 2;
const DEBOUNCE_MS = 300;

const getLabel = (show: ShowResult) =>
    show.year ? `${show.name} (${show.year})` : show.name;

export default function NavbarSearch() {
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState<ShowResult[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const trimmed = inputValue.trim();
    const tooShort = trimmed.length < MIN_CHARS;

    useEffect(() => {
        if (tooShort) {
            setOptions([]);
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        setLoading(true);

        const timer = setTimeout(async () => {
            try {
                const { data } = await api.get<ShowResult[]>("/shows/search/", {
                    params: { query: trimmed },
                    signal: controller.signal,
                });
                setOptions(data);
                setLoading(false);
            } catch {
                if (!controller.signal.aborted) {
                    setOptions([]);
                    setLoading(false);
                }
            }
        }, DEBOUNCE_MS);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [trimmed, tooShort]);

    return (
        <Autocomplete
            sx={{ width: 360 }}
            options={options}
            loading={loading}
            value={null}
            inputValue={inputValue}
            filterOptions={(x) => x} // keep API order/results
            getOptionLabel={getLabel}
            isOptionEqualToValue={(a, b) => a.tvmaze_id === b.tvmaze_id}
            onInputChange={(_, value, reason) => {
                if (reason === "input" || reason === "clear") setInputValue(value);
            }}
            onChange={(_, selected) => {
                if (!selected) return;
                setInputValue("");
                setOptions([]);
                navigate(`/shows/${selected.tvmaze_id}`);
            }}
            noOptionsText={tooShort ? `Type ${MIN_CHARS}+ characters` : "No results"}
            renderInput={(params) => (
                <TextField
                    {...params}
                    size="small"
                    placeholder="Search shows..."
                    slotProps={{
                        ...params.slotProps,
                        input: {
                            ...params.slotProps?.input,
                            endAdornment: (
                                <>
                                    {loading && <CircularProgress color="inherit" size={16} />}
                                    {params.slotProps?.input?.endAdornment}
                                </>
                            ),
                        },
                    }}
                />
            )}
            renderOption={({ key, ...props }, option) => (
                <Box component="li" key={key} {...props} sx={{ gap: 1.5 }}>
                    <Avatar
                        src={option.image ?? undefined}
                        alt={option.name}
                        variant="rounded"
                        sx={{ width: 36, height: 52 }}
                    />
                    <Typography variant="body2">{getLabel(option)}</Typography>
                </Box>
            )}
        />
    );
}