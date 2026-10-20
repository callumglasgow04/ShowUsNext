import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import api from "../../lib/apiClient";

type ShowDetail = {
  name: string | null;
  year: string | null;
  status: string | null;
  runtime: number | null;
  genres: string[];
  summary: string | null;
  image: string | null;
  seasons: { season_number: number }[];
};

export default function ShowDetails() {
  const { showId } = useParams<{ showId: string }>();
  const [show, setShow] = useState<ShowDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setShow(null);
    setError(null);

    api
      .get<ShowDetail>(`/shows/${showId}/`, { signal: controller.signal })
      .then(({ data }) => setShow(data))
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(
          err?.response?.status === 404
            ? "Show not found."
            : "Failed to load show details."
        );
      });

    return () => controller.abort();
  }, [showId]);

  if (error) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!show) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const facts = [`${show.seasons.length} Seasons` ,show.status, show.runtime && `${show.runtime} min`].filter(Boolean) as string[];

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
      <Card sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
        {show.image && (
          <CardMedia
            component="img"
            image={show.image}
            alt={show.name ?? "Show poster"}
            sx={{ width: { xs: "100%", md: 400 }, objectFit: "cover" }}
          />
        )}
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            {show.name}
            {show.year && ` (${show.year})`}
          </Typography>

          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mb: 2 }}>
            {facts.map((f) => (
              <Chip key={f} label={f} size="small" />
            ))}
            {show.genres.map((g) => (
              <Chip key={g} label={g} size="small" variant="outlined" />
            ))}
          </Stack>

          <Typography sx={{ lineHeight: 1.7 }}>
            {show.summary ?? "No overview available."}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}